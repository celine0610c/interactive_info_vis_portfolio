registerSketch('sk2', function(p) {
  p.setup = function() {
    // Matches the container in your index.html
    let container = p.select('#sketch-container-sk2');
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };

  p.draw = function() {
    p.background('#f4f1ea'); // Tablecloth color
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

    // 1. Draw the Plate
    p.stroke(200);
    p.strokeWeight(2);
    p.fill(255);
    p.circle(0, 0, 350); // Outer rim
    p.circle(0, 0, 280); // Inner rim

    // 2. Calculate Angles (-90 to start at 12 o'clock)
    let hourAngle = p.map(hr % 12, 0, 12, 0, 360) - 90;
    let minuteAngle = p.map(mn, 0, 60, 0, 360) - 90;
    let secondAngle = p.map(sc, 0, 60, 0, 360) - 90;

    // 3. Hour Hand: The Fork
    p.push();
    p.rotate(hourAngle);
    drawFork(p, 100);
    p.pop();

    // 4. Minute Hand: The Spoon
    p.push();
    p.rotate(minuteAngle);
    drawSpoon(p, 130);
    p.pop();

    // 5. Second Hand: The Spork (based on your sketch!)
    p.push();
    p.rotate(secondAngle);
    drawSpork(p, 145);
    p.pop();
    
    // Center bolt (the pivot)
    p.fill(150);
    p.noStroke();
    p.circle(0, 0, 12);
  };

  // --- Utensil Drawing Helpers ---

  function drawFork(p, len) {
    p.stroke(180);
    p.strokeWeight(6);
    p.line(0, 0, len * 0.7, 0); // Handle
    // Fork Head
    p.noFill();
    for(let i = -6; i <= 6; i += 4) {
       p.line(len * 0.7, i, len, i); // Prongs
    }
    p.line(len * 0.7, -6, len * 0.7, 6);
  }

  function drawSpoon(p, len) {
    p.stroke(180);
    p.strokeWeight(7);
    p.line(0, 0, len * 0.6, 0); // Handle
    p.fill(220);
    p.noStroke();
    p.ellipse(len * 0.85, 0, 45, 30); // Spoon Bowl
  }

  function drawSpork(p, len) {
    p.stroke('#d9534f'); // Reddish color for the second hand
    p.strokeWeight(3);
    p.line(0, 0, len * 0.7, 0); // Handle
    
    // Spork Head
    p.fill(240);
    p.strokeWeight(1.5);
    p.ellipse(len * 0.85, 0, 35, 25); // Spoon base
    // Tiny prongs
    for(let i = -4; i <= 4; i += 4) {
      p.line(len * 0.95, i, len * 1.05, i);
    }
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});