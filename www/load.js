'use strict';

var loadState = function ()
	{
	var self = this;
	var loadingText;

	self.preload = () =>
		{
		// Load player sprites

		game.load.image('player1', 'assets/player_classes/knightx.png');
		game.load.image('player2', 'assets/player_classes/elfx.png');
		game.load.image('player3', 'assets/player_classes/warlockx.png');
		game.load.image('player4', 'assets/player_classes/ninjax.png');
		game.load.image('player5', 'assets/player_classes/magex.png');
		game.load.image('player6', 'assets/player_classes/vikingx.png');
		game.load.image('empty', 'assets/other/empty.png');

		// Load bullet sprites

		game.load.image('magic', 'assets/projectiles/bullet.png');
		game.load.image('enemyBullet', 'assets/projectiles/enemyBullet.png');

		// Load enemy assets

		game.load.image('enemy_hellbug', 'assets/enemies/enemy_05.png');
		game.load.image('enemy_skeleton', 'assets/enemies/enemy_01.png');

		// Set loadingtext
	
		loadingText = game.add.text(80, 150, 'Loading ...', {font: '30px Courier', fill: '#ffffff'});

		};

self.create = () =>
	{
	game.state.start('waiting');
	};

}
	
