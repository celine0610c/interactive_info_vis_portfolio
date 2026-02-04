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

    // --- DRAW THE FANCY POT ---
    
    // 1. Drop Shadow (Grounds the object)
    p.fill(0, 100); // Semi-transparent black
    p.ellipse(0, 170, 360, 30);

    // 2. Handle (Back part / Connector)
    p.fill(160); // Metal connector
    p.rect(170, -115, 40, 20, 5);
    
    // 3. The Main Handle (Black Grip)
    p.fill(40); 
    p.stroke(20);
    p.strokeWeight(2);
    // Draw a long rounded handle
    p.beginShape();
    p.vertex(200, -120);
    p.vertex(380, -120);
    p.vertex(380, -90);
    p.vertex(200, -100);
    p.endShape(p.CLOSE);
    // Rivets (Bolts)
    p.fill(200);
    p.noStroke();
    p.circle(215, -110, 8);
    p.circle(235, -108, 8);

    // 4. Pot Body (Stainless Steel Look)
    p.fill(220); // Base silver
    p.stroke(180);
    p.strokeWeight(2);
    
    p.beginShape();
    p.vertex(-180, -100);
    p.vertex(180, -100);
    p.vertex(170, 150); // Taper slightly
    p.curveVertex(170, 150);
    p.curveVertex(0, 165); // Rounded bottom
    p.curveVertex(-170, 150);
    p.vertex(-170, 150);
    p.endShape(p.CLOSE);

    // 5. Metallic Highlight (The "Shine")
    p.fill(255, 120); // Transparent white
    p.noStroke();
    p.beginShape();
    p.vertex(-140, -95);
    p.vertex(-100, -95);
    p.vertex(-110, 150);
    p.vertex(-145, 145);
    p.endShape(p.CLOSE);

    // 6. Pot Interior (Dark Void)
    p.fill(40); // Dark grey inside
    p.stroke(180); // Rim color
    p.strokeWeight(4);
    
    // Draw the opening (Ellipse at the top)
    p.beginShape();
    // We draw the shape to match the pot width
    p.vertex(-180, -100);
    p.bezierVertex(-180, -60, 180, -60, 180, -100); // Front curve
    p.bezierVertex(180, -140, -180, -140, -180, -100); // Back curve
    p.endShape(p.CLOSE);
    
    // Masking Rect to hide top half of rim (optional, but keeps it clean)
    // Actually, drawing the inside "Darkness" slightly lower helps depth:
    p.fill(30);
    p.noStroke();
    p.ellipse(0, -100, 350, 60); 


    // --- DRAW UNPOPPED KERNELS (MINUTES) ---
    // (Circle Packing Logic)
    
    p.randomSeed(100); 
    p.fill('#FFD700'); 
    p.noStroke();
    
    let placedKernels = []; 
    let minDistance = 16;   
    
    for (let i = 0; i < mn; i++) {
      let kx, ky;
      let validSpot = false;
      let attempts = 0;
      
      while (!validSpot && attempts < 50) {
        // Area limits adjusted for new pot shape
        kx = p.random(-130, 130);
        ky = p.random(60, 120); 
        validSpot = true;
        for (let other of placedKernels) {
          let d = p.dist(kx, ky, other.x, other.y);
          if (d < minDistance) { validSpot = false; break; }
        }
        attempts++;
      }
      
      placedKernels.push({x: kx, y: ky});

      // Jitter (Heat)
      let jitterAmount = p.map(sc, 0, 59, 0.5, 3.5); 
      let dx = p.random(-jitterAmount, jitterAmount);
      let dy = p.random(-jitterAmount, jitterAmount);
      
      p.push();
      p.translate(kx + dx, ky + dy);
      p.rotate(p.random(360));
      p.ellipse(0, 0, 12, 16); 
      p.pop();
    }

    // --- DRAW POPPED CORN (HOURS) ---
    p.randomSeed(200); 
    p.fill(250); 
    p.noStroke();

    for (let i = 0; i < hr; i++) {
      let px = p.random(-120, 120);
      let py = p.random(-110, -10); // Floating above the rim
      
      let floatY = p.sin(p.frameCount * 2 + i * 50) * 4;
      
      p.push();
      p.translate(px, py + floatY);
      
      // Shadow on popcorn for 3D feel
      p.fill(200); 
      p.circle(2, 2, 30); 
      
      // Main Puff
      p.fill(255);
      p.circle(0, 0, 30);
      p.circle(-10, -10, 25);
      p.circle(10, -10, 25);
      p.circle(0, -15, 25);
      
      p.fill('#FFD700');
      p.circle(0, 5, 8);
      
      p.pop();
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});