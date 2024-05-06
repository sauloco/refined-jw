document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type:"request_shortcuts"}, function(shortcuts){
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
    for (const [, shortcut] of Object.entries(shortcuts)) {
        const keys = shortcut.keys.map(k => `<kbd>${getSymbol(k)}${k}</kbd>`).join(' ')
            shortcutListHtml +=`
            <div class="cell">
                ${keys} ${shortcut.description}
            </div>
        `
    }

    document.querySelector('body').innerHTML += shortcutListHtml
}

const enableRefinedJW = () => {
    document.querySelector('h1').innerHTML = 'Refined JW is enabled'
}