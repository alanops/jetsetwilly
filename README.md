# Jet Set Willy - Web Game

A modern HTML5/JavaScript recreation of the classic 1984 platform game "Jet Set Willy" by Matthew Smith.

## 🎮 Play Now

**[Play Jet Set Willy Online](https://jetsetwilly-production.up.railway.app)**

## Overview

This is a browser-based 2D platformer game featuring the iconic character Willy navigating through various rooms, collecting items while avoiding hazards and enemies. The game captures the essence of the original 8-bit classic with modern web technologies.

## Features

- **Classic Platformer Mechanics**: Jump, run, and navigate through challenging rooms
- **Multiple Rooms**: Explore different themed areas including "The Bathroom" and "The Kitchen"
- **Collectible Items**: Gather all items to win the game
- **Hazards & Enemies**: Avoid spikes and moving enemies
- **Lives System**: Traditional arcade-style lives mechanic
- **Score Tracking**: Points awarded for collecting items
- **Pixel Art Style**: Retro aesthetic with crisp pixel rendering

## Game Controls

- **Arrow Keys**: Move left/right
- **Space Bar or Up Arrow**: Jump
- **F5**: Restart game (when game over)

## Technical Implementation

### Architecture

The game is built using vanilla JavaScript with HTML5 Canvas for rendering:

- **Game Class**: Main game loop, state management, and coordination
- **Willy Class**: Player character with physics and collision detection
- **Room Class**: Level layout, tile-based collision system
- **Entity Classes**: Items, hazards, and enemies with specialized behaviors

### Key Components

- **Physics Engine**: Custom gravity, jumping, and collision detection
- **Tile-Based Levels**: 16x16 pixel tile system for level design
- **Entity System**: Modular design for game objects
- **Animation System**: Frame-based animations for items and characters

## Getting Started

### Prerequisites

- Modern web browser with HTML5 Canvas support
- No additional dependencies or build tools required

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jetsetwilly
   ```

2. Open `index.html` in your web browser
   ```bash
   # Or use a local server (recommended):
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

### Development Setup

For development with live reload:

```bash
# Install a simple HTTP server (optional)
npm install -g live-server

# Start development server
live-server
```

## Project Structure

```
jetsetwilly/
├── index.html          # Main HTML entry point
├── game.js             # Complete game implementation
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## Game Design

### Level Design Philosophy

- **Room-Based Navigation**: Traditional Jet Set Willy room-to-room exploration
- **Challenging Platforming**: Precise jumping and timing required
- **Exploration Rewards**: Items placed to encourage thorough exploration

### Visual Style

- **Pixel Perfect**: No anti-aliasing for authentic retro feel
- **Limited Color Palette**: Classic 8-bit inspired colors
- **Simple Geometric Shapes**: Clear, readable game elements

## Contributing

### Development Guidelines

1. **Code Style**: Use consistent indentation and naming conventions
2. **Comments**: Document complex game logic and physics calculations
3. **Testing**: Manually test all game mechanics before committing
4. **Performance**: Maintain 60fps gameplay on modern browsers

### Adding New Features

1. **New Rooms**: Add room layouts to `createRooms()` method
2. **New Entities**: Extend base entity classes
3. **New Mechanics**: Integrate with existing physics system
4. **UI Improvements**: Enhance the rendering and UI systems

### Git Workflow

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Test thoroughly
4. Submit pull request for review

## License

This project is a tribute to the original Jet Set Willy game. Created for educational and entertainment purposes.

## Acknowledgments

- **Matthew Smith**: Original creator of Jet Set Willy (1984)
- **Software Projects**: Original publisher
- Inspired by the classic 8-bit platformer genre

## Technical Notes

### Browser Compatibility

- **Chrome/Chromium**: Fully supported
- **Firefox**: Fully supported  
- **Safari**: Fully supported
- **Edge**: Fully supported

### Performance Considerations

- Optimized collision detection using tile-based system
- Efficient rendering with minimal draw calls
- 60fps target framerate on modern hardware

---

**🎮 [Play Online](https://jetsetwilly-production.up.railway.app) | 💻 [Local Setup](#installation) | 🧑‍💻 [Contribute](#contributing)**