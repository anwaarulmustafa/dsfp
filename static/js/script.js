const canvas = document.getElementById("dotsCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fit window width and match header height
canvas.width = window.innerWidth;
canvas.height = 500; // Match header height

const dots = [];
const maxDots = 50; // Number of dots
const connectionDistance = 150; // Max distance for connecting dots

// Utility: Random Number Generator
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Create Dot Object
class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = random(3, 6); // Dot size
    this.color = `rgba(200, 200, 200, ${random(0.5, 1)})`;
    this.dx = random(-1, 1); // Movement in x direction
    this.dy = random(-1, 1); // Movement in y direction
    this.rotationAngle = 0; // Initial rotation angle
  }

  // Draw the Dot
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotationAngle);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  // Update Dot Position and Rotation
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.rotationAngle += 0.05; // Rotation speed

    // Bounce off edges
    if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

    this.draw();
  }
}

// Create Dots
for (let i = 0; i < maxDots; i++) {
  dots.push(new Dot(random(0, canvas.width), random(0, canvas.height)));
}

// Connect Dots Based on Distance
function connectDots() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = `rgba(200, 200, 200, ${
          1 - distance / connectionDistance
        })`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

// Handle Mouse Interaction (Particles react to mouse movement)
canvas.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  dots.forEach((dot) => {
    const dx = dot.x - mouseX;
    const dy = dot.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      dot.dx += dx / 100; // Slightly adjust the speed based on distance from mouse
      dot.dy += dy / 100;
    }
  });
});

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach((dot) => dot.update());
  connectDots();
  requestAnimationFrame(animate);
}

animate();

