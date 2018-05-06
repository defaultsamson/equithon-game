var touchingGround = false;

function updateControls() {
    // Maps controls to velocity
    if (rightKey.isDown && leftKey.isDown) {
        player.body.velocity.x = 0;
        player.animations.stop("walk");
    } else if (rightKey.isDown) {
        player.body.velocity.x = 300;
        bloodSugar -= energyMove;
        player.animations.play("walk")
        player.scale.x = PLAYER_SCALE;
    } else if (leftKey.isDown) {
        player.body.velocity.x = -300;
        bloodSugar -= energyMove;
        player.scale.x = -PLAYER_SCALE;
        player.animations.play("walk")
    } else {
        player.body.velocity.x *= 0.75;
        player.animations.stop("walk");
    }

    // Jump controls
    if (touchingGround && jumpKey.isDown) {
        jump();
        --player.y;
    }
}

function jump() {
    touchingGround = false;
    player.body.velocity.y = -800;
    bloodSugar -= energyJump;
}
