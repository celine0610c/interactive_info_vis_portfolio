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
let radius = 280;
let angleStep;
let typeAngles = {};

function setup() {
  createCanvas(900, 900);
  centerX = width / 2;
  centerY = height / 2;

  angleStep = TWO_PI / types.length;

  // Assign angle to each type
  for (let i = 0; i < types.length; i++) {
    typeAngles[types[i]] = i * angleStep;
  }

  textFont("Arial");
}

function drawOuterRing() {
  strokeWeight(30);
  noFill();

  for (let i = 0; i < types.length; i++) {
    let start = i * angleStep;
    let end = start + angleStep * 0.95;

    stroke(typeColors[types[i]]);
    arc(centerX, centerY, radius * 2, radius * 2, start, end);

    // Label
    let labelAngle = start + angleStep / 2;
    let lx = centerX + cos(labelAngle) * (radius + 45);
    let ly = centerY + sin(labelAngle) * (radius + 45);

    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(types[i], lx, ly);
  }
}

function drawChord(from, to) {
  let a1 = typeAngles[from];
  let a2 = typeAngles[to];

  let x1 = centerX + cos(a1) * radius;
  let y1 = centerY + sin(a1) * radius;

  let x2 = centerX + cos(a2) * radius;
  let y2 = centerY + sin(a2) * radius;

  let cx1 = centerX + cos(a1) * radius * 0.4;
  let cy1 = centerY + sin(a1) * radius * 0.4;

  let cx2 = centerX + cos(a2) * radius * 0.4;
  let cy2 = centerY + sin(a2) * radius * 0.4;

  noFill();
  stroke(typeColors[from]);
  strokeWeight(3);
  bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
}
