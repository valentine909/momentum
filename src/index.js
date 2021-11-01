import {fetchWeatherData, updateWeatherOptions} from "./js/weather.js";
import fetchQuotes from "./js/quotes.js";
import {createPlayList, prepareAudio} from "./js/audioPlayer.js";
import {updateTimeDate} from "./js/central.js";
import {setBackground} from "./js/background.js";
import {syncSettingsWithLocalStorage, updateTogglesFromLocalStorage} from "./js/settings.js";
import {restoreTodoFromStorage} from "./js/todo.js"
import './css/owfont-regular.css'
import './css/style.css'

export const settings = {
    'user': '',
    'city': 'Minsk',
    'language': 'english',
    'backgrounds': 'github',
    'visibility': {
        'time': "1",
        'date': "1",
        'greeting-container': "1",
        'quotes': "1",
        'weather': "1",
        'player': "1",
        'todo': "1"
    }
}
export const translation = {
    'english': {
        'timeOfDay': {
            'night': 'night',
            'morning': 'morning',
            'afternoon': 'afternoon',
            'evening': 'evening'
        },
        'greeting': {
            'prefix': 'Good',
            'placeholder': 'Enter name'
        },
        'weather': {
            'city': 'Minsk',
            'lang': 'en',
            'wind': 'm/s',
            'error': 'Something goes wrong. Check your city\'s name',
            'placeholder': 'Minsk'
        },
        'date': 'en-US',
        'quotes': './src/js/quotes.json',
        'settings': {
            'lang': 'Language:',
            'back': 'Background source:',
            'show': 'Show / hide:',
            'items': {
                'time': 'Time',
                'date': 'Date',
                'greeting': 'Greeting',
                'quotes': 'Quotes',
                'weather': 'Weather',
                'player': 'Audio Player',
                'todo': 'To Do List'
            },
            'additional': {
                'api': {
                    'label': 'API token:',
                    'placeholder': 'Enter your API token'
                },
                'tag': {
                    'label': 'Tags:',
                    'placeholder': 'Enter tags comma separated, ex. \'nature,evening\''
                }

            },
        },
        'todo': {
            'header': 'Task list:',
            'placeholder': 'New TODO'
        }

    },
    'russian': {
        'timeOfDay': {
            'night': 'Доброй ночи',
            'morning': 'Доброе утро',
            'afternoon': 'Добрый день',
            'evening': 'Добрый вечер'
        },
        'greeting': {
            'prefix': '',
            'placeholder': 'Введите имя'
        },
        'weather': {
            'city': 'Минск',
            'lang': 'ru',
            'wind': 'м/с',
            'error': 'Что-то пошло не так. Проверьте название города',
            'placeholder': 'Минск'
        },
        'date': 'ru-RU',
        'quotes': './src/js/quotes_ru.json',
        'settings': {
            'lang': 'Язык:',
            'back': 'Источник изображений:',
            'show': 'Показать / спрятать:',
            'items': {
                'time': 'Время',
                'date': 'Дата',
                'greeting': 'Приветствие',
                'quotes': 'Цитаты',
                'weather': 'Погода',
                'player': 'Аудио плеер',
                'todo': 'To Do список'
            },
            'additional': {
                'api': {
                    'label': 'API токен:',
                    'placeholder': 'Введите свой API токен'
                },
                'tag': {
                    'label': 'Ярлыки:',
                    'placeholder': 'Введите ярлыки через запятую, например, \'nature,evening\''
                }
            },
        },
        'todo': {
            'header': 'Список задач:',
            'placeholder': 'Новая задача'
        }
    }
}

window.addEventListener('load', onLoad)

async function onLoad() {
    restoreTodoFromStorage()
    syncSettingsWithLocalStorage()
    updateTogglesFromLocalStorage()
    await updateLanguage()
    await setBackground()
    createPlayList()
    setInterval(fetchWeatherData, 3600000)
    prepareAudio()
    removePreload()
}

function removePreload() {
    document.querySelector('body').classList.remove('preload')
}

// Translation
export async function updateLanguage() {
    updateTimeDate()
    await fetchQuotes()
    updateSettings()
    updatePlaceholders()
    await updateWeatherOptions()
    document.querySelector('.todo__header').innerHTML = translation[settings.language].todo.header
}
function updateSettings() {
    document.querySelector('.time-label').innerHTML = translation[settings.language].settings.items.time
    document.querySelector('.date-label').innerHTML = translation[settings.language].settings.items.date
    document.querySelector('.greeting-label').innerHTML = translation[settings.language].settings.items.greeting
    document.querySelector('.quotes-label').innerHTML = translation[settings.language].settings.items.quotes
    document.querySelector('.weather-label').innerHTML = translation[settings.language].settings.items.weather
    document.querySelector('.player-label').innerHTML = translation[settings.language].settings.items.player
    document.querySelector('.todo-label').innerHTML = translation[settings.language].settings.items.todo
    document.querySelector('.settings__language-text').innerHTML = translation[settings.language].settings.lang
    document.querySelector('.settings__background-text').innerHTML = translation[settings.language].settings.back
    document.querySelector('.settings__show-text').innerHTML = translation[settings.language].settings.show

    document.querySelectorAll('.api-label').forEach(x => x.innerHTML = translation[settings.language].settings.additional.api.label)
    document.querySelectorAll('.tags-label').forEach(x => x.innerHTML = translation[settings.language].settings.additional.tag.label)
}
function updatePlaceholders() {
    document.querySelectorAll('.background-tags').forEach(x => x.setAttribute('placeholder', translation[settings.language].settings.additional.tag.placeholder))
    document.querySelector('.name').setAttribute('placeholder', translation[settings.language].greeting.placeholder)
    document.querySelector('.city').setAttribute('placeholder', translation[settings.language].weather.placeholder)
    document.querySelector('#todo-input').setAttribute('placeholder', translation[settings.language].todo.placeholder)
}