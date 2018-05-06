// Creates the game object
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "game");

// Registers the game states
game.state.add('ingame', ingame);
game.state.add('menu', menu);
// TODO? game.state.add('end', endScreen);

game.state.start("menu");
