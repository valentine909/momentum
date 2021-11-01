import {settings, translation} from "../index.js";

const clock = document.querySelector('.time')
const day = document.querySelector('.date')
const userName = document.querySelector('.name')
const greet = document.querySelector('.greeting')

userName.addEventListener('change', ()=> {
    localStorage.setItem('user', userName.value)
    resizeInput()
})
userName.addEventListener('focus', ()=> {
    userName.style.width = "50%"
})
userName.addEventListener('blur', ()=> {
    resizeInput()
})
document.addEventListener('DOMContentLoaded', ()=>{
    userName.value = localStorage.getItem('user')
    resizeInput()
})

function updateTimeDate() {
    function update() {
        let date = new Date()
        let options = {weekday: 'long', month: 'long', day: 'numeric'}
        clock.innerHTML = date.toTimeString().split(' GMT')[0]
        day.innerHTML = date.toLocaleDateString(translation[settings.language].date, options)
        day.innerHTML = startWithCapital(day.innerHTML)
        let timeOfDay = getTimeOfDay()
        greet.textContent = `${translation[settings.language].greeting.prefix} ${translation[settings.language].timeOfDay[timeOfDay]},`
    }
    update()
    setInterval(update, 1000)
}
function startWithCapital(str) {
    return str[0].toUpperCase() + str.slice(1)
}
function getTimeOfDay() {
    let hour = new Date().getHours()
    if (0 <= hour && hour < 6) return 'night'
    if (6 <= hour && hour < 12) return 'morning'
    if (12 <= hour && hour < 18) return 'afternoon'
    if (18 <= hour) return 'evening'
}
function resizeInput() {
    if (userName.value.length === 0) userName.style.width = 14 + "ch"
    else userName.style.width = userName.value.length + 1 + "ch"
}

export {updateTimeDate, getTimeOfDay}