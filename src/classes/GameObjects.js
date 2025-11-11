export class Player {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  update(targetX, canvasWidth) {
    // Move towards touch position
    const diff = targetX - this.x;
    if (Math.abs(diff) > 5) {
      if (diff > 0 && this.x < canvasWidth - this.width) {
        this.x += Math.min(this.speed, diff);
      } else if (diff < 0 && this.x > 0) {
        this.x += Math.max(-this.speed, diff);
      }
    }
  }

  draw(canvas) {
    const { x, y, width, height } = this;
    
    // Draw retro spaceship
    canvas.drawPath(
      `M ${x + width / 2} ${y} L ${x} ${y + height} L ${x + width / 2} ${y + height - 10} L ${x + width} ${y + height} Z`,
      { color: '#0ff', style: 'fill' }
    );
    
    // Cockpit
    canvas.drawRect(
      { x: x + width / 2 - 5, y: y + 10, width: 10, height: 10 },
      { color: '#fff', style: 'fill' }
    );
  }
}

export class Enemy {
  constructor(x, y, level, canvasWidth) {
    this.width = 60;
    this.height = 60;
    this.x = x;
    this.y = y;
    this.speed = 2 + (level - 1) * 0.5;
    this.direction = 1;
    this.health = level * 2;
    this.maxHealth = level * 2;
    this.shootInterval = Math.max(500, 2000 - (level - 1) * 200);
    this.isBoss = level >= 5;
    this.canvasWidth = canvasWidth;
    
    if (this.isBoss) {
      this.width = 90;
      this.height = 90;
      this.health = level * 5;
      this.maxHealth = level * 5;
    }
  }

  update() {
    this.x += this.speed * this.direction;
    
    if (this.x <= 0 || this.x >= this.canvasWidth - this.width) {
      this.direction *= -1;
    }
  }

  draw(canvas) {
    const { x, y, width, height, isBoss, health, maxHealth } = this;
    const color = isBoss ? '#f00' : '#ff0';
    
    // Draw enemy ship
    canvas.drawPath(
      `M ${x + width / 2} ${y + height} L ${x} ${y} L ${x + width / 2} ${y + 10} L ${x + width} ${y} Z`,
      { color, style: 'fill' }
    );
    
    // Health bar
    const healthBarWidth = width;
    const healthBarHeight = 5;
    const healthPercent = health / maxHealth;
    
    canvas.drawRect(
      { x, y: y - 15, width: healthBarWidth, height: healthBarHeight },
      { color: '#333', style: 'fill' }
    );
    
    canvas.drawRect(
      { x, y: y - 15, width: healthBarWidth * healthPercent, height: healthBarHeight },
      { color: isBoss ? '#f00' : '#0f0', style: 'fill' }
    );
  }

  takeDamage() {
    this.health--;
    return this.health <= 0;
  }
}

export class Bullet {
  constructor(x, y, direction, size = 5) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size * 3;
    this.speed = 10;
    this.direction = direction; // -1 for up, 1 for down
  }

  update() {
    this.y += this.speed * this.direction;
  }

  draw(canvas) {
    const color = this.direction === -1 ? '#0ff' : '#f00';
    canvas.drawRect(
      { x: this.x, y: this.y, width: this.width, height: this.height },
      { color, style: 'fill' }
    );
  }

  isOffScreen(canvasHeight) {
    return this.y < 0 || this.y > canvasHeight;
  }
}

export function checkCollision(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

export function generateStars(width, height, count = 100) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1
    });
  }
  return stars;
}
