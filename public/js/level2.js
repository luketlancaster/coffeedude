'use strict';
game.state.add('lvl2', {create:create, update:update});

var jumpTimer = 0,
    map,
    layer,
    platformLayer,
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

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  fireKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  cupIndex = 0;

  //sounds
  explosionSound = game.add.audio('explosion');
  shotSound = game.add.audio('shoot');
  scream = game.add.audio('scream');
  game.world.setBounds(0, 0, 800, 640);

  game.bg = game.add.tileSprite(0, 0, 7040, 640, 'treeBG');

  map = game.add.tilemap('background2');
  map.addTilesetImage('steampunk');
  map.addTilesetImage('blocks');
  map.addTilesetImage('trees2');

  layer = map.createLayer('background');
  platformLayer = map.createLayer('platforms');
  layer.resizeWorld();
  platformLayer.resizeWorld();
  map.setCollisionByExclusion([1]);


  //player stuff

  player = game.add.sprite(0, 0, 'head');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = false;
  player.body.setSize(36, 56, 14, -8);
  player.body.gravity.y = 600;
  player.animations.add('left', [2]);
  player.animations.add('right', [1]);

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);


  //enemies

  // var cupPosition = [553,985, 1099, 1214, 1879, 2712, 2929, 3197, 3767, 4291, 4736, 4995, 5244, 6347, 6989];
  // var counter = 0;

  // cups = game.add.group();
  // cups.enableBody = true;
  // cups.createMultiple(15, 'cup');
  // cups.setAll('collideWorldBounds', true);
  // cups.setAll('body.gravity.y', 950);
  // cups.forEach(function(cup) {
  //   game.physics.enable(cup, Phaser.Physics.ARCADE);
  //   cup.anchor.set(0.5, 0.5);
  //   cup.body.setSize(52, 63);
  //   cup.body.gravity.y = 950;
  //   cup.animations.add('left', [0, 1, 2, 3], 10, true);
  //   cup.animations.add('right', [0, 3, 2, 1], 10, true);
  // });

  // cups.forEach(function(cup) {
  //   cup.reset(cupPosition[counter], 300);
  //   counter++;
  // }, this);

  // //cans

  // var coffeecanPosition = [327, 740, 1640, 2190, 2500, 3390, 4098, 4410, 5450, 5800, 6160, 6566, 6844];
  // var counter = 0;

  // coffeecans = game.add.group();
  // coffeecans.enableBody = true;
  // coffeecans.createMultiple(13, 'coffeecan');
  // coffeecans.setAll('collideWorldBounds', true);
  // coffeecans.forEach(function(coffeecan) {
  //   game.physics.enable(coffeecan, Phaser.Physics.ARCADE);
  //   coffeecan.body.gravity.y = 950;
  //   coffeecan.anchor.set(0.5, 0.5);
  //   coffeecan.body.setSize(41, 48);
  // });

  // coffeecans.forEach(function(coffeecan) {
  //   coffeecan.reset(coffeecanPosition[counter], 300);
  //   counter++;
  // }, this);


  //bowties
  bowties = game.add.group();
  bowties.enableBody = true;
  bowties.createMultiple(2, 'bowtie');
  bowties.setAll('body.setSize', 64, 36);

  beans = game.add.group();
  beans.enableBody = true;
  beans.createMultiple(2, 'bean');
  beans.setAll('body.setSize', 32, 32);

  game.cameraLastX = game.camera.x;
  game.cameraLastY = game.camera.y;

}

function update() {

    game.physics.arcade.collide(player, platformLayer);
    game.physics.arcade.collide(cups, layer);
    game.physics.arcade.collide(coffeecans, layer);
    game.physics.arcade.collide(player, cups);
    game.physics.arcade.collide(player, coffeecans);
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

    if(player.body.y >= 750) {
      player.body.y = -50;
      player.body.x = player.body.x + 1;
    }

    if (player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -350;
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

    if(player.body.velocity.x >= 0) {
      facing = 'right';
    } else {
      facing = 'left';
    }

    //cups
    // cups.forEachAlive(function(cup) {
    //   if(cup.body.onFloor()) {
    //     cup.body.velocity.y = -350;
    //     cup.animations.play('left');
    //   }
    // });

    // //coffeecans
    // coffeecans.forEachAlive(function(can){
    //   can.body.velocity.x = 0;
    //   can.body.velocity.x = cupPath[cupIndex];
    // });
    // cupIndex = cupIndex + 1 >= cupPath.length ? 0 : cupIndex + 1;

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
            bowtie.reset(player.x - 30, player.y - 20);
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
    explosionSound.play();
    bowtie.kill();
    cup.kill();
}

