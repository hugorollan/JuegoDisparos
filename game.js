/**
 * Game configuration constants
 * @constant {Object}
 */
const CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    PLAYER_SPEED: 5,
    PLAYER_SIZE: 40,
    BULLET_SPEED: 7,
    BULLET_SIZE: 5,
    ENEMY_SIZE: 60,
    ENEMY_BULLET_SIZE: 5,
    BASE_ENEMY_SPEED: 2,
    BASE_ENEMY_SHOOT_INTERVAL: 2000,
    BOSS_LEVEL: 5,
    HIGH_SCORE_KEY: 'spaceShooterHighScore'
};

/**
 * Game state management
 * @type {Object}
 */
let gameState = {
    isRunning: false,
    isPaused: false,
    level: 1,
    score: 0,
    highScore: 0,
    lives: 3,
    player: null,
    bullets: [],
    enemyBullets: [],
    enemy: null,
    keys: {},
    canvas: null,
    ctx: null,
    lastEnemyShot: 0,
    audio: null,
    isMusicEnabled: true
};

/**
 * Audio system for retro music and sound effects
 * @class AudioSystem
 */
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicOscillators = [];
        this.isMusicPlaying = false;
    }

    /**
     * Initialize audio context
     * @returns {boolean} Success status
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.audioContext.destination);
            return true;
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            return false;
        }
    }

    /**
     * Play retro background music
     */
    playRetroMusic() {
        if (this.isMusicPlaying || !gameState.isMusicEnabled) return;
        if (!this.audioContext) {
            if (!this.init()) return;
        }
        
        this.isMusicPlaying = true;
        
        // Simple retro melody pattern
        const melody = [
            { freq: 262, duration: 0.2 }, // C
            { freq: 330, duration: 0.2 }, // E
            { freq: 392, duration: 0.2 }, // G
            { freq: 523, duration: 0.2 }, // C
            { freq: 392, duration: 0.2 }, // G
            { freq: 330, duration: 0.2 }, // E
        ];

        const playMelody = (startTime) => {
            if (!this.isMusicPlaying) return;
            
            let time = startTime;
            melody.forEach(note => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = 'square';
                oscillator.frequency.value = note.freq;
                
                gainNode.gain.value = 0.1;
                gainNode.gain.exponentialRampToValueAtTime(0.01, time + note.duration);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.start(time);
                oscillator.stop(time + note.duration);
                
                time += note.duration;
            });
            
            // Loop the melody
            setTimeout(() => playMelody(this.audioContext.currentTime), melody.length * 200);
        };
        
        playMelody(this.audioContext.currentTime);
    }

    /**
     * Stop background music
     */
    stopMusic() {
        this.isMusicPlaying = false;
    }

    /**
     * Play shooting sound effect
     */
    playShootSound() {
        if (!this.audioContext) {
            if (!this.init()) return;
        }
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.value = 200;
            
            gainNode.gain.value = 0.3;
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (error) {
            console.error('Failed to play shoot sound:', error);
        }
    }

    /**
     * Play explosion sound effect
     */
    playExplosionSound() {
        if (!this.audioContext) {
            if (!this.init()) return;
        }
        
        try {
            const noise = this.audioContext.createBufferSource();
            const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.5, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < buffer.length; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            noise.buffer = buffer;
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.3;
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            noise.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            noise.start(this.audioContext.currentTime);
        } catch (error) {
            console.error('Failed to play explosion sound:', error);
        }
    }
}

/**
 * Player class - represents the player's spaceship
 * @class Player
 */
