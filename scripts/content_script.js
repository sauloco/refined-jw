const initJWRefined = () => {

    const userComments = getFromLocalStorage('comment')
    allTextAreas.forEach(ta => {
        ta.addEventListener('change', onChanged)
        ta.addEventListener('keydown', onKeyDown)
        ta.removeAttribute('disabled')
        ta.value = userComments[ta.id] || ''
    })

    allInputs.forEach(input => {
        input.addEventListener('keydown', onKeyDown)
    })

    if (searchField) {
        searchField.removeAttribute('autofocus')
    }

    if (getPreventSearchFocus()) {
        blurSearchField()
    }

    setTimeout(() => loadSelections(), 1000)

    startShortcuts()
}

const onChanged = (e) => addToLocalStorage('comment', {[e.target.id]: e.target.value})
const onKeyDown = (e) => {
    if (e.target.tagName === 'TEXTAREA' && Object.keys(SHORTCUTS).includes(e.key)) {
        e.stopPropagation()
    }
}

const allTextAreas = document.querySelectorAll('textarea')
const allInputs = document.querySelectorAll('input')
let searchField = document.querySelector('#standardSearch > form > div.searchFieldContainer > input.searchField')

if (!searchField) {
    searchField = document.querySelector('#siteHeader > div.siteFeaturesContainer > div > form > input')
}

setTimeout(() => {
    initJWRefined()
}, 100)

const startShortcuts = () => {
    function handleShortcut(event) {

        if (document.activeElement && ['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) {
            return false;
        }

        const shortcut = SHORTCUTS[event.key]
        if (shortcut) {
            event.preventDefault()
            event.stopPropagation()
            return shortcut.action({event, document})
        }
    }

    document.addEventListener("keyup", handleShortcut);
}

function highlightWithColor(document, color) {
    const selection = document.getSelection()


    const validSelection = highlightSelection(selection, color)

    if (!validSelection) {
        console.log('invalid selection')
        return false
    }

    const {
        // commonAncestorContainer,
        startContainer,
        endContainer,
        startOffset,
        endOffset
    } = validSelection.getRangeAt(0)


    const range = document.createRange();
    range.setStart(startContainer, startOffset)
    range.setEnd(endContainer, endOffset)

    const startElementInnerHTML = !startContainer.id ? startContainer.parentElement.innerHTML : startContainer.innerHTML
    const endElementInnerHTML = !endContainer.id ? endContainer.parentElement.innerHTML : endContainer.innerHTML
    const startElementSelector = startContainer.id ? `${startContainer.tagName.toLowerCase()}#${startContainer.id}` : `${startContainer.parentElement.tagName.toLowerCase()}#${startContainer.parentElement.id}`
    const endElementSelector = endContainer.id ? `${endContainer.tagName.toLowerCase()}#${endContainer.id}` : `${endContainer.parentElement.tagName.toLowerCase()}#${endContainer.parentElement.id}`


    addToLocalStorage('selection', {
        color,
        startElementSelector,
        startElementInnerHTML,
        endElementSelector,
        endElementInnerHTML,
    })

    return false
}

function clickFirstFromList(selectors, document) {
    for (const selector of selectors) {
        const btn = document.querySelector(selector)
        if (btn) {
            btn.click()
            setPreventSearchFocus()
            return true;
        }
    }
}

const SHORTCUTS = {
    'Q': {
        keys: ['Shift', 'Q'],
        description: "Go to search or query the selected text",
        action: ({event, document}) => {
            if (searchField) {
                event.preventDefault()
                event.stopPropagation()

                const selectedText = document.getSelection()
                if (selectedText) {
                    searchField.value = selectedText
                }
                searchField.focus()
            }
        }
    },
    'B': {
        keys: ['Shift', 'B'],
        description: "Navigate to previous article, week or day",
        action: ({document}) => {
            const selectors = ['#publicationNavigation > div.chrome.forwardBackNavControls.resultNavControls > ul > li.resultNavLeft > a',
                '#sidebarTOC > nav > div.articleNavLinks > div.navLinkPrev > a',
                '#footerPrevWeek > a',
                '#footerPrevDay > a',
                '#article > div.pagination.cms-clearfix > div.links > a.iconNext.dir-ltr.secondaryButton',
                '#article > div:nth-child(4) > div.links > a.iconPrev.dir-ltr.secondaryButton',
                '#article > div.articleFooterLinks.cms-clearfix > nav > div > div:nth-child(1) > a'
            ]

            return clickFirstFromList(selectors, document);
        }
    },
    'N': {
        keys: ['Shift', 'N'],
        description: "Navigate to next article, week or day",
        action: ({document}) => {

            const selectors = [
                '#publicationNavigation > div.chrome.forwardBackNavControls.resultNavControls > ul > li.resultNavRight > a', // next song
                '#sidebarTOC > nav > div.articleNavLinks > div.navLinkNext > a', // next article
                '#footerNextWeek > a', // next week
                '#footerNextDay > a', // next day
                '#article > div:nth-child(4) > div.links > a.iconNext.dir-ltr.secondaryButton', // next search result
                '#article > div.articleFooterLinks.cms-clearfix > nav > div > div:nth-child(3) > a', // next chapter JW
            ]
            return clickFirstFromList(selectors, document);
        }
    },
    '1': {
        keys: ['1'],
        description: "Highlight yellow the selected text within the article",
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'yellow');
        }
    },
    '2': {
        keys: ['2'],
        description: "Highlight blue the selected text within the article",
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'blue');
        }
    },
    '3': {
        keys: ['3'],
        description: "Highlight green the selected text within the article",
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'green');
        }
    },
    '4': {
        keys: ['4'],
        description: "Highlight red the selected text within the article",
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'red');
        }
    },
    'P': {
        keys: ['Shift', 'P'],
        description: "Highlight yellow the selected text within the article",
    }
}

