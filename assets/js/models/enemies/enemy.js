class Enemy {
    constructor(ctx, type) {
        this.ctx = ctx;

        this.type = type;

        this.x = (this.type === "troll") ? 0 : this.ctx.canvas.width;
        this.y = (this.type === "dementor") ? 340 : 350;

        this.vx = 3;

        this.audio = new Audio(`/assets/audio/enemies/${type}.mp3`);
        this.audio.volume = 0.06;

        this.sprite = new Image();
        this.sprite.src = `/assets/images/enemies/${type}.png`
        
        this.sprite.frameIndex = 0;
        this.sprite.frames = 2;
        this.sprite.frameRate = 30;
        this.drawCount = 0;

        this.isAlive = true;

        this.isRight = false;

        this.opacity = 1;

        this.sprite.onload = () => {
            this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.frames);
            this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.frames);
            this.width = this.sprite.frameWidth;
            this.height = this.sprite.frameHeight;
        }
    }

    updateAnimation() {
        this.drawCount++;

        if ( this.drawCount > this.sprite.frameRate ) {
            this.sprite.frameIndex++;
            this.drawCount = 0;

            if (this.sprite.frameIndex >= this.sprite.frames) {
                this.sprite.frameIndex = 0;
            }
        }
    }

    draw() {
        this.updateAnimation();

        if( !this.isAlive ) {
            this.fadeOut();
        }
        this.ctx.save();

        this.ctx.globalAlpha = this.opacity;
        
        this.ctx.drawImage(
            this.sprite,
            this.sprite.frameIndex * this.width,
            (this.isRigth ? 1 : 0) * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.ctx.restore();
    }

    playSound() {
        if (this.x + this.width > 0 && this.x < this.ctx.canvas.width) {  
            this.audio.play(); }
    }

    move(player) {

        if ( player.x > this.x + this.width -30) {
            this.x += this.vx; 
            this.isRigth = true;
        } else if ( player.x < this.x ) {
            this.x -= this.vx; 
            this.isRigth = false;
        }
        
        this.playSound();
    }

    takeDamage() {
        this.fadeOut(); //Frame decreases the opacity
        this.isAlive = false;
        this.audio.pause();     
    }

    fadeOut() {
        this.opacity = Math.max(0, this.opacity - 0.05); //Decrease opacity
    }

}