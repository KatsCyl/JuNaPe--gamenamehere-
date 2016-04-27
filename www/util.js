'use strict';

/*==========================================
|                  UTIL                    |
|     Here you'll find useful functions    |
==========================================*/

/**
* Get a point a minimum distance away from all players
* @param {game} game - The game object
* @param {Array} playerList - The list containing all player objects
* @param {Number} minimumDistance - The minimum distance from players to spawn from
* @param {Number} maxTryCount - The maximum amount of attempts until returning null
* @return {Point} A Point at least minimumDistance away from all players or null in which case no monster is spawned
*/
var getPosMinDPlayers = function (game, playerList, minimumDistance, maxTryCount)
	{
	var tryCount = 0;
	var currentBestDistance = 0;
	var currentBestPos = {};
	var acceptablePosition = false;
	var currentDistance = 0;
	while (!acceptablePosition || (tryCount < maxTryCount && maxTryCount != undefined))
		{
		var randomPos = {};
		randomPos.x = game.camera.x + game.rnd.integerInRange(0, game.camera.width);
		randomPos.y = game.camera.y + game.rnd.integerInRange(0, game.camera.height);
		currentDistance = dClosestPlayer(playerList, randomPos);
		if (currentDistance >= minimumDistance)
			{
			acceptablePosition = true;
			currentBestPos = randomPos;
			}
		else if(currentDistance >= currentBestDistance) {
			currentBestPos = randomPos;
		}
		tryCount++;
		}
		return currentBestPos;
	};

/**
* Get a initial spawn point 
* @param {game} game - The game object
* @param {Array} playerList - The list containing all player objects
* @param {Number} minimumDistance - The minimum distance from players to spawn from
* @param {Number} maxTryCount - The maximum amount of attempts until returning null
* @return {Point} A Point where to spawn initially
*/
var getInitialSpawnPos = function (game, playerList, minimumDistance, borderLength, maxTryCount)
	{
	var tryCount = 0;
	var currentBestDistance = 0;
	var currentBestPos = {};
	var acceptablePosition = false;
	var currentDistance = 0;
	while (!acceptablePosition || (tryCount < maxTryCount && maxTryCount != undefined))
		{
		var randomPos = {};
		randomPos.x = game.camera.x + game.rnd.integerInRange(borderLength, game.camera.width - borderLength);
		randomPos.y = game.camera.y + game.rnd.integerInRange(borderLength, game.camera.height - borderLength);
		currentDistance = dClosestPlayer(playerList, randomPos);
		if (currentDistance >= minimumDistance)
			{
			acceptablePosition = true;
			currentBestPos = randomPos;
			}
		else if(currentDistance >= currentBestDistance) {
			currentBestPos = randomPos;
		}
		tryCount++;
		}
		return currentBestPos;
	};

/**
* Return the distance between the provided position and the closest player
* @param {Array} players - List of all players
* @param {Point} position - The position to which compare
* @return {Number} The distance in pixels from position to the closest player
*/
var dClosestPlayer = function (players, position)
	{
	var currentMin = 9999999; // Arbitrarily large number
	for (var id in players)
		{
		var player = players[id];
		if (player != undefined && !player.dead)
			{
			var distance = Math.sqrt( Math.pow( (player.sprite.position.x - position.x), 2 ) + 
																Math.pow( (player.sprite.position.y - position.y), 2) );
			if (distance <= currentMin)
				{
				currentMin = distance;
				}
			}
		}
	return currentMin;
	};

/**
* Return the distance between the provided position and the closest enemy
* @param {Array} enemies - List of all enemies
* @param {Point} position - The position to which compare
* @return {Number} The distance in pixels from position to the closest enemy
*/
var dClosestEnemy = function (enemies, position)
	{
	var currentMin = 9999999; // Arbitrarily large number
	for (var i = 0; i < enemies.length; i++)
		{
		var enemy = enemies[i];
		if (!enemy.sprite.dead)
			{
			var distance = Math.sqrt( Math.pow( (enemy.sprite.position.x - position.x), 2 ) + 
																Math.pow( (enemy.sprite.position.y - position.y), 2) );
			if (distance <= currentMin)
				{
				currentMin = distance;
				}
			}
		}
	return currentMin;
	};

/**
* Picks a random entry from a dictionary
* @param {Array} dict - The dictionary from which we pick an object
* @return {Object} A random object from the array
*/

var pickRandomFromDictionary = function (dict)
	{
	var keys = Object.keys(dict);
	var object
	object = dict[keys[ keys.length * Math.random() << 0]];
	return object;
	};

