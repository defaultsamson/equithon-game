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
    game.load.image("player", "assets/player0.png");
    game.load.image("juicebox", "assets/juice.png"); //at
    game.load.image("healthbar", "assets/healthBar.png");
    game.load.image("arrow", "assets/arrow.png");

    game.load.image("sky0", "assets/sky0.png");
    game.load.image("sky1", "assets/sky1.png");
    game.load.image("sky2", "assets/sky2.png");
    game.load.image("sky3", "assets/sky3.png");
    game.load.image("sky4", "assets/sky4.png");


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
var glucoseTextPrefix = "Glucose Level (mg/dL): ";
var glucoseText;

const WORLD_WIDTH = 400;
const WORLD_HEIGHT = 19;
const BLOCK_WIDTH = 32;
const BLOCK_HEIGHT = 32;

const glucoseBarX = 50;
const glucoseBarY = 32;
const energyMove = 0.0625;
const energyJump = 0.5;

var sky0;
var sky1;
var sky2;
var sky3;
var sky4;

// Create game objects
function gameCreate() {
    game.physics.startSystem(Phaser.Physics.ARCADE); // Initializes the physics engine
    game.physics.arcade.gravity.y = 1800; // Uses imaginary units
    game.stage.backgroundColor = "#81DAEA"; // Colour hex code

    // good example of loading a player animation spritesheet
    // https://phaser.io/tutorials/making-your-first-phaser-3-game/part5

    const skyScale = 600 / 220;

    sky0 = game.add.tileSprite(0, 0, WIDTH / skyScale, HEIGHT / skyScale, "sky0");
    sky0.scale.setTo(skyScale, skyScale);
    sky0.fixedToCamera = true;
    sky1 = game.add.tileSprite(0, 0, WIDTH / skyScale, HEIGHT / skyScale, "sky1");
    sky1.scale.setTo(skyScale, skyScale);
    sky1.fixedToCamera = true;
    sky2 = game.add.tileSprite(0, 0, WIDTH / skyScale, HEIGHT / skyScale, "sky2");
    sky2.scale.setTo(skyScale, skyScale);
    sky2.fixedToCamera = true;
    sky3 = game.add.tileSprite(0, 0, WIDTH / skyScale, HEIGHT / skyScale, "sky3");
    sky3.scale.setTo(skyScale, skyScale);
    sky3.fixedToCamera = true;
    sky4 = game.add.tileSprite(0, 0, WIDTH / skyScale, HEIGHT / skyScale, "sky4");
    sky4.scale.setTo(skyScale, skyScale);
    sky4.fixedToCamera = true;

    // binds the UP arrow key to the jump function
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    // jumpKey.onDown.add(jump, this);

    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

    map = game.add.tilemap(); // Creates a blank tilemap
    map.addTilesetImage("tiles");
    map.setCollisionBetween(0, 999);

    layer0 = map.create("layer0", WORLD_WIDTH, WORLD_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
    layer0.resizeWorld();

    addMap("start");
    addMap("house");
    addMap("house");

    player = game.add.sprite(40, 40, "player");
    player.scale.setTo(0.25, 0.25);
    game.physics.enable(player); // Gives player a physics body
    player.body.bounce.x = 0.05; // Slightly bouncy off wall
    player.body.collideWorldBounds = true; // Collide with the

    juicebox = game.add.sprite(500, 200, "juicebox"); //at help random spawning...
    juicebox.scale.setTo(0.5, 0.5);
    game.physics.enable(juicebox); //gives juicebox sprite a physics body at
    juicebox.body.allowGravity = false;
    juicebox.body.immovable = true;

    arrow = game.add.sprite(400, 0, "arrow"); //pointer on health bar
    arrow.fixedToCamera = true;

    glucoseBar = game.add.sprite(glucoseBarX, glucoseBarY, "healthbar");
    glucoseBar.fixedToCamera = true;
    glucoseBar.width = 700;
    glucoseBar.height = 20;

    var textStyle = {
        'font': "16pt Comic Sans MS"
    }
    glucoseText = game.add.text(300, 0, glucoseTextPrefix, textStyle);
    glucoseText.fixedToCamera = true;

    // TODO
    //game.camera.follow(player)

    // TODO use fixedToCamera for hud
    // player.fixedToCamera = true;

    // Moves the camera to the bottom of the world
    game.camera.y = 300;

    console.log("Ready!");
}

var xOffset = 0;
var bloodSugar = 100; //at to keep track of bloodsugar on meter

const DIRT_INDEX = 1;

function addMap(toAdd) {

    var taMap = game.cache.getJSON(toAdd);
    var data = taMap.layers[0].data;
    var width = taMap.layers[0].width;
    var height = taMap.layers[0].height;

    var yOffset = getYOffset(data, width, height);

    var solidLayer = true;

    for (var x = 0; x < width; x++) {

        if (!solidLayer) {
            for (var y = 0; y < height; y++) {
                map.putTile(data[x + width * y] - 1, x + xOffset, y + yOffset);
            }
        } else {
            var y = 0;
            var yCoord;
            while ((yCoord = y + yOffset) < WORLD_HEIGHT) {
                var index = x + width * y;
                // if the index is within the range of the array
                if (index < width * height) {
                    var id = data[x + width * y] - 1;
                    if (id >= 0) {
                        // Tile contains something, use it
                        map.putTile(id, x + xOffset, yCoord);
                    } else {
                        // Tile is empty
                        // Check if all the other blocks in this column are empty
                        var empty = true; // Assume that they are
                        var y2 = y + 1; // start searching from the next block
                        var yCoord2;
                        while ((yCoord2 = y2 + yOffset) < WORLD_HEIGHT) {
                            var index2 = x + width * y2;
                            if (index2 < width * height) {
                                var id2 = data[x + width * y2] - 1;
                                if (id2 >= 0) {
                                    // Tile contains something
                                    empty = false;
                                    break;
                                }
                            } else {
                                // below the file
                                break;
                            }
                            y2++;
                        }

                        if (empty) {
                            var y3 = y;
                            var yCoord3;
                            // replace all the following blocks with dirt
                            while ((yCoord3 = y3 + yOffset) < WORLD_HEIGHT) {
                                map.putTile(DIRT_INDEX, x + xOffset, yCoord3);
                                y3++;
                            }
                            break;
                        } // Otherwise continue down the column
                    }
                } else {
                    // below the file, fill with dirty things
                    map.putTile(DIRT_INDEX, x + xOffset, yCoord);
                }
                y++;
            }
        }
    }
    xOffset += width;
}

function getYOffset(data, width, height) {
    var startHeight = 0;
    for (var y = 0; y < WORLD_HEIGHT; y++) {
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
            offsetHeight++;
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
    bloodSugar -= energyJump;
}

const CAMERA_SPEED = 0.5
var cameraOff = 0
var touchingGround = false;

function changeBloodSugar(degOfChange) {
    bloodSugar += degOfChange;
    juicebox.destroy();
    console.log(bloodSugar)
}

function _mapArrow(sugar) {
    // Old: (sugar - min) * (right side of health bar - left side of health bar) / (highest blood sugar - lowest blood sugar)
    // return (sugar - 40) * (750 - 50) / (240 - 40);

    // http://www.wolframalpha.com/input/?i=parabola+%7B(40,+0),(240,+700),(100,+350)%7D
    return -1 / 60 * sugar * sugar + 49 / 6 * sugar - 300
    
}

function renderArrow() {
    // health bar is 0-700 pixels, want 40-240
    arrow.cameraOffset.x = _mapArrow(bloodSugar);
}
//check over code; how to randomly spawn juiceboxes; way to show metre in a fixed number;


var vibrateTicks = 0;

// Update game objects
function gameUpdate() {
    // Makes the camera move to the left when the player pushes the viewport forward
    cameraOff = Math.max(cameraOff + CAMERA_SPEED, player.x + 16 - (2 * WIDTH / 3));
    game.camera.x = cameraOff;

    // Maps controls to velocity
    if (rightKey.isDown && leftKey.isDown) {
        player.body.velocity.x = 0;
    } else if (rightKey.isDown) {
        player.body.velocity.x = 300;
        bloodSugar -= energyMove;
    } else if (leftKey.isDown) {
        player.body.velocity.x = -300;
        bloodSugar -= energyMove;
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
    this.game.physics.arcade.collide(player, layer0);
    if (player.body.onFloor()) {
        touchingGround = true;
    }
    else {
        touchingGround = false;
    }

    //at - if collision happens between player and juicebox
    this.game.physics.arcade.collide(player, juicebox, () => {
        changeBloodSugar(30);
    }); //check line 114
    glucoseText.setText(glucoseTextPrefix + Math.round(bloodSugar * 1000) / 1000);

    renderArrow();

    bloodSugar -= 1 / (2 ** 10);

    var delta = game.camera.x - skyPrevX;
    skyPrevX = game.camera.x;
    sky0.tilePosition.x -= delta * 0.2 * 0.2;
    sky1.tilePosition.x -= delta * 0.3 * 0.3;
    sky2.tilePosition.x -= delta * 0.4 * 0.4;
    sky3.tilePosition.x -= delta * 0.5 * 0.5;
    sky4.tilePosition.x -= delta * 0.6 * 0.6;
}

var skyPrevX = 0;

function endGame() {

}
