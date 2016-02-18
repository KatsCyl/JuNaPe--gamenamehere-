'use strict';

function Player(game, x, y, bulletmanager, id)
{
var self = this;

self.input;

self.id = id;

self.game = game;
self.bulletManager = bulletmanager;
self.maxSpeed = 400;

self.playerSprite = self.game.add.sprite(x, y, 'player');
self.playerSprite.anchor.setTo(0.5, 0.5);
self.flipped = false;
var textureWidth = self.playerSprite.width;
var textureHeight = self.playerSprite.height;


self.game.physics.enable(self.playerSprite, Phaser.Physics.ARCADE);
self.playerSprite.body.collideWorldBounds = true;

self.fireRate = 100;
self.nextFire = 0;

self.maxHealth = 1000;
self.currentHealth = self.maxHealth;

self.dead = false;

self.healthBarOutline = game.add.graphics(0,0);
self.healthBarFill = game.add.graphics(0,0);
self.healthBarOutline.lineStyle(2,0x000000,1);
self.healthBarOutline.drawRect(self.playerSprite.X, self.playerSprite.Y, 100, 15);
self.healthBarFill.beginFill(0xff3300);
self.healthBarFill.drawRect(self.playerSprite.X, self.playerSprite.Y, (self.currentHealth/self.maxHealth*100), 13);
self.healthBarFill.endFill();
self.playerSprite.addChild(self.healthBarOutline);
self.playerSprite.addChild(self.healthBarFill);
self.healthBarOutline.x = - textureWidth/2;
self.healthBarFill.x = -textureWidth/2;;
self.healthBarOutline.y = textureHeight/2;
self.healthBarFill.y = textureHeight/2;


self.setInput = (input) =>
    {
    self.input = input;
    }


self.update = () =>
	{
  if (!self.dead)
  {
    if (self.input != undefined)
    {
      var i = self.input;
      self.playerSprite.body.velocity.x = i.X * 100;
      self.playerSprite.body.velocity.y = i.Y * 100;
      if (self.playerSprite.body.velocity.x > 0 && self.flipped)
      {
      self.playerSprite.scale.x = 1;
      self.flipped = false;
      } else if (self.playerSprite.body.velocity.x < 0 && !self.flipped)
      {
      self.playerSprite.scale.x = -1;
      self.flipped = true;
      }

      if ((i.sX != 0 || i.sX != 0) && (self.game.time.now > self.nextFire))
      {
        self.nextFire = self.game.time.now + self.fireRate;
        var heading = new Phaser.Point();
        heading.x = i.sX;
        heading.y = i.sY;
        self.bulletManager.createBullet('magic', self.id, headingToAngle(heading), self.playerSprite.position);
      }
    }
    //We should only check for collisions when there are collidable objects on screen
    if(self.bulletManager.enemyBulletCount > 0) 
      {
        for (var i = 0; i < self.bulletManager.enemyBulletGroups.length; i++)
        {
          var bool = self.game.physics.arcade.overlap(self.bulletManager.enemyBulletGroups[i], self.playerSprite, self.playerHit, null, self);  
          console.log(bool);
        }
      }
    return true;
  } else
  {
    return false;
  }
	};

self.playerHit = function(player, bullet) 
  {
    self.takeDamage(10);
    bullet.kill();
  };


self.takeDamage = function(damage) 
  {
    self.currentHealth = self.currentHealth-damage;
    if(self.currentHealth <= 0) {
      self.dead = true;
      self.currentHealth = 0;
    }
    updateHealthBar();
  };

 var updateHealthBar = function() 
  {
    self.healthBarFill.clear();
    self.healthBarFill.beginFill(0xFF3300);
    self.healthBarFill.drawRect(self.playerSprite.X,self.playerSprite.Y,(self.currentHealth/self.maxHealth*100),13);
    self.healthBarFill.endFill(); 
  }; 

self.kill = () =>
	{
	self.playerSprite.destroy();
	};

var headingToAngle = (heading) =>
  { 
    var vector = new Phaser.Point();
    vector.x = -1;
    vector.y = 0;
    return (Phaser.Point.angle(heading, vector) * 360/Math.PI);
  }

}
