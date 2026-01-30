async function init() {
    initClock();

    const newsContainer = document.getElementById('news-feed');
    const jobsContainer = document.getElementById('jobs-feed');

    // Global cache for saved jobs
    window.savedJobsCache = [];
    window.currentNewsPage = 0; // Track news pagination

    // Fetch all data in parallel
    const [news, jobs, saved] = await Promise.all([
        fetchNews(0, 10), // Fetch 10 news items initially
        fetchJobs(),
        fetchSavedJobs()
    ]);
    
    window.savedJobsCache = saved;

    // Confirm data exists
    renderItems(newsContainer, news, 'news');
    // Initial render jobs
    // Note: jobs are already rendered inside fetchJobs? 
    // Wait, fetchJobs returns data but also calls renderItems inside itself (line 159). 
    // We can just rely on that OR explicit render.
    // However, to be safe and use our new data structure:
    renderSkillPulse(jobs);

    setupLoadMoreNews(newsContainer);
    const btnLatest = document.getElementById('btn-latest');
    const btnSaved = document.getElementById('btn-saved');

    if (btnLatest && btnSaved) {
        btnLatest.addEventListener('click', () => {
            btnLatest.classList.add('active');
            btnLatest.setAttribute('aria-pressed', 'true');
            btnSaved.classList.remove('active');
            btnSaved.setAttribute('aria-pressed', 'false');
            
            // Reset Header
            const header = document.getElementById('job-section-header');
            if(header) header.textContent = 'Junior Dev Jobs';
            
            // Re-render latest jobs
            renderItems(jobsContainer, jobs, 'job');
        });

        btnSaved.addEventListener('click', async () => {
            btnSaved.classList.add('active');
            btnSaved.setAttribute('aria-pressed', 'true');
            btnLatest.classList.remove('active');
            btnLatest.setAttribute('aria-pressed', 'false');
            
            await renderSavedView();
        });
    }
}

// Main Application Logic
// Initialize the dashboard ONLY if not running in a test environment
if (typeof window !== 'undefined' && !window.IS_TEST_MODE) {
    document.addEventListener('DOMContentLoaded', init);
}

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
async function fetchNews(page = 0, limit = 10) {
    const container = document.getElementById('news-feed');
    // We search for "AI" stories
    const API_URL = `https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=${limit}&page=${page}`;
    
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

        return newsData; // Return data, don't render internally
    } catch (error) {
        console.error('Error fetching news:', error);
        container.innerHTML = '<li class="loading-state"><p>Failed to load news. Check console.</p></li>';
        return [];
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
            fullDescription: stripHtml(item.jobDescription), // Keep full text for analysis
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
        return [];
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

// 4. Persistence Logic
async function fetchSavedJobs() {
    try {
        const response = await fetch('/api/saved-jobs');
        if (!response.ok) throw new Error('Failed to fetch saved jobs');
        const data = await response.json();
        return data || [];
    } catch (e) {
        console.error("Error loading saved jobs:", e);
        return [];
    }
}

async function saveJobsToServer(jobs) {
    try {
        await fetch('/api/saved-jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobs)
        });
    } catch (e) {
        console.error("Error saving jobs:", e);
    }
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
function renderItems(container, items, type, append = false) {
    if (!container) return;
    
    if (!append) {
        container.innerHTML = ''; // Clear only if not appending
    }
    
    if (!items || !Array.isArray(items)) {
        console.warn('renderItems called with invalid items:', items);
        return;
    }
    
    // Load saved jobs from local cache
    const savedJobs = window.savedJobsCache || [];

    items.forEach(item => {
        // Create <li> for semantic list
        const li = document.createElement('li');
        li.className = `${type}-item-wrapper`;
        
        let metaHtml = '';
        let actionHtml = '';

        if (type === 'news') {
            metaHtml = `<span>${item.source}</span><span>•</span><span>${item.time}</span>`;
        } else {
            // Job Specific Logic
            metaHtml = `<span>${item.company}</span><span>•</span><span>${item.location}</span>`;
            
            // Check if saved (compare by URL)
            const isSaved = savedJobs.some(job => job.url === item.url);
            const btnClass = isSaved ? 'save-btn saved' : 'save-btn';
            const btnLabel = isSaved ? 'Unsave Job' : 'Save Job';
            
            // Add Save Button
            actionHtml = `
                <button class="${btnClass}" aria-label="${btnLabel}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            `;
        }

        // Wrap in anchor tag for clickability
        li.innerHTML = `
            <article class="card-content">
                ${actionHtml}
                <a href="${item.url}" target="_blank" class="card-link" aria-label="Read more about ${item.title}">
                    <strong class="item-title">${item.title}</strong>
                    <div class="item-meta">${metaHtml}</div>
                    <p class="item-description">${item.description}</p>
                </a>
            </article>
        `;
        
        container.appendChild(li);

        // Attach event listener for Save button if it exists
        if (type === 'job') {
            const btn = li.querySelector('.save-btn');
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent link navigation
                e.stopPropagation(); // Stop bubbling
                toggleSave(item, btn);
            });
        }
    });

    // Handle Empty State
    if (items.length === 0 && !append) {
        const emptyMsg = type === 'news' ? 'No news found.' : 'No jobs found.';
        container.innerHTML = `<li class="empty-state">${emptyMsg}</li>`;
    }
}

