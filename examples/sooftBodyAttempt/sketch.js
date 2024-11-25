// defines all elements from matter js engine
// written by ndr3svt from sooft.studio based on Daniel Shiffman's tutorials on matterjs
// find more stuff like this on Instagram : 
// https://www.instagram.com/ndr3svt/
// https://www.instagram.com/sooft.studio/

// translation from softBody.js from matterjs library examples

// Importing Matter.js modules
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;
var mConstraint;

let engine, world;
let softBodies = [];
let boundaries = [];
let cols = 5, rows = 5;

let amorphousSoftBody;

function setup() {
    var canvas = createCanvas(800, 600);

    // Create Matter.js engine
    engine = Engine.create();
    world = engine.world;
    // Run the engine
    Matter.Runner.run(engine);

    // Create soft bodies
    let particleOptions = {
        friction: 0.15,
        frictionStatic: 0.91,
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



    // adding an amorphous soft body
    //let particleOptions = { friction: 0.05, frictionStatic: 0.1, render: { visible: true } };
    amorphousSoftBody = createAmorphousSoftBody(400, 300, 10, 50, 10, particleOptions);
    World.add(world, amorphousSoftBody);

    // Add mouse control
    var canvasmouse = Mouse.create(canvas.elt);
    canvasmouse.pixelRatio = pixelDensity();
    mConstraint = MouseConstraint.create(engine, {
        mouse: canvasmouse,
        constraint: {
          length: 25,
          stiffness: 0.12,
          angularStiffness: 0,
          render: { visible: true },
        },
    });
    World.add(world, mConstraint);

    
}

function draw() {
    background(0);

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


    // Display the amorphous soft body
    drawAmorphousSoftBody(amorphousSoftBody);

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
        stiffness: 0.02,
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

// Helper Function : create an amorphous soft body

function createAmorphousSoftBody(xx, yy, numParticles, areaRadius, radius, particleOptions) {
    let Common = Matter.Common;
    let Composite = Matter.Composite; // Correct reference
    let constraintOptions = Common.extend({
        stiffness: 0.05,
        render: { type: 'line', anchors: false }
    });

    // Create an empty composite for the amorphous body
    let amorphousBody = Matter.Composite.create({ label: 'Amorphous Soft Body' });

    // Create particles randomly within the defined area
    let particles = [];
    for (let i = 0; i < numParticles; i++) {
        let angle = random(0, TWO_PI); // Random angle
        let distance = random(0, areaRadius*4); // Random distance within the area radius
        let x = xx + cos(angle) * distance;
        let y = yy + sin(angle) * distance;

        let particle = Bodies.circle(x, y, radius, particleOptions);
        particles.push(particle);
        Composite.add(amorphousBody, particle);
    }

    // Connect particles with constraints based on proximity
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let distance = dist(
                particles[i].position.x,
                particles[i].position.y,
                particles[j].position.x,
                particles[j].position.y
            );

            //if (distance < radius * 8) { // Connect particles within a certain range
                let constraint = Matter.Constraint.create({
                    bodyA: particles[i],
                    bodyB: particles[j],
                    stiffness: 0.05,
                    render: { type: 'line', anchors: false }
                });
                Composite.add(amorphousBody, constraint);
            //}
        }
    }

    return amorphousBody;
}

function drawAmorphousSoftBody(amorphousBody) {
    // Loop through all the bodies (particles) in the composite
    let bodies = amorphousBody.bodies;
    let constraints = amorphousBody.constraints;


    // Draw particles
    stroke(0, 150, 255);
    strokeWeight(1)
    noFill(); // Particle color
    for (let body of bodies) {
        let pos = body.position;
        ellipse(pos.x, pos.y, body.circleRadius ); // Draw particle as a circle
    }

    // Draw constraints (connections)
    stroke(0, 150, 255);
    strokeWeight(1);
    beginShape()
    for (let constraint of constraints) {
        let posA = constraint.bodyA.position;
        let posB = constraint.bodyB.position;
        curveVertex(posA.x,posA.y)
        curveVertex(posB.x,posB.y)
        //line(posA.x, posA.y, posB.x, posB.y); // Draw a line connecting two particles
    }
    endShape()
}

