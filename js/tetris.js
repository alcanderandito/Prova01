const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const levelDisplay = document.getElementById('level');

const messageOverlay = document.getElementById('messageOverlay');
const messageText = document.getElementById('messageText');
const restartButton = document.getElementById('restartButton');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 16; // << RIDOTTO BLOCK_SIZE PER COMPATTEZZA MOBILE

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
document.documentElement.style.setProperty('--block-size-ref', `${BLOCK_SIZE}px`);

const COLORS = [ null, '#FFD700', '#FFFACD', '#FFA500', '#F0E68C', '#DAA520', '#FFFFE0', '#FFBF00' ];
const SHADOW_COLORS = [ null, '#DAA520', '#F0E68C', '#E69500', '#D8C970', '#B8860B', '#E0DDB0', '#D9A300' ];

const TETROMINOES = {
    'I': { shape: [[1,1,1,1]], colorIndex: 1 },
    'O': { shape: [[2,2],[2,2]], colorIndex: 2 },
    'T': { shape: [[0,3,0],[3,3,3]], colorIndex: 3 },
    'S': { shape: [[0,4,4],[4,4,0]], colorIndex: 4 },
    'Z': { shape: [[5,5,0],[0,5,5]], colorIndex: 5 },
    'J': { shape: [[6,0,0],[6,6,6]], colorIndex: 6 },
    'L': { shape: [[0,0,7],[7,7,7]], colorIndex: 7 }
};
const PIECE_KEYS = 'IOTZSLJ';

let board = createBoard();
let currentPiece;
let nextPiece;
let score;
let lives;
let level;
let dropCounter;
let dropInterval;
let gameRunning;
let gamePausedForMessage = false;

const initialLives = 3;
const initialDropInterval = 1000;
const levelSpeedIncrease = 100;

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function getRandomPiece() {
    const rand = Math.floor(Math.random() * PIECE_KEYS.length);
    const key = PIECE_KEYS[rand];
    const pieceData = TETROMINOES[key];
    return {
        shape: pieceData.shape.map(row => row.slice()),
        colorIndex: pieceData.colorIndex,
        x: Math.floor(COLS / 2) - Math.floor(pieceData.shape[0].length / 2),
        y: 0
    };
}

function drawBlock(ctxInstance, x, y, colorIndex, bs = BLOCK_SIZE, isGhost = false) {
    if (colorIndex === 0) return;
    ctxInstance.fillStyle = COLORS[colorIndex];
    if (isGhost) {
        ctxInstance.globalAlpha = 0.25;
        ctxInstance.strokeStyle = COLORS[colorIndex];
        ctxInstance.lineWidth = 1;
        ctxInstance.strokeRect(x * bs + 0.5, y * bs + 0.5, bs -1, bs -1);
    } else {
        ctxInstance.globalAlpha = 1.0;
        ctxInstance.shadowColor = SHADOW_COLORS[colorIndex];
        ctxInstance.shadowBlur = Math.max(1, Math.floor(bs / 6));
        ctxInstance.fillRect(x * bs, y * bs, bs, bs);

        ctxInstance.shadowBlur = 0;
        ctxInstance.strokeStyle = 'rgba(0,0,0,0.2)';
        ctxInstance.lineWidth = 1;
        ctxInstance.strokeRect(x * bs + 0.5, y * bs + 0.5, bs-1, bs-1);
    }
     ctxInstance.globalAlpha = 1.0;
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(ctx, x, y, value);
            }
        });
    });
}

function drawPiece(piece, ctxInstance = ctx) {
    piece.shape.forEach((row, yRel) => {
        row.forEach((value, xRel) => {
            if (value !== 0) {
                let drawX = piece.x + xRel;
                let drawY = piece.y + yRel;
                drawBlock(ctxInstance, drawX, drawY, piece.colorIndex, BLOCK_SIZE);
            }
        });
    });
}

function drawGhostPiece() {
    if (!currentPiece || !gameRunning) return;
    let ghostY = currentPiece.y;
    const ghostPieceShape = currentPiece.shape;
    const ghostPieceX = currentPiece.x;

    while (isValidMove(ghostPieceShape, ghostPieceX, ghostY + 1)) {
        ghostY++;
    }
    ghostPieceShape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(ctx, ghostPieceX + x, ghostY + y, currentPiece.colorIndex, BLOCK_SIZE, true);
            }
        });
    });
}

