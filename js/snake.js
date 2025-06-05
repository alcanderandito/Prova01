document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return; // Se non siamo nella pagina giusta, esci
    const ctx = canvas.getContext('2d');

    const livesDisplay = document.getElementById('livesDisplay');
    const currentScoreDisplay = document.getElementById('currentScoreDisplay');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverFinalScoreDisplay = document.getElementById('gameOverFinalScoreDisplay');
    const restartButton = document.getElementById('restartButton');
    const turnLeftButton = document.getElementById('turnLeftButton');
    const turnRightButton = document.getElementById('turnRightButton');
    const homeButton = document.getElementById('homeButton');

    const saltyFoods = ["🥨", "🍔", "🍟", "🍕", "🍿", "🥓", "🧀", "🍣", "🌭", "🌮", "🌯", "🍗", "🍖", "🍤", "🥟", "🫔", "🥪", "🫓", "🫕", "🧂", "🥐", "🥯", "🍳", "🫒", "🍄", "🥜", "🍜", "🍲", "🍛", "🍝", "🥫", "🍙", "🍘", "🍢", "🦀", "🦞", "🦐", "🦑", "🦪", "🫘", "🌽"];

    const GRID_SIZE = 20;
    let cellSize;
    let snake;
    let food;
    let direction;
    let currentScore;
    let totalFinalScore;
    let lives;
    const INITIAL_LIVES = 5;
    let gameInterval;
    const GAME_SPEED = 130;
    let canChangeDirection;
    let isPaused = false;

    function resizeCanvas() {
        const availableWidth = window.innerWidth * 0.95;
        const effectiveInnerHeight = window.innerHeight - 60 - 20;
        const availableHeightForCanvas = effectiveInnerHeight * 0.50;

        let canvasSize = Math.min(availableWidth, availableHeightForCanvas, 450);
        canvasSize = Math.floor(canvasSize / GRID_SIZE) * GRID_SIZE;

        canvas.width = canvasSize;
        canvas.height = canvasSize;
        cellSize = canvas.width / GRID_SIZE;
    }

    function initializeSnake() {
        snake = [
            { x: Math.floor(GRID_SIZE / 2) + 2, y: Math.floor(GRID_SIZE / 2) },
            { x: Math.floor(GRID_SIZE / 2) + 1, y: Math.floor(GRID_SIZE / 2) },
            { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }
        ];
        direction = { dx: 1, dy: 0 };
        canChangeDirection = true;
    }

    function getRandomPosition() {
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    }

    function spawnFood() {
        let newFoodPosition;
        do {
            newFoodPosition = getRandomPosition();
        } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
        
        food = {
            ...newFoodPosition,
            emoji: saltyFoods[Math.floor(Math.random() * saltyFoods.length)]
        };
    }

    function updateUI() {
        livesDisplay.textContent = lives;
        currentScoreDisplay.textContent = currentScore;
        finalScoreDisplay.textContent = totalFinalScore;
    }

    function drawRoundedRect(x, y, width, height, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
    
    function drawGame() {
        ctx.fillStyle = '#1f2b38';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${cellSize * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(food.emoji, (food.x + 0.5) * cellSize, (food.y + 0.5) * cellSize);

        snake.forEach((segment, index) => {
            const segmentX = segment.x * cellSize;
            const segmentY = segment.y * cellSize;
            const color = index === 0 ? '#2ecc71' : '#27ae60';
            drawRoundedRect(segmentX, segmentY, cellSize, cellSize, cellSize * 0.25, color);

            if (index === 0) {
                ctx.fillStyle = 'white';
                const eyeSize = cellSize * 0.15;
                let eye1X, eye1Y, eye2X, eye2Y;

                if (direction.dx === 1) { 
                    eye1X = segmentX + cellSize * 0.65; eye1Y = segmentY + cellSize * 0.25;
                    eye2X = segmentX + cellSize * 0.65; eye2Y = segmentY + cellSize * 0.75;
                } else if (direction.dx === -1) { 
                    eye1X = segmentX + cellSize * 0.35; eye1Y = segmentY + cellSize * 0.25;
                    eye2X = segmentX + cellSize * 0.35; eye2Y = segmentY + cellSize * 0.75;
                } else if (direction.dy === 1) { 
                    eye1X = segmentX + cellSize * 0.25; eye1Y = segmentY + cellSize * 0.65;
                    eye2X = segmentX + cellSize * 0.75; eye2Y = segmentY + cellSize * 0.65;
                } else { 
                    eye1X = segmentX + cellSize * 0.25; eye1Y = segmentY + cellSize * 0.35;
                    eye2X = segmentX + cellSize * 0.75; eye2Y = segmentY + cellSize * 0.35;
                }
                ctx.beginPath();
                ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
                ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'black';
                const pupilSize = eyeSize * 0.5;
                ctx.beginPath();
                ctx.arc(eye1X + direction.dx * pupilSize *0.5, eye1Y + direction.dy * pupilSize *0.5, pupilSize, 0, Math.PI * 2);
                ctx.arc(eye2X + direction.dx * pupilSize*0.5, eye2Y + direction.dy * pupilSize*0.5, pupilSize, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function moveSnake() {
        const head = { x: snake[0].x + direction.dx, y: snake[0].y + direction.dy };

        if (head.x >= GRID_SIZE) head.x = 0;
        if (head.x < 0) head.x = GRID_SIZE - 1;
        if (head.y >= GRID_SIZE) head.y = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            currentScore++;
            totalFinalScore++;
            spawnFood();
            updateUI();
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                return true;
            }
        }
        return false;
    }
    
    function handleLifeLost() {
        lives--;
        currentScore = 0;
        updateUI();

        if (lives <= 0) {
            gameOver();
        } else {
            isPaused = true;
            flashScreen('rgba(255,0,0,0.3)');
            setTimeout(() => {
                initializeSnake();
                spawnFood();
                isPaused = false;
                canChangeDirection = true;
            }, 1000);
        }
    }
    
    function flashScreen(color) {
        const flashDiv = document.createElement('div');
        flashDiv.style.position = 'fixed';
        flashDiv.style.top = '0';
        flashDiv.style.left = '0';
        flashDiv.style.width = '100%';
        flashDiv.style.height = '100%';
        flashDiv.style.backgroundColor = color;
        flashDiv.style.zIndex = '200'; 
        flashDiv.style.opacity = '1';
        flashDiv.style.transition = 'opacity 0.5s ease-out';
        document.body.appendChild(flashDiv);
        setTimeout(() => {
            flashDiv.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(flashDiv)) {
                   document.body.removeChild(flashDiv);
                }
            }, 500);
        }, 100);
    }

    function gameOver() {
        clearInterval(gameInterval);
        isPaused = true;
        gameOverFinalScoreDisplay.textContent = totalFinalScore;
        gameOverScreen.classList.add('visible');
    }

    function gameLoop() {
        if (isPaused) return;

        moveSnake();
        if (checkCollision()) {
            handleLifeLost();
            return;
        }
        drawGame();
        canChangeDirection = true;
    }

    function changeDirection(turn) {
        if (!canChangeDirection || isPaused) return;

        const { dx, dy } = direction;
        if (turn === 'left') {
            if (dx === 1) direction = { dx: 0, dy: -1 };
            else if (dx === -1) direction = { dx: 0, dy: 1 };
            else if (dy === 1) direction = { dx: 1, dy: 0 };
            else if (dy === -1) direction = { dx: -1, dy: 0 };
        } else if (turn === 'right') {
            if (dx === 1) direction = { dx: 0, dy: 1 };
            else if (dx === -1) direction = { dx: 0, dy: -1 };
            else if (dy === 1) direction = { dx: -1, dy: 0 };
            else if (dy === -1) direction = { dx: 1, dy: 0 };
        }
        canChangeDirection = false;
    }
    
    function startGame() {
        resizeCanvas(); 
        lives = INITIAL_LIVES;
        currentScore = 0;
        totalFinalScore = 0;
        isPaused = false;
        gameOverScreen.classList.remove('visible');
        
        initializeSnake();
        spawnFood();
        updateUI();
        
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, GAME_SPEED);
        drawGame(); 
    }

    turnLeftButton.addEventListener('click', () => changeDirection('left'));
    turnLeftButton.addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('left'); }, { passive: false });

    turnRightButton.addEventListener('click', () => changeDirection('right'));
    turnRightButton.addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('right'); }, { passive: false });
    
    restartButton.addEventListener('click', startGame);
    restartButton.addEventListener('touchstart', (e) => { e.preventDefault(); startGame(); }, { passive: false });

    homeButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
    homeButton.addEventListener('touchstart', (e) => { 
        e.preventDefault();
        window.location.href = '../index.html';
    }, { passive: false });


    window.addEventListener('resize', () => {
        const wasPaused = isPaused;
        const gameWasOver = gameOverScreen.classList.contains('visible');

        isPaused = true; 
        if (gameInterval) clearInterval(gameInterval);
        
        resizeCanvas(); 
        drawGame(); 

        if (!wasPaused && !gameWasOver && lives > 0) {
            isPaused = false;
            gameInterval = setInterval(gameLoop, GAME_SPEED);
        } else if (gameWasOver) {
             isPaused = true; 
        }
    });
    
    // Evoca Don Alfred
    setTimeout(() => {
        fetch('/api/get-alfred-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageContext: 'Gioco Snake' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.comment && typeof showAlfredPopup === 'function') {
                showAlfredPopup(data.comment);
            }
        })
        .catch(error => console.error("SPIRIT: Errore durante l'evocazione di Don Alfred:", error));
    }, 1500);

    startGame();

}); 