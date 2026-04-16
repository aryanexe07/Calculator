const units = {
  length: {
    units: ['m', 'km', 'cm', 'mm', 'mile', 'yard', 'foot', 'inch'],
    names: { m: 'Meter', km: 'Kilometer', cm: 'Centimeter', mm: 'Millimeter', mile: 'Mile', yard: 'Yard', foot: 'Foot', inch: 'Inch' }
  },
  weight: {
    units: ['kg', 'g', 'mg', 'lb', 'oz', 'ton'],
    names: { kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce', ton: 'Metric Ton' }
  },
  temp: {
    units: ['C', 'F', 'K'],
    names: { C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin' }
  },
  area: {
    units: ['sqm', 'sqkm', 'sqcm', 'sqmile', 'sqyard', 'sqfoot', 'acre', 'hectare'],
    names: { sqm: 'Sq Meter', sqkm: 'Sq KM', sqcm: 'Sq CM', sqmile: 'Sq Mile', sqyard: 'Sq Yard', sqfoot: 'Sq Foot', acre: 'Acre', hectare: 'Hectare' }
  },
  volume: {
    units: ['l', 'ml', 'gallon', 'quart', 'pint', 'cup', 'cubicm'],
    names: { l: 'Liter', ml: 'Milliliter', gallon: 'Gallon', quart: 'Quart', pint: 'Pint', cup: 'Cup', cubicm: 'Cubic Meter' }
  },
  speed: {
    units: ['mps', 'kph', 'mph', 'fps', 'knot'],
    names: { mps: 'm/s', kph: 'km/h', mph: 'mph', fps: 'ft/s', knot: 'Knot' }
  }
};

let currentCategory = 'length';

const conversions = {
  length: {
    m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254
  },
  weight: {
    kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000
  },
  temp: {
    C: 'C', F: 'F', K: 'K'
  },
  area: {
    sqm: 1, sqkm: 1000000, sqcm: 0.0001, sqmile: 2589988.11, sqyard: 0.836127, sqfoot: 0.092903, acre: 4046.86, hectare: 10000
  },
  volume: {
    l: 1, ml: 0.001, gallon: 3.78541, quart: 0.946353, pint: 0.473176, cup: 0.236588, cubicm: 1000
  },
  speed: {
    mps: 1, kph: 0.277778, mph: 0.44704, fps: 0.3048, knot: 0.514444
  }
};

function switchTab(category) {
  playClick();
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  currentCategory = category;
  loadUnits();
  convert();
}

function loadUnits() {
  const fromUnit = document.getElementById('fromUnit');
  const toUnit = document.getElementById('toUnit');
  const data = units[currentCategory];
  
  fromUnit.innerHTML = data.units.map(u => `<option value="${u}">${data.names[u]}</option>`).join('');
  toUnit.innerHTML = data.units.map(u => `<option value="${u}">${data.names[u]}</option>`).join('');
  
  if (data.units.length > 1) {
    toUnit.selectedIndex = 1;
  }
  
  const formulas = document.getElementById('formulas');
  if (currentCategory === 'temp') {
    formulas.innerHTML = '<p>C = (F-32)×5/9</p><p>K = C + 273.15</p>';
  } else {
    formulas.innerHTML = '<p>All conversions relative to base unit</p>';
  }
}

function convert() {
  const val = parseFloat(document.getElementById('fromValue').value);
  const from = document.getElementById('fromUnit').value;
  const to = document.getElementById('toUnit').value;
  
  if (isNaN(val)) {
    document.getElementById('toValue').value = '';
    return;
  }
  
  let result;
  if (currentCategory === 'temp') {
    let celsius;
    if (from === 'C') celsius = val;
    else if (from === 'F') celsius = (val - 32) * 5 / 9;
    else celsius = val - 273.15;
    
    if (to === 'C') result = celsius;
    else if (to === 'F') result = celsius * 9 / 5 + 32;
    else result = celsius + 273.15;
  } else {
    const base = val * conversions[currentCategory][from];
    result = base / conversions[currentCategory][to];
  }
  
  document.getElementById('toValue').value = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
}

function swapUnits() {
  playClick();
  const from = document.getElementById('fromUnit');
  const to = document.getElementById('toUnit');
  const fromVal = document.getElementById('fromValue').value;
  const toVal = document.getElementById('toValue').value;
  
  from.selectedIndex = to.selectedIndex;
  to.selectedIndex = from.selectedIndex === 0 ? 1 : 0;
  
  document.getElementById('fromValue').value = toVal;
  convert();
}

initTheme();
loadUnits();