let points = [];

function setup() {
    const canvas = createCanvas(windowWidth / 2, windowHeight /2);
    canvas.parent('canvas-container');
    canvas.style("border-radius", "12px")
    
    background(240);
    drawPoints();
    updatePointCount();
}

function draw() {
}

function drawPoints() {
    background(240);
    
    for (let point of points) {
        fill(point.color);
        noStroke();
        ellipse(point.x, point.y, point.size, point.size);
    }
    
    updatePointCount();
}

function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        points.push({
            x: mouseX,
            y: mouseY,
            size: 5,
            color: color(0, 0, 0)
        });
        drawPoints();
    }
}

function keyPressed() {
    if (key === 'c' || key === 'C') {
        points = [];
        drawPoints();
    }
}

function updatePointCount() {
    document.getElementById('point-count').textContent = points.length;
}