let display, preview, copiedToast, lastResult, audioCtx, history = [];
const CALCULATOR_NAME = 'basic';
const FAVORITE_KEY = 'calcFavorite';
const HISTORY_KEY = 'calcHistory';

function getFavCalculator() {
  return localStorage.getItem(FAVORITE_KEY);
}

function setFavCalculator(name) {
  localStorage.setItem(FAVORITE_KEY, name);
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
}

function saveHistory(entry) {
  const history = getHistory();
  history.unshift(entry);
  if (history.length > 50) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function clearHistory() {
  localStorage.setItem(HISTORY_KEY, '[]');
}

function useHistoryResult(value) {
  if (typeof appendValue === 'function') {
    display.value = '';
    appendValue(String(value));
  }
}

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playClick() {
  initAudio();
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.08;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {}
}

function playEqual() {
  initAudio();
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 600;
    gain.gain.value = 0.08;
    osc.start();
    osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {}
}

function safeEval(expr) {
  if (!expr || expr.trim() === '') return 0;
  const sanitized = expr.replace(/[^0-9+\-*/.()]/g, '');
  if (sanitized !== expr) throw new Error('Invalid');
  
  try {
    const tokens = [];
    let num = '';
    for (let i = 0; i < sanitized.length; i++) {
      const ch = sanitized[i];
      if ('+-*/'.includes(ch)) {
        if (num) { tokens.push(parseFloat(num)); num = ''; }
        tokens.push(ch);
      } else {
        num += ch;
      }
    }
    if (num) tokens.push(parseFloat(num));
    
    if (tokens.length < 1) return 0;
    if (tokens.length === 1) return tokens[0];
    if (tokens.length < 3) throw new Error('Invalid');
    
    let result = tokens[0];
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const num = tokens[i + 1];
      if (num === undefined) throw new Error('Invalid');
      switch (op) {
        case '+': result += num; break;
        case '-': result -= num; break;
        case '*': result *= num; break;
        case '/': if (num === 0) throw new Error('Div/0'); result /= num; break;
      }
    }
    return isFinite(result) ? result : 0;
  } catch (e) { return 0; }
}

function copyToClipboard(text) {
  let val = text;
  if (!val) {
    const el = document.getElementById('display');
    if (!el) return;
    val = el.value;
  }
  if (!val || val === 'Error') return;
  navigator.clipboard.writeText(val).then(() => {
    showToast('Copied!');
  });
}

function showToast(message) {
  let toast = document.getElementById('copiedToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copiedToast';
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function toggleHistory() {
  const panel = document.getElementById('historyPanel');
  if (panel) panel.classList.toggle('show');
}

function toggleFavorite() {
  const current = getFavCalculator();
  const pages = ['basic.html', 'scientific.html', 'graphing.html', 'converter.html', 'base.html', 'finance.html', 'date.html'];
  const names = ['Basic', 'Scientific', 'Graphing', 'Converter', 'Base', 'Finance', 'Date'];
  const currentIdx = pages.findIndex(p => window.location.href.includes(p));
  const nextIdx = (currentIdx + 1) % pages.length;
  setFavCalculator(names[nextIdx]);
  showToast(`Pinned: ${names[nextIdx]}`);
}

function renderHistory() {
  const container = document.getElementById('historyList');
  if (!container) return;
  const history = getHistory();
  if (history.length === 0) {
    container.innerHTML = '<div class="history-empty">No history yet</div>';
    return;
  }
  container.innerHTML = history.map((item, i) => 
    `<div class="history-item" onclick="useHistoryResult(${item.result})">
      <span class="history-expr">${item.expr}</span>
      <span class="history-result">= ${item.result}</span>
      <span class="history-copy" onclick="event.stopPropagation(); copyToClipboard('${item.result}')">📋</span>
    </div>`
  ).join('');
}

function addToHistory(expr, result) {
  if (expr && result !== undefined && result !== 'Error') {
    saveHistory({ expr, result, time: Date.now() });
    renderHistory();
  }
}

function toggleTheme() {
  playClick();
  const html = document.documentElement;
  if (html.getAttribute('data-theme') === 'light') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', 'light');
  }
  localStorage.setItem('calcTheme', html.getAttribute('data-theme') || 'dark');
}

function initTheme() {
  const saved = localStorage.getItem('calcTheme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

const canvas = document.getElementById("network");
if (canvas) {
  const ctx = canvas.getContext("2d");
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  
  const particles = [];
  const PARTICLE_COUNT = 50;
  const MAX_DISTANCE = 120;
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    });
  }
  
  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
  
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fill();
  
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DISTANCE) {
          ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / MAX_DISTANCE) * 0.3})`;
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
}

document.addEventListener("keydown", (e) => {
  const target = e.target;
  if (target.tagName === 'INPUT' && !target.classList.contains('no-shortcut')) return;
  
  const key = e.key;
  const ctrl = e.ctrlKey || e.metaKey;
  
  if (ctrl && key === 'c') { copyToClipboard(); return; }
  if (ctrl && key === 'h') { toggleHistory(); return; }
  if (ctrl && key === 'f') { e.preventDefault(); toggleFavorite(); return; }
  
  if (document.getElementById('graphCanvas') && key === 'i') {
    if (typeof toggleIntersections === 'function') toggleIntersections();
    return;
  }
  if (document.getElementById('graphCanvas') && key === 'd') {
    if (typeof toggleDerivative === 'function') toggleDerivative();
    return;
  }
  
  if (typeof appendValue === 'function' && key >= '0' && key <= '9') { appendValue(key); return; }
  if (typeof appendValue === 'function' && key === '.') { appendValue('.'); return; }
  if (typeof appendValue === 'function' && (key === '+' || key === '-' || key === '*' || key === '/')) { appendValue(key); return; }
  if (typeof appendValue === 'function' && key === '(') { appendValue('('); return; }
  if (typeof appendValue === 'function' && key === ')') { appendValue(')'); return; }
  if (typeof calculate === 'function' && (key === 'Enter' || key === '=')) { e.preventDefault(); calculate(); return; }
  if (typeof clearDisplay === 'function' && (key === 'Escape' || key === 'c' || key === 'C')) { clearDisplay(); return; }
  if (typeof backspace === 'function' && key === 'Backspace') { backspace(); return; }
  
  if (typeof switchTab === 'function' && key >= '1' && key <= '9' || key === '0') {
    const tabs = ['length', 'weight', 'temp', 'area', 'volume', 'speed', 'fuel', 'data', 'cooking', 'pressure', 'energy'];
    const tabsFinance = ['emi', 'interest', 'investment'];
    const tabsDate = ['diff', 'add', 'weekday'];
    
    if (document.querySelector('.finance-tabs')) {
      switchFinanceTab(tabsFinance[parseInt(key) - 1]);
    } else if (document.querySelector('.date-tabs')) {
      switchDateTab(tabsDate[parseInt(key) - 1]);
    } else if (document.querySelector('.converter-tabs')) {
      const tabIdx = key === '0' ? 9 : parseInt(key) - 1;
      switchTab(tabs[tabIdx]);
    }
    return;
  }
});

window.addEventListener('DOMContentLoaded', initTheme);