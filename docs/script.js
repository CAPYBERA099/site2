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

async function loadVersionHistory() {
    const versionList = document.getElementById('versionList');
    if (!versionList) return;

    versionList.innerHTML = '<div class="version-loading">Загрузка версий...</div>';

    try {
        const response = await fetch('https://api.github.com/repos/CAPYBERA099/WenzInjector-ROBLOX/releases?per_page=6');
        if (!response.ok) {
            throw new Error(`Failed to fetch releases: ${response.status}`);
        }

        const releases = await response.json();

        if (!Array.isArray(releases) || releases.length === 0) {
            versionList.innerHTML = '<div class="version-empty">Пока нет дополнительных опубликованных версий.</div>';
            return;
        }

        versionList.innerHTML = releases.map(renderVersionCard).join('');
    } catch (error) {
        console.error('Error loading version history:', error);
        versionList.innerHTML = `
            <div class="version-error">
                <div>Не удалось загрузить список релизов GitHub.</div>
                <button type="button" class="version-retry-btn">Повторить</button>
            </div>
        `;

        const retryButton = versionList.querySelector('.version-retry-btn');
        if (retryButton) {
            retryButton.addEventListener('click', () => loadVersionHistory());
        }
    }
}

function renderVersionCard(release) {
    const tag = release.tag_name || release.name || 'v1.0.0';
    const date = formatReleaseDate(release.published_at || release.created_at);
    const notes = formatReleaseNotes(release.body);
    const downloadUrl = getReleaseDownloadLink(release);
    const releaseLink = release.html_url;

    const downloadButton = downloadUrl ? `
        <a class="btn btn-primary" href="${downloadUrl}" target="_blank" rel="noopener noreferrer">
            Скачать
        </a>
    ` : '';

    return `
        <div class="version-card">
            <div class="version-card-header">
                <div>
                    <div class="version-label">GitHub release</div>
                    <h4>${escapeHtml(tag)}</h4>
                </div>
                <div class="version-date">${date}</div>
            </div>
            <p class="version-notes">${escapeHtml(notes)}</p>
            <div class="version-actions">
                <a class="btn btn-secondary" href="${releaseLink}" target="_blank" rel="noopener noreferrer">Подробнее</a>
                ${downloadButton}
            </div>
        </div>
    `;
}

function formatReleaseDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function formatReleaseNotes(body) {
    if (!body) return 'Описание релиза отсутствует.';
    const firstLine = body.split('\n').find(line => line.trim().length > 0) || body;
    return firstLine.replace(/[#>*-]/g, '').trim().slice(0, 220) + (body.length > 220 ? '…' : '');
}

function getReleaseDownloadLink(release) {
    if (release.assets && release.assets.length > 0) {
        const preferredAsset = release.assets.find(asset =>
            asset.name.toLowerCase().includes('setup') ||
            asset.name.toLowerCase().endsWith('.zip') ||
            asset.name.toLowerCase().includes('roblox')
        );
        const asset = preferredAsset || release.assets[0];
        return asset.browser_download_url;
    }
    return release.zipball_url || release.tarball_url || '';
}

// Load version on page load (moved to end of file)

// Script Hub functionality
const scriptsData = [];
let filteredScripts = [];
let currentPage = 1;
const scriptsPerPage = 9;
let currentStyle = 'default';
let currentSearchQuery = '';
let rbxScriptsLoaded = false;
let scriptHubMessageTimeout;

// Popular scripts from rbxscripts
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
    },
    {
        name: "Hydroxide",
        description: "Advanced script executor and debugger",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/Upbolt/Hydroxide/revision/init.lua'))()",
        category: "exploit",
        author: "Upbolt"
    },
    {
        name: "Dex Explorer",
        description: "Advanced Roblox explorer tool",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/infyiff/backup/main/dex.lua'))()",
        category: "utility",
        author: "infyiff"
    },
    {
        name: "Simple Admin",
        description: "Simple admin commands script",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/Stefanuk12/ROBLOX/master/Games/SimpleAdmin.lua'))()",
        category: "admin",
        author: "Stefanuk12"
    },
    {
        name: "Chat Logger",
        description: "Log and monitor chat messages",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/7kayoh/ChatLogger/main/ChatLogger.lua'))()",
        category: "utility",
        author: "7kayoh"
    },
    {
        name: "Aimbot",
        description: "Aimbot script for FPS games",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/7kayoh/Aimbot/main/Aimbot.lua'))()",
        category: "game",
        author: "7kayoh"
    },
    {
        name: "ESP Gui",
        description: "ESP script with GUI for players",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/ic3w0lf22/Unnamed-ESP/master/UnnamedESP.lua'))()",
        category: "exploit",
        author: "ic3w0lf22"
    },
    {
        name: "Admin Commands",
        description: "Comprehensive admin commands system",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source'))()",
        category: "admin",
        author: "EdgeIY"
    },
    {
        name: "Speed Hack",
        description: "Speed modification script",
        script: "game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = 50",
        category: "game",
        author: "Community"
    },
    {
        name: "Fly Script",
        description: "Fly script for movement",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/XNEOFF/FlyGuiV3/main/FlyGuiV3.txt'))()",
        category: "game",
        author: "XNEOFF"
    },
    {
        name: "Auto Farm",
        description: "Automatic farming script",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/YourUsername/AutoFarm/main/script.lua'))()",
        category: "game",
        author: "Community"
    },
    {
        name: "Item ESP",
        description: "ESP for items and objects",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/ic3w0lf22/Unnamed-ESP/master/UnnamedESP.lua'))()",
        category: "exploit",
        author: "ic3w0lf22"
    },
    {
        name: "Anti AFK",
        description: "Prevent AFK kick",
        script: "local vu = game:GetService('VirtualUser'); game:GetService('Players').LocalPlayer.Idled:connect(function() vu:Button2Down(Vector2.new(0,0),workspace.CurrentCamera.CFrame); wait(1); vu:Button2Up(Vector2.new(0,0),workspace.CurrentCamera.CFrame); end)",
        category: "utility",
        author: "Community"
    },
    {
        name: "Rejoin Script",
        description: "Automatically rejoin game",
        script: "game:GetService('TeleportService'):Teleport(game.PlaceId, game:GetService('Players').LocalPlayer)",
        category: "utility",
        author: "Community"
    },
    {
        name: "TP Script",
        description: "Teleport to players",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/Stefanuk12/ROBLOX/master/Games/Universal/TPTool.lua'))()",
        category: "utility",
        author: "Stefanuk12"
    },
    {
        name: "Noclip",
        description: "Walk through walls",
        script: "game.Players.LocalPlayer.Character.Humanoid:ChangeState(11)",
        category: "game",
        author: "Community"
    },
    {
        name: "Invisible",
        description: "Make character invisible",
        script: "for _, v in pairs(game.Players.LocalPlayer.Character:GetDescendants()) do if v:IsA('BasePart') and v.Name ~='HumanoidRootPart' then v.Transparency = 1 end end",
        category: "game",
        author: "Community"
    },
    {
        name: "God Mode",
        description: "Invincibility script",
        script: "game.Players.LocalPlayer.Character.Humanoid:Remove()",
        category: "game",
        author: "Community"
    },
    {
        name: "Auto Clicker",
        description: "Automatic clicking",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/YourUsername/AutoClicker/main/script.lua'))()",
        category: "game",
        author: "Community"
    },
    {
        name: "GUI Library",
        description: "Advanced GUI library",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/violin-suzutsuki/LinoriaLib/main/Library.lua'))()",
        category: "utility",
        author: "violin-suzutsuki"
    },
    {
        name: "Notification System",
        description: "Custom notification system",
        script: "loadstring(game:HttpGet('https://raw.githubusercontent.com/YourUsername/Notifications/main/script.lua'))()",
        category: "utility",
        author: "Community"
    }
];

// Initialize Script Hub
function initializeScriptHub() {
    scriptsData.push(...popularScripts);
    filteredScripts = [...scriptsData];
    currentPage = 1;
    renderScripts();
    setupFilters();
    setupPagination();
    setupStyleSelector();
    fetchRbxScripts();
}

