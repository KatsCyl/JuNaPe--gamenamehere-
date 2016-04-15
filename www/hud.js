'use strict';

function Hud(game, target)
{

var self = this;

var healthBarOutline = game.add.graphics(0,0);
var healthBarFill = game.add.graphics(0,0);
var healthBarSprite = game.add.sprite(0, 0);
var textureWidth = target.sprite.width;
var textureHeight = target.sprite.height;
var drawPositionX = target.sprite.X-3;
var drawPositionY = target.sprite.Y;


healthBarOutline.lineStyle(2,0x000000,1);
healthBarOutline.drawRect(drawPositionX, drawPositionY, 100, 15);
healthBarFill.beginFill(0xff3300);
healthBarFill.drawRect(drawPositionX, drawPositionY, (target.currentHealth/target.maxHealth*100), 13);
healthBarFill.endFill();

healthBarSprite.addChild(healthBarOutline)
healthBarSprite.addChild(healthBarFill);

// This prevets flippingu

healthBarSprite.setScaleMinMax(1);;

target.sprite.addChild(healthBarSprite);

healthBarOutline.x = (-textureWidth/2)-25;
healthBarFill.x = (-textureWidth/2)-25;
healthBarOutline.y = (textureHeight/2) + 5;
healthBarFill.y = (textureHeight/2) + 5;

var nameText;

self.updateHealthBar = function()
	{
	healthBarFill.clear();
	if(target != undefined)
		{
		healthBarFill.beginFill(0xFF3300);
		healthBarFill.drawRect(drawPositionX,drawPositionY,(target.currentHealth/target.maxHealth*100),13);
		healthBarFill.endFill();
		}
	};

self.setName = function(name)
	{
	if (target != undefined)
		{
		nameText = game.add.text(target.sprite.X, target.sprite.Y, name, {align: "center"});
		target.sprite.addChild(nameText);
		//nameText.x = (-textureWidth/2);
		nameText.y = (textureWidth/2) - 85;
		nameText.stroke = '#000000';
		nameText.strokeThickness = 4;
		nameText.fill = '#ffffff';
		nameText.anchor.setTo(0.5,0.5);
		scale();
		}
	};

var scale = function ()
	{
	healthBarSprite.setScaleMinMax(scalingFactors.x, scalingFactors.y);

	if (nameText != undefined)
		{
		nameText.setScaleMinMax(scalingFactors.x, scalingFactors.y);
		}
	};


}
