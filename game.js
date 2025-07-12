// Canvas setup and rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants - these define the core game mechanics
const SCALE = 2;                    // Pixel scale factor for retro look
const TILE_SIZE = 16;               // Size of each tile in pixels
const SCREEN_WIDTH = canvas.width / SCALE;   // Logical screen width
const SCREEN_HEIGHT = canvas.height / SCALE; // Logical screen height
const GRAVITY = 0.5;                // Downward acceleration force
const JUMP_FORCE = -10;             // Initial upward velocity when jumping
const MOVE_SPEED = 2;               // Horizontal movement speed

// Game state enumeration - tracks current game mode
const GameState = {
    MENU: 'menu',           // Main menu (not currently used)
    PLAYING: 'playing',     // Active gameplay
    GAME_OVER: 'game_over'  // Game over screen
};

/**
 * Main Game class - coordinates all game systems and logic
 * Handles game state, input, collision detection, and rendering
 */
class Game {
    constructor() {
        // Game state management
        this.state = GameState.PLAYING;
        this.keys = {};              // Tracks currently pressed keys
        
        // Player progress tracking
        this.score = 0;              // Points earned from collecting items
        this.lives = 7;              // Remaining lives (classic Jet Set Willy had 7)
        this.itemsCollected = 0;     // Items collected this game
        this.totalItems = 0;         // Total items across all rooms
        
        // World state
        this.currentRoom = 0;        // Index of active room
        this.rooms = [];             // Array of all game rooms
        this.entities = [];          // All game entities (currently just Willy)
        
        // Player character reference
        this.willy = null;
        
        this.init();
    }
    
    /**
     * Initialize the game - sets up rendering, input, world, and starts main loop
     */
    init() {
        // Configure canvas for pixel-perfect rendering
        ctx.imageSmoothingEnabled = false;  // Prevents blurry upscaling
        ctx.scale(SCALE, SCALE);            // Apply pixel scale factor
        
        // Initialize game systems
        this.setupInput();     // Keyboard event listeners
        this.createRooms();    // Build game world
        this.createWilly();    // Create player character
        this.startGameLoop();  // Begin main game loop
    }
    
