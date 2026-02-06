registerSketch('sk2', function(p) {
  let currentRatio = '16:8';
  let buttons = [];
  
  // Fasting configurations: [Start Hour, End Hour] for the eating window
  const configs = {
    '16:8': { start: 12, end: 20, label: '16:8 (Standard)' },
    '18:6': { start: 13, end: 19, label: '18:6 (Moderate)' },
    '20:4': { start: 14, end: 18, label: '20:4 (Warrior)' },
    '21:3': { start: 15, end: 18, label: '21:3 (Advanced)' }
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.textAlign(p.CENTER, p.CENTER);
    
    // Create Buttons
    let labels = Object.keys(configs);
    labels.forEach((lab, i) => {
      let btn = p.createButton(lab);
      btn.position(20 + (i * 60), p.height - 40);
      btn.mousePressed(() => currentRatio = lab);
      buttons.push(btn);
    });
  };

  p.draw = function() {
    p.background('#f4f1ea');
    
    // UI Label
    p.fill(80);
    p.noStroke();
    p.textSize(16);
    p.text(`Active Regimen: ${configs[currentRatio].label}`, p.width/2, p.height - 70);
    
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

    // 1. Draw Plate
    p.stroke(200);
    p.strokeWeight(2);
    p.fill(255);
    p.circle(0, 0, 350); 
    
    // 2. Draw Dynamic Meal Zone
    drawDynamicZone(p, configs[currentRatio].start, configs[currentRatio].end);

    // 3. 24-Hour Dial
    drawDial(p);

    // 4. Calculate Angles
    let hourAngle = p.map(hr + mn/60, 0, 24, 0, 360) - 90;
    let minuteAngle = p.map(mn, 0, 60, 0, 360) - 90;
    let secondAngle = p.map(sc, 0, 60, 0, 360) - 90;

    // 5. Draw Utensils
    p.push(); p.rotate(hourAngle); drawFork(p, 90); p.pop();
    p.push(); p.rotate(minuteAngle); drawSpoon(p, 130); p.pop();
    p.push(); p.rotate(secondAngle); drawSpork(p, 145); p.pop();
    
    p.fill(150); p.noStroke(); p.circle(0, 0, 10);
  };

  function drawDynamicZone(p, start, end) {
    p.noFill();
    p.strokeWeight(20);
    // Eating Window (Green/Yellow Gradient vibe)
    p.stroke('rgba(141, 198, 63, 0.4)'); 
    p.arc(0, 0, 310, 310, start * 15 - 90, end * 15 - 90);
    
    // Fasting Window (The rest of the circle in a muted tone)
    p.stroke('rgba(0, 0, 0, 0.05)');
    p.arc(0, 0, 310, 310, end * 15 - 90, start * 15 - 90);
  }

  function drawDial(p) {
    for (let i = 1; i <= 24; i++) {
      let angle = (i * 15) - 90;
      p.push();
      p.rotate(angle);
      p.stroke(180);
      p.strokeWeight(2);
      p.line(125, 0, 135, 0); 
      p.translate(112, 0); 
      p.rotate(-angle);
      p.noStroke();
      p.fill(80);
      p.textSize(12);
      p.text(i, 0, 0);
      p.pop();
    }
  }

  // Utensil helpers remain the same as your original sketch
  function drawFork(p, len) {
    p.stroke(160); p.strokeWeight(6); p.line(0, 0, len * 0.7, 0);
    p.noFill(); for(let i = -5; i <= 5; i += 5) { p.line(len * 0.7, i, len, i); }
    p.line(len * 0.7, -5, len * 0.7, 5);
  }
  function drawSpoon(p, len) {
    p.stroke(160); p.strokeWeight(7); p.line(0, 0, len * 0.6, 0);
    p.fill(200); p.noStroke(); p.ellipse(len * 0.85, 0, 45, 30);
  }
  function drawSpork(p, len) {
    p.stroke('#d9534f'); p.strokeWeight(3); p.line(0, 0, len * 0.7, 0);
    p.fill(240); p.noStroke(); p.ellipse(len * 0.85, 0, 30, 22);
    p.stroke('#d9534f'); for(let i = -4; i <= 4; i += 4) { p.line(len * 0.95, i, len * 1.05, i); }
  }
  
  p.windowResized = function() { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
    buttons.forEach((btn, i) => btn.position(20 + (i * 60), p.height - 40));
  };
});