export const inputField = (options) => {
    const span = document.createElement('span')
    span.classList.add('input-group-label')
    span.innerText = options.label
    const inputGroup = document.createElement('div')
    inputGroup.classList.add('input-group')
    inputGroup.appendChild(span)

    const input = document.createElement('input')
    input.classList.add('input-group-field')
    input.type = 'text'
    input.value = options.value
    input.onchange = (event) => options.onchange(event.target.value)
    inputGroup.appendChild(input)

    if (options.button) {
        const inputGroupButton = document.createElement('div')
        inputGroupButton.classList.add('input-group-button')
        const inputButton = button({
            label: options.button.label,
            action: options.button.action
        })
        inputGroupButton.appendChild(inputButton)
        inputGroup.appendChild(inputGroupButton)
    }

    return inputGroup
}

export const button = (options) => {
    const button = document.createElement('input')
    button.type = 'submit'
    button.value = options.label
    button.classList.add('button')
    button.onclick = options.action
    return button
}

export const select = (options) => {
    const span = document.createElement('span')
    span.classList.add('input-group-label')
    const select = document.createElement('select')
    select.classList.add('input-group-field')
    const inputGroup = document.createElement('div')
    inputGroup.classList.add('input-group')
    const inputGroupButton = document.createElement('div')
    inputGroupButton.classList.add('input-group-button')
    const newButton = button({
        label: 'New',
        action: options.addNew
    })
    inputGroupButton.appendChild(newButton)

    options.options.forEach(op => {
        const option = document.createElement('option')
        option.innerText = op.label
        option.value = op.value
        if (op.selected) {
            option.selected = true
        }
        select.appendChild(option)
    })
    select.onchange = (event) => options.select(event.target.value)

    span.innerText = options.label

    inputGroup.appendChild(span)
    inputGroup.appendChild(select)
    inputGroup.appendChild(inputGroupButton)

    return inputGroup
}

export const textarea = (options) => {
    const textarea = document.createElement('textarea')
    textarea.value = options.value
    textarea.onchange = (event) => options.onchange(event.target.value)
    return textarea
}

// https://media.discordapp.net/attachments/827576937459089449/836172578820980746/00_Dark_Souls_III.jpg