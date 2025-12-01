import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function VictoryScreen({ score, highScore, onRestart }) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>CONGRATULATIONS!</Text>
        <Text style={styles.message}>¡Has derrotado al jefe final!</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>PUNTUACIÓN FINAL:</Text>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.highScoreLabel}>RÉCORD: {highScore}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>JUGAR DE NUEVO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#ff0',
    textShadowColor: '#ff0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 8,
    marginBottom: 20,
  },
  message: {
    fontSize: 24,
    color: '#0f0',
    marginBottom: 40,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scoreLabel: {
    fontSize: 20,
    color: '#0f0',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 48,
    color: '#0ff',
    textShadowColor: '#0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginTop: 10,
    fontWeight: 'bold',
  },
  highScoreLabel: {
    fontSize: 18,
    color: '#ff0',
    textShadowColor: '#ff0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginTop: 15,
  },
  button: {
    backgroundColor: '#000',
    borderColor: '#0f0',
    borderWidth: 3,
    paddingVertical: 20,
    paddingHorizontal: 40,
    shadowColor: '#0f0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f0',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
