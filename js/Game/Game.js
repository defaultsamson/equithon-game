var ingame = {
    preload: gamePreload,
    create: gameCreate,
    update: gameUpdate
}

//anjie trying end screen
/*
var wonGame = {
    preload: wonPreload,
    create: wonCreate,
    update: wonUpdate
}

function wonPreload() {
    game.load.image("endJuice", "assets/juice.png");
}
function wonCreate() {
    console.log("hi");
}


function wonUpdate() {
    console.log("hi")
}
*/

//

var completed = false;

var player;
var playerText;

var map;
var layer1;

var glucoseBar;
var glucoseTextPrefix = "Glucose Level (mg/dL): ";
var glucoseText;

var goose;
var sky0;
var sky1;
var sky2;
var sky3;
var sky4;

var cameraOff = 0;

var DEBUG = false;

// Load resources
function gamePreload() {
    // Loading tilemaps
    //game.load.tilemap("start", "assets/start.json", null, Phaser.Tilemap.TILED_JSON)
    game.load.json("start", "assets/start.json");
    game.load.json("ruins", "assets/ruins.json");
    game.load.json("test1", "assets/test1.json");
    game.load.json("test2", "assets/test2.json");
    game.load.json("test3", "assets/test3.json");
    game.load.json("test4", "assets/test4.json");
    game.load.json("test5", "assets/test5.json");
    game.load.json("test6", "assets/test6.json");

    game.load.json("entrance", "assets/sec2/entrance.json");
    game.load.json("classroom", "assets/sec2/classroom.json");

    game.load.json("belunga", "assets/belunga.json");
    game.load.json("spiral", "assets/spiral.json");

    // Loading Images
    game.load.image("tiles", "assets/tiles.png");
    game.load.image("juicebox", "assets/juice.png"); //at
    game.load.image("healthbar", "assets/healthBar.png");
    game.load.image("arrow", "assets/arrow.png");
    game.load.image("goose", "assets/goosesprite.png");

    game.load.image("sky0", "assets/sky0.png");
    game.load.image("sky1", "assets/sky1.png");
    game.load.image("sky2", "assets/sky2.png");
    game.load.image("sky3", "assets/sky3.png");
    game.load.image("sky4", "assets/sky4.png");

    // 105 by 133 images, 2 frames
    game.load.spritesheet("player", "assets/player.png", 105, 133, 2);
    game.load.spritesheet("goose", "assets/goosesprite.png", 440, 580, 2);

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
    game.physics.arcade.gravity.y = GRAVITY; // Uses imaginary units
    game.stage.backgroundColor = "#81DAEA"; // Colour hex code

    // good example of loading a player animation spritesheet
    // https://phaser.io/tutorials/making-your-first-phaser-3-game/part5

    const skyScale = HEIGHT / 220;

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

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    iKey = game.input.keyboard.addKey(Phaser.Keyboard.I);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

    if (DEBUG) {
        jetpackKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    }

    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    lKey = game.input.keyboard.addKey(Phaser.Keyboard.L);

    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    jKey = game.input.keyboard.addKey(Phaser.Keyboard.J);

    map = game.add.tilemap(); // Creates a blank tilemap
    map.addTilesetImage("tiles");

    layer1 = map.create("layer1", WORLD_WIDTH, WORLD_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
    layer1.resizeWorld();
    game.physics.arcade.enable(layer1);
    map.setCollision(COLLISION_IDS, true, layer1);

    initMapPieces();
    addMapByName("start");
    /*
    addMap("ruins");
    addMap("test1");
    addMap("test2");
    addMap("test3");
    addMap("test4");
    addMap("test5");
    addMap("test6");
    addMap("test4");
    addMap("test2");
    addMap("test2");
    addMap("test2");
    addMap("test2");
    addMap("ruins");
    addMap("ruins");
    addMap("ruins");*/
    generateRandomMap(380);

    spawnJuice();

    player = game.add.sprite(210, 400, "player");
    player.scale.setTo(.2, .2);
    //player.scale.setTo(PLAYER_SCALE, PLAYER_SCALE);
    game.physics.enable(player); // Gives player a physics body
    player.body.bounce.x = 0.05;
    //game.physics.arcade.enable(layers[3]); // Slightly bouncy off wall
    player.body.collideWorldBounds = true; // Collide with the
    player.animations.add('walk', [0, 1], 4, true);
    player.anchor.setTo(0.5, 0.5);

    glucoseBar = game.add.sprite(glucoseBarX, glucoseBarY, "healthbar");
    glucoseBar.fixedToCamera = true;
    glucoseBar.width = 700;
    glucoseBar.height = 20;

    goose = game.add.sprite(WIDTH / 2, 200, "goose");
    goose.scale.setTo(0.1, 0.1);
    game.physics.enable(goose);
    goose.body.allowGravity = false;
    goose.body.immovable = true;

    var textStyle = {
        font: "16pt Verdana"
    }
    glucoseText = game.add.text(250, 3, glucoseTextPrefix, textStyle);
    glucoseText.fixedToCamera = true;

    arrow = game.add.sprite(400, 30, "arrow"); //pointer on health bar
    arrow.fixedToCamera = true;
    arrow.width = 20;
    arrow.height = 40;

    // TODO
    //game.camera.follow(player)

    // TODO use fixedToCamera for hud
    // player.fixedToCamera = true;

    // Moves the camera to the bottom of the world
    game.camera.y = 300;

    if (DEBUG) {
        playerText = game.add.text(player.x, player.y, "(" + player.x + ", " + player.y + ")", textStyle);
        alert("Debug mode on.");
    }

    var loseStyle = {
        font: "86pt Verdana",
        fill: "white"
    }
    
    var winStyle = {
        font: "30pt Verdana",
        fill: "white",
        align: "left"
    }
    loseText = game.add.text(80, 100, "Game Over", loseStyle);
    loseText.fixedToCamera = true;
    loseText.visible = false;
    
    winText = game.add.text(80,100, "Congratulations! \n You got home with \nyour sugar balanced.", winStyle);
    winText.fixedToCamera=true;
    winText.visible=false; 

    var textStyle = {
        font: "22pt Verdana",
        fill: "white",
        align: "center"
    };
    continueText = game.add.text(150, 230, "Press Space or Enter to continue", textStyle);
    continueText.fixedToCamera = true;
    continueText.visible = false;

    var playButton1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var playButton2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    var playButton3 = game.input.keyboard.addKey(Phaser.Keyboard.S);
    playButton1.onDown.add(restartGame, this);
    playButton2.onDown.add(restartGame, this);
    playButton3.onDown.add(restartGame, this);

    console.log("Ready!");
}

function updatePlayerText() {
    newx = player.x;
    newy = player.y;
    playerText.setText("(" + newx + ", " + newy + ")");
    playerText.x = newx;
    playerText.y = newy;
}

var respawnPlayer = 6;

// Update game objects
function gameUpdate() {

    if (respawnPlayer > 0) {
        player.x = 210;
        player.y = 400;
        respawnPlayer--;
    }

    if (!dead) {
        // Makes the camera move to the left when the player pushes the viewport forward
        cameraOff = Math.max(cameraOff + CAMERA_SPEED, player.x + 16 - (2 * WIDTH / 3));
        game.camera.x = cameraOff;

        updateControls();

        // TODO test this shit, it's messed
        // End game if player falls off screen
        if (player.x + 16 < game.camera.x) {
            endGame();
        }
        

        //anjie trying to go to end screen
        if (player.x>game.camera.x+750) {
            
            winText.visible=true;
            /*if (dead) {
                winText.visible=false;
                restartGame();
            }*/
            completed=true;
            arrow.visible=false;
            
            console.log("omw to winning")
            //finish();        
        }
    }

    // check if touching ground and handle collisions
    this.game.physics.arcade.collide(player, layer1);
    if (player.body.onFloor()) {
        touchingGround = true;
    } else {
        touchingGround = false;
    }

    if (!dead) {
        updateSugar()
        if (DEBUG) {
            updatePlayerText();
        }
    }
    moveSky();
    if (completed) bloodSugar=100;
}

var dead = false;

var deadFlash = false;
var deadFlashStart;
var deadFlashStartTimer = 0;
var deadFlashTimer = 0;

function restartGame() {
    if (dead) {
        dead = false;
        cameraOff = 0;
        game.camera.x = 0;
        bloodSugar = 100;
        respawnPlayer = 6;
        loseText.visible = false;
        continueText.visible = false;
    }
}

//anjie trying to access wonGamestate
/*
function finish(){
    console.log("finishing");
    game.state.start("wonGame");
}*/


//fixing arrow motion
function endGame() {
    

    dead = true;
    /*
    deadFlash = false;
    deadFlashStart = 3500;
    deadFlashStartTimer = Date.now();
    deadFlashTimer = 0;*/

    loseText.visible = true;
    continueText.visible = true;
    console.log("Game over");
}

