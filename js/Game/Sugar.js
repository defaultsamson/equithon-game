var bloodSugar = 100; //at to keep track of bloodsugar on meter

function changeBloodSugar(degOfChange) {

    if (bloodSugar + degOfChange < 40) {
        bloodSugar = 0;
        console.log("Game Over");
        endGame();
    } else {
        bloodSugar += degOfChange;
        juicebox.destroy();
        console.log(bloodSugar)
        juiceSpawn();
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
    glucoseText.setText(glucoseTextPrefix + Math.round(bloodSugar * 1000) / 1000);

    renderArrow();

    bloodSugar -= 1 / (2 ** 10);

    arrow.x = game.camera.x + bloodSugar * 3.6; //fixing arrow motion
}
