document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "request_shortcuts"}, function (shortcuts) {
            if (shortcuts) {
                enableRefinedJW()
                renderShortcuts(shortcuts)
            }
        });
    });
})


const getSymbol = (key) => {
    switch (key) {
        case 'Shift':
            return '⇧ '
        case 'Control':
            return '⌃ '
        case 'Alt':
            return '⌥ '
        case 'Meta':
            return '⌘ '
        default:
            return ''
    }
}

const renderShortcuts = (shortcuts) => {
    let shortcutListHtml = ''
    let firstRow = ''

    for (const [, shortcut] of Object.entries(shortcuts)) {
        const {keys, className, description, inRow} = shortcut
        if (inRow) {
            firstRow += keys.map(k => `<kbd title="${description}" class="${className || ''}">${getSymbol(k)}${k}</kbd>`).join(' ')
        } else {

            const kbdKeys = keys.map(k => `<kbd class="${className || ''}">${getSymbol(k)}${k}</kbd>`).join(' ')
            shortcutListHtml += `
            <div class="cell">
                ${kbdKeys} ${description}
            </div>
        `
        }
    }

    const firstRowDescription = "Highlight with color"
    firstRow = `<div class="cell">${firstRow} ${firstRowDescription}</div>`
    firstRow += `<blockquote class="cell note">Currently highlight support is very limited, you can only create highlights within the same pragraph or verse.</blockquote>`

    document.querySelector('body').innerHTML += firstRow + shortcutListHtml
}

const enableRefinedJW = () => {
    document.querySelector('h1').innerHTML = 'Refined JW is enabled'
}