'use strict';

var game = new Phaser.Game(800, 640, Phaser.AUTO, '', { preload: preload, create: create, update: update }),
    jumpTimer = 0,
    map,
    layer,
    blockedLayer,
    cups,
    cup,
    coffeecans,
    coffeecan,
    cursors,
    bowties,
    music,
    bowtie,
    bowTime = 0,
    fireButton,
    fireKey,
    shotSound,
    jumpSound,
    explosionSound,
    scream,
    player;

function preload() {
  game.load.tilemap('background', './assets/groundfloor.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('blocks', './assets/blocks.png');
  game.load.image('steampunk', './assets/steampunkish-tilec.png');
  game.load.image('bookshelf', './assets/bookshelf.jpg');
  game.load.image('head', './assets/character/head.png');
  game.load.image('bowtie', './assets/bowtie.png');
  game.load.image('coffeecan', './assets/coffeecan.png');
  game.load.spritesheet('cup', './assets/buxscupsheet.png', 64, 64, 4);
  game.load.audio('shoot', './assets/Pecheew.m4a');
  game.load.audio('explosion', './assets/Explosion.m4a');
  game.load.audio('jump', './assets/Whoop.m4a');
  //game.load.audio('train', './assets/dark.m4a');
  game.load.audio('scream', './assets/WilhelmScream.mp3');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  fireKey = game.input.keyboard.addKey(Phaser.Keyboard.A);

  //sounds
  jumpSound = game.add.audio('jump');
  explosionSound = game.add.audio('explosion');
  shotSound = game.add.audio('shoot');
  //music = game.add.audio('train');
  scream = game.add.audio('scream');
  //game.world.setBounds(0, 0, 800, 640);

  game.bg = game.add.tileSprite(0, 0, 7040, 640, 'bookshelf');

  map = game.add.tilemap('background');
  map.addTilesetImage('steampunk');
  map.addTilesetImage('blocks');
  map.setCollisionByExclusion([1]);

  layer = map.createLayer('foreground');
  layer.resizeWorld();

  //game.physics.arcade.gravity.y = 450;

  //player stuff

  player = game.add.sprite(70, 500, 'head');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.body.setSize(36, 56, 14, -8);
  player.body.gravity.y = 450;

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);


  //enemies

  cups = game.add.group();
  cups.enableBody = true;
  for(var i = 0; i < 20; i++) {
    cup = cups.create(i * 420, 200, 'cup');
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
    //coffeecan.body.setSize(41, 48);
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

  // music.volume = 0.7;
  // music.loop = true;
  // music.play();
}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(cups, layer);
    game.physics.arcade.collide(coffeecans, layer);
    game.physics.arcade.collide(player, cups);
    game.physics.arcade.collide(cups, cups);
    game.physics.arcade.overlap(bowties, layer, killBowtie, null, this);
    game.physics.arcade.overlap(bowties, cups, cupHandler, null, this);
    game.physics.arcade.overlap(bowties, coffeecans, collisionHandler, null, this);

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -250;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 250;
    }
    if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
        jumpSound.play();
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
      cups.children[19].kill();
      if(cups.children[i].body.onFloor()) {
        cups.children[i].body.velocity.y = -350;
        cups.children[i].animations.play('left');
      }
    }

    //coffeecans
    // coffeecans.forEachAlive(function(coffeecan){
    //   coffeecan.body.velocity.x = -300;
    //   if(coffeecan.body.touching.left || coffeecan.body.touching.right) {
    //     coffeecan.body.velocity.x *= -1;
    //   }
    // });

    // for(var u = 0; u < 20; u++) {
    //   if(coffeecans.children[u].body.onFloor) {
    //     coffeecans.children[u].body.velocity.x = 300;
    //   }
    //   if(coffeecans.children[u].body.blocked.right) {
    //     coffeecans.children[u].body.velocity.x *= -1;
    //     //coffeecans.children[u].body.velocity.y = 2000;
    //   }
    // }

    //bowties
    bowties.forEachAlive(function(bowtie){
      var distanceFromPlayer = 600;
      if(Math.abs(player.x - bowtie.x) >= distanceFromPlayer) {
        bowtie.kill();
      }
    }, this);

    if(fireButton.isDown) {
      fireBowtie();
    }

}

function fireBowtie() {
   if (game.time.now > bowTime  && player.body.facing !== 1) {
        bowtie = bowties.getFirstExists(false);

        if (bowtie) {
            bowtie.reset(player.x + 30, player.y - 20);
            bowtie.body.velocity.x = 500;
            bowTime = game.time.now + 750;
            shotSound.play();
        }
    } else if (game.time.now > bowTime && player.body.facing === 1) {
        bowtie = bowties.getFirstExists(false);

        if (bowtie) {
            bowtie.reset(player.x - 30, player.y - 20);
            bowtie.body.velocity.x = -500;
            bowTime = game.time.now + 750;
            shotSound.play();
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
    explosionSound.play();
    bowtie.kill();
    cup.kill();
}

function cupHandler (bowtie, cup) {
    scream.play();
    bowtie.kill();
    cup.kill();
}

