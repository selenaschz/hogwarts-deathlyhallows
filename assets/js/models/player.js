class Player {
    constructor(ctx, house) {
        this.ctx = ctx;
        this.x = 20;
        this.y = 0;

        this.vy = 0;
        this.vx = 0;

        this.g = 1;

        //Sprite:
        this.sprite = new Image();
        this.sprite.src = "/assets/images/player/player.png";

        this.sprite.horizontalFrameIndex = 0;
        this.sprite.verticalFrameIndex = 0;
        this.sprite.horizontalFrames = 4;
        this.sprite.verticalFrames = 4;
        this.sprite.frameRate = 15; 

        this.sprite.onload = () => {
            this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.horizontalFrames);
            this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.verticalFrames);
            this.width = this.sprite.frameWidth;
            this.height = this.sprite.frameHeight;
        }

        //Draw counter:
        this.drawCounter = 0;

        //Player direction: Left or right:
        this.isRight = true;

        this.house = house;
        this.health = 3;
        this.spell = null;
        this.invulnerable = false;

        //Player actions:
        this.actions = {
            jump: false,
            walk: false,
            attack: false,
            collect: false,
            stand: true
        }

    }

    onKeyEvent(event) {
        if(event.type === "keydown") {
            this.actions.stand = false;
            switch(event.keyCode) {
                case KEY_UP:
                    this.jump();
                    this.actions.stand = false;
                    this.actions.walk = false;
                    break;
                case KEY_RIGHT:
                    this.vx = 5;
                    this.actions.walk = true;
                    this.isRight = true;
                    break;
                case KEY_LEFT:
                    this.vx = -5;
                    this.actions.walk = true;
                    this.isRight = false;
                    break;
                case KEY_SPACE:
                    this.actions.attack = true;
                    this.castSpell();
                    if ( this.spell ) {
                        this.spell.isActive = true;
                    }
                    break;
                case KEY_DOWN:
                    this.actions.collect = true;
                    break;
            }
        }

        if(event.type === "keyup") {
            this.actions.stand = true;
            switch(event.keyCode) {
                case KEY_RIGHT:
                case KEY_LEFT:
                    this.vx = 0;
                    this.actions.walk = false;
                    break;
                case KEY_UP:
                    this.actions.jump = false;
                    break;
                case KEY_SPACE:
                    this.actions.attack = false;
                    break;
                case KEY_DOWN:
                    this.actions.collect = false;
                    break;
            }
            
        }
        
    }


    animate() {
        this.drawCounter++;

        this.sprite.verticalFrameIndex = (this.isRight) ? 0 : 2;

        if ( this.actions.jump ) {
            this.sprite.horizontalFrameIndex = 1;

        } else if ( this.actions.stand ) {
            this.sprite.horizontalFrameIndex = 0;

        } else if ( this.actions.attack ) {
            this.sprite.verticalFrameIndex = (this.isRight) ? 1 : 3;
            this.sprite.horizontalFrameIndex = 2;
        
        } else if ( this.actions.collect ) {
            this.sprite.verticalFrameIndex = (this.isRight) ? 1 : 3;
            this.sprite.horizontalFrameIndex = 1;
        } else {
           this.checkFrameRate(0, this.sprite.horizontalFrames);
        }
        

    }

    checkFrameRate(horizontalIndex, horizontalFrames) {
        if (this.drawCounter > this.sprite.frameRate) {
            this.sprite.horizontalFrameIndex++;
            this.drawCounter = 0;

            if (this.sprite.horizontalFrameIndex >= horizontalFrames) {
                this.sprite.horizontalFrameIndex = horizontalIndex;
            }
        }
    }

    draw() {
        this.animate();
        
        this.ctx.drawImage(
        this.sprite, 
        this.sprite.horizontalFrameIndex * this.sprite.frameWidth,
        this.sprite.verticalFrameIndex * this.sprite.frameHeight,
        this.sprite.frameWidth,
        this.sprite.frameHeight,
        this.x, 
        this.y, 
        this.width, 
        this.height);

    }

    move() {
        this.vy += this.g;

        this.x += this.vx;
        this.y += this.vy;

        if( this.x + this.width >= this.ctx.canvas.width || this.x <= 0 ) {
            this.x = 0;
        }

        if ( this.y + this.height >= this.ctx.canvas.height - 30 ) {
            this.vy = 0;
            this.y = this.ctx.canvas.height - this.height - 30; //The player is on te ground
            this.actions.jump = false;
        }

        if ( this.y <= 0 ) {
            this.y = 0;
            this.vy += this.g;
            this.y += this.vy;
        }

        if( this.spell ) {
            this.spell.move();
        }
    }

    loseLife() {
        if ( !this.invulnerable ) {
            const hurt = new Audio("/assets/audio/player/hurt.mp3");
            hurt.volume = 0.05;
            hurt.play();
            this.health--;
            this.invulnerable = true;
            
            this.sprite.src = "/assets/images/player/injuredPlayer.png";

            //After 3 seconds, player become vulnerable:
            setTimeout(() => {
                this.invulnerable = false;
                this.sprite.src = "/assets/images/player/player.png";
            }, 1000);
        }
    }

    

    die() {

    }

    //Attack:
    castSpell() {
        if( !this.spell || !this.spell.isActive ) {
            const xSpell = this.isRight ? this.x + this.width : this.x;
            this.spell = new Spell(this.ctx, xSpell, this.y + this.height / 2, this.isRight, this.house);
            
            setTimeout(() => {
                this.spell.isActive = false;
            }, 5000) 
        }

    }

    jump() {
        if(!this.actions.jump) {
            this.vy -= 20;
            this.actions.jump = true;

            const audio = new Audio("/assets/audio/player/jump.mp3");
            audio.volume = 0.1;
            audio.play();
        }
    }

    collides(element) {
        const collisionX = element.x <= this.x + this.width -  (this.width / 4 * 2) && element.x + element.width >= this.x && this.x + (this.width / 4 * 1) <= element.x + element.width;
        const collisionY = element.y <= this.y + this.height && element.y + element.height >= this.y;
        
        return collisionX && collisionY;
    }
    
    collect(item) {
        if( this.actions.collect ) {
            if ( !item.isCollected && item instanceof ChocolateFrog && this.health < 3) {
                // item.setHouseImg(this.house);
                this.health++;
                item.isCollected = true;
            }
        }
    }

    //Collect a Deathly Hallow
    collectDeathlyHallow(deathlyHallow) {
        if ( this.actions.collect ) {
            if ( !deathlyHallow.isCollected ) {
                deathlyHallow.isCollected = true;
                return true;
            }
        }
        return false;
    }


}