    /**
     * Set up keyboard input handlers
     * Tracks key states for smooth movement and prevents default browser actions
     */
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            e.preventDefault();  // Prevent scrolling, etc.
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            e.preventDefault();
        });
    }
    
    /**
     * Create the player character (Willy) at starting position
     */
    createWilly() {
        this.willy = new Willy(32, 100);  // Starting coordinates
        this.entities.push(this.willy);   // Add to entity list
    }
    
    /**
     * Create all game rooms with layouts, items, hazards, and enemies
     * Room layouts use 1 for solid tiles, 0 for empty space
     */
    createRooms() {
        // Room 1: The Bathroom - simple layout with platforms
        const room1 = new Room('The Bathroom', [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // Top wall
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // Empty space
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1],  // Side platforms
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1],  // Center platform
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]   // Floor
        ]);
        
        // Add collectible items to room 1
        room1.addItem(100, 80);    // Item on upper area
        room1.addItem(200, 120);   // Item on right side
        room1.addHazard(120, 170, 'spike');  // Spike hazard
        
        this.rooms.push(room1);
        
        // Room 2: The Kitchen - more complex layout with gap and enemy
        const room2 = new Room('The Kitchen', [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // Top wall
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1],  // Platforms with gap
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1],  // Lower platform
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]   // Floor
        ]);
        
        // Add items and enemy to room 2
        room2.addItem(50, 50);     // Item in upper left
        room2.addItem(150, 100);   // Item in middle area
        room2.addEnemy(100, 100, 'horizontal');  // Moving enemy
        
        this.rooms.push(room2);
        
        // Calculate total items across all rooms for win condition
        this.totalItems = this.rooms.reduce((sum, room) => sum + room.items.length, 0);
    }
    
    /**
     * Get the currently active room
     * @returns {Room} The current room object
     */
    getCurrentRoom() {
        return this.rooms[this.currentRoom];
    }
    
    /**
     * Main game update loop - processes input, physics, collisions, and game logic
     * Called every frame by the game loop
     */
    update() {
        if (this.state !== GameState.PLAYING) return;
        
        // Process player input
        if (this.keys['ArrowLeft']) {
            this.willy.moveLeft();
        }
        if (this.keys['ArrowRight']) {
            this.willy.moveRight();
        }
        if (this.keys[' '] || this.keys['ArrowUp']) {
            this.willy.jump();
        }
        
        // Update player physics and movement
        this.willy.update(this.getCurrentRoom());
        
        // Update current room (enemies, animations, etc.)
        const room = this.getCurrentRoom();
        room.update();
        
        // Check item collection - remove collected items and award points
        room.items = room.items.filter(item => {
            if (this.willy.checkCollision(item)) {
                this.score += 100;           // Award points
                this.itemsCollected++;       // Track progress
                return false;                // Remove item from room
            }
            return true;                     // Keep item in room
        });
        
        // Check hazard collisions (spikes, etc.)
        room.hazards.forEach(hazard => {
            if (this.willy.checkCollision(hazard)) {
                this.killWilly();
            }
        });
        
        // Check enemy collisions
        room.enemies.forEach(enemy => {
            if (this.willy.checkCollision(enemy)) {
                this.killWilly();
            }
        });
        
        // Handle room transitions when player reaches screen edges
        if (this.willy.x > SCREEN_WIDTH - TILE_SIZE) {
            this.changeRoom(1);   // Move to next room
        } else if (this.willy.x < 0) {
            this.changeRoom(-1);  // Move to previous room
        }
        
        // Check win condition - all items collected
        if (this.itemsCollected === this.totalItems) {
            this.winGame();
        }
    }
    
    /**
     * Transition between rooms and position player appropriately
     * @param {number} direction - 1 for next room, -1 for previous room
     */
    changeRoom(direction) {
        // Cycle through rooms with wraparound
        this.currentRoom = (this.currentRoom + direction + this.rooms.length) % this.rooms.length;
        
        // Position player on appropriate side of new room
        if (direction > 0) {
            this.willy.x = TILE_SIZE;                    // Enter from left
        } else {
            this.willy.x = SCREEN_WIDTH - TILE_SIZE * 2; // Enter from right
        }
    }
    
    /**
     * Handle player death - lose a life and respawn or end game
     */
    killWilly() {
        this.lives--;
        if (this.lives <= 0) {
            this.state = GameState.GAME_OVER;  // End game when no lives left
        } else {
            this.willy.respawn();              // Reset player position
        }
    }
    
    /**
     * Handle game completion when all items are collected
     */
    winGame() {
        alert('Congratulations! You collected all items!');
        this.state = GameState.GAME_OVER;
    }
    
    /**
     * Main rendering method - draws the entire game screen
     * Called every frame by the game loop
     */
    render() {
        // Clear screen with black background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        
        if (this.state === GameState.PLAYING) {
            // Render active gameplay
            const room = this.getCurrentRoom();
            room.render(ctx);       // Draw room layout and entities
            this.willy.render(ctx); // Draw player character
            
            this.renderUI();        // Draw score, lives, etc.
        } else if (this.state === GameState.GAME_OVER) {
            // Render game over screen
            ctx.fillStyle = '#fff';
            ctx.font = '16px monospace';
            ctx.fillText('GAME OVER', SCREEN_WIDTH/2 - 40, SCREEN_HEIGHT/2);
            ctx.font = '8px monospace';
            ctx.fillText('Press F5 to restart', SCREEN_WIDTH/2 - 50, SCREEN_HEIGHT/2 + 20);
        }
    }
    
    /**
     * Render the user interface elements (score, lives, progress)
     */
    renderUI() {
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        
        // Display game statistics
        ctx.fillText(`Score: ${this.score}`, 10, 20);
        ctx.fillText(`Lives: ${this.lives}`, 10, 30);
        ctx.fillText(`Items: ${this.itemsCollected}/${this.totalItems}`, 10, 40);
        
        // Display current room name
        ctx.fillText(this.getCurrentRoom().name, SCREEN_WIDTH/2 - 40, 20);
    }
    
    /**
     * Start the main game loop using requestAnimationFrame
     * Provides smooth 60fps gameplay
     */
    startGameLoop() {
        const gameLoop = () => {
            this.update();                      // Process game logic
            this.render();                      // Draw everything
            requestAnimationFrame(gameLoop);    // Schedule next frame
        };
        gameLoop();
    }
}

