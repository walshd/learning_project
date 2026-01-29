# Project Definition Record (PDR) - DevDash

## 1. Project Overview
**DevDash** is a browser-based dashboard designed specifically for Junior Web Developers and new graduates. It aggregates relevant industry news (AI & Tech) and entry-level job opportunities into a single, aesthetically pleasing interface.

## 2. Core Philosophy
- **"The Web is the Platform"**: We rely on standard web technologies (HTML/CSS/JS) without build steps or frameworks.
- **Accessibility First**: Semantic HTML is used not just for code cleanliness, but to ensure screen readers and assistive technologies work natively.
- **Performance**: No heavy bundles. The application should load instantly.

## 3. Technical Constraints & Requirements

### 3.1 Technology Stack
- **HTML5**: Strictly semantic.
  - **Rule**: Avoid `<div>` tags unless absolutely necessary for styling hooks where no semantic tag exists.
  - **Preferred Tags**: `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<aside>`, `<nav>`, `<time>`, `<figure>`, `<dialog>`.
- **CSS3**: Modern Vanilla CSS.
  - **Features**: CSS Grid/Flexbox for layout, CSS Variables for theming, CSS Nesting (if supported) or clean heirarchy.
  - **Aesthetics**: Dark mode, glassmorphism, fluid typography.
- **JavaScript**: Vanilla ES6+.
  - **Modules**: Use ES Modules (`type="module"`) to keep code organized.
  - **No Frameworks**: No React, Vue, Svelte, or jQuery.

### 3.2 Key Features (MVP)
1.  **Live Clock**: Displays local time to welcome the user.
2.  **AI News Feed**: Fetches latest headlines relevant to AI and Code.
3.  **Job Tracker**: Filters for "Junior", "Graduate", or "Entry Level" web dev roles.

## 4. Architecture
- **Data Source**: initially mock data, later transitioning to public APIs (e.g., HackerNews API, GitHub Jobs proxy).
- **State Management**: Simple in-memory objects or `localStorage` for preferences.

## 5. Success Criteria
- The codebase passes a semantic HTML validator with high scores.
- Zero build tools required to run (just a static file server).
