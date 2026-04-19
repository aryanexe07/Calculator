let graphDisplay, graphCanvas, ctx, zoomLevel, cursorPos, functionList;
let functions = [];
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;
let showIntersections = false;
let showDerivative = false;

function init() {
  graphDisplay = document.getElementById("graphDisplay");
  graphCanvas = document.getElementById("graphCanvas");
  zoomLevel = document.getElementById("zoomLevel");
  cursorPos = document.getElementById("cursorPos");
  functionList = document.getElementById("functionList");
  
  if (!graphCanvas) return;
  
  ctx = graphCanvas.getContext("2d");
  resizeCanvas();
  
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
  if (!graphCanvas || !graphCanvas.parentElement) return;
  const container = graphCanvas.parentElement;
  graphCanvas.width = container.offsetWidth;
  graphCanvas.height = 350;
  drawGraph();
}

function addToGraph(text) {
  playClick();
  if (!graphDisplay) return;
  graphDisplay.value += text;
  graphDisplay.focus();
}

function plotGraph() {
  playClick();
  if (!graphDisplay || !graphDisplay.value.trim()) return;
  
  const expr = graphDisplay.value.trim();
  
  try {
    testExpression(expr, 0);
    functions.push({ expr, color: `hsl(${functions.length * 60}, 70%, 50%)` });
    graphDisplay.value = "";
    drawGraph();
    renderFunctionList();
  } catch (e) {
    alert("Invalid expression: " + expr);
  }
}

function testExpression(expr, x) {
  const exp = expr
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan')
    .replace(/log/g, 'Math.log10')
    .replace(/ln/g, 'Math.log')
    .replace(/sqrt/g, 'Math.sqrt')
    .replace(/abs/g, 'Math.abs')
    .replace(/exp/g, 'Math.exp')
    .replace(/pow/g, 'Math.pow');
  
  return Function('"use strict"; return (' + exp + ')')(x);
}

function clearGraph() {
  playClick();
  functions = [];
  drawGraph();
  renderFunctionList();
}

function toggleIntersections() {
  playClick();
  showIntersections = !showIntersections;
  document.getElementById('intersectBtn').style.background = showIntersections ? 'var(--accent-blue)' : '';
  drawGraph();
}

function toggleDerivative() {
  playClick();
  showDerivative = !showDerivative;
  document.getElementById('derivBtn').style.background = showDerivative ? 'var(--accent-blue)' : '';
  drawGraph();
}

