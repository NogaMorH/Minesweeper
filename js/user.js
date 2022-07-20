'use strict'

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    const cell = gBoard[i][j]
    if (cell.isShown) return
    // MODEL
    cell.isShown = true
    elCell.classList.add('shown')
    elCell.classList.remove('clickable')
    if (cell.isMine) {
        // DOM
        gameOver(elCell)
        return
    }
    gGame.shownCount++
    if (cell.minesAroundCount !== 0) {
        // DOM
        elCell.innerText = cell.minesAroundCount
    } else {
        elCell.innerText = ' '
        expandShown(i, j)
    }
    checkWin()
}

function cellMarked(ev, elCell, i, j) {
    ev.preventDefault()
    const cell = gBoard[i][j]
    if (cell.isShown) return
    // MODEL
    if (!cell.isMarked) {
        cell.isMarked = true
        gGame.markedCount++
        // DOM
        elCell.innerText = FLAG
    } else {
        // MODEL
        cell.isMarked = false
        gGame.markedCount--
        // DOM
        elCell.innerText = ' '
    }
    checkWin()
}

function expandShown(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue
            if (cellI === i && cellJ === j) continue
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].isMarked) continue
            if (gBoard[i][j].isShown) continue
            // MODEL
            gBoard[i][j].isShown = true
            gGame.shownCount++
            // DOM
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            elCurrCell.innerText = gBoard[i][j].minesAroundCount
            elCurrCell.classList.add('shown')
            elCurrCell.classList.remove('clickable')
        }
    }
}