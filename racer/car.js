class Car {
    constructor(type, x, y, isShown) {
        this.type = type;
        this.isShown = isShown;

        this.pos = {x: x, y: y};
        this.vel = {x: 0, y: 0};
        this.acc = {x: 0, y: 0};

        //TODO change
        this.width = images[this.type].width;
        this.height = images[this.type].height;

        this.drag = 0.0003;
        this.accelerationStrength = 0.02;
        this.brakeStrength = 0.05;

        this.throttling = false;
        this.braking = false;
    }

    throttle() {
        this.acc.y = this.accelerationStrength;
    }

    brake() {
        this.acc.y = -this.brakeStrength;
    }

    speedometer() {
        return Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y ) * speedConstant;
    }

    update() {
        if (this.throttling) {
            this.throttle();
        }
        if (this.braking) {
            this.brake();
        }
        if (!this.throttling && !this.braking) {
            this.acc.x = 0;
            this.acc.y = 0;
        }

        let slowdown = (1 - friction) * (1 - this.drag);
        
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        
        this.vel.x *= slowdown;
        this.vel.y *= slowdown;

        if (this.vel.y < 0) {
            this.vel.y = 0;
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
    
    display() {
        
    }
}