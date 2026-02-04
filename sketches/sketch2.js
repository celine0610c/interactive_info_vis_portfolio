registerSketch('sk2', function(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };

  p.draw = function() {
    p.background('#f4f1ea'); // Tablecloth
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

    // 2. Draw Hour Marks (To make it readable)
    p.stroke(180);
    p.strokeWeight(4);
    for (let i = 0; i < 12; i++) {
      p.push();
      p.rotate(i * 30);
      p.line(115, 0, 135, 0); 
      p.pop();
    }

    // 3. Narrative: Disappearing Food Logic
    // hr 0-11 (AM): Empty plate. hr 12-23 (PM): Food disappears.
    if (hr >= 12) {
      let peasLeft = p.map(hr, 12, 24, 15, 0); // 15 peas at noon, 0 at midnight
      p.fill('#8dc63f'); 
      p.noStroke();
      for (let i = 0; i < peasLeft; i++) {
        let x = 60 + p.cos(i * 24) * 25;
        let y = 60 + p.sin(i * 24) * 25;
        p.circle(x, y, 12);
      }
    }

    // 4. Calculate Angles
    let hourAngle = p.map(hr % 12, 0, 12, 0, 360) - 90;
    let minuteAngle = p.map(mn, 0, 60, 0, 360) - 90;
    let secondAngle = p.map(sc, 0, 60, 0, 360) - 90;

    // 5. Hour Hand: The Fork
    p.push();
    p.rotate(hourAngle);
    drawFork(p, 90);
    p.pop();

    // 6. Minute Hand: The Spoon
    p.push();
    p.rotate(minuteAngle);
    drawSpoon(p, 130);
    p.pop();

    // 7. Second Hand: The Spork
    p.push();
    p.rotate(secondAngle);
    drawSpork(p, 145);
    p.pop();
    
    // Pivot point
    p.fill(150);
    p.noStroke();
    p.circle(0, 0, 10);
  };

  // --- Helpers ---
  function drawFork(p, len) {
    p.stroke(160); p.strokeWeight(6);
    p.line(0, 0, len * 0.7, 0);
    p.noFill();
    for(let i = -5; i <= 5; i += 5) { p.line(len * 0.7, i, len, i); }
    p.line(len * 0.7, -5, len * 0.7, 5);
  }

  function drawSpoon(p, len) {
    p.stroke(160); p.strokeWeight(7);
    p.line(0, 0, len * 0.6, 0);
    p.fill(200); p.noStroke();
    p.ellipse(len * 0.85, 0, 45, 30);
  }

  function drawSpork(p, len) {
    p.stroke('#d9534f'); p.strokeWeight(3);
    p.line(0, 0, len * 0.7, 0);
    p.fill(240); p.strokeWeight(1);
    p.ellipse(len * 0.85, 0, 30, 22);
    p.stroke('#d9534f');
    for(let i = -4; i <= 4; i += 4) { p.line(len * 0.95, i, len * 1.05, i); }
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});