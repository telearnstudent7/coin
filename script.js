// ========================================
// Game Configuration
// ========================================
const CONFIG = {
    WINDOW_WIDTH: 800,
    WINDOW_HEIGHT: 600,
    PLAYER_SIZE: 50,
    PLAYER_SPEED: 5,
    BILL_WIDTH: 100,
    BILL_HEIGHT: 50,
    COIN_SPEED: 4,
    SPAWN_RATE: 60, // 1 in 60 chance per frame
    BONUS_THRESHOLD: 100, // Score to trigger bonus rain
    BONUS_COINS: 1000,
    MISS_PENALTY: 5,
    FPS: 60
};

// ========================================
// Game State
// ========================================
let gameState = {
    score: 0,
    running: false,
    paused: false,
    bonusTriggered: false,
    player: null,
    coins: [],
    frameCount: 0
};

// ========================================
// Canvas Setup
// ========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ========================================
// DOM Elements
// ========================================
const scoreValueEl = document.getElementById('scoreValue');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const gameOverlay = document.getElementById('gameOverlay');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');

// ========================================
// Image Loading
// ========================================
const images = {
    bill1000: null,
    bill2000: null,
    loaded: false
};

// Create colored rectangles as fallback/placeholder
function createBillImage(color, text) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = CONFIG.BILL_WIDTH;
    tempCanvas.height = CONFIG.BILL_HEIGHT;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw bill background
    const gradient = tempCtx.createLinearGradient(0, 0, CONFIG.BILL_WIDTH, CONFIG.BILL_HEIGHT);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustBrightness(color, -20));

    tempCtx.fillStyle = gradient;
    tempCtx.fillRect(0, 0, CONFIG.BILL_WIDTH, CONFIG.BILL_HEIGHT);

    // Draw border
    tempCtx.strokeStyle = adjustBrightness(color, -40);
    tempCtx.lineWidth = 3;
    tempCtx.strokeRect(0, 0, CONFIG.BILL_WIDTH, CONFIG.BILL_HEIGHT);

    // Draw text
    tempCtx.fillStyle = '#fff';
    tempCtx.font = 'bold 20px Orbitron';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(text, CONFIG.BILL_WIDTH / 2, CONFIG.BILL_HEIGHT / 2);

    return tempCanvas;
}

