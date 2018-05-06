var skyPrevX = 0;

function moveSky() {
    // Moves the clouds based on camera movement
    var delta = game.camera.x - skyPrevX;
    skyPrevX = game.camera.x;
    sky0.tilePosition.x -= delta * 0.2 * 0.2;
    sky1.tilePosition.x -= delta * 0.3 * 0.3;
    sky2.tilePosition.x -= delta * 0.4 * 0.4;
    sky3.tilePosition.x -= delta * 0.5 * 0.5;
    sky4.tilePosition.x -= delta * 0.6 * 0.6;
}
