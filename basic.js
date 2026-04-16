display = document.getElementById("display");
preview = document.getElementById("preview");
lastResult = null;

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
      if (value === '-') { display.value += value; updatePreview(); }
      return;
    }
    if (current.endsWith('.') || (current.endsWith('0.') && current.slice(0, -1).endsWith('/'))) return;
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
  preview.textContent = expr || (lastResult !== null ? `Ans: ${lastResult}` : '');
}

function clearDisplay() {
  playClick();
  display.value = "";
  preview.textContent = lastResult !== null ? `Ans: ${lastResult}` : '';
}

function backspace() {
  playClick();
  display.value = display.value.slice(0, -1);
  updatePreview();
}

function calculate() {
  const expr = display.value.trim();
  if (expr === '') {
    if (lastResult !== null) { display.value = lastResult; preview.textContent = `Ans: ${lastResult}`; }
    return;
  }
  if (['+', '-', '*', '/'].includes(expr.slice(-1))) {
    display.value = "Error";
    setTimeout(() => { display.value = lastResult || ""; updatePreview(); }, 1500);
    return;
  }
  
  try {
    const result = safeEval(expr);
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