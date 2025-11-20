const s2 = (sketch) => {
  let points = [];
  let shortcut = [];
  let gridSize = 40;
  let shortcutmode = false;
  let width;
  let height;

  sketch.setup = () => {
    const s = getCanvasSize();
    const w = s[0];
    const h = s[1];
    const canvas = sketch.createCanvas(w, h);
    if (canvas && canvas.parent) canvas.parent("canvas-container2");
    if (canvas && canvas.style) canvas.style("border-radius", "12px");
    sketch.background(240);
    drawPoints();
    updatePointCount();
    drawGrid();
  };

  sketch.windowResized = () => {
    const s = getCanvasSize();
    const w = s[0];
    const h = s[1];
    sketch.resizeCanvas(w, h);
    sketch.redraw();
  };

  const drawGrid = () => {
   
    const s = getCanvasSize();
    const w = s[0];
    const h = s[1];
    sketch.strokeWeight(0.3);
    for (let x = 0; x <= w; x += gridSize) {
      sketch.line(x, 0, x, h);
    }
    for (let y = 0; y <= h; y += gridSize) {
      sketch.line(0, y, w, y);
    }
    sketch.strokeWeight(2);
  };

  const drawShortCut = () => {
    sketch.stroke('magenta');
    for (let pointNumber = 0; pointNumber < shortcut.length - 1; pointNumber++) {
      sketch.fill(shortcut[pointNumber].color);
      sketch.ellipse(shortcut[pointNumber].x, shortcut[pointNumber].y, shortcut[pointNumber].size, shortcut[pointNumber].size);
      sketch.line(shortcut[pointNumber].x, shortcut[pointNumber].y, shortcut[pointNumber + 1].x, shortcut[pointNumber + 1].y);
    }
  };

  const drawPoints = () => {
    
    for (let i = 0; i < Math.max(0, points.length - 1); i++) {
      const p = points[i];
      sketch.fill(p.color);
      sketch.ellipse(p.x, p.y, p.size, p.size);
      sketch.line(p.x, p.y, points[i + 1 % points.length].x, points[i + 1 % points.length].y);
    }

    sketch.stroke('blue');
    if (points.length > 0) {
      const last = points[points.length - 1];
      sketch.ellipse(last.x, last.y, last.size, last.size);
    }
    sketch.stroke('black');

    updatePointCount();
  };

  const updatePointCount = () => {
    const el = document.getElementById("point-count2");
    if (el) el.textContent = points.length;
  };

  const getCanvasSize = () => {
    const container = document.getElementById("canvas-container2");
    if (!container) return [600, 400];
    const rect = container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = 400;
    return [w, h];
  };

  const computeDiameterNetworkSketch2 = () => {
    const out = document.getElementById("output2");
    if (out) out.textContent = 4;
  };

  sketch.switchShortcutMode = () => {
    if (shortcutmode) {
      shortcutmode = false;
    } else {
      shortcutmode = true;
    }
  };

  sketch.draw = () => {
    const s = getCanvasSize();
    const w = s[0];
    const h = s[1];
    if (width != w && height != h) {
      sketch.resizeCanvas(w, h);
    }

    sketch.background(240);
    drawGrid();
    drawPoints();
	sketch.stroke('magenta');
    drawShortCut();
	sketch.stroke("black");
    if (
      typeof sketch.mouseX !== "undefined" &&
      sketch.mouseX >= 0 &&
      sketch.mouseX <= w &&
      sketch.mouseY >= 0 &&
      sketch.mouseY <= h
    ) {
      let x = Math.round(sketch.mouseX / gridSize) * gridSize;
      let y = Math.round(sketch.mouseY / gridSize) * gridSize;
      sketch.ellipse(x, y, 6, 6);
    }
  };

  sketch.mousePressed = () => {
    const s = getCanvasSize();
    const w = s[0];
    const h = s[1];
    if (typeof sketch.mouseX === "undefined") return;
    if (sketch.mouseX >= 0 && sketch.mouseX <= w && sketch.mouseY >= 0 && sketch.mouseY <= h) {
      let x = Math.round(sketch.mouseX / gridSize) * gridSize;
      let y = Math.round(sketch.mouseY / gridSize) * gridSize;
      if (shortcutmode) {
        shortcut.push({
          x: x,
          y: y,
          size: 6,
          color: sketch.color(255, 0, 0),
        });
      } else {
		const existingPoint = points.find(point => point.x === x && point.y === y);
		if (!existingPoint) {
				points.push({
				x: x,
				y: y,
				size: 6,
				color: sketch.color(0, 0, 0),
				});
			} else {

			}
      }
    }
    computeDiameterNetworkSketch2();
  };

  sketch.keyPressed = () => {
    if (typeof sketch.key === "string" && (sketch.key === "c" || sketch.key === "C")) {
      points = [];
      shortcut = [];
      drawPoints();
      if (shortcutmode) {
        sketch.switchShortcutMode();
      }
    }
  };
};

let sketch2 = new p5(s2, "canvas-container2");
