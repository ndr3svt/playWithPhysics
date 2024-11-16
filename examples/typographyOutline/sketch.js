/*
by ndr3svt
references

https://github.com/mikolalysenko/vectorize-text?tab=readme-ov-file
https://opentype.js.org/
https://www.youtube.com/watch?v=eZHclqx2eJY

*/


// Matter.js module aliases
const {
    Engine,
    World,
    Bodies,
    Composite,
    Constraint,
    Mouse,
    MouseConstraint
} = Matter;
/*
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vertices = Matter.Vertices,
    Composite = Matter.Composite,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;
    */

let engine;
let world;
let boundaries = [];
let particles = [];
let mConstraint;

// Ensure decomp.js is available
if (typeof decomp !== 'undefined') {
  //Matter.Common.setDecomp(decomp);
  //console.log('matter decomposing')
}else{
  console.log('no decomp jjj')
}
let font;
let points;
let pointsW;


function preload() {
  // Load a custom font (make sure the font file is in your project directory)
  font = loadFont('original.otf');
  
}
//console.log('decomp:', typeof decomp);


function setup() {
  //createCanvas(1500, windowHeight);
 
  let canvas = createCanvas(540*1.1, 960*1.1);
  // Create the Matter.js engine and world
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 0;
  engine.world.gravity.x = 0;
  background(255);
  
  boundaries.push(new Boundary(width / 2, height/2, width/2 , 20, 0));
  
  // The text you want to vectorize
  let textStr = 's';
  let textStrF = 'w';

  // Get the points for the text
  let mainX=15
  let mainY=180
  points = font.textToPoints(textStr,220+mainX, mainY, 220, {
    sampleFactor: 0.5,
    simplifyThreshold: 0.0,
  });
  
  pointsW = font.textToPoints(textStrF, 245+mainX, mainY+140+460, 220, {
    sampleFactor: 0.1,
    simplifyThreshold: 0.0,
  });
  
  
  for(i = 0 ; i < pointsW.length; i ++){
    let x = pointsW[i].x*1
    let y = pointsW[i].y*1
    boundaries.push(new Boundary(x- (width*1.1 - width)/2 -20 ,y, 10, 10, 0 ));
  }
 //console.log(points)
  let prev = null;
  for(i = 0; i < points.length; i ++){
    
    let x = points[i].x*1.4
    let y = points[i].y*1.4
    let p
    if(prev ){
      p = new Particle(x - (width*1.4 - width)/2 ,y - 50,1.51,false)
    }else{
      p = new Particle(x,y,1.51,false)
    }
    
    particles.push(p)
    if(prev){
      let options = {
                  bodyA: p.body,
                  bodyB: prev.body,
                  length: 8,
                  stiffness: 0.95
      }
      let constraint = Constraint.create(options)
      World.add(world, constraint)
    }
    prev = p
  }
  
  
  for(i = 0; i < points.length; i ++){
    let x = points[i].x*1
    let y = points[i].y*1
    let p
    if(prev){
      p = new Particle(x,y,2.2,true)
    }else{
      p = new Particle(x,y,2.2,true)
    }
    
    particles.push(p)
    if(prev){
      let options = {
                  bodyA: p.body,
                  bodyB: prev.body,
                  length: 8,
                  stiffness: 0.95
      }
      let constraint = Constraint.create(options)
      World.add(world, constraint)
    }
    prev = p
  }
  
 
  // Add mouse constraint for interactivity
  let canvasMouse = Mouse.create(canvas.elt);
    let options = {
        mouse: canvasMouse,
  }
  canvasMouse.pixelRatio = pixelDensity();
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint)
  noCursor()
}

function draw() {
  background(0,0,255);
  
  noStroke()
  fill(255,150)
  ellipse(mouseX,mouseY,50,50)
  
  Engine.update(engine);
  
  /*
    for (let i = 0; i < boundaries.length; i++) {  
         boundaries[i].show();
    }
  */
   boundaries[0].show();
  beginShape()
  stroke(255)
  strokeWeight(2)
  for (i = 0; i < particles.length; i++) {
    //fill(255);
    //noStroke();
    //ellipse(particles[i].body.position.x,particles[i].body.position.y,4,4)
    curveVertex(particles[i].body.position.x,particles[i].body.position.y)
  }
  endShape()
  //console.log(particles[1].body.position.x)
  strokeWeight(2)
  // Draw the points
  fill(255);
  noStroke();
  /*
  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    ellipse(pt.x + random(-2.1,mouseX), pt.y+random(-2,2), mouseY);
  }*/
  
  /*
  beginShape()
  noFill();
  stroke(255);
  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let angle = (frameCount / 145) + (i / 20);
    let x = pt.x + 1* sin(angle*15);
    let y = pt.y + 1 * cos(angle*5);
    
    if(i<points.length-2){
      vertex(pt.x,pt.y)
    }
  }
  endShape(CLOSE)
  
 */
  
  beginShape()
  noFill()
  stroke(255);
  strokeWeight(4)
  for (let i = 0; i < pointsW.length; i++) {
    let pt = pointsW[i];
    let angle = (frameCount / 400) + (i / 20);
    let x = pt.x + 1 * sin(angle*15);
    let y = pt.y + 1 * cos(angle*5);
    if(i<pointsW.length){
    curveVertex(x- (width*1.1 - width)/2 -20,y)
    }
    
  }
  endShape(CLOSE)
  
  
  
  //midline vertical
  stroke(255,0,0)
  strokeWeight(0.5)
   //line(0,height/2,width,height/2)
  //line(width/2, 0, width/2,height)
  
  if (mConstraint.body) {
        let pos = mConstraint.body.position;
        let offset = mConstraint.constraint.pointB;
        let m = mConstraint.mouse.position;
        stroke(0, 255, 0);
        //line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }


  
}


function pointsToVertices(points) {
  return points.map(pt => ({ x: pt.x, y: pt.y }));
}


class Boundary {
    constructor(x, y, w, h, a) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        let options = {
            friction: 0,
            restitution: 0.6,
            angle: a,
            isStatic: true
        }
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        Composite.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        noStroke();
        fill(255);
        rect(0, 0, this.w, this.h,10,10,10,10);
        pop();
    }
}




class Particle{
    constructor(x, y, r, fixed) {
        this.x = x;
        this.y = y;
        this.r = r;
        let options = {
            friction: 0,
            restitution: 0.95,
            isStatic: fixed
        }
        this.body = Bodies.circle(this.x, this.y, this.r,  options);
        Composite.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(255)
        fill(127);
        ellipse(0, 0, this.r*2);
        line(0,0,this.r,0);
        pop();
    }
}

function keyPressed() {
  if (key === 'c') {
    // Code to run.
    engine.world.gravity.y = 1.4;
  }
  if(key ==='d'){
    engine.world.gravity.y = -1.4;
  }
   if(key ==='n'){
    engine.world.gravity.y = 0.0;
  }
}