function renderFunctionList() {
  if (!functionList) return;
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

function findDerivative(expr) {
  const h = 0.0001;
  return function(x) {
    return (testExpression(expr, x + h) - testExpression(expr, x)) / h;
  };
}

function findIntersections() {
  if (!ctx || functions.length < 2) return [];
  
  const intersections = [];
  const scale = 40 * zoom;
  const centerX = graphCanvas.width / 2 + offsetX;
  const centerY = graphCanvas.height / 2 + offsetY;
  const tolerance = 0.1 / scale;
  
  for (let i = 0; i < functions.length; i++) {
    for (let j = i + 1; j < functions.length; j++) {
      const f1 = functions[i];
      const f2 = functions[j];
      
      for (let px = 1; px < graphCanvas.width; px++) {
        const x1 = (px - 1 - centerX) / scale;
        const x2 = (px - centerX) / scale;
        
        try {
          const y1f1 = testExpression(f1.expr, x1);
          const y2f1 = testExpression(f1.expr, x2);
          const y1f2 = testExpression(f2.expr, x1);
          const y2f2 = testExpression(f2.expr, x2);
          
          if (Math.sign(y1f1 - y1f2) !== Math.sign(y2f1 - y2f2)) {
            for (let iter = 0; iter < 20; iter++) {
              const xm = (x1 + x2) / 2;
              const ym1 = testExpression(f1.expr, xm);
              const ym2 = testExpression(f2.expr, xm);
              
              if (Math.abs(ym1 - ym2) < tolerance) {
                intersections.push({ x: xm, y: (ym1 + ym2) / 2, f1: f1.expr, f2: f2.expr });
                break;
              }
              
              if (Math.sign(ym1 - ym2) === Math.sign(y1f1 - y1f2)) {
                x1 = xm;
              } else {
                x2 = xm;
              }
            }
          }
        } catch (e) {}
      }
    }
  }
  return intersections;
}

function drawIntersections() {
  if (!showIntersections || functions.length < 2) return;
  
  const intersections = findIntersections();
  const scale = 40 * zoom;
  const centerX = graphCanvas.width / 2 + offsetX;
  const centerY = graphCanvas.height / 2 + offsetY;
  
  intersections.forEach((pt, i) => {
    const px = centerX + pt.x * scale;
    const py = centerY - pt.y * scale;
    
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#000";
    ctx.font = "11px sans-serif";
    ctx.fillText(`(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`, px + 8, py - 8);
  });
}

function drawDerivatives() {
  if (!showDerivative) return;
  
  const scale = 40 * zoom;
  const centerX = graphCanvas.width / 2 + offsetX;
  const centerY = graphCanvas.height / 2 + offsetY;
  
  functions.forEach((f, idx) => {
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    let first = true;
    for (let px = 0; px < graphCanvas.width; px++) {
      const x = (px - centerX) / scale;
      
      try {
        const deriv = (testExpression(f.expr, x + 0.01) - testExpression(f.expr, x)) / 0.01;
        const py = centerY - deriv * scale;
        
        if (py < -graphCanvas.height || py > graphCanvas.height * 2) {
          first = true;
          continue;
        }
        
        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      } catch (e) {
        first = true;
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
  });
}

function drawGraph() {
  if (!ctx || !graphCanvas) return;
  
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
  
  functions.forEach((f) => {
    ctx.strokeStyle = f.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    let first = true;
    let lastY = null;
    
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale;
      
      try {
        const y = testExpression(f.expr, x);
        if (!isFinite(y) || isNaN(y)) {
          first = true;
          continue;
        }
        
        const py = centerY - y * scale;
        
        if (py < -height || py > height * 2) {
          first = true;
          continue;
        }
        
        if (lastY !== null && Math.abs(py - lastY) > height * 0.5) {
          first = true;
        }
        
        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
        lastY = py;
      } catch (e) {
        first = true;
        lastY = null;
      }
    }
    ctx.stroke();
  });
  
  if (zoomLevel) zoomLevel.textContent = `Zoom: ${zoom}x`;
  
  drawIntersections();
  drawDerivatives();
}

graphCanvas && graphCanvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0) zoom *= 1.1;
  else zoom /= 1.1;
  zoom = Math.max(0.1, Math.min(10, zoom));
  drawGraph();
});

graphCanvas && graphCanvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

graphCanvas && graphCanvas.addEventListener('mousemove', (e) => {
  if (!graphCanvas) return;
  
  const rect = graphCanvas.getBoundingClientRect();
  const scale = 40 * zoom;
  const centerX = graphCanvas.width / 2 + offsetX;
  const centerY = graphCanvas.height / 2 + offsetY;
  const x = (e.clientX - rect.left - centerX) / scale;
  const y = -(e.clientY - rect.top - centerY) / scale;
  if (cursorPos) cursorPos.textContent = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
  
  if (isDragging) {
    offsetX += e.clientX - lastMouseX;
    offsetY += e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    drawGraph();
  }
});

graphCanvas && graphCanvas.addEventListener('mouseup', () => isDragging = false);
graphCanvas && graphCanvas.addEventListener('mouseleave', () => isDragging = false);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') plotGraph();
  if (e.key === 'Escape') clearGraph();
  if (e.key === 'c' || e.key === 'C') clearGraph();
});

document.addEventListener('DOMContentLoaded', () => {
  init();
  setTimeout(resizeCanvas, 200);
});