class Player {
    /**
     * Create a player
     * @param {number} x - Initial x coordinate
     * @param {number} y - Initial y coordinate
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER_SIZE;
        this.height = CONFIG.PLAYER_SIZE;
        this.speed = CONFIG.PLAYER_SPEED;
    }

    /**
     * Update player position based on keyboard input
     */
    update() {
        if (gameState.keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (gameState.keys['ArrowRight'] && this.x < CONFIG.WIDTH - this.width) {
            this.x += this.speed;
        }
    }

    /**
     * Draw the player spaceship on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        // Draw retro spaceship
        ctx.fillStyle = '#0ff';
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        
        // Ship body
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height - 10);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Cockpit
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + this.width / 2 - 5, this.y + 10, 10, 10);
    }

    /**
     * Shoot a bullet from player position
     */
    shoot() {
        gameState.bullets.push(new Bullet(this.x + this.width / 2 - CONFIG.BULLET_SIZE / 2, this.y, -1));
        gameState.audio.playShootSound();
    }
}

/**
 * Enemy class - represents enemy spaceships
 * @class Enemy
 */
class Enemy {
    /**
     * Create an enemy
     * @param {number} level - Current game level
     */
    constructor(level) {
        this.width = CONFIG.ENEMY_SIZE;
        this.height = CONFIG.ENEMY_SIZE;
        this.x = CONFIG.WIDTH / 2 - this.width / 2;
        this.y = 50;
        this.speed = CONFIG.BASE_ENEMY_SPEED + (level - 1) * 0.5;
        this.direction = 1;
        this.health = level * 2;
        this.maxHealth = level * 2;
        this.shootInterval = Math.max(500, CONFIG.BASE_ENEMY_SHOOT_INTERVAL - (level - 1) * 200);
        this.isBoss = level >= CONFIG.BOSS_LEVEL;
        
        if (this.isBoss) {
            this.width = CONFIG.ENEMY_SIZE * 1.5;
            this.height = CONFIG.ENEMY_SIZE * 1.5;
            this.health = level * 5;
            this.maxHealth = level * 5;
        }
    }

    /**
     * Update enemy position
     */
    update() {
        this.x += this.speed * this.direction;
        
        if (this.x <= 0 || this.x >= CONFIG.WIDTH - this.width) {
            this.direction *= -1;
        }
    }

    /**
     * Draw enemy on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        // Draw enemy ship
        if (this.isBoss) {
            ctx.fillStyle = '#f00';
            ctx.strokeStyle = '#f00';
        } else {
            ctx.fillStyle = '#ff0';
            ctx.strokeStyle = '#ff0';
        }
        ctx.lineWidth = 2;
        
        // Enemy body
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + 10);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw health bar
        const healthBarWidth = this.width;
        const healthBarHeight = 5;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x, this.y - 15, healthBarWidth, healthBarHeight);
        
        ctx.fillStyle = this.isBoss ? '#f00' : '#0f0';
        ctx.fillRect(this.x, this.y - 15, healthBarWidth * healthPercent, healthBarHeight);
    }

    /**
     * Enemy shoots a bullet
     */
    shoot() {
        const bulletX = this.x + this.width / 2 - CONFIG.ENEMY_BULLET_SIZE / 2;
        gameState.enemyBullets.push(new Bullet(bulletX, this.y + this.height, 1));
    }

    /**
     * Apply damage to enemy
     * @returns {boolean} True if enemy is destroyed
     */
    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}

/**
 * Bullet class - represents projectiles
 * @class Bullet
 */
class Bullet {
    /**
     * Create a bullet
     * @param {number} x - Initial x coordinate
     * @param {number} y - Initial y coordinate
     * @param {number} direction - Direction of movement (-1 for up, 1 for down)
     */
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.BULLET_SIZE;
        this.height = CONFIG.BULLET_SIZE * 3;
        this.speed = CONFIG.BULLET_SPEED;
        this.direction = direction; // -1 for up, 1 for down
    }

    /**
     * Update bullet position
     */
    update() {
        this.y += this.speed * this.direction;
    }

    /**
     * Draw bullet on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        if (this.direction === -1) {
            ctx.fillStyle = '#0ff';
        } else {
            ctx.fillStyle = '#f00';
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Check if bullet is off screen
     * @returns {boolean} True if bullet is off screen
     */
    isOffScreen() {
        return this.y < 0 || this.y > CONFIG.HEIGHT;
    }
}

/**
 * Check collision between two objects
 * @param {Object} obj1 - First object with x, y, width, height
 * @param {Object} obj2 - Second object with x, y, width, height
 * @returns {boolean} True if objects are colliding
 */
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

