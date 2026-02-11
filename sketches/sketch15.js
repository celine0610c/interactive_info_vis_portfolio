registerSketch('sk15', function (p) {

  // ---------------- DATA ----------------
  let table;
  let points = [];
  let hovered = null;

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
    table = p.loadTable('sketches/pokemon.csv', 'csv', 'header');
  };

  // ---------------- SETUP ----------------
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont('Arial');

    // Convert rows → visualization objects
    table.rows.forEach(row => {
      points.push({
        name: row.get('name'),
        attack: +row.get('attack'),
        defense: +row.get('defense'),
        type: row.get('type1'),
        legendary: row.get('is_legendary') === '1'
      });
    });
  };

  // ---------------- DRAW ----------------
  p.draw = function () {
    p.background(255);
    hovered = null;

    const margin = 80;
    const plotW = p.width - margin * 2;
    const plotH = p.height - margin * 2;

    // Axes
    p.stroke(0);
    p.line(margin, p.height - margin, p.width - margin, p.height - margin);
    p.line(margin, margin, margin, p.height - margin);

    p.noStroke();

    // Draw points
    points.forEach(pt => {
      const x = p.map(pt.attack, 5, 190, margin, p.width - margin);
      const y = p.map(pt.defense, 5, 230, p.height - margin, margin);

      const d = p.dist(p.mouseX, p.mouseY, x, y);
      if (d < 6) hovered = pt;

      const c = typeColors[pt.type] || '#999';
      p.fill(c);
      p.noStroke();

      p.circle(x, y, pt.legendary ? 10 : 6);
    });

    // Axis labels
    p.fill(0);
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.text('Attack', p.width / 2, p.height - 30);

    p.push();
    p.translate(30, p.height / 2);
    p.rotate(-p.HALF_PI);
    p.text('Defense', 0, 0);
    p.pop();

    // Title
    p.textSize(26);
    p.text('Pokémon Attack vs Defense', p.width / 2, 40);

    // Tooltip
    if (hovered) drawTooltip(hovered);
  };

  // ---------------- TOOLTIP ----------------
  function drawTooltip(pt) {
    const lines = [
      pt.name,
      `Type: ${pt.type}`,
      `Attack: ${pt.attack}`,
      `Defense: ${pt.defense}`,
      pt.legendary ? 'Legendary' : ''
    ];

    const x = p.mouseX + 12;
    const y = p.mouseY + 12;
    const w = 160;
    const h = lines.length * 18 + 10;

    p.fill(255);
    p.stroke(0);
    p.rect(x, y, w, h, 4);

    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(12);

    lines.forEach((l, i) => {
      if (l) p.text(l, x + 8, y + 6 + i * 18);
    });
  }

  // ---------------- RESIZE ----------------
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
