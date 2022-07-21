'use strict'

const gLevel = {
    size: 4,
    mines: 2,
    lives: 1
}

function setEasyLevel() {
    gLevel.size = 4
    gLevel.mines = 2
    gLevel.lives = 1
    gGame.livesCount = 1
    renderLives()
    restartGame()
}

function setMediumLevel() {
    gLevel.size = 8
    gLevel.mines = 12
    gLevel.lives = 2
    gGame.livesCount = 2
    console.log('gGame.livesCount:', gGame.livesCount)
    renderLives()
    restartGame()
}

function setExpertLevel() {
    gLevel.size = 12
    gLevel.mines = 30
    gLevel.lives = 3
    gGame.livesCount = 3
    renderLives()
    restartGame()
}