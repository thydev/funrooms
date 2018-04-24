
$(document).ready(function(){
    var tempState = {
        shipName: "xtrem",
        currentScore: 99,
        destroyedAsteroid: 129,
    }

    const connection = new signalR.HubConnection(
        "/chat", { logger: signalR.LogLevel.Information });
    connection.start()
        .then(() => {
            console.log("Hub started");
        }).catch(err => console.error);
        

    $("#send").click(function(){
        connection.invoke("UpdateGameState", tempState)
            .catch(err => console.error);
    });

    connection.on("getGameState", gameState => {
        console.log("backfrom server");
        gameState = JSON.parse(gameState);
        console.log(gameState);
        console.log(gameState["currentScore"]);
        console.log(gameState.destroyedAsteroid);
    });
});



var assetUrl = "images/edassets/";
// Loading assets
var graphicAssets = {
    ship:{URL: assetUrl + 'ship.png', name:'ship'},
    bullet:{URL:assetUrl + 'bullet.png', name:'bullet'},    
    
    asteroidLarge:{URL:assetUrl + 'asteroidLarge.png', name:'asteroidLarge'},
    asteroidMedium:{URL:assetUrl + 'asteroidMedium.png', name:'asteroidMedium'},
    asteroidSmall:{URL:assetUrl + 'asteroidSmall.png', name:'asteroidSmall'},

    background:{URL:assetUrl + 'background.png', name:'background'},
    explosionLarge:{URL:assetUrl + 'explosionLarge.png', name:'explosionLarge', width:64, height:64, frames:8},
    explosionMedium:{URL:assetUrl + 'explosionMedium.png', name:'explosionMedium', width:58, height:58, frames:8},
    explosionSmall:{URL:assetUrl + 'explosionSmall.png', name:'explosionSmall', width:41, height:41, frames:8},
};
    

var soundAssets = {
    fire:{URL:[assetUrl + 'fire.m4a', assetUrl + 'fire.ogg'], name:'fire'},
    destroyed:{URL:[assetUrl + 'destroyed.m4a', assetUrl + 'destroyed.ogg'], name:'destroyed'},
};

var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
    delayToStartLevel: 3,
    padding: 30,
};

var states = {
    main: "main",
    game: "game",
};

//Adding the player ship
var shipProperties = {
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHeight * 0.5,
    // Adding a physics body
    // acceleration: how fast the ship will increase it’s velocity
    // drag: friction that slows down the ship
    // maxVelocity: the maximum movement velocity for our ship
    // angularVelocity: how fast our ship can rotate
    acceleration: 300,
    drag: 100,
    maxVelocity: 300,
    angularVelocity: 200,

    startingLives: 3, // Will change to 
    timeToReset: 3,
    blinkDelay: 0.2,
};

//Bullet setup
var bulletProperties = {
    // speed : velocity of the bullet
    // interval : the firing rate or how fast you can shoot. In this case, 1 round every 0.25 seconds or 4 rounds per second
    // lifespan : how long the bullet will remain within the game world before “dying”
    // maxCount : the maximum number of bullets that may appear at any time.
    speed: 400,
    interval: 250,
    lifespan: 2000,
    maxCount: 30,
};

// Asteroid object
var asteroidProperties = {
    // startingAsteroids : the number of asteroids that appear starting a new game.
    // maxAsteroids : the maximum number of asteroids that will appear several rounds of game play
    // incrementAsteroids : after each round, we increase the number of asteroids that appear by 2
    startingAsteroids: 4,
    maxAsteroids: 20,
    incrementAsteroids: 2,
    
    // minVelocity : the minimum velocity of the asteroid
    // maxVelocity : the maximum velocity of the asteroid
    // minAngularVelocity : the minimum rotation velocity of the asteroid
    // maxAngularVelocity : the maximum rotation velocity of the asteroid
    // score : the points the player earns when the asteroid is destroyed
    // nextSize : the next asteroid size to appear when the current asteroid is destroyed. If there is no value give, no asteroid will appear after the asteroid is destroyed
    asteroidLarge: { minVelocity: 50, maxVelocity: 150, minAngularVelocity: 0, maxAngularVelocity: 200, score: 20, nextSize: graphicAssets.asteroidMedium.name, pieces: 2, explosion:'explosionLarge' },
    asteroidMedium: { minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50, nextSize: graphicAssets.asteroidSmall.name, pieces: 2, explosion:'explosionMedium' },
    asteroidSmall: { minVelocity: 50, maxVelocity: 300, minAngularVelocity: 0, maxAngularVelocity: 200, score: 100, explosion:'explosionSmall' },
};

