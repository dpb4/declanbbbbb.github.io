class Camera {
    constructor(subject, x, y, z, followingDistance, viewOffset, forwardPullStrength, lateralPullStrength, fov) {
        this.subject = subject;

        this.pos = {x: x, y: y, z: z};

        this.followingDistance = followingDistance;
        this.viewOffset = viewOffset;
        this.forwardPullStrength = forwardPullStrength;
        this.lateralPullStrength = lateralPullStrength;
        this.fov = fov;
        this.projectionDistance = canvas.width/2 / Math.tan(fov/2);
    }

    move() {
        this.pos.y += Math.max(0, this.subject.car.pos.y - this.pos.y - this.followingDistance) * this.forwardPullStrength;
        this.pos.x += (this.subject.car.pos.x - this.pos.x) * this.lateralPullStrength;
    }
}