# Guía de Inicio Rápido - Space Shooter Retro Mobile

## Requisitos Previos

1. **Node.js** instalado (v14 o superior)
   - Descarga desde: https://nodejs.org/

2. **Aplicación Expo Go** en tu dispositivo móvil
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

## Instalación y Ejecución

### Paso 1: Instalar Dependencias

```bash
npm install --legacy-peer-deps
```

### Paso 2: Iniciar el Servidor de Desarrollo

```bash
npm start
```

Esto abrirá Expo Dev Tools en tu navegador y mostrará un código QR.

### Paso 3: Ejecutar en tu Dispositivo

1. Abre la aplicación **Expo Go** en tu dispositivo móvil
2. Escanea el código QR que aparece en la terminal o navegador
3. ¡El juego se cargará en tu dispositivo!

## Comandos Disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run android    # Ejecuta en emulador Android
npm run ios        # Ejecuta en simulador iOS (solo macOS)
npm run web        # Ejecuta en navegador web
```

## Controles del Juego

- **Tocar y arrastrar**: Mover la nave espacial
- **Botón DISPARAR**: Disparar balas
- **Botón PAUSA**: Pausar/reanudar el juego

## Solución de Problemas

### Error de dependencias
Si encuentras errores de dependencias, ejecuta:
```bash
npm install --legacy-peer-deps
```

### El servidor no inicia
Limpia la caché de Metro:
```bash
npx expo start -c
```

### La aplicación no se conecta
Asegúrate de que tu computadora y dispositivo móvil están en la misma red WiFi.

## Estructura del Proyecto

```
├── App.js                      # Componente principal
├── app.json                    # Configuración de Expo
├── package.json                # Dependencias
├── src/
│   ├── components/
│   │   └── GameCanvas.js       # Canvas del juego
│   └── screens/
│       ├── StartScreen.js      # Pantalla de inicio
│       ├── GameOverScreen.js   # Pantalla de game over
│       ├── VictoryScreen.js    # Pantalla de victoria
│       └── PauseScreen.js      # Pantalla de pausa
└── original-web-version/       # Versión web original
```

## Próximos Pasos

- Personaliza los colores en los archivos de pantalla
- Modifica la configuración del juego en `App.js` (CONFIG)
- Añade efectos de sonido con expo-av
- Crea iconos personalizados para la aplicación

## Recursos Adicionales

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de React Native](https://reactnative.dev/)
- [Guía de Expo Go](https://expo.dev/client)

## Soporte

Si encuentras problemas, consulta:
- README.md para información detallada
- Issues en el repositorio de GitHub
