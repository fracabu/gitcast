
export enum AppState {
  IDLE,
  LOADING,
  REPO_LIST,
  RESULT,
  ERROR,
}

export interface GitHubAnalysis {
  userName: string;
  hasProfileReadme: boolean;
  pinnedRepos: {
    name: string;
    description: string | null;
    topics: string[];
  }[];
  repoStats: {
    total: number;
    withDescription: number;
    withLicense: number;
  };
  languageDistribution: { [key: string]: number };
  activity: string; // e.g. "Consistent", "Sporadic"
  osContributions: number;
  bio: string | null;
}

// Interfaces for GitHub API responses to ensure type safety
export interface GitHubUser {
  login: string;
  bio: string | null;
  name: string | null;
}

export interface PinnedRepoGQLResponse {
  data: {
    user: {
      pinnedItems: {
        nodes: {
          name: string;
          description: string | null;
          repositoryTopics: {
            nodes: {
              topic: {
                name: string;
              };
            }[];
          };
        }[];
      };
    };
  };
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  license: {
    spdx_id: string;
  } | null;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  created_at: string;
  updated_at: string;
  homepage: string | null;
  topics: string[];
  default_branch: string;
}

export interface GitHubSearchResponse {
  total_count: number;
}

// New types for detailed repository analysis
export interface DetailedRepository {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  issues: number;
  license: string | null;
  topics: string[];
  url: string;
  homepage: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  hasReadme: boolean;
  readmeContent?: string;
  languages: { [key: string]: number };
  recentCommits: number;
  contributors: number;
  defaultBranch: string;
}

export interface RepositoryListData {
  userName: string;
  userLogin: string; // GitHub username (without spaces)
  repositories: DetailedRepository[];
}
