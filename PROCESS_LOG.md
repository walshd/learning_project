# Project Process Log

This document records the step-by-step process of creating and setting up this project using Antigravity.

## Step 1: Project Initialization
- **Date**: 2026-01-29
- **Action**: Created project directory at `/Users/dave/.gemini/antigravity/scratch/learning_project`.
- **Action**: Initialized local Git repository (`git init`).
- **Context**: The user requested a walkthrough of starting a project with logging.

## Step 2: GitHub Repository Setup (Pending)
- We need to determine if we can use the GitHub CLI (`gh`) or if manual setup is required.

## Step 3: Project Scoping (Defined)
- **Goal**: Build a "Career & Tech Dashboard" for new graduates.
- **Features**: 
  1. Latest AI News feed.
  2. Junior Web Developer job listings.
- **Learning Focus**: Fetching data from APIs, DOM manipulation, and modern CSS layout.

## Step 4: Connecting to GitHub

## Step 4: Connecting to GitHub
- **Date**: 2026-01-29
- **Action**: Connected local repository to remote origin: `https://github.com/walshd/learning_project.git`.
- **Action**: Pushed initial `PROCESS_LOG.md` to the `main` branch.

## Step 5: architecture Setup
- **Decision**: Start with Vanilla HTML, CSS, and JavaScript.
- **Reasoning**: This provides the clearest understanding of how the web works (DOM, network requests) without the abstraction layer of a framework like React. We can migrate to a framework later if complexity grows.
- **Action**: Creating `index.html`, `styles.css`, and `app.js`.

## Step 6: Formalizing Requirements (PDR)
- **Date**: 2026-01-29
- **Action**: Created `PDR.md` (Project Definition Record).
- **Constraint Added**: STRICT Semantic HTML. Avoid generic `<div>` tags. Use `<article>`, `<header>`, etc.
- **Constraint Confirmed**: No React/Frameworks. pure "Vanilla" web standards.
- **Next Action**: Refactor the initial prototype to adhere to the strict semantic rules defined in the PDR.

## Step 7: Semantic Refactor
- **Date**: 2026-01-29
- **Action**: Modified `index.html` to replace `<div>`s with `<article>`, `<header>`, `<ul>`, etc.
- **Action**: Updated `styles.css` to support the new semantic structure and moved the background glow to `body::after`.
- **Action**: Updated `app.js` to render list items (`<li>`) instead of generic divs.
- **Outcome**: Codebase is now compliant with PDR constraints.

## Step 8: Live Preview
- **Date**: 2026-01-29
- **Action**: Started local development server using `python3 -m http.server`.
- **URL**: `http://localhost:8080`

## Step 9: User Experience Improvements
- **Date**: 2026-01-29
- **Request**: Increase detail, restrict jobs to Manchester/Liverpool, make items clickable.
- **Action**: Updated `app.js` with richer mock data including descriptions and URLs.
- **Action**: Refined `renderItems` to wrap functionality in `<a>` tags for standard browser navigation.
- **Action**: Styled the new `.item-description` and hover states in `styles.css`.

## Step 10: Real Data Integration
- **Date**: 2026-01-29
- **Action**: Replaced mock News data with **HackerNews Algolia API**.
- **Action**: Replaced mock Jobs data with **Reed.co.uk RSS Feed** (proxied via `rss2json` to bypass CORS).
  - *Note*: This allows us to fetch real Manchester/Liverpool jobs without a backend server.
- **Action**: Implemented helpers for timestamp formatting and HTML stripping.

## Step 11: Debugging & Testing
- **Issue**: `rss2json` service returned HTTP 500 error (unreliable).
- **Test Creation**: Created `tests.html` using Mocha/Chai to verify API fixes autonomously.
- **Fix**: Switched from `rss2json` (JSON) to `allorigins.win` + `DOMParser` (XML).
  - *Update*: Reed RSS proved unstable. Switched to **Jobicy API** (JSON) for robust UK job listings.
- **Verification**: Ran `tests.html` in the browser.
  - **Result**: All tests passed (News: ✅, Jobs: ✅).

## Step 12: Deployment Readiness
- **Status**: Core features are functional and tested.
- **Next**: Ready to deploy or add "Polish" features.

## Step 13: Final Stability Fix (CORS)
- **Issue**: User reported recurring `API connection failed`. Debugging confirmed `Access-Control-Allow-Origin: null` from Jobicy when running locally.
- **Action**: Wrapped the Jobicy API call with the `allorigins.win` proxy (similar to our RSS approach).
- **Reason**: This guarantees the browser receives a valid CORS header, ensuring consistent data loading.
- **Bonus**: Added a fallback to "Demo Data" so the UI never looks broken even if the proxy fails.

## Step 14: Data Refinement (Location)
- **Request**: User noted jobs were not specific to Manchester/Liverpool.
- **Action**: Increased API fetch limit to 50 items to widen search pool.
- **Action**: Implemented strict client-side filtering to only show jobs where `location` or `description` contains "Manchester" or "Liverpool".

## Step 15: Secret Management & Reed API
- **Date**: 2026-01-29
- **Requirement**: Use official Reed API but protect the API Key.
- **Action**: Created `config.js` to hold the key (`REED_API_KEY`).
- **Security**: Added `config.js` to `.gitignore` to prevent secret leakage.
- **Implementation**: Updated `app.js` to use Basic Auth.
- **Constraint**: The Reed API likely blocks CORS. Since we have no backend, this will fail locally without a browser extension. Acknowledged this trade-off to the user.












