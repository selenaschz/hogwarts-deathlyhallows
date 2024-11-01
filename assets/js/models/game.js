class Game {
    constructor(canvasId, house) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = 1000;
        this.canvas.height = 533;
        this.ctx = this.canvas.getContext("2d");
        
        //Intervals:
        this.drawIntervalId = undefined;
        this.fps = 1000 / 60; //frames per second
        this.timeInterval = undefined;

        this.elapsedTime = 0;

        this.house = house,

        this.background = new Background(this.ctx, "background");
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

        this.playerName;

        this.music = new Audio("/assets/audio/background-theme.mp3");
        this.music.volume = 0.03;
        //PONER MUTE Y PAUSE!!!

        this.voldemort = new Voldemort(this.ctx, "dementor");

        //Final Battle:
        this.finalBattle = new FinalBattle(this.ctx, this);
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


    setEndScreen(result) {
        this.stop();
        this.clear();

        this.canvas.classList.add("hidden");

        const audioResult = new Audio(`/assets/audio/${result}.mp3`);
        audioResult.volume = 0.05;
        audioResult.play();

        const resultDiv = document.getElementById("result");
        const menu = document.getElementById("main-menu");

        resultDiv.classList.remove("hidden");
        resultDiv.classList.add(result);

        this.askForName(result, menu);
        this.exitGame(result, menu);
        this.restart(result);
    }

    win() {
        this.setEndScreen("win");
    }

    gameOver() {
        this.setEndScreen("game-over");
    }

    //Input player name:
    askForName(resultDiv, menu) {
        const inputName = document.getElementById("playername");
        const enterBt = document.getElementById("enter-bt");

        enterBt.addEventListener("click", () => {
                this.checkNameInput(inputName);
                resultDiv.classList.add("hidden");
                menu.classList.remove("hidden");

         });
    }

    exitGame(resultDiv, menu) {
        const exitBt = document.getElementById("exit");

        exitBt.addEventListener("click", () => {
            resultDiv.classList.add("hidden");
            menu.classList.remove("hidden");
            this.restartSettings();
        })
     }

    restartSettings() {
        clearInterval(this.drawIntervalId);
        clearInterval(this.timeInterval);

        this.drawIntervalId = null;

        this.score = 0; 
        this.level = 1; 
        this.elapsedTime = 0; 
        this.player = new Player (this.ctx, this.house);
        this.enemies = [new Enemy(this.ctx, "dementor")];
        this.music.currentTime = 0;

    }

    restart(resultDiv) {
        const restartBt = document.getElementById("restart");
        restartBt.addEventListener("click", () => {
            resultDiv.classList.add("hidden");
            resultDiv.classList.remove(result);
            this.restartSettings();
            this.start();

            this.canvas.classList.remove("hidden");
            
        })
    }

    checkNameInput(inputName) {
        const playerName = inputName.value;
        if (playerName) {
            console.log(playerName)
            this.playerName = playerName;
            this.addScore(this.playerName);
            inputName.value = ""; // Clear input 
        }
    }

    //Store the scores
    addScore(playerName) {
        const score = {
            name: playerName,
            points: this.score
        };

        // Get existing scores
        const scores = localStorage.getItem("scores") ? JSON.parse(localStorage.getItem("scores")) : [];
        scores.push(score);

        // Store scores in LocalStorage
        localStorage.setItem("scores", JSON.stringify( scores ));
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

        if ( this.timeLevel - this.elapsedTime <= 50) {
            this.deathlyHallows[this.level - 1].draw();
        }

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
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
                            this.levelUp();
                            this.playFinalBattle();
                            break;
                        case "Invisibility Cloak":
                            this.deathlyHallowsImgStatus = "two";
                            this.levelUp();
                            break;
                        case "Elder Wand":
                            this.deathlyHallowsImgStatus = "three";
                            break;
                    }
                }
            }
        })
    }

    stop() {
        this.music.pause();
        this.enemies.forEach( e => e.audio.pause());
        this.started = false;
        clearInterval(this.drawIntervalId);
        clearInterval(this.timeInterval);
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
        if ( this.elapsedTime >= this.timeLevel ) {
                this.gameOver();
        }
    }

    updateElapsedTime() {
        this.timeInterval = setInterval(() => {
            this.elapsedTime++;
            this.setTimeLevel();
        }, 1000);
    }

    

    resume() {
        this.started = true;
        this.start();
    }

    
    levelUp() {
        this.level++;
        this.elapsedTime = 0;
    }

    playFinalBattle() {
        //Stop the main game:
        this.stop();
        this.clear();

        //Start the final battle game
        this.finalBattle.start();

        
    }
    

}