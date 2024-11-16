// defines all elements from matter js engine
var Engine = Matter.Engine,
  //Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraints = Matter.Constraint, // this is what counts for the particle system
  Mouse = Matter.Mouse,
  Body = Matter.Body,
  MouseConstraint = Matter.MouseConstraint;

var engine;
var world;
var particles = [];
var constraints = [];
var mConstraint;
let amntRowsCols = 16
function setup(){

   var canvas = createCanvas(540, 960);
   engine = Engine.create();
   world = engine.world;
   
   Matter.Runner.run(engine)

    // building up the particles and particle system
     // if wanting different amount of rows than cols just make separate new variables amntRows and amntCols
  
  // Building up the particles and particle system
    
    let gridWidth = 540 / 16;
    let gridHeight = 960 / 16;

    for (let y = 0; y <= amntRowsCols; y++) {
        for (let x = 0; x <= amntRowsCols; x++) {
            var isStatic = (y === 0); // Fix particles in the first row
            var i = (y * (amntRowsCols + 1)) + x; // Correct the index calculation

            particles[i] = new Particle(0 + (gridWidth * x), 0 + gridHeight * y, 5, 0, 0, isStatic);

            // Debug output to confirm static particles
            if (y === 0) {
                // console.log(`Static particle at (${x}, ${y}) with index ${i}`);
            }

            // Add horizontal constraints
            if (x > 0) {
                var options = {
                    bodyA: particles[i - 1].body, // Connect to the previous particle in the row
                    bodyB: particles[i].body,
                    length: gridWidth,
                    stiffness: 0.95,
                    pointA: { x: 0, y: 0 },
                    pointB: { x: 0, y: 0 }
                };
                constraints.push(new Constraint(options));
            }

            // Add vertical constraints
            if (y > 0) {
                var options = {
                    bodyA: particles[i - (amntRowsCols + 1)].body, // Connect to the particle directly above
                    bodyB: particles[i].body,
                    length: gridHeight,
                    stiffness: 0.95,
                    pointA: { x: 0, y: 0 },
                    pointB: { x: 0, y: 0 }
                };
                constraints.push(new Constraint(options));
            }
        }
    }
  
//     let gridWidth = 540/16
//     let gridHeight = 960/16
// 	for(let x  = 0; x<=amntRowsCols;x++){
// 		for(let y = 0; y<=amntRowsCols; y++){
// 			var i = (x*(amntRowsCols+1))+y;
          
//             particles[i]= new Particle(0+(gridWidth*x),0+gridHeight*y,5,0,0,false);
// 			if(y ==0){
// 				var options = {
// 					bodyA: particles[i].body,
// 					// bodyB: bar.body,
// 					length: gridWidth,
// 					stiffness: 0.05,
// 					pointA: {x:0,y:0},
// 					pointB: {x:(gridWidth*x),y:gridHeight*y},
// 				}
// 				constraints.push(new Constraint(options));
// 			}else if(y !=0){
// 				var options = {
// 					bodyA: particles[i-1].body,
// 					bodyB: particles[i].body,
// 					length: gridHeight,
// 					stiffness: 0.05,
// 					pointA: {x:0,y:0},
// 					pointB: {x:0,y:0},
// 				}
// 				constraints.push(new Constraint(options));
// 			}
// 			 if(x != 0){
// 				var options = {
// 					bodyA: particles[i-(amntRowsCols+1)].body,
// 					bodyB: particles[i].body,
// 					length: gridWidth,
// 					stiffness: 0.05,
// 					pointA: {x:0,y:0},
// 					pointB: {x:0,y:0},
					
// 				}
// 				constraints.push(new Constraint(options));
// 			}
//         }
//     }
  
   // everything related to the mouse and interactivity
     var canvasmouse = Mouse.create(canvas.elt);
	canvasmouse.pixelRatio = pixelDensity();
	var options2 = {
		mouse:canvasmouse,
          constraint: {
            length:25,
            stiffness: 0.2, // Adjust this value to make interaction smoother
            angularStiffness: 0, // Adjust as needed for rotational interaction
            render: {
                visible: true // Keep this false if you don't want the constraint to be drawn
            }
        }
	}
    
	mConstraint = MouseConstraint.create(engine, options2);
	World.add(world,mConstraint);
}
function draw(){
    noCursor()
    background(255);
    
  
    fill(0,0,255)
    textSize(40)
    textAlign(CENTER, CENTER)
    text('behind the curtains',width/2,height/2)
  
  // Draw polygon mesh including the first row
    noStroke();
    fill(255); // Adjust color as needed
    for (let y = 0; y < amntRowsCols; y++) {
        for (let x = 0; x < amntRowsCols; x++) {
            let i = (x * (amntRowsCols + 1)) + y;
            
            // Ensure that we stay within bounds and include the first row
            if (x < amntRowsCols && y < amntRowsCols) {
                // Top-left triangle
                beginShape();
                vertex(particles[i].body.position.x, particles[i].body.position.y);
                vertex(particles[i + 1].body.position.x, particles[i + 1].body.position.y);
                vertex(particles[i + amntRowsCols + 2].body.position.x, particles[i + amntRowsCols + 2].body.position.y);
                endShape(CLOSE);

                // Bottom-right triangle
                beginShape();
                vertex(particles[i].body.position.x, particles[i].body.position.y);
                vertex(particles[i + amntRowsCols + 2].body.position.x, particles[i + amntRowsCols + 2].body.position.y);
                vertex(particles[i + amntRowsCols + 1].body.position.x, particles[i + amntRowsCols + 1].body.position.y);
                endShape(CLOSE);
            }
        }
    }
  
  for(var p of particles){
		//p.show();
      p.show();
	}
    
    strokeWeight(2)
	if(mConstraint.body){
		var pos = mConstraint.body.position;
		var offset = mConstraint.constraint.pointB;
		var m =  mConstraint.mouse.position;
		stroke(0,255,0);
        
		line(pos.x+offset.x,pos.y+offset.y,m.x,m.y);
       
	}
    // set line dash expects an array you can add multiple segments 
    //eg [12,6,6,6] 12points line 6points 12points gap 6points line
    setLineDash([12,6,6,6])
    for(var c of constraints){
      c.show();
    }
    
  
    noStroke()
    fill(0,0,255,100)
  ellipse(mouseX,mouseY,10,10)
}

