'use strict';

function Player(game, x, y, bulletManager, id)
{
var self = this;

var sprites = ['player1', 'player2', 'player5', 'player6', 'player4', 'player3'];
var input;
//self.playerClass = Math.floor((Math.random() * 6)); //rand 0-5
self.playerClass;
self.playerName;
self.id = id;

self.score = 0;

self.maxHealth = 200;
self.currentHealth = self.maxHealth;

self.dead = false;
//var randomSprite = sprites[Math.floor((Math.random() * 6))];

self.sprite = game.add.sprite(x, y, 'empty');
self.sprite.anchor.setTo(0.5, 0.5);
self.sprite.exists = false;
self.sprite.playerObj = self;  //powerups need the player object, bad solution, anythign better?
var setupDone = false;

var flipped = false;

var fireRate = 200;
var baseFireRate = 200;

var nextFire = 0;

var movementSpeed = 200;
var baseMovementSpeed = 200;

var respawnTime = 100;
var nextRespawn = 0;


var cameraPadding = 20;

var headingPoint = new Phaser.Point();
var vectorPoint = new Phaser.Point();
vectorPoint.x = -1;
vectorPoint.y = 0;


var activePowerUps = [];

var pHUD;

//>>DEBUG
//setClassAndName(0, "test");
//createPlayer();
//<<

var scale = () =>
	{
	if (flipped)
		{
		self.sprite.scale.x = -scalingFactors.x;
		} else
		{
		self.sprite.scale.x = scalingFactors.x;
		}
	self.sprite.scale.y = scalingFactors.y;
	};

function createPlayer ()
	{
	self.sprite.loadTexture(sprites[self.playerClass]);
	
	game.physics.enable(self.sprite, Phaser.Physics.ARCADE);
	self.sprite.body.collideWorldBounds = true;
	
	self.sprite.body.bounce = (1,1);

	pHUD = new Hud(game,self);
	pHUD.setName(self.playerName);
	self.sprite.exists = true;
	};

self.setInput = (inputArray) =>
	{
	input = inputArray;
	};

//called by controller once it is created
function setClassAndName (pClass, pName)
	{
	self.playerClass = pClass;
	self.playerName = pName;
	//console.log('pname: ' + self.playerName + ', pclass: ' + self.playerClass);
	};
	
self.update = () =>
	{
	scale();
	if (!self.dead)
		{
		if (input != undefined)
			{
			
			if(!setupDone)
				{
					//setting the player up here is a workaround to enable play on firefox
				//console.log('setting up player');
				setClassAndName(input.pClass, input.pName);
				createPlayer();
				setupDone = true;
				}
			
			var length = input.moveLength;
			if(length > 1)
				{
				length = 1;
				}
			var angle = input.moveAngle;
			game.physics.arcade.velocityFromAngle(angle, movementSpeed * length, self.sprite.body.velocity);
			if (self.sprite.body.velocity.x > 0 && flipped)
				{
				flipped = false;
				} else if (self.sprite.body.velocity.x < 0 && !flipped) {
				flipped = true;
				}
			if ((input.sX != 0 || input.sX != 0) && (game.time.now > nextFire))
				{
				nextFire = game.time.now + fireRate;
				headingPoint.x = input.sX;
				headingPoint.y = input.sY;
				bulletManager.createBullet('magic', 2, self.id, (Phaser.Point.angle(headingPoint, vectorPoint) * 360/Math.PI), self.sprite.position, 1000, 1000);
				}
			}

		//We should only check for collisions when there are collidable objects on screen
		if(bulletManager.enemyBulletCount > 0)
			{
			game.physics.arcade.overlap(bulletManager.enemyBulletGroups, self.sprite, self.playerHit, null, self);
			}

		//Check for powerups only if powerups are active
		if(activePowerUps.length > 0) {
			for (var i = activePowerUps.length - 1; i >= 0; i--) {
				if(activePowerUps[i] != 'undefined') {
					if(activePowerUps[i].endTime <= game.time.now) {
						if(activePowerUps[i].powerUpID == 'incSpeed') 
						{
							self.setSpeed(baseMovementSpeed);
						}

						else if (activePowerUps[i].powerUpID == 'incFireRate')
						{
							self.setFireRate(baseFireRate);
						}
						activePowerUps.splice(i,1); //We remove the expired powerup from the array
					}				
				}
			}
		}

		} else if (self.dead && nextRespawn < 0) {
		self.sprite.exists = true;
		self.dead = false;
		self.currentHealth = self.maxHealth;
		} else {
		nextRespawn--;
		}

		// We always check if the player has fallen behing the camera

		if (self.sprite.position.x < game.camera.x + cameraPadding)
		{
			self.sprite.position.x = game.camera.x + cameraPadding;
		} else if (self.sprite.position.x > game.camera.x + game.camera.width - cameraPadding)
		{
			self.sprite.position.x = game.camera.x + game.camera.width - cameraPadding;
		}

		if (self.sprite.position.y < game.camera.y + cameraPadding)
		{
			self.sprite.position.y = game.camera.y + cameraPadding;
		} else if (self.sprite.position.y > game.camera.y + game.camera.height - cameraPadding)
		{
			self.sprite.position.y = game.camera.y + game.camera.height - cameraPadding;
		}
	};

self.playerHit = function(player, bullet)
	{
	var damage = bullet.damage;
	//console.log(damage);
	bulletManager.killbullet(bullet);
	self.takeDamage(damage);
	//console.log(self.currentHealth);
	};

self.takeDamage = function(damage)
	{
	self.currentHealth = self.currentHealth-damage;
	if(self.currentHealth <= 0) 
		{
		self.dead = true;
		self.kill();
		self.currentHealth = 0;
		}
		pHUD.updateHealthBar();
	};

self.heal = function(amount) 
{
	if(self.currentHealth + amount >= self.maxHealth) {
		self.currentHealth = self.maxHealth;
	} else {		
		self.currentHealth += amount;
	}
	pHUD.updateHealthBar();
}

self.setFireRate = function(amount) 
{
	fireRate = amount;
} 

self.setSpeed = function(amount) 
{
	movementSpeed = amount;

} 


/**
* Starts a powerup on the player object
* @param {string} pUpID - The ID of the powerup as displayed in pUpDictionary
* @param {int} pUpDuration - The Duration of the powerup in milliseconds
* @param {int} pUpStats - The value for the powerup
*/
self.startPowerUp = function(pUpID, pUpDuration, pUpStats) 
{
	var powerupFound = false;

	//If the player picks two powerups we simply extend the duration.
	for (var i = activePowerUps.length - 1; i >= 0; i--) {
		if(activePowerUps[i].powerUpID == pUpID) {
			activePowerUps[i].endTime = game.time.now + pUpDuration;
			powerupFound = true;
		}
	}
	//If this is the first isntance of a powerup we add it to the active list
	if(!powerupFound) {
		var newPowerUp = {powerUpID: pUpID, endTime: game.time.now + pUpDuration};
		activePowerUps.push(newPowerUp);
		switch(pUpID) 
		{
			case 'incSpeed':
				self.setSpeed(movementSpeed + pUpStats);
				break;

			case 'incFireRate':
				self.setFireRate(fireRate - pUpStats);
				break;

			default:
				break;
		}
	}
}

self.kill = () =>
	{
	clearAllPowerups();
	self.sprite.exists = false;
	nextRespawn = respawnTime;
	};

self.getPoints = () =>
	{
	self.score += 1;
	};

var clearAllPowerups = () =>
	{
	self.setSpeed(baseMovementSpeed);
	self.setFireRate(baseFireRate);
	activePowerUps = [];
	};
}