var fontAssets = {
    counterFontStyle:{font: '20px Arial', fill: '#FFFFFF', align: 'center'},
};

var gameState = function(game) {
    //Reference the player ship
    this.shipSprite;
    // Controlling the ship
    // we currently have 3 keys used to control our rotation and forward movement of our player ship.
    this.key_left;
    this.key_right;
    this.key_thrust;

    this.key_fire;
    // a bullet group object to manage our bullets, and an interval property keep track of the time when the next round can be fired
    this.bulletGroup;
    this.bulletInterval = 0;

    //Set up the asteroid group
    this.asteroidGroup;
    this.asteroidsCount = asteroidProperties.startingAsteroids;

    // The shipLives property will be used to keep track of how many lives are left while the tf_lives property will  be used to display our lives counter. We’ll also need to add some font styles to display our lives counter.
    this.shipLives = shipProperties.startingLives;
    this.tf_lives;

    this.score = 0;
    this.tf_score; // Text field to display score

    this.sndDestroyed;
    this.sndFire;

    // The shipIsInvulnerable property will be a boolean that tells if our player ship can be hit.
    this.shipIsInvulnerable;

    this.backgroundSprite;
    
    this.explosionLargeGroup;
    this.explosionMediumGroup;
    this.explosionSmallGroup;
};


