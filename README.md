# DevDash 🚀

A streamlined, browser-based dashboard designed for Junior Web Developers. DevDash aggregates the latest AI news from HackerNews and curates entry-level job opportunities from Reed.co.uk, verifying local results for Manchester and Liverpool.

## Features
- **Live AI News**: Real-time feed from HackerNews.
- **Job Tracker**: Junior web developer roles, intelligently sorted to prioritize local hubs (Manchester/Liverpool) while keeping nationwide visibility.
- **Privacy First**: No external tracking; API keys are handled server-side.
- **Vanilla Web**: Built with pure HTML, CSS, and JavaScript. No build steps required.

## Prerequisites
- **Node.js** (v16 or higher) - Required for the local proxy server.
- **Reed.co.uk API Key** - You can sign up for free [here](https://www.reed.co.uk/developers/Jobseeker).

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/walshd/learning_project.git
   cd learning_project
   ```

2. **Configure API Keys**
   This project checks for a `config.js` file to load your API key securely. This file is ignored by Git to protect your secrets.

   Create a file named `config.js` in the root directory:
   ```javascript
   // config.js
   export const REED_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

3. **Start the Server**
   We use a lightweight Node.js server to handle API requests and bypass CORS restrictions.
   ```bash
   node server.mjs
   ```

4. **Launch**
   Open your browser and navigate to:
   [http://localhost:8080](http://localhost:8080)

## Running Tests
To verify the API connections and sorting logic:
1. Ensure the server is running.
2. Visit [http://localhost:8080/tests.html](http://localhost:8080/tests.html).

## Project Structure
- `server.mjs`: Node.js proxy server (handles CORS and API Auth).
- `app.js`: Main client-side logic (fetching, sorting, rendering).
- `styles.css`: Custom CSS variables and layout.
- `PROCESS_LOG.md`: A dev diary of the build process.
