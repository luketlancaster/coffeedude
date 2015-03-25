'use strict';
game.state.add('lvl1', {create:create, update:update});

var jumpTimer = 0,
    hitCount = 0,
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
    boss,
    cupTime = 0,
    beans,
    bean,
    records,
    record,
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

  game.bg = game.add.tileSprite(0, 0, 7040, 640, 'bookshelf');

  map = game.add.tilemap('background');
  map.addTilesetImage('steampunk');
  map.addTilesetImage('blocks');
  map.setCollisionByExclusion([1]);

  layer = map.createLayer('foreground');
  layer.resizeWorld();

  //player stuff

  player = game.add.sprite(70, 500, 'head');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.body.setSize(25, 50, 19, 0);
  player.body.gravity.y = 450;
  player.animations.add('left', [2]);
  player.animations.add('right', [1]);

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

  //collectables

  var recordPosition = [138, 419, 690, 1340, 1472, 1957, 2064, 2800, 3065, 3582, 3919, 4202, 4538, 4868, 5109, 6022, 6479, 6766];
  var recordCounter = 0;

  records = game.add.group();
  records.enableBody = true;
  records.createMultiple(19, 'record');
  records.forEach(function(record){
    game.physics.enable(record, Phaser.Physics.ARCADE);
    record.anchor.set(0.5, 0.5);
    record.body.gravity.y = 950;
    record.body.bounce = 0.5;
  });

  records.forEach(function(record){
    record.reset(recordPosition[recordCounter], 400);
    recordCounter++;
  }, this);


  //enemies

  var cupPosition = [553,985, 1099, 1214, 1879, 2712, 2929, 3197, 3767, 4291, 4736, 4995, 5244, 6347, 6989];
  var cupCounter = 0;

  cups = game.add.group();
  cups.enableBody = true;
  cups.createMultiple(15, 'cup');
  cups.setAll('body.gravity.y', 950);
  cups.forEach(function(cup) {
    game.physics.enable(cup, Phaser.Physics.ARCADE);
    cup.anchor.set(0.5, 0.5);
    cup.body.setSize(44, 63);
    cup.body.gravity.y = 950;
    cup.animations.add('left', [0, 1, 2, 3], 10, true);
    cup.animations.add('right', [0, 3, 2, 1], 10, true);
  });

  cups.forEach(function(cup) {
    cup.reset(cupPosition[cupCounter], 300);
    cupCounter++;
  }, this);

  //cans

  var coffeecanPosition = [327, 740, 1640, 2190, 2500, 3390, 4098, 4410, 5450, 5800, 6160, 6566, 6844];
  var canCounter = 0;

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

  coffeecans.forEach(function(coffeecan) {
    coffeecan.reset(coffeecanPosition[canCounter], 300);
    canCounter++;
  }, this);


  //bowties
  bowties = game.add.group();
  bowties.enableBody = true;
  bowties.createMultiple(2, 'bowtie');
  bowties.setAll('body.setSize', 64, 36);

  beans = game.add.group();
  beans.enableBody = true;
  beans.createMultiple(50, 'bean');
  //beans.setAll('body.setSize', 22, 22);
  beans.forEach(function(bean){
    bean.body.setSize(15, 15);
  });

  game.cameraLastX = game.camera.x;
  game.cameraLastY = game.camera.y;

}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(records, layer);
    game.physics.arcade.collide(cups, layer);
    game.physics.arcade.collide(coffeecans, layer);
    game.physics.arcade.overlap(bowties, layer, killBowtie, null, this);
    game.physics.arcade.overlap(bowties, cups, cupHandler, null, this);
    game.physics.arcade.overlap(bowties, coffeecans, collisionHandler, null, this);
    game.physics.arcade.overlap(beans, layer, killBowtie, null, this);
    game.physics.arcade.overlap(beans, cups, collisionHandler, null, this);
    game.physics.arcade.overlap(player, beans, playerDeathHandler, null, this);
    game.physics.arcade.overlap(player, coffeecans, playerDeathHandler, null, this);
    game.physics.arcade.overlap(player, cups, playerDeathHandler, null, this);

    player.body.velocity.x = 0;


    /* actual movement */
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
    }

    /* flying movement */
    // if (cursors.left.isDown) {
    //   player.body.velocity.x = -750;
    //   player.animations.play('left');
    // } else if (cursors.right.isDown) {
    //   player.body.velocity.x = 750;
    //   player.animations.play('right');
    // } else {
    //   player.frame = 0;
    //   player.body.velocity.x = 0;
    // }

    // if(cursors.up.isDown) {
    //   player.body.velocity.y = -250;
    // } else if(cursors.down.isDown) {
    //   player.body.velocity.y = 250;
    // } else {
    //   player.body.velocity.y = 0;
    // }

    if(game.camera.x !== game.cameraLastX){
      game.bg.x -= 0.4 * (game.cameraLastX - game.camera.x);
      game.cameraLastX = game.camera.x;
    }

    // if(game.camera.y !== game.cameraLastY){
    //   game.bg.y -= 0.2 * (game.cameraLastY - game.camera.y);
    //   game.cameraLastY = game.camera.y;
    // }

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

      if(cup.body.x - player.body.x <= 200) {
        cupFire(cup);
      }
    });

    //coffeecans
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

    beans.forEachAlive(function(bean){
      if(bean.body.x - game.cameraLastX <= 0) {
        bean.kill();
      }
    });

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

function cupFire (cup) {
  if (game.time.now > cupTime)
  {
    bean = beans.getFirstExists(false);
    if (bean) {
      bean.anchor.setTo(0.5, 0.5);
      bean.reset(cup.body.x - 30, cup.body.y);
      cupTime = game.time.now + 2000;
      game.physics.arcade.moveToObject(bean, player, 140);
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

function playerDeathHandler (player, enemy) {
    explosionSound.play();
    //player.body.x = 75;
    ++hitCount;
    if(hitCount === 3) {
      alert('game over!');
    }
}

function cupHandler (bowtie, cup) {
    explosionSound.play();
    bowtie.kill();
    cup.kill();
}

function render() {
  game.debug.body(beans.children[0]);
  game.debug.body(player);
  cups.forEachAlive(function(cup){
    game.debug.body(cup);
  });
}

