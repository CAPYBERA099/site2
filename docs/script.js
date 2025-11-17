// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Download button click handler
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        // Add loading state
        this.classList.add('loading');
        this.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            Загрузка...
        `;
        
        // Remove loading state after download starts
        setTimeout(() => {
            this.classList.remove('loading');
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Скачать установщик
            `;
        }, 2000);
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 11, 15, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 11, 15, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 500;
    }
});

// Add CSS for spinning animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spinning {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);

// Get latest version from GitHub releases
async function getLatestVersion() {
    try {
        const response = await fetch('https://api.github.com/repos/CAPYBERA099/WenzInjector-ROBLOX/releases/latest');
        if (!response.ok) {
            throw new Error('Failed to fetch release info');
        }
        
        const data = await response.json();
        const version = data.tag_name || data.name || 'v1.0.0';
        
        // Remove 'v' prefix if present and clean version
        let cleanVersion = version.replace(/^v/i, '').trim();
        
        // Update version in hero stats
        const versionElement = document.getElementById('version');
        if (versionElement) {
            versionElement.textContent = cleanVersion;
        }
        
        // Update version in download section
        const downloadVersionElement = document.getElementById('downloadVersion');
        if (downloadVersionElement) {
            downloadVersionElement.textContent = cleanVersion;
        }
        
        // Store release info for potential use
        if (data.assets && data.assets.length > 0) {
            // Look for zip file in assets
            const zipAsset = data.assets.find(asset => 
                asset.name.toLowerCase().endsWith('.zip') || 
                asset.name.toLowerCase().includes('neverwenz') ||
                asset.name.toLowerCase().includes('robloxinjector')
            );
            
            if (zipAsset) {
                // Store release URL for potential direct download option
                window.latestReleaseUrl = zipAsset.browser_download_url;
                console.log('Latest release archive:', zipAsset.browser_download_url);
            }
        }
        
        // Store release page URL
        window.latestReleasePageUrl = data.html_url;
        
        // Update release link if available
        const releaseLink = document.getElementById('releaseLink');
        const releaseLinkContainer = releaseLink?.parentElement;
        if (releaseLink && window.latestReleasePageUrl) {
            releaseLink.href = window.latestReleasePageUrl;
            if (releaseLinkContainer) {
                releaseLinkContainer.style.display = 'block';
            }
        } else if (releaseLinkContainer) {
            releaseLinkContainer.style.display = 'none';
        }
        
        return cleanVersion;
    } catch (error) {
        console.error('Error fetching version:', error);
        
        // Set default version on error
        const versionElement = document.getElementById('version');
        if (versionElement) {
            versionElement.textContent = 'v1.0.0';
        }
        
        const downloadVersionElement = document.getElementById('downloadVersion');
        if (downloadVersionElement) {
            downloadVersionElement.textContent = 'v1.0.0';
        }
        
        return 'v1.0.0';
    }
}

// Load version on page load (moved to end of file)

// Script Hub functionality
const scriptsData = [];
let filteredScripts = [];

// Popular scripts from rbxscripts (simulated - in real implementation would fetch from API)
const popularScripts = [
    {
        name: "Infinite Yield",
        description: "Powerful admin commands script with extensive features",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source'))()",
        category: "admin",
        author: "EdgeIY"
    },
    {
        name: "Remote Spy",
        description: "Monitor and intercept remote events and functions",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/78n/SimpleSpy/main/SimpleSpySource.lua'))()",
        category: "exploit",
        author: "78n"
    },
    {
        name: "FPS Unlocker",
        description: "Unlock FPS cap for better performance",
        script: "setfpscap(999)",
        category: "utility",
        author: "Community"
    },
    {
        name: "CMD-X",
        description: "Advanced command executor with many features",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/CMD-X/CMD-X/master/Source', true))()",
        category: "admin",
        author: "CMD-X"
    },
    {
        name: "Simple Spy",
        description: "Simple remote event spy for debugging",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/78n/SimpleSpy/main/SimpleSpySource.lua'))()",
        category: "exploit",
        author: "78n"
    },
    {
        name: "Dark Dex",
        description: "Advanced explorer and debugger tool",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/Babyhamsta/RBLX_Scripts/main/Universal/BypassedDarkDexV3.lua', true))()",
        category: "utility",
        author: "Babyhamsta"
    },
    {
        name: "Unnamed ESP",
        description: "ESP script for players and objects",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/ic3w0lf22/Unnamed-ESP/master/UnnamedESP.lua'))()",
        category: "exploit",
        author: "ic3w0lf22"
    },
    {
        name: "Owl Hub",
        description: "Popular script hub with multiple games support",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/CriShoux/OwlHub/master/OwlHub.txt'))()",
        category: "utility",
        author: "CriShoux"
    }
];

