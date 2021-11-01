import {settings, translation} from "../index.js";

const city = document.querySelector('.city')
const temperature = document.querySelector('.temperature')
const wind = document.querySelector('.wind')
const humidity = document.querySelector('.humidity')
const weatherError = document.querySelector('.weather-error')
const description = document.querySelector('.weather-description')
const weatherIcon = document.querySelector('.weather-icon')

const weatherOptions = {
    q: 'Minsk',
    appid: 'c2f9246cde298df471140d885f510852',
    lang: 'en',
    units: "metric",
}

document.addEventListener('DOMContentLoaded', ()=>{
    if (localStorage.getItem('city')) {
        weatherOptions.q = city.value = localStorage.getItem('city')
    }
})
city.addEventListener('change', async ()=> {
    localStorage.setItem('city', city.value)
    weatherOptions.q = city.value
    await fetchWeatherData()
})

let params
const openWeatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?`

async function fetchWeatherData(){
    params = new URLSearchParams(weatherOptions).toString()
    let response = await fetch(openWeatherEndpoint + params, {
        method: 'GET'
    })
    if (response.status !== 200) {
        weatherError.innerHTML = translation[settings.language].weather.error
        localStorage.setItem('city', 'Minsk');
        [temperature, wind, humidity, description].forEach(x => x.innerHTML = '')
        weatherIcon.className = 'weather-icon owf'
        return
    }
    else weatherError.innerHTML = ""
    let json = await response.json()
    temperature.innerHTML = `${Math.round(json['main']['temp'])} °C`
    wind.innerHTML = `${Math.round(json['wind']['speed'])} ${translation[settings.language].weather.wind}`
    humidity.innerHTML = `${Math.round(json['main']['humidity'])} %`
    description.innerHTML = json['weather'][0]['description']
    weatherIcon.className = 'weather-icon owf'
    weatherIcon.classList.add(`owf-${json['weather'][0].id}`)
}
async function updateWeatherOptions() {
    if (!localStorage.getItem('city')) weatherOptions.q = translation[settings.language].weather.city
    weatherOptions.lang = translation[settings.language].weather.lang
    await fetchWeatherData()
}

export {weatherOptions, fetchWeatherData, updateWeatherOptions}