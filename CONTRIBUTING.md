# Contributing to Space Shooter Retro

First off, thank you for considering contributing to Space Shooter Retro! It's people like you that make this game better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Specify your browser and OS version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would work**

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Style Guide

- Use 4 spaces for indentation (no tabs)
- Use camelCase for variable and function names
- Use PascalCase for class names
- Use UPPER_CASE for constants
- Add JSDoc comments for functions and classes
- Keep functions small and focused
- Avoid global variables when possible
- Use meaningful variable names

Example:
```javascript
/**
 * Creates a new bullet instance
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} direction - Direction of movement (-1 or 1)
 * @returns {Bullet} New bullet instance
 */
function createBullet(x, y, direction) {
    return new Bullet(x, y, direction);
}
```

### CSS Style Guide

- Use kebab-case for class names
- Group related properties together
- Use shorthand properties when possible
- Add comments for complex sections

## Testing

- Test your changes in multiple browsers (Chrome, Firefox, Safari, Edge)
- Ensure the game runs smoothly at 60 FPS
- Check that all screens (start, game, pause, victory, game over) work correctly
- Verify sound effects and music work properly
- Test keyboard controls thoroughly

## Development Setup

1. Clone your fork:
```bash
git clone https://github.com/your-username/JuegoDisparos.git
cd JuegoDisparos
```

2. Open `index.html` in your browser or use a local server:
```bash
python -m http.server 8000
```

3. Make your changes and test thoroughly

4. Commit and push your changes

## Project Structure

```
JuegoDisparos/
├── index.html          # Main HTML file
├── style.css           # Styling
├── game.js             # Game logic
├── README.md           # Documentation
├── LICENSE             # MIT License
└── CONTRIBUTING.md     # This file
```

## Questions?

Feel free to open an issue with your question or contact the maintainer directly.

## Recognition

Contributors will be recognized in the project. Thank you for your contributions!
