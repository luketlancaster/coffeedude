function preload() {
  game.load.tilemap('background', '/assets/groundfloor.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('blocks', '/assets/blocks.png');
  game.load.image('steampunk', '/assets/steampunkish-tilec.png');
  game.load.image('beans', '/assets/bookshelf.jpg');
  game.load.image('head', '/assets/character/head.png');
}