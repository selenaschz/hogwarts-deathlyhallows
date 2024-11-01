class Door {
    constructor(ctx) {
        this.ctx = ctx;

        this.image = new Image();
        this.image.src = "/assets/images/door.png"

        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
         }

        this.x = this.ctx.canvas.width / 2;
        this.y = this.ctx.canvas.height - 250;
    }

    draw() {
            this.ctx.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height
           )
    }

}