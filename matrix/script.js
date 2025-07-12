// Config

const gridId = 'grid';
const fontSize = 16;

const charWidth = fontSize;
const charHeight = fontSize * 2.0;

// Char Generation

const charsByLevels = [' ', '.`\',', '-_:;"^il', '~=+<>*!?', 'crtjsvun', 'aoezxy17', 'LJYSTUCR', 'ANMWEBHK', '02345689', '#%&@$QXZ',];
const levels = charsByLevels.length - 1;

const randomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];
const toChar = (level) => randomEl(charsByLevels[level]);

// Business Logic

const toCell = () => {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.style.fontSize = fontSize + 'px';
  return cell;
}

const toLightLevel = (x, y, mouseX, mouseY) => {
  const dx = x * charWidth - mouseX;
  const dy = y * charHeight - mouseY;
  const dist = Math.hypot(dx, dy);

  return Math.min(levels, Math.floor(dist / (fontSize * 2.5)));
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById(gridId);
  let cols, rows;
  let lightMap = [];

  // If called without event will render with the torchlight way outside the viewport
  const update = (event = {
    clientX: -1000,
    clientY: -1000
  }) => Array.from(grid.children).forEach((cell, i) => {
    const x = i % cols;
    const y = Math.floor(i / cols);
    const level = toLightLevel(x, y, event.clientX, event.clientY);

    if (level !== lightMap[i]) {
      lightMap[i] = level;
      cell.textContent = toChar(level);
    }
  });

  const setup = () => {
    cols = Math.floor(window.innerWidth / charWidth);
    rows = Math.floor(window.innerHeight / charHeight);

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${cols}, ${charWidth}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${charHeight}px)`;
    grid.replaceChildren(...Array.from({ length: cols * rows }, toCell));

    lightMap = Array(cols * rows).fill(-1);

    update();
  }

  window.addEventListener('mousemove', update);
  window.addEventListener('resize', setup);
  setup();
});