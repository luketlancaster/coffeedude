'use strict';

var game = new Phaser.Game(800, 640, Phaser.AUTO, '', { preload: preload, create: create, update: update }),
    jumpTimer = 0,
    map,
    layer,
    cups,
    cup,
    cursors,
    jumpButton,
    player;

function preload() {
  game.load.tilemap('background', '/assets/groundfloor.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('blocks', '/assets/blocks.png');
  game.load.image('steampunk', '/assets/steampunkish-tilec.png');
  game.load.image('beans', '/assets/bookshelf.jpg');
  game.load.image('head', '/assets/character/head.png');
  game.load.spritesheet('cup', '/assets/buxscupsheet.png', 64, 64, 4);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  //game.world.setBounds(0, 0, 800, 640);

  game.bg = game.add.tileSprite(0, 0, 7040, 640, 'beans');

  map = game.add.tilemap('background');
  map.addTilesetImage('steampunk');
  map.addTilesetImage('blocks');
  map.setCollisionByExclusion([1]);

  layer = map.createLayer('foreground');
  layer.resizeWorld();

  game.physics.arcade.gravity.y = 450;

  //player stuff

  player = game.add.sprite(70, 520, 'head');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.body.setSize(24, 38);

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);


  cups = game.add.group();
  cups.enableBody = true;
  for(var i = 0; i < 40; i++) {
    cup = cups.create(i * 400, 400, 'cup');
    game.physics.enable(cup, Phaser.Physics.ARCADE);
    cup.body.collideWorldBounds = true;
    cup.body.setSize(52, 63);
    cup.animations.add('left', [0, 1, 2, 3], 10, true);
    cup.animations.add('right', [0, 3, 2, 1], 10, true);
  }

  game.cameraLastX = game.camera.x;
  game.cameraLastY = game.camera.y;
}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(cups, layer);
    game.physics.arcade.collide(player, cups);
    game.physics.arcade.collide(cups, cups);

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -250;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 250;
    }
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

    if(game.camera.x !== game.cameraLastX){
      game.bg.x -= 0.2 * (game.cameraLastX - game.camera.x);
      game.cameraLastX = game.camera.x;
    }
    if(game.camera.y !== game.cameraLastY){
      game.bg.y -= 0.2 * (game.cameraLastY - game.camera.y);
      game.cameraLastY = game.camera.y;
    }

    for(var i = 0; i < 40; i++) {

      if(cups.children[i].body.onFloor()) {
        cups.children[i].body.velocity.y = -550;
      }

      if(cursors.right.isDown) {
        game.physics.arcade.moveToObject(cups.children[i], player);
        cups.children[i].animations.play('right');
      } else {
        cups.children[i].body.velocity.x = 0;
        cups.children[i].animations.play('left');
      }

    }

}


