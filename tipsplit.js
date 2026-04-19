function updateTipPercent(val) {
  document.getElementById('tipPercent').textContent = val + '%';
  document.getElementById('tipPercentInput').value = val;
  calculate();
}

function updateTipFromInput(val) {
  const percent = parseFloat(val) || 0;
  document.getElementById('tipPercent').textContent = percent + '%';
  document.getElementById('tipSlider').value = percent;
  calculate();
}

function setTip(percent) {
  document.getElementById('tipSlider').value = percent;
  document.getElementById('tipPercent').textContent = percent + '%';
  document.getElementById('tipPercentInput').value = percent;
  calculate();
}

function calculate() {
  const billAmount = parseFloat(document.getElementById('billAmount').value) || 0;
  const tipPercent = parseFloat(document.getElementById('tipPercentInput').value) || 0;
  const numPeople = parseInt(document.getElementById('numPeople').value) || 1;
  
  const tipAmount = billAmount * (tipPercent / 100);
  const totalAmount = billAmount + tipAmount;
  const perPerson = numPeople > 0 ? totalAmount / numPeople : 0;
  
  document.getElementById('tipAmount').textContent = '$' + tipAmount.toFixed(2);
  document.getElementById('totalAmount').textContent = '$' + totalAmount.toFixed(2);
  document.getElementById('perPerson').textContent = '$' + perPerson.toFixed(2);
}

function swapUnits() {
  playClick();
}

initTheme();