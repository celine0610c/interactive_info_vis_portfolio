registerSketch('clock_plate', function(p) {
  p.setup = function() {
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

    // 2. Calculate Angles
    // Map time to 360 degrees, subtracting 90 to start at 12 o'clock
    let secondAngle = p.map(sc, 0, 60, 0, 360) - 90;
    let minuteAngle = p.map(mn, 0, 60, 0, 360) - 90;
    let hourAngle = p.map(hr % 12, 0, 12, 0, 360) - 90;

    // 3. Draw Hour Hand (The Fork)
    p.push();
    p.rotate(hourAngle);
    drawFork(p, 100);
    p.pop();

    // 4. Draw Minute Hand (The Spoon)
    p.push();
    p.rotate(minuteAngle);
    drawSpoon(p, 130);
    p.pop();

    // 5. Draw Second Hand (A simple toothpick or needle)
    p.push();
    p.rotate(secondAngle);
    p.stroke('#d9534f');
    p.strokeWeight(2);
    p.line(0, 0, 140, 0);
    p.pop();
    
    // Center bolt
    p.fill(150);
    p.noStroke();
    p.circle(0,0, 10);
  };

  function drawFork(p, len) {
    p.stroke(180);
    p.strokeWeight(6);
    p.line(0, 0, len * 0.7, 0); // Handle
    
    // Fork Head
    p.noFill();
    p.strokeCap(p.SQUARE);
    for(let i = -6; i <= 6; i += 4) {
       p.line(len * 0.7, i, len, i); // Prongs
    }
    p.line(len * 0.7, -6, len * 0.7, 6); // Base of prongs
  }

  function drawSpoon(p, len) {
    p.stroke(180);
    p.strokeWeight(6);
    p.line(0, 0, len * 0.6, 0); // Handle
    
    // Spoon Head
    p.fill(220);
    p.noStroke();
    p.ellipse(len * 0.8, 0, 40, 25);
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});