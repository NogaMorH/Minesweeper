'use strict'

var gBoard
var gEmptyCells = []

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: '0:0',
    minesLocations: [],
    isWin: false,
    livesCount: 1,
    minesExplodedCount: 0
}

const MINE = '💣'
const FLAG = '🚩'

function initGame() {
    buildBoard()
    renderBoard()
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
                isMarked: false,
                isExploded: false
            }
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
            strHtml += `<td class="cell cell-${i}-${j} clickable" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(event, this, ${i}, ${j})"> </td>`
        }
        strHtml += '</tr>'
    }
    elTBody.innerHTML = strHtml
}

function startGame(i, j) {
    gGame.isOn = true
    setMines(i, j)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            setMinesNegsCount(i, j, gBoard)
        }
    }
    startTime()
}

function setMines(clickedCellI, clickedCellJ) {
    gEmptyCells = getEmptyCells(gBoard, clickedCellI, clickedCellJ)
    for (var i = 0; i < gLevel.mines; i++) {
        var randomIdx = getRandomInt(0, gEmptyCells.length)
        const mineLocation = gEmptyCells[randomIdx]
        gBoard[mineLocation.i][mineLocation.j].isMine = true
        gGame.minesLocations.push(mineLocation)
        gEmptyCells.splice(randomIdx, 1)
    }
}

function checkWin() {
    const notMineCellsCount = gLevel.size * gLevel.size - gLevel.mines
    if (gGame.shownCount !== notMineCellsCount) {
        return
    }

    for (var i = 0; i < gGame.minesLocations.length; i++) {
        const mineLocation = gGame.minesLocations[i]
        const mineCell = gBoard[mineLocation.i][mineLocation.j]
        if (!mineCell.isMarked && !mineCell.isExploded) return
    }
    clearInterval(gTimeIntervalId)
    gGame.isWin = true
    gGame.isOn = false
    enableRestartBtn()
}

function gameOver(elCell, i, j) {
    --gGame.livesCount
    renderLives()
    gGame.minesExplodedCount++
    if (gGame.livesCount !== 0) {
        gBoard[i][j].isExploded = true
        elCell.innerText = '💣'
        elCell.classList.add('exploded')
        elCell.classList.remove('clickable')
        return
    }
    // MODEL
    gGame.isOn = false
    clearInterval(gTimeIntervalId)
    // DOM
    showAllMines()
    disableHover()
    elCell.classList.add('clicked-mine')
    enableRestartBtn()
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
    clearInterval(gTimeIntervalId)

    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = '00:00'
    gGame.minesLocations = []
    gGame.isWin = false
    gGame.livesCount = gLevel.lives
    gGame.minesExplodedCount = 0

    gStartTime = null
    gTimeIntervalId = null
    renderHintsCount()
    renderStopwatch()
    renderLives()
    disableRestartBtn()
    buildBoard()
    renderBoard()
}

function enableRestartBtn() {
    const elRestartBtnContainer = document.querySelector('.restart-btn-container')
    var btnStrHTML = `<button class="restart-btn" onclick="restartGame()">`
    if (gGame.isWin) {
        btnStrHTML += '😸'
    } else {
        btnStrHTML += '😿'
    }
    btnStrHTML += '</button>'
    elRestartBtnContainer.innerHTML = btnStrHTML
}

function disableRestartBtn() {
    const elBtnContainer = document.querySelector('.restart-btn-container')
    elBtnContainer.innerHTML = `<button class="restart-btn"()">😺</button>`
}

function disableHover() {
    const clickableCells = document.querySelectorAll('.clickable')
    for (var i = 0; i < clickableCells.length; i++) {
        const clickableCell = clickableCells[i]
        clickableCell.classList.remove('clickable')
    }
}

function renderLives() {
    var strHtmlLives = ''
    if (gGame.livesCount === 0) {
        strHtmlLives += '0'
    } else {
        for (var i = 0; i < gGame.livesCount; i++) {
            strHtmlLives += '❤'
        }
    }
    const elLives = document.querySelector('.lives')
    elLives.innerText = strHtmlLives
}
