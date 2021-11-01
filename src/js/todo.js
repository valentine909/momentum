let todoActive = {}

const todoMenu = document.querySelector('.todo__menu')
const todoButton = document.querySelector('.todo__button')
const todoInput = document.querySelector('#todo-input')
const todoItems = document.querySelector('.todo__items')
const bins = document.querySelectorAll('.todo__delete')

todoInput.addEventListener("keydown", newTask)
bins.forEach(x => x.addEventListener('click', deleteTask))
todoButton.addEventListener('click', showMenu)

document.addEventListener("click", () => {
    if (!todoMenu.contains(event.target) && todoMenu.classList.contains('show')) showMenu()
})

function showMenu() {
    event.stopPropagation()
    todoMenu.classList.toggle('show')
}
function newTask() {
    if(event.key === 'Enter' && this.value) {
        todoActive[createTask(this.value)] = this.value
        saveToStorage()
        this.value = ""
    }
}

function createTask(text, id = '') {
    id = id ? id : "id" + Math.random().toString(16).slice(2)
    const li = document.createElement('li')
    li.classList.add('todo__item')
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.classList.add('todo__checkbox')
    input.id = id
    const label = document.createElement('label')
    label.classList.add('todo__label')
    label.innerHTML = text
    label.setAttribute('for', id)
    const button = document.createElement('button')
    button.classList.add('todo__delete')
    button.setAttribute("data-id", id)
    button.addEventListener('click', deleteTask)
    li.append(input)
    li.append(label)
    li.append(button)
    todoItems.append(li)
    return id
}
function deleteTask() {
    event.stopPropagation()
    event.target.parentElement.remove();
    delete todoActive[event.target.dataset.id]
    saveToStorage()
}
function saveToStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoActive))
}
export function restoreTodoFromStorage() {
    let todos = localStorage.getItem('todoList')
    if (todos !== null && todos !== "{}") {
        removeExample()
        todoActive = JSON.parse(todos)
        for (let key in todoActive) createTask(todoActive[key], key)
    }
}
function removeExample() {
    document.querySelector('.todo__item').remove()
}