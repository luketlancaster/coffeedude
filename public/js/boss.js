'use strict';
game.state.add('boss', {create:create, update:update});

var jumpTimer = 0,
    map,
    layer,
    cursors,
    bowties,
    facing = 'right',
    bowtie,
    bowTime = 0,
    healthText,
    hitCount = 3,
    score = 0,
    scoreText,
    fireButton,
    shotSound,
    explosionSound,
    jwb,
    player;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //sounds
  explosionSound = game.add.audio('explosion');
  shotSound = game.add.audio('shoot');
  game.world.setBounds(0, 0, 800, 640);

  game.bg = game.add.tileSprite(0, 0, 800, 640, 'bossBG');

  map = game.add.tilemap('bossfight');
  map.addTilesetImage('steampunk');
  map.addTilesetImage('blocks');
  map.setCollisionByExclusion([1]);

  layer = map.createLayer('platforms');
  layer.resizeWorld();

  //player stuff

  player = game.add.sprite(12, 520, 'head');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.body.setSize(25, 50, 19, 0);
  player.body.gravity.y = 450;
  player.animations.add('left', [2]);
  player.animations.add('right', [1]);

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

  //jwb
  jwb = game.add.sprite(640, 200, 'jwb');
  jwb.animations.add('mad', [0, 1], 10, true);
  jwb.fixedToCamera = true;

  //bowties
  bowties = game.add.group();
  bowties.enableBody = true;
  bowties.createMultiple(2, 'bowtie');
  bowties.setAll('body.setSize', 64, 36);

  scoreText = game.add.text(20, 20, 'Local Artists\' Vinyl: 0', { fontSize: '32px', fill: '#FFF', align: 'center' });
  scoreText.fixedToCamera = true;

  healthText = game.add.text(660, 20, 'Health: 3', { fontSize: '32px', fill: '#FFF'});
  healthText.fixedToCamera = true;
}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.overlap(bowties, layer, killBowtie, null, this);

    player.body.velocity.x = 0;

    jwb.animations.play('mad');

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
        player.body.velocity.y = -350;
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
    //   player.body.velocity.y = -750;
    // } else if(cursors.down.isDown) {
    //   player.body.velocity.y = 750;
    // } else {
    //   player.body.velocity.y = 0;
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

    if(player.body.velocity.x >= 0) {
      facing = 'right';
    } else {
      facing = 'left';
    }
}

function fireBowtie() {
   if (game.time.now > bowTime  && facing === 'right') {
        bowtie = bowties.getFirstExists(false);

        if (bowtie) {
            bowtie.reset(player.x - 30, player.y - 10);
            bowtie.body.velocity.x = 700;
            bowTime = game.time.now + 350;
            shotSound.play();
        }
    } else if (game.time.now > bowTime && facing === 'left') {
        bowtie = bowties.getFirstExists(false);

        if (bowtie) {
            bowtie.reset(player.x - 30, player.y - 10);
            bowtie.body.velocity.x = -700;
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

function playerDeathHandler (player, enemy) {
  player.animations.play('damage');
  explosionSound.play();
  enemy.body.x = -200000;
  player.body.x -= 75;
  --hitCount;
  healthText.text = 'Health: ' + hitCount;
  if(hitCount === 0) {
    alert('game over!');
  }
}

function render() {
  game.debug.body(beans.children[0]);
  game.debug.body(player);
  cups.forEachAlive(function(cup){
    game.debug.body(cup);
  });
}