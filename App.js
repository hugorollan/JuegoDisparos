import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import { Canvas, useCanvasEffect } from '@shopify/react-native-skia';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameCanvas from './src/components/GameCanvas';
import StartScreen from './src/screens/StartScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import VictoryScreen from './src/screens/VictoryScreen';
import PauseScreen from './src/screens/PauseScreen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Game configuration
const CONFIG = {
  WIDTH: SCREEN_WIDTH,
  HEIGHT: SCREEN_HEIGHT - 100,
  PLAYER_SPEED: 8,
  PLAYER_SIZE: 40,
  BULLET_SPEED: 10,
  BULLET_SIZE: 5,
  ENEMY_SIZE: 60,
  ENEMY_BULLET_SIZE: 5,
  BASE_ENEMY_SPEED: 3,
  BASE_ENEMY_SHOOT_INTERVAL: 2000,
  BOSS_LEVEL: 5,
  HIGH_SCORE_KEY: '@spaceShooterHighScore'
};

export default function App() {
  const [screen, setScreen] = useState('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem(CONFIG.HIGH_SCORE_KEY);
      if (savedScore !== null) {
        setHighScore(parseInt(savedScore, 10));
      }
    } catch (error) {
      console.error('Failed to load high score:', error);
    }
  };

  const saveHighScore = async (newScore) => {
    try {
      if (newScore > highScore) {
        await AsyncStorage.setItem(CONFIG.HIGH_SCORE_KEY, newScore.toString());
        setHighScore(newScore);
      }
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };

  const startGame = () => {
    setScreen('game');
    setScore(0);
    setLives(3);
    setLevel(1);
  };

  const handleGameOver = (finalScore) => {
    saveHighScore(finalScore);
    setScreen('gameOver');
  };

  const handleVictory = (finalScore) => {
    saveHighScore(finalScore);
    setScreen('victory');
  };

  const handlePause = () => {
    setScreen('pause');
  };

  const handleResume = () => {
    setScreen('game');
  };

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {screen === 'start' && (
        <StartScreen 
          highScore={highScore}
          onStart={startGame}
          isMusicEnabled={isMusicEnabled}
          onToggleMusic={toggleMusic}
        />
      )}

      {screen === 'game' && (
        <GameCanvas
          config={CONFIG}
          onGameOver={handleGameOver}
          onVictory={handleVictory}
          onPause={handlePause}
          score={score}
          setScore={setScore}
          lives={lives}
          setLives={setLives}
          level={level}
          setLevel={setLevel}
          highScore={highScore}
          isMusicEnabled={isMusicEnabled}
        />
      )}

      {screen === 'pause' && (
        <PauseScreen onResume={handleResume} />
      )}

      {screen === 'gameOver' && (
        <GameOverScreen 
          score={score}
          highScore={highScore}
          onRestart={startGame}
        />
      )}

      {screen === 'victory' && (
        <VictoryScreen 
          score={score}
          highScore={highScore}
          onRestart={startGame}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
