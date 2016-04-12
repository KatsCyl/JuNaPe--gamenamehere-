'use strict';

function EffectManager(game)
{
var self = this;

var spawnDuration;

var scale = function (sprite)
	{
	sprite.scale.x = scalingFactors.x;
	sprite.scale.y = scalingFactors.y;
	};

self.createSpawnEffect = function (position)
	{
	// Spritesheet spesific vars
	
	var numberOfFrames = 6;
	var fps = 10;

	// creating the effect
	var effect = game.add.sprite(position.x, position.y, 'spawn');
	scale(effect);
  effect.anchor.setTo(0.5, 0.5);
	effect.animations.add('splurt');
	effect.animations.play('splurt', fps, false, true);
	effect.scale.x *= 1/2;
	effect.scale.y *= 1/2;

	// Set delay
	
	spawnDuration = numberOfFrames * 1/fps * 1000; // 1000 to get to ms
	}

self.getSpawnDuration = function ()
	{
	return spawnDuration;
	};



self.createDeathEffect = function (target)
	{
	var effect = game.add.sprite(target.sprite.position.x, target.sprite.position.y, 'explosion');
	scale(effect);
	effect.anchor.setTo(0.5, 0.5);
	effect.animations.add('kaboom');
	effect.animations.play('kaboom', 30, false, true);
	};

self.popupScoreText = function(amount,target)
	{
	var text = game.add.text(target.position.x, target.position.y, amount, { font: "20px Arial", fill: "#FFFFFF"});
	game.physics.arcade.enable(text);
	text.body.collideWorldBounds = true;
	text.body.bounce.set(1);
	text.scale.x = scalingFactors.x;
	text.scale.y = scalingFactors.y;
	var dir = [-1, 1];
	var angle = Math.floor(Math.random()*181);
	angle *= dir[Math.floor(Math.random()*2)];
	game.physics.arcade.velocityFromAngle(angle, 23, text.body.velocity);
	text.body.angularVelocity = 6 * dir[Math.floor((Math.random()*2))];
	game.time.events.add(2500, function() {text.destroy();});
	};
}
