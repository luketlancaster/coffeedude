(function() {
  game.state.add('menu', {preload:preload, create:create});
  game.state.start('menu');
  var button,
      enterKey;

  function preload() {
    game.load.tilemap('background', './assets/groundfloor.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('background2', './assets/stage2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('bossfight', './assets/bossfight.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('cup', './assets/buxscupsheet.png', 64, 64, 4);
    game.load.spritesheet('head', './assets/headsheet.png', 64, 64, 3);
    game.load.spritesheet('jwb', './assets/johnwilkesbooth.png', 128, 137, 2);
    game.load.spritesheet('banner', './assets/theatrebanner.png', 48, 21, 3);
    game.load.image('bossBG', './assets/theatre.jpg');
    game.load.image('treeBG', './assets/woodgrain.jpg');
    game.load.image('start', './assets/button.png');
    game.load.image('menu', './assets/menu.png');
    game.load.image('blocks', './assets/blocks.png');
    game.load.image('steampunk', './assets/steampunkish-tilec.png');
    game.load.image('trees2', './assets/trees2.jpg');
    game.load.image('bookshelf', './assets/bookshelf.jpg');
    game.load.image('bowtie', './assets/bowtie.png');
    game.load.image('bean', './assets/coffeebean.png');
    game.load.image('coffeecan', './assets/coffeecan.png');
    game.load.image('record', './assets/record.png');
    game.load.image('hat', './assets/tophat.png');
    game.load.audio('shoot', './assets/Pecheew.m4a');
    game.load.audio('explosion', './assets/Explosion.m4a');
    game.load.audio('jump', './assets/Whoop.m4a');
    game.load.audio('scream', './assets/WilhelmScream.mp3');
  }

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'menu');
    button = game.add.button(280, 275, 'start', startClick, this);
    button.scale.setTo(.5);

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(startLvl2);
  }

  function startClick () {
    this.game.state.start('lvl1');
  }

  function startLvl2(){
    game.state.start('lvl2');
  }


})();