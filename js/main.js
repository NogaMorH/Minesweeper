'use strict'

var gBoard

const gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesLocations: [{ i: 2, j: 2 }, { i: 0, j: 3 }],
    isWin: false
}

const MINE = '💣'
const FLAG = '🚩'

function initGame() {
    buildBoard()
    console.log('gBoard:', gBoard)
    renderBoard()
    gGame.isOn = true
}

function buildBoard() {
    gBoard = []
    for (var i = 0; i < gLevel.size; i++) {
        gBoard.push([])
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            if (i === 2 && j === 2 || i === 0 && j === 3) currCell.isMine = true
            gBoard[i][j] = currCell
        }
    }
    return gBoard
}

function renderBoard() {
    const elTBody = document.querySelector('tbody')
    var strHtml = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < gBoard.length; j++) {
            // const currCell = gBoard[i][j]
            strHtml += `<td class="cell cell-${i}-${j} clickable" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(event, this, ${i}, ${j})"> </td>`
            setMinesNegsCount(i, j, gBoard)
            // if (currCell.isMine) {
            //     strHtml += `${MINE}`
            // } else {
            //     setMinesNegsCount(i, j, gBoard)
            //     strHtml += `${currCell.minesAroundCount}`
            // }
        }
        strHtml += '</tr>'
    }
    elTBody.innerHTML = strHtml
}

function checkWin() {
    for (var i = 0; i < gGame.minesLocations.length; i++) {
        const mineLocation = gGame.minesLocations[i]
        if (!gBoard[mineLocation.i][mineLocation.j].isMarked) return false
        const notMineCellsCount = gLevel.size * gLevel.size - gLevel.mines
        if (gGame.shownCount !== notMineCellsCount) return false
    }
    console.log('win!')
    gGame.isWin = true
    gGame.isOn = false
    enableRestartButton()
}

function gameOver(elCell) {
    // MODEL
    gGame.isOn = false
    showAllMines()
    console.log('GAME OVER')
    // DOM
    disableHover()
    elCell.classList.add('clicked-mine')
    enableRestartButton()
}

function showAllMines() {
    for (var i = 0; i < gGame.minesLocations.length; i++) {
        // MODEL
        const mineLocation = gGame.minesLocations[i]
        const mineCell = gBoard[mineLocation.i][mineLocation.j]
        mineCell.isShown = true
        gGame.shownCount++
        // DOM
        const elMineCell = document.querySelector(`.cell-${mineLocation.i}-${mineLocation.j}`)
        elMineCell.innerText = MINE
        elMineCell.classList.add('shown')
    }
}

function restartGame() {
    console.log('hi restart')
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
}

function enableRestartButton() {
    const elBtnContainer = document.querySelector('.btn-container')
    var btnStrHTML = `<button class="restart-btn" onclick="restartGame()">`
    if (gGame.isWin) {
        btnStrHTML += '😸'
    } else {
        btnStrHTML += '😿'
    }
    btnStrHTML += '</button>'
    elBtnContainer.innerHTML = btnStrHTML
}

function disableHover() {
    const clickableCells = document.querySelectorAll('.clickable')
    for (var i = 0; i < clickableCells.length; i++) {
        const clickableCell = clickableCells[i]
        clickableCell.classList.remove('clickable')
    }
}

