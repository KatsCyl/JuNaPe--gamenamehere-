'use strict';

var loadState = function ()
	{
	var self = this;
	var loadingText;

	self.preload = function ()
		{
		// Load player sprites

		game.load.image('player1', 'assets/player_classes/knight.png');
		game.load.image('player2', 'assets/player_classes/elf.png');
		game.load.image('player3', 'assets/player_classes/mage.png');
		game.load.image('player4', 'assets/player_classes/viking.png');
		game.load.image('player5', 'assets/player_classes/ninja.png');
		game.load.image('player6', 'assets/player_classes/warlock.png');
		game.load.image('empty', 'assets/other/empty.png');

		// Load bullet sprites

		game.load.image('magic', 'assets/projectiles/bullet.png');
		game.load.image('bullet1', 'assets/projectiles/bullet1.png');
		game.load.image('bullet2', 'assets/projectiles/bullet2.png');
		game.load.image('bullet3', 'assets/projectiles/bullet3.png');
		game.load.image('bullet4', 'assets/projectiles/bullet4.png');
		game.load.image('bullet5', 'assets/projectiles/bullet5.png');
		game.load.image('bullet6', 'assets/projectiles/bullet6.png');

		game.load.image('enemyBullet1', 'assets/projectiles/enemyBullet.png');
		game.load.image('enemyBullet2', 'assets/projectiles/enemyBullet_spike.png');
		game.load.image('enemyBullet3', 'assets/projectiles/enemyBullet_bone.png');
		game.load.image('enemyBullet4', 'assets/projectiles/enemyBullet_YellowStar.png');
		game.load.image('enemyBullet5', 'assets/projectiles/enemyBullet_RED.png');
		game.load.image('enemyBullet6', 'assets/projectiles/Fireball.png');
		game.load.image('enemyBullet7', 'assets/projectiles/EnemyBullet_Sword_rt.png');
		game.load.image('enemyBullet8', 'assets/projectiles/enemyBullet_boss2.png');
		game.load.image('enemyBullet9', 'assets/projectiles/enemyBullet_boss2_Line.png');
		game.load.image('enemyBullet10', 'assets/projectiles/enemyBullet_fork.png');
		game.load.image('enemyBullet11', 'assets/projectiles/enemyBullet_Wave.png');
		game.load.image('enemyBullet12', 'assets/projectiles/enemyBullet_Slash.png');
		

		//load weapon sprites

		game.load.image('player1Weapon', 'assets/player_classes/weapons/knight1.png');
		game.load.image('player2Weapon', 'assets/player_classes/weapons/elfi1.png');
		game.load.image('player3Weapon', 'assets/player_classes/weapons/mage1.png');
		game.load.image('player4Weapon', 'assets/player_classes/weapons/viking1.png');
		game.load.image('player5Weapon', 'assets/player_classes/weapons/ninja1.png');
		game.load.image('player6Weapon', 'assets/player_classes/weapons/warlock1.png');


		// Load enemy assets

		game.load.image('enemy_hellbug', 'assets/enemies/enemy_05b.png');
		game.load.image('enemy_skeleton', 'assets/enemies/enemy_01b.png');
		game.load.image('enemy_slasher', 'assets/enemies/enemy_08b.png');
		game.load.image('boss_tentaclemonster', 'assets/enemies/enemy_06b.png');
		game.load.image('boss_king1', 'assets/enemies/enemy_10.png');
		game.load.image('boss_king2', 'assets/enemies/enemy_10_2.png');
		game.load.image('boss_king3', 'assets/enemies/enemy_10_3.png');

		// Load effects

		game.load.spritesheet('explosion', 'assets/effects/placeholder_explosion.png', 64, 64, 23);
		game.load.spritesheet('spawn', 'assets/effects/placeholder_spawn.png', 512, 512, 6);

		//Load powerup sprites
		game.load.image('item_book', 'assets/decorations/Book.png');
		game.load.image('item_ATK_Bonus', 'assets/decorations/PickUp_AttackBonus.png');
		game.load.image('item_SPD_Bonus', 'assets/decorations/PickUp_SpeedBonus.png');
		game.load.image('item_Heal', 'assets/decorations/PickUp_HealthBonus.png');
		game.load.image('item_Chest', 'assets/decorations/Chest_Gold.png');

		//Load particles
		game.load.image('particle_blue','assets/particles/SmallBlingBlue.png');
		game.load.image('particle_red','assets/particles/SmallBlingRed.png');

		// Set loadingtext
	
		loadingText = game.add.text(80, 150, 'Loading ...', {font: '30px Courier', fill: '#ffffff'});

		// Load QR
		game.load.image('qr_niko', 'assets/QR/niko.jpg');
		game.load.image('qr_janika', 'assets/QR/janika.jpg');
		
		};

self.create = function ()
	{
	game.state.start('waiting');
	};

}
	
