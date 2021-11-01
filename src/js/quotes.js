import {settings, translation} from "../index.js";

const quote = document.querySelector('.quote')
const quoteAuthor = document.querySelector('.author')
const quoteButton = document.querySelector('.change-quote')

quoteButton.addEventListener('click', fetchQuotes)

let quotesEndpoint
async function fetchQuotes() {
    quotesEndpoint = translation[settings.language].quotes
    let quotes = await fetch(quotesEndpoint)
    let json = await quotes.json()
    let randomQuote = await json[Math.round(Math.random() * json.length)]
    quote.innerHTML = await randomQuote.text
    quoteAuthor.innerHTML = await randomQuote.author
}

export default fetchQuotes