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

    const filledCount = document.querySelectorAll('.filled').length  
    if(filledCount === 15){
        alert('you won')
        return 
    }

    return n
}

function startGame() {
    const list = createLotoList()
    let inProcess = true
    createHtmlList(list)
    const all = []
    let b = generateNumber(all)
    console.log(b)
    console.log(all)

    document.querySelector('.list').addEventListener('click', (e) => {
        const td = e.target
        console.log(td)
            if (+td.textContent === b) {
            td.classList.add('filled')       
            b = generateNumber(all)
}
    })
    document.querySelector('#pass-button').addEventListener('click', () => {
        if(all.length === 90) return
        b = generateNumber(all)
        console.log(b)
        console.log(all)
    })
    document.querySelector('.checked').addEventListener('click', (e)=> {
        if(!e.target.classList.contains('figure')) return
        const n = e.target.textContent
        const allInTable = document.querySelectorAll('table td')
        const el = [...allInTable].find(item => item.textContent === n)
        console.log(el);
        if(!el || el.classList.contains('filled')) return 
        el.classList.add('filled')
    })
}
startGame()