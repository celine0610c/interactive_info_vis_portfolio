registerSketch('sk15', function (p) {

  // ---------------- DATA ----------------
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

  // Simplified dominance set (can be expanded later)
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
    { from: "Dark", to: "Ghost" },
    { from: "Steel", to: "Ice" },
    { from: "Fairy", to: "Dragon" }
  ];

  // ---------------- LAYOUT ----------------
  let centerX, centerY, radius;
  let angleStep;
  let typeAngles = {};

  // ---------------- SETUP ----------------
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont("Arial");

    centerX = p.width / 2;
    centerY = p.height / 2;
    radius = p.min(p.width, p.height) * 0.38;

    angleStep = p.TWO_PI / types.length;
    types.forEach((t, i) => typeAngles[t] = i * angleStep);
  };

  // ---------------- DRAW ----------------
  p.draw = function () {
    p.background(255);

    // Draw chords first (behind)
    dominance.forEach(d => drawChord(d.from, d.to));

    // Draw outer arcs + labels
    drawOuterRing();

    // Title
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

    types.forEach((t, i) => {
      const start = i * angleStep;
      const end = start + angleStep * 0.95;

      p.stroke(typeColors[t]);
      p.arc(centerX, centerY, radius * 2, radius * 2, start, end);

      // Labels
      const mid = start + angleStep / 2;
      const lx = centerX + p.cos(mid) * (radius + 45);
      const ly = centerY + p.sin(mid) * (radius + 45);

      p.noStroke();
      p.fill(0);
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(t, lx, ly);
    });
  }

  // 🔥 FINAL, CORRECT chord geometry
  function drawChord(from, to) {
    const a1 = typeAngles[from];
    const a2 = typeAngles[to];

    const x1 = centerX + p.cos(a1) * radius;
    const y1 = centerY + p.sin(a1) * radius;

    const x2 = centerX + p.cos(a2) * radius;
    const y2 = centerY + p.sin(a2) * radius;

    // Control points pulled to center = real chord
    p.noFill();
    const c = p.color(typeColors[from]);
    p.stroke(p.red(c), p.green(c), p.blue(c), 120);
    p.strokeWeight(2);

    p.bezier(
      x1, y1,
      centerX, centerY,
      centerX, centerY,
      x2, y2
    );
  }

  // ---------------- RESIZE ----------------
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
    radius = p.min(p.width, p.height) * 0.38;
  };
});
