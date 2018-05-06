var bloodSugar = 100; //at to keep track of bloodsugar on meter

function changeBloodSugar(degOfChange) {

    if (bloodSugar + degOfChange < 40) {
        bloodSugar = 0;
        console.log("Game Over");
        endGame();
    } else {
        bloodSugar += degOfChange;
        console.log(bloodSugar)
    }
}

function _mapArrow(sugar) {
    // Old: (sugar - min) * (right side of health bar - left side of health bar) / (highest blood sugar - lowest blood sugar)
    // return (sugar - 40) * (750 - 50) / (240 - 40);

    // http://www.wolframalpha.com/input/?i=parabola+%7B(40,+0),(240,+700),(100,+350)%7D
    return -1 / 60 * sugar * sugar + 49 / 6 * sugar - 300;
}

function renderArrow() {
    // health bar is 0-700 pixels, want 40-240
    arrow.cameraOffset.x = _mapArrow(bloodSugar);
}

function updateSugar() {

    for (var i in juices) {
        if (game.physics.arcade.collide(player, juices[i])) {
            collideJuicebox(juices[i])
        }
    }

    glucoseText.setText(glucoseTextPrefix + Math.round(bloodSugar * 1000) / 1000);

    renderArrow();

    bloodSugar -= 1 / (2 ** 10);

    arrow.x = game.camera.x + bloodSugar * 3.6; //fixing arrow motion
}

var juices = [];
const JUICE_NUM = 25;
const SPAWN_DEADZONE = 40; // start and stop spawning the juices this many blocks into the levels
const SPAWN_DEVIATION = 8; // plus or minus randomization for x pos

function collideJuicebox(juice) {
    changeBloodSugar(30);

    // Delete the juice frfom the list of jucies (if it exists)
    var index = juices.indexOf(juice);
    if (index != -1) {
        juices.splice(index, 1);
    }

    juice.destroy();
}

function spawnJuice() {
    // Remove any existing juices
    for (var i in juices) {
        try {
            juices[i].destroy()
        } catch (e) {
            // :)
        }
    }

    juices = [];

    var spawnEvery = Math.round((WORLD_WIDTH - (2 * SPAWN_DEADZONE)) / JUICE_NUM)

    console.log("spawning every: " + spawnEvery)

    for (var i = 0; i < JUICE_NUM; i++) {
        var xOrd = SPAWN_DEADZONE + (spawnEvery * i) + game.rnd.integerInRange(-SPAWN_DEVIATION, SPAWN_DEVIATION);
        console.log("xOrd: " + xOrd)

        // An array of yOrds. Aviable tile is any tile that is empty or able to be passed through
        var viableYOrds = [];

        for (var y = 0; y < WORLD_HEIGHT; y++) {
            var tile = map.getTile(xOrd, y);
            if (tile && tile.index != -1) {
                if (COLLISION_IDS.indexOf(tile.index) == -1) {
                    // Non-collidable tile
                    viableYOrds.push(y);
                }
            } else {
                // Empty tile
                viableYOrds.push(y);
            }
        }

        // If there exists a viable y ordinate, use it, else too bad, pass that spot
        if (viableYOrds.length > 0) {
            var yOrd = viableYOrds[game.rnd.integerInRange(0, viableYOrds.length - 1)];
        }

        var juicebox = game.add.sprite(xOrd * BLOCK_WIDTH, yOrd * BLOCK_HEIGHT, "juicebox");
        juicebox.scale.setTo(0.4, 0.4);
        game.physics.enable(juicebox);
        juicebox.body.allowGravity = false;
        juicebox.body.immovable = true;

        juices.push(juicebox)
    }
}
