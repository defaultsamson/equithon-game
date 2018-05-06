var menu = {
    preload: menuPreload,
    create: menuCreate,
    update: menuUpdate
}

var playButton;

function menuPreload() {
    // Load images, resources, fonts, etc...
    game.load.image("menuHealthbar", "assets/healthBar.png");
    game.load.image("menuArrow", "assets/arrow.png");

    game.load.spritesheet("keyboards", "assets/keyboards.png", 675, 135, 3);
    game.load.spritesheet("menuMan", "assets/player.png", 105, 133, 2);

    game.load.image("menuJuice", "assets/juice.png");
}

function menuCreate() {
    // create objects
    var playButton1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var playButton2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    playButton1.onDown.add(continueMenu, this);
    playButton2.onDown.add(continueMenu, this);

    var skipButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
    skipButton.onDown.add(gotoIngame, this);

    var titleStyle = {
        font: "80pt Verdana",
        fill: "white"
    };
    titleText = game.add.text(50, 140, "Glucose Run", titleStyle);
    titleText.fixedToCamera = true;

    var textStyle = {
        font: "26pt Verdana",
        fill: "white",
        align: "center"
    };
    continueText = game.add.text(118, 400, "Press Space or Enter to continue", textStyle);
    continueText.fixedToCamera = true;
    continueText.visible = false;

    var creditStyle = {
        font: "16pt Verdana",
        fill: "white",
        align: "center"
    };
    creditText = game.add.text(188, 300, "A game by Samson Close, William Cai,\nAnjalli Thatte, Melody Li", creditStyle);
    creditText.fixedToCamera = true;

    skipText = game.add.text(290, 445, "Press S to skip intro", creditStyle);
    skipText.fixedToCamera = true;
    skipText.visible = false;

    flashStart = 2000;
    flashStartTimer = Date.now();

    storyText1 = game.add.text(88, 100, "The purpose of this byte-sized\nplatformer is to raise awareness for\nthe increasing population that\nfaces the hardships of diabetes.", textStyle);
    storyText1.fixedToCamera = true;
    storyText1.visible = false;

    storyText2 = game.add.text(110, 100, "We hope that in our efforts\nyou will take it upon yourself\n to learn a little more about those\ndiabetes and how you can help\nthose who have it.", textStyle);
    storyText2.fixedToCamera = true;
    storyText2.visible = false;

    keyboards = game.add.sprite(63, 126, "keyboards");
    keyboards.animations.add('flash', [0, 1, 2], 2, true);
    keyboards.visible = false;

    storyText3 = game.add.text(130, 110, "In this game you will play\nas a diabetic boy trying to\nmake his way from home to\nschool and must maintain your\nblood sugar levels.", textStyle);
    storyText3.fixedToCamera = true;
    storyText3.visible = false;

    storyText4 = game.add.text(130, 110, "Collect juice containers to \nincrease blood sugar and keep\nmoving to decrease.\nDon't fall behind!", textStyle);
    storyText4.fixedToCamera = true;
    storyText4.visible = false;

    storyText5 = game.add.text(90, 290, "You may use your preferred controls.", textStyle);
    storyText5.fixedToCamera = true;
    storyText5.visible = false;

    menuBar = game.add.sprite(glucoseBarX, glucoseBarY, "menuHealthbar");
    menuBar.fixedToCamera = true;
    menuBar.width = 700;
    menuBar.height = 20;
    menuBar.visible = false;

    menuArrow = game.add.sprite(400, 30, "menuArrow"); //pointer on health bar
    menuArrow.fixedToCamera = true;
    menuArrow.width = 20;
    menuArrow.height = 40;
    menuArrow.visible = false;

    menuPlayer = game.add.sprite(120, 280, "menuMan");
    menuPlayer.scale.setTo(0.7, 0.7);
    menuPlayer.visible = false;

    menuJuice = game.add.sprite(590, 280, "menuJuice");
    menuJuice.scale.setTo(0.7, 0.7);
    menuJuice.visible = false;
}

var stopFlashStart = false;
var flash = false;
var flashStart;
const FLASH_INTERVAL = 300;
var flashStartTimer = 0;
var flashTimer = 0;

var screen = 0;

function continueMenu() {
    switch (screen) {
        case 0:
            titleText.visible = false;
            creditText.visible = false;
            storyText1.visible = true;
            continueText.visible = true;
            skipText.visible = true;
            flashStartTimer = Date.now();
            flashStart = 3500;
            flash = false;
            break;
        case 1:
            storyText1.visible = false;
            storyText2.visible = true;
            flashStartTimer = Date.now();
            flashStart = 3500;
            flash = false;
            break;
        case 2:
            storyText3.visible = true;
            storyText2.visible = false;
            menuBar.visible = true;
            menuArrow.visible = true;
            flashStartTimer = Date.now();
            flashStart = 3500;
            flash = false;
            break;
        case 3:
            storyText4.visible = true;
            storyText3.visible = false;
            flashStartTimer = Date.now();
            menuPlayer.visible = true;
            menuJuice.visible = true;
            flashStart = 3500;
            flash = false;
            break;
        case 4:
            storyText4.visible = false;
            storyText5.visible = true;
            keyboards.visible = true;
            keyboards.animations.play("flash");
            flashStartTimer = Date.now();
            flashStart = 2500;
            flash = false;
            menuPlayer.visible = false;
            menuJuice.visible = false;
            break;
        default:
            gotoIngame();
            if (player.x>400) console.log("pasttt")
            break;
    }

    screen++;
}

function gotoIngame() {
    game.state.start("ingame");
}



function menuUpdate() {
    if (!stopFlashStart && Date.now() - flashStartTimer >= flashStart) {
        flash = true;
        if (screen != 4) skipText.visible = true;
    }

    if (flash) {
        if (Date.now() - flashTimer > FLASH_INTERVAL) {
            flashTimer = Date.now();
            continueText.visible = !continueText.visible;
        }
    }
}
