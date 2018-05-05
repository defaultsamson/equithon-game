/*
var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'phaser-game',
    scene: [SceneMain],
    backgroundColor: "#00CCEE",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1900
            }
        }
    }
};
*/

//var game = new Phaser.Game(config);

// Creates the game object
var game = new Phaser.Game(800, 600, Phaser.AUTO, "game");

// Registers the game states
// TODO? game.state.add('Boot');
// TODO? game.state.add('Menu');
game.state.add('ingame', ingame);

game.state.start("ingame");
