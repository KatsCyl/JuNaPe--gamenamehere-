var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.spritesheet('dude', 'assets/player_classes/hahmo1.png', 90, 135);
}

//var platforms;
var player;
var cursors;
function create() {
//    platforms = game.add.group();
    game.add.sprite(0,0, 'sky');
    player = game.add.sprite(400, 300, 'dude');
    game.physics.arcade.enable(player);
    cursors = game.input.keyboard.createCursorKeys();
    game.world.setBounds(0, 0, 800, 600);
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0], 20, true);
    player.animations.add('right', [1], 20, true);
}

function update() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    if(cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
        //change player picture
    }
    if(cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    if(cursors.up.isDown)
    {
        player.body.velocity.y = -150;
    }
    if(cursors.down.isDown)
    {
        player.body.velocity.y = 150;
    }
}