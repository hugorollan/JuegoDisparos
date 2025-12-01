import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PauseScreen({ onResume }) {
  return (
    <View style={styles.container}>
      <View style={styles.menuBox}>
        <Text style={styles.title}>PAUSA</Text>
        <Text style={styles.text}>Presiona el botón para continuar</Text>
        <TouchableOpacity style={styles.button} onPress={onResume}>
          <Text style={styles.buttonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBox: {
    backgroundColor: '#000',
    borderColor: '#0f0',
    borderWidth: 3,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#0f0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0f0',
    textShadowColor: '#0f0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 8,
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    color: '#0a0',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#000',
    borderColor: '#0f0',
    borderWidth: 3,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#0f0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f0',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
