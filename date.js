function switchDateTab(tab) {
  playClick();
  document.querySelectorAll('.date-tabs .tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  document.getElementById('diffForm').classList.add('hidden');
  document.getElementById('addForm').classList.add('hidden');
  document.getElementById('weekdayForm').classList.add('hidden');
  
  document.getElementById(tab + 'Form').classList.remove('hidden');
}

function calculateDiff() {
  playClick();
  const start = new Date(document.getElementById('startDate').value);
  const end = new Date(document.getElementById('endDate').value);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    document.getElementById('diffResult').innerHTML = '<span class="error">Please select both dates</span>';
    return;
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;
  
  document.getElementById('diffResult').innerHTML = `
    <div class="result-item">Total Days: <strong>${diffDays}</strong></div>
    <div class="result-item">${years > 0 ? years + ' years, ' : ''}${months} months, ${days} days</div>
  `;
}

function calculateAdd() {
  playClick();
  const start = new Date(document.getElementById('startDateAdd').value);
  const days = parseInt(document.getElementById('daysToAdd').value);
  
  if (isNaN(start.getTime()) || isNaN(days)) {
    document.getElementById('addResult').innerHTML = '<span class="error">Please fill all fields</span>';
    return;
  }
  
  const result = new Date(start);
  result.setDate(result.getDate() + days);
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('addResult').innerHTML = `
    <div class="result-item">Result Date: <strong>${result.toLocaleDateString('en-US', options)}</strong></div>
    <div class="result-item">Day: <strong>${result.toLocaleDateString('en-US', { weekday: 'long' })}</strong></div>
  `;
}

function calculateWeekday() {
  playClick();
  const date = new Date(document.getElementById('weekdayDate').value);
  
  if (isNaN(date.getTime())) {
    document.getElementById('weekdayResult').innerHTML = '<span class="error">Please select a date</span>';
    return;
  }
  
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfWeek = date.getDay();
  
  document.getElementById('weekdayResult').innerHTML = `
    <div class="result-item">Day: <strong>${dayName}</strong></div>
    <div class="result-item">Day of Week: <strong>${dayOfWeek}</strong> (0=Sunday)</div>
  `;
}

function setToday(fieldId) {
  playClick();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById(fieldId).value = today;
}

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').value = today;
  document.getElementById('endDate').value = today;
  document.getElementById('startDateAdd').value = today;
  initTheme();
});