var GameState = {
		init: function () {
				this.scale.pageAlignHorizontally = true;
				this.game.physics.startSystem(Phaser.Physics.ARCADE);
				this.game.physics.arcade.gravity.y = 400;
		},
		preload: function () {
				this.load.spritesheet('mooh', 'img/mooh.png', 208.7, 300, 9);
				this.load.image('bg', 'img/bg.png');
				this.load.image('floor', 'img/floor.png');
				this.load.image('topPipe', 'img/top.png');
				this.load.image('bottomPipe', 'img/bottom.png');
				this.load.image('btn', 'img/btn.png');
		}, 
		create: function () {
				this.points = 0;
				this.gameOver = false;

				this.world = new Phaser.Rectangle(0, 0, 400, 500);

				this.bg = this.add.image(0, 0, 'bg');
				
				this.jumpTimer = 0;
				this.pointsTimer = 0;

				this.game.input.mouse.capture = true;

				this.mooh = this.add.sprite(70, 70, 'mooh');
				this.mooh.anchor.set(0.5);
				this.mooh.scale.set(0.25);

				this.game.physics.enable(this.mooh);
				this.mooh.animations.add('fly', [1, 2, 3, 4, 5, 6, 7], 8, true);
				this.mooh.animations.add('die', [0], 0, false);
				this.mooh.animations.play('fly');

				this.mooh.body.collideWorldBounds = true;
				this.mooh.body.onWorldBounds = new Phaser.Signal();
				this.mooh.body.onWorldBounds.add(this.hitWorldBounds, this);

				this.topPipe = this.add.sprite(0, 0, 'topPipe');
				this.game.physics.enable(this.topPipe);
				this.topPipe.body.allowGravity = false;
				this.topPipe.body.immovable = true;

				this.bottomPipe = this.add.sprite(0, 0, 'bottomPipe');
				this.game.physics.enable(this.bottomPipe);
				this.bottomPipe.body.allowGravity = false;
				this.bottomPipe.body.immovable = true;

				this.pipes = this.game.add.group();

				this.pipes.add(this.topPipe);
				this.pipes.add(this.bottomPipe);

				this.floor = this.game.add.group();
				for (var i = 0; i < 60; i++) {
						this.floor.create(i*30, 468, 'floor');
				}
				this.floorAnimateFunction();
				this.pipesAnimateFunction();

				this.text = this.game.add.text(10, 5, this.points++, { font: "normal 32px Arial", fill: "#435072", boundsAlignH: "center", boundsAlignV: "middle" });
		},
		restartGame: function () {
			game.state.start('GameState');
		},
		createPipes: function () {
				var randomY = Math.floor(Math.random() * 7);
				this.topPipe.y = -575 + randomY * 50;
				this.bottomPipe.y = 170 + randomY * 50;

				this.pipes.x = 470;
		},
		floorAnimateFunction: function () {
				this.floor.x = 3;
				this.floorAnimate = this.game.add.tween(this.floor).to( { x: -game.world.width }, 2500, Phaser.Easing.Linear.None, true);
				this.floorAnimate.onComplete.add(this.floorAnimateFunction, this);
		},
		pipesAnimateFunction: function () {
				this.createPipes();
				this.pipesAnimate = this.game.add.tween(this.pipes).to( { x: -game.world.width + 70 }, 5000, Phaser.Easing.Linear.None, true);
				this.pipesAnimate.onComplete.add(this.pipesAnimateFunction, this);
		},
		hitWorldBounds: function () {
				this.gameOver = true;
				
				this.floorAnimate.pause();
				this.pipesAnimate.pause();
				this.mooh.animations.play('die');
				
				this.restartBtn = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'btn', this.restartGame, this, 2, 1, 0);
				this.restartBtn.scale.set(0.5);
				this.restartBtn.anchor.set(0.5);
		},
		update: function () {
				if (this.game.input.activePointer.leftButton.isDown && game.time.now > this.jumpTimer && !this.gameOver){
						this.mooh.animations.play('fly');
						this.mooh.body.velocity.y = -250;
						this.jumpTimer = game.time.now + 250;
				}
				this.game.physics.arcade.collide(this.mooh, this.topPipe, this.hitWorldBounds, null, this);
				this.game.physics.arcade.collide(this.mooh, this.bottomPipe, this.hitWorldBounds, null, this);

				if(this.pipes.x <= 0 && game.time.now > this.pointsTimer){
					this.text.setText(this.points++);
					this.pointsTimer = game.time.now + 3000;
				}
		}
};

var StartState = {
		init: function () {
				this.scale.pageAlignHorizontally = true;
		},
		preload: function () {
			this.load.image('title', 'img/title.png');
			this.load.image('btn', 'img/btn.png');
		},
		create: function () {
			this.title = this.add.image(0, 0, 'title');
			this.game.add.button(game.world.centerX - 72, 380, 'btn', this.startGame, this, 2, 1, 0);
		}, 
		startGame: function () {
			game.state.start('GameState');
		}
};

var game = new Phaser.Game(400, 500, Phaser.AUTO);
game.state.add('StartState', StartState);
game.state.add('GameState', GameState);
game.state.start('StartState');