function toggleSave(item, btn) {
    let savedJobs = window.savedJobsCache || [];
    
    // Check if job is already saved
    const index = savedJobs.findIndex(job => job.url === item.url);
    
    if (index !== -1) {
        // Remove functionality
        savedJobs.splice(index, 1);
        btn.classList.remove('saved');
        btn.setAttribute('aria-label', 'Save Job');
    } else {
        // Add functionality
        // Ensure we only save relevant fields to save space
        const jobToSave = {
            url: item.url,
            title: item.title,
            company: item.company,
            location: item.location,
            description: item.description,
            date: new Date().toISOString() // Track when it was saved
        };
        savedJobs.push(jobToSave);
        btn.classList.add('saved');
        btn.setAttribute('aria-label', 'Unsave Job');
    }
    
    // Update Global Cache & Server
    window.savedJobsCache = savedJobs;
    saveJobsToServer(savedJobs);
}

// Function to render saved view
async function renderSavedView() {
    const jobList = document.getElementById('jobs-feed');
    // Ensure we have latest data
    window.savedJobsCache = await fetchSavedJobs();
    const savedJobs = window.savedJobsCache;
    
    // Update Header Text to context
    const header = document.getElementById('job-section-header');
    if(header) header.textContent = 'Saved Jobs';

    renderItems(jobList, savedJobs, 'job');
}

function setupLoadMoreNews(container) {
    // Create wrapper for button
    const wrapper = document.createElement('div');
    wrapper.className = 'load-more-wrapper';

    const btn = document.createElement('button');
    btn.className = 'btn-load-more';
    btn.textContent = 'Load More News';
    
    wrapper.appendChild(btn);
    // Insert after the UL container (which is 'container')
    // The container is the UL. We want to append the button AFTER the UL.
    container.parentNode.appendChild(wrapper);

    btn.addEventListener('click', async () => {
        const originalText = btn.textContent;
        btn.textContent = 'Loading...';
        btn.disabled = true;
        
        try {
            // Logic for next page
            // We started with page 0 (limit 10).
            // This consumed "logical pages" 0 and 1 (if we think in 5s)
            // Or just: page 0 (size 10).
            // Next request: we want 5 items.
            // If we switch to hitsPerPage=5.
            // Page 0 = 0-4. Page 1 = 5-9. Page 2 = 10-14.
            // Since we have items 0-9. We need page 2.
            
            let nextPage = 2; // Default start after 10 items
            if (window.currentNewsPage) {
                 nextPage = window.currentNewsPage + 1;
            } else {
                 // First load more click
                 window.currentNewsPage = 2;
                 nextPage = 2;
            }

            const newItems = await fetchNews(nextPage, 5);
            
            if (newItems.length > 0) {
                renderItems(container, newItems, 'news', true);
                window.currentNewsPage = nextPage;
                btn.textContent = 'Load More News';
                btn.disabled = false;
            } else {
                btn.textContent = 'No more news';
                // keep disabled
            }
        } catch (e) {
            console.error(e);
            btn.textContent = 'Error loading';
            btn.disabled = false;
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    });
}

function renderSkillPulse(jobs) {
    const container = document.getElementById('skill-pulse-container');
    if (!container) return;

    // Define keywords to look for (could be expanded)
    const keywords = [
        'React', 'Node', 'Python', 'TypeScript', 'JavaScript', 
        'Java', 'AWS', 'Docker', 'SQL', 'PHP', 'C#', 'Vue', 'Angular', 'Go', 'Rust'
    ];
    
    // Count frequencies
    const counts = {};
    keywords.forEach(k => counts[k] = 0);
    
    // Normalize text for closer matching
    const allText = jobs.map(j => (j.title + ' ' + (j.fullDescription || j.description)).toLowerCase()).join(' ');
    
    keywords.forEach(word => {
        // Simple regex to match whole words, case-insensitive
        const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'g');
        const matches = allText.match(regex);
        if (matches) {
            counts[word] = matches.length;
        }
    });
    
    // Sort and get Top 5
    const topSkills = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .filter(item => item[1] > 0); // Only positive counts

    // Render
    if (topSkills.length === 0) {
        container.innerHTML = '<span class="loading-pulse">No skills trending yet.</span>';
        return;
    }

    container.innerHTML = topSkills.map(([skill, count]) => `
        <div class="skill-tag">
            ${skill}
            <span class="skill-count">${count}</span>
        </div>
    `).join('');
}
