registerSketch('sk3', function(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.noStroke();
  };

  p.draw = function() {
    p.background(30);
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

    // --- 1. FLY COUNT (Hours) ---
    // 1 fly per hour (1-12)
    let flyCount = hr % 12;
    if (flyCount === 0) flyCount = 12;

    // --- 2. MOLD PROGRESS (Minutes) ---
    let moldDegrees = p.map(mn + sc/60, 0, 60, 0, 360);

    // --- DRAW CHEESE ---
    let radius = p.min(p.width, p.height) * 0.35;
    let rindThickness = 20;

    let freshColor = p.color(252, 209, 42); // Bright Cheddar
    let moldColor  = p.color(76, 111, 47);  // Swamp Green
    let rindColor  = p.color(200, 140, 30); // Wax Rind

    // A. Draw Rind
    p.fill(rindColor);
    p.circle(0, 0, (radius + rindThickness) * 2);

    // B. Draw Cheese Body
    p.push();
    p.rotate(-90); // 0 degrees at top

    // Layer 1: Fresh Cheese Base
    p.fill(freshColor);
    p.circle(0, 0, radius * 2);

    // Layer 2: Moldy Wedge
    if (moldDegrees > 0) {
      p.fill(moldColor);
      p.arc(0, 0, radius * 2, radius * 2, 0, moldDegrees, p.PIE);
    }

    // Layer 3: Holes
    p.randomSeed(12345); 
    let numHoles = 45;

    for (let i = 0; i < numHoles; i++) {
      let hAngle = p.random(0, 360);
      let hDist = p.random(radius * 0.2, radius * 0.85);
      let hSize = p.random(10, 30);
      let hx = p.cos(hAngle) * hDist;
      let hy = p.sin(hAngle) * hDist;

      // Color logic
      let isMoldy = (hAngle < moldDegrees);
      let baseColor = isMoldy ? moldColor : freshColor;
      
      p.fill(
        p.red(baseColor) * 0.75,
        p.green(baseColor) * 0.75,
        p.blue(baseColor) * 0.75
      );
      p.circle(hx, hy, hSize);
    }
    p.pop(); 


    // --- DRAW IDLE FLIES ---
    p.fill(0);
    p.noStroke();

    for (let i = 0; i < flyCount; i++) {
      // 1. Assign a fixed "Home" Angle for each fly
      // This distributes them evenly around the clock
      let baseAngle = (i * 360) / flyCount - 90; 

      // 2. Calculate Drift (Slow Movement)
      // We use noise to make them gently float around their home angle
      let t = p.frameCount * 0.02 + (i * 100);
      let driftAngle = p.map(p.noise(t), 0, 1, -15, 15); // +/- 15 degrees
      let driftDist  = p.map(p.noise(t + 50), 0, 1, -10, 10); // In and out breathing

      // 3. Calculate Buzz (Fast Jitter)
      let buzzX = p.random(-2, 2);
      let buzzY = p.random(-2, 2);

      // Combine positions
      let finalAngle = baseAngle + driftAngle;
      let finalDist = (radius + 40) + driftDist; // Hover slightly outside rind

      let fx = p.cos(finalAngle) * finalDist + buzzX;
      let fy = p.sin(finalAngle) * finalDist + buzzY;

      p.push();
      p.translate(fx, fy);
      
      // Rotate fly to face the center (plus some jitter)
      let facingAngle = finalAngle + 90 + p.random(-10, 10);
      p.rotate(facingAngle);

      // Fly Body
      p.fill(30);
      p.ellipse(0, 0, 10, 14);
      
      // Fly Wings
      p.fill(255, 100);
      p.ellipse(-6, 2, 8, 5);
      p.ellipse(6, 2, 8, 5);
      p.pop();
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});