const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach(function(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

    const taskHTML = 
    `<li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
    </li>`

    //Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML)
})

checkEmptyList()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

function addTask(e) {
    e.preventDefault()

    const taskText = taskInput.value

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false

    }
    //Добавляем задачу в массив с задачами
    tasks.push(newTask)    
    //Формируем css класс
    const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title'

    const taskHTML = 
    `<li id='${newTask.id}' class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${newTask.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
    </li>`

    //Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML)

    //Очищаем поле ввода и возвращаем на него фокус
    taskInput.value = ''
    taskInput.focus()

    checkEmptyList()
    saveToLocalStorage()
}

function deleteTask(e) {
    if (e.target.dataset.action === 'delete') {
        const parentNode = e.target.closest('.list-group-item')
        parentNode.remove()

        const id = parentNode.id
        
        const index = tasks.findIndex(function(task) {
            if (task.id === parseInt(id)) {
                return true
            }
        })
        console.log(index);

        tasks.splice(index, 1)

        checkEmptyList()
        saveToLocalStorage()
    }
}

function doneTask(e) {
    if (e.target.dataset.action === 'done') {
        const parentNode = e.target.closest('.list-group-item')

        const id = Number(parentNode.id)
        
        const task = tasks.find(function(task) {
            if (task.id === id) {
                return true
            }
        })

        task.done = !task.done

        parentNode.querySelector('.task-title').classList.toggle('task-title--done')  

        saveToLocalStorage()
    }
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
		</li>
        `
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    } else {
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null  
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}