registerSketch('sk15', function (p) {

  // ---------------- DATA ----------------
  let table;
  let points = [];
  let hovered = null;
  let spriteCache = {};
  let activeTypes = {};

  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
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
    fairy: '#EE99AC'
  };

  const types = Object.keys(typeColors);

  const clearBtn = {
    x: 80,
    y: 1000,
    w: 140,
    h: 32
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
    // Taller canvas so legend is never clipped
    p.createCanvas(1080, 1600);
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

    const margin = 140;
    const plotW = p.width - margin * 2;
    const plotH = 720;

    const xMin = 20, xMax = 255;
    const yMin = 20, yMax = 200;

    drawTitle();
    drawAnnotations(margin, plotW, plotH);
    drawAxes(margin, plotW, plotH, xMin, xMax, yMin, yMax);

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
      const size = hovered === pt ? 46 : 34;

      if (pt.sprite && spriteCache[pt.sprite]) {
        p.imageMode(p.CENTER);
        p.tint(255, hovered && hovered !== pt ? 90 : 255);
        p.image(spriteCache[pt.sprite], x, y, size, size);
        p.noTint();
      }
    });

    drawClearButton();
    drawLegend();

    if (hovered) drawTooltip(hovered);
  };

  // ---------------- TITLE ----------------
  function drawTitle() {
    p.fill(20);
    p.textAlign(p.CENTER);
    p.textSize(36);
    p.textStyle(p.BOLD);
    p.text('Glass Cannons and Tanks', p.width / 2, 70);

    p.textSize(18);
    p.textStyle(p.NORMAL);
    p.fill(80);
    p.text(
      'How Pokémon trade HP for Special Attack',
      p.width / 2,
      105
    );
  }

  // ---------------- ANNOTATIONS ----------------
  function drawAnnotations(margin, w, h) {
    p.push();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(16);
    p.fill(60);
    p.stroke(150);

    p.noStroke();
    p.text('High damage,\nlow survivability', margin + 40, margin + 80);
    p.stroke(150);
    p.line(margin + 150, margin + 130, margin + 280, margin + 280);

    p.noStroke();
    p.text(
      'High survivability,\nlower damage',
      margin + w - 340,
      margin + h - 80
    );
    p.stroke(150);
    p.line(
      margin + w - 220,
      margin + h - 120,
      margin + w - 360,
      margin + h - 260
    );

    p.pop();
  }

  // ---------------- AXES ----------------
  function drawAxes(margin, w, h, xMin, xMax, yMin, yMax) {
    p.push();

    p.stroke(225);
    for (let v = 50; v <= xMax; v += 50) {
      const x = p.map(v, xMin, xMax, margin, margin + w);
      p.line(x, margin, x, margin + h);
    }
    for (let v = 50; v <= yMax; v += 50) {
      const y = p.map(v, yMin, yMax, margin + h, margin);
      p.line(margin, y, margin + w, y);
    }

    p.stroke(0);
    p.line(margin, margin, margin, margin + h);
    p.line(margin, margin + h, margin + w, margin + h);

    p.noStroke();
    p.fill(0);
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.text('HP →', margin + w / 2, margin + h + 55);

    p.push();
    p.translate(60, margin + h / 2);
    p.rotate(-p.HALF_PI);
    p.text('Special Attack →', 0, 0);
    p.pop();

    p.pop();
  }

  // ---------------- CLEAR BUTTON ----------------
  function drawClearButton() {
    p.push();

    const hovering =
      p.mouseX > clearBtn.x &&
      p.mouseX < clearBtn.x + clearBtn.w &&
      p.mouseY > clearBtn.y &&
      p.mouseY < clearBtn.y + clearBtn.h;

    p.noStroke();
    p.fill(hovering ? '#E0E0E0' : '#F2F2F2');
    p.rect(clearBtn.x, clearBtn.y, clearBtn.w, clearBtn.h, 8);

    p.fill(40);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text('Uncheck all', clearBtn.x + clearBtn.w / 2, clearBtn.y + clearBtn.h / 2);

    p.pop();
  }

  // ---------------- LEGEND ----------------
  function drawLegend() {
    p.push();
    const x = 80;
    let y = 1080;

    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(14);
    p.fill(0);
    p.text('Filter by type:', x, y - 20);

    types.forEach(t => {
      p.fill(activeTypes[t] ? typeColors[t] : '#ddd');
      p.rect(x, y - 6, 14, 14, 4);
      p.fill(0);
      p.text(t, x + 22, y);
      y += 22;
    });

    p.pop();
  }

  // ---------------- INTERACTION ----------------
  p.mousePressed = function () {
    // Clear all filters
    if (
      p.mouseX > clearBtn.x &&
      p.mouseX < clearBtn.x + clearBtn.w &&
      p.mouseY > clearBtn.y &&
      p.mouseY < clearBtn.y + clearBtn.h
    ) {
      types.forEach(t => activeTypes[t] = false);
      return;
    }

    // Legend toggles
    const x = 80;
    let y = 1080;

    types.forEach(t => {
      if (
        p.mouseX > x && p.mouseX < x + 14 &&
        p.mouseY > y - 6 && p.mouseY < y + 8
      ) {
        activeTypes[t] = !activeTypes[t];
      }
      y += 22;
    });
  };

  // ---------------- TOOLTIP ----------------
  function drawTooltip(pt) {
    p.push();

    const boxW = 240;
    const boxH = 150;
    const padding = 12;

    let x = p.mouseX + 20;
    let y = p.mouseY + 20;

    if (x + boxW > p.width) x = p.mouseX - boxW - 20;
    if (y + boxH > p.height) y = p.mouseY - boxH - 20;

    p.noStroke();
    p.fill(0, 40);
    p.rect(x + 4, y + 4, boxW, boxH, 10);

    p.fill(255);
    p.stroke(180);
    p.rect(x, y, boxW, boxH, 10);

    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);

    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(pt.name, x + padding, y + padding);

    p.textSize(13);
    p.textStyle(p.NORMAL);
    p.text(`HP: ${pt.hp}`, x + padding, y + 50);
    p.text(`Sp. Atk: ${pt.spAtk}`, x + padding, y + 70);

    if (pt.legendary) {
      p.fill('#D4AF37');
      p.text('★ Legendary', x + padding, y + 92);
    }

    if (pt.sprite && spriteCache[pt.sprite]) {
      p.image(
        spriteCache[pt.sprite],
        x + boxW - 70,
        y + 75,
        80,
        80
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
});
