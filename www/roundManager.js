'use strict';

function RoundManager (game, bulletManager, enemyManager)
{

var self = this;

// Variables related to managing game mechanics

var players = {};
var playerGroup = game.add.group();
playerGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
playerGroup.enableBody = true;

var roundRunning = false;

// Variables related to map functioning

var currentRound;
var currentDirection;
var currentSpeed;
var rooms = [];
var roomGroup = game.add.group();
var nextRoom;


var lastPaused = 0;
var pauseTime = 500;

var speedDict = [];
speedDict["slow"] = 0.25;
speedDict["normal"] = 0.5;
speedDict["fast"] = 1;
speedDict["stop"] = null;


self.loadRound = (roundData) =>
	{

	// Set camera in the middle of the stage
	game.camera.x = game.world.width/2 - game.camera.width/2;
	game.camera.y = game.world.height/2 - game.camera.height/2;

	currentRound = round1;

	rooms[0] = null;

	// Load first two rooms;
	for (var i = 0; i < Math.min(2, currentRound.length); i++)
		{
		rooms[i + 1] = new Room(game,
														currentRound[i].roomBg,
														currentRound[i].tileset,
														currentRound[i].roomJSON,
														currentRound[i].moveDirection,
														currentRound[i].moveSpeed);
		rooms[i + 1].preload(instantiateRound);
		}

	nextRoom = 2;

	};

var instantiateRound = () =>
	{

	// Position the two loaded rooms correctly

	rooms[1].moveTo(game.camera.x, game.camera.y);
	switch (rooms[1].moveDirection)
		{
		case "north":
			rooms[2].moveTo(game.camera.x, game.camera.y - game.camera.height);
			break;
		case "east":
			rooms[2].moveTo(game.camera.x + game.camera.width, game.camera.y);
			break;
		case "south":
			rooms[2].moveTo(game.camera.x, game.camera.y + game.camera.height);
			break;
		case "west":
			rooms[2].moveTo(game.camera.x - game.camera.width, game.camera.y);
		default:
			rooms[2] = null;
		}
	startRound();
	};

var startRound = () =>
	{
	roundRunning = true;
	currentDirection = rooms[1].moveDirection;
	currentSpeed = rooms[1].moveSpeed;

	};

// Client data parsing

self.setPlayerInput = (id, input) =>
	{
	if (players[id] != undefined)
		{
		players[id].setInput(input);
		}
	};

self.newPlayer = (id) =>
	{
	players[id] = new Player(game, game.camera.x + game.camera.width/2, game.camera.y + game.camera.height/2, bulletManager, id);
	playerGroup.add(players[id].playerSprite);
	};

self.disconnectPlayer = (id) =>
	{
	if (players[id] != undefined)
		{
		playerGroup.remove(players[id].playerSprite);
		players[id].kill();
		players[id] = undefined;
		}
	};

// Functions that manage game mechanics

self.update = () =>
	{
	game.world.bringToTop(playerGroup);
	game.world.bringToTop(enemyManager.enemyGroup);
	bulletManager.playerBulletGroups.forEach((whatToBring) => { game.world.bringToTop(whatToBring) }, this);
	bulletManager.enemyBulletGroups.forEach((whatToBring) => { game.world.bringToTop(whatToBring) }, this);

	if (roundRunning && lastPaused < game.time.now)
		{
		bulletManager.update();

		for (var id in players)
			{
			if (players[id] != undefined)
				{
				players[id].update();
				}
			}

		enemyManager.update(players);

		game.physics.arcade.collide(playerGroup);
		game.physics.arcade.collide(enemyManager.enemyGroup);
		game.physics.arcade.collide(playerGroup, enemyManager.enemyGroup);

		for (var i = 0; i < bulletManager.playerBulletGroups.length; i++)
			{
			game.physics.arcade.collide(bulletManager.playerBulletGroups[i], playerGroup);
			game.physics.arcade.collide(bulletManager.playerBulletGroups[i], enemyManager.enemyGroup);
			}

		updateRoomMovement();
		} 

	};

var updateRoomMovement = () =>
	{
	rooms.forEach((room, index, array) => { if (room != undefined) { room.updateScaling(); } });

	if (speedDict[currentSpeed] != undefined)
		{
		// Figure out which speed to go
		
		var curSpeed = speedDict[currentSpeed];

		// Figure out in which direction to move rooms

		var changeInPos;
		switch (currentDirection)
			{
			case "north":
				changeInPos = {"x": 0, "y": -curSpeed};
				break;
			case "east":
				changeInPos = {"x": curSpeed, "y": 0};
				break;
			case "south":
				changeInPos = {"x": 0, "y": curSpeed};
				break;
			case "west":
				changeInPos = {"x": -curSpeed, "y": 0};
				break;
			default:
				console.log("something went awry");
			}

		for (var i = 0; i < rooms.length; i++)
			{
			game.camera.x += changeInPos.x;
			game.camera.y += changeInPos.y;
			}

		// Check if next room has passed the game.camera, if it has, align it with camera, load new room etc.

		if (Math.abs(rooms[2].getPos().x - game.camera.x) <= Math.abs(changeInPos.x) &&
				Math.abs(rooms[2].getPos().y - game.camera.y) <= Math.abs(changeInPos.y))
			{
			rooms.shift();
			delete rooms[0];

			rooms[1].moveTo(game.camera.x, game.camera.y);

			currentDirection = rooms[1].moveDirection;
			currentSpeed = rooms[1].moveSpeed;

			if (speedDict[currentSpeed] != undefined)
				{
				rooms[2] = new Room(game,
														currentRound[nextRoom].roomBg,
														currentRound[nextRoom].tileset,
														currentRound[nextRoom].roomJSON,
														currentRound[nextRoom].moveDirection,
														currentRound[nextRoom].moveSpeed);
				rooms[2].preload(instantiateNewRoom)
				lastPaused = game.time.now + pauseTime;
				nextRoom++;
				}
			}
		}
	};

var instantiateNewRoom = () =>
	{
	switch (rooms[1].moveDirection)
		{
		case "north":
			rooms[2].moveTo(game.camera.x, game.camera.y - game.camera.height);
			break;
		case "east":
			rooms[2].moveTo(game.camera.x + game.camera.width, game.camera.y);
			break;
		case "south":
			rooms[2].moveTo(game.camera.x, game.camera.y + game.camera.height);
			break;
		case "west":
			rooms[2].moveTo(game.camera.x - game.camera.width, game.camera.y);
		default:
			rooms[2] = null;
		}
	};
}


