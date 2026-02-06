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
    p.rotate(-90);

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


    // --- DRAW LANDED FLIES ---
    p.noStroke();

    for (let i = 0; i < flyCount; i++) {
      // 1. Position: Evenly distributed ON THE RIND
      // Using 'i' to space them out like numbers on a clock
      let angleSpacing = 360 / flyCount;
      let baseAngle = (i * angleSpacing) - 90; 
      
      // 2. Crawl Effect (Noise)
      // Very slow, subtle movement along the angle
      let crawlSpeed = p.frameCount * 0.005 + (i * 10);
      let angleWiggle = p.map(p.noise(crawlSpeed), 0, 1, -5, 5);
      
      // Calculate final position
      let finalAngle = baseAngle + angleWiggle;
      // Position them right in the middle of the rind thickness
      let dist = radius + (rindThickness / 2); 

      let fx = p.cos(finalAngle) * dist;
      let fy = p.sin(finalAngle) * dist;

      p.push();
      p.translate(fx, fy);
      
      // 3. Rotation (Twitching)
      // Flies tend to rotate abruptly to look around
      let twitchNoise = p.noise(p.frameCount * 0.05 + i * 50);
      let facingAngle;
      
      if (twitchNoise < 0.3) facingAngle = finalAngle;      // Face tangent (walking along rim)
      else if (twitchNoise < 0.6) facingAngle = finalAngle + 90; // Face outward
      else facingAngle = finalAngle + 180;                  // Face inward (eating)
      
      // Add a little jitter to the rotation
      p.rotate(facingAngle + p.random(-10, 10));

      // 4. Draw Fly (Landed posture)
      
      // Legs (Small lines sticking out)
      p.stroke(0);
      p.strokeWeight(1);
      p.line(-4, -4, 4, -4); // Front/Back legs roughly
      p.line(-4, 0, 4, 0);
      p.line(-4, 4, 4, 4);
      p.noStroke();

      // Body (Oval)
      p.fill(20);
      p.ellipse(0, 0, 12, 8); // Horizontal body relative to rotation
      
      // Head
      p.fill(0);
      p.circle(6, 0, 5); // Head at the "front"

      // Wings (Folded back in V shape)
      // White with low opacity
      p.fill(255, 150);
      p.push();
      p.translate(-2, 0); // Attach wings to back of thorax
      p.rotate(-20); // Wing 1 angled back
      p.ellipse(-6, 0, 10, 4);
      p.rotate(40);  // Wing 2 angled back other way
      p.ellipse(-6, 0, 10, 4);
      p.pop();

      p.pop();
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});