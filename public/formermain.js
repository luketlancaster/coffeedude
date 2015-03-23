'use strict';

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platforms;
var player;
var stars;
var score = 0;
var scoreText;
var bullets;
var bulletTime = 0;
var bullet;
var cursors;

function preload() {
  game.load.image('sky', './assets/sbux.jpg');
  game.load.image('ground', './assets/platform.png');
  game.load.image('star', './assets/character/cup.png');
  game.load.image('bowetie', './assets/character/bowtie.png');
  game.load.spritesheet('dude', './assets/character/head.png', 48, 48);
  //game.load.audio('meow', '/phaser-examples/examples/assets/audio/SoundEffects/meow1.mp3');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0,0, 'sky').width = 800;
  game.add.sprite(0,0, 'sky').height = 600;
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
  platforms = game.add.group();
  platforms.enableBody = true;
  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(650, 150, 'ground');
  ledge.body.immovable = true;

  //Sprite
  player = game.add.sprite(32, game.world.height -150, 'dude');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 400;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [0], 1, true);
  player.animations.add('right', [0], 1, true);

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
  cursors = game.input.keyboard.createCursorKeys();
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

  //Star Stuff
  stars = game.add.group();
  stars.enableBody = true;
  for(var i = 0; i < 12; i++) {
    var star = stars.create(i * 70, 0, 'star');
    star.body.gravity.y = 600;
    star.body.bounce.y = 0.7 + Math.random() * 0.5;
  }
}

function update() {
  game.physics.arcade.collide(player, platforms);
  //game.physics.arcade.overlap(bullets, stars, collisionHandler, null, this);
  var cursors = game.input.keyboard.createCursorKeys();
  player.body.velocity.x = 0;
  if(cursors.left.isDown){
    player.body.velocity.x = -350;
    //player.animations.play('left');
  } else if(cursors.right.isDown) {
      player.body.velocity.x = 350;
      //player.animations.play('right');
  } else {
    player.animations.stop();
    player.frame = 2;
  }

  if(cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -450;
    //player.animations.play('up');
  }

  if(cursors.down.isDown) {
    player.body.velocity.y = 450;
  }
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.collide(bullets, platforms);
  game.physics.arcade.collide(bullets, bullets, resetBullet);
  game.physics.arcade.overlap(player, stars, collectStar, null, this);
  game.physics.arcade.overlap(bullets, stars, collectStar, collisionHandler, null, this);
  if(game.input.activePointer.isDown) {
    fireBullet();
  }

  function collectStar(player, star) {
    star.kill();
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
            bulletTime = game.time.now + 150;
            game.physics.arcade.moveToPointer(bullet, 300);
            //sound.play('');
        }
    }

}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {

    bullet.kill();

}

function collisionHandler (bullet, star) {

    bullet.kill();
    star.kill();

}