/**
 * Willy class - the player character with physics, movement, and collision detection
 * Handles all player-specific behavior including jumping, movement, and world interaction
 */
class Willy {
    constructor(x, y) {
        // Position and size
        this.x = x;                    // Current X coordinate
        this.y = y;                    // Current Y coordinate
        this.width = TILE_SIZE;        // Character width for collision detection
        this.height = TILE_SIZE;       // Character height for collision detection
        
        // Physics properties
        this.vx = 0;                   // Horizontal velocity
        this.vy = 0;                   // Vertical velocity
        this.grounded = false;         // Whether player is standing on solid ground
        
        // Character state
        this.facing = 1;               // Direction facing: 1 = right, -1 = left
        
        // Respawn position
        this.spawnX = x;               // Original X position for respawning
        this.spawnY = y;               // Original Y position for respawning
    }
    
    /**
     * Move the character left
     */
    moveLeft() {
        this.vx = -MOVE_SPEED;  // Set leftward velocity
        this.facing = -1;       // Update facing direction
    }
    
    /**
     * Move the character right
     */
    moveRight() {
        this.vx = MOVE_SPEED;   // Set rightward velocity
        this.facing = 1;        // Update facing direction
    }
    
    /**
     * Make the character jump (only if grounded)
     */
    jump() {
        if (this.grounded) {
            this.vy = JUMP_FORCE;     // Apply upward velocity
            this.grounded = false;    // No longer on ground
        }
    }
    
    /**
     * Update player physics and position each frame
     * @param {Room} room - The current room for collision detection
     */
    update(room) {
        // Apply gravity to vertical velocity
        this.vy += GRAVITY;
        
        // Update position based on velocity
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply friction to horizontal movement
        this.vx *= 0.8;
        
        // Check and resolve collisions with room tiles
        this.checkRoomCollisions(room);
        
        // Kill player if they fall off the bottom of the screen
        if (this.y > SCREEN_HEIGHT) {
            game.killWilly();
        }
    }
    
    /**
     * Check and resolve collisions between player and room tiles
     * Uses tile-based collision detection for efficient processing
     * @param {Room} room - The current room to check collisions against
     */
    checkRoomCollisions(room) {
        this.grounded = false;  // Reset grounded state
        
        // Calculate which tiles the player overlaps
        const tileX = Math.floor(this.x / TILE_SIZE);
        const tileY = Math.floor(this.y / TILE_SIZE);
        const tileX2 = Math.floor((this.x + this.width - 1) / TILE_SIZE);
        const tileY2 = Math.floor((this.y + this.height - 1) / TILE_SIZE);
        
        // Check all tiles that the player overlaps
        for (let y = tileY; y <= tileY2; y++) {
            for (let x = tileX; x <= tileX2; x++) {
                if (room.getTile(x, y) === 1) {  // Solid tile
                    // Calculate tile boundaries
                    const tileLeft = x * TILE_SIZE;
                    const tileTop = y * TILE_SIZE;
                    const tileRight = tileLeft + TILE_SIZE;
                    const tileBottom = tileTop + TILE_SIZE;
                    
                    // Vertical collision - landing on top of tile
                    if (this.vy > 0 && this.y < tileTop && this.y + this.height > tileTop) {
                        this.y = tileTop - this.height;  // Position on top of tile
                        this.vy = 0;                     // Stop falling
                        this.grounded = true;            // Now on solid ground
                    }
                    
                    // Vertical collision - hitting tile from below
                    if (this.vy < 0 && this.y + this.height > tileBottom && this.y < tileBottom) {
                        this.y = tileBottom;  // Position below tile
                        this.vy = 0;          // Stop upward movement
                    }
                    
                    // Horizontal collision - hitting tile from left
                    if (this.vx > 0 && this.x < tileLeft && this.x + this.width > tileLeft) {
                        this.x = tileLeft - this.width;  // Position to left of tile
                        this.vx = 0;                     // Stop rightward movement
                    }
                    
                    // Horizontal collision - hitting tile from right
                    if (this.vx < 0 && this.x + this.width > tileRight && this.x < tileRight) {
                        this.x = tileRight;  // Position to right of tile
                        this.vx = 0;         // Stop leftward movement
                    }
                }
            }
        }
    }
    
