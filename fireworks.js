class Fireworks {
    constructor(canvasSel) {
      this.canvas = document.querySelector(canvasSel);
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
  
      this.fireworkCount = 10;
      this.fireworkRadius = 1;
      this.fireworkLifetime = 2000; // milliseconds
      this.sparkCount = 30;
      this.sparkRadius = 3;
      this.sparkLifetime = 1000; // milliseconds
      this.gravity = 0.2;
      this.fireworksSound = new Audio('fireworks_sound.mp3');
  
      this.starPositions = [
        { x: 100, y: 50 },
        { x: 200, y: 100 },
        { x: 300, y: 70 },
        { x: 400, y: 120 },
        { x: 500, y: 90 },
        { x: 600, y: 60 },
        { x: 700, y: 130 },
        { x: 800, y: 80 },
        { x: 900, y: 40 },
        { x: 1000, y: 110 }
      ];
  
      this.fireworks = [];
    }

    drawText() {
    const ctx = this.ctx;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const currentTime = performance.now() % 25000; // Animation duration: 25 seconds
    let colorStep;

    if (currentTime < 5000) {
      colorStep = 0; // White
    } else if (currentTime < 10000) {
      colorStep = 1; // Red
    } else if (currentTime < 15000) {
      colorStep = 2; // Yellow
    } else if (currentTime < 20000) {
      colorStep = 3; // Green
    } else {
      colorStep = 4; // Pink
    }

    const colors = ["white", "#ff0000", "#ffcc00", "#00ff00", "pink"];
    ctx.fillStyle = colors[colorStep];
    ctx.fillText("Congratulations!!!", canvasWidth / 2, canvasHeight / 2);
  }

    drawStars() {
      this.ctx.fillStyle = "#fff"; // white
      for (const position of this.starPositions) {
        let x = position.x;
        let y = position.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 2, y + 4);
        this.ctx.lineTo(x + 5, y + 4);
        this.ctx.lineTo(x + 3, y + 7);
        this.ctx.lineTo(x + 4, y + 10);
        this.ctx.lineTo(x, y + 8);
        this.ctx.lineTo(x - 4, y + 10);
        this.ctx.lineTo(x - 3, y + 7);
        this.ctx.lineTo(x - 5, y + 4);
        this.ctx.lineTo(x - 2, y + 4);
        this.ctx.closePath();
        this.ctx.fill();
      }
    }
  
    drawMoon() {
      const moonX = this.canvas.width - 160; // Right side
      const moonY = 100;
      this.ctx.beginPath();
      this.ctx.arc(moonX, moonY, 60, 0, 2 * Math.PI);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(moonX - 50, moonY, 60, 0, 2 * Math.PI); // Adjusted the x position to the left
      this.ctx.fillStyle = '#000';
      this.ctx.fill();
    }
  
    drawBackground() {
      const houseCount = 5; // Number of houses
      const houseWidth = 150; // Increased house width
      const spacing = (this.canvas.width - houseWidth * houseCount) / (houseCount + 1); // Calculate spacing between houses
  
      for (let i = 0; i < houseCount; i++) {
        let baseX = spacing + i * (houseWidth + spacing); // Calculate x position of each house
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(baseX, this.canvas.height - 150, houseWidth, 150); // Increased house height
        this.ctx.fillStyle = 'yellow';
        this.ctx.beginPath();
        this.ctx.moveTo(baseX, this.canvas.height - 150);
        this.ctx.lineTo(baseX + houseWidth / 2, this.canvas.height - 200);
        this.ctx.lineTo(baseX + houseWidth, this.canvas.height - 150);
        this.ctx.closePath();
        this.ctx.fill();
  
        // Person near each house
        this.ctx.beginPath();
        this.ctx.arc(baseX + houseWidth / 2, this.canvas.height - 75, 15, 0, 2 * Math.PI); // Increased person size
        this.ctx.fillStyle = 'beige';
        this.ctx.fill();
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(baseX + houseWidth / 2 - 15, this.canvas.height - 60, 30, 45); // Adjusted person position
      }
    }
  
    gameLoop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawMoon();
      this.drawBackground();
      this.drawStars();
      this.drawText();
      if (this.fireworks.length < this.fireworkCount && Math.random() < 0.1) {
        this.fireworks.push(new Firework(this));
      }
      for (let i = 0; i < this.fireworks.length; i++) {
        const firework = this.fireworks[i];
        firework.update();
        firework.draw();
        if (performance.now() - firework.createdAt > this.fireworkLifetime) {
          this.fireworks.splice(i, 1);
          i--;
        }
      }
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  
    run() {
      this.gameLoop();
    }
  }
  
  class Firework {
    constructor(parent) {
      this.parent = parent;
      this.x = Math.random() * parent.canvas.width;
      this.y = Math.random() * (parent.canvas.height / 2); // Ensures fireworks spawn in the upper half
      this.vx = Math.random() * 4 - 2;
      this.vy = Math.random() * -10 - 5;
      this.radius = parent.fireworkRadius;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.createdAt = performance.now();
      this.sparks = [];
      parent.fireworksSound.play();
    }
  
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.parent.gravity;
      if (this.y + this.radius >= 0 && this.sparks.length < this.parent.sparkCount) {
        for (let i = 0; i < this.parent.sparkCount; i++) {
          this.sparks.push(new Spark(this.x, this.y, this.color, this.parent));
        }
      }
      for (let i = 0; i < this.sparks.length; i++) {
        const spark = this.sparks[i];
        spark.update();
        if (performance.now() - spark.createdAt > this.parent.sparkLifetime) {
          this.sparks.splice(i, 1);
          i--;
        }
      }
    }
  
    draw() {
      const ctx = this.parent.ctx;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      for (const spark of this.sparks) {
        spark.draw();
      }
    }
  }
  
  class Spark {
    constructor(x, y, color, parent) {
      this.parent = parent;
      this.x = x;
      this.y = y;
      this.vx = Math.random() * 4 - 2;
      this.vy = Math.random() * -4 - 2;
      this.radius = parent.sparkRadius;
      this.color = color;
      this.createdAt = performance.now();
    }
      
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.parent.gravity;
    }
      
    draw() {
      const ctx = this.parent.ctx;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
}