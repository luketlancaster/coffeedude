'use strict';

var game = new Phaser.Game(800, 640, Phaser.AUTO, '', { preload: preload, create: create, update: update }),
    jumpTimer = 0,
    map,
    layer,
    cups,
    cup,
    coffeecans,
    coffeecan,
    cursors,
    bowties,
    bowtie,
    bowTime = 0,
    jumpButton,
    fireKey,
    player;

function preload() {
  game.load.tilemap('background', '/assets/groundfloor.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('blocks', '/assets/blocks.png');
  game.load.image('steampunk', '/assets/steampunkish-tilec.png');
  game.load.image('beans', '/assets/bookshelf.jpg');
  game.load.image('head', '/assets/character/head.png');
  game.load.image('bowtie', '/assets/bowtie.png');
  game.load.image('coffeecan', '/assets/coffeecan.png');
  game.load.spritesheet('cup', '/assets/buxscupsheet.png', 64, 64, 4);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  fireKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  //game.world.setBounds(0, 0, 800, 640);

  game.bg = game.add.tileSprite(0, 0, 7040, 640, 'beans');

  map = game.add.tilemap('background');
  map.addTilesetImage('steampunk');
  map.addTilesetImage('blocks');
  map.setCollisionByExclusion([1]);

  layer = map.createLayer('foreground');
  layer.resizeWorld();

  //game.physics.arcade.gravity.y = 450;

  //player stuff

  player = game.add.sprite(70, 520, 'head');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.body.setSize(24, 38);
  player.body.gravity.y = 450;

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);


  //enemies

  cups = game.add.group();
  cups.enableBody = true;
  for(var i = 0; i < 20; i++) {
    cup = cups.create(i * 400, 400, 'cup');
    game.physics.enable(cup, Phaser.Physics.ARCADE);
    cup.body.collideWorldBounds = true;
    cup.body.setSize(52, 63);
    cup.body.gravity.y = 950;
    cup.animations.add('left', [0, 1, 2, 3], 10, true);
    cup.animations.add('right', [0, 3, 2, 1], 10, true);
  }

  coffeecans = game.add.group();
  coffeecans.enableBody = true;
  for(var i = 0; i < 20; i++) {
    coffeecan = coffeecans.create((i * 1150), 350, 'coffeecan');
    coffeecan.body.collideWorldBounds = true;
    coffeecan.body.setSize(41, 48);
    coffeecan.body.gravity.y = 350;
  }

  //bowties
  bowties = game.add.group();
  bowties.enableBody = true;
  bowties.physicsBodyType = Phaser.Physics.ARCADE;
  for(var i = 0; i < 20; i++) {
    var b = bowties.create(100000, 1000000, 'bowtie');
    b.name = 'bowtie' + i;
    b.body.gravity.y = 0;
    b.body.setSize(64, 36);
    b.exists = false;
    b.visible = true;
    b.events.onOutOfBounds.add(resetBowtie, this);
    b.checkWorldBounds = true;
  }

  game.cameraLastX = game.camera.x;
  game.cameraLastY = game.camera.y;
}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(cups, layer);
    game.physics.arcade.collide(coffeecans, layer);
    game.physics.arcade.collide(player, cups);
    game.physics.arcade.collide(cups, cups);
    game.physics.arcade.overlap(bowties, layer, killBowtie, null, this);
    game.physics.arcade.overlap(bowties, cups, collisionHandler, null, this);

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

    //cups
    for(var i = 0; i < 20; i++) {
      cups.children[0].kill();
      if(cups.children[i].body.onFloor()) {
        cups.children[i].body.velocity.y = -350;
        cups.children[i].animations.play('left');
      }
    }

    //coffeecans
    for(var p = 0; p < 20; p++) {
      coffeecans.children[0].kill();
      if(coffeecans.children[p].body.onFloor()) {
        coffeecans.children[p].body.velocity.x = 350;
      }
    }

    //bowties
    for(var u = 0; u < 20; u++) {
      if(bowties.children[u].x > (game.cameraLastX + 4000)) {
        bowties.children[u].kill();
      }
    }

    if(fireKey.isDown) {
      fireBowtie();
    }

}

function fireBowtie() {
   if (game.time.now > bowTime)
    {
        bowtie = bowties.getFirstExists(false);

        if (bowtie)
        {
            bowtie.reset(player.x + 6, player.y - 8);
            bowtie.body.velocity.x = 500;
            bowTime = game.time.now + 750;
            //sound.play('');
        }
    }
}

function resetBowtie(bowtie) {
  bowtie.kill();
}

function killBowtie(bowtie, layer) {
  bowtie.kill();
}

function collisionHandler (bowtie, cup) {
    bowtie.kill();
    cup.kill();
}

