import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function StartScreen({ highScore, onStart, isMusicEnabled, onToggleMusic }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SPACE SHOOTER</Text>
        <Text style={styles.subtitle}>Año 1990</Text>
        <View style={styles.highScoreDisplay}>
          <Text style={styles.highScoreText}>RÉCORD: {highScore}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>EMPEZAR A JUGAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onToggleMusic}>
        <Text style={styles.secondaryButtonText}>
          {isMusicEnabled ? '🔊 MÚSICA: ON' : '🔇 MÚSICA: OFF'}
        </Text>
      </TouchableOpacity>

      <View style={styles.controlsInfo}>
        <Text style={styles.controlsText}>CONTROLES:</Text>
        <Text style={styles.controlsText}>TOCAR PANTALLA PARA MOVER</Text>
        <Text style={styles.controlsText}>BOTÓN DISPARAR</Text>
        <Text style={styles.controlsText}>BOTÓN PAUSA</Text>
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0f0',
    textShadowColor: '#0f0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 24,
    color: '#0a0',
    marginTop: 10,
  },
  highScoreDisplay: {
    marginTop: 20,
  },
  highScoreText: {
    fontSize: 20,
    color: '#ff0',
    textShadowColor: '#ff0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  button: {
    backgroundColor: '#000',
    borderColor: '#0f0',
    borderWidth: 3,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginVertical: 10,
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
  secondaryButton: {
    borderColor: '#0a0',
    shadowColor: '#0a0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a0',
    letterSpacing: 2,
  },
  controlsInfo: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  controlsText: {
    fontSize: 14,
    color: '#0a0',
    lineHeight: 24,
  },
});
