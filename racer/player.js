class Player {
    constructor(currentCar) {
        this.car = new Car(currentCar, 0, followingDistance, true);
        this.camera = new Camera(this, 0, 0, cameraHeight, followingDistance, cameraViewOffset, forwardPullStrength, lateralPullStrength, fov);
    }

    changeCar(newCar) {
        this.car = new Car(newCar, this.car.pos.x, this.car.pos.y, this.car.isShown);
    }

    update() {
        if (keyStates['KeyW']) {
            this.car.throttle();
            this.car.throttling = true;
            // console.log("throttling");
        } else {
            this.car.throttling = false;
        }

        if (keyStates['KeyS']) {
            this.car.brake();
            this.car.braking = true;
            // console.log("braking");
        } else {
            this.car.braking = false;
        }

        if (keyStates['KeyA']) {
            this.car.turning = true;
            this.car.turn("left");
        }

        if (keyStates['KeyD']) {
            this.car.turning = true;
            this.car.turn("right");
        }

        if (!keyStates['KeyA'] && !keyStates['KeyD']) {
            this.car.turning = false;
        }
    }
}