function clearCanvas() {
    ctx.fillStyle = '#2a1f17';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function update() {
    if (!gameRunning || gamePausedForMessage) return;

    dropCounter += (performance.now() - lastTime);
    lastTime = performance.now();

    if (dropCounter > dropInterval) {
        pieceDrop();
    }
}

function pieceMove(dir) {
    if (!gameRunning || gamePausedForMessage || !currentPiece) return;
    if (isValidMove(currentPiece.shape, currentPiece.x + dir, currentPiece.y)) {
        currentPiece.x += dir;
    }
}

function pieceRotate() {
    if (!gameRunning || gamePausedForMessage || !currentPiece) return;
    const originalShape = currentPiece.shape;
    const rotated = [];
    for (let y = 0; y < originalShape[0].length; y++) {
        rotated[y] = [];
        for (let x = 0; x < originalShape.length; x++) {
            rotated[y][x] = originalShape[originalShape.length - 1 - x][y];
        }
    }
    if (isValidMove(rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
    } else if (isValidMove(rotated, currentPiece.x + 1, currentPiece.y)) {
        currentPiece.x += 1; currentPiece.shape = rotated;
    } else if (isValidMove(rotated, currentPiece.x - 1, currentPiece.y)) {
        currentPiece.x -= 1; currentPiece.shape = rotated;
    } else if (currentPiece.shape[0].length > 2 && isValidMove(rotated, currentPiece.x - 2, currentPiece.y)) {
        currentPiece.x -= 2; currentPiece.shape = rotated;
    } else if (currentPiece.shape[0].length > 2 && isValidMove(rotated, currentPiece.x + 2, currentPiece.y)) {
        currentPiece.x += 2; currentPiece.shape = rotated;
    }
}

function pieceDrop(isHardDrop = false) {
    if (!gameRunning || gamePausedForMessage || !currentPiece) return;
    if (isHardDrop) {
        let moved = 0;
        while (isValidMove(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
            currentPiece.y++;
            moved++;
        }
        if (moved > 0) score += Math.min(moved, 5);
        solidifyPiece();
    } else {
        if (isValidMove(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
            currentPiece.y++;
        } else {
            solidifyPiece();
        }
    }
    dropCounter = 0;
    updateUI();
}

function isValidMove(shape, x, y) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] !== 0) {
                let newX = x + c;
                let newY = y + r;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] !== 0) ) {
                    return false;
                }
            }
        }
    }
    return true;
}

function solidifyPiece() {
    if(!currentPiece) return;
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (currentPiece.y + y < 0) {
                    handleGameOverCondition();
                    return;
                }
                if (currentPiece.y + y < ROWS) {
                   board[currentPiece.y + y][currentPiece.x + x] = currentPiece.colorIndex;
                }
            }
        });
    });

    if (!gameRunning) return;

    clearLines();

    currentPiece = nextPiece;
    nextPiece = getRandomPiece();

    if (currentPiece && !isValidMove(currentPiece.shape, currentPiece.x, currentPiece.y)) {
        handleGameOverCondition();
    }
}

function handleGameOverCondition() {
    gameRunning = false;
    lives--;
    updateUI();
    if (lives > 0) {
        showMessage(`Polenta bruciata! Vite: ${lives}`, true);
    } else {
        showMessage(`Game Over! Formaggio finito! Punteggio: ${score}`, true);
    }
}

function resetBoard() {
    hideMessage();
    gamePausedForMessage = false;
    board = createBoard();
    currentPiece = getRandomPiece();
    nextPiece = getRandomPiece();
    dropCounter = 0;
    lastTime = performance.now();
    gameRunning = true;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameLoop();
}

function clearLines() {
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            linesCleared++;
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(0));
            r++;
        }
    }
    if (linesCleared > 0) {
        if (linesCleared === 1) score += 40 * level;
        else if (linesCleared === 2) score += 100 * level;
        else if (linesCleared === 3) score += 300 * level;
        else if (linesCleared >= 4) score += 1200 * level;

        let newLevel = Math.floor(score / 800) + 1;
        if (newLevel > level) {
            level = newLevel;
            dropInterval = Math.max(150, initialDropInterval - (level -1) * levelSpeedIncrease);
        }
    }
}

function showMessage(text, showRestartBtn = true) {
    messageText.textContent = text;
    restartButton.style.display = showRestartBtn ? 'inline-block' : 'none';
    messageOverlay.style.display = 'flex';
    gamePausedForMessage = true;
}

function hideMessage() {
    messageOverlay.style.display = 'none';
}

function updateUI() {
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Vite: ${lives}`;
    levelDisplay.textContent = `Livello: ${level}`;
}

let lastTime = 0;
let animationFrameId = null;
function gameLoop(time = 0) {
    if (gamePausedForMessage) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
    }
    if (!gameRunning) {
         if (animationFrameId) cancelAnimationFrame(animationFrameId);
         animationFrameId = null;
        return;
    }

    update();

    clearCanvas();
    drawBoard();
    if(currentPiece) {
        drawGhostPiece();
        drawPiece(currentPiece);
    }

    lastTime = time;
    animationFrameId = requestAnimationFrame(gameLoop);
}

function initGame() {
    hideMessage();
    gamePausedForMessage = false;
    board = createBoard();
    score = 0;
    lives = initialLives;
    level = 1;
    dropInterval = initialDropInterval;
    currentPiece = getRandomPiece();
    nextPiece = getRandomPiece();
    updateUI();
    dropCounter = 0;
    gameRunning = true;
    lastTime = performance.now();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameLoop();
}

document.addEventListener('keydown', event => {
    if (!currentPiece && gameRunning) return;
    if (!gameRunning || gamePausedForMessage || !currentPiece) return;

    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') pieceMove(-1);
    else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') pieceMove(1);
    else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') pieceDrop();
    else if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W' || event.key === 'x' || event.key === 'X') pieceRotate();
    else if (event.key === ' ') {
         event.preventDefault();
         pieceDrop(true);
    }
});

document.getElementById('left-btn').addEventListener('click', () => pieceMove(-1));
document.getElementById('right-btn').addEventListener('click', () => pieceMove(1));
document.getElementById('down-btn').addEventListener('click', () => pieceDrop());
document.getElementById('up-btn').addEventListener('click', () => pieceRotate());
document.getElementById('drop-btn').addEventListener('click', () => pieceDrop(true));

restartButton.addEventListener('click', () => {
    if (lives > 0 && !gameRunning) {
        resetBoard();
    } else if (lives <= 0) {
        initGame();
    } else if (gamePausedForMessage && gameRunning) {
         hideMessage();
         gamePausedForMessage = false;
         lastTime = performance.now();
         if (!animationFrameId) gameLoop();
    }
});

initGame(); 