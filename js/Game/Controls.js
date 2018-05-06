var touchingGround = false;

function jumpPressed() {
    return wKey.isDown || spaceKey.isDown || iKey.isDown || upKey.isDown;
}

function rightPressed() {
    return dKey.isDown || lKey.isDown || rightKey.isDown;
}

function leftPressed() {
    return leftKey.isDown || aKey.isDown || jKey.isDown;
}
    
function updateControls() {
    // Maps controls to velocity
    if (rightPressed() && leftPressed()) {
        player.body.velocity.x = 0;
        player.animations.stop("walk");
    } else if (rightPressed()) {
        player.body.velocity.x = 300;
        bloodSugar -= energyMove;
        player.animations.play("walk")
        player.scale.x = PLAYER_SCALE;
    } else if (leftPressed()) {
        player.body.velocity.x = -300;
        bloodSugar -= energyMove;
        player.scale.x = -PLAYER_SCALE;
        player.animations.play("walk")
    } else {
        player.body.velocity.x *= 0.75;
        player.animations.stop("walk");
    }

    if (DEBUG && jetpackKey.isDown) {
        if (player.body.velocity.y > 100) {
            player.body.velocity.y = 100;
        }
        player.body.velocity.y -= 50;
    }

    // Jump controls
    if (touchingGround && jumpPressed()) {
        jump();
        --player.y;
    }
}

function jump() {
    touchingGround = false;
    player.body.velocity.y = -800;
    bloodSugar -= energyJump;
}
