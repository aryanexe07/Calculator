
const display = document.getElementById("display");
let blinkInterval;


function resetBlink() {

  display.style.animation = "none";
  void display.offsetWidth; 
  display.style.animation = "digitBlink 2s infinite";
}


function appendValue(value) {
  display.value += value;
  resetBlink();
}

function clearDisplay() {
  display.value = "";
  resetBlink();
}

function calculate() {
  try {
   
    display.style.animation = "none";
    void display.offsetWidth;
    display.value = eval(display.value);
    display.style.animation = "digitBlink 2s infinite";
  } catch {
    display.value = "Error";
    resetBlink();
  }
}






const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const particles = [];
const PARTICLE_COUNT = 70;
const MAX_DISTANCE = 120;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < MAX_DISTANCE) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / MAX_DISTANCE})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();

setInterval(() => {
  display.classList.add("blink");
  setTimeout(() => {
    display.classList.remove("blink");
  }, 100); 
}, 2000); 