/**
 * Load high score from localStorage
 * @returns {number} High score or 0 if not found
 */
function loadHighScore() {
    try {
        const score = localStorage.getItem(CONFIG.HIGH_SCORE_KEY);
        return score ? parseInt(score, 10) : 0;
    } catch (error) {
        console.error('Failed to load high score:', error);
        return 0;
    }
}

/**
 * Save high score to localStorage
 * @param {number} score - Score to save
 */
function saveHighScore(score) {
    try {
        localStorage.setItem(CONFIG.HIGH_SCORE_KEY, score.toString());
    } catch (error) {
        console.error('Failed to save high score:', error);
    }
}

/**
 * Update high score if current score is higher
 */
function updateHighScore() {
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        saveHighScore(gameState.highScore);
    }
}

/**
 * Initialize game state and objects
 */
function initGame() {
    gameState.canvas = document.getElementById('gameCanvas');
    gameState.ctx = gameState.canvas.getContext('2d');
    
    if (!gameState.canvas || !gameState.ctx) {
        console.error('Failed to initialize canvas');
        alert('Error: Could not initialize game canvas. Please try a different browser.');
        return;
    }
    
    gameState.canvas.width = CONFIG.WIDTH;
    gameState.canvas.height = CONFIG.HEIGHT;
    
    gameState.audio = new AudioSystem();
    
    // Load high score
    gameState.highScore = loadHighScore();
    
    // Reset game state
    gameState.level = 1;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.bullets = [];
    gameState.enemyBullets = [];
    
    // Create player
    gameState.player = new Player(CONFIG.WIDTH / 2 - CONFIG.PLAYER_SIZE / 2, CONFIG.HEIGHT - CONFIG.PLAYER_SIZE - 20);
    
    // Create enemy
    gameState.enemy = new Enemy(gameState.level);
    
    updateHUD();
}

/**
 * Update HUD display
 */
function updateHUD() {
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('score').textContent = gameState.score;
    
    // Update high score display if it exists
    const highScoreElement = document.getElementById('highScore');
    if (highScoreElement) {
        highScoreElement.textContent = gameState.highScore;
    }
}

/**
 * Advance to next level
 */
function nextLevel() {
    gameState.level++;
    gameState.bullets = [];
    gameState.enemyBullets = [];
    gameState.enemy = new Enemy(gameState.level);
    gameState.lastEnemyShot = 0;
    updateHUD();
}

/**
 * Main game loop
 * @param {number} timestamp - Current timestamp from requestAnimationFrame
 */
function gameLoop(timestamp) {
    if (!gameState.isRunning) return;
    if (gameState.isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // Clear canvas
    gameState.ctx.fillStyle = '#000';
    gameState.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
    
    // Draw stars background
    drawStars();
    
    // Update and draw player
    gameState.player.update();
    gameState.player.draw(gameState.ctx);
    
    // Update and draw enemy
    if (gameState.enemy) {
        gameState.enemy.update();
        gameState.enemy.draw(gameState.ctx);
        
        // Enemy shooting
        if (timestamp - gameState.lastEnemyShot > gameState.enemy.shootInterval) {
            gameState.enemy.shoot();
            gameState.lastEnemyShot = timestamp;
        }
    }
    
    // Update and draw bullets
    gameState.bullets = gameState.bullets.filter(bullet => {
        bullet.update();
        bullet.draw(gameState.ctx);
        
        // Check collision with enemy
        if (gameState.enemy && checkCollision(bullet, gameState.enemy)) {
            if (gameState.enemy.takeDamage()) {
                gameState.audio.playExplosionSound();
                gameState.score += gameState.level * 100;
                updateHUD();
                
                // Check if boss defeated
                if (gameState.enemy.isBoss) {
                    victory();
                    return false;
                }
                
                // Next level
                nextLevel();
            }
            return false;
        }
        
        return !bullet.isOffScreen();
    });
    
    // Update and draw enemy bullets
    gameState.enemyBullets = gameState.enemyBullets.filter(bullet => {
        bullet.update();
        bullet.draw(gameState.ctx);
        
        // Check collision with player
        if (checkCollision(bullet, gameState.player)) {
            gameState.audio.playExplosionSound();
            gameState.lives--;
            updateHUD();
            
            if (gameState.lives <= 0) {
                gameOver();
                return false;
            }
            return false;
        }
        
        return !bullet.isOffScreen();
    });
    
    requestAnimationFrame(gameLoop);
}

/**
 * Draw stars background
 */
let stars = [];

/**
 * Initialize stars for background
 */
function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * CONFIG.WIDTH,
            y: Math.random() * CONFIG.HEIGHT,
            size: Math.random() * 2
        });
    }
}