    /**
     * Check if this character collides with another entity
     * Uses axis-aligned bounding box (AABB) collision detection
     * @param {Object} entity - Entity to check collision against
     * @returns {boolean} True if collision detected
     */
    checkCollision(entity) {
        return this.x < entity.x + entity.width &&      // Left edge check
               this.x + this.width > entity.x &&        // Right edge check
               this.y < entity.y + entity.height &&     // Top edge check
               this.y + this.height > entity.y;         // Bottom edge check
    }
    
    /**
     * Reset player to spawn position (used when player dies)
     */
    respawn() {
        this.x = this.spawnX;   // Reset to original X position
        this.y = this.spawnY;   // Reset to original Y position
        this.vx = 0;            // Clear horizontal velocity
        this.vy = 0;            // Clear vertical velocity
    }
    
    /**
     * Render the player character as a simple yellow figure with basic features
     * @param {CanvasRenderingContext2D} ctx - The rendering context
     */
    render(ctx) {
        // Draw main character body (yellow rectangle)
        ctx.fillStyle = '#ff0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw simple facial features (black pixels)
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 4, this.y + 4, 2, 2);   // Left eye
        ctx.fillRect(this.x + 10, this.y + 4, 2, 2);  // Right eye
        ctx.fillRect(this.x + 6, this.y + 10, 4, 2);  // Mouth
    }
}

/**
 * Room class - represents a game level with layout, items, hazards, and enemies
 * Each room contains a tile-based layout and collections of interactive entities
 */
class Room {
    constructor(name, layout) {
        this.name = name;           // Display name for the room
        this.layout = layout;       // 2D array: 1 = solid tile, 0 = empty space
        this.items = [];            // Collectible items in this room
        this.hazards = [];          // Dangerous elements (spikes, etc.)
        this.enemies = [];          // Moving enemies in this room
    }
    
    /**
     * Get the tile type at given coordinates
     * @param {number} x - Tile X coordinate
     * @param {number} y - Tile Y coordinate
     * @returns {number} 1 for solid tile, 0 for empty space
     */
    getTile(x, y) {
        // Return solid tile for out-of-bounds coordinates (acts as walls)
        if (y < 0 || y >= this.layout.length || x < 0 || x >= this.layout[0].length) {
            return 1;
        }
        return this.layout[y][x];
    }
    
    /**
     * Add a collectible item to this room
     * @param {number} x - X coordinate for the item
     * @param {number} y - Y coordinate for the item
     */
    addItem(x, y) {
        this.items.push(new Item(x, y));
    }
    
    /**
     * Add a hazard (dangerous element) to this room
     * @param {number} x - X coordinate for the hazard
     * @param {number} y - Y coordinate for the hazard
     * @param {string} type - Type of hazard ('spike', etc.)
     */
    addHazard(x, y, type) {
        this.hazards.push(new Hazard(x, y, type));
    }
    
    /**
     * Add an enemy to this room
     * @param {number} x - X coordinate for the enemy
     * @param {number} y - Y coordinate for the enemy
     * @param {string} type - Type of enemy movement ('horizontal', etc.)
     */
    addEnemy(x, y, type) {
        this.enemies.push(new Enemy(x, y, type));
    }
    
    /**
     * Update all dynamic entities in this room
     */
    update() {
        this.enemies.forEach(enemy => enemy.update());
    }
    
