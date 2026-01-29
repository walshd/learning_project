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




