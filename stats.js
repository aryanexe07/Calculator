function parseData(input) {
  if (!input.trim()) return [];
  return input
    .split(/[,\s]+/)
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v));
}

function calculateMean(data) {
  if (data.length === 0) return 0;
  return data.reduce((a, b) => a + b, 0) / data.length;
}

function calculateMedian(data) {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateMode(data) {
  if (data.length === 0) return '-';
  const freq = {};
  data.forEach(v => freq[v] = (freq[v] || 0) + 1);
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
  if (modes.length === data.length) return '-';
  return modes.length === 1 ? modes[0] : modes.join(', ');
}

function calculateStdDev(data) {
  if (data.length === 0) return 0;
  const mean = calculateMean(data);
  const squaredDiffs = data.map(v => Math.pow(v - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / data.length);
}

function calculateStats() {
  const input = document.getElementById('dataInput').value;
  const data = parseData(input);
  
  if (data.length === 0) {
    document.getElementById('count').textContent = '-';
    document.getElementById('sum').textContent = '-';
    document.getElementById('mean').textContent = '-';
    document.getElementById('median').textContent = '-';
    document.getElementById('mode').textContent = '-';
    document.getElementById('range').textContent = '-';
    document.getElementById('stdDev').textContent = '-';
    document.getElementById('variance').textContent = '-';
    return;
  }
  
  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = calculateMean(data);
  const median = calculateMedian(data);
  const mode = calculateMode(data);
  const range = sorted[sorted.length - 1] - sorted[0];
  const stdDev = calculateStdDev(data);
  const variance = stdDev * stdDev;
  
  document.getElementById('count').textContent = data.length;
  document.getElementById('sum').textContent = sum.toFixed(4).replace(/\.?0+$/, '');
  document.getElementById('mean').textContent = mean.toFixed(4).replace(/\.?0+$/, '');
  document.getElementById('median').textContent = median.toFixed(4).replace(/\.?0+$/, '');
  document.getElementById('mode').textContent = mode;
  document.getElementById('range').textContent = range.toFixed(4).replace(/\.?0+$/, '');
  document.getElementById('stdDev').textContent = stdDev.toFixed(4).replace(/\.?0+$/, '');
  document.getElementById('variance').textContent = variance.toFixed(4).replace(/\.?0+$/, '');
}

function clearData() {
  playClick();
  document.getElementById('dataInput').value = '';
  calculateStats();
}

initTheme();