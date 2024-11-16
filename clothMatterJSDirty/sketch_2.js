// reference: https://openprocessing.org/sketch/1163116/
// modified by ndr3svt to make a neat blueprint with dashed lines and texts

//Module aliases

var Engine = Matter.Engine,
		//Render = Matter.Render,
		World = Matter.World,
		Bodies = Matter.Bodies,
		Constraints = Matter.Constraint,
		Mouse = Matter.Mouse,
        //Body = Matter.Body,
		MouseConstraint = Matter.MouseConstraint;

var engine;
var world;
var particles = [];
var constraints = [];
var mConstraint;


// Imagine a 3x3
// y   0 1 2 <-x
// 0:  0 3 6 	
// 1:  1 4 7 
// 2:  2 5 8 

// i = x + y
// i = x*rowtotal+y

function setup() {
	var canvas = createCanvas(540, 960);
	engine = Engine.create();
	world = engine.world;
	//Engine.run(engine);
    Matter.Runner.run(engine)
	rectMode(CENTER);
	// bar = new Bod(width/2,25,0,20,width-500,90,"rectangle",color(255),true);
	// ground = new Bod(0,height,0,width*2,10,0,"rectangle",color(255),true);
		// var p = new Bod(width/2,100,20,0,0,0,"circle",color(random(0,255),random(0,255),random(0,255)),true);
		// particles.push(p);
	let gridWidth = 33.75
    let gridHeight = 60
	for(let x  = 0; x<17;x++){
		for(let y = 0; y<17; y++){
			var i = (x*17)+y;
			//x,y,size,w,h,boundAng,shape,col,stat
			particles[i]= new Particle(0+(gridWidth*x),0+gridHeight*y,5,0,0,0,"circle",false);
			if(y ==0){
				var options = {
					bodyA: particles[i].body,
					// bodyB: bar.body,
					length: gridWidth,
					stiffness: 0.05,
					pointA: {x:0,y:0},
					pointB: {x:(gridWidth*x),y:gridHeight*y},
				}
				constraints.push(new Constraint(options));
			}else if(y !=0){
				var options = {
					bodyA: particles[i-1].body,
					bodyB: particles[i].body,
					length: gridHeight,
					stiffness: 0.05,
					pointA: {x:0,y:0},
					pointB: {x:0,y:0},
				}
				constraints.push(new Constraint(options));
			}
			 if(x != 0){
				var options = {
					bodyA: particles[i-17].body,
					bodyB: particles[i].body,
					length: gridWidth,
					stiffness: 0.05,
					pointA: {x:0,y:0},
					pointB: {x:0,y:0},
					
				}
				constraints.push(new Constraint(options));
			}
		}
	}
	var canvasmouse = Mouse.create(canvas.elt);
	canvasmouse.pixelRatio = pixelDensity();
	var options2 = {
		mouse:canvasmouse
	}
	mConstraint = MouseConstraint.create(engine, options2);
	World.add(world,mConstraint);
    console.log('constraints length: ' , constraints.length)
    
}

function draw() {
    noCursor();
	background(0,0,255);
  
	fill(0);
	// ground.show();
	// bar.show();
	for(var p of particles){
		//p.show();
      p.showLetter();
	}
  setLineDash([12,6])
  //setLineDash([16,8, 4, 8]); //create the dashed line pattern here
  strokeWeight(2)
	if(mConstraint.body){
		var pos = mConstraint.body.position;
		var offset = mConstraint.constraint.pointB;
		var m =  mConstraint.mouse.position;
		stroke(0,255,0);
        
		line(pos.x+offset.x,pos.y+offset.y,m.x,m.y);
       
	}
    
    beginShape()
    noStroke()
    fill(255,100)
    let ii = 0
    
	for(var c of constraints){
      ii++
      if (c.constraint.bodyA.position.x < 20 && c.constraint.bodyA.position.y< 49){
        // console.log(ii)
                // fill(255,0,0)
        // textSize(12)
       // text(ii, c.constraint.bodyA.position.x, c.constraint.bodyA.position.y)
      }
      // if(ii == 561){
        // console.log(c.constraint.bodyA.position.x)
      // }
		c.show();
      if(c.constraint.bodyB){
         //curveVertex(c.constraint.bodyA.position.x,c.constraint.bodyA.position.y)
         //curveVertex(c.constraint.bodyB.position.x,c.constraint.bodyB.position.y)
      }

	}
    endShape()
    noStroke();
    fill(255,190)
    ellipse(mouseX,mouseY,10,10)
}
function keyPressed(){
	if(keyCode == 32){
		destroyAll();
	}
  
  
}

