// --- Вспомогательные функции (остались без изменений) ---
function createLotoList() {
    const list = Array.from({ length: 3 }, () => Array.from({ length: 9 }, () => null));
    for (let i = 0; i < 3; i++) {
        const filled = [];
        let count = 0;
        while (count < 5) {
            const n = Math.floor(Math.random() * 9);
            if (!filled.includes(n)) {
                filled.push(n);
                count++;
            }
        }
        for (let j = 0; j < 9; j++) {
            if (!filled.includes(j)) continue;
            let num = j === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10) + j * 10;
            if (list.some((row) => row.includes(num))) {
                j--;
                continue;
            }
            list[i][j] = num;
        }
    }
    return list;
}

function renderLotoCard(list) {
    const table = document.getElementById('loto-card');
    table.innerHTML = '';
    list.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const col = document.createElement('td');
            col.className = 'col';
            if (cellData) col.textContent = cellData;
            row.append(col);
        });
        table.append(row);
    });
}

function createNumberBag() {
    const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
}

// --- Управление состоянием игры ---

// Элементы DOM
const currentFigureEl = document.getElementById('current-figure');
const checkedHistoryEl = document.getElementById('checked-history');
const passButton = document.getElementById('pass-button');
const restartButton = document.getElementById('restart-button');
const lotoCardEl = document.getElementById('loto-card');

let numberBag = [];
let currentDraw = null;
let gameOver = false;

// Запуск новой партии
function startNewGame() {
    gameOver = false;
    numberBag = createNumberBag();
    
    // Сброс интерфейса
    checkedHistoryEl.innerHTML = '';
    restartButton.classList.add('hidden'); // Скрываем рестарт во время игры
    passButton.disabled = false;
    passButton.textContent = 'Pull Next / Pass';

    // Создаем новую карточку
    const lotoList = createLotoList();
    renderLotoCard(lotoList);

    // Первое число
    drawNextNumber();
}

function drawNextNumber() {
    if (gameOver || numberBag.length === 0) return;
    
    currentDraw = numberBag.pop();
    currentFigureEl.textContent = currentDraw;

    const historyItem = document.createElement('div');
    historyItem.className = 'figure';
    historyItem.textContent = currentDraw;
    checkedHistoryEl.appendChild(historyItem);
}

function endGame(isWin) {
    gameOver = true;
    passButton.disabled = true;
    passButton.textContent = isWin ? 'You Won!' : 'Game Over';
    
    // Показываем кнопку рестарта после окончания игры
    restartButton.classList.remove('hidden');
}

function checkWin() {
    const filledCount = document.querySelectorAll('.col.filled').length;
    if (filledCount >= 15) {
        setTimeout(() => alert('Congratulations! You won! 🎉'), 100);
        endGame(true);
        return true;
    }
    return false;
}

// --- Слушатели событий (вешаются 1 раз при старте страницы) ---

lotoCardEl.addEventListener('click', (e) => {
    if (gameOver) return;
    const td = e.target;
    if (!td.classList.contains('col') || !td.textContent) return;

    if (+td.textContent === currentDraw && !td.classList.contains('filled')) {
        td.classList.add('filled');
        if (!checkWin()) {
            drawNextNumber();
        }
    }
});

passButton.addEventListener('click', () => {
    drawNextNumber();
    if (numberBag.length === 0) endGame(false);
});

// Нажатие на кнопку рестарта
restartButton.addEventListener('click', startNewGame);

checkedHistoryEl.addEventListener('click', (e) => {
    if (gameOver) return;
    if (!e.target.classList.contains('figure')) return;
    const clickedNumber = +e.target.textContent;
    
    const allCells = document.querySelectorAll('.col');
    const targetCell = Array.from(allCells).find(cell => +cell.textContent === clickedNumber);
    
    if (targetCell && !targetCell.classList.contains('filled')) {
        targetCell.classList.add('filled');
        checkWin();
    }
});

// Инициализация первой игры при загрузке страницы
document.addEventListener('DOMContentLoaded', startNewGame);