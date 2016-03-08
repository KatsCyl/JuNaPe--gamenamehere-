'use strict';

//var w = window.innerWidth * window.devicePixelRatio;
//var h = window.innerHeight * window.devicePixelRatio;

var w = 16 * 37;
var h = 9 * 30;
var serverAddress = 'localhost';

var gameController = new Phaser.Game(w, h, Phaser.CANVAS);

var controller_state = {};

//get player name and class from url parameters
var urlstring = window.location.href;
var name;
var playerclass;
if (urlstring.indexOf('?') > -1)
	{
	var params = urlstring.split("?")[1];
	//console.log(params);
	var name = params.split("&")[0].split("=")[1];
	var playerclass = params.split("&")[1].split("=")[1];
	
	if (name == "")
		{
		name = 'johndoe';
		}
	console.log("name = "+name);
	console.log("class = "+playerclass);
	}

controller_state.main = function ()
{
var self = this;
self.id;

var game = gameController;
var startMove = new Phaser.Point(0, 0);
var endMove = new Phaser.Point(0, 0);
var startShoot = new Phaser.Point(0, 0);
var endShoot = new Phaser.Point(0, 0);
var anglePoint = new Phaser.Point(-1, 0);

var moveStick = {pointer: false, pad: false};
var shootStick = {pointer: false, pad: false};
var controllerpad1;
var controllerpad2;

self.preload = () =>
	{
	self.id = getParameter("id");
	if (!self.id)
		{
		self.id = game.rnd.integerInRange(0, 1000);
		}

	gameClient.connect(serverAddress, controllerPort, self.id, self.clientConnected);
	//console.log("Game.js Connecting to: "+serverAddress+ "Port: "+controllerPort);
	game.load.image('background', 'assets/bg/cbg.png');
	game.load.image('circlepad', 'assets/other/controller_circle.png');
	};

self.render = () => 
	{
	game.debug.pointer(gameController.input.mousePointer);
	game.debug.pointer(gameController.input.pointer1);
	game.debug.pointer(gameController.input.pointer2);
	};

self.create = () =>
	{
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.stage.disableVisibilityChange = true;
	self.background = game.add.sprite(0, 0, 'background');
	self.background.height = h;
	self.background.width = w;
	self.background.smoothed = false;
	game.input.onDown.add(self.pointerOnDown, this);
	game.input.onUp.add(self.pointerOnUp, this);
	controllerpad1 = game.add.sprite(0, 0, 'circlepad');
	controllerpad1.exists = false;
	controllerpad2 = game.add.sprite(0, 0, 'circlepad');
	controllerpad2.exists = false;
	};
	
self.reservePointer = (stick, pointer, pad) =>
	{
	if(!stick.pointer)
		{
		stick.pointer = pointer;
		pad.exists = true;
		pad.x = pointer.position.x - 30;
		pad.y = pointer.position.y - 30;
		stick.pad = pad;
		/*
		if(pointer === moveStick.pointer)
			{
			//console.log('pointer reserved to move');
			} else if (pointer === shootStick.pointer)
			{
			//console.log('pointer reserved to shoot');
			}
			
		} else 
		{
		//console.log("** failed to reserve pointer **");
		*/
		}
	};
	
self.releasePointer = (pointer) =>
	{
	if(moveStick.pointer === pointer)
		{
		moveStick.pointer = false;
		moveStick.pad.exists = false;
		moveStick.pad = false;
		//console.log("released movestick");
		} else if (shootStick.pointer === pointer)
		{
		shootStick.pointer = false;
		shootStick.pad.exists = false;
		shootStick.pad = false;
		//console.log("released shootstick");
		} else 
		{
		//console.log("-- failed to release pointer --");
		}
	};
	
self.matchMoveStickCoords = (pointer) =>
	{
	startMove.x = pointer.position.x;
	startMove.y = pointer.position.y;
	endMove.x = pointer.position.x;
	endMove.y = pointer.position.y;
	};
	
self.matchShootStickCoords = (pointer) =>
	{
	startShoot.x = pointer.position.x;
	startShoot.y = pointer.position.y;
	endShoot.x = pointer.position.x;
	endShoot.y = pointer.position.y;
	};
	
self.pointerOnDown = function()
	{
	var pointer = arguments[0];
	var left = pointer.position.x < w/2;
	if(left)
		{
		self.reservePointer(moveStick, pointer, controllerpad1);
		self.matchMoveStickCoords(pointer);
		} else 
		{
		self.reservePointer(shootStick, pointer, controllerpad2);
		self.matchShootStickCoords(pointer);
		}
	};
	
self.pointerOnUp = function()
	{
	var pointer = arguments[0];
	if(pointer === moveStick.pointer)
		{
		self.matchMoveStickCoords(pointer);
		} else if (pointer === shootStick.pointer)
		{
		self.matchShootStickCoords(pointer);
		}
	self.releasePointer(pointer);
	};
	
self.dragPointer = (pointer) =>
	{
	if(pointer.isDown)
		{
		if(pointer === moveStick.pointer)
			{
			endMove.x = pointer.position.x;
			endMove.y = pointer.position.y;
			} else if (pointer === shootStick.pointer)
			{
			endShoot.x = pointer.position.x;
			endShoot.y = pointer.position.y;
			} else 
			{
			//console.log('^^ dragging unreserved pointer ^^' );
			console.log(pointer);
			}
		}
	};
	
var vectorizeInput = (start, end) =>
	{
	var target = new Phaser.Point(end.x - start.x, end.y - start.y);
	return target;//.normalize();
	}
	
self.update = () =>
	{
	self.dragPointer(game.input.pointer1);
	self.dragPointer(game.input.pointer2);
	self.dragPointer(game.input.mousePointer);
	
	var vectorMove = vectorizeInput(startMove, endMove);
	var normalShoot = vectorizeInput(startShoot, endShoot).normalize();
	
	var angle = Phaser.Point.angle(vectorMove, anglePoint) * 180/Math.PI;
	var length = vectorMove.getMagnitude() / 30;
	
	var input = {moveAngle:angle, moveLength:length, sX:normalShoot.x, sY:normalShoot.y};
	//console.log(input);

	gameClient.callScreenRpc(1, "setPlayerInput", [self.id, input], self, null);
	};

self.clientConnected = () =>
	{
	gameClient.exposeRpcMethod("setStickPosition", self, self.setStickPosition);
	gameClient.exposeRpcMethod("getStickPosition", self, self.getStickPosition);
	};

self.setStickPosition = function(position)
	{
	console.log("DemoController::setStickPosition() "+position);
	};

self.getStickPosition = function(connectionId, callback)
	{
	callback(null, [666,667]);
	};

}

gameController.state.add('main', controller_state.main);
gameController.state.start('main');
