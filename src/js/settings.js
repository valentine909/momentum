import {settings, updateLanguage} from "../index.js";
import {setBackground, fetchFlickrPhotos, fetchUnsplashPhotos} from "./background.js";

const settingsButton = document.querySelector('.settings')
const settingsMenu = document.querySelector('.settings__menu')
const showHideItems = document.querySelectorAll('.settings__show-items input')
const settingsBackgrounds = document.querySelector('.settings__backgrounds')
const unsplash = document.querySelector(".settings__background-additional.unsplash")
const flickr = document.querySelector(".settings__background-additional.flickr")
export const flickrTags = document.querySelector("#background-tags-flickr")
export const unsplashTags = document.querySelector("#background-tags-unsplash")
const settingsLanguages = document.querySelector('.settings__languages')

settingsButton.addEventListener('click', showMenu)
showHideItems.forEach(x => x.addEventListener('click', hideBlocks))
settingsBackgrounds.addEventListener('click', showAdditional)
settingsLanguages.addEventListener('click', changeLanguage);
[flickrTags, unsplashTags].forEach(target => target.addEventListener('change', changeBackground))
document.addEventListener("click", () => {
    if (!settingsMenu.contains(event.target) && settingsMenu.classList.contains('show')) showMenu()
})

function showMenu() {
    event.stopPropagation()
    settingsButton.classList.toggle('settings-active')
    settingsMenu.classList.toggle('show')
}
function hideBlocks() {
    const itemToHide = document.querySelector(`.${this.dataset.class}`)
    itemToHide.classList.toggle('hidden')
    settings.visibility[this.dataset.class] = settings.visibility[this.dataset.class] ? "" : "1"
    localStorage.setItem(this.dataset.class, settings.visibility[this.dataset.class])
}
async function showAdditional() {
    if (event.target.value === 'github') {
        unsplash.className = "settings__background-additional unsplash"
        flickr.className = "settings__background-additional flickr"
        settings.backgrounds = event.target.value
    } else if (event.target.value === 'unsplash') {
        unsplash.className = "settings__background-additional unsplash show"
        flickr.className = "settings__background-additional flickr"
        settings.backgrounds = event.target.value
    } else if (event.target.value === 'flickr') {
        unsplash.className = "settings__background-additional unsplash"
        flickr.className = "settings__background-additional flickr show"
        settings.backgrounds = event.target.value
    }
    localStorage.setItem('backgrounds', settings.backgrounds)
    await changeBackground()
}
async function changeLanguage() {
    if (event.target.value === 'english' || event.target.value === 'russian') {
        settings.language = event.target.value
        localStorage.setItem('language', settings.language)
        await updateLanguage()
    }
}
async function changeBackground() {
    if (event.target.dataset.source === 'flickr') await fetchFlickrPhotos()
    else if (event.target.dataset.source === 'unsplash') await fetchUnsplashPhotos()
    await setBackground()
}

export function syncSettingsWithLocalStorage(object = settings) {
    for (let key in object) {
        if (typeof object[key] === 'object') syncSettingsWithLocalStorage(settings[key])
        else {
            if (localStorage.getItem(key) !== null) object[key] = localStorage.getItem(key)
            else localStorage.setItem(key, object[key])
        }
    }
}

export function updateTogglesFromLocalStorage() {
    document.querySelector(`input[value = ${localStorage.getItem('language')}]`).checked = true
    document.querySelector(`input[value = ${localStorage.getItem('backgrounds')}]`).checked = true
    for (let key in settings.visibility) {
        if (!localStorage.getItem(key)) {
            document.querySelector(`.${key}`).classList.toggle('hidden')
            document.querySelector(`input[data-class = ${key}]`).checked = false
        }
    }
}