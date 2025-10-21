// Game configuration
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
    BOSS_LEVEL: 5
};

// Game state
let gameState = {
    isRunning: false,
    isPaused: false,
    level: 1,
    score: 0,
    lives: 3,
    player: null,
    bullets: [],
    enemyBullets: [],
    enemy: null,
    keys: {},
    canvas: null,
    ctx: null,
    lastEnemyShot: 0,
    audio: null
};

// Audio context for retro music
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicOscillators = [];
        this.isMusicPlaying = false;
    }

    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.audioContext.destination);
    }

    playRetroMusic() {
        if (this.isMusicPlaying) return;
        if (!this.audioContext) this.init();
        
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

    stopMusic() {
        this.isMusicPlaying = false;
    }

    playShootSound() {
        if (!this.audioContext) this.init();
        
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
    }

    playExplosionSound() {
        if (!this.audioContext) this.init();
        
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
    }
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER_SIZE;
        this.height = CONFIG.PLAYER_SIZE;
        this.speed = CONFIG.PLAYER_SPEED;
    }

    update() {
        if (gameState.keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (gameState.keys['ArrowRight'] && this.x < CONFIG.WIDTH - this.width) {
            this.x += this.speed;
        }
    }

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

    shoot() {
        gameState.bullets.push(new Bullet(this.x + this.width / 2 - CONFIG.BULLET_SIZE / 2, this.y, -1));
        gameState.audio.playShootSound();
    }
}

// Enemy class
class Enemy {
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

    update() {
        this.x += this.speed * this.direction;
        
        if (this.x <= 0 || this.x >= CONFIG.WIDTH - this.width) {
            this.direction *= -1;
        }
    }

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

    shoot() {
        const bulletX = this.x + this.width / 2 - CONFIG.ENEMY_BULLET_SIZE / 2;
        gameState.enemyBullets.push(new Bullet(bulletX, this.y + this.height, 1));
    }

    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}

// Bullet class
class Bullet {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.BULLET_SIZE;
        this.height = CONFIG.BULLET_SIZE * 3;
        this.speed = CONFIG.BULLET_SPEED;
        this.direction = direction; // -1 for up, 1 for down
    }

    update() {
        this.y += this.speed * this.direction;
    }

    draw(ctx) {
        if (this.direction === -1) {
            ctx.fillStyle = '#0ff';
        } else {
            ctx.fillStyle = '#f00';
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.y < 0 || this.y > CONFIG.HEIGHT;
    }
}

// Collision detection
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Initialize game
function initGame() {
    gameState.canvas = document.getElementById('gameCanvas');
    gameState.ctx = gameState.canvas.getContext('2d');
    gameState.canvas.width = CONFIG.WIDTH;
    gameState.canvas.height = CONFIG.HEIGHT;
    
    gameState.audio = new AudioSystem();
    
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

// Update HUD
function updateHUD() {
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('score').textContent = gameState.score;
}

// Next level
function nextLevel() {
    gameState.level++;
    gameState.bullets = [];
    gameState.enemyBullets = [];
    gameState.enemy = new Enemy(gameState.level);
    gameState.lastEnemyShot = 0;
    updateHUD();
}

// Game loop
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

// Draw stars background
let stars = [];
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

function drawStars() {
    gameState.ctx.fillStyle = '#fff';
    stars.forEach(star => {
        gameState.ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

// Start game
function startGame() {
    hideAllScreens();
    document.getElementById('gameScreen').classList.remove('hidden');
    
    initGame();
    initStars();
    gameState.isRunning = true;
    gameState.isPaused = false;
    gameState.audio.playRetroMusic();
    
    requestAnimationFrame(gameLoop);
}

// Pause game
function togglePause() {
    if (!gameState.isRunning) return;
    
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        document.getElementById('pauseScreen').classList.remove('hidden');
    } else {
        document.getElementById('pauseScreen').classList.add('hidden');
    }
}

// Game over
function gameOver() {
    gameState.isRunning = false;
    gameState.audio.stopMusic();
    
    document.getElementById('gameOverScore').textContent = gameState.score;
    
    hideAllScreens();
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Victory
function victory() {
    gameState.isRunning = false;
    gameState.audio.stopMusic();
    
    document.getElementById('finalScore').textContent = gameState.score;
    
    hideAllScreens();
    document.getElementById('victoryScreen').classList.remove('hidden');
}

// Hide all screens
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Start button
    document.getElementById('startButton').addEventListener('click', startGame);
    
    // Restart button
    document.getElementById('restartButton').addEventListener('click', startGame);
    
    // Retry button
    document.getElementById('retryButton').addEventListener('click', startGame);
    
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
    });
    
    document.addEventListener('keyup', (e) => {
        gameState.keys[e.key] = false;
    });
});
