function convertBase() {
  const input = document.getElementById('inputValue').value.trim();
  const fromBase = parseInt(document.getElementById('fromBase').value);
  
  if (!input) {
    clearResults();
    return;
  }
  
  try {
    const decimal = parseInt(input, fromBase);
    
    if (isNaN(decimal)) {
      document.getElementById('baseInfo').textContent = 'Invalid input for selected base';
      clearResults();
      return;
    }
    
    document.getElementById('binResult').value = decimal.toString(2);
    document.getElementById('octResult').value = decimal.toString(8);
    document.getElementById('decResult').value = decimal.toString(10);
    document.getElementById('hexResult').value = decimal.toString(16).toUpperCase();
    
    document.getElementById('baseInfo').textContent = `Decimal value: ${decimal}`;
  } catch (e) {
    clearResults();
    document.getElementById('baseInfo').textContent = 'Invalid input';
  }
}

function clearResults() {
  document.getElementById('binResult').value = '';
  document.getElementById('octResult').value = '';
  document.getElementById('decResult').value = '';
  document.getElementById('hexResult').value = '';
}

function copyResult(id) {
  const val = document.getElementById(id).value;
  if (val) {
    navigator.clipboard.writeText(val);
    document.getElementById('baseInfo').textContent = 'Copied to clipboard!';
  }
}

initTheme();