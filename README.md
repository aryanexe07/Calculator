# Calculator Suite

A comprehensive, multi-purpose calculator application with a sleek modern interface. Features six specialized calculators for different calculation needs, built entirely with **HTML, CSS, and JavaScript**.

---

## Features

- **Modern UI** - Clean, dark-mode-first design with light theme support
- **Animated Background** - Network canvas effect for a polished appearance  
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Multiple Calculators** - Six specialized calculator modes in one app
- **Zero Dependencies** - Pure vanilla JavaScript, no external libraries
- **Intuitive Controls** - Click buttons or use keyboard input
- **Copy to Clipboard** - Click the display to copy results

---

## Calculator Types

### 1. **Basic Calculator**
Simple arithmetic operations with a clean, familiar layout.
- Addition, subtraction, multiplication, division
- Clear and backspace functions
- Real-time calculation preview

### 2. **Scientific Calculator**
Advanced mathematical functions for complex calculations.
- Trigonometric functions (sin, cos, tan and inverses)
- Logarithmic functions (log, ln)
- Power and root operations
- RAD/DEG mode toggle for angle calculations
- Memory functions

### 3. **Graphing Calculator**
Plot and visualize mathematical functions.
- Graph custom functions
- Visual equation representation
- Interactive coordinate system

### 4. **Unit Converter**
Convert between different units of measurement.
- Length conversions (meters, feet, inches, kilometers, etc.)
- Weight conversions (kg, lbs, grams, etc.)
- Volume, temperature, and more
- Instant conversion results

### 5. **Base Converter**
Convert numbers between different numerical bases.
- Binary (Base 2)
- Octal (Base 8)
- Decimal (Base 10)
- Hexadecimal (Base 16)

### 6. **Finance Calculator**
Financial computation tools for loans and investments.
- Loan calculator with payment estimations
- Interest calculations
- Investment growth projections
- Amortization schedules

---

## Getting Started

### Installation
No installation required! This is a pure web-based application.

### Usage
1. Open `index.html` in your web browser
2. Select your desired calculator from the menu
3. Start calculating!

**Keyboard Support:**
- Numbers: Use number keys (0-9)
- Operations: Use `+`, `-`, `*`, `/`
- Equals: Press `Enter`
- Clear: Press `C`
- Backspace: Press `Backspace`

---

## Project Structure

```
Calculator/
├── index.html           # Main menu/navigation page
├── style.css            # Global styling with theme support
├── script.js            # Menu and shared utilities
├── shared.js            # Shared functions across calculators
│
├── basic.html           # Basic calculator
├── basic.js             # Basic calculator logic
│
├── scientific.html      # Scientific calculator
├── scientific.js        # Scientific calculator functions
│
├── graphing.html        # Graphing calculator
├── graphing.js          # Graphing engine
│
├── converter.html       # Unit converter
├── converter.js         # Conversion logic
│
├── base.html            # Base converter
├── base.js              # Base conversion functions
│
├── finance.html         # Finance calculator
├── finance.js           # Finance calculations
│
└── README.md            # This file
```

---

## Customization

### Theme Switching
The application includes built-in light and dark theme support via CSS variables in `style.css`:

```css
:root {
  --bg-primary: #0f0f23;
  --accent-orange: #ff9500;
  /* ... more variables ... */
}

[data-theme="light"] {
  --bg-primary: #f0f0f8;
  /* ... light theme colors ... */
}
```

### Colors Used
- **Primary**: Dark navy backgrounds
- **Accent**: Orange (#ff9500), Red (#ff3b30), Blue (#007aff), Green (#34c759)
- **Text**: White on dark, dark on light

---

## Technologies

- **HTML5** - Semantic markup
- **CSS3** - Styling with CSS Variables for theming
- **JavaScript (ES6+)** - Core logic and interactivity
- **Canvas API** - Animated background effects

---

## How to Use Each Calculator

### Basic Calculator
1. Select from the menu
2. Click number buttons to enter values
3. Click operation buttons (+, -, *, /)
4. Click = to calculate
5. Use C to clear, ⌫ to backspace

### Scientific Calculator
1. Switch between RAD and DEG mode by clicking the mode indicator
2. Use trig functions (sin, cos, tan) and their inverses
3. Access logarithmic functions (log, ln)
4. Use π and e constants

### Graphing Calculator
1. Enter a mathematical function
2. Set domain range
3. Visualize the graph
4. Zoom and pan to explore

### Unit Converter
1. Select the unit type to convert
2. Choose source unit
3. Choose target unit
4. Enter value to convert
5. Result displays instantly

### Base Converter
1. Enter a number in any base
2. View conversions to other bases
3. Copy results as needed

### Finance Calculator
1. Enter loan/investment parameters
2. Choose calculation type
3. View results with breakdown
4. Print amortization schedule if needed

---

## License

This project is open source and available for personal and educational use.

---

## Future Enhancements

- [ ] Calculation history
- [ ] Keyboard input support for all calculators
- [ ] Export results to CSV
- [ ] More unit types in converter
- [ ] Matrix operations
- [ ] Equation solver
- [ ] Statistical functions

---

**Created with care for math lovers and calculation enthusiasts.**
