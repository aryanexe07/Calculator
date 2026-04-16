const display = document.getElementById("display");
const preview = document.getElementById("preview");
const memoryIndicator = document.getElementById("memoryIndicator");
const modeIndicator = document.getElementById("modeIndicator");
const historyList = document.getElementById("historyList");
const historyPanel = document.getElementById("historyPanel");
const copiedToast = document.getElementById("copiedToast");

let lastResult = null;
let memory = 0;
let isDegreeMode = false;
let history = [];
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playClick() {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 800;
  gain.gain.value = 0.1;
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.stop(audioCtx.currentTime + 0.05);
}

function playEqual() {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 600;
  gain.gain.value = 0.1;
  osc.start();
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  osc.stop(audioCtx.currentTime + 0.15);
}

function appendValue(value) {
  playClick();
  const current = display.value;
  
  if (value === '.') {
    const operators = ['+', '-', '*', '/'];
    for (const op of operators) {
      const parts = current.split(op);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.')) return;
    }
    if (current === '' || operators.some(op => current.endsWith(op))) {
      display.value += '0.';
      updatePreview();
      return;
    }
  }
  
  if (['+', '-', '*', '/'].includes(value)) {
    if (current === '') {
      if (value === '-') {
        display.value += value;
        updatePreview();
      }
      return;
    }
    if (current.endsWith('.') || current.endsWith('0.') && current.slice(0, -1).endsWith('/')) {
      return;
    }
    if (['+', '-', '*', '/'].includes(current.slice(-1))) {
      display.value = current.slice(0, -1) + value;
      updatePreview();
      return;
    }
  }
  
  display.value += value;
  updatePreview();
}

function updatePreview() {
  const expr = display.value;
  if (!expr) {
    preview.textContent = lastResult !== null ? `Ans: ${lastResult}` : '';
    return;
  }
  preview.textContent = expr;
}

function clearDisplay() {
  playClick();
  display.value = "";
  preview.textContent = lastResult !== null ? `Ans: ${lastResult}` : '';
}

function safeEval(expr) {
  const sanitized = expr.replace(/[^0-9+\-*/.]/g, '');
  if (sanitized !== expr) throw new Error('Invalid characters');
  
  const tokens = [];
  let num = '';
  for (let i = 0; i < sanitized.length; i++) {
    const ch = sanitized[i];
    if ('+-*/'.includes(ch)) {
      if (num) {
        tokens.push(parseFloat(num));
        num = '';
      }
      tokens.push(ch);
    } else {
      num += ch;
    }
  }
  if (num) tokens.push(parseFloat(num));
  
  if (tokens.length < 3) {
    if (tokens.length === 1) return tokens[0];
    throw new Error('Invalid expression');
  }
  
  let result = tokens[0];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const num = tokens[i + 1];
    if (num === undefined) throw new Error('Invalid expression');
    
    switch (op) {
      case '+': result += num; break;
      case '-': result -= num; break;
      case '*': result *= num; break;
      case '/': 
        if (num === 0) throw new Error('Division by zero');
        result /= num; 
        break;
      default: throw new Error('Unknown operator');
    }
  }
  
  if (!isFinite(result)) throw new Error('Invalid result');
  return result;
}

function calculate() {
  const expr = display.value.trim();
  
  if (expr === '') {
    if (lastResult !== null) {
      display.value = lastResult;
      preview.textContent = `Ans: ${lastResult}`;
    }
    return;
  }
  
  if (['+', '-', '*', '/'].includes(expr.slice(-1))) {
    display.value = "Error";
    setTimeout(() => {
      display.value = lastResult || "";
      updatePreview();
    }, 1500);
    return;
  }
  
  try {
    const result = safeEval(expr);
    
    if (typeof result !== 'number' || isNaN(result)) {
      throw new Error('Invalid result');
    }
    
    const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));
    const oldExpr = expr;
    const oldResult = lastResult;
    lastResult = formatted;
    display.value = formatted;
    preview.textContent = `${oldExpr} = ${formatted}`;
    
    addToHistory(oldExpr, formatted);
    playEqual();
  } catch (e) {
    display.value = "Error";
    setTimeout(() => {
      display.value = oldResult || "";
      updatePreview();
    }, 1500);
  }
}

