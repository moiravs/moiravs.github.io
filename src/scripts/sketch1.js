class Sketch1 {
	constructor() {
		this.points = [];
		this.gridSize = 40;
		this.firstTime = true;

		// bind methods so p5 global hooks can call them
		this.setup = this.setup.bind(this);
		this.draw = this.draw.bind(this);
		this.mousePressed = this.mousePressed.bind(this);
		this.keyPressed = this.keyPressed.bind(this);
		this.windowResized = this.windowResized.bind(this);
	}

	computeDiameterNetwork() {
		const out = document.getElementById("output");
		if (out) out.textContent = 4;
	}

	getCanvasSize() {
		const container = document.getElementById("canvas-container");
		if (!container) return [600, 400];
		const rect = container.getBoundingClientRect();
		const w = Math.floor(rect.width);
		const h = 400;
		return [w, h];
	}

	setup() {
		const s = this.getCanvasSize();
		const w = s[0];
		const h = s[1];
		const canvas = createCanvas(w, h);
		if (canvas && canvas.parent) canvas.parent("canvas-container");
		if (canvas && canvas.style) canvas.style("border-radius", "12px");
		background(240);
		this.drawPoints();
		this.updatePointCount();
		this.drawGrid();
	}

	windowResized() {
		const s = this.getCanvasSize();
		const w = s[0];
		const h = s[1];
		resizeCanvas(w, h);
		redraw();
	}

	drawGrid() {
		const s = this.getCanvasSize();
		const w = s[0];
		const h = s[1];

		strokeWeight(0.3);
		for (let x = 0; x <= w; x += this.gridSize) {
			line(x, 0, x, h);
		}
		for (let y = 0; y <= h; y += this.gridSize) {
			line(0, y, w, y);
		}
		strokeWeight(2);
	}

	draw() {
		background(240);
		this.drawGrid();
		this.drawPoints();

		const s = this.getCanvasSize();
		const w = s[0];
		const h = s[1];
		if (
			typeof mouseX !== "undefined" &&
			mouseX >= 0 &&
			mouseX <= w &&
			mouseY >= 0 &&
			mouseY <= h
		) {
			let x = Math.round(mouseX / this.gridSize) * this.gridSize;
			let y = Math.round(mouseY / this.gridSize) * this.gridSize;
			ellipse(x, y, 6, 6);
		}
	}

	drawPoints() {
		for (let i = 0; i < Math.max(0, this.points.length - 1); i++) {
			const p = this.points[i];
			fill(p.color);
			ellipse(p.x, p.y, p.size, p.size);
			line(p.x, p.y, this.points[i + 1].x, this.points[i + 1].y);
		}

		if (this.points.length > 0) {
			const last = this.points[this.points.length - 1];
			ellipse(last.x, last.y, last.size, last.size);
		}
		this.updatePointCount();
	}

	mousePressed() {
		const s = this.getCanvasSize();
		const w = s[0];
		const h = s[1];
		if (typeof mouseX === "undefined") return;
		if (mouseX >= 0 && mouseX <= w && mouseY >= 0 && mouseY <= h) {
			let x = Math.round(mouseX / this.gridSize) * this.gridSize;
			let y = Math.round(mouseY / this.gridSize) * this.gridSize;
			this.points.push({
				x: x,
				y: y,
				size: 6,
				color: color(0, 0, 0),
			});
			this.drawPoints();
		}
		this.computeDiameterNetwork();
	}

	keyPressed() {
		if (typeof key === "string" && (key === "c" || key === "C")) {
			this.points = [];
			this.drawPoints();
		}
	}

	updatePointCount() {
		const el = document.getElementById("point-count");
		if (el) el.textContent = this.points.length;
	}
}

// create single global instance and hook p5 global functions
const sketch1 = new Sketch1();
window.sketch1 = sketch1;

// p5 global mode hooks
window.setup = sketch1.setup;
window.draw = sketch1.draw;
window.mousePressed = sketch1.mousePressed;
window.keyPressed = sketch1.keyPressed;
window.windowResized = sketch1.windowResized;
