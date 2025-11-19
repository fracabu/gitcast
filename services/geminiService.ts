
import { GoogleGenAI } from "@google/genai";
import type { GitHubAnalysis, DetailedRepository } from '../types';

const formatAnalysisForPrompt = (analysis: GitHubAnalysis): string => {
  const languageEntries = Object.entries(analysis.languageDistribution)
    .sort(([, a], [, b]) => b - a)
    .map(([lang, count]) => `${lang}: ${count} repos`);

  const pinnedRepoDetails = analysis.pinnedRepos.map(repo => 
    `- ${repo.name}: ${repo.description ? 'Has description.' : 'Missing description.'} Topics: ${repo.topics.join(', ') || 'None'}.`
  ).join('\n');

  return `
    - User Name: ${analysis.userName}
    - User Bio: ${analysis.bio || 'Not provided.'}
    - Profile README: ${analysis.hasProfileReadme ? 'Exists and is set up correctly.' : 'Missing. This is a huge opportunity!'}
    - Pinned Repositories: ${analysis.pinnedRepos.length}/6 pinned.
      ${pinnedRepoDetails}
    - Repository Stats:
      - Total Repos: ${analysis.repoStats.total}
      - With a description: ${analysis.repoStats.withDescription} (${Math.round((analysis.repoStats.withDescription / (analysis.repoStats.total || 1)) * 100)}%)
      - With a license: ${analysis.repoStats.withLicense} (${Math.round((analysis.repoStats.withLicense / (analysis.repoStats.total || 1)) * 100)}%)
    - Top Languages: ${languageEntries.slice(0, 5).join('; ') || 'No languages detected.'}
    - Recent Activity Summary: ${analysis.activity}
    - Open Source Contributions (PRs to other public repos): ${analysis.osContributions}
  `;
};


