'use strict'

function cellClicked(elCell, i, j) {
    // on first click
    if (!gTimeIntervalId) {
        startGame(i, j)
    }
    if (!gGame.isOn) return
    const cell = gBoard[i][j]
    if (cell.isShown || cell.isMarked || cell.isExploded) return
    if (gIsHint) {
        showHint(i, j)
        return
    }
    if (cell.isMine) {
        gameOver(elCell, i, j)
        return
    }
    cell.isShown = true
    gGame.shownCount++
    elCell.classList.add('shown')
    elCell.classList.remove('clickable')
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
    if (!gTimeIntervalId) startGame(i, j)
    if (!gGame.isOn) return
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
            const currCell = gBoard[i][j]
            if (j < 0 || j >= gBoard.length) continue
            if (cellI === i && cellJ === j) continue
            if (currCell.isMine) continue
            if (currCell.isMarked) continue
            if (currCell.isShown) continue
            // MODEL
            currCell.isShown = true
            gGame.shownCount++
            // DOM
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            elCurrCell.classList.add('shown')
            elCurrCell.classList.remove('clickable')
            if (currCell.minesAroundCount === 0) {
                elCurrCell.innerText = ' '
                expandShown(i, j)
            } else {
                elCurrCell.innerText = currCell.minesAroundCount
            }
        }
    }
}