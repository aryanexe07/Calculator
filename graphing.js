const graphDisplay = document.getElementById("graphDisplay");
const graphCanvas = document.getElementById("graphCanvas");
const zoomLevel = document.getElementById("zoomLevel");
const cursorPos = document.getElementById("cursorPos");
const functionList = document.getElementById("functionList");

let ctx = graphCanvas.getContext("2d");
let functions = [];
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;

function resize() {
  const container = document.querySelector('.graph-area');
  graphCanvas.width = container.offsetWidth;
  graphCanvas.height = 350;
  drawGraph();
}
window.addEventListener('resize', resize);

function addToGraph(text) {
  playClick();
  graphDisplay.value += text;
  graphDisplay.focus();
}

function plotGraph() {
  playClick();
  const expr = graphDisplay.value.trim();
  if (!expr) return;
  
  functions.push({ expr, color: `hsl(${functions.length * 60}, 70%, 50%)` });
  graphDisplay.value = "";
  drawGraph();
  renderFunctionList();
}

function clearGraph() {
  playClick();
  functions = [];
  drawGraph();
  renderFunctionList();
}

function renderFunctionList() {
  functionList.innerHTML = functions.map((f, i) => 
    `<div class="func-item" style="border-left-color: ${f.color}">
      <span>f${i + 1}(x) = ${f.expr}</span>
      <span class="remove-func" onclick="removeFunction(${i})">×</span>
    </div>`
  ).join('');
}

function removeFunction(index) {
  playClick();
  functions.splice(index, 1);
  drawGraph();
  renderFunctionList();
}

function drawGraph() {
  const width = graphCanvas.width;
  const height = graphCanvas.height;
  const centerX = width / 2 + offsetX;
  const centerY = height / 2 + offsetY;
  const scale = 40 * zoom;
  
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, width, height);
  
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  
  for (let x = centerX % scale; x < width; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let x = centerX % scale; x > 0; x -= scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = centerY % scale; y < height; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let y = centerY % scale; y > 0; y -= scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
  
  functions.forEach((f, i) => {
    ctx.strokeStyle = f.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    let first = true;
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale;
      try {
        const exp = f.expr.replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan').replace(/log/g, 'Math.log10').replace(/ln/g, 'Math.log')
          .replace(/sqrt/g, 'Math.sqrt').replace(/abs/g, 'Math.abs').replace(/exp/g, 'Math.exp')
          .replace(/pow/g, 'Math.pow');
        
        let y = Function('"use strict"; return (' + exp + ')')(x);
        if (!isFinite(y)) continue;
        
        const py = centerY - y * scale;
        if (py < -height || py > height * 2) continue;
        
        if (first) { ctx.moveTo(px, py); first = false; }
        else { ctx.lineTo(px, py); }
      } catch (e) { first = true; }
    }
    ctx.stroke();
  });
  
  zoomLevel.textContent = `Zoom: ${zoom}x`;
}

graphCanvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0) zoom *= 1.1;
  else zoom /= 1.1;
  zoom = Math.max(0.1, Math.min(10, zoom));
  drawGraph();
});

graphCanvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

graphCanvas.addEventListener('mousemove', (e) => {
  const rect = graphCanvas.getBoundingClientRect();
  const scale = 40 * zoom;
  const centerX = graphCanvas.width / 2 + offsetX;
  const centerY = graphCanvas.height / 2 + offsetY;
  const x = (e.clientX - rect.left - centerX) / scale;
  const y = -(e.clientY - rect.top - centerY) / scale;
  cursorPos.textContent = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
  
  if (isDragging) {
    offsetX += e.clientX - lastMouseX;
    offsetY += e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    drawGraph();
  }
});

graphCanvas.addEventListener('mouseup', () => isDragging = false);
graphCanvas.addEventListener('mouseleave', () => isDragging = false);

initTheme();
setTimeout(resize, 100);