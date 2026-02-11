registerSketch('sk15', function (p) {

  // ---------------- DATA ----------------
  let table;
  let points = [];
  let hovered = null;
  let spriteCache = {};
  let activeTypes = {};

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

  const types = Object.keys(typeColors);

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

    types.forEach(t => activeTypes[t] = true);

    table.rows.forEach(row => {
      const spriteUrl = row.get('sprite');
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
    p.background('#FAFAFA');
    hovered = null;

    const margin = 90;
    const plotW = p.width - margin * 2;
    const plotH = p.height - margin * 2;

    const xMin = 20, xMax = 255;
    const yMin = 20, yMax = 200;

    drawAxes(margin, plotW, plotH, xMin, xMax, yMin, yMax);
    drawLegend();

    // ---------- HOVER DETECTION ----------
    for (let pt of points) {
      if (!activeTypes[pt.type]) continue;

      const x = clampX(pt.hp, margin, plotW, xMin, xMax);
      const y = clampY(pt.spAtk, margin, plotH, yMin, yMax);

      if (p.dist(p.mouseX, p.mouseY, x, y) < 18) {
        hovered = pt;
        break;
      }
    }

    // ---------- DRAW SPRITES ----------
    points.forEach(pt => {
      if (!activeTypes[pt.type]) return;

      const x = clampX(pt.hp, margin, plotW, xMin, xMax);
      const y = clampY(pt.spAtk, margin, plotH, yMin, yMax);
      const size = hovered === pt ? 42 : 32;

      if (pt.sprite && spriteCache[pt.sprite]) {
        p.imageMode(p.CENTER);
        p.image(spriteCache[pt.sprite], x, y, size, size);
      }
    });

    // ---------- TITLE ----------
    p.fill(30);
    p.textAlign(p.CENTER);
    p.textSize(28);
    p.textStyle(p.BOLD);
    p.text('Pokémon HP vs Special Attack', p.width / 2, 42);

    p.textSize(14);
    p.textStyle(p.NORMAL);
    p.fill(90);
    p.text('Sprite-based scatter plot with type filtering', p.width / 2, 62);

    if (hovered) drawTooltip(hovered);
  };

  // ---------------- AXES ----------------
  function drawAxes(margin, w, h, xMin, xMax, yMin, yMax) {
    p.push();

    // Gridlines
    p.stroke(230);
    p.strokeWeight(1);

    for (let v = 50; v <= xMax; v += 50) {
      const x = p.map(v, xMin, xMax, margin, margin + w);
      p.line(x, margin, x, margin + h);
    }

    for (let v = 50; v <= yMax; v += 50) {
      const y = p.map(v, yMin, yMax, margin + h, margin);
      p.line(margin, y, margin + w, y);
    }

    // Axes
    p.stroke(0);
    p.strokeWeight(1.5);
    p.line(margin, margin, margin, margin + h);
    p.line(margin, margin + h, margin + w, margin + h);

    p.noStroke();
    p.fill(0);
    p.textSize(12);

    p.textAlign(p.CENTER);
    for (let v = 50; v <= xMax; v += 50) {
      const x = p.map(v, xMin, xMax, margin, margin + w);
      p.text(v, x, margin + h + 22);
    }

    p.textAlign(p.RIGHT, p.CENTER);
    for (let v = 50; v <= yMax; v += 50) {
      const y = p.map(v, yMin, yMax, margin + h, margin);
      p.text(v, margin - 10, y);
    }

    p.textAlign(p.CENTER);
    p.text('HP', margin + w / 2, margin + h + 50);

    p.push();
    p.translate(30, margin + h / 2);
    p.rotate(-p.HALF_PI);
    p.text('Special Attack', 0, 0);
    p.pop();

    p.pop();
  }

  // ---------------- LEGEND ----------------
  function drawLegend() {
    p.push();

    const x = p.width - 160;
    let y = 90;

    p.fill(0);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text('Type Filter', x, y - 22);

    p.textStyle(p.NORMAL);
    p.textSize(13);
    p.textAlign(p.LEFT, p.CENTER);

    types.forEach(t => {
      p.fill(activeTypes[t] ? typeColors[t] : '#ddd');
      p.noStroke();
      p.rect(x, y - 7, 14, 14, 4);

      p.fill(0);
      p.text(t, x + 20, y);

      y += 20;
    });

    p.pop();
  }

  // ---------------- INTERACTION ----------------
  p.mousePressed = function () {
    const x = p.width - 160;
    let y = 90;

    types.forEach(t => {
      if (
        p.mouseX > x && p.mouseX < x + 14 &&
        p.mouseY > y - 7 && p.mouseY < y + 7
      ) {
        activeTypes[t] = !activeTypes[t];
      }
      y += 20;
    });
  };

  // ---------------- TOOLTIP ----------------
  function drawTooltip(pt) {
    p.push();

    const padding = 12;
    const boxW = 230;
    const boxH = 150;
    const x = p.mouseX + 16;
    const y = p.mouseY + 16;

    // Shadow
    p.noStroke();
    p.fill(0, 40);
    p.rect(x + 4, y + 4, boxW, boxH, 10);

    // Background
    p.fill(255);
    p.stroke(180);
    p.rect(x, y, boxW, boxH, 10);

    // Name
    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(pt.name, x + padding, y + padding);

    // Type pill
    p.textStyle(p.NORMAL);
    p.textSize(12);
    const typeColor = typeColors[pt.type] || '#ccc';
    p.fill(typeColor);
    p.rect(x + padding, y + 36, 70, 18, 9);

    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(pt.type, x + padding + 35, y + 45);

    // Stats
    p.textAlign(p.LEFT, p.TOP);
    p.fill(0);
    p.text(`HP: ${pt.hp}`, x + padding, y + 68);
    p.text(`Sp. Atk: ${pt.spAtk}`, x + padding, y + 88);

    if (pt.legendary) {
      p.fill('#D4AF37');
      p.text('★ Legendary', x + padding, y + 108);
    }

    // Sprite
    if (pt.sprite && spriteCache[pt.sprite]) {
      p.image(
        spriteCache[pt.sprite],
        x + boxW - 60,
        y + 65,
        72,
        72
      );
    }

    p.pop();
  }

  // ---------------- HELPERS ----------------
  function clampX(v, margin, w, min, max) {
    return p.constrain(
      p.map(v, min, max, margin, margin + w),
      margin,
      margin + w
    );
  }

  function clampY(v, margin, h, min, max) {
    return p.constrain(
      p.map(v, min, max, margin + h, margin),
      margin,
      margin + h
    );
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
