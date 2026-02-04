registerSketch('sk2', function(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };

  p.draw = function() {
    p.background('#f4f1ea'); 
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour(); // 0-23
    let mn = p.minute();
    let sc = p.second();

    // 1. Draw the Plate
    p.stroke(200);
    p.strokeWeight(2);
    p.fill(255);
    p.circle(0, 0, 350); 
    
    // 2. Draw Color-Coded Meal Zones on the Rim
    drawMealZones(p);

    // 3. Draw 24-Hour Marks
    p.stroke(180);
    p.strokeWeight(2);
    for (let i = 0; i < 24; i++) {
      p.push();
      p.rotate(i * 15); // 360 / 24 = 15 degrees per hour
      p.line(125, 0, 135, 0); 
      p.pop();
    }

    // 4. Narrative: Draw Food based on the Hour
    drawFood(p, hr);

    // 5. Calculate Angles for 24-Hour Clock
    // 360 / 24 = 15 degrees per hour
    let hourAngle = p.map(hr, 0, 24, 0, 360) - 90;
    let minuteAngle = p.map(mn, 0, 60, 0, 360) - 90;
    let secondAngle = p.map(sc, 0, 60, 0, 360) - 90;

    // 6. Draw Utensils
    p.push(); p.rotate(hourAngle); drawFork(p, 90); p.pop();
    p.push(); p.rotate(minuteAngle); drawSpoon(p, 130); p.pop();
    p.push(); p.rotate(secondAngle); drawSpork(p, 145); p.pop();
    
    // Pivot
    p.fill(150); p.noStroke(); p.circle(0, 0, 10);
  };

  function drawMealZones(p) {
    p.noFill();
    p.strokeWeight(15);
    
    // Breakfast: 8am-10am (Yellow)
    // 8 * 15 = 120°, 10 * 15 = 150°
    p.stroke('rgba(255, 204, 0, 0.4)');
    p.arc(0, 0, 310, 310, 8*15-90, 10*15-90);
    
    // Lunch: 12pm-2pm (Orange)
    // 12 * 15 = 180°, 14 * 15 = 210°
    p.stroke('rgba(255, 102, 0, 0.4)');
    p.arc(0, 0, 310, 310, 12*15-90, 14*15-90);
    
    // Dinner: 5pm-7pm (Purple)
    // 17 * 15 = 255°, 19 * 15 = 285°
    p.stroke('rgba(102, 51, 153, 0.4)');
    p.arc(0, 0, 310, 310, 17*15-90, 19*15-90);
  }

  function drawFood(p, hr) {
    p.noStroke();
    // Breakfast: 8am to 10am
    if (hr >= 8 && hr < 10) { 
       p.fill(255); p.circle(60, -40, 40); // Egg white
       p.fill(255, 204, 0); p.circle(60, -40, 20); // Yolk
    } 
    // Lunch: 12pm to 2pm
    else if (hr >= 12 && hr < 14) { 
       p.fill('#8dc63f');
       for(let i=0; i<12; i++) p.circle(50 + p.cos(i*30)*18, 50 + p.sin(i*30)*18, 10);
    } 
    // Dinner: 5pm to 7pm (17:00 to 19:00)
    else if (hr >= 17 && hr < 19) { 
       p.fill(101, 67, 33); // Steak color
       p.beginShape();
       p.vertex(-80, 20); p.vertex(-20, 20); p.vertex(-30, 70); p.vertex(-90, 60);
       p.endShape(p.CLOSE);
    }
  }

  // --- Helpers for Utensils ---
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
  
  p.windowResized = function() { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});