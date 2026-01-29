// Main Application Logic

// Initialize the dashboard ONLY if not running in a test environment
if (typeof window !== 'undefined' && !window.IS_TEST_MODE) {
    document.addEventListener('DOMContentLoaded', () => {
        initClock();
        fetchNews();
        fetchJobs();
    });
}

// Export functions for testing
export { initClock, fetchNews, fetchJobs, renderItems };

// 1. Clock Functionality
function initClock() {
    const timeDisplay = document.getElementById('current-time');
    
    const updateTime = () => {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };
    
    updateTime(); // Run immediately
    setInterval(updateTime, 1000); // Update every second
}

// 2. Fetch AI News (Real Data via HackerNews/Algolia)
async function fetchNews() {
    const container = document.getElementById('news-feed');
    const API_URL = 'https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=6';
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        const newsData = data.hits.map(hit => ({
            title: hit.title,
            source: 'Hacker News', // HN doesn't always give clean source names, using platform name
            time: getRelativeTime(new Date(hit.created_at)),
            url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            description: `Discussion by ${hit.author} • ${hit.points || 0} points`
        }));

        renderItems(container, newsData, 'news');
    } catch (error) {
        console.error('Error fetching news:', error);
        container.innerHTML = '<li class="loading-state"><p>Failed to load news. Check console.</p></li>';
    }
}

// Import API Key (Note: this might fail if file doesn't exist, we handle that)
let REED_API_KEY = '';
try {
    const config = await import('./config.js');
    REED_API_KEY = config.REED_API_KEY;
} catch (e) {
    console.warn('config.js not found. Reed API will not work without a key.');
}

// 3. Fetch Jobs (Via Local Proxy)
// The server.mjs proxy handles the API Key and CORS.
async function fetchJobs() {
    const container = document.getElementById('jobs-feed');
    
    // We now fetch from our own local server endpoint
    const API_URL = '/api/jobs';
    
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Server Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error("No jobs found via Proxy");
        }


        const jobsData = data.results.map(item => ({
            title: item.jobTitle,
            company: item.employerName,
            location: item.locationName,
            url: item.jobUrl,
            description: stripHtml(item.jobDescription).substring(0, 100) + "..."
        }));

        // Sort: Manchester/Liverpool first, then others
        jobsData.sort((a, b) => {
            const isPriorityA = /manchester|liverpool/i.test(a.location);
            const isPriorityB = /manchester|liverpool/i.test(b.location);
            
            // If A is priority and B is not, A comes first (-1)
            if (isPriorityA && !isPriorityB) return -1;
            // If B is priority and A is not, B comes first (1)
            if (!isPriorityA && isPriorityB) return 1;
            // Otherwise keep original order
            return 0;
        });

        // Limit to 10 items for display
        const displayJobs = jobsData.slice(0, 10);

        renderItems(container, displayJobs, 'job');
        return displayJobs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        if (container) {
             container.innerHTML = `<li class="loading-state"><p>Unable to load jobs.<br><small>${error.message}</small></p></li>`;
        }
        throw error;
    }
}

// Helper: Relative Time
function getRelativeTime(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

// Helper: Strip HTML from RSS descriptions
function stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    let text = tmp.textContent || tmp.innerText || "";
    // Limit length
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
}

// Helper: Render items to DOM
function renderItems(container, items, type) {
    container.innerHTML = ''; // Clear loading state
    
    items.forEach(item => {
        // Create <li> for semantic list
        const li = document.createElement('li');
        li.className = `${type}-item-wrapper`;
        
        let metaHtml = '';
        if (type === 'news') {
            metaHtml = `<span>${item.source}</span><span>•</span><span>${item.time}</span>`;
        } else {
            metaHtml = `<span>${item.company}</span><span>•</span><span>${item.location}</span>`;
        }

        // Wrap in anchor tag for clickability
        // Added description paragraph
        li.innerHTML = `
            <a href="${item.url}" target="_blank" class="card-link" aria-label="Read more about ${item.title}">
                <article>
                    <strong class="item-title">${item.title}</strong>
                    <div class="item-meta">${metaHtml}</div>
                    <p class="item-description">${item.description}</p>
                </article>
            </a>
        `;
        
        container.appendChild(li);
    });
}
