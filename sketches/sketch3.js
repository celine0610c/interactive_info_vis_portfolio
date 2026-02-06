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
});