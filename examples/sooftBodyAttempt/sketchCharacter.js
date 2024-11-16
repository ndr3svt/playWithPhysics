// Coding Train / Daniel Shiffman

const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;

const { GravityBehavior } = toxi.physics2d.behaviors;

const { Vec2D, Rect } = toxi.geom;

let physics;

let particles = [];
let eyes = [];
let springs = [];

let showSprings = false;

function keyPressed() {
  if (key == ' ') {
    showSprings = !showSprings;
  }
}

function setup() {
  createCanvas(640, 360);

  physics = new VerletPhysics2D();

  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);

  particles.push(new Particle(200, 100));
  particles.push(new Particle(250, 100));
  particles.push(new Particle(300, 100));
  particles.push(new Particle(350, 100));
  particles.push(new Particle(400, 100));
  particles.push(new Particle(350, 200));
  particles.push(new Particle(400, 300));
  particles.push(new Particle(350, 300));
  particles.push(new Particle(300, 300));
  particles.push(new Particle(250, 300));
  particles.push(new Particle(200, 300));
  particles.push(new Particle(250, 200));

  eyes.push(new Particle(275, 150));
  eyes.push(new Particle(325, 150));
  eyes.push(new Particle(250, 50));
  eyes.push(new Particle(350, 50));

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (i !== j) {
        let a = particles[i];
        let b = particles[j];
        // let b = particles[(i + 1) % particles.length];
        springs.push(new Spring(a, b, 0.001));
      }
    }
  }

  for (let particle of particles) {
    springs.push(new Spring(particle, eyes[0], 0.01));
    springs.push(new Spring(particle, eyes[1], 0.01));
  }

  springs.push(new Spring(eyes[2], particles[1], 0.01));
  springs.push(new Spring(eyes[3], particles[3], 0.01));

  springs.push(new Spring(eyes[2], particles[3], 0.01));
  springs.push(new Spring(eyes[3], particles[1], 0.01));

  springs.push(new Spring(eyes[2], particles[0], 0.01));
  springs.push(new Spring(eyes[3], particles[4], 0.01));

  springs.push(new Spring(eyes[3], particles[2], 0.01));
  springs.push(new Spring(eyes[2], particles[2], 0.01));

  springs.push(new Spring(eyes[2], eyes[3], 0.01));

  springs.push(new Spring(eyes[0], eyes[3], 0.01));
  springs.push(new Spring(eyes[0], eyes[2], 0.01));
  springs.push(new Spring(eyes[1], eyes[2], 0.01));
  springs.push(new Spring(eyes[1], eyes[3], 0.01));
}

function draw() {
  background(255);

  physics.update();

  stroke(112, 50, 126);
  if (showSprings) stroke(112, 50, 126, 100);

  strokeWeight(4);
  line(particles[1].x, particles[1].y, eyes[2].x, eyes[2].y);
  line(particles[3].x, particles[3].y, eyes[3].x, eyes[3].y);
  strokeWeight(16);
  point(eyes[2].x, eyes[2].y);
  point(eyes[3].x, eyes[3].y);

  fill(45, 197, 244);
  if (showSprings) fill(45, 197, 244, 100);
  strokeWeight(2);
  beginShape();
  for (let particle of particles) {
    vertex(particle.x, particle.y);
  }
  endShape(CLOSE);

  //   fill(127, 127);
  //   stroke(0);
  //   strokeWeight(2);
  //   beginShape();
  //   for (let particle of particles) {
  //     vertex(particle.x, particle.y);
  //   }
  //   endShape(CLOSE);

  // for (let particle of particles) {
  //   particle.show();
  // }

  eyes[0].show();
  eyes[1].show();

  // for (let eye of eyes) {
  //   eye.show();
  // }

  if (showSprings) {
    for (let spring of springs) {
      spring.show();
    }
  }

  if (mouseIsPressed) {
    particles[0].lock();
    particles[0].x = mouseX;
    particles[0].y = mouseY;
    particles[0].unlock();
  }
}




class Spring extends VerletSpring2D {
  constructor(a, b, strength) {
    let length = dist(a.x, a.y, b.x, b.y);
    super(a, b, length * 1, 0.001);
    physics.addSpring(this);
  }

  show() {
    strokeWeight(1);
    stroke(0, 127);
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
    fill(252, 238, 33);
    strokeWeight(1);
    circle(this.x, this.y, this.r * 12);

    strokeWeight(this.r * 4);
    point(this.x, this.y);
  }
}



