'use strict';

function BulletManager(game)
{
var self = this;

self.playerBulletGroups = [];

var playerArrowBullets = game.add.group();
playerArrowBullets.enableBody = true;
playerArrowBullets.physicsBodyType = Phaser.Physics.ARCADE;
playerArrowBullets.createMultiple(50, 'arrow');

var playerMagicBullets = game.add.group();
playerMagicBullets.enableBody = true;
playerMagicBullets.physicsBodyType = Phaser.Physics.ARCADE;
playerMagicBullets.createMultiple(50, 'magic');

self.playerBulletGroups.push(playerArrowBullets);
self.playerBulletGroups.push(playerMagicBullets);

var playerBulletPool = 50;

self.enemyBulletGroups = [];

var enemyGenericBullets = game.add.group();
enemyGenericBullets.enableBody = true;
enemyGenericBullets.physicsBodyType = Phaser.Physics.ARCADE;
enemyGenericBullets.createMultiple(50, 'enemyBullet');

self.enemyBulletGroups.push(enemyGenericBullets);

var enemyBulletPool = 50;

self.enemyBulletCount;
self.playerBulletCount;

var bulletSpeed = 1000;

var bulletLifespan = 1000;

// Type of bullet, player which shot the bullet, if enemybullet then -1, bullet direction, bullet position
self.createBullet = (type, playerid, angle, pos) =>
	{
	if (playerid >= 0)
		{
		if (playerBulletPool > 0)
			{
			switch (type)
				{
				case 'arrow':
					var bullet = playerArrowBullets.getFirstDead();
					// Other type spesific attributes
					break;
				case 'magic':
					var bullet = playerMagicBullets.getFirstDead();
					/*var flame = self.game.add.sprite(pos.x, pos.y, 'flame');
					self.game.physics.enable(flame, Phaser.Physics.ARCADE);
					flame.anchor.setTo(0.5, 0.5);
					flame.alpha = 1;
					self.game.add.tween(flame).to({alpha: 0}, 100, "Linear", true);
					self.game.physics.arcade.velocityFromAngle(angle, self.bulletSpeed, flame.body.velocity);
					flame.events.onOutOfBounds.add(flame.destroy, this);*/
					break;
				default:
					var bullet = playerMagicBullets.getFirstDead();
				}
			bullet.playerId = playerid;
			playerBulletPool--;
			}
		} else
		{
		if (enemyBulletPool > 0)
			{
			switch (type)
				{
				case 'mosquitoBullet':
					var bullet = enemyMosquitoBullets.getFirstDead();
					break;
				default:
					var bullet = enemyGenericBullets.getFirstDead();
				}
			self.enemyBulletPool--;
			}
		}
	if (bullet != undefined)
		{
		bullet.anchor.setTo(0.5, 0.5);
		bullet.reset(pos.x, pos.y);
		// This will have to be tuned
		bullet.lifespan = bulletLifespan;
		game.physics.arcade.velocityFromAngle(angle, bulletSpeed, bullet.body.velocity);
		}
	};

self.killbullet = (bullet) =>
	{
	bullet.kill()
	};

self.update = () =>
	{
	self.enemyBulletCount = countLiveBullets(self.enemyBulletGroups);
	self.playerBulletCount = countLiveBullets(self.playerBulletGroups);
	enemyBulletPool = 50 - self.enemyBulletCount;
	playerBulletPool = 50 - self.playerBulletCount;
	};

var countLiveBullets = (groupList) =>
	{
	var count = 0;
	for (var i = 0; i < groupList.length; i++)
		{
		count += groupList[i].countLiving();
		}
	return count;
	};
}



