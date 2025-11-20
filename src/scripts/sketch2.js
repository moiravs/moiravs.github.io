const s2 = (sketch) => {
  let points = [];
  let shortcut = [];
  let gridSize = 40;
  let shortcutmode = false;
  let width;
  let height;

  class Point {
    constructor(x, y, color, size = 6) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = size;
    }
  }

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
      sketch.ellipse(shortcut[pointNumber].x * gridSize, shortcut[pointNumber].y * gridSize, shortcut[pointNumber].size, shortcut[pointNumber].size);
      sketch.line(shortcut[pointNumber].x * gridSize, shortcut[pointNumber].y * gridSize, shortcut[pointNumber + 1].x * gridSize, shortcut[pointNumber + 1].y * gridSize);
    }
  };

  const drawPoints = () => {
    for (let i = 0; i < Math.max(0, points.length - 1); i++) {
      const p = points[i];
      sketch.fill(p.color);
      sketch.ellipse(p.x * gridSize, p.y * gridSize, p.size, p.size);
      sketch.line(p.x * gridSize, p.y * gridSize, points[(i + 1) % points.length].x * gridSize, points[(i + 1) % points.length].y * gridSize);
    }

    sketch.stroke('blue');
    if (points.length > 0) {
      const last = points[points.length - 1];
      sketch.ellipse(last.x * gridSize, last.y * gridSize, last.size, last.size);
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
    const diameterOutput = document.getElementById("output2");
    if (points.length > 1) {
      let diameterPath = calculateperimeter(points, false);
      if (diameterOutput) diameterOutput.textContent = Math.round((diameterPath + Number.EPSILON) * 100) / 100
    } else {
      if (diameterOutput) diameterOutput.textContent = 0;
    }

    const diameterWithShortcutOutput = document.getElementById("output2wshortcut");
    // implement diameter with shortcut
    if (shortcut.length == 2) {
      let chains = splitPathIntoPolygonalChains();
      let diameter = computeDiameterWithShortcut(chains);
      console.log("diameter: ", diameter);
      diameterWithShortcutOutput.textContent = Math.round((diameter + Number.EPSILON) * 100) / 100
;
    }
  };

  const splitPathIntoPolygonalChains = () => {
    // for the moment works only when shortcut is at endpoints
    let chains = [];
    let pointNumber = 0;

    let currentChain = [points[0]];

    // we need to handle the cases when the path goes backward because we need to have the intersections in the order from left to right
    // we can do it with jordan sorting
    while (pointNumber < points.length - 1) {

      let startPoint = points[pointNumber];
      let endPoint = points[pointNumber + 1];

      let intersectionFound = false;

      let intersection = intersectionOfTwoSegments(shortcut[0].x, shortcut[0].y, shortcut[1].x, shortcut[1].y, startPoint.x, startPoint.y, endPoint.x, endPoint.y);

      if (intersection && !(intersection.x == startPoint.x && intersection.y == startPoint.y)) {
        intersectionFound = true;
        currentChain.push(intersection);
        chains.push(currentChain);
        currentChain = [intersection];
        if (!(intersection.x == endPoint.x && intersection.y == endPoint.y)) {
          currentChain.push(endPoint);
        }
        pointNumber++;
      } else {
        currentChain.push(endPoint);
        pointNumber++;
      }
    }

    console.log(chains);
    return chains;
  };

  const computeDiameterWithShortcut = (chains) => {
    let diameter_for_each_chain = [];
    let R_for_each_chain = [];
    let max_alpha = 0;
    let max_alpha_index = 0;
    for (let i = 0; i < chains.length; i++) {
      let chain = chains[i];
      let chain_length = chain.length;
      let p_l = chain[0]; // ppli
      let p_r = chain[chain_length - 1]; // priq
      let s_i = [p_l, p_r]; // segment between pil and pir
      let L = [shortcut[0], p_l];
      let R = euclidian_distance(p_r, shortcut[1]);
      let D = calculateperimeter(chain, true) / 2;


      // FIRST CASE
      R_for_each_chain.push(R);
      diameter_for_each_chain.push(D);

      let alpha = D + R;

      if (alpha > max_alpha) {
        console.log("D: ", D, " R: ", R);
        max_alpha = alpha;
        max_alpha_index = i;
      }

      // SECOND CASE

    }
    return max_alpha;
  };

  const calculateperimeter = (chain, cycle) => {
    let perimeter = 0;
    let chain_length = chain.length;
    if (cycle == false){
      chain_length = chain_length - 1;
    }
    for (let i = 0; i < chain_length; i++) {
      let startPoint = chain[i];
      let endPoint = chain[(i + 1) % chain.length];
      let distance = euclidian_distance(startPoint, endPoint);
      perimeter += distance;
    }
    console.log("perimeter", perimeter);
    return perimeter;
  };

  const euclidian_distance = (startPoint, endPoint) => {
    return Math.sqrt(((startPoint.x - endPoint.x)) ** 2 + ((startPoint.y - endPoint.y)) ** 2);
  };

  // https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  const intersectionOfTwoSegments = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    const determinant = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (determinant === 0) {
      return null;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / determinant;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / determinant;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      const x = x1 + t * (x2 - x1);
      const y = y1 + t * (y2 - y1);
      return { x: x, y: y };
    }

    return null;
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
      let x = Math.round(sketch.mouseX / gridSize) ;
      let y = Math.round(sketch.mouseY / gridSize) ;
      sketch.ellipse(x * gridSize, y * gridSize, 6, 6);
    }
  };

  sketch.mousePressed = () => {
    const s = getCanvasSize();
    const w = s[0];
    const h = s[1];
    if (typeof sketch.mouseX === "undefined") return;
    if (sketch.mouseX >= 0 && sketch.mouseX <= w && sketch.mouseY >= 0 && sketch.mouseY <= h) {
      let x = Math.round(sketch.mouseX / gridSize);
      let y = Math.round(sketch.mouseY / gridSize);
      if (shortcutmode) {
        shortcut.push(new Point(x, y, sketch.color(255, 0, 0)));
        shortcut.sort((a, b) => a.x - b.x);
      } else {
        const existingPoint = points.find(point => point.x === x && point.y === y);
        if (!existingPoint) {
          points.push(new Point(x, y, sketch.color(0, 0, 0)));
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
