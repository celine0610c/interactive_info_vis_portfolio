registerSketch('sk3', function(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES); // Easier to work with circles
    p.noStroke();
  };

  p.draw = function() {
    p.background(30); // Dark background
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

    // --- TIME CALCS ---
    // Slice Index: 0 to 11 (matches the 12 slices of the clock)
    // 12:00-12:59 is index 0, 1:00-1:59 is index 1, etc.
    let currentSliceIndex = hr % 12;

    // Fly Count: 1 to 12. If it's 0 (12:00), we usually show 12 flies on a clock face.
    let flyCount = currentSliceIndex;
    if (flyCount === 0) flyCount = 12;


    // --- DRAW CHEESE WHEEL ---
    let radius = p.min(p.width, p.height) * 0.35;
    
    // Colors
    let freshColor = p.color('#FCD12A'); // Bright Cheddar
    let moldColor  = p.color('#4C6F2F'); // Swamp Green
    
    // Rotate so slice 0 is at the top (12 o'clock position)
    p.push();
    p.rotate(-90); 

    for (let i = 0; i < 12; i++) {
      let angleStart = i * 30;
      let angleEnd = (i + 1) * 30;

      // Determine Color Logic
      if (i < currentSliceIndex) {
        // PAST HOURS: Fully Moldy
        p.fill(moldColor);
      } 
      else if (i === currentSliceIndex) {
        // CURRENT HOUR: Gradient transition based on minute
        // Map 0-60 mins to 0-1 lerp amount
        let amt = p.map(mn, 0, 60, 0, 1);
        let currentColor = p.lerpColor(freshColor, moldColor, amt);
        p.fill(currentColor);
      } 
      else {
        // FUTURE HOURS: Fresh Cheese
        p.fill(freshColor);
      }

      // Draw the wedge
      // We use arc(). arc(x, y, w, h, start, stop, mode)
      p.arc(0, 0, radius * 2, radius * 2, angleStart, angleEnd, p.PIE);
    }
    p.pop(); // End cheese rotation


    // --- DRAW FLIES ---
    // Each fly represents 1 hour
    
    p.fill(0); // Black flies
    
    // We use a separate random seed so flies jitter but stay in their "area"
    p.randomSeed(100); 

    for (let i = 0; i < flyCount; i++) {
      // Calculate a base position for the fly
      // We distribute them evenly around the cheese or just swarm?
      // Let's make them swarm the whole cheese loosely.
      
      // Create a unique time offset for each fly so they don't move in sync
      let t = p.frameCount * 0.05 + i * 100;
      
      // Orbit logic:
      // Base angle moves slowly, plus erratic noise
      let flyAngle = (p.frameCount * 0.5) + (i * (360 / flyCount));
      
      // Radius: Hovering slightly outside the cheese edge
      let flyDist = radius + 40 + p.noise(t) * 50; 
      
      // Convert polar to cartesian
      let fx = p.cos(flyAngle) * flyDist;
      let fy = p.sin(flyAngle) * flyDist;
      
      // Add "buzz" (high frequency jitter)
      fx += p.random(-3, 3);
      fy += p.random(-3, 3);

      // Draw Fly (simple circle with tiny wings)
      p.push();
      p.translate(fx, fy);
      // Rotate fly to face movement direction roughly (optional, just rotation jitter here)
      p.rotate(p.random(360));
      
      // Body
      p.fill(0);
      p.ellipse(0, 0, 8, 12);
      
      // Wings (White-ish transparent)
      p.fill(255, 150);
      p.ellipse(-5, -2, 6, 4);
      p.ellipse(5, -2, 6, 4);
      p.pop();
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});registerSketch('sk3', function(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.noStroke();
  };

  p.draw = function() {
    p.background(30); // Dark background
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour();
    let mn = p.minute();

    // --- TIME CALCS ---
    let currentSliceIndex = hr % 12;
    let flyCount = currentSliceIndex;
    if (flyCount === 0) flyCount = 12;

    // --- CHEESE SETUP ---
    let radius = p.min(p.width, p.height) * 0.35;
    let rindThickness = 20;
    
    // Define Colors
    let freshColor = p.color(252, 209, 42); // #FCD12A Bright Cheddar
    let moldColor  = p.color(76, 111, 47);  // #4C6F2F Swamp Green
    let rindColor  = p.color(200, 140, 30); // Brownish-orange wax rind

    // --- 1. DRAW RIND (Bottom Layer) ---
    p.fill(rindColor);
    // Draw a slightly messy outer circle for organic rind feel
    p.beginShape();
    for(let a = 0; a < 360; a += 10) {
      let r = (radius + rindThickness) + p.noise(a)*5;
      p.vertex(p.cos(a)*r, p.sin(a)*r);
    }
    p.endShape(p.CLOSE);

    
    // --- 2. DRAW CHEESE WEDGES (Main Body) ---
    p.push();
    p.rotate(-90); // Start at top

    for (let i = 0; i < 12; i++) {
      let angleStart = i * 30;
      let angleEnd = (i + 1) * 30;

      // Color Logic (Same as before)
      if (i < currentSliceIndex) {
        p.fill(moldColor); // Past: Moldy
      } else if (i === currentSliceIndex) {
        let amt = p.map(mn, 0, 60, 0, 1);
        p.fill(p.lerpColor(freshColor, moldColor, amt)); // Current: Gradient
      } else {
        p.fill(freshColor); // Future: Fresh
      }

      // Draw wedge slightly smaller than rind
      p.arc(0, 0, radius * 2, radius * 2, angleStart, angleEnd, p.PIE);
    }
    p.pop();


    // --- 3. DRAW HOLES (Texture Layer) ---
    // We use a fixed randomSeed so holes stay in place
    p.randomSeed(12345); 
    let numHoles = 50;

    for (let j = 0; j < numHoles; j++) {
      let hAngle = p.random(0, 360);
      // Distribute holes mostly in middle-ish area
      let hDist = p.random(radius * 0.15, radius * 0.9); 
      let hSize = p.random(5, 30);

      // Calculate position
      let hx = p.cos(hAngle) * hDist;
      let hy = p.sin(hAngle) * hDist;

      // DETERMINE HOLE COLOR BASED ON MOLD STATUS
      // We have to figure out which slice angle this hole falls into.
      // Since wedges are rotated -90, we adjust the angle check.
      let normalizedAngle = (hAngle + 90) % 360; 
      let sliceIndex = p.floor(normalizedAngle / 30);

      let holeBaseColor;
      if (sliceIndex < currentSliceIndex) {
          holeBaseColor = moldColor;
      } else if (sliceIndex === currentSliceIndex) {
          let amt = p.map(mn, 0, 60, 0, 1);
          holeBaseColor = p.lerpColor(freshColor, moldColor, amt);
      } else {
          holeBaseColor = freshColor;
      }

      // Create a darker version of the base color for the hole depth
      // Manually darken RGB values
      p.fill(
        p.red(holeBaseColor) * 0.7,
        p.green(holeBaseColor) * 0.7,
        p.blue(holeBaseColor) * 0.7
      );

      p.circle(hx, hy, hSize);
    }


    // --- 4. DRAW FLIES (Top Layer) ---
    p.fill(0);
    p.randomSeed(p.frameCount); // Reset seed for erratic fly movement

    for (let i = 0; i < flyCount; i++) {
      // Flies swarm around the rind area
      let angle = p.random(360);
      let dist = radius + p.random(10, 60);
      let fx = p.cos(angle) * dist;
      let fy = p.sin(angle) * dist;
      
      p.push();
      p.translate(fx, fy);
      p.rotate(p.random(360));
      // Simple fly body and wings
      p.fill(20);
      p.ellipse(0,0, 10, 14);
      p.fill(255, 100);
      p.ellipse(-4,-2, 6,4);
      p.ellipse(4,-2, 6,4);
      p.pop();
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});