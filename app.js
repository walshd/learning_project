// Main Application Logic

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    fetchNews();
    fetchJobs();
});

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

// 2. Fetch AI News (Mock Data for now)
async function fetchNews() {
    const container = document.getElementById('news-feed');
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    
    // Mock Data
    const newsData = [
        { title: "OpenAI releases new reasoning model", source: "TechCrunch", time: "2h ago" },
        { title: "DeepMind solves 50-year-old math problem", source: "Nature", time: "5h ago" },
        { title: "The State of AI in 2026", source: "The Verge", time: "1d ago" },
        { title: "New Transformer architecture efficient enough for mobile", source: "ArXiv", time: "1d ago" }
    ];

    renderItems(container, newsData, 'news');
}

// 3. Fetch Jobs (Mock Data for now)
async function fetchJobs() {
    const container = document.getElementById('jobs-feed');
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    
    // Mock Data
    const jobsData = [
        { title: "Junior Frontend Developer", company: "Vercel", location: "Remote" },
        { title: "React Developer (Entry Level)", company: "Spotify", location: "New York, NY" },
        { title: "Web Technologist Associate", company: "BBC", location: "London, UK" },
    ];

    renderItems(container, jobsData, 'job');
}

// Helper: Render items to DOM
function renderItems(container, items, type) {
    container.innerHTML = ''; // Clear loading state
    
    items.forEach(item => {
        // Create <li> instead of <div> for semantic lists
        const li = document.createElement('li');
        li.className = `${type}-item`;
        
        let metaHtml = '';
        if (type === 'news') {
            metaHtml = `<span>${item.source}</span><span>•</span><span>${item.time}</span>`;
        } else {
            metaHtml = `<span>${item.company}</span><span>•</span><span>${item.location}</span>`;
        }

        // Use standard heading for title if appropriate, or strong text
        li.innerHTML = `
            <strong class="item-title">${item.title}</strong>
            <div class="item-meta">${metaHtml}</div>
        `;
        
        container.appendChild(li);
    });
}
