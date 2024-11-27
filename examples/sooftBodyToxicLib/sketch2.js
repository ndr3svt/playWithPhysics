const MAX_SPEED = 50; // Define your maximum speed here
const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

let physics;
// our particles array containing the points/joints in the structure
let particlesf = [];
// our springs array containing the strings (tensor-compressor) connecting the joints
let springs = [];
// defining the shape of the scaffolding 8 rows, 4 columns
let rows = 8;
let cols = 4;
// defining the space between particles -> 80
let spacing = 60;
// this variable will allow for selecting and locking the position of a particle with the mouse
let selectedParticle = null;
// and this string will be then broken down into an array containing the letters of sooft studio
let letters = "S,O,O,F,T" ;

function setup() {
  createCanvas(900, 900);
  letters = letters.split(","); // explodes the string into an array with the letters. we can also just write the array directly and spare this step
  //console.log(letters);
  // Initialize physics
  physics = new VerletPhysics2D();
  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);

  // Add gravity to the system -> 0.75 is rather stron gravity. 
  // the bigger the gravity the heavier the object. try out playing with bigger numbers
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.75)));

  // Create a grid of particles
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let particle = new Particle(100 + x * spacing, 50 + y * spacing, false);
      particlesf.push(particle);
    }
  }
  // Connect particles with springs
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let i = x + y * cols;
      // Right neighbor
      if (x < cols - 1) {
        springs.push(new Spring(particlesf[i], particlesf[i + 1]));
      }
      // Bottom neighbor
      if (y < rows - 1) {
        springs.push(new Spring(particlesf[i], particlesf[i + cols]));
      }

      // Diagonal neighbors
      if (x < cols - 1 && y < rows - 1) {
        springs.push(new Spring(particlesf[i], particlesf[i + cols + 1]));
      }
      if (x > 0 && y < rows - 1) {
        springs.push(new Spring(particlesf[i], particlesf[i + cols - 1]));
      }
    }
  }
}

function draw() {
  background(0, 0, 255);
  // Update the physics system
  physics.update();
  // Draw springs
  springs.forEach((spring) => spring.show());
  // Draw particles
  particlesf.forEach((particle) => particle.show());

  // Handle mouse interaction
  if (mouseIsPressed) {
    if (!selectedParticle) {
      // Find the nearest particle on mouse press
      //let particlesT = particlesf.concat(particles2); // in case we would build a second body particles2 we can concatenate both to interact with the mouse
      //  selectedParticle = particlesT.reduce((nearest, p) => { // in case two bodies particlesT instead of particlesf
      selectedParticle = particlesf.reduce((nearest, p) => {
        let d = dist(mouseX, mouseY, p.x, p.y);
        return d < dist(mouseX, mouseY, nearest.x, nearest.y) ? p : nearest;
      }, particlesf[0]);
    }
    // Move the selected particle
    selectedParticle.lock();
    selectedParticle.x = mouseX;
    selectedParticle.y = mouseY;
    selectedParticle.unlock();
  } else {
    selectedParticle = null; // Reset when mouse is released
  }

}

// Particle class extension
class Particle extends VerletParticle2D {
  constructor(x, y, fixed = false) {
    super(new Vec2D(x, y));
    this.r = 6;
    if (fixed) this.lock(); // Lock fixed particles
    physics.addParticle(this);
    this.ltt = letters[int(random(0, letters.length))];
    //console.log(this.ltt)
  }

  show() {
    fill(255);
    //stroke(255);
    //ellipse(this.x, this.y, this.r * 2);
    textAlign(CENTER, CENTER);
    textSize(35);
    text(this.ltt, this.x, this.y);
  }
}

// Spring class extension
class Spring extends VerletSpring2D {
  constructor(a, b) {
    let length = a.distanceTo(b); // Rest length is the initial distance
    super(a, b, length, 0.08); // Strength of the spring
    physics.addSpring(this);
  }

  show() {
    stroke(255, 127);
    strokeWeight(1);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}