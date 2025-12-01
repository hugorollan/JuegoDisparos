import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const [playerX, setPlayerX] = useState(config.WIDTH / 2 - config.PLAYER_SIZE / 2);
  const [enemyX, setEnemyX] = useState(config.WIDTH / 2 - config.ENEMY_SIZE / 2);
  const [enemyDirection, setEnemyDirection] = useState(1);
  const [enemyHealth, setEnemyHealth] = useState(level * 2);
  const [maxEnemyHealth, setMaxEnemyHealth] = useState(level * 2);
  const [bullets, setBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [stars, setStars] = useState([]);
  const [isBoss, setIsBoss] = useState(level >= 5);
  
  const gameLoopRef = useRef(null);
  const lastEnemyShotRef = useRef(0);
  const touchXRef = useRef(config.WIDTH / 2);

  useEffect(() => {
    // Initialize stars
    const newStars = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        id: i,
        x: Math.random() * config.WIDTH,
        y: Math.random() * config.HEIGHT,
        size: Math.random() * 2 + 1
      });
    }
    setStars(newStars);

    // Start game loop
    gameLoopRef.current = setInterval(() => {
      updateGame();
    }, 1000 / 60); // 60 FPS

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  const updateGame = () => {
    // Update player position
    setPlayerX(prev => {
      const diff = touchXRef.current - prev;
      if (Math.abs(diff) > 5) {
        if (diff > 0 && prev < config.WIDTH - config.PLAYER_SIZE) {
          return prev + Math.min(config.PLAYER_SPEED, diff);
        } else if (diff < 0 && prev > 0) {
          return prev + Math.max(-config.PLAYER_SPEED, diff);
        }
      }
      return prev;
    });

    // Update enemy position
    setEnemyX(prev => {
      const newX = prev + (config.BASE_ENEMY_SPEED + (level - 1) * 0.5) * enemyDirection;
      if (newX <= 0 || newX >= config.WIDTH - config.ENEMY_SIZE) {
        setEnemyDirection(d => -d);
        return prev;
      }
      return newX;
    });

    // Enemy shooting
    const currentTime = Date.now();
    const shootInterval = Math.max(500, config.BASE_ENEMY_SHOOT_INTERVAL - (level - 1) * 200);
    if (currentTime - lastEnemyShotRef.current > shootInterval) {
      const bulletX = enemyX + config.ENEMY_SIZE / 2 - config.ENEMY_BULLET_SIZE / 2;
      setEnemyBullets(prev => [...prev, { id: Date.now(), x: bulletX, y: 50 + config.ENEMY_SIZE }]);
      lastEnemyShotRef.current = currentTime;
    }

    // Update bullets
    setBullets(prev => {
      const newBullets = prev.map(bullet => ({
        ...bullet,
        y: bullet.y - config.BULLET_SPEED
      })).filter(bullet => {
        // Check collision with enemy
        if (
          bullet.x < enemyX + config.ENEMY_SIZE &&
          bullet.x + config.BULLET_SIZE > enemyX &&
          bullet.y < 50 + config.ENEMY_SIZE &&
          bullet.y + config.BULLET_SIZE * 3 > 50
        ) {
          const newHealth = enemyHealth - 1;
          setEnemyHealth(newHealth);
          
          if (newHealth <= 0) {
            const points = level * 100;
            setScore(score + points);

            if (isBoss) {
              onVictory(score + points);
            } else {
              // Next level
              const newLevel = level + 1;
              setLevel(newLevel);
              setEnemyHealth(newLevel * 2);
              setMaxEnemyHealth(newLevel * 2);
              setIsBoss(newLevel >= 5);
              setBullets([]);
              setEnemyBullets([]);
            }
          }
          return false;
        }
        
        return bullet.y > 0;
      });
      return newBullets;
    });

    // Update enemy bullets
    setEnemyBullets(prev => {
      const newBullets = prev.map(bullet => ({
        ...bullet,
        y: bullet.y + config.BULLET_SPEED
      })).filter(bullet => {
        // Check collision with player
        if (
          bullet.x < playerX + config.PLAYER_SIZE &&
          bullet.x + config.ENEMY_BULLET_SIZE > playerX &&
          bullet.y < config.HEIGHT - config.PLAYER_SIZE - 20 + config.PLAYER_SIZE &&
          bullet.y + config.ENEMY_BULLET_SIZE * 3 > config.HEIGHT - config.PLAYER_SIZE - 20
        ) {
          const newLives = lives - 1;
          setLives(newLives);

          if (newLives <= 0) {
            onGameOver(score);
          }
          return false;
        }
        
        return bullet.y < config.HEIGHT;
      });
      return newBullets;
    });
  };

  const handleTouch = (event) => {
    const { locationX } = event.nativeEvent;
    touchXRef.current = locationX;
  };

  const shoot = () => {
    const bulletX = playerX + config.PLAYER_SIZE / 2 - config.BULLET_SIZE / 2;
    const bulletY = config.HEIGHT - config.PLAYER_SIZE - 20;
    setBullets(prev => [...prev, { id: Date.now(), x: bulletX, y: bulletY }]);
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

      {/* Game Area */}
      <View 
        style={[styles.gameArea, { width: config.WIDTH, height: config.HEIGHT }]}
        onTouchMove={handleTouch}
        onTouchStart={handleTouch}
      >
        {/* Stars */}
        {stars.map(star => (
          <View
            key={star.id}
            style={[
              styles.star,
              {
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
              }
            ]}
          />
        ))}

        {/* Player */}
        <View style={[styles.player, { left: playerX, top: config.HEIGHT - config.PLAYER_SIZE - 20 }]}>
          <View style={styles.playerShip} />
          <View style={styles.playerCockpit} />
        </View>

        {/* Enemy */}
        <View style={[
          styles.enemy,
          {
            left: enemyX,
            top: 50,
            width: isBoss ? config.ENEMY_SIZE * 1.5 : config.ENEMY_SIZE,
            height: isBoss ? config.ENEMY_SIZE * 1.5 : config.ENEMY_SIZE,
            borderTopColor: isBoss ? '#f00' : '#ff0',
          }
        ]}>
          <View style={styles.healthBarContainer}>
            <View style={styles.healthBarBg} />
            <View 
              style={[
                styles.healthBar,
                {
                  width: `${(enemyHealth / maxEnemyHealth) * 100}%`,
                  backgroundColor: isBoss ? '#f00' : '#0f0',
                }
              ]} 
            />
          </View>
        </View>

        {/* Player Bullets */}
        {bullets.map(bullet => (
          <View
            key={bullet.id}
            style={[
              styles.bullet,
              {
                left: bullet.x,
                top: bullet.y,
                width: config.BULLET_SIZE,
                height: config.BULLET_SIZE * 3,
                backgroundColor: '#0ff',
              }
            ]}
          />
        ))}

        {/* Enemy Bullets */}
        {enemyBullets.map(bullet => (
          <View
            key={bullet.id}
            style={[
              styles.bullet,
              {
                left: bullet.x,
                top: bullet.y,
                width: config.ENEMY_BULLET_SIZE,
                height: config.ENEMY_BULLET_SIZE * 3,
                backgroundColor: '#f00',
              }
            ]}
          />
        ))}
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
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: '#0f0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  gameArea: {
    backgroundColor: '#000',
    position: 'relative',
    alignSelf: 'center',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
  player: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  playerShip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0ff',
  },
  playerCockpit: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: 10,
    height: 10,
    backgroundColor: '#fff',
  },
  enemy: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderStyle: 'solid',
    borderTopWidth: 60,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  healthBarContainer: {
    position: 'absolute',
    top: -15,
    left: 0,
    right: 0,
    height: 5,
  },
  healthBarBg: {
    position: 'absolute',
    width: '100%',
    height: 5,
    backgroundColor: '#333',
  },
  healthBar: {
    position: 'absolute',
    height: 5,
  },
  bullet: {
    position: 'absolute',
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
