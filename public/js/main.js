'use strict';

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platforms;
var player;
var cups;
var score = 0;
var scoreText;
var bullets;
var bulletTime = 0;
var bullet;
var cursors;
var map;
var layer;

function preload() {
  game.load.tilemap('background', 'assets/grassland.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('grass', 'assets/tilesets/grass-tiles-2-small.png');
  game.load.image('sky', 'assets/sbux.jpg');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('cup', 'assets/character/cup.png');
  game.load.image('bowetie', 'assets/character/bowtie.png');
  game.load.spritesheet('dude', 'assets/character/head.png', 48, 48);
}

function create() {

  map = game.add.tilemap('background');
  map.addTilesetImage('grassland', 'grass');

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0,0, 'sky').width = 800;
  game.add.sprite(0,0, 'sky').height = 600;
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
  platforms = game.add.group();
  platforms.enableBody = true;
  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;

  //Sprite
  player = game.add.sprite(32, game.world.height -150, 'dude');
  game.physics.arcade.enable(player);
  // player.body.bounce.y = 2;
  player.body.gravity.y = 0;
  player.body.collideWorldBounds = true;
  player.body.allowRotation = false;

  //Bullet stuff
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  for (var i = 0; i < 20; i++) {
    var b = bullets.create(100000, 10000000, 'bowetie');
    b.name = 'bowetie' + i;
    b.exists = false;
    b.visible = true;
    b.checkWorldBounds = true;
    b.body.bounce.y = 0.7 + Math.random() * 0.2;
    b.events.onOutOfBounds.add(resetBullet, this);
  };

  //Star Stuff
  cups = game.add.group();
  cups.enableBody = true;
  for(var i = 0; i < 12; i++) {
    var cup = cups.create(i * 70, 0, 'cup');
    cup.body.gravity.y = 600;
    cup.body.bounce.y = 0.7 + Math.random() * 0.5;
  }
}

function update() {
  game.physics.arcade.collide(player, platforms);
  var cursors = game.input.keyboard.createCursorKeys();
  player.body.velocity.x = 0;

  if(cursors.left.isDown){
    player.body.velocity.x = -350;
  }

  if (cursors.right.isDown) {
      player.body.velocity.x = 350;
  }

  if(cursors.up.isDown) {
    player.body.velocity.y = -350;
  } else {
    player.body.velocity.y = 0;
  }

  if(cursors.down.isDown) {
    player.body.velocity.y = 350;
  }



// if (game.input.activePointer.circle.contains(player.z)) {
//   player.velocity.x = 0;
//   player.velocity.y = 0;
//   console.log('yes')
// } else {
//   game.physics.arcade.moveToPointer(player, 600);
// }

  game.physics.arcade.collide(cups, platforms);
  game.physics.arcade.collide(bullets, platforms);
  game.physics.arcade.collide(bullets, bullets, resetBullet);
  //game.physics.arcade.overlap(player, cups, playerKill, null, this);
  game.physics.arcade.overlap(bullets, cups, collectStar, collisionHandler, null, this);
  if(game.input.activePointer.isDown) {
    fireBullet();
  }

  function collectStar(player, cup) {
    cup.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;

    if(score === 120) {
      alert('you won');
      location.reload();
    }
  }
}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x + 6, player.y - 8);
            bullet.body.velocity.y = -300;
            bulletTime = game.time.now + 450;
            game.physics.arcade.moveToPointer(bullet, 300);
            //sound.play('');
        }
    }

}

function playerKill (player) {
  player.kill();
  alert('you lost');
  location.reload();

}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {

    bullet.kill();

}

function collisionHandler (bullet, cup) {

    bullet.kill();
    cup.kill();

}