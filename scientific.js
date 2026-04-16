display = document.getElementById("display");
preview = document.getElementById("preview");
const modeIndicator = document.getElementById("modeIndicator");
let isDegreeMode = false;
let lastResult = null;
let pendingOp = null;

function appendValue(value) {
  playClick();
  const current = display.value;
  
  if (value === '.') {
    const operators = ['+', '-', '*', '/', ','];
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
  
  if (['+', '-', '*', '/', ','].includes(value)) {
    if (current === '') {
      if (value === '-') { display.value += value; updatePreview(); }
      return;
    }
    if (current.endsWith('.') || current.endsWith(')') || current.endsWith('!')) return;
    if (['+', '-', '*', '/', ','].includes(current.slice(-1))) {
      display.value = current.slice(0, -1) + value;
      updatePreview();
      return;
    }
  }
  
  display.value += value;
  updatePreview();
}

function backspace() {
  playClick();
  display.value = display.value.slice(0, -1);
  updatePreview();
}

function updatePreview() {
  preview.textContent = display.value || (lastResult !== null ? `Ans: ${lastResult}` : '');
}

function clearDisplay() {
  playClick();
  display.value = "";
  preview.textContent = lastResult !== null ? `Ans: ${lastResult}` : '';
  pendingOp = null;
}

function scientificFunc(fn) {
  playClick();
  const current = display.value;
  const val = current ? safeEval(current) : 0;
  
  let result;
  
  switch (fn) {
    case 'sin': result = isDegreeMode ? Math.sin(val * Math.PI / 180) : Math.sin(val); break;
    case 'cos': result = isDegreeMode ? Math.cos(val * Math.PI / 180) : Math.cos(val); break;
    case 'tan': result = isDegreeMode ? Math.tan(val * Math.PI / 180) : Math.tan(val); break;
    case 'asin': result = isDegreeMode ? Math.asin(val) * 180 / Math.PI : Math.asin(val); break;
    case 'acos': result = isDegreeMode ? Math.acos(val) * 180 / Math.PI : Math.acos(val); break;
    case 'atan': result = isDegreeMode ? Math.atan(val) * 180 / Math.PI : Math.atan(val); break;
    case 'log': result = Math.log10(val); break;
    case 'ln': result = Math.log(val); break;
    case 'pi': result = Math.PI; break;
    case 'e': result = Math.E; break;
    case 'pow': pendingOp = 'pow'; display.value += '^'; return;
    case 'fact':
      result = 1;
      for (let i = 2; i <= Math.round(val); i++) result *= i;
      break;
    case 'sqrt': result = Math.sqrt(val); break;
    case 'square': result = val * val; break;
    case 'cube': result = val * val * val; break;
    case 'abs': result = Math.abs(val); break;
    case 'exp': result = Math.exp(val); break;
    case '10x': result = Math.pow(10, val); break;
    case '1/x': result = 1 / val; break;
    case 'mod': display.value += ' % '; playClick(); return;
    case 'left': display.value += '('; updatePreview(); return;
    case 'right': display.value += ')'; updatePreview(); return;
    default: return;
  }
  
  if (pendingOp === 'pow' && val) {
    display.value = Math.pow(val, safeEval(current));
    pendingOp = null;
  } else {
    display.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));
  }
  updatePreview();
}

function toggleMode() {
  playClick();
  isDegreeMode = !isDegreeMode;
  modeIndicator.textContent = isDegreeMode ? 'DEG' : 'RAD';
}

function calculate() {
  const expr = display.value;
  if (!expr) {
    if (lastResult !== null) { display.value = lastResult; preview.textContent = `Ans: ${lastResult}`; }
    return;
  }
  
  try {
    const exp = expr.replace(/\^/g, '**').replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan').replace(/log/g, 'Math.log10').replace(/ln/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt').replace(/abs/g, 'Math.abs').replace(/exp/g, 'Math.exp')
      .replace(/PI/g, 'Math.PI').replace(/E/g, 'Math.E').replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E').replace(/\(/g, '(').replace(/\)/g, ')');
    
    let result = Function('"use strict"; return (' + exp + ')')();
    
    if (typeof result !== 'number' || isNaN(result)) throw new Error();
    const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));
    lastResult = formatted;
    display.value = formatted;
    preview.textContent = `${expr} = ${formatted}`;
    playEqual();
  } catch (e) {
    display.value = "Error";
    setTimeout(() => { display.value = lastResult || ""; updatePreview(); }, 1500);
  }
}