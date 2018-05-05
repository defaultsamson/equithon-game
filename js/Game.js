var ingame = {
    preload: gamePreload,
    create: gameCreate,
    update: gameUpdate
}

var player;

// Load resources
function gamePreload() {
    // Loading tilemaps
    //game.load.tilemap("start", "assets/start.json", null, Phaser.Tilemap.TILED_JSON)
    game.load.json("start", "assets/start.json");
    game.load.json("house", "assets/house.json");

    // Loading Images
    game.load.image("tiles", "assets/tiles.png");
    game.load.image("player", "assets/player.png");

    /* // Spritesheet loading example
    this.load.spritesheet('dude', 
    'src/games/firstgame/assets/dude.png',
    { frameWidth: 32, frameHeight: 48 }
    );
    */
}

var map;
var layer0;

var rightKey;
var leftKey;

const worldWidth = 400;
const worldHeight = 19;
const blockWidth = 32;
const blockHeight = 32;

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
    map.setCollisionBetween(0, 999);

    layer0 = map.create("layer0", worldWidth, worldHeight, blockWidth, blockHeight)
    layer0.resizeWorld();

    addMap("start")
    addMap("house")
    addMap("house")

    player = game.add.sprite(40, 40, "player");
    game.physics.enable(player); // Gives player a physics body
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

function addMap(toAdd) {

    var taMap = game.cache.getJSON(toAdd);
    var data = taMap.layers[0].data;
    var width = taMap.layers[0].width;
    var height = taMap.layers[0].height;

    var yOffset = getYOffset(data, width, height);

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            map.putTile(data[x + width * y] - 1, x + xOffset, y + yOffset);
        }
    }

    xOffset += width
}

function getYOffset(data, width, height) {
    var startHeight = 0;
    for (var y = 0; y < worldHeight; y++) {
        if (map.getTile(xOffset - 1, y)) {
            break;
        } else {
            startHeight++;
        }
    }

    var offsetHeight = 0;
    for (var y = 0; y < height; y++) {
        // Empty tile
        if (data[y * width] == 0) {
            offsetHeight++
        } else {
            break;
        }
    }

    // If xOffset == 0 then this is the first block, just place normally
    return xOffset == 0 ? 0 : startHeight - offsetHeight;
}

function jump() {
    player.body.velocity.y = -800;
}

const INCHING = 0.5
var cameraOff = 0

// Update game objects
function gameUpdate() {
    // Makes the camera move to the left when the player pushes the viewport forward
    cameraOff = Math.max(cameraOff + INCHING, player.x + 16 - (2 * WIDTH / 3));
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

    this.game.physics.arcade.collide(player, layer0);

    game.debug.body(player)
}
