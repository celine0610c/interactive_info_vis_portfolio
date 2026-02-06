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

    // --- DRAW FIRE (Under the pot) ---
    p.push();
    p.translate(0, 150); // Move to bottom of pot
    p.blendMode(p.ADD);  // Glow effect

    // 1. Set a CONSTANT seed. 
    // This ensures we are manipulating the *same* 50 flame particles every frame,
    // rather than creating chaos.
    p.randomSeed(9999); 
    
    // 2. Create a "Time" variable that moves slowly
    // Lower number = slower fire. 
    let t = p.frameCount * 0.02; 

    for (let i = 0; i < 50; i++) {
      // Generate a base position for this specific flame particle
      // (This stays constant because of the fixed randomSeed)
      let baseX = p.random(-140, 140);
      let baseY = p.random(0, 50);
      
      // 3. Add Smooth Movement (Noise)
      // We use the index 'i' to give every flame a unique movement pattern
      let xShift = p.map(p.noise(i, t), 0, 1, -20, 20);
      let yShift = p.map(p.noise(i + 100, t), 0, 1, -15, 15);
      
      let fx = baseX + xShift;
      let fy = baseY + yShift;

      // 4. Smooth Size Breathing
      let baseSize = p.random(30, 60);
      let sizeBreathing = p.map(p.noise(i + 200, t * 2), 0, 1, 0.8, 1.5);
      let fSize = baseSize * sizeBreathing;

      // Color Logic (Same as before, based on distance from center)
      let fireColor;
      let distFromCenter = p.abs(fx);
      
      if (distFromCenter < 50 && fy < 20) {
        fireColor = p.color(100, 200, 255, 180); // Blue core
      } else if (distFromCenter < 100) {
        fireColor = p.color(255, 150, 0, 120);   // Orange body
      } else {
        fireColor = p.color(255, 50, 0, 100);    // Red edges
      }

      p.fill(fireColor);
      p.circle(fx, fy, fSize);
    }
    
    p.blendMode(p.BLEND);
    p.pop();


    // --- DRAW THE SYMMETRICAL POT ---
    
    // 1. Pot Handle (Back part / Connector)
    p.fill(160); 
    p.rect(170, -115, 40, 20, 5);
    
    // 2. The Main Handle (Black Grip)
    p.fill(40); 
    p.stroke(20);
    p.strokeWeight(2);
    p.beginShape();
    p.vertex(200, -120);
    p.vertex(380, -120);
    p.vertex(380, -90);
    p.vertex(200, -100);
    p.endShape(p.CLOSE);
    // Rivets
    p.fill(200);
    p.noStroke();
    p.circle(215, -110, 8);
    p.circle(235, -108, 8);

    // 3. Pot Body
    p.fill(220); // Base silver
    p.stroke(180);
    p.strokeWeight(3);
    
    p.beginShape();
    p.vertex(-180, -100); // Top-left rim
    p.vertex(180, -100);  // Top-right rim
    p.vertex(160, 150);   // Bottom-right corner
    p.vertex(-160, 150);  // Bottom-left corner
    p.endShape(p.CLOSE);

    // 4. Metallic Highlight
    p.fill(255, 100); 
    p.noStroke();
    p.beginShape();
    p.vertex(-150, -95);
    p.vertex(-120, -95);
    p.vertex(-105, 145);
    p.vertex(-135, 145);
    p.endShape(p.CLOSE);

    // 5. Pot Interior
    p.fill(40); 
    p.noStroke();
    p.beginShape();
    p.vertex(-170, -95);
    p.vertex(170, -95);
    p.vertex(150, 145);
    p.vertex(-150, 145);
    p.endShape(p.CLOSE);
    
    // Rim detail
    p.noFill();
    p.stroke(180);
    p.strokeWeight(3);
    p.ellipse(0, -100, 360, 40);


    // --- DRAW UNPOPPED KERNELS (MINUTES) ---
    p.randomSeed(100); 
    p.fill('#FFD700'); 
    p.noStroke();
    
    let placedKernels = []; 
    let minDistance = 15;   
    
    for (let i = 0; i < mn; i++) {
      let kx, ky;
      let validSpot = false;
      let attempts = 0;
      
      while (!validSpot && attempts < 50) {
        kx = p.random(-140, 140);
        ky = p.random(80, 135); 
        validSpot = true;
        for (let other of placedKernels) {
          let d = p.dist(kx, ky, other.x, other.y);
          if (d < minDistance) { validSpot = false; break; }
        }
        attempts++;
      }
      
      if (validSpot) {
          placedKernels.push({x: kx, y: ky});

          // Jitter (Heat)
          let jitterAmount = p.map(sc, 0, 59, 1, 5); 
          let dx = p.random(-jitterAmount, jitterAmount);
          let dy = p.random(-jitterAmount, jitterAmount);
          
          p.push();
          p.translate(kx + dx, ky + dy);
          p.rotate(p.random(360));
          p.ellipse(0, 0, 12, 16); 
          p.pop();
      }
    }

    // --- DRAW POPPED CORN (HOURS) ---
    p.randomSeed(200); 
    p.fill(250); 
    p.noStroke();

    for (let i = 0; i < hr; i++) {
      let px = p.random(-140, 140);
      let py = p.random(-120, -20); // Floating above the rim
      
      let floatY = p.sin(p.frameCount * 2 + i * 50) * 4;
      
      p.push();
      p.translate(px, py + floatY);
      
      // Shadow
      p.fill(200); 
      p.circle(2, 2, 30); 
      
      // Main Puff
      p.fill(255);
      p.circle(0, 0, 30);
      p.circle(-10, -10, 25);
      p.circle(10, -10, 25);
      p.circle(0, -15, 25);
      
      // Yellow center
      p.fill('#FFD700');
      p.circle(0, 5, 8);
      
      p.pop();
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});