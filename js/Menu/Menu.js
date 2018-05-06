var menu = {
    preload: menuPreload,
    create: menuCreate,
    update: menuUpdate
}

var playButton;

function menuPreload() {
    // Load images, resources, fonts, etc...
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
        font: "100pt Verdana",
        fill: "white"
    };
    titleText = game.add.text(120, 140, "Glucose", titleStyle);
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

    storyText2 = game.add.text(110, 100, "We hope that in our efforts\nyou will take it upon yourself\n to learn a little more about those\ndiabetes and how you can help\nwho have it. Enjoy the game!", textStyle);
    storyText2.fixedToCamera = true;
    storyText2.visible = false;

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
            storyText2.visible = false;
            flashStartTimer = Date.now();
            flashStart = 3500;
            flash = false;
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
        skipText.visible = true;
    }

    if (flash) {
        if (Date.now() - flashTimer > FLASH_INTERVAL) {
            flashTimer = Date.now();
            continueText.visible = !continueText.visible;
        }
    }
}
