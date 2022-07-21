'use strict'

var gTimeIntervalId
var gStartTime

function startTime() {
    gStartTime = Date.now()
    gTimeIntervalId = setInterval(setTime, 10)
}

function setTime() {
    const timeDifference = (Date.now() - gStartTime) / 1000
    gGame.secsPassed = timeDifference.toFixed(1, '0')
    renderStopwatch()
}

function renderStopwatch() {
    const elStopwatch = document.querySelector('.stopwatch')
    elStopwatch.innerHTML = gGame.secsPassed
}
