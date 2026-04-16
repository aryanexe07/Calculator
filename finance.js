function switchFinanceTab(tab) {
  playClick();
  document.querySelectorAll('.finance-tabs .tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  document.getElementById('emiForm').classList.add('hidden');
  document.getElementById('interestForm').classList.add('hidden');
  document.getElementById('investmentForm').classList.add('hidden');
  
  document.getElementById(tab + 'Form').classList.remove('hidden');
}

function calculateEMI() {
  playClick();
  const principal = parseFloat(document.getElementById('loanAmount').value);
  const rate = parseFloat(document.getElementById('interestRate').value);
  const months = parseInt(document.getElementById('loanTerm').value);
  
  if (isNaN(principal) || isNaN(rate) || isNaN(months)) {
    document.getElementById('emiResult').innerHTML = '<span class="error">Please fill all fields</span>';
    return;
  }
  
  const monthlyRate = rate / 12 / 100;
  let emi;
  
  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  }
  
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  
  document.getElementById('emiResult').innerHTML = `
    <div class="result-item">Monthly EMI: <strong>₹${emi.toFixed(2)}</strong></div>
    <div class="result-item">Total Interest: <strong>₹${totalInterest.toFixed(2)}</strong></div>
    <div class="result-item">Total Payment: <strong>₹${totalPayment.toFixed(2)}</strong></div>
  `;
}

function calculateInterest() {
  playClick();
  const principal = parseFloat(document.getElementById('principal').value);
  const rate = parseFloat(document.getElementById('rate').value);
  const time = parseFloat(document.getElementById('time').value);
  const type = document.getElementById('interestType').value;
  
  if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
    document.getElementById('interestResult').innerHTML = '<span class="error">Please fill all fields</span>';
    return;
  }
  
  let interest, amount;
  const r = rate / 100;
  
  if (type === 'simple') {
    interest = principal * r * time;
    amount = principal + interest;
  } else {
    amount = principal * Math.pow(1 + r, time);
    interest = amount - principal;
  }
  
  document.getElementById('interestResult').innerHTML = `
    <div class="result-item">Principal: <strong>₹${principal.toFixed(2)}</strong></div>
    <div class="result-item">Interest: <strong>₹${interest.toFixed(2)}</strong></div>
    <div class="result-item">Total Amount: <strong>₹${amount.toFixed(2)}</strong></div>
  `;
}

function calculateInvestment() {
  playClick();
  const monthly = parseFloat(document.getElementById('monthlyInvest').value);
  const annualRate = parseFloat(document.getElementById('annualReturn').value);
  const years = parseInt(document.getElementById('investYears').value);
  
  if (isNaN(monthly) || isNaN(annualRate) || isNaN(years)) {
    document.getElementById('investmentResult').innerHTML = '<span class="error">Please fill all fields</span>';
    return;
  }
  
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  let futureValue = 0;
  
  if (monthlyRate === 0) {
    futureValue = monthly * months;
  } else {
    futureValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }
  
  const totalInvested = monthly * months;
  const totalReturns = futureValue - totalInvested;
  
  document.getElementById('investmentResult').innerHTML = `
    <div class="result-item">Total Invested: <strong>₹${totalInvested.toFixed(2)}</strong></div>
    <div class="result-item">Total Returns: <strong>₹${totalReturns.toFixed(2)}</strong></div>
    <div class="result-item">Future Value: <strong>₹${futureValue.toFixed(2)}</strong></div>
  `;
}

initTheme();