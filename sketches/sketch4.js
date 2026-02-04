registerSketch('sk4', function(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.noStroke();
  };

  p.draw = function() {
    p.background('#2c3e50'); // Dark kitchen counter
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour() % 12;
    if (hr === 0) hr = 12; 
    let mn = p.minute();
    let sc = p.second();

    // --- DRAW THE POT ---
    // Pot Handle
    p.fill(100);
    p.rect(150, -140, 200, 30, 10);
    
    // Pot Body
    p.fill(200); 
    p.stroke(150);
    p.strokeWeight(5);
    p.beginShape();
    p.vertex(-180, -100);
    p.vertex(180, -100);
    p.vertex(170, 150);
    p.curveVertex(170, 150);
    p.curveVertex(0, 170);
    p.curveVertex(-170, 150);
    p.vertex(-170, 150);
    p.endShape(p.CLOSE);

    // Pot Interior
    p.fill(50);
    p.noStroke();
    p.beginShape();
    p.vertex(-170, -95);
    p.vertex(170, -95);
    p.vertex(160, 145);
    p.curveVertex(160, 145);
    p.curveVertex(0, 160);
    p.curveVertex(-160, 145);
    p.vertex(-160, 145);
    p.endShape(p.CLOSE);

    // --- DRAW UNPOPPED KERNELS (MINUTES) ---
    // LOGIC: "Circle Packing" to prevent overlap
    
    p.randomSeed(100); 
    p.fill('#FFD700'); // Gold
    p.noStroke();
    
    let placedKernels = []; // Array to store positions of kernels we've already placed
    let kernelSize = 14;    // Approximate width of a kernel
    let minDistance = 16;   // Minimum distance between kernel centers (size + padding)
    
    for (let i = 0; i < mn; i++) {
      let kx, ky;
      let validSpot = false;
      let attempts = 0;
      
      // Try to find a non-overlapping spot up to 50 times per kernel
      while (!validSpot && attempts < 50) {
        // Pick a random spot in the bottom of the pot
        kx = p.random(-130, 130);
        ky = p.random(60, 130);
        
        // Assume it's valid until proven otherwise
        validSpot = true;
        
        // Check against all previously placed kernels
        for (let other of placedKernels) {
          let d = p.dist(kx, ky, other.x, other.y);
          if (d < minDistance) {
            validSpot = false; // Too close!
            break; // Stop checking others, this spot is bad
          }
        }
        attempts++;
      }
      
      // If we found a valid spot (or ran out of attempts and just have to place it), save it
      placedKernels.push({x: kx, y: ky});

      // Calculate Jitter (Heat vibration)
      let jitterAmount = p.map(sc, 0, 59, 0.5, 3); 
      let dx = p.random(-jitterAmount, jitterAmount);
      let dy = p.random(-jitterAmount, jitterAmount);
      
      // Draw the kernel
      p.push();
      p.translate(kx + dx, ky + dy);
      p.rotate(p.random(360));
      p.ellipse(0, 0, 12, 16); 
      p.pop();
    }

    // --- DRAW POPPED CORN (HOURS) ---
    // Overlapping is okay here because they are clouds!
    p.randomSeed(200); 
    p.fill(255); 
    p.noStroke();

    for (let i = 0; i < hr; i++) {
      let px = p.random(-130, 130);
      let py = p.random(-80, 20);
      
      let floatY = p.sin(p.frameCount * 2 + i * 50) * 3;
      
      p.push();
      p.translate(px, py + floatY);
      
      p.circle(0, 0, 30);
      p.circle(-10, -10, 25);
      p.circle(10, -10, 25);
      p.circle(0, -15, 25);
      
      p.fill('#FFD700');
      p.circle(0, 5, 8);
      p.fill(255);
      
      p.pop();
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});