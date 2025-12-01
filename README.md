# Space Shooter Retro 🚀 - Mobile Edition

Una versión móvil del clásico juego de disparos espaciales estilo retro, desarrollado con React Native y Expo. ¡Experimenta la nostalgia de los juegos arcade de los 90 en tu dispositivo móvil!

## 🎮 Características

- **Gráficos Retro**: Estilo auténtico pixel-art con efectos de neón brillante
- **Dificultad Progresiva**: Cada nivel aumenta la velocidad y frecuencia de disparo del enemigo
- **Batallas contra Jefes**: Enfrenta enemigos jefe desafiantes desde el nivel 5
- **Sistema de Puntuación Alta**: Guarda tus mejores desempeños con AsyncStorage
- **Controles Táctiles**: Controles suaves optimizados para dispositivos móviles
- **Múltiples Pantallas**: Menú de inicio, pausa, game over y pantallas de victoria

## 🕹️ Cómo Jugar

### Controles
- **Tocar y arrastrar** - Mover la nave espacial
- **Botón DISPARAR** - Disparar balas
- **Botón PAUSA** - Pausar/Reanudar juego

### Objetivo
- Destruye enemigos disparándoles
- Evita las balas enemigas para preservar tus vidas (tienes 3 vidas)
- Progresa a través de niveles con dificultad creciente
- ¡Derrota al jefe en el nivel 5 y más allá para ganar!

### Puntuación
- Cada golpe al enemigo otorga puntos basados en el nivel actual
- Puntuación = Nivel × 100 puntos por enemigo derrotado
- ¡Intenta superar tu puntuación más alta!

## 🚀 Comenzar

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn
- Expo CLI
- Para desarrollo móvil:
  - Aplicación Expo Go en tu dispositivo iOS/Android, o
  - Emulador iOS/Android

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/hugorollan/Tercer-Proyecto-Juego-de-Disparos.git
cd Tercer-Proyecto-Juego-de-Disparos
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo de Expo:
```bash
npm start
```

4. Ejecuta en tu dispositivo o emulador:
```bash
# Para iOS
npm run ios

# Para Android
npm run android

# Para web (navegador)
npm run web
```

### Usando Expo Go

1. Instala la aplicación Expo Go en tu dispositivo móvil:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Escanea el código QR que aparece en la terminal después de ejecutar `npm start`

## 📁 Estructura del Proyecto

```
Tercer-Proyecto-Juego-de-Disparos/
├── App.js                      # Componente principal de la aplicación
├── app.json                    # Configuración de Expo
├── package.json                # Dependencias del proyecto
├── babel.config.js             # Configuración de Babel
├── assets/                     # Recursos (iconos, imágenes)
├── src/
│   ├── components/
│   │   └── GameCanvas.js       # Componente principal del canvas del juego
│   ├── screens/
│   │   ├── StartScreen.js      # Pantalla de inicio
│   │   ├── GameOverScreen.js   # Pantalla de game over
│   │   ├── VictoryScreen.js    # Pantalla de victoria
│   │   └── PauseScreen.js      # Pantalla de pausa
│   └── classes/
│       └── GameObjects.js      # Clases del juego (Player, Enemy, Bullet)
└── original-web-version/       # Versión web original del juego
    ├── index.html
    ├── game.js
    └── style.css
```

## 🎨 Arquitectura del Juego

### Componentes Principales

- **App.js**: Gestiona el estado global del juego y la navegación entre pantallas
- **GameCanvas**: Renderiza el juego usando React Native Skia para gráficos de alta performance
- **GameObjects**: Clases para Player, Enemy, Bullet con lógica de física y colisiones
- **Screens**: Componentes de UI para diferentes estados del juego

### Stack Tecnológico

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma de desarrollo y despliegue
- **@shopify/react-native-skia**: Biblioteca de renderizado de gráficos de alto rendimiento
- **@react-native-async-storage/async-storage**: Almacenamiento persistente
- **expo-av**: Sistema de audio (preparado para futuras implementaciones)

## 🛠️ Personalización

Puedes personalizar fácilmente el juego modificando el objeto `CONFIG` en `App.js`:

```javascript
const CONFIG = {
  WIDTH: SCREEN_WIDTH,        // Ancho del canvas
  HEIGHT: SCREEN_HEIGHT - 100,// Alto del canvas
  PLAYER_SPEED: 8,            // Velocidad de movimiento del jugador
  BULLET_SPEED: 10,           // Velocidad de las balas
  ENEMY_SIZE: 60,             // Tamaño del enemigo en píxeles
  BASE_ENEMY_SPEED: 3,        // Velocidad inicial del enemigo
  BOSS_LEVEL: 5               // Nivel cuando aparece el jefe
};
```

## 📱 Despliegue

### Construcción para Producción

```bash
# Construir para Android
expo build:android

# Construir para iOS
expo build:ios
```

### Publicar en las Tiendas

Sigue la [documentación de Expo](https://docs.expo.dev/distribution/introduction/) para publicar tu aplicación en:
- Apple App Store
- Google Play Store

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, consulta [CONTRIBUTING.md](CONTRIBUTING.md) para obtener detalles.

### Formas de Contribuir

- 🐛 Reportar errores
- 💡 Sugerir nuevas características
- 🎨 Mejorar gráficos o sonido
- 📝 Mejorar documentación
- 🔧 Enviar pull requests

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- Inspirado en juegos arcade clásicos como Space Invaders y Galaga
- Construido con pasión por la estética de los juegos retro
- Gracias a la comunidad de código abierto

## 📊 Compatibilidad

| Plataforma | Soportado | Versión |
|------------|-----------|---------|
| iOS        | ✅        | 13.0+   |
| Android    | ✅        | 6.0+    |
| Web        | ✅        | Moderno |

## 🎯 Roadmap

- [x] Migrar a React Native con Expo
- [x] Implementar controles táctiles
- [x] Sistema de puntuación persistente
- [ ] Agregar power-ups (escudos, fuego rápido, etc.)
- [ ] Implementar diferentes tipos de enemigos
- [ ] Agregar efectos de partículas para explosiones
- [ ] Sistema de música y efectos de sonido
- [ ] Sistema de logros
- [ ] Implementar tabla de clasificación con backend

## 📞 Contacto

Hugo Rollan - [@hugorollan](https://github.com/hugorollan)

Link del Proyecto: [https://github.com/hugorollan/Tercer-Proyecto-Juego-de-Disparos](https://github.com/hugorollan/Tercer-Proyecto-Juego-de-Disparos)

---

## 🔄 Migración desde la Versión Web

Este proyecto fue transformado de una aplicación web HTML5 Canvas a React Native con Expo. La versión web original se puede encontrar en la carpeta `original-web-version/`.

### Principales Cambios:
- Canvas HTML5 → React Native Skia
- Controles de teclado → Controles táctiles
- LocalStorage → AsyncStorage
- Web Audio API → Expo AV (preparado)
- CSS → StyleSheet de React Native

---

Hecho con ❤️ y React Native