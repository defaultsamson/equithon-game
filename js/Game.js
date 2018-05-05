var ingame = {
    preload: gamePreload,
    create: gameCreate,
    update: gameUpdate
}

var player;

// Load resources
function gamePreload() {
    // Loading tilemaps
    //game.load.tilemap("empty", "assets/empty.json", null, Phaser.Tilemap.TILED_JSON)

    // Loading Images
    game.load.image("tiles", "assets/tiles.png")
    game.load.image("player", "assets/player.png")

    /* // Spritesheet loading example
    this.load.spritesheet('dude', 
    'src/games/firstgame/assets/dude.png',
    { frameWidth: 32, frameHeight: 48 }
    );
    */
}

// Create game objects
function gameCreate() {
    game.physics.startSystem(Phaser.Physics.ARCADE); // Initializes the physics engine
    game.physics.arcade.gravity.y = 1800; // Uses imaginary units
    game.stage.backgroundColor = '#00CCEE'; // Colour hex code

    // good example of loading a player animation spritesheet
    // https://phaser.io/tutorials/making-your-first-phaser-3-game/part5

    // binds the UP arrow key to the jump function
    var jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    jumpKey.onDown.add(jump, this);

    var map = game.add.tilemap() // Creates a blank tilemap
    var tileset = map.addTilesetImage("tiles");

    const worldWidth = 40
    const worldHeight = 40
    const blockWidth = 32
    const blockHeight = 32
    
    // Don't know why we need this layer, but it makes the blank layers suddenly work
    var layer0 = map.create("Layer0", worldWidth, worldHeight, blockWidth, blockHeight)
    
    // Last two #'s define the offset of the layer
    var layer1 = map.createBlankLayer("Layer1", worldWidth, worldHeight, blockWidth, blockHeight)
    // TODO? layer1.resizeWorld(); // make sure that the player doesn't fall out of the world
    
    // index, x, y
    map.putTile(0, 0, 0, layer1)
    map.putTile(1, 4, 4, layer1)

    player = game.add.sprite(40, 40, 'player')
    game.physics.arcade.enable(player); // Gives player a physics body
    player.body.bounce.x = 0.05; // Slightly bouncy off wall
    player.body.collideWorldBounds = true; // Collide with the 
    
    // TODO
    game.camera.follow(player)
    
    // TODO use fixedToCamera for hud
    // player.fixedToCamera = true;

    console.log("Ready!");
}

function jump() {
    player.body.velocity.y = -800;
}

// Update game objects
function gameUpdate() {}
