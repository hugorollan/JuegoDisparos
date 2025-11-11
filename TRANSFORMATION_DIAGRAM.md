# Diagrama de Transformación del Proyecto

## 🔄 De Web a Mobile

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ANTES (Web App)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │  index.html  │────│   style.css  │────│   game.js    │         │
│  │              │    │              │    │              │         │
│  │ - Estructura │    │ - Estilos    │    │ - Game Loop  │         │
│  │ - Canvas     │    │ - Retro CSS  │    │ - Classes    │         │
│  │ - Pantallas  │    │ - Neon glow  │    │ - Audio      │         │
│  └──────────────┘    └──────────────┘    └──────────────┘         │
│                                                                      │
│  Tecnologías: HTML5 Canvas + Vanilla JavaScript + CSS              │
│  Plataforma: Solo navegadores web                                   │
│  Controles: Teclado (←→ SPACE P M)                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ TRANSFORMACIÓN
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DESPUÉS (Mobile App)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                        App.js                                 │  │
│  │  - Estado global del juego                                    │  │
│  │  - Navegación entre pantallas                                 │  │
│  │  - Configuración (CONFIG)                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│              ┌───────────────┼───────────────┐                      │
│              │               │               │                      │
│  ┌───────────▼─────┐  ┌─────▼─────┐  ┌─────▼──────┐               │
│  │   Screens       │  │ Components │  │   Utils    │               │
│  │                 │  │            │  │            │               │
│  │ - StartScreen   │  │ GameCanvas │  │ AsyncStore │               │
│  │ - GameScreen    │  │            │  │            │               │
│  │ - PauseScreen   │  │            │  │            │               │
│  │ - VictoryScreen │  │            │  │            │               │
│  │ - GameOver      │  │            │  │            │               │
│  └─────────────────┘  └────────────┘  └────────────┘               │
│                                                                      │
│  Tecnologías: React Native + Expo + AsyncStorage                   │
│  Plataformas: iOS (13+) / Android (6+) / Web                       │
│  Controles: Touch (Tocar y arrastrar + Botones)                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 Comparación de Características

| Característica | Web (Antes) | Mobile (Después) |
|----------------|-------------|------------------|
| **Renderizado** | HTML5 Canvas API | React Native Views |
| **Game Loop** | requestAnimationFrame | setInterval (60 FPS) |
| **Controles** | Keyboard Events | Touch/PanResponder |
| **Almacenamiento** | localStorage | AsyncStorage |
| **Navegación** | DOM show/hide | State-based screens |
| **Estilos** | CSS classes | StyleSheet API |
| **Audio** | Web Audio API | Expo AV (preparado) |
| **Deployment** | Static hosting | App Stores + Expo |
| **Plataformas** | 1 (Web) | 3 (iOS/Android/Web) |

## 🎮 Flujo de Pantallas

```
     ┌──────────────┐
     │ Start Screen │
     └──────┬───────┘
            │ [EMPEZAR]
            ▼
     ┌──────────────┐
     │ Game Screen  │◄─────┐
     │              │      │
     │ - HUD        │      │
     │ - GameCanvas │      │
     │ - Controls   │      │
     └──┬───┬───┬───┘      │
        │   │   │          │
        │   │   └──[PAUSA]─┤
        │   │              │
        │   │   ┌──────────▼─────┐
        │   │   │  Pause Screen  │
        │   │   │  [CONTINUAR]   │
        │   │   └────────────────┘
        │   │
        │   └─[Game Over]──►┌────────────────┐
        │                   │GameOver Screen │
        │                   │  [REINTENTAR]  │
        │                   └───────┬────────┘
        │                           │
        └─[Victoria]────────►┌──────▼────────┐
                             │Victory Screen │
                             │[JUGAR NUEVO]  │
                             └───────────────┘
```

## 🏗️ Arquitectura del Código

```
App.js
├── Estado Global
│   ├── screen (current screen)
│   ├── score
│   ├── highScore
│   ├── lives
│   └── level
│
├── Funciones
│   ├── loadHighScore()
│   ├── saveHighScore()
│   ├── startGame()
│   ├── handleGameOver()
│   ├── handleVictory()
│   └── handlePause()
│
└── Renderizado Condicional
    ├── StartScreen
    ├── GameCanvas
    │   ├── HUD (vidas, nivel, puntos)
    │   ├── Game Area
    │   │   ├── Stars (background)
    │   │   ├── Player (nave)
    │   │   ├── Enemy (nave enemiga)
    │   │   ├── Bullets (balas jugador)
    │   │   └── Enemy Bullets (balas enemigas)
    │   └── Controls (pausa, disparar)
    ├── PauseScreen
    ├── GameOverScreen
    └── VictoryScreen
```

## 🎯 Sistema de Juego

```
┌─────────────────────────────────────────────┐
│          Game Loop (60 FPS)                  │
├─────────────────────────────────────────────┤
│                                              │
│  1. Update Player Position                  │
│     └─ Follow touch X coordinate            │
│                                              │
│  2. Update Enemy Position                   │
│     └─ Move left/right, bounce at edges     │
│                                              │
│  3. Enemy Shooting                          │
│     └─ Create bullet at interval            │
│                                              │
│  4. Update Bullets                          │
│     ├─ Move player bullets up               │
│     ├─ Check collision with enemy           │
│     │  ├─ Damage enemy                      │
│     │  └─ Next level or victory             │
│     └─ Remove off-screen bullets            │
│                                              │
│  5. Update Enemy Bullets                    │
│     ├─ Move enemy bullets down              │
│     ├─ Check collision with player          │
│     │  ├─ Reduce lives                      │
│     │  └─ Game over if lives = 0            │
│     └─ Remove off-screen bullets            │
│                                              │
│  6. Render All Game Objects                 │
│                                              │
└─────────────────────────────────────────────┘
```

## 🔧 Configuración del Juego

```javascript
CONFIG = {
  WIDTH: SCREEN_WIDTH,          // Adaptativo al dispositivo
  HEIGHT: SCREEN_HEIGHT - 100,  // Espacio para controles
  PLAYER_SPEED: 8,              // Más rápido para touch
  BULLET_SPEED: 10,             // Más rápido para mobile
  BASE_ENEMY_SPEED: 3,          // Ajustado para mobile
  BASE_ENEMY_SHOOT_INTERVAL: 2000, // Milisegundos
  BOSS_LEVEL: 5                 // Nivel del jefe final
}
```

## 📦 Dependencias Clave

```
expo (54.0.23)
├── Plataforma de desarrollo
└── Gestión de builds

react-native (0.81.5)
├── Framework UI
└── Componentes nativos

@react-native-async-storage
├── Almacenamiento persistente
└── High scores

expo-av (16.0.7)
└── Audio (preparado para futuro)
```

## 🚀 Proceso de Desarrollo

```
1. Instalación
   npm install --legacy-peer-deps
        │
        ▼
2. Desarrollo
   npm start
        │
        ├─► Expo DevTools abre en navegador
        │
        └─► QR code mostrado
             │
             ▼
3. Testing
   Escanear QR con Expo Go
        │
        ▼
4. Build
   expo build:android / expo build:ios
        │
        ▼
5. Deploy
   Subir a App Store / Google Play
```

---

**Transformación completada exitosamente** ✅
