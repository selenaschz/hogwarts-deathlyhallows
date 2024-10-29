class LevelObject {
    constructor(ctx) {
        this.ctx = ctx;

        this.x = Math.floor(Math.random() * this.ctx.width - 50);
        this.y = Math.floor(Math.random() * this.ctx.height - 50);

        this.vx = 3;
        this.vy = 3;
    }

}