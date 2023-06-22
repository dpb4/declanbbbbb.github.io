class Pair extends Shape {
    constructor(x, y, springStrength, distance, springDistance, sideLength) {
        super(x, y, springStrength, distance, springDistance, sideLength);
    }

    createVertices() {
        this.vertices.push(new Vertex(this.x, this.y, 30, 20));
        this.vertices.push(new Vertex(this.x + this.distance, this.y, 30, 20));
    }

    createConnections() {
        this.connections.push(new Connection(this.springDistance, this.springStrength, this.vertices[0], this.vertices[1]));
    }
}

class Circle extends Shape {
    constructor(x, y, springStrength, distance, springDistance, sideLength) {
        super(x, y, springStrength, distance, springDistance, sideLength);
    }

    createVertices() {
        //ring 1
        for (let i = 0; i < this.sideLength; i++) {
            this.vertices.push(new Vertex(this.x + this.distance*cos(i/this.sideLength * TWO_PI), this.y + this.distance*sin(i/this.sideLength * TWO_PI), 30, 10));
            this.surfaceVertices.push(this.vertices[i]);
            this.surfaceVertices[i].c = color(0, 0, 255);
        }
        //ring 2
        for (let i = 0; i < this.sideLength; i++) {
            this.vertices.push(new Vertex(this.x + this.distance*0.66*cos(i/this.sideLength * TWO_PI), this.y + this.distance*0.66*sin(i/this.sideLength * TWO_PI), 30, 10));
        }
    }

    createConnections() {
        //circumference
        for (let i = 0; i < this.sideLength; i++) {
            this.connections.push(new Connection(this.distance * TWO_PI / this.sideLength, this.springStrength, this.vertices[i], this.vertices[(i+1) % this.sideLength]));
        }
        for (let i = 0; i < this.sideLength; i++) {
            this.connections.push(new Connection(this.distance * 0.66 * TWO_PI / this.sideLength, this.springStrength, this.vertices[i + this.sideLength], this.vertices[(i+1) % this.sideLength + this.sideLength]));
        }
        //interior
        for (let i = 0; i < this.sideLength / 2; i++) {
            this.connections.push(new Connection(this.springDistance*2 * 0.66, this.springStrength, this.vertices[i + this.sideLength], this.vertices[i + this.sideLength/2]));
        }
        for (let i = 0; i < this.sideLength; i++) {
            this.connections.push(new Connection(this.distance * 0.34, this.springStrength, this.vertices[i], this.vertices[i+this.sideLength]));
            this.connections.push(new Connection(this.distance * 0.34 * 1.4, this.springStrength, this.vertices[i], this.vertices[(i + 1) % this.sideLength + this.sideLength]));
            this.connections.push(new Connection(this.distance * 0.34 * 1.4, this.springStrength, this.vertices[i], this.vertices[(i - 1 + this.sideLength) % this.sideLength + this.sideLength]));
        }
    }
}

class Square extends Shape {
    constructor(x, y, springStrength, distance, springDistance, sideLength) {
        super(x, y, springStrength, distance, springDistance, sideLength);
    }

    createVertices() {
        let count = 0;
        for (let y = 0; y < this.sideLength; y++) {
            for (let x = 0; x < this.sideLength; x++) {
                this.vertices.push(new Vertex(this.x - (this.distance*2) + x*this.distance, this.y - (this.distance*2) + y*this.distance, 30, 20, count));
                count++;
            }
        }

        for (let i = 0; i < this.sideLength; i++) {
            this.surfaceVertices.push(this.vertices[i]);
        }
        for (let i = 1; i < this.sideLength; i++) {
            this.surfaceVertices.push(this.vertices[i*this.sideLength + this.sideLength-1]);
        }
        for (let i = this.sideLength - 2; i >= 0; i--) {
            this.surfaceVertices.push(this.vertices[i + (this.sideLength*(this.sideLength-1))]);
        }
        for (let i = this.sideLength - 2; i >= 1; i--) {
            this.surfaceVertices.push(this.vertices[i*this.sideLength]);
        }

        for (let i = 0; i < this.surfaceVertices.length; i++) {
            this.surfaceVertices[i].c = color(0, 0, 255);
        }
    }

    createConnections() {
        for (let y = 0; y < this.sideLength-1; y++) {
            for (let x = 0; x < this.sideLength-1; x++) {
                let index = x + y*this.sideLength;

                this.connections.push(new Connection(this.springDistance, this.springStrength, this.vertices[index], this.vertices[index+1]));
                this.connections.push(new Connection(this.springDistance, this.springStrength, this.vertices[index], this.vertices[index+this.sideLength]));
                this.connections.push(new Connection(this.springDistance * pow(2, 0.5), this.springStrength, this.vertices[index], this.vertices[index+this.sideLength+1]));
                this.connections.push(new Connection(this.springDistance * pow(2, 0.5), this.springStrength, this.vertices[index+1], this.vertices[index+this.sideLength]));

                if (x === this.sideLength-2) {
                    this.connections.push(new Connection(this.springDistance, this.springStrength, this.vertices[index+1], this.vertices[index+this.sideLength+1]));
                }
                if (y === this.sideLength-2) {
                    this.connections.push(new Connection(this.springDistance, this.springStrength, this.vertices[index+this.sideLength], this.vertices[index+this.sideLength+1]));
                }
            }
        }
    }

    // display() {
    //     if (debug) {
    //         this.displayConnections();
    //         this.displayVertices();

    //         for (let i = 0; i < this.surfaceVertices.length; i++) {
    //             fill(0, 0, 255);
    //             this.surfaceVertices[i].display();
    //         }
    //     } else {
    //         noStroke();
    //         fill(255, 0, 0);
    //         beginShape();
    //         for (let i = 0; i < this.surfaceVertices.length; i++) {
    //             vertex(this.surfaceVertices[i].pos.x, this.surfaceVertices[i].pos.y);
    //         }
    //         endShape();
    //     }
    // }
}