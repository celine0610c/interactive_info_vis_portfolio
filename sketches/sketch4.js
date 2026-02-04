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
    // Minutes = Number of kernels at the bottom
    p.randomSeed(100); 
    p.fill('#FFD700'); // Gold
    p.noStroke();
    
    for (let i = 0; i < mn; i++) {
      let kx = p.random(-140, 140);
      let ky = p.random(50, 130);
      
      // Jitter Animation based on seconds (Heat)
      let jitterAmount = p.map(sc, 0, 59, 0.5, 3); 
      let dx = p.random(-jitterAmount, jitterAmount);
      let dy = p.random(-jitterAmount, jitterAmount);
      
      p.push();
      p.translate(kx + dx, ky + dy);
      p.rotate(p.random(360));
      p.ellipse(0, 0, 12, 16); // Kernel shape
      p.pop();
    }

    // --- DRAW POPPED CORN (HOURS) ---
    // Hours = Number of popcorn clouds at the top
    p.randomSeed(200); 
    p.fill(255); 
    p.noStroke();

    for (let i = 0; i < hr; i++) {
      let px = p.random(-130, 130);
      let py = p.random(-80, 20);
      
      // Gentle float animation
      let floatY = p.sin(p.frameCount * 2 + i * 50) * 3;
      
      p.push();
      p.translate(px, py + floatY);
      
      // Draw Popcorn Cloud
      p.circle(0, 0, 30);
      p.circle(-10, -10, 25);
      p.circle(10, -10, 25);
      p.circle(0, -15, 25);
      
      // Yellow center
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