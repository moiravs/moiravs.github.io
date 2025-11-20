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
	if (points.length > 1) {
    if (out) out.textContent = points.length - 1;

	} else {
		 if (out) out.textContent = 0;
	}
	// implement diameter with shortcut

  };

  const splitPathIntoPolygonalChains = () =>{
	let chains = [];
	let pointNumber = 0;
	currentChain = [points[0]];
	while (pointNumber < points.length) {
		let startPoint = points[pointNumber]
		let endPoint = points[pointNumber + 1]
		let point = intersectionOfTwoSegments(points)
		if (point == null){
			currentChain.push(point)
			pointNumber++;

		} else {
			// create new chain each time a line crosses the shortcut.
			currentChain.push(endPoint);
			chains.push(currentChain);
			currentChain = [];
		}
	

	}
  }



	// https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
	const intersectionOfTwoSegments = (x1, y1, x2, y2, x3, y3, x4, y4) =>  {
	const determinant = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	if (determinant === 0) {
		return null;
	}

	const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / determinant;
	const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / determinant;

	if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
		const x = x1 + t * (x2 - x1);
		const y = y1 + t * (y2 - y1);
		return (x, y);
	}

	return null;
	}

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
      if (shortcutmode) {
        sketch.switchShortcutMode();
      }
	  computeDiameterNetworkSketch2(); // reset diameter
    }
  };
};

let sketch2 = new p5(s2, "canvas-container2");
