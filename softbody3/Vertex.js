class Vertex {
    constructor(x, y, selfCollisionRadius, realRadius, id) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.selfCollisionRadius = selfCollisionRadius;
        this.realRadius = realRadius;

        this.force = createVector(0, 0);

        this.id = id;
        this.c = color(255, 0, 0);
    }

    applyForce(f) {
        this.force.add(f);
    }

    resetForce() {
        this.force.x = 0;
        this.force.y = 0;
    }
    
    updateVelocity() {
        this.acc = this.force.mult(accelerationConstant).copy();
        this.acc.y += gravity*accelerationConstant;

        // this.acc.mult(1/physicsIterations);
                
        this.vel.add(this.acc.copy().mult(1/physicsIterations));

        
        // this.pos.add(this.vel.copy().mult(1/physicsIterations));
        
        
        // this.checkEdges();

        // this.vel.mult((1-generalFriction));
        this.resetForce();
    }

    updatePosition() {
        this.pos.add(this.vel.copy().mult(1/physicsIterations));
    }

    checkEdges() {
        if (this.pos.x < this.realRadius) {
            this.forcePosition(this.realRadius, this.pos.y);

            if (this.vel.x < 0) {
                this.forceVelocity(0, this.vel.y);
            }
        }
        if (this.pos.x > width - this.realRadius) {
            this.forcePosition(width - this.realRadius, this.pos.y);

            if (this.vel.x > 0) {
                this.forceVelocity(0, this.vel.y);
            }
        }
        if (this.pos.y < this.realRadius) {
            this.forcePosition(this.pos.x, this.realRadius);

            if (this.vel.y <= 0) {
                this.forceVelocity(this.vel.x*(1-groundFriction), 0);
            }
        }
        if (this.pos.y > height - this.realRadius) {
            this.forcePosition(this.pos.x, height - this.realRadius);

            if (this.vel.y > 0) {
                this.forceVelocity(this.vel.x, 0);
            }
        }
    }

    forcePosition(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    forceVelocity(x, y) {
        this.vel.x = x;
        this.vel.y = y;
    }

    display() {
        noStroke();
        fill(this.c);
        ellipse(this.pos.x, height - this.pos.y, this.realRadius*2, this.realRadius*2);

        if (debug) {
            noFill();
            stroke(0);
            ellipse(this.pos.x, height - this.pos.y, this.selfCollisionRadius*2, this.selfCollisionRadius*2);

            stroke(255, 0, 0);
            line(this.pos.x, height - this.pos.y, this.pos.x + this.vel.x*10, height - this.pos.y - this.vel.y*10);
            
            stroke(0, 255, 0);
            line(this.pos.x, height - this.pos.y, this.pos.x + this.acc.x*30, height - this.pos.y - this.acc.y*30);
        }
    }

}