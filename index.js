const add = document.querySelector('.add')
const clear = document.querySelector('.clear')

const storage = JSON.parse(localStorage.getItem('users')) || {}

const formla = document.querySelector('form')

const petLabel = document.createElement('label')
const petLabelInput = document.createElement('input')
petLabel.innerText = 'Pets'
petLabel.className = 'petLabel'
formla.append(petLabel)
petLabelInput.className = 'pet'
petLabelInput.id = 'pets'
petLabelInput.type = 'text'
const emaillabel = document.getElementById('email')
emaillabel.insertAdjacentElement('afterend', petLabel)
petLabel.insertAdjacentElement('afterend', petLabelInput)

const phoneLabel = document.createElement('label')
const phoneLabelInput = document.createElement('input')
phoneLabel.innerText = 'Phone'
formla.append(phoneLabel)
phoneLabelInput.className = 'phone'
phoneLabelInput.id = 'phone'
phoneLabelInput.type = 'tel'
// document.getElementsByClassName('pet')
petLabelInput.insertAdjacentElement('afterend', phoneLabel)
phoneLabel.insertAdjacentElement('afterend', phoneLabelInput)

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    deleteBtn.addEventListener('click', () => {
        delete storage[userEmail]
        localStorage.setItem('users', JSON.stringify(storage))
        deleteBtn.parentElement.parentElement.parentElement.remove()

        console.log(
            `%c Удаление пользователя ${userEmail} `,
            'background: red; color: white',
        )
    })

    changeBtn.addEventListener('click', () => {
        const userPrep = storage[userEmail]
        document.querySelector('#name').value = userPrep.name
        document.querySelector('#secondName').value = userPrep.secondName
        document.querySelector('#email').value = userEmail
        document.querySelector('#pets').value = userPrep.pets
        document.querySelector('#phone').value = userPrep.phone
        console.log(
            `%c Изменение пользователя ${userEmail} `,
            'background: green; color: white',
        )
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @param {string} data.pets - Питомцы пользователя
 * @param {string} data.phone - Телефон пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({
    name, secondName, email, pets, phone,
}) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>Имя: ${name}</p>
                <p>Фамилия: ${secondName}</p>
                <p class="email">Почта: ${email}</p>
                <p>Питомцы: ${pets}</p>
                <p>Телефон: ${phone}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''

    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newEmail = document.querySelector('#email')
    const newPets = document.querySelector('#pets')
    const newPhone = document.querySelector('#phone')

    const users = document.querySelector('.users')

    if (!newEmail.value
        || !newName.value
        || !newSecondName.value
        || !newPets.value
        || !newPhone.value
    ) {
        resetInputs(newName, newSecondName, newEmail, newPets, newPhone)
        return
    }

    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        email: newEmail.value,
        pets: newPets.value,
        phone: newPhone.value,
    }

    if (storage[newEmail.value] === true) {
        storage[newEmail.value].name = newName.value;
        storage[newEmail.value].secondName = newSecondName.value;
        storage[newEmail.value].pets = newPets.value;
        storage[newEmail.value].phone = newPhone.value;
        console.log(
            `%c Изменение данных пользователя $${newEmail.value} `,
            'background: green; color: white',
        )
    } else {
        storage[newEmail.value] = data;
        console.log(
            `%c Добавление пользователя $${newEmail.value} `,
            'background: green; color: white',
        )
    }
    window.location.reload()

    const userCardHTML = createCard(data)
    const userCard = document.createElement('div')
    userCard.className = 'user'
    userCard.dataset.email = newEmail.value
    userCard.innerHTML = userCardHTML
    users.append(userCard)
    setListeners(userCard)

    // Добавление данных в localStorage
    localStorage.setItem('users', JSON.stringify(storage))
    resetInputs(newName, newSecondName, newEmail, newPets, newPhone)

    console.log(storage)
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})
