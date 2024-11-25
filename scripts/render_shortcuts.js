const getSymbol = (key) => {
    const isMac = navigator.userAgent.includes('Mac OS X')
    switch (key) {
        case 'Shift':
            return '⇧ '
        case 'Control':
            return isMac ? '⌃ ' : 'Ctrl '
        case 'Alt':
            return isMac ? '⌥ ' : 'Alt '
        case 'Meta':
            return isMac ? '⌘ ' : 'Win '
        case ' ':
            return 'Space'
        default:
            return ''
    }
}


const renderShortcuts = (shortcuts, withAction = false, targetSelector = '.shortcuts-container', filtering = true) => {
    const target = document.querySelector(targetSelector)

    target.innerHTML = ''

    const firstRowDescription = "Highlight with color"
    const firstRow = addCell(null)
    target.appendChild(firstRow)

    for (const [eventKey, shortcut] of Object.entries(shortcuts)) {
        const {keys, className, description, inRow, action} = shortcut
        if (inRow) {
            for (const k of keys) {
                const key = addKbd(k, description, className)
                firstRow.appendChild(key)
                if (withAction) {
                    const event = createMockEvent(eventKey)
                    key.addEventListener('click', () => action({event, document}))
                    key.classList.add('with-action')
                }
            }
        }
    }

    firstRow.innerHTML += firstRowDescription

    target.innerHTML += `<blockquote class="jw-refined-blockquote cell note">Currently highlight support is very limited, you can only create highlights within the same paragraph or verse.</blockquote>`

    for (const [eventKey, shortcut] of Object.entries(shortcuts)) {
        const {keys, className, description, inRow, action, condition} = shortcut


        if (filtering && condition !== null && condition !== undefined && condition() === false) {
            continue
        }


        if (!inRow) {
            const cell = addCell(null)

            target.appendChild(cell)

            for (const k of keys) {
                const key = addKbd(k, description, className)
                cell.appendChild(key)

                if (withAction) {
                    const event = createMockEvent(eventKey)
                    cell.addEventListener('click', () => action({event, document}))
                    cell.classList.add('with-action')
                    key.classList.add('with-action')
                }
            }

            cell.innerHTML += description

        }
    }
}

const createMockEvent = (key) => {
    return new Event('keydown', {
        key,
        bubbles: true,
        cancelable: true,
        mock: true
    })
}

const addCell = (contentNode, text = '') => {

    const cell = document.createElement('div')
    cell.classList.add('cell')

    if (contentNode) {
        if (Array.isArray(contentNode)) {
            for (const node of contentNode) {
                cell.appendChild(node)
            }
        } else {
            cell.appendChild(contentNode)
        }
    }
    cell.innerHTML += text

    return cell
}

function addKbd(key, description, className = '') {
    const kbd = document.createElement('kbd')
    kbd.title = description
    if (className) {
        kbd.classList.add(className)
    }
    kbd.append(`${getSymbol(key)}${key}`)
    return kbd;
}
