import {getTimeOfDay} from "./central.js";
import {settings} from "../index.js";
import {flickrTags, unsplashTags} from "./settings.js";

const slideLeft = document.querySelector('.slide-prev')
const slideRight = document.querySelector('.slide-next')

slideLeft.addEventListener('click', previousBackground)
slideRight.addEventListener('click', nextBackground)

let imageNumber = randomNumber()
async function setBackground() {
    const imageURL = await getImageSource()
    const body = document.getElementsByTagName('body')[0]
    const backgroundURL = `url("${imageURL}")`
    const image = new Image()
    image.src = imageURL
    image.onload  = () => {
        body.style.background = `${backgroundURL} no-repeat center`
        body.style.backgroundSize = 'cover'
    }
}
async function getImageSource() {
    if (settings.backgrounds === 'github') {
        let number = numberToText(imageNumber)
        const timeOfDay = getTimeOfDay()
        return `src/assets/img/${timeOfDay}/${number}.jpg`
    } else if (settings.backgrounds === 'flickr') {
        if (!flickrLinks) await fetchFlickrPhotos()
        return await flickrLinks[Math.round(Math.random() * flickrLinks.length + 1)]
    } else if (settings.backgrounds === 'unsplash') {
        if (!unsplashLinks) await fetchUnsplashPhotos()
        return await unsplashLinks[Math.round(Math.random() * unsplashLinks.length + 1)]
    }
}
function randomNumber() {
    return  Math.round(Math.random() * 19 + 1)
}
function numberToText(number) {
    number = number.toString()
    return number.length === 1 ? `0${number}` : number
}
function validateImageNumber(n) {
    if (n < 1) return 20
    if (n > 20) return 1
    return n
}
async function previousBackground() {
    imageNumber = validateImageNumber(imageNumber - 1)
    await setBackground()
}
async function nextBackground() {
    imageNumber = validateImageNumber(imageNumber + 1)
    await setBackground()
}

// Flickr API
const flickrEndpoint = 'https://www.flickr.com/services/rest/?'
const flickrOptions = {
    'method': 'flickr.photos.search',
    'api_key': '835ad5601a7af29931f0cab9ba123eb1',
    'tags': 'nature',
    'tag_mode': 'all',
    'format': 'json',
    'nojsoncallback': '1',
    'extras': 'tags,url_k',
    'per_page': '500'
}
let flickrLinks
let flickrResult
function fetchFlickrPhotos() {
    flickrOptions.tags = flickrTags.value ? flickrTags.value : 'nature,' + getTimeOfDay()
    flickrLinks = []
    let flickerParams = new URLSearchParams(flickrOptions).toString()
    return fetch(flickrEndpoint + flickerParams, {method: 'GET'})
        .then(response => response.json())
        .then(json => json['photos']['photo'])
        .then(arr => flickrResult = arr.filter(elem =>
            elem.hasOwnProperty('url_k')
            && Number(elem['width_k']) > Number(elem['height_k'])))
        .then(x => x.forEach(z => flickrLinks.push(z['url_k'])))
        .catch(response => console.log('error', response))
}

// Unsplash API
const unsplashEndpoint = 'https://api.unsplash.com/photos/random?'
const unsplashOptions = {
    'client_id': 'AI3KhLiohqXRN9dvt0CcsRMnIxoeQ9evB0tXUGppzNM',
    'query': 'nature',
    'count': '30',
    'orientation': 'landscape',
    'content_filter': 'high'
}
let unsplashLinks
let unsplashResult
function fetchUnsplashPhotos() {
    unsplashOptions.query = unsplashTags.value ? unsplashTags.value : 'nature,' + getTimeOfDay()
    unsplashLinks = []
    let unsplashParams = new URLSearchParams(unsplashOptions).toString()
    return fetch(unsplashEndpoint + unsplashParams, {method: 'GET'})
        .then(response => response.json())
        .then(json => unsplashResult = json)
        .then(json => json.forEach(x => unsplashLinks.push(x['urls']['full'])))
        .catch(response => console.log('error', response))
}

export {setBackground, fetchFlickrPhotos, fetchUnsplashPhotos}