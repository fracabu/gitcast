# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitCast is a GitHub Repository Analyzer - a React application that displays all user repositories as cards and generates AI-powered content for each repository:
- **Podcast Audio**: 5-minute spoken analysis using Web Speech API
- **Presentation Slides**: Interactive HTML slides with detailed insights

## Development Commands

### Setup
```bash
npm install
```

Set `GEMINI_API_KEY` in `.env.local` before running.

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm preview
```

## Architecture

### Data Flow
1. **User Input** (TokenInput) → GitHub token + Gemini API key
2. **Repository Loading** (githubService.getRepositoryList) → Fetches all repos with detailed metadata
3. **Repository Grid** (RepoGrid) → Displays repository cards with filters
4. **Per-Repository Actions**:
   - **Podcast**: Generate script → Play with Web Speech API
   - **Presentation**: Generate HTML slides → Display in fullscreen viewer

### Core Services

**services/githubService.ts**
- `getRepositoryList()`: Main function that fetches all repositories with details
- `getRepositoryDetails()`: Helper that fetches per-repo metadata:
  - Languages breakdown (bytes per language)
  - Recent commits (last 10)
  - Contributors count
  - README content (base64 decoded)
- Uses GitHub REST API for all data fetching
- Returns `RepositoryListData` with array of `DetailedRepository` objects

**services/geminiService.ts**
- `generateRepositoryPodcastScript()`: Creates 5-minute podcast script for single repository
  - Target: 750-900 words for exactly 5 minutes when read aloud
  - Conversational tone, like tech YouTuber review
  - Analyzes code quality, activity, community, provides constructive feedback
- `generateRepositoryPresentation()`: Generates HTML slides (8-10 slides)
  - Returns `<section>` elements styled with Tailwind CSS
  - Covers: overview, tech stack, metrics, strengths, improvements
- Uses Google Gemini AI (`gemini-2.5-flash`)
- Handles API errors (invalid key, rate limits, quotas)

**services/ttsService.ts**
- Wraps Web Speech API for text-to-speech
- `speak()`: Converts text to audio with configurable rate/pitch/volume
- `pause()`, `resume()`, `stop()`: Playback controls
- `getVoices()`: Returns available voices (Italian/English)
- Note: Cannot save audio to file (browser limitation)

### State Management

**App.tsx** manages global state:
- `AppState` enum: IDLE → LOADING → REPO_LIST
- State variables:
  - `repoData`: All repositories with metadata
  - `githubToken`, `geminiKey`: Stored for later API calls
  - `showPodcastPlayer`, `showPresentation`: Modal visibility
  - `currentRepository`: Repository being analyzed
- Main handlers:
  - `handleAnalyze()`: Loads all repositories
  - `handleGeneratePodcast()`: Creates podcast for single repo
  - `handleGeneratePresentation()`: Creates slides for single repo
  - `handleReset()`: Returns to login screen

### Type System

**types.ts** defines the core data structures:
- `AppState`: IDLE, LOADING, REPO_LIST, RESULT, ERROR
- `DetailedRepository`: Complete repository metadata including:
  - Basic info (name, description, language, stars, forks)
  - Code analysis (languages breakdown, contributors, commits)
  - Content (README, license, topics)
- `RepositoryListData`: User name + array of DetailedRepository
- Legacy types still present for backward compatibility

### UI Components

**RepoCard**: Displays single repository as card
- Shows stats (stars, forks, issues, contributors)
- Language indicator with color coding
- Topics as pills
- Two action buttons: "Genera Podcast" and "Genera Presentazione"

**RepoGrid**: Container for repository cards
- Search filter (by name/description)
- Language filter dropdown
- Responsive grid layout (1-3 columns)

**PodcastAudioPlayer**: Modal for podcast playback
- Visual progress bar tracking speech position
- Play/Pause/Stop controls using Web Speech API
- Displays script with current word highlighting
- Estimated duration calculation

**PresentationViewer**: Fullscreen slide viewer
- Keyboard navigation (←/→ arrows, ESC to close)
- Slide counter and navigation dots
- HTML slides rendered with dangerouslySetInnerHTML
- Parses `<section>` elements from AI-generated HTML

### Environment Variables

Vite config defines process.env variables:
- `GEMINI_API_KEY`: Loaded from `.env.local`

### Path Aliases

`@/*` alias points to project root.

## Key Implementation Details

- **React 19**: Latest React with StrictMode
- **TypeScript**: Strict mode with comprehensive linting
- **API Integration**:
  - GitHub: Bearer token auth, fetches up to 100 repos
  - Gemini: `@google/genai` SDK, temperature 0.7-0.8
  - Web Speech API: Browser native TTS (no download capability)
- **Error Handling**: Try-catch in services, alerts for per-repo failures
- **Modal Management**: Controlled by boolean flags in App.tsx
- **Performance**: Parallel API calls with Promise.all for repo details
- **No Routing**: Single-page app, state-based view switching