const loadSelections = () => {

    const selections = getFromLocalStorage('selection')

    if (selections) {
        for (const selection of selections) {
            document.querySelector(selection.startElementSelector).innerHTML = selection.startElementInnerHTML
        }
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request["type"] === 'request_shortcuts') {
            sendResponse(SHORTCUTS);// this is how you send message to popup
        }
        return true; // this make sure sendResponse will work asynchronously

    }
);

let setPreventSearchFocus = () => {
    localStorage.setItem('preventSearchFocus', 'true')
}

let getPreventSearchFocus = () => {
    return localStorage.getItem('preventSearchFocus') === 'true'
}

let clearPreventSearchFocus = () => {
    localStorage.removeItem('preventSearchFocus')
}


const blurSearchField = () => {
    setTimeout(() => {
        if (searchField) {
            searchField.blur()
            clearPreventSearchFocus()
        }
    }, 100)
}

const highlightSelection = (selection, color) => {

    const surroundElement = document.createElement('span')
    if (color) {
        surroundElement.style.backgroundColor = color
    }

    let validSelection = false
    let tries = 0
    do {
        tries++
        try {
            selection.getRangeAt(0).surroundContents(surroundElement)
            validSelection = true
        } catch (e) {
            validSelection = false
            selection.modify("extend", "forward", "word")
        }
    } while (!validSelection && tries < 1000)

    return validSelection ? selection : null

}

const getUniqueSelector = (element) => {
    let parent = element.parentElement
    let selector;
    if (element.nodeType === Node.TEXT_NODE) {
        selector = parent.tagName.toLowerCase()
        parent = parent.parentElement
    } else {
        selector = element.tagName.toLowerCase()
    }

    while (parent) {
        selector = `${parent.tagName.toLowerCase()}>${selector}`
        parent = parent.parentElement
    }
    let id = element.id || ''
    let classList = element.className ? element.className.split(' ') : ''
    selector += `${id ? `#${id}` : ''}${classList.length ? `.${classList.join('.')}` : ''}`

    if (selector.endsWith('>')) {
        selector = selector.slice(0, -1)
    }

    return selector
}

/*
*
* LOCAL STORAGE HELPERS
*
* */

const getFromLocalStorage = (type) => {
    const key = window.location.href.replace(window.location.hash, "")
    const userData = JSON.parse(localStorage.getItem(key) || "{}")

    if (type === 'comment') {
        return userData[type] || {}
    } else if (type === 'selection') {
        return userData[type] || []
    } else {
        console.error('unknown type', type)
    }
}

const addToLocalStorage = (type, value) => {
    let userDataOfType = getFromLocalStorage(type)

    if (type === 'comment') {
        userDataOfType = {
            ...userDataOfType || {},
            ...value
        }
    } else if (type === 'selection') {
        userDataOfType = [
            ...userDataOfType || [],
            value
        ]
    } else {
        console.error('unknown type', type)
    }

    const key = window.location.href.replace(window.location.hash, "")

    const userDataComplete = JSON.parse(localStorage.getItem(key) || "{}")

    userDataComplete[type] = userDataOfType

    localStorage.setItem(key, JSON.stringify(userDataComplete))
}


initJWRefined()