class Player {
    constructor(currentCar) {
        this.car = new Car(currentCar, 0, followingDistance, true);
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
    }
}