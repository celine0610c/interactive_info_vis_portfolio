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

    // 2. Draw Time Marks (Ticks)
    drawMarks(p);

    // 3. Calculate Angles
    let hourAngle = p.map(hr % 12, 0, 12, 0, 360) - 90;
    let minuteAngle = p.map(mn, 0, 60, 0, 360) - 90;
    let secondAngle = p.map(sc, 0, 60, 0, 360) - 90;

    // 4. Hour Hand: The Fork
    p.push();
    p.rotate(hourAngle);
    drawFork(p, 100);
    p.pop();

    // 5. Minute Hand: The Spoon
    p.push();
    p.rotate(minuteAngle);
    drawSpoon(p, 135);
    p.pop();

    // 6. Second Hand: The Spork
    p.push();
    p.rotate(secondAngle);
    drawSpork(p, 150);
    p.pop();
    
    // Center pivot
    p.fill(150);
    p.noStroke();
    p.circle(0, 0, 12);
  };

  function drawMarks(p) {
    p.stroke(180);
    p.strokeWeight(4);
    for (let i = 0; i < 12; i++) {
      let angle = i * 30; // 360 degrees / 12 hours = 30 degrees
      p.push();
      p.rotate(angle);
      // Draw a small line at the edge of the inner circle
      p.line(120, 0, 140, 0); 
      p.pop();
    }
  }

  function drawFork(p, len) {
    p.stroke(180); p.strokeWeight(6);
    p.line(0, 0, len * 0.7, 0);
    p.noFill();
    for(let i = -6; i <= 6; i += 4) { p.line(len * 0.7, i, len, i); }
    p.line(len * 0.7, -6, len * 0.7, 6);
  }

  function drawSpoon(p, len) {
    p.stroke(180); p.strokeWeight(7);
    p.line(0, 0, len * 0.6, 0);
    p.fill(220); p.noStroke();
    p.ellipse(len * 0.85, 0, 45, 30);
  }

  function drawSpork(p, len) {
    p.stroke('#d9534f'); p.strokeWeight(3);
    p.line(0, 0, len * 0.7, 0);
    p.fill(240); p.strokeWeight(1.5);
    p.ellipse(len * 0.85, 0, 35, 25);
    for(let i = -4; i <= 4; i += 4) { p.line(len * 0.95, i, len * 1.05, i); }
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});