gameState.prototype = {
    
    preload: function () {
        game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
        game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
        game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
        
        game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
        game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);

        game.load.audio(soundAssets.destroyed.name, soundAssets.destroyed.URL);
        game.load.audio(soundAssets.fire.name, soundAssets.fire.URL);

        game.load.image(graphicAssets.background.name, graphicAssets.background.URL);
        game.load.spritesheet(graphicAssets.explosionLarge.name, graphicAssets.explosionLarge.URL, 
            graphicAssets.explosionLarge.width, graphicAssets.explosionLarge.height, graphicAssets.explosionLarge.frames);
        game.load.spritesheet(graphicAssets.explosionMedium.name, graphicAssets.explosionMedium.URL, 
            graphicAssets.explosionMedium.width, graphicAssets.explosionMedium.height, graphicAssets.explosionMedium.frames);
        game.load.spritesheet(graphicAssets.explosionSmall.name, graphicAssets.explosionSmall.URL, 
            graphicAssets.explosionSmall.width, graphicAssets.explosionSmall.height, graphicAssets.explosionSmall.frames);

    },
    
    create: function () {
        this.initGraphics();
        this.initSounds();
        this.initPhysics();
        this.initKeyboard();
        this.resetAsteroids();
    },

    update: function () {
        this.checkPlayerInput();
        this.checkBoundaries(this.shipSprite);
        
        //To prevent the bullets from disappear when it goes beyond the game world.
        this.bulletGroup.forEachExists(this.checkBoundaries, this);

        this.asteroidGroup.forEachExists(this.checkBoundaries, this);
        // we call the arcade physics overlap function to see if our bulletGroup and asteroidGroup bounding boxes overlap. 
        // If they do, it calls the asteroidCollision function and passes the overlapping bullet and asteroid sprite as arguments 
        // to the asteroidCollision function above.
        game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);
        if (!this.shipIsInvulnerable) {
            game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.asteroidCollision, null, this);
        }
    },

    initGraphics: function () {
        this.backgroundSprite = game.add.sprite(0, 0, graphicAssets.background.name);
        //make our sprite appear on screen at the specified x and y positions
        // x: the x coordinate of the sprite
        // y: the y coordinate of the sprite
        // key: the image used as a texture by this display object
        this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
        // By default, at 0 degrees rotation, a sprite always faces right. We will want our sprite to be facing upwards so we set the angle to -90 degrees
        this.shipSprite.angle = -90;
        // to ensure that our sprite rotates along the correct centre point, we set it’s anchor to 50% of its width and height
        this.shipSprite.anchor.set(0.5, 0.5); 

        this.bulletGroup = game.add.group();
        this.asteroidGroup = game.add.group();

        this.tf_lives = game.add.text(20, 10, shipProperties.startingLives, fontAssets.counterFontStyle);
        
        this.tf_score = game.add.text(gameProperties.screenWidth - 20, 10, "0", fontAssets.counterFontStyle);
        this.tf_score.align = 'right';
        this.tf_score.anchor.set(1, 0);

        this.explosionLargeGroup = game.add.group();
        this.explosionLargeGroup.createMultiple(20, graphicAssets.explosionLarge.name, 0);
        this.explosionLargeGroup.setAll('anchor.x', 0.5);
        this.explosionLargeGroup.setAll('anchor.y', 0.5);
        this.explosionLargeGroup.callAll('animations.add', 'animations', 'explode', null, 30);
        
        this.explosionMediumGroup = game.add.group();
        this.explosionMediumGroup.createMultiple(20, graphicAssets.explosionMedium.name, 0);
        this.explosionMediumGroup.setAll('anchor.x', 0.5);
        this.explosionMediumGroup.setAll('anchor.y', 0.5);
        this.explosionMediumGroup.callAll('animations.add', 'animations', 'explode', null, 30);
        
        this.explosionSmallGroup = game.add.group();
        this.explosionSmallGroup.createMultiple(20, graphicAssets.explosionSmall.name, 0);
        this.explosionSmallGroup.setAll('anchor.x', 0.5);
        this.explosionSmallGroup.setAll('anchor.y', 0.5);
        this.explosionSmallGroup.callAll('animations.add', 'animations', 'explode', null, 30);
    },

    initSounds: function () {
        this.sndDestroyed = game.add.audio(soundAssets.destroyed.name);
        this.sndFire = game.add.audio(soundAssets.fire.name);
    },

    // initialise the arcade physics system and add physics bodies to all our game objects.
    initPhysics: function () {
        // start the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // enable the physics body for shipSprite
        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipProperties.drag);
        this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);

        // Create bullet sprites and apply the Phaser arcade physics
        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;

        //The createMultiple function is a group function that creates multiple sprites objects and adds them to our bulletGroup.
        this.bulletGroup.createMultiple(bulletProperties.maxCount, graphicAssets.bullet.name);
        // The 0.5 argument used represents 50% of our graphic asset’s width and height.
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 0.5);
        // set the lifespan property which tells our game to remove the sprite after certain amount of time has passed; in this case 2000 miliseconds or 2 seconds.
        this.bulletGroup.setAll('lifespan', bulletProperties.lifespan);

        this.asteroidGroup.enableBody = true;
        this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },

    initKeyboard: function () {
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    //  check for the various key presses and add responses to it
    // function will be called every frame loop to check if any of the assigned keys are being pressed.
    checkPlayerInput: function () {
        if (this.key_left.isDown) {
            this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
        } else if (this.key_right.isDown) {
            this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
        } else {
            this.shipSprite.body.angularVelocity = 0;
        }
        
        if (this.key_thrust.isDown) {
            game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleration, this.shipSprite.body.acceleration);
        } else {
            this.shipSprite.body.acceleration.set(0);
        }

        if (this.key_fire.isDown) {
            this.fire();
        }
    },

    checkBoundaries: function (sprite) {
        // sprite which can represent any sprite in our game world.
        // if any game objects went outside our game world, it would reappear on the opposite end of it
        if (sprite.x + gameProperties.padding < 0) {
            sprite.x = game.width + gameProperties.padding;
        } else if (sprite.x - gameProperties.padding > game.width) {
            sprite.x = -gameProperties.padding;
        } 

        if (sprite.y + gameProperties.padding < 0) {
            sprite.y = game.height + gameProperties.padding;
        } else if (sprite.y - gameProperties.padding > game.height) {
            sprite.y = -gameProperties.padding;
        }
    },

    fire: function () {
        if (!this.shipSprite.alive) {
            return;
        }
        // check before firing is whether our current internal game clock has passed the bulletInterval
        if (game.time.now > this.bulletInterval) {
            this.sndFire.play();
            // get the first object in ourbulletGroup. The false argument used retrieves an object that does not exist in our game world. 
            // If the argument was true, it would retrieve a currently existing game object.   
            var bullet = this.bulletGroup.getFirstExists(false);
            
            // if we have successfully retrieved a bullet sprite from the group. If the number of bullets existing in our game world exceeds the maximum number 
            // (we set this in the bulletProperties object), our player ship will not be able to fire.
            if (bullet) {

                //  calculates the location where our bullet will appear. The length variable gets the half size 
                // of the ship sprite. This will be used to position the bullet just in front of our ship sprite. 
                // The next 2 variables x and y calculates the exact coordinates of the bullet based on the length and the rotation of the ship sprite.
                var length = this.shipSprite.width * 0.5;
                var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
                var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);

                //  move our bullet sprite to the x and y coordinates. The reset function makes our sprite alive and visible in our game world. 
                // In the next line, we set the sprite’s lifespan property that makes our sprite exist for a specified amount of time. 
                // In our bulletProperties object, we set this value to 2000 miliseconds or 2 seconds. We then rotate our sprite based on the angle of our ship sprite rotation.
                bullet.reset(x, y);
                bullet.lifespan = bulletProperties.lifespan;
                bullet.rotation = this.shipSprite.rotation;

                // we call the arcade physics velocityFromRotation to calculate how fast our bullet sprite should move. 
                // This function will set the x and y velocity of our bullet sprite physics body. Last in our fire function is to update the bulletInterval property to tell our game when we can fire the next round.
                game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletProperties.speed, bullet.body.velocity);
                this.bulletInterval = game.time.now + bulletProperties.interval;
            }
        }
    },

    createAsteroid: function (x, y, size, pieces) {
        if (pieces == undefined) { pieces = 1; }
        for (let i = 0; i < pieces; i++) {
            // creates a new sprite and adds it to the asteroidGroup and sets the anchor point to the centre of the sprite.
            var asteroid = this.asteroidGroup.create(x, y, size);
            asteroid.anchor.set(0.5, 0.5);
            // sets our asteroid physics body to rotate at a random angularVelocity between a range of minAngularVelocity and maxAngularVelocity that we declared earlier in our asteroidProperties.
            asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minAngularVelocity, asteroidProperties[size].maxAngularVelocity);
            // The game.rnd.integerInRange function returns a random integer or round number and requires 2 arguments:
            // minimum number the range
            // maximum number the range
            /*
            Here’s how the asteroidProperties [size].minAngularVelocity and asteroidProperties [size].maxAngularVelocity arguments work:

            The value of size is passed into the createAsteroid function. This argument is a string and is the name of the asteroid graphic assets taken from the graphicAssets object we declared in step 1. For example, the value of the large asteroid graphic asset is 'asteroidLarge'. Notice this exact same name is used for properties in our graphicAssets object and asteroidProperties object.

            So when we replace the size parameter with 'asteroidLarge', all references to size within the createAsteroid function will be replaced with 'asteroidLarge'.

            For example: The asteroidProperties [size].minAngularVelocity becomes asteroidProperties ['asteroidLarge'].minAngularVelocity. During run time, it is interpreted as asteroidProperties.asteroidLarge.minAngularVelocity.
            */
            var randomAngle = game.math.degToRad(game.rnd.angle());
            var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity, asteroidProperties[size].maxVelocity);
            //sets our asteroid moving based on the randomAngle and randomVelocity assigned earlier.
            game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
        }
        
    },

    resetAsteroids: function () {
        //  create a number of asteroids and randomly position them on the screen. Earlier on we declared our asteroidsCount property in the asteroidProperties object and assigned it a value of 4.
        for (var i=0; i < this.asteroidsCount; i++ ) {
            var side = Math.round(Math.random());
            var x;
            var y;
            
            if (side) {
                x = Math.round(Math.random()) * gameProperties.screenWidth;
                y = Math.random() * gameProperties.screenHeight;
            } else {
                x = Math.random() * gameProperties.screenWidth;
                y = Math.round(Math.random()) * gameProperties.screenHeight;
            }
            
            this.createAsteroid(x, y, graphicAssets.asteroidLarge.name);
        }
    },
    
    asteroidCollision: function (target, asteroid) {
        this.sndDestroyed.play();

        target.kill();
        asteroid.kill();

        if (target.key == graphicAssets.ship.name) {
            this.destroyShip();
        }

        this.splitAsteroid(asteroid);
        this.updateScore(asteroidProperties[asteroid.key].score);

        // we add a timer event that calls the nextLevel function after a delay of 3 seconds. Note the 3 arguments used:
        // delay : the number of milliseconds, in game time, before the timer event occurs
        // callback : the callback that will be called when the timer event occurs
        // callbackContext : the context in which the callback will be called
        if (!this.asteroidGroup.countLiving()) {
            game.time.events.add(Phaser.Timer.SECOND * gameProperties.delayToStartLevel, this.nextLevel, this);
        }

        var explosionGroup = asteroidProperties[asteroid.key].explosion + "Group";
        var explosion = this[explosionGroup].getFirstExists(false);
        explosion.reset(asteroid.x, asteroid.y);
        explosion.animations.play('explode', null, false, true);

    },

    destroyShip: function () {
        this.shipLives --;
        this.tf_lives.text = this.shipLives;

        // checking to see if the value for shipLives is not 0. Then in the next line we add a time event that will call the reset function when time runs out
        // delay : the delay before the timer event occurs. This value is in miliseconds. The Phaser.Timer.SECOND has a value of 1000.
        // callback : the callback function
        // callbackContext : the context of the function
        // Change shiplives to unlimited
        if (this.shipLives) {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.resetShip, this);
        } else {
            // Go on with unlimited lives
            // game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.resetShip, this);
            //End game
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.endGame, this);
        }

        var explosion = this.explosionLargeGroup.getFirstExists(false);
        explosion.reset(this.shipSprite.x, this.shipSprite.y);
        explosion.animations.play('explode', 30, false, true);

    },

    resetShip: function () {
        this.shipIsInvulnerable = true;
        this.shipSprite.reset(shipProperties.startX, shipProperties.startY);
        this.shipSprite.angle = -90;

        game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.shipReady, this);
        game.time.events.repeat(Phaser.Timer.SECOND * shipProperties.blinkDelay, shipProperties.timeToReset / shipProperties.blinkDelay, this.shipBlink, this);
    },
    shipReady: function () {
        this.shipIsInvulnerable = false;
        this.shipSprite.visible = true;
    },
    shipBlink: function () {
        this.shipSprite.visible = !this.shipSprite.visible;
    },

    splitAsteroid: function (asteroid) {
        if (asteroidProperties[asteroid.key].nextSize) {
            this.createAsteroid(asteroid.x, asteroid.y, asteroidProperties[asteroid.key].nextSize, asteroidProperties[asteroid.key].pieces);
        }
    },

    updateScore: function (score) {
        this.score += score;
        this.tf_score.text = this.score;
    },

    nextLevel: function () {
        this.asteroidGroup.removeAll(true);
        
        if (this.asteroidsCount < asteroidProperties.maxAsteroids) {
            this.asteroidsCount += asteroidProperties.incrementAsteroids;
        }
        
        this.resetAsteroids();
    },

    endGame: function () {
        game.state.start(states.main);
    },

};

var mainState = function(game) {
    this.tf_start;
};

mainState.prototype = {
    create: function () {
        var startInstructions = 'Click to Start -\n\nUP arrow key for thrust.\n\nLEFT and RIGHT arrow keys to turn.\n\nSPACE key to fire.';
        
        this.tf_start = game.add.text(game.world.centerX, game.world.centerY, startInstructions, fontAssets.counterFontStyle);
        this.tf_start.align = 'center';
        this.tf_start.anchor.set(0.5, 0.5);

        game.input.onDown.addOnce(this.startGame, this);
    },
    
    startGame: function () {
        game.state.start(states.game);
    },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.main, mainState);
game.state.add(states.game, gameState);
// game.state.start(states.game);
game.state.start(states.main);
