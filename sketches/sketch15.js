registerSketch('sk15', function (p) {

  const types = [
    "Normal", "Fire", "Water", "Electric", "Grass", "Ice",
    "Fighting", "Poison", "Ground", "Flying",
    "Psychic", "Bug", "Rock", "Ghost",
    "Dragon", "Dark", "Steel", "Fairy"
  ];

  const typeColors = {
    Normal: "#A8A77A",
    Fire: "#EE8130",
    Water: "#6390F0",
    Electric: "#F7D02C",
    Grass: "#7AC74C",
    Ice: "#96D9D6",
    Fighting: "#C22E28",
    Poison: "#A33EA1",
    Ground: "#E2BF65",
    Flying: "#A98FF3",
    Psychic: "#F95587",
    Bug: "#A6B91A",
    Rock: "#B6A136",
    Ghost: "#735797",
    Dragon: "#6F35FC",
    Dark: "#705746",
    Steel: "#B7B7CE",
    Fairy: "#D685AD"
  };

  const dominance = [
    { from: "Fire", to: "Grass" },
    { from: "Water", to: "Fire" },
    { from: "Electric", to: "Water" },
    { from: "Grass", to: "Water" },
    { from: "Ice", to: "Dragon" },
    { from: "Fighting", to: "Dark" },
    { from: "Poison", to: "Fairy" },
    { from: "Ground", to: "Electric" },
    { from: "Psychic", to: "Fighting" },
    { from: "Bug", to: "Psychic" },
    { from: "Rock", to: "Flying" },
    { from: "Ghost", to: "Psychic" },
    { from: "Dragon", to: "Dragon" },
    { from: "Dark", to: "Ghost" },
    { from: "Steel", to: "Ice" },
    { from: "Fairy", to: "Dragon" }
  ];

  let centerX, centerY;
  let radius;
  let angleStep;
  let typeAngles = {};

  // ---------------- SETUP ----------------
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    centerX = p.width / 2;
    centerY = p.height / 2;
    radius = p.min(p.width, p.height) * 0.35;

    angleStep = p.TWO_PI / types.length;

    for (let i = 0; i < types.length; i++) {
      typeAngles[types[i]] = i * angleStep;
    }

    p.textFont("Arial");
  };

  // ---------------- DRAW ----------------
  p.draw = function () {
    p.background(255);

    for (let d of dominance) {
      drawChord(d.from, d.to);
    }

    drawOuterRing();

    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER);
    p.textSize(28);
    p.text("Pokémon Types Dominance", centerX, 50);
  };

  // ---------------- HELPERS ----------------
  function drawOuterRing() {
    p.strokeWeight(30);
    p.noFill();

    for (let i = 0; i < types.length; i++) {
      let start = i * angleStep;
      let end = start + angleStep * 0.95;

      p.stroke(typeColors[types[i]]);
      p.arc(centerX, centerY, radius * 2, radius * 2, start, end);

      let labelAngle = start + angleStep / 2;
      let lx = centerX + p.cos(labelAngle) * (radius + 45);
      let ly = centerY + p.sin(labelAngle) * (radius + 45);

      p.noStroke();
      p.fill(0);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);
      p.text(types[i], lx, ly);
    }
  }

  function drawChord(from, to) {
    let a1 = typeAngles[from];
    let a2 = typeAngles[to];

    let x1 = centerX + p.cos(a1) * radius;
    let y1 = centerY + p.sin(a1) * radius;

    let x2 = centerX + p.cos(a2) * radius;
    let y2 = centerY + p.sin(a2) * radius;

    let cx1 = centerX + p.cos(a1) * radius * 0.4;
    let cy1 = centerY + p.sin(a1) * radius * 0.4;

    let cx2 = centerX + p.cos(a2) * radius * 0.4;
    let cy2 = centerY + p.sin(a2) * radius * 0.4;

    p.noFill();
    p.stroke(typeColors[from]);
    p.strokeWeight(3);
    p.bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
    radius = p.min(p.width, p.height) * 0.35;
  };
});