// Initialize Script Hub
function initializeScriptHub() {
    scriptsData.push(...popularScripts);
    filteredScripts = [...scriptsData];
    renderScripts();
    setupFilters();
}

// Render scripts
function renderScripts() {
    const container = document.getElementById('scriptsContainer');
    if (!container) return;

    if (filteredScripts.length === 0) {
        container.innerHTML = '<div class="script-error">Скрипты не найдены</div>';
        return;
    }

    container.innerHTML = filteredScripts.map(script => `
        <div class="script-card">
            <div class="script-card-header">
                <h3 class="script-name">${escapeHtml(script.name)}</h3>
                <span class="script-category">${script.category}</span>
            </div>
            <p class="script-description">${escapeHtml(script.description)}</p>
            <div class="script-preview">${escapeHtml(truncateScript(script.script, 150))}</div>
            <div class="script-actions">
                <button class="script-btn script-btn-copy" onclick="copyScript('${escapeScript(script.script)}', this)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Копировать
                </button>
                <button class="script-btn script-btn-execute" onclick="executeScript('${escapeScript(script.script)}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Выполнить
                </button>
            </div>
        </div>
    `).join('');
}

// Setup filters
function setupFilters() {
    const searchInput = document.getElementById('scriptSearch');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Search filter
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterScripts(query, getActiveCategory());
        });
    }

    // Category filter
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const query = searchInput ? searchInput.value.toLowerCase() : '';
            filterScripts(query, btn.dataset.category);
        });
    });
}

// Filter scripts
function filterScripts(searchQuery, category) {
    filteredScripts = scriptsData.filter(script => {
        const matchesSearch = !searchQuery || 
            script.name.toLowerCase().includes(searchQuery) ||
            script.description.toLowerCase().includes(searchQuery);
        const matchesCategory = category === 'all' || script.category === category;
        return matchesSearch && matchesCategory;
    });
    renderScripts();
}

// Get active category
function getActiveCategory() {
    const activeBtn = document.querySelector('.category-btn.active');
    return activeBtn ? activeBtn.dataset.category : 'all';
}

// Copy script to clipboard
function copyScript(script, button) {
    const decodedScript = unescapeScript(script);
    navigator.clipboard.writeText(decodedScript).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Скопировано!
        `;
        button.style.background = '#10b981';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Не удалось скопировать скрипт');
    });
}

// Execute script (opens injector or shows instructions)
function executeScript(script) {
    const decodedScript = unescapeScript(script);
    // Copy to clipboard and show instructions
    navigator.clipboard.writeText(decodedScript).then(() => {
        alert('Скрипт скопирован в буфер обмена!\n\nОткройте инжектор и вставьте скрипт в редактор, затем нажмите "Execute".');
    });
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeScript(script) {
    return script.replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
}

function unescapeScript(escaped) {
    return escaped.replace(/\\'/g, "'").replace(/\\n/g, "\n").replace(/\\r/g, "\r");
}

function truncateScript(script, maxLength) {
    if (script.length <= maxLength) return script;
    return script.substring(0, maxLength) + '...';
}

// Initialize Script Hub on page load
document.addEventListener('DOMContentLoaded', () => {
    getLatestVersion();
    initializeScriptHub();
});

// Check if download link is accessible
fetch('https://raw.githubusercontent.com/CAPYBERA099/setup/main/RobloxInjectorSetup.exe', { method: 'HEAD' })
    .then(response => {
        if (!response.ok) {
            console.warn('Download link might not be accessible');
        }
    })
    .catch(error => {
        console.warn('Could not verify download link:', error);
    });

