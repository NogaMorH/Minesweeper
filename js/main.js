'use strict'

var gBoard
var gEmptyCells = []

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: '00:00',
    minesLocations: [],
    isWin: false,
    livesCount: 1
}

const MINE = '💣'
const FLAG = '🚩'

function initGame() {
    buildBoard()
    console.log('gBoard:', gBoard)
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
            // if (i === 2 && j === 2 || i === 0 && j === 3) currCell.isMine = true
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
    console.log('gGame.minesLocations:', gGame.minesLocations)
}

function checkWin() {
    for (var i = 0; i < gGame.minesLocations.length; i++) {
        const mineLocation = gGame.minesLocations[i]
        const mineCell = gBoard[mineLocation.i][mineLocation.j]
        if (mineCell.isMarked || mineCell.isShown) {
            const notMineCellsCount = gLevel.size * gLevel.size - gLevel.mines
            if (gGame.shownCount >= notMineCellsCount) {
                clearInterval(gTimeIntervalId)
                gGame.isWin = true
                gGame.isOn = false
                enableRestartBtn()
            }
        }
    }
}

function gameOver(elCell) {
    --gGame.livesCount
    renderLives()
    if (gGame.livesCount !== 0) {
        elCell.innerText = '💣'
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

    gStartTime = null
    gTimeIntervalId = null
    // gEmptyCells = []

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

