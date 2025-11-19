# GitCast - GitHub Repository Analyzer

Analyze your GitHub repositories and generate AI-powered podcasts and presentations for each one.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   GITHUB_TOKEN=your_github_token_here
   ```

   - **GEMINI_API_KEY**: Get from [Google AI Studio](https://ai.google.dev/makersuite)
   - **GITHUB_TOKEN**: Get from [GitHub Tokens](https://github.com/settings/tokens?type=beta) (select `repo` and `read:user` scopes)

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open browser at http://localhost:5174

## Features

- 📊 View all your repositories in a grid with filters
- 🎙️ Generate 5-minute AI podcast for each repository (spoken via Web Speech API)
- 📈 Generate interactive HTML presentation slides for each repository
- 🔍 Search and filter by language
- ⚡ Fast loading with lazy on-demand details fetching
