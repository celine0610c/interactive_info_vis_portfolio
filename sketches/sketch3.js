registerSketch('sk3', function(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();
  };

  p.draw = function() {
    p.background(30); // Dark background to make the cheese pop
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

    // Convert 24h to 12h format (1-12)
    let spotsCount = hr % 12;
    if (spotsCount === 0) spotsCount = 12;

    // Calculate mold alpha (opacity) based on minute
    // 0 mins = faint (50), 59 mins = fully opaque (255)
    let moldAlpha = p.map(mn, 0, 60, 40, 255);

    // --- DRAW CHEESE WEDGE ---
    // We'll draw a "3D-ish" wedge using simple shapes
    
    // 1. Top Face (Triangle)
    p.fill('#FCD12A'); // Bright Cheddar Yellow
    p.beginShape();
    p.vertex(0, -100);   // Back Tip
    p.vertex(150, 50);   // Front Right
    p.vertex(-150, 50);  // Front Left
    p.endShape(p.CLOSE);

    // 2. Side Face (The "Crust" / Rind area)
    p.fill('#E6B800'); // Slightly darker yellow/orange
    p.beginShape();
    p.vertex(-150, 50);
    p.vertex(150, 50);
    p.vertex(150, 150);
    p.vertex(-150, 150);
    p.endShape(p.CLOSE);

    // 3. Cheese Holes (Decoration)
    p.fill('#D4A000');
    p.circle(-50, 20, 20);
    p.circle(60, 80, 15);
    p.circle(10, -30, 10);


    // --- DRAW MOLD ---
    
    // IMPORTANT: We use randomSeed to ensure the spots stay in the 
    // exact same place for every frame. We usually seed by a constant number.
    p.randomSeed(9999); 

    for (let i = 0; i < spotsCount; i++) {
      // Generate a random position on the front face of the cheese
      // Face area is roughly x: -130 to 130, y: 60 to 140
      let mx = p.random(-130, 130);
      let my = p.random(60, 140);
      
      // Generate a random size for variation
      let baseSize = p.random(15, 35);
      
      // Pulse effect based on seconds (making it "breathe")
      // We use the index 'i' so they don't all pulse in sync
      let pulse = p.sin(p.frameCount * 0.05 + i) * 3; 

      // Draw the main mold spot
      p.fill(76, 111, 47, moldAlpha); // Swamp Green
      p.circle(mx, my, baseSize + pulse);

      // Draw a darker "core" for the mold
      p.fill(40, 70, 30, moldAlpha);
      p.circle(mx + p.random(-5, 5), my + p.random(-5, 5), (baseSize / 2) + pulse);
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});