/**
 * Draw stars on canvas
 */
function drawStars() {
    gameState.ctx.fillStyle = '#fff';
    stars.forEach(star => {
        gameState.ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

/**
 * Start the game
 */
function startGame() {
    hideAllScreens();
    document.getElementById('gameScreen').classList.remove('hidden');
    
    initGame();
    initStars();
    gameState.isRunning = true;
    gameState.isPaused = false;
    
    if (gameState.isMusicEnabled) {
        gameState.audio.playRetroMusic();
    }
    
    requestAnimationFrame(gameLoop);
}

/**
 * Toggle pause state
 */
function togglePause() {
    if (!gameState.isRunning) return;
    
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        document.getElementById('pauseScreen').classList.remove('hidden');
    } else {
        document.getElementById('pauseScreen').classList.add('hidden');
    }
}

/**
 * Toggle music on/off
 */
function toggleMusic() {
    gameState.isMusicEnabled = !gameState.isMusicEnabled;
    
    if (gameState.isMusicEnabled && gameState.isRunning && !gameState.isPaused) {
        gameState.audio.playRetroMusic();
    } else {
        gameState.audio.stopMusic();
    }
    
    // Update music button text if it exists
    const musicButton = document.getElementById('musicToggle');
    if (musicButton) {
        musicButton.textContent = gameState.isMusicEnabled ? '🔊 MÚSICA: ON' : '🔇 MÚSICA: OFF';
    }
}

/**
 * Handle game over
 */
function gameOver() {
    gameState.isRunning = false;
    gameState.audio.stopMusic();
    
    updateHighScore();
    
    document.getElementById('gameOverScore').textContent = gameState.score;
    const gameOverHighScore = document.getElementById('gameOverHighScore');
    if (gameOverHighScore) {
        gameOverHighScore.textContent = gameState.highScore;
    }
    
    hideAllScreens();
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

/**
 * Handle victory
 */
function victory() {
    gameState.isRunning = false;
    gameState.audio.stopMusic();
    
    updateHighScore();
    
    document.getElementById('finalScore').textContent = gameState.score;
    const victoryHighScore = document.getElementById('victoryHighScore');
    if (victoryHighScore) {
        victoryHighScore.textContent = gameState.highScore;
    }
    
    hideAllScreens();
    document.getElementById('victoryScreen').classList.remove('hidden');
}

/**
 * Hide all screens
 */
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
}

/**
 * Event listeners setup
 */
document.addEventListener('DOMContentLoaded', () => {
    // Start button
    document.getElementById('startButton').addEventListener('click', startGame);
    
    // Restart button
    document.getElementById('restartButton').addEventListener('click', startGame);
    
    // Retry button
    document.getElementById('retryButton').addEventListener('click', startGame);
    
    // Music toggle button (if exists)
    const musicToggle = document.getElementById('musicToggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Load and display high score on start screen
    gameState.highScore = loadHighScore();
    const startHighScore = document.getElementById('startHighScore');
    if (startHighScore) {
        startHighScore.textContent = gameState.highScore;
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.key] = true;
        
        // Shoot
        if (e.key === ' ' && gameState.isRunning && !gameState.isPaused) {
            e.preventDefault();
            gameState.player.shoot();
        }
        
        // Pause
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            togglePause();
        }
        
        // Toggle music
        if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            toggleMusic();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        gameState.keys[e.key] = false;
    });
});
