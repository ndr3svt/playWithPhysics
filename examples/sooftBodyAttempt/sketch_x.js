let img;

// Load the image.
function preload() {
  img = loadImage('/assets/sooft_creature.png');
}

function setup() {
  createCanvas(100, 100);

  background(50);

  // Draw the image 50x50.
  image(img, 0, 0, 50, 50);

  describe('an image of a sooft creature ' ) ; 