function adjustBrightness(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Try to load images, fallback to generated images
function loadImages() {
    const img1000 = new Image();
    const img2000 = new Image();

    let loaded1000 = false;
    let loaded2000 = false;

    img1000.onload = () => {
        images.bill1000 = img1000;
        loaded1000 = true;
        checkAllLoaded();
    };

    img1000.onerror = () => {
        images.bill1000 = createBillImage('#00ff00', 'NT$1000');
        loaded1000 = true;
        checkAllLoaded();
    };

    img2000.onload = () => {
        images.bill2000 = img2000;
        loaded2000 = true;
        checkAllLoaded();
    };

    img2000.onerror = () => {
        images.bill2000 = createBillImage('#c8c8ff', 'NT$2000');
        loaded2000 = true;
        checkAllLoaded();
    };

    function checkAllLoaded() {
        if (loaded1000 && loaded2000) {
            images.loaded = true;
        }
    }

    img1000.src = '1000_ntd.png';
    img2000.src = '2000_ntd.png';
}

loadImages();

// ========================================
// Player Class
// ========================================
class Player {
    constructor() {
        this.width = CONFIG.PLAYER_SIZE;
        this.height = CONFIG.PLAYER_SIZE;
        this.x = CONFIG.WINDOW_WIDTH / 2 - this.width / 2;
        this.y = CONFIG.WINDOW_HEIGHT - this.height - 10;
        this.speed = CONFIG.PLAYER_SPEED;
        this.keys = {
            left: false,
            right: false
        };
    }

    update() {
        if (this.keys.left) {
            this.x -= this.speed;
        }
        if (this.keys.right) {
            this.x += this.speed;
        }

        // Boundary checks
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > CONFIG.WINDOW_WIDTH) {
            this.x = CONFIG.WINDOW_WIDTH - this.width;
        }
    }

    draw() {
        // Draw player with gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#cccccc');

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw player border
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// ========================================
// Coin Class
// ========================================
class Coin {
    constructor(type = null, customY = null) {
        this.width = CONFIG.BILL_WIDTH;
        this.height = CONFIG.BILL_HEIGHT;

        // Determine type (20% chance for 2000)
        if (type === null) {
            this.is2000 = Math.random() < 0.2;
        } else {
            this.is2000 = type === 2000;
        }

        this.value = this.is2000 ? 2000 : 1000;
        this.image = this.is2000 ? images.bill2000 : images.bill1000;

        this.x = Math.random() * (CONFIG.WINDOW_WIDTH - this.width);
        this.y = customY !== null ? customY : -this.height;
        this.speed = CONFIG.COIN_SPEED;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    isOffScreen() {
        return this.y > CONFIG.WINDOW_HEIGHT;
    }
}

// ========================================
// Collision Detection
// ========================================
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

// ========================================
// Game Functions
// ========================================
function initGame() {
    gameState.score = 0;
    gameState.running = false;
    gameState.paused = false;
    gameState.bonusTriggered = false;
    gameState.player = new Player();
    gameState.coins = [];
    gameState.frameCount = 0;

    updateScoreDisplay();
}

function startGame() {
    if (!images.loaded) {
        setTimeout(startGame, 100);
        return;
    }

    if (!gameState.running) {
        initGame();
        gameState.running = true;
        gameState.paused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        gameOverlay.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        gameLoop();
    }
}

function pauseGame() {
    if (gameState.running) {
        gameState.paused = !gameState.paused;

        if (gameState.paused) {
            pauseBtn.textContent = '繼續';
            gameOverlay.classList.remove('hidden');
        } else {
            pauseBtn.textContent = '暫停';
            gameOverlay.classList.add('hidden');
            gameLoop();
        }
    }
}

function gameOver() {
    gameState.running = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    finalScoreEl.textContent = gameState.score;
    gameOverScreen.classList.remove('hidden');
}

function spawnCoin() {
    if (Math.floor(Math.random() * CONFIG.SPAWN_RATE) === 0) {
        gameState.coins.push(new Coin());
    }
}

function spawnBonusRain() {
    if (gameState.score >= CONFIG.BONUS_THRESHOLD && !gameState.bonusTriggered) {
        for (let i = 0; i < CONFIG.BONUS_COINS; i++) {
            const customY = Math.random() * (-10000 + 50) - 50;
            gameState.coins.push(new Coin(null, customY));
        }
        gameState.bonusTriggered = true;
    }
}

function updateCoins() {
    const playerBounds = gameState.player.getBounds();

    // Update coins and check for collisions/misses
    for (let i = gameState.coins.length - 1; i >= 0; i--) {
        const coin = gameState.coins[i];
        coin.update();

        // Check collision with player
        if (checkCollision(playerBounds, coin.getBounds())) {
            gameState.score += coin.value;
            gameState.coins.splice(i, 1);
            updateScoreDisplay();
            continue;
        }

        // Check if coin is off screen (missed)
        if (coin.isOffScreen()) {
            gameState.score -= CONFIG.MISS_PENALTY;
            gameState.coins.splice(i, 1);
            updateScoreDisplay();
        }
    }
}

function updateScoreDisplay() {
    scoreValueEl.textContent = gameState.score;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CONFIG.WINDOW_WIDTH, CONFIG.WINDOW_HEIGHT);

    // Draw coins
    gameState.coins.forEach(coin => coin.draw());

    // Draw player
    gameState.player.draw();

    // Draw score on canvas (optional - we have it in the UI already)
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Orbitron';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
}

function update() {
    if (!gameState.paused && gameState.running) {
        gameState.player.update();
        spawnCoin();
        spawnBonusRain();
        updateCoins();
        gameState.frameCount++;
    }
}

function gameLoop() {
    if (gameState.running && !gameState.paused) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// ========================================
// Event Listeners
// ========================================
document.addEventListener('keydown', (e) => {
    if (!gameState.player) return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameState.player.keys.left = true;
        e.preventDefault();
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameState.player.keys.right = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (!gameState.player) return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameState.player.keys.left = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameState.player.keys.right = false;
    }
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', startGame);

// ========================================
// Initialize
// ========================================
initGame();
draw(); // Draw initial state
