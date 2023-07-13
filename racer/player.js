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
        }
        if (keyStates['KeyS']) {
            this.car.brake();
        }
    }
}