class Constraint{
	constructor(options){
		this.constraint = Constraints.create(options);
		World.add(world,this.constraint);
      
	}
	show(){
        let posA
        let posB
		if(this.constraint.bodyB){
			 posA = this.constraint.bodyA.position;
			 posB = this.constraint.bodyB.position;
		}else if(!this.constraint.bodyB){
			 posA = this.constraint.bodyA.position;
			 posB = this.constraint.pointB;
		}
		stroke(0,100);
        strokeWeight(1)
        noFill()
	    line(posA.x,posA.y,posB.x,posB.y);
        
      // fill(255,0,0)
      // ellipse(posB.x,posB.y,5,5)
	}
	delete(){
		World.remove(world,this.constraint);
	}
}

class Particle{
  constructor(x,y,particleSize,w,h,isStatic){
		this.size = particleSize;
		this.w= w;
		this.h = h;
		
		this.static = isStatic;
		
		let options = {
			isStatic: this.static,
			friction:0,
		}
		this.body = Bodies.circle(x,y,this.size, options);
		World.add(world,this.body);
	}
  
  show(){
    
    let pos = this.body.position;
    let angle = this.body.angle;
    noStroke()
    fill(0)
    ellipse(pos.x,pos.y,8,8)
    push()
    translate(pos.x,pos.y)
    rotate(angle)
    strokeWeight(0.5)
    stroke(255,0,0)
    line(-10,0,10,0)
    stroke(0,0,255)
    line(0,-10,0,10)
    pop()
	
  }
}

function keyPressed() {
  if (key === 'c') {
    // Code to run.
    engine.world.gravity.y = world.gravity.y+0.4 ;
  }
  if(key ==='d'){
    engine.world.gravity.y = engine.world.gravity.y-0.4;
  
  }
  if(key ==='n'){
    engine.world.gravity.y = 0;
  }
}



// for dashing the lines : this uses the native dash rendering for vector lines 
// reference:https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
function setLineDash(list) {
  drawingContext.setLineDash(list);
}