/* unused function if needed then uses the Body.applyForce method to the specific body assigned */
// function dummyCheckKeys(){
//   if(keyIsDown(RIGHT_ARROW)){
// 		for(p of particles){
// 			Body.applyForce(p.body,{x:p.body.position.x,y:p.body.position.y},{x:.0007,y:-.0005})
// 		}
// 	}else if(keyIsDown(LEFT_ARROW)){
// 		for(p of particles){
// 			Body.applyForce(p.body,{x:p.body.position.x,y:p.body.position.y},{x:-.0007,y:-.0005})
// 		}
// 	}else if(keyIsDown(DOWN_ARROW)){
// 		for(p of particles){
// 			Body.applyForce(p.body,{x:p.body.position.x,y:p.body.position.y},{x:0,y:.0015})
// 		}
// 	}else if(keyIsDown(UP_ARROW)){
// 		for(p of particles){
// 			Body.applyForce(p.body,{x:p.body.position.x,y:p.body.position.y},{x:0,y:-.0015})
// 		}
// 	}
// }

function destroyAll(){
	for(var i = constraints.length-1; i>=0; i--){
		constraints[i].delete();
		constraints.splice(i,1);
	}
}
class Constraint{
	constructor(options){
		this.constraint = Constraints.create(options);
		World.add(world,this.constraint);
      
	}
	show(){
		if(this.constraint.bodyB){
			var posA = this.constraint.bodyA.position;
			var posB = this.constraint.bodyB.position;
		}else if(!this.constraint.bodyB){
			var posA = this.constraint.bodyA.position;
			var posB = this.constraint.pointB;
		}
        
		stroke(255,100);
        noFill()
	    line(posA.x,posA.y,posB.x,posB.y);
	}
	delete(){
		World.remove(world,this.constraint);
	}
}
class Particle{
	constructor(x,y,size,w,h,boundAng,shape,isStatic){
		this.size = size;
		this.w= w;
		this.h = h;
		this.shape = shape;
		this.static = isStatic;
		
		let options = {
			isStatic: this.static,
			//angle: radians(boundAng),
			friction:0,
		}
		if(this.shape == "rectangle"){
			this.body = Bodies.rectangle(x,y,this.w,this.h, options);
		}if(this.shape == "circle"){
			this.body = Bodies.circle(x,y,this.size, options);
		}
		World.add(world,this.body);
        let letters = ['S', 'O', 'O', 'F', 'T']
        let letterIndex = int(random(0,5));
        this.letter = letters[letterIndex]
	}
  
    showLetter(){
      //translate(pos.x,pos.y);
      var pos = this.body.position;
      noStroke()
        fill(255)
        textSize(22)
        textAlign(CENTER,CENTER) 
        
        //console.log(letterIndex) 
       text(this.letter, pos.x, pos.y )
    }
	show(){
		var pos = this.body.position;
		var angle = this.body.angle;
	
		push();
		translate(pos.x,pos.y);
		rotate(angle);
		if(this.shape == "rectangle"){
				rect(0,0,this.w,this.h);
			}if(this.shape == "circle"){
				ellipse(0,0,this.size*2,this.size*2);
				rect(0,0,this.size*1.25,this.size*1.25);
			}	
		pop();
	}
	// ifOffScreen(){
	// 	return (this.body.position.y > height+100);
	// }
	// removeFromWorld(){
	// 	World.remove(world,this.body);
	// }
	
}


// for dashing the lines : this uses the native dash rendering for vector lines 
// reference:https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
function setLineDash(list) {
  drawingContext.setLineDash(list);
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
    engine.world.gravity.y = 0;
  }
}
