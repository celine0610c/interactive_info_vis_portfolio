registerSketch('sk2', function(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };

  p.draw = function() {
    p.background('#f4f1ea'); 
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

    // 2. Draw Hour Marks (This is the loop for the markings)
    p.stroke(180);
    p.strokeWeight(4);
    for (let i = 0; i < 12; i++) {
      p.push();
      p.rotate(i * 30); // 360 degrees / 12 hours = 30 degrees
      p.line(110, 0, 135, 0); 
      p.pop();
    }

    // 3. Calculate Angles
    let hourAngle = p.map(hr % 12, 0, 12, 0, 360) - 90;
    let minuteAngle = p.map(mn, 0, 60, 0, 360) - 90;
    let secondAngle = p.map(sc, 0, 60, 0, 360) - 90;

    // 4. Hour Hand: The Fork
    p.push();
    p.rotate(hourAngle);
    drawFork(p, 90);
    p.pop();

    // 5. Minute Hand: The Spoon
    p.push();
    p.rotate(minuteAngle);
    drawSpoon(p, 130);
    p.pop();

    // 6. Second Hand: The Spork
    p.push();
    p.rotate(secondAngle);
    drawSpork(p, 145);
    p.pop();
    
    // Center point
    p.fill(150);
    p.noStroke();
    p.circle(0, 0, 10);
  };

  // --- UTENSIL DRAWING HELPERS ---
  // These must be inside the registerSketch block to be recognized

  function drawFork(p, len) {
    p.stroke(160); 
    p.strokeWeight(6);
    p.line(0, 0, len * 0.7, 0); // Handle
    p.noFill();
    for(let i = -5; i <= 5; i += 5) {
       p.line(len * 0.7, i, len, i); // Prongs
    }
    p.line(len * 0.7, -5, len * 0.7, 5);
  }

  function drawSpoon(p, len) {
    p.stroke(160); 
    p.strokeWeight(7);
    p.line(0, 0, len * 0.6, 0); // Handle
    p.fill(200);
    p.noStroke();
    p.ellipse(len * 0.85, 0, 45, 30); // Bowl
  }

  function drawSpork(p, len) {
    p.stroke('#d9534f'); 
    p.strokeWeight(3);
    p.line(0, 0, len * 0.7, 0); // Handle
    p.fill(240);
    p.strokeWeight(1);
    p.ellipse(len * 0.85, 0, 30, 22); // Head
    p.stroke('#d9534f');
    for(let i = -4; i <= 4; i += 4) {
      p.line(len * 0.95, i, len * 1.05, i); // Spork prongs
    }
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});