/**
* Return a player object closest to the given point or undefined if no player was found
* Used in some énemies when finding a new target
* @param {Array} players - The list of all player objects
* @param {Point} position - The point we need to find the closest player to  
* @return {player} - The player object closest to a point
*/
	var getLivingPlayerClosestToPoint = function(players, position) 
	{
	var currentMin = 9999999; // Arbitrarily large number
	var closestPlayer;
	var alivePlayers = getAllLivingFromDict(players);
	if(alivePlayers == undefined) return;
	for (var id in alivePlayers)
		{
		var player = alivePlayers[id];
		if (player != undefined)
			{
			var distance = Math.sqrt( Math.pow( (player.sprite.position.x - position.x), 2 ) + 
																Math.pow( (player.sprite.position.y - position.y), 2) );
			if (distance <= currentMin)
				{
				currentMin = distance;
				closestPlayer = player;
				}
			}
		}
	return closestPlayer;
	};

/**
* Return a single random living object from a dictionary
* @param {Array} dict - The dictionary containing the objects from which to find the living objects from
* @return {Object} - List containing all living objects
*/
var getAliveFromObject = function(dict)
	{
	var aliveObject = [];
	var keys = Object.keys(dict);
	for(var i = 0; i < Object.keys(dict).length; i++)
		{
		if(!dict[keys[i]].dead)
			{
			aliveObject.push(dict[keys[i]]);
			}
		}
	var random = Math.floor(Math.random() * aliveObject.length);
	if(aliveObject.length > 0)
		{
		return aliveObject[random];
		}
	return;
	};

/**
* Return a list of living objects from a dictionary
* @param {Array} dict - The dictionary containing the objects from which to find the living objects from
* @return {Array} - List containing all living objects
*/
var getAllLivingFromObject = function(dict)
	{
	var livingObjects = [];
	var keys = Object.keys(dict);
	for(var i = 0; i < Object.keys(dict).length; i++)
		{
		if(!dict[keys[i]].dead)
			{
			livingObjects.push(dict[keys[i]]);
			}
		}
	if(livingObjects.length > 0)
		{
		return livingObjects;
		}
	return;
	};

/**
* Returns a list of players around the specified point
* @param {Array} players - List of all players. 
* @param {Point} point - The point around which to check
* @param {Number} sizeX - The radius of the square in X direction which we use to check
* @param {Number} sizeY - The radius of the square in Y direction which we use to check
* @return {Array} List of all players within the specified area, or undefined if no players found in the area
*/
var getPlayersAroundPoint = function (players,point,sizeX,sizeY)
{
	//We use the data provided to construct a square around the area

	//Bottom left
	var squarePointsA = {}	
	squarePointsA.x = point.x-sizeX;
	squarePointsA.y = point.y-sizeY;

	//Top right
	var squarePointsB = {}
	squarePointsB.x = point.x+sizeX;
	squarePointsB.y = point.y+sizeY;

	return getPlayersInArea(players,squarePointsA,squarePointsB);

}


/**
* Return a list of players inside the provided area defined by two points
* @param {Array} players - List of all players in the game
* @param {Point} botLeft - Represents the bottom left corner coordinates of the square
* @param {Point} topRight - Represents the top right corner coordinates of the square
* @return {Array} Array containing players inside the provided area or undefined if no players found in the area
*/
var getPlayersInArea = function (players, botLeft, topRight) 
{
	var returnPlayers = [];
	var keys = Object.keys(players);
	var curPos;
	for(var i = 0; i < Object.keys(players).length; i++)
		{
			curPos = players[keys[i]].sprite.position;
			if(curPos.x > botLeft.x && 
				 curPos.y > botLeft.y && 
				 curPos.x < topRight.x && 
				 curPos.y < topRight.y)
			{
				returnPlayers.push(players[keys[i]]);
			}
		}
		if(returnPlayers.length > 0) 
		{
			return returnPlayers;
		}
		return;
}

/**
* Return a random integer between min and max
* @param {Number} min - the lowest possible number to return
* @param {Number} min - the highest possible number to return
*/
var getRandomInt = function (min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};


var getRandomPosition = function(border)
	{
	var position = {x: getRandomInt(game.camera.x + border, game.camera.x + game.width - border), 
					y: getRandomInt(game.camera.y + border, game.camera.y + game.height - border)};
	return position;
	};

/**
* Resizes the game to fit new window dimensions
*/
var resizeGame = function ()
	{
	var height = window.innerHeight * window.devicePixelRatio;
	var width = window.innerWidth * window.devicePixelRatio;

	if (game != undefined)
		{
		game.width = width;
		game.height = height;
		game.stage.bounds.width = width;
		game.stage.bounds.height = height;

		if (game.renderType === 1)
			{
			game.renderer.resize(width, height);
			Phaser.Canvas.setSmoothingEnabled(game.context, false);
			}
		}
	};
