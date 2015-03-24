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
    facing = 'right',
    bowtie,
    bowTime = 0,
    fireButton,
    fireKey,
    shotSound,
    jumpSound,
    explosionSound,
    scream,
    player,
    cupPath = [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150, -150],
    cupIndex;

function preload() {
  game.load.tilemap('background', './assets/groundfloor.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('blocks', './assets/blocks.png');
  game.load.image('steampunk', './assets/steampunkish-tilec.png');
  game.load.image('bookshelf', './assets/bookshelf.jpg');
  //game.load.image('head', './assets/character/head.png');
  game.load.image('bowtie', './assets/bowtie.png');
  game.load.image('coffeecan', './assets/coffeecan.png');
  game.load.spritesheet('cup', './assets/buxscupsheet.png', 64, 64, 4);
  game.load.spritesheet('head', './assets/headsheet.png', 64, 64, 3);
  game.load.audio('shoot', './assets/Pecheew.m4a');
  game.load.audio('explosion', './assets/Explosion.m4a');
  game.load.audio('jump', './assets/Whoop.m4a');
  //game.load.audio('train', './assets/dark.m4a');
  game.load.audio('scream', './assets/WilhelmScream.mp3');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  fireKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  cupIndex = 0;

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
  player.animations.add('left', [2]);
  player.animations.add('right', [1]);

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);


  //enemies

  cups = game.add.group();
  cups.enableBody = true;
  cups.createMultiple(15, 'cup');
  cups.setAll('collideWorldBounds', true);
  cups.setAll('body.gravity.y', 950);
  cups.forEach(function(cup) {
    game.physics.enable(cup, Phaser.Physics.ARCADE);
    cup.anchor.set(0.5, 0.5);
    cup.body.setSize(52, 63);
    cup.body.gravity.y = 950;
    cup.animations.add('left', [0, 1, 2, 3], 10, true);
    cup.animations.add('right', [0, 3, 2, 1], 10, true);
  });

  var cupPosition = [553,985, 1099, 1214, 1879, 2712, 2929, 3197, 3767, 4291, 4736, 4995, 5244, 6347, 6989];
  var counter = 0;

  cups.forEach(function(cup) {
    cup.reset(cupPosition[counter], 300);
    counter++;
  }, this);

  //cans
  coffeecans = game.add.group();
  coffeecans.enableBody = true;
  coffeecans.createMultiple(13, 'coffeecan');
  coffeecans.setAll('collideWorldBounds', true);
  coffeecans.forEach(function(coffeecan) {
    game.physics.enable(coffeecan, Phaser.Physics.ARCADE);
    coffeecan.body.gravity.y = 950;
    coffeecan.anchor.set(0.5, 0.5);
    coffeecan.body.setSize(41, 48);
  });

  var coffeecanPosition = [327, 740, 1640, 2190, 2500, 3390, 4098, 4410, 5450, 5800, 6160, 6566, 6844];
  var counter = 0;

  coffeecans.forEach(function(coffeecan) {
    coffeecan.reset(coffeecanPosition[counter], 300);
    counter++;
  }, this);


  //bowties
  bowties = game.add.group();
  bowties.enableBody = true;
  bowties.createMultiple(2, 'bowtie');
  bowties.setAll('body.setSize', 64, 36);
  //bowties.physicsBodyType = Phaser.Physics.ARCADE;

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
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 250;
      player.animations.play('right');
    } else {
      player.frame = 0;
    }

    if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
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

    if(player.body.velocity.x >= 0) {
      facing = 'right';
    } else {
      facing = 'left';
    }

    //cups
    cups.forEachAlive(function(cup) {
      if(cup.body.onFloor()) {
        cup.body.velocity.y = -350;
        cup.animations.play('left');
      }
    });

    //coffeecans
    // console.log('cupIndex', cupIndex);
    // console.log('cupPath.length', cupPath.length);
    // console.log('cupIndex === 0', cupIndex === 0);
    // console.log('cupIndex === cupPath.length - 1', cupIndex === cupPath.length - 1);
    coffeecans.forEachAlive(function(can){
      can.body.velocity.x = 0;
      can.body.velocity.x = cupPath[cupIndex];
    });
    cupIndex = cupIndex + 1 >= cupPath.length ? 0 : cupIndex + 1;

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
   if (game.time.now > bowTime  && facing === 'right') {
        bowtie = bowties.getFirstExists(false);

        if (bowtie) {
            bowtie.reset(player.x + 30, player.y - 20);
            bowtie.body.velocity.x = 500;
            bowTime = game.time.now + 350;
            shotSound.play();
        }
    } else if (game.time.now > bowTime && facing === 'left') {
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

