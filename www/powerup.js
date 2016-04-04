'use strict';

function powerup(game, powerUpManager, pUpInfo, pUpPos, players)
{
var self = this;
self.sprite = game.add.sprite(pUpPos.x, pUpPos.y, pUpInfo.sprite);
self.sprite.anchor.setTo(0.5, 0.5);
self.sprite.visible = true;

var powerUpManager = powerUpManager;
var pUpID = pUpInfo.pUpID;
var pUpDuration = pUpInfo.pUpDuration;
var pUpStats = pUpInfo.pUpStats;
var cameraPadding = 20;

self.update = function(players)
{
	scale();
	game.physics.arcade.overlap(players, self.sprite, self.triggerpUp, null, self);	
	checkCameraBounds();

}

self.getpUpID = function ()
{
	return pUpID;
};

self.triggerpUp = function (curpUp, player)
	{

		var pObject = player.playerObj;
		if(pUpID == 'smallHeal') 
		{
			pObject.heal(pUpStats);
		} 
		else if (pUpID == 'pointChest') 
		{
			pObject.getMultiplePoints(pUpStats);
		}
		else {
			pObject.startPowerUp(pUpID, pUpDuration, pUpStats)
		}
		curpUp.dead = true;
	};

self.kill = function ()
	{
	self.sprite.destroy();
	};

//We need to despawn powerups that go beyond the screen
var checkCameraBounds = function ()
	{
	if (self.sprite.position.x < game.camera.x + cameraPadding || self.sprite.position.x > game.camera.x + game.camera.width - cameraPadding || self.sprite.position.y < game.camera.y + cameraPadding || self.sprite.position.y > game.camera.y + game.camera.height - cameraPadding)
		{
			self.sprite.dead = true;
		}
	};	

var scale = function ()
	{
	self.sprite.scale.x = scalingFactors.x;
	self.sprite.scale.y = scalingFactors.y;
	};


}