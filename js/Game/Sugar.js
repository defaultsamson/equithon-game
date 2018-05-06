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
const JUICE_NUM = 20;
const SPAWN_DEADZONE = 40; // start and stop spawning the juices this many blocks into the levels
const SPAWN_DEVIATION = 8; // plus or minus randomization for x pos
const IN_STRUCTURE_JUICE_CHANCE = 80; // percentage chance that juice will spawn in a structure when given the chance

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
        var xOrd = SPAWN_DEADZONE + (spawnEvery * i) + getRandomInt(-SPAWN_DEVIATION, SPAWN_DEVIATION);
        //console.log("xOrd: " + xOrd)

        // An array of yOrds. Aviable tile is any tile that is empty or able to be passed through
        var viableYOrds = [];
        var inHouseOrds = [];

        for (var y = 0; y < WORLD_HEIGHT; y++) {
            var tile = map.getTile(xOrd, y, layer1);

            if (tile && tile.index != -1) {
                if (COLLISION_IDS.indexOf(tile.index) == -1) {
                    // Non-collidable tile
                    inHouseOrds.push(y);
                }
            } else {
                // Empty tile
                viableYOrds.push(y);
            }
        }

        var doInHouse = getRandomInt(0, 100) < IN_STRUCTURE_JUICE_CHANCE || viableYOrds.length == 0;

        var yOrd;
        // If there exists a viable y ordinate, use it, else too bad, pass that spot
        if (inHouseOrds.length > 0 && doInHouse) {
            yOrd = inHouseOrds[getRandomInt(0, viableYOrds.length - 1)];
        } else if (viableYOrds.length > 0) {
            yOrd = viableYOrds[getRandomInt(0, viableYOrds.length - 1)];
        }

        var juicebox = game.add.sprite(xOrd * BLOCK_WIDTH, yOrd * BLOCK_HEIGHT, "juicebox");
        juicebox.scale.setTo(0.34, 0.34);
        game.physics.enable(juicebox);
        juicebox.body.allowGravity = false;
        juicebox.body.immovable = true;

        juices.push(juicebox)
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
