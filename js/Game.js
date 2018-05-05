var ingame = {
    preload: gamePreload,
    create: gameCreate,
    update: gameUpdate
}

var player;
var cameraBound;

// Load resources
function gamePreload() {
    // Loading tilemaps
    game.load.tilemap("start", "assets/start.json", null, Phaser.Tilemap.TILED_JSON)

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

var map;

var rightKey;
var leftKey;

// Create game objects
function gameCreate() {
    game.physics.startSystem(Phaser.Physics.ARCADE); // Initializes the physics engine
    game.physics.arcade.gravity.y = 1800; // Uses imaginary units
    game.stage.backgroundColor = "#00CCEE"; // Colour hex code

    // good example of loading a player animation spritesheet
    // https://phaser.io/tutorials/making-your-first-phaser-3-game/part5

    // binds the UP arrow key to the jump function
    var jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    jumpKey.onDown.add(jump, this);

    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

    map = game.add.tilemap(); // Creates a blank tilemap
    map.addTilesetImage("tiles");

    const worldWidth = 400;
    const worldHeight = 19;
    const blockWidth = 32;
    const blockHeight = 32;

    // Don't know why we need this layer, but it makes the blank layers suddenly work
    var layer0 = map.create("Layer0", worldWidth, worldHeight, blockWidth, blockHeight)
    layer0.resizeWorld();
    
    // Last two #'s define the offset of the layer
    var layer1 = map.createBlankLayer("Layer1", worldWidth, worldHeight, blockWidth, blockHeight);
    // TODO? layer1.resizeWorld(); // make sure that the player doesn't fall out of the world

    // index, x, y
    map.putTile(0, 0, 0, layer1);
    map.putTile(1, 4, 4, layer1);
    map.putTile(2, 4, 19, layer1);
    
    //addMap(start, startWidth, startHeight);
    
    //var tmAdd = game.add.tilemap("start");
    //tmAdd.addTilesetImage("tiles");

    player = game.add.sprite(40, 40, "player");
    game.physics.arcade.enable(player); // Gives player a physics body
    player.body.bounce.x = 0.05; // Slightly bouncy off wall
    player.body.collideWorldBounds = true; // Collide with the 

    // TODO
    //game.camera.follow(player)

    // TODO use fixedToCamera for hud
    // player.fixedToCamera = true;

    // Moves the camera to the bottom of the world
    game.camera.y = 300;

    console.log("Ready!");
}

var xOffset = 0;

function addMap(toAdd, yoffset) {
    //var tmAdd = game.add.tilemap(toAdd, 32, 32, 30, 19);
    //tmAdd.addTilesetImage("tiles");
    
    /*
    for (var x = 0; x < tmAdd.width; x++) {
        for (var y = 0; y < tmAdd.height; y++) {
            map.putTile(tmAdd.getTile(x, y), x, y)
        }
    }*/
    //xOffset += tmAdd.width;
    
    //game.scene.removeChild(toAdd);
}

function jump() {
    player.body.velocity.y = -800;
}

var cameraOff = 0

// Update game objects
function gameUpdate() {
    // Makes the camera move to the left when the player pushes the viewport forward
    cameraOff = Math.max(cameraOff, player.x + 16 - (WIDTH / 2));
    game.camera.x = cameraOff;

    // Maps controls to velocity
    if (rightKey.isDown) {
        player.body.velocity.x = 300;
    } else if (leftKey.isDown) {
        player.body.velocity.x = -300;
    } else {
        player.body.velocity.x = 0;
    }

    // Prevents the player from going far left
    if (player.x <= cameraOff && player.body.velocity.x < 0) {
        player.x = cameraOff;
        player.body.velocity.x = 0;
    } else if (player.x < cameraOff) {
        player.x = cameraOff;
    }
}

const startWidth = 20;
const startHeight = 19;
const start = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