// Render scripts
function renderScripts() {
    const container = document.getElementById('scriptsContainer');
    if (!container) return;

    if (filteredScripts.length === 0) {
        container.innerHTML = '<div class="script-error">Скрипты не найдены</div>';
        updatePagination();
        return;
    }

    // Вычисляем индексы для текущей страницы
    const startIndex = (currentPage - 1) * scriptsPerPage;
    const endIndex = Math.min(startIndex + scriptsPerPage, filteredScripts.length);
    const scriptsToShow = filteredScripts.slice(startIndex, endIndex);

    container.innerHTML = scriptsToShow.map(script => `
        <div class="script-card">
            <div class="script-card-header">
                <h3 class="script-name">${escapeHtml(script.name)}</h3>
                <span class="script-category">${script.category}</span>
            </div>
            <p class="script-description">${escapeHtml(script.description)}</p>
            ${script.sourceLink ? `<a class="script-source-link" href="${escapeHtml(script.sourceLink)}" target="_blank" rel="noopener noreferrer">Источник</a>` : ''}
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

    updatePagination();
}

// Setup filters
function setupFilters() {
    const searchInput = document.getElementById('scriptSearch');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Search filter
    if (searchInput) {
        currentSearchQuery = searchInput.value.toLowerCase();
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase();
            filterScripts(currentSearchQuery, getActiveCategory());
        });
    }

    // Category filter
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterScripts(currentSearchQuery, btn.dataset.category);
        });
    });
}

// Filter scripts
function filterScripts(searchQuery, category, resetPage = true) {
    filteredScripts = scriptsData.filter(script => {
        const matchesSearch = !searchQuery || 
            script.name.toLowerCase().includes(searchQuery) ||
            script.description.toLowerCase().includes(searchQuery) ||
            (script.author && script.author.toLowerCase().includes(searchQuery));
        const matchesCategory = category === 'all' || script.category === category;
        return matchesSearch && matchesCategory;
    });
    if (resetPage) {
        currentPage = 1; // Сбрасываем на первую страницу при фильтрации
    }
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

// Pagination functions
function setupPagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderScripts();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxPages = Math.ceil(filteredScripts.length / scriptsPerPage);
            if (currentPage < maxPages) {
                currentPage++;
                renderScripts();
            }
        });
    }
}

function updatePagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    if (!prevBtn || !nextBtn || !pageInfo) return;

    const maxPages = Math.ceil(filteredScripts.length / scriptsPerPage);
    const startIndex = (currentPage - 1) * scriptsPerPage + 1;
    const endIndex = Math.min(currentPage * scriptsPerPage, filteredScripts.length);

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= maxPages;

    if (filteredScripts.length === 0) {
        pageInfo.textContent = 'Скрипты не найдены';
    } else {
        pageInfo.textContent = `Страница ${currentPage} из ${maxPages} (${startIndex}-${endIndex} из ${filteredScripts.length})`;
    }
}

// Style selector
function setupStyleSelector() {
    const styleSelector = document.getElementById('styleSelector');
    if (styleSelector) {
        styleSelector.addEventListener('change', (e) => {
            currentStyle = e.target.value;
            applyStyle(currentStyle);
        });
    }
}

function applyStyle(style) {
    document.body.classList.remove('style-default', 'style-fatality');
    
    if (style === 'fatality') {
        document.body.classList.add('style-fatality');
        // Применяем стиль Fatality
        document.documentElement.style.setProperty('--bg-primary', '#0a0a0a');
        document.documentElement.style.setProperty('--bg-secondary', '#0f0f0f');
        document.documentElement.style.setProperty('--bg-card', '#141414');
        document.documentElement.style.setProperty('--accent-primary', '#dc2626');
        document.documentElement.style.setProperty('--accent-secondary', '#ef4444');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', '#a0a0a0');
        document.documentElement.style.setProperty('--border-color', '#1f1f1f');
    } else {
        document.body.classList.add('style-default');
        // Возвращаем стиль по умолчанию
        document.documentElement.style.setProperty('--bg-primary', '#06070d');
        document.documentElement.style.setProperty('--bg-secondary', '#080910');
        document.documentElement.style.setProperty('--bg-card', '#080912');
        document.documentElement.style.setProperty('--accent-primary', '#1d6bce');
        document.documentElement.style.setProperty('--accent-secondary', '#22a2ff');
        document.documentElement.style.setProperty('--text-primary', '#afcfff');
        document.documentElement.style.setProperty('--text-secondary', '#7889a6');
        document.documentElement.style.setProperty('--border-color', '#1a1a1a');
    }
}

// Initialize Script Hub on page load
document.addEventListener('DOMContentLoaded', () => {
    getLatestVersion();
    loadVersionHistory();
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

async function fetchRbxScripts() {
    const endpoint = 'https://rbxscript.com/wp-json/wp/v2/posts?per_page=12&_fields=id,title,link,date,excerpt,content';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(endpoint, {
            headers: { 'Accept': 'application/json' },
            signal: controller.signal,
            mode: 'cors'
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`RBXScript responded with status ${response.status}`);
        }

        const posts = await response.json();

        if (!Array.isArray(posts) || posts.length === 0) {
            showScriptHubMessage('RBXScript не вернул новые записи.', 'warning');
            return;
        }

        const normalized = posts
            .map(normalizeRbxScriptPost)
            .filter(Boolean);

        if (normalized.length === 0) {
            showScriptHubMessage('Не удалось извлечь содержимое скриптов с RBXScript.', 'warning');
            return;
        }

        scriptsData.push(...normalized);
        rbxScriptsLoaded = true;
        filterScripts(currentSearchQuery, getActiveCategory(), false);
        showScriptHubMessage(`Загружено ${normalized.length} скриптов с RBXScript.com`, 'success');
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error fetching RBXScript scripts:', error);
        showScriptHubMessage('Не удалось загрузить скрипты с RBXScript.com. Возможно, сайт требует дополнительного подтверждения.', 'error');
    }
}

function normalizeRbxScriptPost(post) {
    if (!post || !post.content || !post.content.rendered) return null;

    const name = decodeHtmlEntities(post.title?.rendered || 'RBXScript');
    const description = stripHtmlTags(post.excerpt?.rendered || '').trim() || 'Скрипт с rbxscript.com';
    const scriptBody = extractScriptFromContent(post.content.rendered);

    if (!scriptBody) return null;

    return {
        name,
        description,
        script: scriptBody,
        category: 'utility',
        author: 'rbxscript.com',
        sourceLink: post.link
    };
}

function extractScriptFromContent(html) {
    if (!html) return '';
    try {
        if (typeof DOMParser !== 'undefined') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const codeBlock = doc.querySelector('pre code') || doc.querySelector('code');
            if (codeBlock && codeBlock.textContent) {
                return codeBlock.textContent.trim();
            }
        }
    } catch (error) {
        console.warn('Failed to parse HTML content', error);
    }

    // Fallback: strip HTML and attempt to extract long code-like text
    const text = stripHtmlTags(html);
    const lines = text.split('\n').map(line => line.trim());
    const scriptLines = lines.filter(line => line.includes('loadstring') || line.includes('game:'));
    return scriptLines.join('\n').trim();
}

function stripHtmlTags(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+\n/g, '\n');
}

function decodeHtmlEntities(html) {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function showScriptHubMessage(message, type = 'info') {
    const container = document.querySelector('.script-hub-content');
    if (!container) return;

    let banner = document.getElementById('scriptHubMessage');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'scriptHubMessage';
        banner.className = 'script-hub-message';
        container.insertBefore(banner, container.firstChild);
    }

    banner.textContent = message;
    banner.dataset.state = type;
    banner.classList.add('visible');

    clearTimeout(scriptHubMessageTimeout);
    scriptHubMessageTimeout = setTimeout(() => {
        banner.classList.remove('visible');
    }, 6000);
}

