// Game State
const gameState = {
    cookies: 0,
    perClick: 1,
    perSecond: 0,
    upgrades: [
        {
            id: 'doubleClick',
            name: 'Double Click',
            description: 'Each click gives 2 cookies',
            cost: 10,
            owned: 0,
            effect: () => gameState.perClick += 1
        },
        {
            id: 'tripleClick',
            name: 'Triple Click',
            description: 'Each click gives 3 cookies',
            cost: 50,
            owned: 0,
            effect: () => gameState.perClick += 2
        },
        {
            id: 'autoClicker',
            name: 'Auto Clicker',
            description: '+1 cookie per second',
            cost: 100,
            owned: 0,
            effect: () => gameState.perSecond += 1
        },
        {
            id: 'enchantedCookie',
            name: 'Enchanted Cookie',
            description: 'Each click gives 5 cookies',
            cost: 200,
            owned: 0,
            effect: () => gameState.perClick += 4
        },
        {
            id: 'cookieFarm',
            name: 'Cookie Farm',
            description: '+5 cookies per second',
            cost: 500,
            owned: 0,
            effect: () => gameState.perSecond += 5
        },
        {
            id: 'enderDragon',
            name: 'Ender Dragon',
            description: 'Each click gives 10 cookies',
            cost: 1000,
            owned: 0,
            effect: () => gameState.perClick += 9
        },
        {
            id: 'netherPortal',
            name: 'Nether Portal',
            description: '+10 cookies per second',
            cost: 2000,
            owned: 0,
            effect: () => gameState.perSecond += 10
        },
        {
            id: 'diamondPickaxe',
            name: 'Diamond Pickaxe',
            description: 'Each click gives 20 cookies',
            cost: 5000,
            owned: 0,
            effect: () => gameState.perClick += 19
        }
    ]
};

// DOM Elements
const cookieButton = document.getElementById('cookieButton');
const cookieCountDisplay = document.getElementById('cookieCount');
const perClickDisplay = document.getElementById('perClick');
const perSecondDisplay = document.getElementById('perSecond');
const upgradesContainer = document.getElementById('upgradesContainer');
const particleContainer = document.getElementById('particleContainer');

// Initialize
function init() {
    renderUpgrades();
    updateDisplay();
    setupEventListeners();
    startAutoClicker();
}

// Setup Event Listeners
function setupEventListeners() {
    cookieButton.addEventListener('click', clickCookie);
}

// Click Cookie
function clickCookie(e) {
    gameState.cookies += gameState.perClick;
    
    // Create particles
    createParticles(e);
    
    // Animation
    cookieButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        cookieButton.style.transform = 'scale(1)';
    }, 100);
    
    updateDisplay();
}

// Create Floating Particles
function createParticles(e) {
    const rect = cookieButton.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = '🍪';
        
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        
        particleContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Auto Clicker
function startAutoClicker() {
    setInterval(() => {
        if (gameState.perSecond > 0) {
            gameState.cookies += gameState.perSecond;
            updateDisplay();
        }
    }, 1000);
}

// Render Upgrades
function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    
    gameState.upgrades.forEach(upgrade => {
        const button = document.createElement('button');
        button.className = 'upgrade-button';
        button.id = `upgrade-${upgrade.id}`;
        
        const canAfford = gameState.cookies >= upgrade.cost;
        button.disabled = !canAfford;
        
        button.innerHTML = `
            <span class="upgrade-name">${upgrade.name}</span>
            <span class="upgrade-description">${upgrade.description}</span>
            <span class="upgrade-cost">Cost: ${upgrade.cost} 🍪</span>
            <span class="upgrade-owned">Owned: ${upgrade.owned}</span>
        `;
        
        button.addEventListener('click', () => buyUpgrade(upgrade));
        upgradesContainer.appendChild(button);
    });
}

// Buy Upgrade
function buyUpgrade(upgrade) {
    if (gameState.cookies >= upgrade.cost) {
        gameState.cookies -= upgrade.cost;
        upgrade.owned += 1;
        upgrade.effect();
        
        updateDisplay();
        renderUpgrades();
        
        // Feedback
        playBuySound();
    }
}

// Play Buy Sound (visual feedback)
function playBuySound() {
    // Create a visual pulse effect
    const pulse = document.createElement('div');
    pulse.style.position = 'fixed';
    pulse.style.top = '50%';
    pulse.style.left = '50%';
    pulse.style.transform = 'translate(-50%, -50%)';
    pulse.style.width = '0';
    pulse.style.height = '0';
    pulse.style.borderRadius = '50%';
    pulse.style.border = '2px solid #ffd700';
    pulse.style.pointerEvents = 'none';
    pulse.style.zIndex = '1000';
    pulse.style.animation = 'pulse 0.6s ease-out forwards';
    document.body.appendChild(pulse);
    
    setTimeout(() => pulse.remove(), 600);
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Update Display
function updateDisplay() {
    cookieCountDisplay.textContent = formatNumber(gameState.cookies);
    perClickDisplay.textContent = gameState.perClick;
    perSecondDisplay.textContent = gameState.perSecond;
    
    // Update upgrade buttons
    gameState.upgrades.forEach(upgrade => {
        const button = document.getElementById(`upgrade-${upgrade.id}`);
        if (button) {
            const canAfford = gameState.cookies >= upgrade.cost;
            button.disabled = !canAfford;
        }
    });
}

// Format Number with Commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Save/Load Game (localStorage)
function saveGame() {
    localStorage.setItem('clickerGameState', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('clickerGameState');
    if (saved) {
        const loaded = JSON.parse(saved);
        gameState.cookies = loaded.cookies;
        gameState.perClick = loaded.perClick;
        gameState.perSecond = loaded.perSecond;
        
        // Restore upgrades
        loaded.upgrades.forEach((loadedUpgrade, index) => {
            if (gameState.upgrades[index]) {
                gameState.upgrades[index].owned = loadedUpgrade.owned;
            }
        });
    }
}

// Auto-save every 10 seconds
setInterval(saveGame, 10000);

// Save before leaving
window.addEventListener('beforeunload', saveGame);

// Start Game
loadGame();
init();
