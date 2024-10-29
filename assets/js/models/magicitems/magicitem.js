class MagicItem {
    constructor(ctx, name) {
        this.ctx = ctx;

        this.x = Math.floor(Math.random() * (this.ctx.canvas.width - 50));
        this.y = this.ctx.canvas.height - 100;

        this.name = name;

        // this.showCollect = false;

        this.image = new Image();
        this.image.src = `/assets/images/magicitems/${name}.png`;

        // this.imgCollect = new Image();

        this.isCollected = false;

        this.vy= 0;
        this.g = 1;
        this.isGround = true;

         this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
         }
    }

    draw() {
        if(!this.isCollected) {
            this.ctx.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height
           )
        }
    }

    move() {

        if ( this.isGround ) {
            this.vy = -10;
            this.isGround = false;

        } else {
            this.vy += this.g;
            this.y += this.vy; 

            this.checkIsGround();
        }
    }

    checkIsGround() {
        if (this.y >= this.ctx.canvas.height - 100) { 
            this.y = this.ctx.canvas.height - 100; 
            this.isGround = true; 
            this.vy = 0;
        }
    }

}