## Step 16: Backend for CORS & Security
- **Date**: 2026-01-29
- **Issue**: Client-side fetch to Reed API blocked by CORS from localhost.
- **Action**: Created `server.mjs`, a lightweight Node.js server.
  - Serves static files (replacing Python `http.server`).
  - Provides a `/api/jobs` proxy endpoint.
  - Securely reads `REED_API_KEY` from `config.js` on the server-side, keeping it out of the browser.
- **Action**: Updated `app.js` to fetch from `/api/jobs` instead of directly hitting the Reed API.
- **Outcome**: This solves the CORS issue permanently and follows security best practices (secrets stay on the server).

## Step 17: Job Sorting Logic
- **Date**: 2026-01-29
- **Request**: User wanted Manchester/Liverpool jobs prioritised at the top, but still wanted to see others.
- **Action**: Broadened the Reed API query in `server.mjs` to fetch 50 jobs nationwide (removed `location` parameter).
- **Action**: Implemented client-side sorting in `app.js`:
  - **Priority**: Jobs with "Manchester" or "Liverpool" in the location are bumped to the top of the list.
  - **Secondary**: All other locations follow.
- **Outcome**: The dashboard now intelligently organizes data, giving local relevance while maintaining volume.

## Step 18: Version Control Checkpoint
- **Date**: 2026-01-29
- **Action**: Committed all changes (Node server, sorting logic, tests).
- **Commit Message**: `feat: add node proxy server and smart job sorting`
- **Action**: Pushed `main` branch to remote GitHub repository.
- **Status**: Local and Remote are in sync.

## Step 19: Documentation
- **Date**: 2026-01-29
- **Action**: Created `README.md`.
- **Content**: Detailed setup instructions, specifically focusing on the creation of the `config.js` file (which is gitignored) so other developers know how to run the project.
- **Goal**: Ensure the project is reproducible and the API key requirement is transparent.

## Step 20: Documentation Sync
- **Date**: 2026-01-29
- **Action**: Committed `README.md` and updated process logs.
- **Action**: Pushed documentation updates to GitHub.
- **Status**: Visual Studio Code / Project is fully documented and synced.

## Phase 2: Polish & Functionality

## Step 21: UI Polish Plan
- **Date**: 2026-01-29
- **Goal**: Implement "Premium" feel and User Personalization.
- **Task 1 (Visuals)**: Replace text-based loading states with **Skeleton Screens** (Shimmer effects).
- **Task 2 (Visuals)**: Enhance card interactions (hover lift, smooth transitions).
- **Task 3 (Feature)**: Implement **"Save Job"** functionality using `localStorage`.

## Step 22: Skeleton Screens Implementation
- **Date**: 2026-01-29
- **Action**: Modified `styles.css` to include specific Skeleton Loading animations (shimmer effect).
- **Action**: Updated `index.html` to use the static skeleton markup instead of a simple spinner, ensuring immediate visual feedback.
- **Verification**: Browser subagent captured the transition from Skeleton state to Loaded state. The app now feels faster and more polished.

## Step 23: Version Control Checkpoint
- **Date**: 2026-01-29
- **Action**: Committed and pushed UI Skeleton changes.
- **Commit Message**: `feat: implement skeleton loading screens for better UX`
- **Status**: Visual polish phase backed up.

## Step 24: Save Job Feature
- **Date**: 2026-01-29
- **Action**: Implemented `localStorage` based job saving.
- **Action**: Added Bookmark/Save icon to Job Cards in `app.js`.
- **Action**: Added CSS for the save button including hover states and active "filled" state.
- **Verification**: Verified that clicking the button toggles the state and that the state persists after page reload.

## Step 25: Saved Jobs View (Start)
- **Date**: 2026-01-29
- **Goal**: Create a dedicated view for saved jobs.
- **Refactor**: Will update `localStorage` schema to store full job objects instead of just URLs, enabling offline/instant rendering of saved items.
- **UI**: Add "Saved" tab to the main navigation.

## Step 26: Persistence & Bug Fixes
- **Date**: 2026-01-29
- **Actions**:
  1. **Persistence**: Moved from `localStorage` to **Server-Side JSON Persistence**.
     - Created `saved_jobs.json`.
     - Added `/api/saved-jobs` endpoint to `server.mjs` (GET/POST).
     - Updated `app.js` to sync with the server.
  2. **Bug Fix (News Feed)**: Fixed a race condition where the news list would load and then immediately clear itself due to a logic error in `fetchNews` and `renderItems`.
  3. **Bug Fix (Stability)**: Improved error handling in `fetchJobs` and `fetchNews` to prevent app crashing on partial failures.

## Step 27: News Feed Pagination
- **Date**: 2026-01-29
- **Request**: User wanted more news items and a way to load them incrementally.
- **Action**: Increased initial News load from 6 to 10 items.
- **Action**: Implemented **"Load More"** button for the News Feed.
  - Fetches 5 additional items per click.
  - Appends seamlessly to the existing list.
- **Action**: Verified functionality via browser automation.

## Step 28: Git Hygiene
- **Action**: Added `saved_jobs.json` to `.gitignore` to ensure the local database is not committed to the repo.
- **Action**: Committed all changes.
- **Commit Message**: `feat: Add saved jobs persistence, fix news feed, and add pagination`.
