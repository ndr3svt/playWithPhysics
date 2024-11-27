// reference conversation with perplexity to fix the issue with very high velocities

const MAX_SPEED = 50; // Define your maximum speed here
const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

let physics;
let particlesf = [];
let particles2 = [];

let springs = [];
let springs2 = [];

let rows = 8;
let cols = 4;
let spacing = 80;
let selectedParticle = null;
//let letters = "S,O,O,F,T";
//let letters = "L,A,U,R,A";
//let letters = "P,A,B,L,O";
let letters = "n,u,p,d";
function setup() {
  createCanvas(900, 900);
  letters = letters.split(",");
  //console.log(letters);
  // Initialize physics
  physics = new VerletPhysics2D();
  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);

  // Add gravity to the system
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.75)));

  // Create a grid of particles
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let fixed = y === 0 && (x === 0 || x === cols - 1); // Fix top corners
      let particle = new Particle(100 + x * spacing, 50 + y * spacing, false);
      let particle2 = new Particle(500 + x * spacing, 50 + y * spacing, false);
      particlesf.push(particle);
      //particles2.push(particle2)
    }
  }

  // Connect particles with springs
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let i = x + y * cols;

      // Right neighbor
      if (x < cols - 1) {
        springs.push(new Spring(particlesf[i], particlesf[i + 1]));
        //springs2.push(new Spring(particles2[i], particles2[i + 1]));
      }

      // Bottom neighbor
      if (y < rows - 1) {
        springs.push(new Spring(particlesf[i], particlesf[i + cols]));
        //springs2.push(new Spring(particles2[i], particles2[i + cols]));
      }

      // Diagonal neighbors
      if (x < cols - 1 && y < rows - 1) {
        springs.push(new Spring(particlesf[i], particlesf[i + cols + 1]));
         //springs2.push(new Spring(particles2[i], particles2[i + cols + 1]));
      }
      if (x > 0 && y < rows - 1) {
        springs.push(new Spring(particlesf[i], particlesf[i + cols - 1]));
        //springs2.push(new Spring(particles2[i], particles2[i + cols - 1]));
      }
    }
  }
}

function draw() {
  background(0, 0, 255);

  // Update the physics system
  physics.update();
  
  
  constrainParticleVelocities();
  // Apply repulsion forces to prevent collapsing
  applyRepulsion();

  // Draw springs
  springs.forEach((spring) => spring.show());
  springs2.forEach((spring2) => spring2.show());

  // Draw particles
  particlesf.forEach((particle) => particle.show());
  particles2.forEach((particle2) => particle2.show())

  // Draw the mesh as a filled shape
  //noStroke();
  //noFill();
  //beginShape();
  //particles.forEach((p) => vertex(p.x, p.y));
  //particles2.forEach((p) => vertex(p.x, p.y));
  //endShape(CLOSE);

  // Handle mouse interaction
  if (mouseIsPressed) {
    if (!selectedParticle) {
      // Find the nearest particle on mouse press
      let particlesT = particlesf.concat(particles2);
      selectedParticle = particlesT.reduce((nearest, p) => {
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
let logOnce = false;
// Apply a repulsion force between all particles
function applyRepulsion() {
  let repulsionStrength = 881; // Adjust for stronger or weaker repulsion
  particlesf.forEach((p1, i) => {
    particlesf.slice(i + 1).forEach((p2) => {
      let force = p1.copy().sub(p2); // Correctly use instance methods
      let distance = force.magnitude();
      if (distance > 0 && distance < spacing / 2) {
        // Repel only within a certain range
        force.normalizeTo(repulsionStrength / (distance * distance)); // Scale force with inverse-square law
        p1.addForce(force); // Apply force to p1
        p2.addForce(force.scale(-1)); // Apply the opposite force to p2
        if (!logOnce) {
          console.log(p1);
          console.log(p2);
          logOnce = true;
        }
      }
      
    });
  });
}

// Particle class
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

// Spring class
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

let logOnceee = false
function constrainParticleVelocities() {
  particlesf.forEach((particle) => {
    
     
    let dx = particle.x - particle.prev.x; // Change in x
    let dy = particle.y - particle.prev.y; // Change in y
    let speed = Math.sqrt(dx * dx + dy * dy); // Calculate speed

    if(!logOnceee){
      console.log(particle.prev.x)
      console.log(speed)
      logOnceee = true
    }
    if (speed > MAX_SPEED) {
      // Normalize and scale down to MAX_SPEED
      let ratio = MAX_SPEED / speed;
      particle.x = particle.prev.x + dx * ratio; // Adjust x position
      particle.y = particle.prev.y + dy * ratio; // Adjust y position
    }
  });
}
