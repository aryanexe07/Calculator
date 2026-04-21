let display, preview, modeIndicator, lastResult, isDegreeMode;

function init() {
  display = document.getElementById("display");
  preview = document.getElementById("preview");
  modeIndicator = document.getElementById("modeIndicator");
}

function appendValue(value) {
  playClick();
  if (!display) init();
  const current = display.value;
  
  if (value === '.') {
    const operators = ['+', '-', '*', '/'];
    for (const op of operators) {
      const parts = current.split(op);
      if (parts[parts.length - 1].includes('.')) return;
    }
    if (current === '' || operators.some(op => current.endsWith(op))) {
      display.value += '0.';
      return;
    }
  }
  
  if (['+', '-', '*', '/'].includes(value)) {
    if (current === '') {
      if (value === '-') display.value += value;
      return;
    }
    if (current.endsWith('.') || current.endsWith(')')) return;
    if (['+', '-', '*', '/'].includes(current.slice(-1))) {
      display.value = current.slice(0, -1) + value;
      return;
    }
  }
  
  display.value += value;
  updatePreview();
}

function backspace() {
  playClick();
  if (!display) init();
  display.value = display.value.slice(0, -1);
}

function updatePreview() {
  if (!display || !preview) return;
  preview.textContent = display.value || (lastResult !== null ? `Ans: ${lastResult}` : '');
}

function clearDisplay() {
  playClick();
  if (!display) init();
  display.value = "";
  preview.textContent = lastResult !== null ? `Ans: ${lastResult}` : '';
}

function scientificFunc(fn) {
  playClick();
  if (!display) init();
  const current = display.value;
  let val = current ? parseFloat(current) : 0;
  
  let result;
  
  switch (fn) {
    case 'sin':
      result = isDegreeMode ? Math.sin(val * Math.PI / 180) : Math.sin(val);
      break;
    case 'cos':
      result = isDegreeMode ? Math.cos(val * Math.PI / 180) : Math.cos(val);
      break;
    case 'tan':
      result = isDegreeMode ? Math.tan(val * Math.PI / 180) : Math.tan(val);
      break;
    case 'asin':
      result = isDegreeMode ? Math.asin(val) * 180 / Math.PI : Math.asin(val);
      break;
    case 'acos':
      result = isDegreeMode ? Math.acos(val) * 180 / Math.PI : Math.acos(val);
      break;
    case 'atan':
      result = isDegreeMode ? Math.atan(val) * 180 / Math.PI : Math.atan(val);
      break;
    case 'log':
      result = Math.log10(val);
      break;
    case 'ln':
      result = Math.log(val);
      break;
    case 'pi':
      result = Math.PI;
      display.value += Math.PI.toString();
      return;
    case 'e':
      result = Math.E;
      display.value += Math.E.toString();
      return;
    case 'sqrt':
      result = Math.sqrt(val);
      if (val < 0) { display.value = "Error"; return; }
      break;
    case 'square':
      result = val * val;
      break;
    case 'cube':
      result = val * val * val;
      break;
    case 'abs':
      result = Math.abs(val);
      break;
    case 'exp':
      result = Math.exp(val);
      break;
    case '10x':
      result = Math.pow(10, val);
      break;
    case '1/x':
      result = 1 / val;
      break;
    case 'fact':
      result = 1;
      for (let i = 2; i <= Math.round(val); i++) result *= i;
      break;
    case 'left':
      display.value += '(';
      return;
    case 'right':
      display.value += ')';
      return;
    default:
      return;
  }
  
  display.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));
}

function toggleMode() {
  playClick();
  isDegreeMode = !isDegreeMode;
  if (modeIndicator) modeIndicator.textContent = isDegreeMode ? 'DEG' : 'RAD';
}

function calculate() {
  if (!display) init();
  const expr = display.value.trim();
  
  if (!expr) {
    if (lastResult !== null) display.value = lastResult;
    return;
  }
  
  try {
    let exp = expr
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/abs/g, 'Math.abs')
      .replace(/exp/g, 'Math.exp')
      .replace(/pi/g, 'Math.PI')
      .replace(/\(/g, '(')
      .replace(/\)/g, ')');
    
    let result = Function('"use strict"; return (' + exp + ')')();
    
    if (typeof result !== 'number' || isNaN(result)) throw new Error();
    const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));
    lastResult = formatted;
    display.value = formatted;
    if (preview) preview.textContent = `${expr} = ${formatted}`;
    playEqual();
    addToHistory(expr, formatted);
  } catch (e) {
    display.value = "Error";
    setTimeout(() => { display.value = lastResult || ""; }, 1500);
  }
}

document.addEventListener('DOMContentLoaded', init);