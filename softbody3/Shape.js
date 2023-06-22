class Shape {
    constructor(x, y, springStrength, distance, springDistance, sideLength) {
        this.springStrength = springStrength;
        this.distance = distance;
        this.springDistance = springDistance;
        this.sideLength = sideLength;

        this.x = x;
        this.y = y;

        
        this.init();
    }
    
    init() {
        this.vertices = Array();
        this.surfaceVertices = Array();
        this.connections = Array();
        this.createVertices();
        this.createConnections();
    }

    createVertices() {
    }

    createConnections() {
        
    }

    displayVertices() {
        for (let i = 0; i < this.vertices.length; i++) {
            fill(255, 0, 0);
            this.vertices[i].display();
        }
    }

    displayConnections() {
        for (let i = 0; i < this.connections.length; i++) {
            this.connections[i].display();
        }
    }

    display() {
        if (debug) {
            this.displayConnections();
            this.displayVertices();

            for (let i = 0; i < this.surfaceVertices.length; i++) {
                fill(0, 0, 255);
                this.surfaceVertices[i].display();
            }
        } else {
            noStroke();
            fill(255, 0, 0);
            beginShape();
            for (let i = 0; i < this.surfaceVertices.length; i++) {
                vertex(this.surfaceVertices[i].pos.x, height - this.surfaceVertices[i].pos.y);
            }
            endShape();
        }
    }

    update() {
        for (let x = 0; x < physicsIterations; x++) {
            for (let i = 0; i < this.connections.length; i++) {
                this.connections[i].apply();
            }
            for (let i = 0; i < this.vertices.length; i++) {
                let v = this.vertices[i];

                v.updateVelocity();

                if (selfIntersection) {
                    for (let c = 0; c < this.connections.length; c++) {
                        let conn = this.connections[c];
                        if (conn.p1.id !== v.id && conn.p2.id !== v.id) {
                            let nextPos = v.pos.copy().add(v.vel.copy().mult(1/physicsIterations));
                            if (circleLineInstersect(conn.p1.pos, conn.p2.pos, nextPos, v.selfCollisionRadius)) {
                                // print("collision", i)
                                // v.c = color(0, 255, 0);
                                conn.c = color(0, 255, 0);

                                let n = createVector(abs(conn.p1.y - conn.p2.y), -abs(conn.p1.x-conn.p2.x)).normalize();
                                v.vel.sub(v.vel.dot(n));
                                // v.forceVelocity(0, 0);
                            }
                        }
                    }
                }
                // for (let x = 0; x < this.vertices.length; x++) {
                //     for (let j = x+1; j < this.vertices.length; j++) {
                //         if (x !== i) {
                //             let d = this.vertices[x].pos.copy().add(this.vertices[x].vel.copy().mult(1/physicsIterations)).dist(this.vertices[j].pos);
                //             let reald = this.vertices[x].selfCollisionRadius + this.vertices[j].selfCollisionRadius;
                //             if (d < reald) {
                //                 // let vec = this.vertices[j].pos.copy().sub(this.vertices[i].pos).setMag((reald-d)/2);
                //                 // this.vertices[i].pos.sub(vec);
                //                 // this.vertices[j].pos.add(vec);
                //                 // print("collision imminent");
                //                 this.vertices[x].forceVelocity(0, 0);
                //             }
                //         }
                //     }
                // }
                v.updatePosition();
            }
        }
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].checkEdges();
            this.vertices[i].vel.mult(1-generalFriction);
        }

        // for (let i = 0; i < this.vertices.length; i++) {
        //     for (let j = i+1; j < this.vertices.length; j++) {
        //         let d = this.vertices[i].pos.dist(this.vertices[j].pos);
        //         let reald = this.vertices[i].selfCollisionRadius + this.vertices[j].selfCollisionRadius;
        //         if (d < reald) {
        //             let vec = this.vertices[j].pos.copy().sub(this.vertices[i].pos).setMag((reald-d)/2);
        //             this.vertices[i].pos.sub(vec);
        //             this.vertices[j].pos.add(vec);
        //         }
        //     }
        // }
    }
}