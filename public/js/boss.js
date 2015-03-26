 //jwb
  jwb = game.add.sprite(200, 200, 'jwb');
  jwb.animations.add('mad', [0, 1], 10, true);
  jwb.fixedToCamera = true;

  jwb.animations.play('mad');