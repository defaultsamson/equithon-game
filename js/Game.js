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
    game.load.image("player", "assets/circular belgua.png");

    game.load.image("juicebox", "assets/juice.png"); //at

    game.load.image("healthbar", "assets/healthBar.png");

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
var jumpKey;

var glucoseBar;

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
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    // jumpKey.onDown.add(jump, this);

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
    player.scale.setTo(0.25, 0.25);
    game.physics.enable(player); // Gives player a physics body
    player.body.bounce.x = 0.05; // Slightly bouncy off wall
    player.body.collideWorldBounds = true; // Collide with the 

    juicebox = game.add.sprite(100, 100, "juicebox"); //at help random spawning...
    game.physics.enable(juicebox); //gives juicebox sprite a physics body at
    juicebox.body.allowGravity = false;
    juicebox.body.immovable = true;

    glucoseBar = game.add.sprite(0, 0, "healthbar")
    glucoseBar.fixedToCamera = true;
    glucoseBar.width = 800;
    glucoseBar.length = 32;
    
    // TODO
    //game.camera.follow(player)

    // TODO use fixedToCamera for hud
    // player.fixedToCamera = true;

    // Moves the camera to the bottom of the world
    game.camera.y = 300;

    console.log("Ready!");
}

var xOffset = 0;
var bloodSugar = 90; //at to keep track of bloodsugar on metre

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
    touchingGround = false;
    player.body.velocity.y = -800;
}

const INCHING = 0.5
var cameraOff = 0
var touchingGround = false;

function changeBloodSugar(degOfChange) {
    bloodSugar += degOfChange;
    
    console.log("dank")
}

//check over code; how to randomly spawn juiceboxes; way to show metre in a fixed number; 


var vibrateTicks = 0;
var up = false;

// Update game objects
function gameUpdate() {
    // Makes the camera move to the left when the player pushes the viewport forward
    cameraOff = Math.max(cameraOff + INCHING, player.x + 16 - (2 * WIDTH / 3));
    game.camera.x = cameraOff;

    // Maps controls to velocity
    if (rightKey.isDown && leftKey.isDown) {
        player.body.velocity.x = 0;
    } else if (rightKey.isDown) {
        player.body.velocity.x = 300;
    } else if (leftKey.isDown) {
        player.body.velocity.x = -300;
    } else {
        player.body.velocity.x *= 0.75;
    }

    // Jump controls
    if (touchingGround && jumpKey.isDown) {
        jump();
        --player.y;
    }

    // Prevents the player from going far left
    if (player.x <= cameraOff && player.body.velocity.x < 0) {
        player.x = cameraOff;
        player.body.velocity.x = 0;
    } else if (player.x < cameraOff) {
        player.x = cameraOff;
    }

    // check if touching ground and handle collisions
    this.game.physics.arcade.collide(player, layer0, (sprite, tile) => {if (sprite.body.onFloor()) {
                                                                            touchingGround = true;
                                                                        }
                                                                    });

    //at - if collision happens between player and juicebox
    this.game.physics.arcade.collide(player, juicebox, () => {changeBloodSugar(10)}); //check line 114
}

function endGame() {

}
