import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PanResponder } from 'react-native';
import { Canvas, useDrawCallback, Skia } from '@shopify/react-native-skia';
import { Player, Enemy, Bullet, checkCollision, generateStars } from '../classes/GameObjects';

export default function GameCanvas({
  config,
  onGameOver,
  onVictory,
  onPause,
  score,
  setScore,
  lives,
  setLives,
  level,
  setLevel,
  highScore,
  isMusicEnabled
}) {
  const [touchX, setTouchX] = useState(config.WIDTH / 2);
  const gameStateRef = useRef({
    player: null,
    enemy: null,
    bullets: [],
    enemyBullets: [],
    stars: [],
    lastEnemyShot: 0,
    isRunning: true,
  });

  useEffect(() => {
    // Initialize game objects
    gameStateRef.current.player = new Player(
      config.WIDTH / 2 - config.PLAYER_SIZE / 2,
      config.HEIGHT - config.PLAYER_SIZE - 20,
      config.PLAYER_SIZE,
      config.PLAYER_SIZE,
      config.PLAYER_SPEED
    );
    gameStateRef.current.enemy = new Enemy(
      config.WIDTH / 2 - config.ENEMY_SIZE / 2,
      50,
      level,
      config.WIDTH
    );
    gameStateRef.current.stars = generateStars(config.WIDTH, config.HEIGHT);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setTouchX(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        setTouchX(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const onDraw = useDrawCallback((canvas, info) => {
    const state = gameStateRef.current;
    if (!state.isRunning) return;

    // Clear canvas
    const paint = Skia.Paint();
    paint.setColor(Skia.Color('#000'));
    canvas.drawRect({ x: 0, y: 0, width: config.WIDTH, height: config.HEIGHT }, paint);

    // Draw stars
    const starPaint = Skia.Paint();
    starPaint.setColor(Skia.Color('#fff'));
    state.stars.forEach(star => {
      canvas.drawRect(
        { x: star.x, y: star.y, width: star.size, height: star.size },
        starPaint
      );
    });

    // Update and draw player
    if (state.player) {
      state.player.update(touchX, config.WIDTH);
      drawPlayer(canvas, state.player);
    }

    // Update and draw enemy
    if (state.enemy) {
      state.enemy.update();
      drawEnemy(canvas, state.enemy);

      // Enemy shooting
      const currentTime = Date.now();
      if (currentTime - state.lastEnemyShot > state.enemy.shootInterval) {
        const bulletX = state.enemy.x + state.enemy.width / 2 - config.ENEMY_BULLET_SIZE / 2;
        state.enemyBullets.push(
          new Bullet(bulletX, state.enemy.y + state.enemy.height, 1, config.ENEMY_BULLET_SIZE)
        );
        state.lastEnemyShot = currentTime;
      }
    }

    // Update and draw bullets
    state.bullets = state.bullets.filter(bullet => {
      bullet.update();
      drawBullet(canvas, bullet);

      // Check collision with enemy
      if (state.enemy && checkCollision(bullet, state.enemy)) {
        if (state.enemy.takeDamage()) {
          const points = level * 100;
          setScore(score + points);

          if (state.enemy.isBoss) {
            state.isRunning = false;
            onVictory(score + points);
            return false;
          }

          // Next level
          setLevel(level + 1);
          state.enemy = new Enemy(
            config.WIDTH / 2 - config.ENEMY_SIZE / 2,
            50,
            level + 1,
            config.WIDTH
          );
          state.bullets = [];
          state.enemyBullets = [];
        }
        return false;
      }

      return !bullet.isOffScreen(config.HEIGHT);
    });

    // Update and draw enemy bullets
    state.enemyBullets = state.enemyBullets.filter(bullet => {
      bullet.update();
      drawBullet(canvas, bullet);

      // Check collision with player
      if (state.player && checkCollision(bullet, state.player)) {
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives <= 0) {
          state.isRunning = false;
          onGameOver(score);
          return false;
        }
        return false;
      }

      return !bullet.isOffScreen(config.HEIGHT);
    });
  }, [touchX, score, lives, level]);

  const drawPlayer = (canvas, player) => {
    const { x, y, width, height } = player;
    
    // Create path for spaceship
    const path = Skia.Path.Make();
    path.moveTo(x + width / 2, y);
    path.lineTo(x, y + height);
    path.lineTo(x + width / 2, y + height - 10);
    path.lineTo(x + width, y + height);
    path.close();
    
    const paint = Skia.Paint();
    paint.setColor(Skia.Color('#0ff'));
    canvas.drawPath(path, paint);
    
    // Cockpit
    const cockpitPaint = Skia.Paint();
    cockpitPaint.setColor(Skia.Color('#fff'));
    canvas.drawRect(
      { x: x + width / 2 - 5, y: y + 10, width: 10, height: 10 },
      cockpitPaint
    );
  };

  const drawEnemy = (canvas, enemy) => {
    const { x, y, width, height, isBoss, health, maxHealth } = enemy;
    
    // Create path for enemy ship
    const path = Skia.Path.Make();
    path.moveTo(x + width / 2, y + height);
    path.lineTo(x, y);
    path.lineTo(x + width / 2, y + 10);
    path.lineTo(x + width, y);
    path.close();
    
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(isBoss ? '#f00' : '#ff0'));
    canvas.drawPath(path, paint);
    
    // Health bar background
    const healthBgPaint = Skia.Paint();
    healthBgPaint.setColor(Skia.Color('#333'));
    canvas.drawRect(
      { x, y: y - 15, width, height: 5 },
      healthBgPaint
    );
    
    // Health bar
    const healthPercent = health / maxHealth;
    const healthPaint = Skia.Paint();
    healthPaint.setColor(Skia.Color(isBoss ? '#f00' : '#0f0'));
    canvas.drawRect(
      { x, y: y - 15, width: width * healthPercent, height: 5 },
      healthPaint
    );
  };

  const drawBullet = (canvas, bullet) => {
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(bullet.direction === -1 ? '#0ff' : '#f00'));
    canvas.drawRect(
      { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height },
      paint
    );
  };

  const shoot = () => {
    const state = gameStateRef.current;
    if (state.player) {
      const bulletX = state.player.x + state.player.width / 2 - config.BULLET_SIZE / 2;
      state.bullets.push(new Bullet(bulletX, state.player.y, -1, config.BULLET_SIZE));
    }
  };

  return (
    <View style={styles.container}>
      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>VIDAS: {lives}</Text>
        <Text style={styles.hudText}>NIVEL: {level}</Text>
        <Text style={styles.hudText}>PUNTOS: {score}</Text>
        <Text style={styles.hudText}>RÉCORD: {highScore}</Text>
      </View>

      {/* Game Canvas */}
      <View {...panResponder.panHandlers} style={styles.canvasContainer}>
        <Canvas
          style={{ width: config.WIDTH, height: config.HEIGHT }}
          onDraw={onDraw}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={onPause}>
          <Text style={styles.controlButtonText}>PAUSA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.shootButton]} onPress={shoot}>
          <Text style={styles.controlButtonText}>DISPARAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#000',
  },
  hudText: {
    color: '#0f0',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#0f0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#000',
  },
  controlButton: {
    backgroundColor: '#000',
    borderColor: '#0f0',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#0f0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  shootButton: {
    borderColor: '#f00',
    shadowColor: '#f00',
  },
  controlButtonText: {
    color: '#0f0',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
