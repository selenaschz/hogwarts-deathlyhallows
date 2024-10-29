class Game {
    constructor(canvasId, house) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = 1301;
        this.canvas.height = 533;
        this.ctx = this.canvas.getContext("2d");
        
        this.drawIntervalId = undefined;
        this.fps = 1000 / 60; //frames per second

        this.elapsedTime = 0;

        this.house = house,

        this.background = new Background(this.ctx);
        this.player = new Player( this.ctx, house );
        this.enemies = [new Enemy( this.ctx, "dementor" )];

        this.enemyTypes = ["dementor", "troll", "pixies"];

        this.score = 0;
        this.level = 1;
        this.timeLevel = 60;
        this.elapsedTime = 0;

        this.frog = new ChocolateFrog(this.ctx);

        this.deathlyHallows = [
            new ResurrectionStone(this.ctx),
            new InvisibilityCloak(this.ctx),
            new ElderWand(this.ctx)
        ];

        this.deathlyHallowsImgStatus = "not";
        this.imgDeathlyHallows = new Image();

        this.started = false;

        this.music = new Audio("/assets/audio/background-theme.mp3");
        this.music.volume = 0.03;
        //PONER MUTE Y PAUSE!!!
    }

    start() {
        this.started = true;

        this.music.play();

        let tick = 0;

        this.updateElapsedTime();

        if (!this.drawIntervalId) {
            this.drawIntervalId = setInterval(() => {
                this.clear();
                this.move();
                this.draw();

                tick++;

                if ( tick >= 300 ) {
                    tick = 0;
                    this.addEnemy();
                }
            }, this.fps)
        }
    }

    gameOver() {

        clearInterval(this.drawIntervalId);

        const audio = new Audio("/assets/audio/gameover.wav");
        audio.volume = 0.05;
        audio.play();
        this.pause();
        
        this.ctx.fillText("Game Over", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

    }

    onKeyEvent(event) {
        this.player.onKeyEvent(event);
    }

    draw() {
        this.background.draw();
        this.player.draw();

        if ( this.player.spell && this.player.spell.isActive ) {
            const loading = new Image();
            loading.src = "/assets/images/magicloading.png";

            this.ctx.drawImage(
                loading, 
                this.player.x, 
                this.player.y -40, 
                loading.width / 2, 
                loading.height / 2);
        }

        this.enemies.forEach( enemy => enemy.draw() );
        if ( this.player.spell ) {
            this.player.spell.draw();
        }

        this.deathlyHallows[0].draw();

        //Style font:
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";

        //Level:
        this.ctx.fillText(`Level: ${this.level}`, this.ctx.canvas.width / 2, 30)

        //Time:
        this.ctx.fillText(`Time: ${this.elapsedTime}`, 10, this.ctx.canvas.height - 20)

        //Health player:
        this.ctx.fillText(`Health: ${this.player.health}`, 20, 30)

        //Score:
        this.ctx.fillText(`Score: ${this.score}`, this.ctx.canvas.width / 4 * 3, 30);

        //Deathly Hallows Collected:
        this.imgDeathlyHallows.src = `/assets/images/game/${this.deathlyHallowsImgStatus}Collected.png`;
        this.ctx.drawImage(
            this.imgDeathlyHallows,
            this.ctx.canvas.width - this.imgDeathlyHallows.width / 2 -10,
            10,
            this.imgDeathlyHallows.width / 2,
            this.imgDeathlyHallows.height / 2
        )

         this.frog.draw();
        this.checkCollisionsEnemy();
        this.checkCollisionsItem();
        
        
    }
    
    end() {

    }

    clear() {
        
    }

    move() {
        this.background.move();
        this.player.move();
        this.enemies.forEach( enemy => {
            enemy.move(this.player);
        });

         this.frog.move();
        this.deathlyHallows.forEach( deathlyHallow => deathlyHallow.move());

        this.checkCollisionsAttack();
        this.checkCollisionsEnemy();
        this.checkCollisionsItem();

        //Remove dead enemies (opacity less than 1)
        this.enemies = this.enemies.filter( enemy => enemy.isAlive || enemy.opacity > 0.7 );
    }

    checkCollisionsEnemy() {
        this.enemies.forEach(enemy => {
            if (this.player.collides(enemy)) {
                this.player.loseLife();
                

                if (this.player.health === 0) {
                    this.gameOver();
                }
            }
        });
    }
    checkCollisionsAttack() {
        this.enemies = this.enemies.filter(enemy => {
            //If there is a collision with spell, the enemy takes damage
            if (this.player.spell && this.player.spell.collides(enemy)) {
                enemy.audio.pause();
                enemy.takeDamage();
                this.score += 200;
                return false; //Remove the enemy in the array
            }
            return true; // If there isn't a collision, keep it in the array
        });
    }

    checkCollisionsItem() {
        if ( this.player.collides( this.frog ) ) {
                this.player.collect(this.frog);
        }

        this.deathlyHallows.forEach( deathlyHallow => {
            if ( this.player.collides ( deathlyHallow ) ) {
                if ( this.player.collectDeathlyHallow( deathlyHallow ) ) {
                    switch ( deathlyHallow.name ) {
                        case "Resurrection Stone":
                            this.deathlyHallowsImgStatus = "one";
                            break;
                        case "Invisibility Cloak":
                            this.deathlyHallowsImgStatus = "two";
                            break;
                        case "Elder Wand":
                            this.deathlyHallowsImgStatus = "three";
                            break;
                    }
                }
            }
        })
    }

    pause() {
        this.music.pause();
        this.enemies.forEach( e => e.audio.pause());
        this.started = false;
        clearInterval(this.drawIntervalId);
    }

    addEnemy() {
        const indexType = Math.floor( Math.random() * this.enemyTypes.length);
        const newEnemy = new Enemy(this.ctx, this.enemyTypes[indexType]);

        this.enemies.push(newEnemy);
    }

    addItem() {
        const indexType = Math.floor( Math.random() * this.enemyTypes.length);
        const newEnemy = new Enemy(this.ctx, this.enemyTypes[indexType]);

        this.enemies.push(newEnemy);
    }

    setTimeLevel(){
        if ( this.elapsedTime === this.timeLevel ) {
            if ( this.level < 3) {
                this.level++;
                this.elapsedTime = 0;

            } else {
                this.gameOver();
            }
        }
    }

    updateElapsedTime() {
        this.interval = setInterval(() => {
            this.elapsedTime++;
            this.setTimeLevel();
        }, 1000);
    }
}