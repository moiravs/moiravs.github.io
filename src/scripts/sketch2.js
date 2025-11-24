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

  sketch.computeOptimalHorizontalShortcut = () => {
    
  }

  sketch.computeOptimalShortcut = () => {
    shortcut[0] = points[0];
    shortcut[1] = points[points.length - 1];

    computeDiameterNetworkSketch2();
  };

  const logError = (error) => {
    const errorOutput = document.getElementById("error");
    errorOutput.textContent = error;
  }

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
      // let midX = (p.x * gridSize + points[(i + 1) % points.length].x * gridSize) / 2;
      // let midY = (p.y * gridSize + points[(i + 1) % points.length].y * gridSize) / 2;

      // let angle = Math.atan2(p.y * gridSize - points[(i + 1) % points.length].y * gridSize, p.x * gridSize - points[(i + 1) % points.length].x * gridSize);
      // sketch.textSize(14);
      // sketch.textAlign(sketch.CENTER, sketch.CENTER);

      // sketch.push();

      // sketch.translate(midX, midY + 20);

      // sketch.rotate(angle);

      // sketch.text("1.3", 0, 0); 

      // sketch.pop();

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

  function compareChains(chaina, chainb) {
  return chaina.x - chainb.x;
}

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
      console.log(chains)
      // sort the cycles
      chains.sort(compareChains)
      let diameter = computeDiameterWithShortcut(chains);
      diameterWithShortcutOutput.textContent = Math.round((diameter + Number.EPSILON) * 100) / 100;

    } else {
      diameterWithShortcutOutput.textContent = "N/A";
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

      let twosegmentsame = checkiftwosegmentarethesame
        (shortcut[0].x, shortcut[0].y, shortcut[1].x, shortcut[1].y, startPoint.x, startPoint.y, endPoint.x, endPoint.y)

      if (twosegmentsame) {
        pointNumber++;
        currentChain.pop();
        currentChain.push(endPoint)
        continue;
      }
      


      if (intersection && !(intersection.x == startPoint.x && intersection.y == startPoint.y)) {
        intersectionFound = true;
        currentChain.push(intersection);
        if (currentChain[0].x > currentChain[currentChain.length - 1].x)
          currentChain.reverse()
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
    if (currentChain.length > 1){
      if (currentChain[0].x > currentChain[currentChain.length - 1].x)
        currentChain.reverse()
      chains.push(currentChain);
    }

    return chains;
  };

  const checkiftwosegmentarethesame = (line1x1,
    line1y1,
    line1x2,
    line1y2,
    
    line2x1,
    line2y1,
    line2x2,
    line2y2
  ) => {
 
    // console.log("line1x1" , line1x1, "line1y1", line1y1, "line1x2", line1x2, "line1y2", line1y2)
    // console.log("line2x1" , line2x1, "line2y1", line2y1, "line2x2", line2x2, "line2y2", line2y2)

    if (line1x2 - line1x1)
      line1m = (line1y2 - line1y1) / (line1x2 - line1x1);
    else
      line1m = 0
    line1d = line1y1 - line1m * line1x1;

    if (line2x2 - line2x1 != 0)
      line2m = (line2y2 - line2y1) / (line2x2 - line2x1);
    else 
      line2m = 0
    line2d = line2y1 - line2m * line2x1;


    return line1m == line2m && line1d == line2d && ((line1y2 - line1y1) ==  (line2y2 - line2y1))
  }

  const computeDiameterWithShortcut = (chains) => {
    let max_alpha = 0;
    let max_alpha_index = 0;
    for (let i = 0; i < chains.length - 1; i++) {
      let chain = chains[i];
      let p_l = chain[0]; // priq
      let p_r = chain[ chain.length - 1]; // priq
      let Li = euclidian_distance(p_l, shortcut[0]);
      let Ri = euclidian_distance(p_r, shortcut[1]);
      let Di = calculateperimeter(chain, true) / 2;
      let Ci = calculateperimeter(chain, false);

      // handle degenerate case
      if (i == 0 && p_l.y != shortcut[0].y && p_l.x != shortcut[0].x){
        console.log("here2")

        Dj = Cj // real perimeter
        Rj = Lj
        sj = 0
      }
          
      let j = i + 1;


      // FIRST CASE: Disjoint chain
      
      console.log("i: ", i)
      if ((j > chains.length - 1) || ( chains[j][0].x >= chain[chain.length - 1].x))  {
        console.log("disjoint chain")
                
        
        let second_chain = chains[j];

        let p_r2 = second_chain[second_chain.length - 1]; // priq
        let p_l2 = second_chain[0]; // priq

        let Lj = euclidian_distance(p_l2, shortcut[0]);
        let Rj = euclidian_distance(p_r2, shortcut[1]);
        let Cj = calculateperimeter(second_chain, false);
        let Dj = calculateperimeter(second_chain, true) / 2;

        let sj = euclidian_distance(p_l2, p_r2)

        // handle degenerate case
        if (j == chains.length - 1 && !(p_r2.y == shortcut[1].y && p_r2.x == shortcut[1].x)){
          console.log("here")
          Dj = Cj // real perimeter
          Rj = euclidian_distance(p_l2, shortcut[1]);
          sj = 0
        }
        console.log("Ri: ", Ri, " Rj: ", Rj, "sj: ", sj )

        let alpha = Di + Ri - Rj - sj + Dj;

        if (alpha > max_alpha) {
          max_alpha = alpha;
          max_alpha_index = i;
        }
      }

      // SECOND CASE: Nested chain

      while  (j < chains.length && chains[j][0].x < chain[chain.length - 1].x && chains[j][chains[j].length - 1].x < chain[chain.length - 1].x ){
        console.log("nested chain")
        
        let second_chain = chains[j]

        let p_l2 = second_chain[0]; // priq
        let p_r2 = second_chain[second_chain.length - 1]; // priq

        let Lj = euclidian_distance(p_l2, shortcut[0]);
        let Rj = euclidian_distance(p_r2, shortcut[1]);
        let Cj = calculateperimeter(second_chain, false);

        let beta = Cj + Lj + Rj;
        let result = (Ci - Li - Ri + beta) / 2


        if (result > max_alpha) {
          max_alpha = result;
          max_alpha_index = i;
        }
      j++;

    }

    // THREE CASE: Overlapping case
      while  (j < chains.length && chains[j][0].x < chain[chain.length - 1].x && chains[j][chains[j].length - 1].x > chain[chain.length - 1].x ){
        console.log("overlapping chain")
        
        let second_chain = chains[j]

        let p_r2 = second_chain[second_chain.length - 1]; // priq
        let p_l2 = second_chain[0]; // priq

        let Lj = euclidian_distance(p_l2, shortcut[0]);
        let Rj = euclidian_distance(p_r2, shortcut[1]);
        let Cj = calculateperimeter(second_chain, false);

        let gamma = Cj  + Lj - Rj;

        let result = (Ci - Li + Ri + gamma) / 2
        if (result > max_alpha) {
          max_alpha = result;
          max_alpha_index = i;
        }
      j++;
       }
      i = j;

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
      if (shortcutmode && shortcut.length < 2) {
        if (shortcut.length == 1){
          if (shortcut[0].y != y) { // not horizontal shortcut
            logError("Computed optimal shortcut is not horizontal");
            return;
          }
        }

        shortcut.push(new Point(x, y, sketch.color(255, 0, 0)));
        shortcut.sort((a, b) => a.x - b.x);
      } else {
        const existingPoint = points.find(point => point.x === x && point.y === y);
        if (!existingPoint) {
          for (let i = 0; i < points.length - 2; i++) {
            if (intersectionOfTwoSegments(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, points[points.length - 1].x, points[points.length - 1].y, x, y)) {
              logError("New segment crosses another segment")
              return ;
            }
          }
          points.push(new Point(x, y, sketch.color(0, 0, 0)));
          logError("");
        } else {
          logError("Point already exists");
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
    if (sketch.key === "z"){

      points.pop();
      computeDiameterNetworkSketch2(); // reset diameter

    }
  };
};

let sketch2 = new p5(s2, "canvas-container2");
