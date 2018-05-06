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
    playButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}

function menuUpdate() {
    // update objects
    if (playButton.isDown) {
        game.state.start("ingame")
    }
}