function toggleSign() {
  playClick();
  const current = display.value;
  if (!current) return;
  
  try {
    display.value = safeEval(current) * -1;
  } catch {}
}

function percent() {
  playClick();
  const current = display.value;
  if (!current) return;
  
  try {
    display.value = safeEval(current) / 100;
  } catch {}
}

function square() {
  playClick();
  const current = display.value;
  if (!current) return;
  
  try {
    display.value = Math.pow(safeEval(current), 2);
  } catch {}
}

function squareRoot() {
  playClick();
  const current = display.value;
  if (!current) return;
  
  try {
    const val = safeEval(current);
    if (val < 0) {
      display.value = "Error";
      setTimeout(() => { display.value = ""; }, 1500);
      return;
    }
    display.value = Math.sqrt(val);
  } catch {}
}

function memoryAdd() {
  playClick();
  const current = display.value;
  if (!current) return;
  
  try {
    memory += safeEval(current);
    updateMemoryIndicator();
  } catch {}
}

function memorySub() {
  playClick();
  const current = display.value;
  if (!current) return;
  
  try {
    memory -= safeEval(current);
    updateMemoryIndicator();
  } catch {}
}

function memoryRecall() {
  playClick();
  display.value = memory;
  updatePreview();
}

function memoryClear() {
  playClick();
  memory = 0;
  updateMemoryIndicator();
}

function updateMemoryIndicator() {
  memoryIndicator.textContent = memory !== 0 ? `M: ${memory}` : '';
}

function toggleTheme() {
  playClick();
  const html = document.documentElement;
  if (html.getAttribute('data-theme') === 'light') {
    html.setAttribute('data-theme', 'dark');
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', 'light');
  }
  localStorage.setItem('calcTheme', html.getAttribute('data-theme') || 'dark');
}

function toggleMode() {
  playClick();
  isDegreeMode = !isDegreeMode;
  modeIndicator.textContent = isDegreeMode ? 'DEG' : 'RAD';
}

function toggleHistory() {
  playClick();
  historyPanel.classList.toggle('open');
}

function addToHistory(expr, result) {
  history.unshift({ expr, result });
  if (history.length > 10) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = history.map((item, i) => 
    `<div class="history-item" onclick="recallFromHistory(${i})">${item.expr} = ${item.result}</div>`
  ).join('');
}

function recallFromHistory(index) {
  playClick();
  display.value = history[index].result;
  updatePreview();
}

function clearHistory() {
  playClick();
  history = [];
  renderHistory();
}

function copyToClipboard() {
  const val = display.value;
  if (!val || val === 'Error') return;
  
  navigator.clipboard.writeText(val).then(() => {
    copiedToast.classList.add('show');
    setTimeout(() => copiedToast.classList.remove('show'), 1500);
  });
}

const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const particles = [];
const PARTICLE_COUNT = 70;
const MAX_DISTANCE = 120;

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    });
  }
}
initParticles();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < MAX_DISTANCE) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / MAX_DISTANCE})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();

document.addEventListener("keydown", (e) => {
  const key = e.key;
  
  if (key >= '0' && key <= '9') {
    appendValue(key);
    return;
  }
  
  if (key === '.') {
    appendValue('.');
    return;
  }
  
  if (key === '+' || key === '-' || key === '*' || key === '/') {
    appendValue(key);
    return;
  }
  
  if (key === 'Enter' || key === '=') {
    e.preventDefault();
    calculate();
    return;
  }
  
  if (key === 'Escape' || key === 'c' || key === 'C') {
    clearDisplay();
    return;
  }
  
  if (key === 'Backspace') {
    display.value = display.value.slice(0, -1);
    updatePreview();
    return;
  }
});

modeIndicator.addEventListener('click', toggleMode);

const savedTheme = localStorage.getItem('calcTheme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}