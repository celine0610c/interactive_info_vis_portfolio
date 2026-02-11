registerSketch('sk15', function (p) {

  let table;
  let points = [];
  let hovered = null;
  let spriteCache = {};
  let activeTypes = {};

  const typeColors = {
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    psychic: '#F85888',
    dragon: '#7038F8',
    rock: '#B8A038',
    grass: '#78C850',
    ice: '#98D8D8',
    dark: '#705848',
    fairy: '#EE99AC',
    normal: '#A8A878'
  };

  const types = Object.keys(typeColors);

  p.preload = function () {
    table = p.loadTable(
      'sketches/pokemon_with_sprites.csv',
      'csv',
      'header'
    );
  };

  p.setup = function () {
    // Instagram portrait format
    p.createCanvas(1080, 1350);
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

    // Hover detection
    for (let pt of points) {
      if (!activeTypes[pt.type]) continue;
      const x = clampX(pt.hp, margin, plotW, xMin, xMax);
      const y = clampY(pt.spAtk, margin, plotH, yMin, yMax);
      if (p.dist(p.mouseX, p.mouseY, x, y) < 18) {
        hovered = pt;
        break;
      }
    }

    // Sprites
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

    drawLegend();

    if (hovered) drawTooltip(hovered);
  };

  function drawTitle() {
    p.fill(20);
    p.textAlign(p.CENTER);
    p.textSize(36);
    p.textStyle(p.BOLD);
    p.text(
      'Glass Cannons and Tanks',
      p.width / 2,
      70
    );

    p.textSize(18);
    p.textStyle(p.NORMAL);
    p.fill(80);
    p.text(
      'How Pokémon trade HP for Special Attack',
      p.width / 2,
      105
    );
  }

  function drawAnnotations(margin, w, h) {
    p.push();
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(16);
    p.fill(60);

    // Glass cannons
    p.text('High damage,\nlow survivability', margin + 40, margin + 80);
    p.stroke(150);
    p.line(margin + 140, margin + 120, margin + 260, margin + 260);

    // Tanks
    p.noStroke();
    p.text('High survivability,\nlower damage', margin + w - 320, margin + h - 80);
    p.stroke(150);
    p.line(margin + w - 200, margin + h - 120, margin + w - 340, margin + h - 260);

    p.pop();
  }

  function drawAxes(margin, w, h, xMin, xMax, yMin, yMax) {
    p.push();

    p.stroke(220);
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

  function drawLegend() {
    p.push();
    const x = 80;
    let y = 980;

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

  p.mousePressed = function () {
    const x = 80;
    let y = 980;
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

  function drawTooltip(pt) {
    p.push();

    const x = p.mouseX + 20;
    const y = p.mouseY + 20;

    p.fill(255);
    p.stroke(180);
    p.rect(x, y, 240, 150, 10);

    p.noStroke();
    p.fill(0);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(pt.name, x + 12, y + 12);

    p.textSize(13);
    p.textStyle(p.NORMAL);
    p.text(`HP: ${pt.hp}`, x + 12, y + 48);
    p.text(`Sp. Atk: ${pt.spAtk}`, x + 12, y + 68);

    if (pt.legendary) {
      p.fill('#D4AF37');
      p.text('★ Legendary', x + 12, y + 90);
    }

    if (pt.sprite && spriteCache[pt.sprite]) {
      p.image(spriteCache[pt.sprite], x + 170, y + 70, 80, 80);
    }

    p.pop();
  }

  function clampX(v, margin, w, min, max) {
    return p.map(v, min, max, margin, margin + w);
  }

  function clampY(v, margin, h, min, max) {
    return p.map(v, min, max, margin + h, margin);
  }
});
