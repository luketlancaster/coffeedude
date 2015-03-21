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

  player = game.add.sprite(40, 30, 'head');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

  game.cameraLastX = game.camera.x;
  game.cameraLastY = game.camera.y;
}
