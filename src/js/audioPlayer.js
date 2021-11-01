import userPlayList from "./playList.js";

export function createPlayList() {
    userPlayList.forEach((elem, index) => {
        let liObj = document.createElement('li')
        liObj.classList.add('audio-track')
        if (index === 0) liObj.classList.add("active-track")
        liObj.textContent = elem["title"]
        liObj.addEventListener('click', playTrack)
        playList.append(liObj)
    })
}

const backward = document.querySelector('.play-prev')
const forward = document.querySelector('.play-next')
const playPause = document.querySelector('.play')
const playList = document.querySelector('.play-list')
const playerTrack = document.querySelector('.play-track')
const duration = document.querySelector('.player-duration')
const volume = document.querySelector('.play-volume')
const volumeIcon = document.querySelector('.volume')

playPause.addEventListener('click', startStopPlay)
backward.addEventListener('click', playPrev)
forward.addEventListener('click', playNext)
volumeIcon.addEventListener('click', toggleSound)
playerTrack.addEventListener('change', seekAudio)
volume.addEventListener('change', changeVolume)

let trackNumber = 0
let activeAudio

async function startStopPlay() {
    activeAudio.paused ? await activeAudio.play() : activeAudio.pause()
}
async function playAudio() {
    prepareAudio()
    await activeAudio.play()
}

export function prepareAudio() {
    if (activeAudio) activeAudio.pause()
    let audio = new Audio(userPlayList[trackNumber]["src"])
    audio.currentTime = 0
    document.documentElement.style.setProperty('--title', `"${trackNumber + 1}. ${userPlayList[trackNumber]["title"]}"`)
    activeAudio = audio
    changeVolume()
    activeAudio.addEventListener('ended', playNext)
    activeAudio.addEventListener('play', styleOnPlay)
    activeAudio.addEventListener('pause', styleOnPause)
    timeUpdate()
}
async function playTrack() {
    let index = 0
    for (let elem of playList.children) {
        if (event.target === elem) index = Array.from(playList.children).indexOf(elem)
    }
    if (index === trackNumber) await startStopPlay()
    else {
        trackNumber = index
        await playAudio()
    }
}
function validateTrackNumber(n) {
    let upperLimit = userPlayList.length - 1
    if (n < 0) return upperLimit
    if (n > upperLimit) return 0
    return n
}
function playPrev() {
    trackNumber = validateTrackNumber(trackNumber - 1)
    playAudio()
}
function playNext() {
    trackNumber = validateTrackNumber(trackNumber + 1)
    playAudio()
}
function timeUpdate() {
    let time = activeAudio.currentTime || 0
    let totalTime = activeAudio.duration || 0
    duration.innerHTML = `${formatTime(time)} | ${formatTime(totalTime)}`
    playerTrack.value = time / totalTime * 100 || 0
}
function formatTime(time) {
    let minutes = Math.round(time / 60)
    let seconds = Math.round(time % 60)
    return `${padZero(minutes)}:${padZero(seconds)}`
}
function padZero(number) {
    number = number.toString()
    if (number.length === 1) return `0${number}`
    return number
}
function styleOnPlay() {
    playPause.className = "play-pause pause player-icon"
    for (let elem of playList.children) {
        elem.className = "audio-track"
        if (Array.from(playList.children).indexOf(elem) === trackNumber) {
            elem.className = "audio-track active-track active-and-playing"
        }
    }
}
function styleOnPause() {
    playPause.className = "play-pause play player-icon"
    for (let elem of playList.children) {
        elem.className = "audio-track"
        if (Array.from(playList.children).indexOf(elem) === trackNumber) {
            elem.className = "audio-track active-track"
        }
    }
}

function seekAudio() {
    activeAudio.currentTime = Math.round(this.value / 100 * activeAudio.duration) || 0
}
function toggleSound() {
    volume.valueAsNumber === 0 ? volume.valueAsNumber = 50 : volume.valueAsNumber = 0
    changeVolume()
}
function changeVolume() {
    activeAudio.volume = volume.value / 100
    if (activeAudio.volume === 0) volumeIcon.className = "mute player-icon"
    else volumeIcon.className = "volume player-icon"
}
setInterval(timeUpdate, 1000)