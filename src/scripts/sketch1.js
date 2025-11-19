let points = [];
let gridSize = 40;

let firstTime = true;

function computeDiameterNetwork() {
    document.getElementById("output").textContent = 4;
}

function setup() {
	const s=getCanvasSize();
	let width=s[0];
	let height=s[1];

	const canvas = createCanvas(width, height);


	canvas.parent("canvas-container");
	canvas.style("border-radius", "12px");

	background(240);
	drawPoints();
	updatePointCount();
    drawGrid();
}

function windowResized() {
  // Update canvas size when the container resizes
  const s=getCanvasSize();
  let width=s[0];
  let height=s[1];

  resizeCanvas(width, height);
  redraw();
}

function getCanvasSize() {
    // Get the exact dimensions of the container
    const container = document.getElementById('canvas-container').getBoundingClientRect();
    width = Math.floor(container.width);
    height = 400;
	return [width, height];
}

function drawGrid() {
	const s=getCanvasSize();
	let width=s[0];
	let height=s[1];
	
	strokeWeight(0.3);
	for (let x = 0; x <= width; x += gridSize) {
		line(x, 0, x, height);
	}

	for (let y = 0; y <= height; y += gridSize) {
		line(0, y, width, y);
	}
	strokeWeight(2);
}



function draw() {
	background(240);

    drawGrid();
    drawPoints();
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let x = Math.round(mouseX / gridSize) * gridSize;
        let y = Math.round(mouseY / gridSize) * gridSize;
        ellipse(x, y, 6, 6);
    }
    
    //updateCanvasSize();
    //resizeCanvas(width, height);

}

function drawPoints() {

	for (let pointNumber = 0; pointNumber < points.length - 1; pointNumber++) {
		fill(points[pointNumber].color);
		ellipse(points[pointNumber].x, points[pointNumber].y, points[pointNumber].size, points[pointNumber].size);
        line(points[pointNumber].x, points[pointNumber].y, points[pointNumber + 1].x, points[pointNumber + 1].y)
        
	}

    if (points.length > 0){
    ellipse(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].size, points[points.length - 1].size);
    }
	updatePointCount();
    drawGrid();

}





function mousePressed() {
	if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let x = Math.round(mouseX / gridSize) * gridSize;
        let y = Math.round(mouseY / gridSize) * gridSize;

		points.push({
			x: x,
			y: y,
			size: 6,
			color: color(0, 0, 0),
		});
		drawPoints();
	}
    computeDiameterNetwork();
}

function keyPressed() {
	if (key === "c" || key === "C") {
		points = [];
		drawPoints();
	}
}

function updatePointCount() {
	document.getElementById("point-count").textContent = points.length;
}
