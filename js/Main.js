const WIDTH = 800;
const HEIGHT = 600;

// Creates the game object
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game");

// Registers the game states
// TODO? game.state.add('Boot');
// TODO? game.state.add('Menu');
game.state.add('ingame', ingame);

game.state.start("ingame");
