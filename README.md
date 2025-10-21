# Space Shooter Retro 🚀

A classic retro-style space shooter game built with HTML5 Canvas and vanilla JavaScript. Experience the nostalgia of 1990s arcade games with modern web technologies!

## 🎮 Features

- **Retro Graphics**: Authentic pixel-art style with neon glow effects
- **Progressive Difficulty**: Each level increases enemy speed and shooting frequency
- **Boss Battles**: Face challenging boss enemies starting from level 5
- **High Score System**: Track your best performances with localStorage
- **Retro Sound Effects**: Procedurally generated chiptune music and sound effects
- **Responsive Controls**: Smooth keyboard controls with pause functionality
- **Multiple Screens**: Start menu, pause screen, game over, and victory screens

## 🕹️ How to Play

### Controls
- **← →** (Arrow Keys) - Move spaceship left and right
- **SPACE** - Shoot bullets
- **P** - Pause/Resume game
- **M** - Toggle music on/off

### Objective
- Destroy enemies by shooting them
- Avoid enemy bullets to preserve your lives (you have 3 lives)
- Progress through levels with increasing difficulty
- Defeat the boss at level 5 and beyond to win!

### Scoring
- Each enemy hit awards points based on the current level
- Score = Level × 100 points per enemy defeated
- Try to beat your high score!

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional dependencies required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hugorollan/JuegoDisparos.git
cd JuegoDisparos
```

2. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or simply drag and drop `index.html` into your browser window.

### Running with a Local Server (Optional)

For the best experience, you can run it with a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 📁 Project Structure

```
JuegoDisparos/
├── index.html          # Main HTML file with game structure
├── style.css           # Retro-styled CSS with neon effects
├── game.js             # Game logic, classes, and engine
├── README.md           # This file
├── LICENSE             # MIT License
└── CONTRIBUTING.md     # Contribution guidelines
```

## 🎨 Game Architecture

### Core Components

- **AudioSystem**: Manages retro chiptune music and sound effects using Web Audio API
- **Player**: Handles player spaceship movement and shooting
- **Enemy**: Manages enemy behavior, movement, and health
- **Bullet**: Handles bullet physics for both player and enemy projectiles
- **Game State**: Centralized state management for the entire game

### Technology Stack

- **HTML5 Canvas**: For rendering game graphics
- **Web Audio API**: For procedural sound generation
- **Vanilla JavaScript**: No frameworks or libraries
- **CSS3**: For UI styling with retro effects

## 🛠️ Customization

You can easily customize the game by modifying the `CONFIG` object in `game.js`:

```javascript
const CONFIG = {
    WIDTH: 800,              // Canvas width
    HEIGHT: 600,             // Canvas height
    PLAYER_SPEED: 5,         // Player movement speed
    BULLET_SPEED: 7,         // Bullet velocity
    ENEMY_SIZE: 60,          // Enemy size in pixels
    BASE_ENEMY_SPEED: 2,     // Initial enemy speed
    BOSS_LEVEL: 5            // Level when boss appears
};
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 🎨 Improve graphics or sound
- 📝 Improve documentation
- 🔧 Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic arcade games like Space Invaders and Galaga
- Built with passion for retro gaming aesthetics
- Thanks to the open-source community

## 📊 Browser Compatibility

| Browser | Supported | Version |
|---------|-----------|---------|
| Chrome  | ✅        | 60+     |
| Firefox | ✅        | 55+     |
| Safari  | ✅        | 11+     |
| Edge    | ✅        | 79+     |

## 🎯 Roadmap

- [ ] Add power-ups (shields, rapid fire, etc.)
- [ ] Implement different enemy types
- [ ] Add particle effects for explosions
- [ ] Create mobile touch controls
- [ ] Add achievement system
- [ ] Implement leaderboard with backend

## 📞 Contact

Hugo Rollan - [@hugorollan](https://github.com/hugorollan)

Project Link: [https://github.com/hugorollan/JuegoDisparos](https://github.com/hugorollan/JuegoDisparos)

---

Made with ❤️ and JavaScript