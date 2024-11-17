const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Game variables
let ship = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 20 };
let bullets = [];
let enemies = [];
let enemyRows = 3;
let enemyColumns = 7;
let isGameOver = false;
let enemyDirection = 1;
let enemySpeed = 1;
let score = 0;

// Create enemies
for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyColumns; col++) {
        enemies.push({
            x: col * 80 + 50,
            y: row * 50 + 30,
            width: 40,
            height: 20,
            isAlive: true
        });
    }
}

// Draw ship
function drawShip() {
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = "#ff0000";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.isAlive) {
            ctx.fillStyle = "#2d7ed1";
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(enemy.x + 10, enemy.y + 5, 5, 5);
            ctx.fillRect(enemy.x + 25, enemy.y + 5, 5, 5);
            ctx.strokeStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(enemy.x + 20, enemy.y + 12, 8, 0, Math.PI, false);
            ctx.stroke();
        }
    });
}

// Update bullets
function updateBullets() {
    bullets.forEach((bullet, bulletIndex) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(bulletIndex, 1);

        enemies.forEach((enemy, enemyIndex) => {
            if (
                enemy.isAlive &&
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemy.isAlive = false;
                bullets.splice(bulletIndex, 1);
                score += 10;
                document.getElementById("score").textContent = `Score: ${score}`;
            }
        });
    });
}

// Move enemies
function moveEnemies() {
    let changeDirection = false;

    enemies.forEach(enemy => {
        if (enemy.isAlive) {
            enemy.x += enemyDirection * enemySpeed;
            if (enemy.x + enemy.width >= canvas.width || enemy.x <= 0) {
                changeDirection = true;
            }
        }
    });

    if (changeDirection) {
        enemyDirection *= -1;
        enemies.forEach(enemy => {
            enemy.y += 20;
            if (enemy.isAlive && enemy.y + enemy.height >= canvas.height) {
                alert("Game Over! Les ennemis ont atteint la base.");
                cancelAnimationFrame(gameLoop);
            }
        });
    }
}

// Update game
function updateGame() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveEnemies();
    drawShip();
    drawBullets();
