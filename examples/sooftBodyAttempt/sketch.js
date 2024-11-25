// Importing Matter.js modules
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

let engine, world;
let softBodies = [];
let boundaries = [];
let cols = 5, rows = 5;

function setup() {
    createCanvas(800, 600);

    // Create Matter.js engine
    engine = Engine.create();
    world = engine.world;

    // Create soft bodies
    let particleOptions = {
        friction: 0.05,
        frictionStatic: 0.1,
        render: { visible: true }
    };

    // Add three soft bodies
    softBodies.push(createSoftBody(250, 100, cols, rows, 0, 0, true, 18, particleOptions));
    softBodies.push(createSoftBody(400, 300, 8, 3, 0, 0, true, 15, particleOptions));
    softBodies.push(createSoftBody(250, 400, 4, 4, 0, 0, true, 15, particleOptions));

    // Add boundaries (walls)
    boundaries.push(Bodies.rectangle(400, 0, 800, 50, { isStatic: true }));
    boundaries.push(Bodies.rectangle(400, 600, 800, 50, { isStatic: true }));
    boundaries.push(Bodies.rectangle(800, 300, 50, 600, { isStatic: true }));
    boundaries.push(Bodies.rectangle(0, 300, 50, 600, { isStatic: true }));

    // Add everything to the world
    for (let body of softBodies) World.add(world, body);
    for (let boundary of boundaries) World.add(world, boundary);

    // Add mouse control
    let canvasMouse = Mouse.create(canvas.elt);
    canvasMouse.pixelRatio = pixelDensity();
    let mouseConstraint = MouseConstraint.create(engine, {
        mouse: canvasMouse,
        constraint: { stiffness: 0.9, render: { visible: false } }
    });
    World.add(world, mouseConstraint);

    // Run the engine
    Matter.Runner.run(engine);
}

function draw() {
    background(255);

    // Draw soft bodies
    noFill();
    stroke(0, 150, 255);
    strokeWeight(2);

    for (let softBody of softBodies) {
        for (let body of softBody.bodies) {
            let pos = body.position;
            ellipse(pos.x, pos.y, 10, 10); // Draw each particle
        }

        for (let constraint of softBody.constraints) {
            let { bodyA, bodyB, pointA, pointB } = constraint;
            let posA = bodyA ? bodyA.position : { x: pointA.x, y: pointA.y };
            let posB = bodyB ? bodyB.position : { x: pointB.x, y: pointB.y };

            line(posA.x, posA.y, posB.x, posB.y); // Draw connecting lines
        }
    }

    // Draw boundaries (walls)
    fill(100);
    for (let boundary of boundaries) {
        let vertices = boundary.vertices;
        beginShape();
        for (let v of vertices) vertex(v.x, v.y);
        endShape(CLOSE);
    }
}

// Helper function: create a soft body
function createSoftBody(xx, yy, cols, rows, colGap, rowGap, crossBrace, radius, particleOptions) {
    let Common = Matter.Common;

    particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
    let constraintOptions = Common.extend({
        stiffness: 0.2,
        render: { type: 'line', anchors: false }
    });

    // Create stack of particles
    let softBody = Composites.stack(xx, yy, cols, rows, colGap, rowGap, function (x, y) {
        return Bodies.circle(x, y, radius, particleOptions);
    });

    // Connect particles with constraints to form a mesh
    Composites.mesh(softBody, cols, rows, crossBrace, constraintOptions);

    softBody.label = 'Soft Body';
    return softBody;
}