    /**
     * Render the entire room including tiles and all entities
     * @param {CanvasRenderingContext2D} ctx - The rendering context
     */
    render(ctx) {
        // Draw room layout (tiles)
        for (let y = 0; y < this.layout.length; y++) {
            for (let x = 0; x < this.layout[y].length; x++) {
                if (this.layout[y][x] === 1) {  // Solid tile
                    // Draw tile with simple 3D effect
                    ctx.fillStyle = '#444';  // Dark base
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = '#666';  // Lighter highlight
                    ctx.fillRect(x * TILE_SIZE + 1, y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                }
            }
        }
        
        // Draw all entities in the room
        this.items.forEach(item => item.render(ctx));      // Collectible items
        this.hazards.forEach(hazard => hazard.render(ctx)); // Dangerous elements
        this.enemies.forEach(enemy => enemy.render(ctx));   // Moving enemies
    }
}

/**
 * Item class - collectible objects that award points when collected
 * Features a simple bouncing animation to make them more visible
 */
class Item {
    constructor(x, y) {
        this.x = x;                // X position
        this.y = y;                // Y position
        this.width = TILE_SIZE;    // Width for collision detection
        this.height = TILE_SIZE;   // Height for collision detection
        this.animFrame = 0;        // Animation counter for bouncing effect
    }
    
    /**
     * Render the item with a bouncing animation
     * @param {CanvasRenderingContext2D} ctx - The rendering context
     */
    render(ctx) {
        // Update animation frame for smooth bouncing
        this.animFrame = (this.animFrame + 0.1) % (Math.PI * 2);
        const bounce = Math.sin(this.animFrame) * 2;  // Vertical bounce offset
        
        // Draw item as cyan square with white highlight
        ctx.fillStyle = '#0ff';  // Cyan base
        ctx.fillRect(this.x + 4, this.y + 4 + bounce, 8, 8);
        ctx.fillStyle = '#fff';  // White highlight
        ctx.fillRect(this.x + 6, this.y + 6 + bounce, 4, 4);
    }
}

/**
 * Hazard class - dangerous elements that kill the player on contact
 * Different types can have different visual representations
 */
class Hazard {
    constructor(x, y, type) {
        this.x = x;                // X position
        this.y = y;                // Y position
        this.width = TILE_SIZE;    // Width for collision detection
        this.height = TILE_SIZE;   // Height for collision detection
        this.type = type;          // Hazard type ('spike', etc.)
    }
    
    /**
     * Render the hazard based on its type
     * @param {CanvasRenderingContext2D} ctx - The rendering context
     */
    render(ctx) {
        if (this.type === 'spike') {
            // Draw spike as red triangle pointing upward
            ctx.fillStyle = '#f00';  // Red color for danger
            ctx.beginPath();
            ctx.moveTo(this.x + TILE_SIZE/2, this.y);        // Top point
            ctx.lineTo(this.x, this.y + TILE_SIZE);          // Bottom left
            ctx.lineTo(this.x + TILE_SIZE, this.y + TILE_SIZE); // Bottom right
            ctx.closePath();
            ctx.fill();
        }
    }
}

/**
 * Enemy class - moving hostile entities that kill the player on contact
 * Different types have different movement patterns
 */
class Enemy {
    constructor(x, y, type) {
        this.x = x;                // Current X position
        this.y = y;                // Current Y position
        this.width = TILE_SIZE;    // Width for collision detection
        this.height = TILE_SIZE;   // Height for collision detection
        this.type = type;          // Movement type ('horizontal', etc.)
        this.vx = 1;              // Horizontal velocity
        this.startX = x;          // Starting X position for movement bounds
        this.range = 80;          // Maximum distance to move from start
    }
    
    /**
     * Update enemy position and behavior based on type
     */
    update() {
        if (this.type === 'horizontal') {
            // Move horizontally back and forth
            this.x += this.vx;
            
            // Reverse direction when reaching movement bounds
            if (this.x > this.startX + this.range || this.x < this.startX) {
                this.vx = -this.vx;
            }
        }
    }
    
    /**
     * Render the enemy as a magenta figure with simple features
     * @param {CanvasRenderingContext2D} ctx - The rendering context
     */
    render(ctx) {
        // Draw main enemy body (magenta rectangle)
        ctx.fillStyle = '#f0f';  // Magenta color
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw simple facial features (black pixels)
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 4, this.y + 4, 2, 2);   // Left eye
        ctx.fillRect(this.x + 10, this.y + 4, 2, 2);  // Right eye
    }
}

// Initialize and start the game
const game = new Game();