export async function generatePodcastScript(analysis: GitHubAnalysis, apiKey: string): Promise<string> {
    if (!apiKey) {
        throw new Error("Gemini API key was not provided.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const analysisSummary = formatAnalysisForPrompt(analysis);

    const prompt = `
        You are "GitCast", a friendly, encouraging, and sharp AI that creates personalized mini-podcasts for GitHub users to improve their profiles. Your tone is like a helpful tech mentor: positive, clear, and actionable.

        The user's name is ${analysis.userName}.

        Based on the following analysis data, generate a podcast script. The script must be plain text only.

        **Analysis Data:**
        ${analysisSummary}

        **Podcast Script Structure:**
        1.  **Intro:** Start with a friendly, energetic greeting. Mention the user's name. Use a sound effect in brackets like [Upbeat intro music].
        2.  **Body - Strengths & Insights:** Start with the positive. Highlight 2-3 specific strengths from the analysis (e.g., "excellent open source contributions," "great profile README," "clear specialization in a language"). Then, provide insights. For example, if Python is dominant, mention their clear expertise.
        3.  **Body - Actionable Suggestions:** Gently transition to areas for improvement. Provide 2-3 specific, actionable suggestions. Instead of "add descriptions," say "Your repo 'project-A' could attract more attention with a short description." or "I noticed many repos are missing a license. Adding an MIT license is a quick way to make your code more reusable."
        4.  **Call to Action Summary:** Create a clear, numbered list of the 2-3 most important actions for the user to take this week.
        5.  **Outro:** End on a high note. Be encouraging and sign off. Use a sound effect like [Outro music fades in].

        **Constraint:** The entire output must be a single block of plain text. Do not use Markdown, JSON, or any other formatting. Just the script.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message) {
            const lowerCaseMessage = error.message.toLowerCase();
            if (lowerCaseMessage.includes('api key not valid')) {
                throw new Error("Your Gemini API Key is not valid. Please check and try again.");
            }
            if (lowerCaseMessage.includes('daily limit') || (lowerCaseMessage.includes('resource_exhausted') && lowerCaseMessage.includes('quota'))) {
                throw new Error("You've reached the daily request limit for your Gemini API Key. Please try again tomorrow.");
            }
            if (lowerCaseMessage.includes('429') || lowerCaseMessage.includes('rate limit')) {
                throw new Error("You've exceeded the API rate limit for your key. Please wait a moment and try again.");
            }
        }
        throw new Error("Failed to generate podcast script from AI. The service may be temporarily unavailable.");
    }
}

// Format repository data for AI prompt
const formatRepositoryForPrompt = (repo: DetailedRepository & Partial<DetailedRepository>): string => {
  const languageStats = repo.languages && Object.keys(repo.languages).length > 0
    ? Object.entries(repo.languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([lang, bytes]) => {
          const total = Object.values(repo.languages!).reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? ((bytes / total) * 100).toFixed(1) : '0';
          return `${lang} (${percentage}%)`;
        })
    : [];

  const readmePreview = repo.readmeContent
    ? repo.readmeContent.slice(0, 1000) + (repo.readmeContent.length > 1000 ? '...' : '')
    : 'No README available';

  return `
    Repository: ${repo.name}
    Description: ${repo.description || 'No description provided'}
    Primary Language: ${repo.language || 'Not specified'}
    Language Breakdown: ${languageStats.join(', ') || 'Not available'}

    Stats:
    - Stars: ${repo.stars}
    - Forks: ${repo.forks}
    - Open Issues: ${repo.issues}
    - Contributors: ${repo.contributors || 'Not available'}
    - Recent Commits (last 10): ${repo.recentCommits || 'Not available'}

    Additional Info:
    - License: ${repo.license || 'No license'}
    - Topics/Tags: ${repo.topics.join(', ') || 'None'}
    - Created: ${new Date(repo.createdAt).toLocaleDateString('it-IT')}
    - Last Updated: ${new Date(repo.updatedAt).toLocaleDateString('it-IT')}
    - Last Push: ${new Date(repo.pushedAt).toLocaleDateString('it-IT')}
    - Has README: ${repo.hasReadme ? 'Yes' : 'No'}
    - Homepage: ${repo.homepage || 'None'}

    README Preview:
    ${readmePreview}
  `;
};

// Generate podcast script for a single repository (max 5 minutes)
export async function generateRepositoryPodcastScript(repo: DetailedRepository, apiKey: string): Promise<string> {
  console.log('🤖 generateRepositoryPodcastScript called for:', repo.name);

  if (!apiKey) {
    throw new Error("Gemini API key was not provided.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const repoData = formatRepositoryForPrompt(repo);
  console.log('📋 Repository data formatted');

  const prompt = `
    You are "GitCast", a friendly and insightful tech podcaster who reviews GitHub repositories.
    Create a 5-minute podcast script (approximately 750-900 words) analyzing this repository.

    **Repository Data:**
    ${repoData}

    **Podcast Script Requirements:**
    1. **Length:** The script must be exactly 5 minutes when read aloud (750-900 words). This is CRITICAL.
    2. **Format:** Plain text only. No markdown, JSON, or special formatting.
    3. **Tone:** Conversational, like a tech YouTuber reviewing code - friendly, honest, insightful.

    **Structure:**
    1. **Intro (30 seconds):** Welcome + repository name + quick hook about what makes it interesting. Add [Intro music] at start.
    2. **Overview (1 minute):** What does this repo do? What problem does it solve? Main technologies used.
    3. **Deep Dive (2 minutes):**
       - Code quality observations (based on languages, structure, README quality)
       - Activity and maintenance (commits, contributors, last update)
       - Community engagement (stars, forks, issues)
       - Strengths you noticed
    4. **Constructive Feedback (1 minute):** 2-3 specific suggestions for improvement:
       - Documentation gaps
       - Missing features or best practices
       - License/topics/description improvements
       - Community building opportunities
    5. **Wrap-up (30 seconds):** Summary + who would benefit from this project. Add [Outro music] at end.

    **Important:**
    - Be specific, not generic
    - Use actual data from the repository
    - Balance praise with constructive criticism
    - Make it sound natural and conversational
    - Keep it to exactly 5 minutes (750-900 words)
  `;

  try {
    console.log('📡 Sending request to Gemini API...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 1200,
      }
    });

    console.log('✅ Gemini API response received');
    const text = response.text;
    console.log('📝 Script length:', text.length, 'characters');
    return text;
  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    if (error instanceof Error && error.message) {
      const lowerCaseMessage = error.message.toLowerCase();
      if (lowerCaseMessage.includes('api key not valid')) {
        throw new Error("Your Gemini API Key is not valid. Please check and try again.");
      }
      if (lowerCaseMessage.includes('daily limit') || (lowerCaseMessage.includes('resource_exhausted') && lowerCaseMessage.includes('quota'))) {
        throw new Error("You've reached the daily request limit for your Gemini API Key. Please try again tomorrow.");
      }
      if (lowerCaseMessage.includes('429') || lowerCaseMessage.includes('rate limit')) {
        throw new Error("You've exceeded the API rate limit for your key. Please wait a moment and try again.");
      }
    }
    throw new Error("Failed to generate podcast script from AI. The service may be temporarily unavailable.");
  }
}

// Generate presentation content for a repository
export async function generateRepositoryPresentation(repo: DetailedRepository, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("Gemini API key was not provided.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const repoData = formatRepositoryForPrompt(repo);

  const prompt = `
    Generate a comprehensive presentation about this GitHub repository in HTML slide format.

    **Repository Data:**
    ${repoData}

    **Output Requirements:**
    Return ONLY the HTML slides content (the content that goes inside the slides container).
    Each slide should be a <section> element.
    Use Tailwind CSS classes for styling (the parent will have Tailwind loaded).

    **Slide Structure (8-10 slides):**
    1. Title slide: Repository name + tagline
    2. Overview: What it does, key features
    3. Technical Stack: Languages, frameworks, tools
    4. Key Metrics: Stars, forks, contributors, activity
    5. Code Quality & Documentation
    6. Strengths & Highlights (2-3 specific points)
    7. Areas for Improvement (2-3 constructive suggestions)
    8. Community & Impact
    9. Conclusion & Recommendations

    **Styling Guidelines:**
    - Each slide: bg-slate-900 text-white p-12 min-h-screen flex flex-col justify-center
    - Headings: text-4xl font-bold mb-6
    - Subheadings: text-2xl font-semibold mb-4
    - Body text: text-lg text-slate-300
    - Use emojis sparingly for visual interest
    - Use color accents: text-blue-400, text-green-400, text-yellow-400, text-red-400

    Return ONLY the HTML for the slides (multiple <section> elements), nothing else.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 2500,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message) {
      const lowerCaseMessage = error.message.toLowerCase();
      if (lowerCaseMessage.includes('api key not valid')) {
        throw new Error("Your Gemini API Key is not valid. Please check and try again.");
      }
      if (lowerCaseMessage.includes('daily limit') || (lowerCaseMessage.includes('resource_exhausted') && lowerCaseMessage.includes('quota'))) {
        throw new Error("You've reached the daily request limit for your Gemini API Key. Please try again tomorrow.");
      }
      if (lowerCaseMessage.includes('429') || lowerCaseMessage.includes('rate limit')) {
        throw new Error("You've exceeded the API rate limit for your key. Please wait a moment and try again.");
      }
    }
    throw new Error("Failed to generate presentation from AI. The service may be temporarily unavailable.");
  }
}
