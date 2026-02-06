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
    // The cheese represents 1 hour (60 minutes).
    // We map the current minute + second to 360 degrees.
    let moldDegrees = p.map(mn + sc/60, 0, 60, 0, 360);

    // --- DRAW CHEESE ---
    let radius = p.min(p.width, p.height) * 0.35;
    let rindThickness = 20;

    // Colors
    let freshColor = p.color(252, 209, 42); // Bright Cheddar
    let moldColor  = p.color(76, 111, 47);  // Swamp Green
    let rindColor  = p.color(200, 140, 30); // Wax Rind

    // A. Draw Rind
    p.fill(rindColor);
    p.circle(0, 0, (radius + rindThickness) * 2);

    // B. Draw Cheese Body
    // We rotate -90 so 0 degrees is at the top (12 o'clock)
    p.push();
    p.rotate(-90);

    // Layer 1: Fresh Cheese Base (Full Circle)
    p.fill(freshColor);
    p.circle(0, 0, radius * 2);

    // Layer 2: Moldy Wedge (Arc)
    // Draws over the fresh cheese based on minutes passed
    if (moldDegrees > 0) {
      p.fill(moldColor);
      p.arc(0, 0, radius * 2, radius * 2, 0, moldDegrees, p.PIE);
    }

    // Layer 3: Holes
    // We use a constant randomSeed so holes stay in the same place
    p.randomSeed(12345); 
    let numHoles = 45;

    for (let i = 0; i < numHoles; i++) {
      let hAngle = p.random(0, 360);
      let hDist = p.random(radius * 0.2, radius * 0.85);
      let hSize = p.random(10, 30);

      // Determine Position
      let hx = p.cos(hAngle) * hDist;
      let hy = p.sin(hAngle) * hDist;

      // Determine Color
      // Since we are rotated -90, the angle 0 is at the top.
      // We just check if the hole's angle is less than the current moldDegrees.
      let isMoldy = (hAngle < moldDegrees);
      
      let baseColor = isMoldy ? moldColor : freshColor;
      
      // Draw hole slightly darker than the surface it sits on
      p.fill(
        p.red(baseColor) * 0.75,
        p.green(baseColor) * 0.75,
        p.blue(baseColor) * 0.75
      );
      
      p.circle(hx, hy, hSize);
    }
    p.pop(); // End rotation logic


    // --- DRAW FLIES ---
    // Used Perlin Noise (p.noise) for smooth, organic swarming
    p.fill(0);
    p.noStroke();

    for (let i = 0; i < flyCount; i++) {
      // Create unique offsets for each fly so they don't move together
      let timeOffset = i * 500; 
      let t = p.frameCount * 0.01 + timeOffset; // 0.01 = Slow speed

      // Use noise to generate smooth angle and distance values
      let angleVal = p.noise(t) * 720; // Allow them to loop around multiple times
      let distVal = p.noise(t + 100);  // Different noise seed for distance

      // Map distance to hover around the edge of the cheese
      let flyDist = p.map(distVal, 0, 1, radius * 0.9, radius * 1.4);
      
      let fx = p.cos(angleVal) * flyDist;
      let fy = p.sin(angleVal) * flyDist;

      p.push();
      p.translate(fx, fy);
      // Optional: Rotate fly to face somewhat towards movement or center
      p.rotate(angleVal + 90); 

      // Fly Body
      p.fill(30);
      p.ellipse(0, 0, 10, 14);
      
      // Fly Wings (Translucent)
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