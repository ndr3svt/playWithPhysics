// defines all elements from matter js engine
// written by ndr3svt from sooft.studio based on Daniel Shiffman's tutorials on matterjs
// find more stuff like this on Instagram : 
// https://www.instagram.com/ndr3svt/
// https://www.instagram.com/sooft.studio/

// defines all elements from matter js engine
var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraints = Matter.Constraint,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint;

var engine;
var world;
var particles = [];
var constraints = [];
var mConstraint;
let amntRowsCols = 16;

function setup() {
  var canvas = createCanvas(540, 960);
  engine = Engine.create();
  world = engine.world;
  Matter.Runner.run(engine);
  let gridWidth = 540 / amntRowsCols;
  let gridHeight = 960 / amntRowsCols;

  for (let y = 0; y <= amntRowsCols; y++) {
    for (let x = 0; x <= amntRowsCols; x++) {
      var isStatic = y === 0; // Fix particles in the first row
      var i = y * (amntRowsCols + 1) + x;
      particles[i] = new Particle(
        0 + gridWidth * x,
        0 + gridHeight * y,
        5,
        isStatic
      );
      if (x > 0) {
        constraints.push(
          new Constraint({
            bodyA: particles[i - 1].body,
            bodyB: particles[i].body,
            length: gridWidth,
            stiffness: 0.05,
            pointA: { x: 0, y: 0 },
            pointB: { x: 0, y: 0 },
          })
        );
      }

      // Add vertical constraints
      if (y > 0) {
        constraints.push(
          new Constraint({
            bodyA: particles[i - (amntRowsCols + 1)].body,
            bodyB: particles[i].body,
            length: gridHeight,
            stiffness: 0.05,
            pointA: { x: 0, y: 0 },
            pointB: { x: 0, y: 0 },
          })
        );
      }
    }
  }
  var canvasmouse = Mouse.create(canvas.elt);
  canvasmouse.pixelRatio = pixelDensity();
  mConstraint = MouseConstraint.create(engine, {
    mouse: canvasmouse,
    constraint: {
      length: 25,
      stiffness: 0.2,
      angularStiffness: 0,
      render: { visible: true },
    },
  });
  World.add(world, mConstraint);
}
function draw() {
  noCursor();
  background(255);
  fill(255, 0, 0);

  for (var p of particles) {
    p.show();
  }
  for (var c of constraints) {
    c.show();
  }
  fill(0, 0, 255, 100);
  ellipse(mouseX, mouseY, 10, 10);
}

class Particle {
  constructor(x, y, particleSize, isStatic) {
    this.size = particleSize;
    this.body = Bodies.circle(x, y, this.size, {
      isStatic: isStatic,
      friction: 0,
    });
    World.add(world, this.body);
  }
  show() {
    let pos = this.body.position;
    let angle = this.body.angle;
    noStroke();
    fill(0);
    ellipse(pos.x, pos.y, 6, 6);
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    // drawing the rotation axes
    strokeWeight(0.5);
    stroke(255, 0, 0);
    line(-10, 0, 10, 0);
    stroke(0, 255, 0);
    line(0, -10, 0, 10);
    pop();
  }
}

class Constraint {
  constructor(options) {
    this.constraint = Constraints.create(options);
    World.add(world, this.constraint);
  }
  show() {
    let posA = this.constraint.bodyA.position;
    let posB = this.constraint.bodyB
      ? this.constraint.bodyB.position
      : this.constraint.pointB;
    stroke(20, 20, 140);
    strokeWeight(0.5);
    line(posA.x, posA.y, posB.x, posB.y);
  }
}
