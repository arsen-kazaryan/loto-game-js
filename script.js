function createLotoList() {
    const list = Array.from({ length: 3 }, () => {
    return Array.from({ length: 9 }, () => null)
})
for (let i = 0; i < 3; i++) {
    const filled = []
    let count = 0
    while (count < 5) {
    const n = Math.floor(Math.random() * 9)
    if (filled.includes(n)) continue
    count++
    filled.push(n)
    }
    for (let j = 0; j < 9; j++) {
    let num
      if (j === 0) num = Math.floor(Math.random() * 9) + 1
      else num = Math.floor(Math.random() * 10) + j * 10
    if (list.some((row) => row.includes(num))) {
        j--
        continue
    }
    if (filled.includes(j)) {
        list[i][j] = num
    }
    }
}
    return list
}

function createHtmlList(list) {
    for (let i = 0; i < 3; i++) {
    const row = document.createElement('tr')
    row.className = 'row'
    document.querySelector('.list').append(row)
    for (let j = 0; j < 9; j++) {
    const col = document.createElement('td')
    col.className = 'col'
    row.append(col)
    col.textContent = list[i][j]
    }
}
}

function generateNumber(list) {
  const n = Math.floor(Math.random() * 90) + 1
if (list.includes(n)) {
    return generateNumber(list)
}
    list.push(n)
    const figure = document.querySelector('.figure')
    figure.textContent = n
    const copy = figure.cloneNode(true)
    document.querySelector('.checked').appendChild(copy)
    return n
}

function startGame() {
    const list = createLotoList()
    createHtmlList(list)

const all = []
let b = generateNumber(all)

let gameOver = false

function endGame() {
    gameOver = true
    const btn = document.querySelector('#pass-button')
    btn.disabled = true
    btn.textContent = 'Game over'
}

function checkWin() {
    const filledCount = document.querySelectorAll('.filled').length
    if (filledCount >= 15) {
    alert('You won')
    endGame()
    return true
    }
    return false
}
document.querySelector('.list').addEventListener('click', (e) => {
    if (gameOver) return
    const td = e.target
    if (!td.classList.contains('col')) return
    if (+td.textContent === b) {
    td.classList.add('filled')
    if (checkWin()) return
    b = generateNumber(all)
    }
})

document.querySelector('#pass-button').addEventListener('click', () => {
    if (gameOver) return
    if (all.length === 90) return
    b = generateNumber(all)
})
document.querySelector('.checked').addEventListener('click', (e) => {
    if (gameOver) return
    if (!e.target.classList.contains('figure')) return
    const n = e.target.textContent
    const allInTable = document.querySelectorAll('table td')
    const el = [...allInTable].find((item) => item.textContent === n)
    if (!el || el.classList.contains('filled')) return
    el.classList.add('filled')
    checkWin()
    })
}

startGame()