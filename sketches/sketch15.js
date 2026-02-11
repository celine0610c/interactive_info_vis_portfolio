registerSketch('sk15', function (p) {

  // ---------------- DATA ----------------
  let table;
  let points = [];
  let hovered = null;
  let spriteCache = {};

  const typeColors = {
    grass: '#78C850',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878'
  };

  // ---------------- PRELOAD ----------------
  p.preload = function () {
    table = p.loadTable(
      'sketches/pokemon_with_sprites.csv',
      'csv',
      'header'
    );
  };

  // ---------------- SETUP ----------------
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont('Arial');

    table.rows.forEach(row => {
      const spriteUrl = row.get('sprite');

      // Cache sprite images once
      if (spriteUrl && !spriteCache[spriteUrl]) {
        spriteCache[spriteUrl] = p.loadImage(spriteUrl);
      }

      points.push({
        name: row.get('name'),
        hp: +row.get('hp'),
        spAtk: +row.get('sp_attack'),
        type: row.get('type1'),
        legendary: row.get('is_legendary') === '1',
        sprite: spriteUrl
      });
    });
  };

  // ---------------- DRAW ----------------
  p.draw = function () {
  p.background(255);
  hovered = null;

  const margin = 90;
  const plotW = p.width - margin * 2;
  const plotH = p.height - margin * 2;

  const xMin = 20, xMax = 255;   // HP
  const yMin = 20, yMax = 200;   // Special Attack

  drawAxes(margin, plotW, plotH, xMin, xMax, yMin, yMax);

  // ---------- 1) HOVER DETECTION (NO DRAWING) ----------
  for (let pt of points) {
    const x = p.constrain(
      p.map(pt.hp, xMin, xMax, margin, margin + plotW),
      margin,
      margin + plotW
    );

    const y = p.constrain(
      p.map(pt.spAtk, yMin, yMax, margin + plotH, margin),
      margin,
      margin + plotH
    );

    if (p.dist(p.mouseX, p.mouseY, x, y) < 7) {
      hovered = pt;
      break; // IMPORTANT: stop at first match
    }
  }

  // ---------- 2) DRAW POINTS ----------
  points.forEach(pt => {
    const x = p.constrain(
      p.map(pt.hp, xMin, xMax, margin, margin + plotW),
      margin,
      margin + plotW
    );

    const y = p.constrain(
      p.map(pt.spAtk, yMin, yMax, margin + plotH, margin),
      margin,
      margin + plotH
    );

    if (hovered === pt) {
      p.stroke(0);
      p.strokeWeight(1.5);
    } else {
      p.noStroke();
    }

    p.fill(typeColors[pt.type] || '#999');
    p.circle(x, y, pt.legendary ? 10 : 6);
  });

  // ---------- TITLE ----------
  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER);
  p.textSize(26);
  p.text('Pokemon HP vs Special Attack', p.width / 2, 45);

  // ---------- TOOLTIP ----------
  if (hovered) drawTooltip(hovered);
};


  // ---------------- AXES ----------------
  function drawAxes(margin, w, h, xMin, xMax, yMin, yMax) {
    p.stroke(0);
    p.line(margin, margin, margin, margin + h);
    p.line(margin, margin + h, margin + w, margin + h);

    p.noStroke();
    p.fill(0);
    p.textSize(12);

    // X-axis ticks (HP)
    p.textAlign(p.CENTER);
    for (let v = 50; v <= xMax; v += 50) {
      const x = p.map(v, xMin, xMax, margin, margin + w);
      p.stroke(0);
      p.line(x, margin + h, x, margin + h + 6);
      p.noStroke();
      p.text(v, x, margin + h + 22);
    }

    // Y-axis ticks (Sp. Atk)
    p.textAlign(p.RIGHT, p.CENTER);
    for (let v = 50; v <= yMax; v += 50) {
      const y = p.map(v, yMin, yMax, margin + h, margin);
      p.stroke(0);
      p.line(margin - 6, y, margin, y);
      p.noStroke();
      p.text(v, margin - 10, y);
    }

    // Axis labels
    p.textAlign(p.CENTER);
    p.text('HP', margin + w / 2, margin + h + 50);

    p.push();
    p.translate(30, margin + h / 2);
    p.rotate(-p.HALF_PI);
    p.text('Special Attack', 0, 0);
    p.pop();
  }

  // ---------------- TOOLTIP ----------------
  function drawTooltip(pt) {
    const x = p.mouseX + 12;
    const y = p.mouseY + 12;

    p.fill(255);
    p.stroke(0);
    p.rect(x, y, 200, 130, 6);

    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(12);

    p.text(pt.name, x + 10, y + 8);
    p.text(`Type: ${pt.type}`, x + 10, y + 26);
    p.text(`HP: ${pt.hp}`, x + 10, y + 44);
    p.text(`Sp. Atk: ${pt.spAtk}`, x + 10, y + 62);
    if (pt.legendary) p.text('Legendary', x + 10, y + 80);

    if (pt.sprite && spriteCache[pt.sprite]) {
      p.image(spriteCache[pt.sprite], x + 130, y + 32, 48, 48);
    }
  }

  // ---------------- RESIZE ----------------
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
