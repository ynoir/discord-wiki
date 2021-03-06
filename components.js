export const inputField = (options) => {
    const span = document.createElement('span')
    span.classList.add('input-group-label')
    span.innerText = options.label
    const inputGroup = document.createElement('div')
    inputGroup.classList.add('input-group')
    inputGroup.appendChild(span)

    const input = document.createElement('input')
    input.classList.add('input-group-field')
    if (options.password) {
        input.type = 'password'
    } else {
        input.type = 'text'
    }
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

    if (options.copyButton) {
        const inputGroupButton = document.createElement('div')
        inputGroupButton.classList.add('input-group-button')
        const inputButton = button({
            label: 'Copy',
            action: () => {
                input.select()
                input.setSelectionRange(0, 99999)
                document.execCommand("copy")
                input.blur()
            }
        })
        inputGroupButton.appendChild(inputButton)
        inputGroup.appendChild(inputGroupButton)
    }

    if (options.disabled) {
        input.readOnly = true
    }

    return inputGroup
}

export const updateInputField = (inputField, value) => {
    const field = inputField.getElementsByClassName('input-group-field')[0]
    field.value = value 
}

export const button = (options) => {
    const button = document.createElement('input')
    button.type = 'submit'
    button.value = options.label
    button.classList.add('button')
    button.onclick = options.action
    return button
}

export const importExportButtons = (options) => {
    const div = document.createElement('div')
    div.classList.add('input-group')
    const label = document.createElement('label')
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.style.cssText = 'display: none'
    const importButton = button({
        label: options.importLabel,
        action: () => {input.click()}
    })
    input.onchange = (value) => options.importAction(value)
    const exportButton = button({
        label: options.exportLabel,
        action: options.exportAction
    })
    const clearButton = button({
        label: options.clearLabel,
        action: options.clearAction
    })
    exportButton.style.cssText = 'margin-left: 10px'
    clearButton.style.cssText = 'margin-left: 10px'
    label.appendChild(input)
    div.appendChild(label)
    div.appendChild(importButton)
    div.appendChild(exportButton)
    div.appendChild(clearButton)
    return div
}

const appendSelectOptions = (select, options) => {
    options.forEach(op => {
        const option = document.createElement('option')
        option.innerText = op.label
        option.value = op.value
        if (op.selected) {
            option.selected = true
        }
        select.appendChild(option)
    })
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

    appendSelectOptions(select, options.options)
    select.onchange = (event) => options.select(event.target.value)
    span.innerText = options.label

    inputGroup.appendChild(span)
    inputGroup.appendChild(select)
    inputGroup.appendChild(inputGroupButton)

    return inputGroup
}

export const updateSelect = (select, options) => {
    const field = select.getElementsByClassName('input-group-field')[0]
    field.innerHTML = ''
    appendSelectOptions(field, options)
}

export const textarea = (options) => {
    const textarea = document.createElement('textarea')
    textarea.setAttribute('maxlength', 2000)
    textarea.rows = '8'
    textarea.value = options.value
    textarea.onchange = (event) => options.onchange(event.target.value)
    return textarea
}

export const updateTextarea = (textarea, value) => {
    textarea.value = value
}

export const divider = () => {
    const hr = document.createElement('hr')
    return hr
}

export const showOverlay = (options) => {
    const overlay = document.getElementById('overlay')
    const overlayText = document.getElementById('overlay-text')
    overlayText.innerText = options.text
    overlay.style.display = 'initial'
}

export const hideOverlay = () => {
    const overlay = document.getElementById('overlay')
    overlay.style.display = 'none'
}
