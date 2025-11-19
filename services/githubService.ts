
import type { GitHubAnalysis, GitHubUser, PinnedRepoGQLResponse, GitHubRepo, GitHubSearchResponse, DetailedRepository, RepositoryListData } from '../types';

const GITHUB_API_URL = 'https://api.github.com';

async function githubApiFetch<T,>(endpoint: string, token: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid GitHub Personal Access Token. Please check your token and permissions.');
    }
    if (response.status === 403) {
        const rateLimitReset = response.headers.get('x-ratelimit-reset');
        const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString() : 'later';
        throw new Error(`GitHub API rate limit exceeded. Please try again ${resetTime}.`);
    }
    const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
    throw new Error(`GitHub API Error (${response.status}): ${errorData.message || 'An unexpected error occurred.'}`);
  }

  // Handle cases like 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

const getPinnedRepos = async (username: string, token: string): Promise<PinnedRepoGQLResponse['data']['user']['pinnedItems']['nodes']> => {
  const query = `
    query($username: String!) {
      user(login: $username) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              repositoryTopics(first: 5) {
                nodes {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const response = await githubApiFetch<PinnedRepoGQLResponse>('/graphql', token, {
    method: 'POST',
    body: JSON.stringify({ query, variables: { username } }),
  });
  return response.data.user.pinnedItems.nodes;
};

const hasProfileReadme = async (username: string, token: string): Promise<boolean> => {
  try {
    // A successful response means the repo exists
    await githubApiFetch(`/repos/${username}/${username}`, token);
    return true;
  } catch (error: any) {
    // A 404 is the expected "error" if it doesn't exist
    if (error.message.includes('404')) {
      return false;
    }
    // Re-throw other errors
    throw error;
  }
};

const getOSContributions = async (username: string, token: string): Promise<number> => {
    const response = await githubApiFetch<GitHubSearchResponse>(`/search/issues?q=is:pr+author:${username}+-user:${username}+is:public&per_page=1`, token);
    return response.total_count;
};

const analyzeActivity = (repos: GitHubRepo[]): string => {
    if (repos.length === 0) return "No recent activity found.";
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

    const recentPushes = repos.filter(repo => new Date(repo.pushed_at) > threeMonthsAgo);
    
    if(recentPushes.length === 0) return "Activity has been low in the past 3 months.";
    
    const veryRecentPushes = repos.filter(repo => new Date(repo.pushed_at) > oneMonthAgo);

    if(veryRecentPushes.length > repos.length / 2 && veryRecentPushes.length > 5) {
        return "Excellent! Activity has been very consistent and recent.";
    }
    if(recentPushes.length > 3) {
        return "Good! There's consistent activity over the last few months.";
    }
    return "Activity seems a bit sporadic. There have been some updates in the last 3 months.";
}

export async function analyzeProfile(token: string): Promise<GitHubAnalysis> {
  const user = await githubApiFetch<GitHubUser>('/user', token);
  const username = user.login;

  const [pinnedItems, profileReadmeExists, osContributionsCount, allRepos] = await Promise.all([
    getPinnedRepos(username, token),
    hasProfileReadme(username, token),
    getOSContributions(username, token),
    githubApiFetch<GitHubRepo[]>(`/users/${username}/repos?type=owner&sort=pushed&per_page=100`, token)
  ]);

  const pinnedRepos = pinnedItems.map(repo => ({
    name: repo.name,
    description: repo.description,
    topics: repo.repositoryTopics.nodes.map(node => node.topic.name),
  }));

  const repoStats = {
    total: allRepos.length,
    withDescription: allRepos.filter(repo => repo.description).length,
    withLicense: allRepos.filter(repo => repo.license).length,
  };

  const languageDistribution: { [key: string]: number } = {};
  allRepos.forEach(repo => {
    if (repo.language) {
      languageDistribution[repo.language] = (languageDistribution[repo.language] || 0) + 1;
    }
  });

  const activity = analyzeActivity(allRepos);

  return {
    userName: user.name || username,
    bio: user.bio,
    hasProfileReadme: profileReadmeExists,
    pinnedRepos,
    repoStats,
    languageDistribution,
    activity,
    osContributions: osContributionsCount,
  };
}

// Helper to process array in batches
async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    // Small delay between batches to avoid overwhelming the API
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  return results;
}

// Fetch detailed repository information (called lazily, not upfront)
export async function getRepositoryDetails(username: string, repoName: string, token: string): Promise<Partial<DetailedRepository>> {
  try {
    const [languages, commits, contributors, readme] = await Promise.all([
      githubApiFetch<{ [key: string]: number }>(`/repos/${username}/${repoName}/languages`, token).catch(() => ({})),
      githubApiFetch<any[]>(`/repos/${username}/${repoName}/commits?per_page=10`, token).catch(() => []),
      githubApiFetch<any[]>(`/repos/${username}/${repoName}/contributors?per_page=100`, token).catch(() => []),
      githubApiFetch<{ content: string }>(`/repos/${username}/${repoName}/readme`, token).catch(() => null),
    ]);

    return {
      languages,
      recentCommits: commits.length,
      contributors: contributors.length,
      hasReadme: readme !== null,
      readmeContent: readme ? atob(readme.content) : undefined,
    };
  } catch (error) {
    console.warn(`Failed to fetch details for ${repoName}:`, error);
    return {
      languages: {},
      recentCommits: 0,
      contributors: 0,
      hasReadme: false,
    };
  }
}

export async function getRepositoryList(token: string): Promise<RepositoryListData> {
  const user = await githubApiFetch<GitHubUser>('/user', token);
  const username = user.login;

  // Get all repositories (up to 100)
  const repos = await githubApiFetch<GitHubRepo[]>(
    `/users/${username}/repos?type=owner&sort=pushed&per_page=100`,
    token
  );

  // Create basic repository objects WITHOUT fetching detailed info
  // Details will be fetched on-demand when user generates podcast/presentation
  const detailedRepos: DetailedRepository[] = repos.map(repo => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    issues: repo.open_issues_count,
    license: repo.license?.spdx_id || null,
    topics: repo.topics || [],
    url: repo.html_url,
    homepage: repo.homepage,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    defaultBranch: repo.default_branch,
    // These will be populated on-demand
    hasReadme: false,
    readmeContent: undefined,
    languages: {},
    recentCommits: 0,
    contributors: 0,
  }));

  return {
    userName: user.name || username,
    userLogin: username, // This is the actual GitHub login (no spaces)
    repositories: detailedRepos,
  };
}
