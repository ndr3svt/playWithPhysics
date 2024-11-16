const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;

const { GravityBehavior } = toxi.physics2d.behaviors;

const { Vec2D, Rect } = toxi.geom;

let physics;

let font;
let particles = [];
let springs = [];

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(600, 600);

  physics = new VerletPhysics2D();
}

function keyPressed() {
  physics.clear();
  physics = new VerletPhysics2D();
  particles = [];
  springs = [];
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.5)));

  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);
  var points = font.textToPoints(key, width / 2 - 90, 180, 360, {
    sampleFactor: 0.08,
  });

  for (var i = 0; i < points.length; i++) {
    let pt = points[i];
    let particle = new Particle(pt.x, pt.y);
    particles.push(particle);
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (i !== j) {
        if (random(1) < 0.5) {
          let a = particles[i];
          let b = particles[j];
          // let b = particles[(i + 1) % particles.length];
          springs.push(new Spring(a, b, 0.001));
        }
      }
    }
  }
}

function draw() {
  background(45, 197, 244);
  physics.update();

  strokeWeight(4);
  beginShape();
  stroke(112, 50, 126);
  fill(240, 99, 164);
  for (var i = 0; i < particles.length; i++) {
    vertex(particles[i].x, particles[i].y);
  }
  endShape(CLOSE);

  // if (mouseIsPressed) {
  //   particles[0].lock();
  //   particles[0].x = mouseX;
  //   particles[0].y = mouseY;
  //   particles[0].unlock();
  // }

  //   for (var i = 0; i < particles.length; i++) {
  //     particles[i].show();
  //   }

  //   for (var i = 0; i < springs.length; i++) {
  //     springs[i].show();
  //   }
}


  class Spring extends VerletSpring2D {
  constructor(a, b, strength) {
    let length = dist(a.x, a.y, b.x, b.y);
    super(a, b, length * 1, 0.0005);
    physics.addSpring(this);
  }

  show() {
    stroke(0, 50);
    strokeWeight(0.25);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}



class Particle extends VerletParticle2D {
  constructor(x, y) {
    super(x, y);
    this.r = 2;
    physics.addParticle(this);
  }

  show() {
    strokeWeight(1);
    stroke(0);
    strokeWeight(this.r * 2);
    point(this.x, this.y);
  }
}


