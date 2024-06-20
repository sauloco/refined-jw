/*
*
* INIT
*
* */

const isWOL = window.location.href.includes('wol.jw.org')
const isJW = !isWOL
const initJWRefined = () => {

    initAllInputs();

    loadComments();

    setSearchFocusStatus();

    setTimeout(() => loadSelections(), 1000)

    startShortcuts()

    waitForAudioAvailable()
}

const initAllInputs = () => {

    const allUserInputElements = [
        ...document.querySelectorAll('input'),
        ...document.querySelectorAll('select'),
        ...document.querySelectorAll('textarea')
    ]


    allUserInputElements.forEach(element => {
        element.addEventListener('keydown', onInputKeyDown)
    })
}

const loadComments = () => {
    const userComments = getFromLocalStorage('comment')
    const allTextAreas = document.querySelectorAll('textarea')

    allTextAreas.forEach(ta => {
        ta.addEventListener('input', onTextAreaChanged)
        ta.removeAttribute('disabled')
        ta.value = userComments[ta.id] || ''
        autoGrowTextArea(ta)
        if (!!ta.value) {
            addCommentTime(ta.value, ta.id)
        }
    })
}

const loadSelections = () => {

    const selections = getFromLocalStorage('selection')

    if (selections) {
        for (const selection of selections) {
            document.querySelector(selection.startElementSelector).innerHTML = selection.startElementInnerHTML
        }
    }

    const selectionElements = document.querySelectorAll('.highlighted')

    for (const selection of selectionElements) {
        selection.addEventListener('click', deleteSelection)
    }
}

const startShortcuts = () => {
    document.addEventListener("keyup", handleShortcut);
    clearCurrentShortcut();
}

const setSearchFocusStatus = () => {
    const searchField = getSearchField()
    if (searchField) {
        searchField.removeAttribute('autofocus')
    }
    if (getPreventSearchFocus()) {
        blurSearchField()
    }
}

const calculateSpeechTime = (value) => {

    const words = value.split(' ');

    // 140 average words per minute
    return Math.ceil(words.length / 140 * 60)
}

/*
*
* EVENT HANDLERS
*
* */

const stopwatches = {};

function createStopwatch(parent, id) {
    let stopwatch = document.querySelector(`#stopwatch-${id}`);
    if (!stopwatch) {
        stopwatch = document.createElement('span')
        stopwatch.classList.add('badge', 'stopwatch')
        stopwatch.id = `stopwatch-${id}`
    }

    stopwatch.innerHTML = '⏱️ start'
    stopwatch.title = 'Start Stopwatch'

    parent.appendChild(stopwatch)

    stopwatch.addEventListener('click', (evt) => {
        const el = evt.target
        const content = el.innerHTML;
        if (content.includes('⏱️')) {
            stopwatches[id] = startStopwatch(el)
            el.title = 'Stop Stopwatch'
        } else if (content.includes('⏹️')) {
            clearInterval(stopwatches[id])
            delete stopwatches[id]
            el.innerHTML = content.replace('⏹️', '⏱️')
            el.title = 'Start Stopwatch'
        }
    })
}

const startStopwatch = (el) => {
    const startedAt = Date.now()
    el.innerHTML = `⏹️ ${Math.floor((Date.now() - startedAt) / 1000)}s`
    return setInterval(() => {
        el.innerHTML = `⏹️ ${Math.floor((Date.now() - startedAt) / 1000)}s`
    }, 1000)
}

function addCommentTime(comment, id) {
    const speechTime = calculateSpeechTime(comment)

    let speechTimeElement = document.querySelector(`#data-speech-time-${id}`)

    if (!speechTimeElement) {
        speechTimeElement = document.createElement('span')
        speechTimeElement.id = `data-speech-time-${id}`
        speechTimeElement.classList.add(`refined-jw-speech-time`)
    }
    speechTimeElement.classList.remove('refined-jw-speech-time-long')

    speechTimeElement.innerHTML = `estimated time ${speechTime}s`
    const speechParent = document.querySelector(`#${id}`).parentElement

    createStopwatch(speechParent, id)
    speechParent.appendChild(speechTimeElement)

    if (speechTime > 29) {
        speechTimeElement.classList.add('refined-jw-speech-time-long')
        const summarizeBtn = document.createElement('span')
        summarizeBtn.innerHTML = '✨ summarize' + `<span class="badge free">free</span>`
        summarizeBtn.classList.add('refined-jw-speech-time-summarize')
        summarizeBtn.addEventListener('click', summarizeComment)
        summarizeBtn.setAttribute('data-textarea-id', id)
        speechTimeElement.appendChild(summarizeBtn)
    }


}

const summarizeComment = (e) => {
    const taId = e.target.dataset.textareaId
    const element = document.querySelector(`#${taId}`)
    const {summary} = summarizeText(element.value)

    const cleanSummary = clearUnmatchedBrackets(summary).trim()

    let summarizedElement = document.querySelector(`#data-summarized-${taId}`)

    if (!summarizedElement) {
        summarizedElement = document.createElement('blockquote')
        summarizedElement.id = `data-summarized-${taId}`
        summarizedElement.classList.add(`refined-jw-summarized`)
        summarizedElement.setAttribute('data-textarea-id', taId)
    }

    const newSpeechTime = calculateSpeechTime(cleanSummary);

    summarizedElement.innerHTML = cleanSummary + `<span class="refined-jw-speech-time">new comment time ${newSpeechTime}s</span>`
    document.querySelector(`#${taId}`).parentElement.appendChild(summarizedElement)
}

function clearUnmatchedBrackets(str) {
    let stack = [];
    let result = '';

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') {
            stack.push(i);
        } else if (str[i] === ')') {
            if (stack.length > 0) {
                stack.pop();
            } else {
                // Unmatched closing bracket, remove it
                result += '';
                continue; // Skip adding this closing bracket to the result
            }
        }
        result += str[i];
    }

    // Remove unmatched opening brackets
    while (stack.length > 0) {
        let index = stack.pop();
        result = result.slice(0, index) + result.slice(index + 1);
    }

    return result;
}


const summarizeText = (text) => {
    return sum({
        corpus: text
    })
}


const autoGrowTextArea = (element) => {
    if (!element.style) {
        element.style = {}
    }
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight + (parseInt(element.style.paddingTop) || 0) + (parseInt(element.style.paddingBottom) || 0) + 5}px`;
    element.rows = 1
}
const onTextAreaChanged = (e) => {
    const comment = e.target.value
    addToLocalStorage('comment', {[e.target.id]: comment})
    autoGrowTextArea(e.target)
    if (!!comment) {
        addCommentTime(comment, e.target.id);
    } else {
        document.querySelector(`#data-speech-time-${e.target.id}`).remove()
    }
}
const onInputKeyDown = (e) => {
    if (e.target.tagName === 'TEXTAREA' && Object.keys(SHORTCUTS).includes(e.key)) {
        e.stopPropagation()
    }
}

const handleShortcut = (event) => {

    if (document.activeElement && ['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName) || getCurrentShortcut()) {
        return false;
    }

    const shortcut = SHORTCUTS[event.key]

    if (shortcut) {
        setCurrentShortcut(event.key)
        event.preventDefault()
        event.stopPropagation()
        const result = shortcut.action({event, document})
        clearCurrentShortcut()
        return result
    }
}

/*
*
* SHORTCUTS
*
* */

let popover;
let popoverTimeout;
const POPOVER_DELAY = 30 * 1000

function scheduleDefaultHidePopover() {
    popoverTimeout = setTimeout(hidePopover, POPOVER_DELAY)
}

function hidePopover() {
    popover.hidePopover()
    document.body.removeChild(popover)
    popover = null

    if (popoverTimeout) {
        clearTimeout(popoverTimeout)
    }
}

function displayPopover() {
    const highlightLink = document.querySelector('#dailyText > div.articlePositioner > div.tabContent.active > a')
    const {top, left} = highlightLink.getBoundingClientRect()

    if (!popover) {

        popover = document.createElement('div')
        popover.className = 'refined-jw-highlight-popover'
        popover.popover = "manual"
        popover.id = `popover-info`
        popover.innerHTML = `
        <p>Please notice as this page is dynamic <strong>your highlight will be lost</strong> when you leave the page.</p> 
        
        <p>We strongly recommend that you navigate to <a href="${highlightLink.href}" target="_blank" rel="noopener noreferrer">${highlightLink.textContent}</a> page before adding your highlight.</p> 
        
        <p class="popover-dismiss">Click on this popover to dismiss it</p>
        `

        highlightLink.popovertarget = popover.id
        highlightLink.id = 'anchor_1'

        document.body.appendChild(popover)

        popover.addEventListener('click', () => {
            hidePopover()
        })

        popover.showPopover()

        scheduleDefaultHidePopover()

    } else {
        if (popoverTimeout) {
            clearTimeout(popoverTimeout)
        }

        scheduleDefaultHidePopover();

    }
}

function highlightWithColor(document, color) {


    const selection = document.getSelection()

    const selectionData = highlightSelection(selection, color)

    if (!selectionData) {
        console.error('invalid selection')
        return false
    }

    const {selection: validSelection, id} = selectionData

    const {
        startContainer,
        endContainer,
        startOffset,
        endOffset
    } = validSelection.getRangeAt(0)

    validSelection.removeAllRanges()


    const range = document.createRange();
    range.setStart(startContainer, startOffset)
    range.setEnd(endContainer, endOffset)

    const startElementInnerHTML = !startContainer.id ? startContainer.parentElement.innerHTML : startContainer.innerHTML
    const endElementInnerHTML = !endContainer.id ? endContainer.parentElement.innerHTML : endContainer.innerHTML
    const startElementSelector = startContainer.id ? `${startContainer.tagName.toLowerCase()}#${startContainer.id}` : `${startContainer.parentElement.tagName.toLowerCase()}#${startContainer.parentElement.id}`
    const endElementSelector = endContainer.id ? `${endContainer.tagName.toLowerCase()}#${endContainer.id}` : `${endContainer.parentElement.tagName.toLowerCase()}#${endContainer.parentElement.id}`

    const homeLink = document.querySelector('#menuHome > a')
    const isHomePage = window.location.href === homeLink.href

    if (isHomePage) {
        displayPopover();
    } else {
        addToLocalStorage('selection', {
            color,
            startElementSelector,
            startElementInnerHTML,
            endElementSelector,
            endElementInnerHTML,
            id
        })
    }

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

function getPlaybackRate() {
    return Number(localStorage.getItem(LS_USER_PREF_AUDIO_PLAYBACK_RATE)) || 1;
}

const SHORTCUTS = {
    'Q': {
        keys: ['Shift', 'Q'],
        description: "Go to search or query the selected text",
        action: ({event, document}) => {
            const searchField = getSearchField()
            if (searchField) {
                event.preventDefault()
                event.stopPropagation()
                const selectedText = document.getSelection()
                if (selectedText.toString()) {
                    const logoElement = document.querySelector('#siteBanner > div.title > a')
                    if (logoElement) {
                        const url = new URL(`${logoElement.href.replace('/h/', '/s/')}?q=${encodeURIComponent(selectedText)}`)
                        window.open(url, '_blank')
                    } else {
                        searchField.value = selectedText
                        searchField.focus()
                    }
                } else {
                    searchField.focus()
                }
            }
        }
    },
    'W': {
        keys: ['Shift', 'W'],
        description: "Go to Bible",
        action: ({event, document}) => {
            const selectors = ['#menuBible > a']
            return clickFirstFromList(selectors, document)
        }
    },
    'E': {
        keys: ['Shift', 'E'],
        description: "Go to Publications",
        action: ({event, document}) => {
            const selectors = ['#menuPublications > a']
            return clickFirstFromList(selectors, document)
        }
    },
    'R': {
        keys: ['Shift', 'R'],
        description: "Go to Meetings",
        action: ({event, document}) => {
            const selectors = ['#menuToday > a']
            return clickFirstFromList(selectors, document)
        }
    },
    'T': {
        keys: ['Shift', 'T'],
        description: "Navigate to current day or week",
        action: ({document}) => {
            const selectors = ['#navigationDailyTextToday > a',]

            return clickFirstFromList(selectors, document)
        }
    },
    'A': {
        keys: ['Shift', 'A'],
        description: "Go to Home",
        action: ({event, document}) => {
            const selectors = ['#menuHome > a']
            return clickFirstFromList(selectors, document)
        }
    },
    'S': {
        keys: ['Shift', 'S'],
        description: "Share",
        action: ({event, document}) => {
            const selectors = ['#shareButtonFooter']
            return clickFirstFromList(selectors, document)
        }
    },
    'L': {
        keys: ['Shift', 'L'],
        description: "Go to Languages",
        action: ({event, document}) => {
            const selectors = ['#libraryTitle > a']
            return clickFirstFromList(selectors, document)
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
        className: 'refined-jw-yellow-bg',
        description: "Highlight yellow",
        inRow: true,
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'yellow');
        }
    },
    '2': {
        keys: ['2'],
        className: 'refined-jw-green-bg',
        description: "Highlight green",
        inRow: true,
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'green');
        }
    },
    '3': {
        keys: ['3'],
        className: 'refined-jw-blue-bg',
        description: "Highlight blue",
        inRow: true,
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'blue');
        }
    },
    '4': {
        keys: ['4'],
        className: 'refined-jw-purple-bg',
        description: "Highlight purple",
        inRow: true,
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'purple');
        }
    },
    '5': {
        keys: ['5'],
        className: 'refined-jw-red-bg',
        description: "Highlight red",
        inRow: true,
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'red');
        }
    },
    '6': {
        keys: ['6'],
        className: 'refined-jw-orange-bg',
        description: "Highlight orange",
        inRow: true,
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()

            return highlightWithColor(document, 'orange');
        }
    },
    ',': {
        keys: [','],
        description: "Go to Settings",
        action: ({event, document}) => {
            const selectors = ['#menuToolsPreferences > a']
            return clickFirstFromList(selectors, document)
        }
    },
    '.': {
        keys: ['.'],
        description: "Current audio or video play/pause",
        action: ({event}) => {
            event.preventDefault()
            event.stopPropagation()


            if (audioElement) {
                const rate = getPlaybackRate()
                setPlaybackRate(rate)
                if (audioElement.paused) {
                    audioElement.play()
                } else {
                    audioElement.pause()
                }
            }
        }
    },
    '>': {
        keys: ['>'],
        description: "Increase playback speed of current audio or video",
        action: ({event}) => {
            event.preventDefault()
            event.stopPropagation()

            const rate = getPlaybackRate()

            const availablePlaybackRates = getAvailablePlaybackRates()
            const currentRateIndex = availablePlaybackRates.indexOf(rate)

            const playbackRate = availablePlaybackRates[Math.min(currentRateIndex + 1, availablePlaybackRates.length - 1)]

            setPlaybackRate(playbackRate)
        }
    },
    '<': {
        keys: ['<'],
        description: "Decrease playback speed of current audio or video",
        action: ({event}) => {
            event.preventDefault()
            event.stopPropagation()

            const rate = getPlaybackRate()

            const availablePlaybackRates = getAvailablePlaybackRates()
            const currentRateIndex = availablePlaybackRates.indexOf(rate)

            const playbackRate = availablePlaybackRates[Math.max(currentRateIndex - 1, 0)]

            setPlaybackRate(playbackRate)
        }
    },
    'ArrowRight': {
        keys: ['→'],
        description: "Jump audio to next verse, paragraph or section. If not possible then skip forward by 5 seconds",
        action: ({event}) => {
            event.preventDefault()
            event.stopPropagation()

            if (audioElement) {

                if (markers) {
                    const currentMarkerIndex = markers.findIndex(m => audioElement.currentTime >= timeNotationToSeconds(m.startTime) && audioElement.currentTime <= timeNotationToSeconds(m.startTime) + timeNotationToSeconds(m.duration))

                    const nextMarker = markers[currentMarkerIndex + 1]
                    if (nextMarker) {
                        audioElement.currentTime = timeNotationToSeconds(nextMarker.startTime)
                        return
                    }
                }

                audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 5)
            }
        }
    },
    'ArrowLeft': {
        keys: ['←'],
        description: "Jump audio to previous verse, paragraph or section. If not possible then skip backward by 5 seconds",
        action: ({event}) => {
            event.preventDefault()
            event.stopPropagation()


            if (audioElement) {

                if (markers) {
                    const currentMarkerIndex = markers.findIndex(m => audioElement.currentTime >= timeNotationToSeconds(m.startTime) && audioElement.currentTime <= timeNotationToSeconds(m.startTime) + timeNotationToSeconds(m.duration))

                    const prevMarker = markers[currentMarkerIndex - 1]
                    if (prevMarker) {
                        audioElement.currentTime = timeNotationToSeconds(prevMarker.startTime)
                        return
                    }
                }

                audioElement.currentTime = Math.max(0, audioElement.currentTime - 5)
            }

        }
    }
}

const timeNotationToSeconds = (timeNotation) => {
    const [hours, minutes, secondsAndMilis] = timeNotation.split(':')
    const [seconds, milliseconds] = secondsAndMilis.split('.')

    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) + Number(milliseconds) / 1000
}

let clearAudioSearchInterval;
let audioElement;
let audioPlayer;

const getAvailablePlaybackRates = () =>
    isWOL
        ? [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.5, 2, 3, 4, 5]
        : [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.5, 2]
const waitForAudioAvailable = () => {
    clearAudioSearchInterval = setInterval(() => {
        const audio = document.querySelector('audio')
        const wolAudioPlayer = document.querySelector('#mep_0')
        const jwAudioPlayer = document.querySelector('#vjs_video_3 > div.vjs-control-bar')

        if (audio && (wolAudioPlayer || jwAudioPlayer)) {
            audioElement = audio
            audioPlayer = wolAudioPlayer || jwAudioPlayer
            audioElement.playbackRate = getPlaybackRate()
            displayPlaybackRate()
            getMarkers()
            clearInterval(clearAudioSearchInterval)
        }
    }, 500)
}

const displayPlaybackRate = () => {
    if (audioElement && audioPlayer) {
        const rate = getPlaybackRate()
        let durationWrapper;
        if (isWOL) {
            durationWrapper = document.querySelector('#mep_0 > div > div.mejs-controls > div.mejs-time.mejs-duration-container')
        } else if (isJW) {
            durationWrapper = document.querySelector('#vjs_video_3 > div.vjs-control-bar > div.vjs-control-group.vjs-progress-group > div.vjs-control-group.vjs-time-display-group')
        } else {
            return
        }
        let playbackRateElement = document.querySelector('.refined-jw-audio-rate')

        if (!playbackRateElement) {
            playbackRateElement = document.createElement('span')
            playbackRateElement.className = `refined-jw-audio-rate ${isJW ? 'vjs-duration vjs-time-control vjs-control' : ''}`
            durationWrapper.appendChild(playbackRateElement)
        }
        playbackRateElement.innerHTML = `${rate}x`

        window.dispatchEvent(new Event('resize'));
    }
}

const setPlaybackRate = (rate) => {
    if (audioElement) {
        if (isWOL) {
            const availablePlaybackRates = getAvailablePlaybackRates()
            const actualRate = Math.min(Math.max(availablePlaybackRates[0], rate), availablePlaybackRates[availablePlaybackRates.length - 1])
            audioElement.playbackRate = actualRate
            localStorage.setItem(LS_USER_PREF_AUDIO_PLAYBACK_RATE, actualRate.toString())
            displayPlaybackRate()
            return actualRate
        } else if (isJW) {
            const rateHandlerElements = {
                '2': '#vjs_video_3 > div:nth-child(9) > ul > li:nth-child(1)',
                '1.5': '#vjs_video_3 > div:nth-child(9) > ul > li:nth-child(2)',
                '1.2': '#vjs_video_3 > div:nth-child(9) > ul > li:nth-child(3)',
                '1.1': '#vjs_video_3 > div:nth-child(9) > ul > li:nth-child(4)',
                '1': '#vjs_video_3 > div:nth-child(9) > ul > li:nth-child(5)',
                '0.9': '#vjs_video_3 > div:nth-child(9) > ul > li:nth-child(6)',
                '0.8': '#vjs_video_3 > div:nth-child(9) > ul > li:nth-child(7)',
                '0.7': '#vjs_video_3 > div:nth-child(9) > ul > li:nth-child(8)',
                '0.6': '#vjs_video_3 > div:nth-child(9) > ul > li:nth-child(9)'
            }

            let rateHandlerSelector = rateHandlerElements[rate.toString()]
            if (!rateHandlerSelector) {
                rateHandlerSelector = rateHandlerElements['1']
            }
            const rateHandler = document.querySelector(rateHandlerSelector)
            if (rateHandler) {
                rateHandler.click()
            }
            localStorage.setItem(LS_USER_PREF_AUDIO_PLAYBACK_RATE, rate.toString())
            displayPlaybackRate()
            return rate
        } else {
            return null
        }
    }
    return null
}

const getSearchField = () => {

    let searchField = document.querySelector('#standardSearch > form > div.searchFieldContainer > input.searchField')

    if (!searchField) {
        searchField = document.querySelector('#siteHeader > div.siteFeaturesContainer > div > form > input')
    }

    return searchField
}

const blurSearchField = () => {
    setTimeout(() => {
        const searchField = getSearchField()
        if (searchField) {
            searchField.blur()
            clearPreventSearchFocus()
        }
    }, 100)
}
const deleteSelection = (evt) => {
    const el = evt.target
    const outerHTML = el.outerHTML
    const innerHTML = el.innerHTML
    if (el) {
        const parent = el.parentElement;
        parent.innerHTML = el.parentElement.innerHTML.replace(outerHTML, innerHTML)
        updateSelectionsInLocalStorage(el.id, parent.innerHTML)
        parent.querySelectorAll('.highlighted').forEach(el => el.addEventListener('click', deleteSelection))
        return true;
    }
    console.error('could not delete selection', id)
    return false;
}

const highlightSelection = (selection, color) => {

    const surroundElement = document.createElement('span')
    surroundElement.id = `highlighted-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`
    surroundElement.title = 'Click to delete selection'
    if (color) {
        surroundElement.classList.add(`highlighted`, `refined-jw-${color}-bg`)
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

    surroundElement.addEventListener('click', deleteSelection)

    return validSelection ? {selection, id: surroundElement.id} : null

}


/*
*
* LOCAL STORAGE HELPERS
*
* */

const LS_USER_PREF_AUDIO_PLAYBACK_RATE = 'userPref-audio-playbackRate';
const LS_PREVENT_SEARCH_FOCUS = 'preventSearchFocus';
const LS_CURRENT_SHORTCUT = 'currentShortcut';

const LOCAL_STORAGE_KEY = 'REFINED-JW-USER-DATA'

const updateSelectionsInLocalStorage = (id, html) => {

    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}")

    const key = encodeURIComponent(window.location.href.replace(window.location.hash, ""))
    const currentData = userData[key] || {}

    const allSelections = currentData.selection || []

    const remainingSelections = allSelections.filter(s => s.id !== id)

    for (const selection of remainingSelections) {
        if (selection.startElementInnerHTML.includes(id)) {
            selection.startElementInnerHTML = html
        } else if (selection.endElementInnerHTML.includes(id)) {
            selection.endElementInnerHTML = html
        }
    }

    currentData.selection = remainingSelections
    userData[key] = currentData
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData))
}

const getFromLocalStorage = (type) => {

    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}")

    const key = encodeURIComponent(window.location.href.replace(window.location.hash, ""))
    const currentData = userData[key] || "{}"

    if (type === 'comment') {
        return currentData[type] || {}
    } else if (type === 'selection') {
        return currentData[type] || []
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

    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}")

    const key = encodeURIComponent(window.location.href.replace(window.location.hash, ""))
    const currentDataComplete = userData[key] || {}

    currentDataComplete[type] = userDataOfType

    userData[key] = currentDataComplete

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData))
}

let setPreventSearchFocus = () => {
    localStorage.setItem(LS_PREVENT_SEARCH_FOCUS, 'true')
}

let getPreventSearchFocus = () => {
    return localStorage.getItem(LS_PREVENT_SEARCH_FOCUS) === 'true'
}

let clearPreventSearchFocus = () => {
    localStorage.removeItem(LS_PREVENT_SEARCH_FOCUS)
}

let setCurrentShortcut = (key) => {
    localStorage.setItem(LS_CURRENT_SHORTCUT, key)
}

let getCurrentShortcut = () => {
    return localStorage.getItem(LS_CURRENT_SHORTCUT)
}

let clearCurrentShortcut = () => {
    localStorage.removeItem(LS_CURRENT_SHORTCUT)
}

/*
*
* DELAYED INITIALIZATION
*
* */

let markers;

const getMarkers = async () => {

    let url, langWritten;
    if (isWOL) {

        const header = document.querySelector('#regionHeader')
        langWritten = header ? header.getAttribute('data-lang') : null
        const inputDocId = document.querySelector('#docId')
        const docId = inputDocId ? inputDocId.value : null
        const audioPubSymInput = document.querySelector('#audioPubSym')
        const audioPubSym = audioPubSymInput ? audioPubSymInput.value : null
        let bookNo, chapNo;
        if (audioPubSym === 'nwt') {
            const bookNoInput = document.querySelector('#bookNo')
            const chapNoInput = document.querySelector('#chapNo')
            bookNo = bookNoInput ? bookNoInput.value : null
            chapNo = chapNoInput ? chapNoInput.value : null
        }

        const isEnoughData = ((audioPubSym && bookNo && chapNo) || docId) && langWritten

        if (!isEnoughData) {
            console.log('not enough wol data to get markers', {langWritten, docId, bookNo, chapNo, audioPubSym})
            return;
        }

        url = `https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?` +
            `${audioPubSym && !docId ? `pub=${audioPubSym}&` : ''}` +
            `${bookNo ? `booknum=${bookNo}&` : ''}` +
            `${chapNo ? `track=${chapNo}&` : ''}` +
            `${docId ? `docid=${docId}&` : ''}` +
            `langwritten=${langWritten}&txtCMSLang=${langWritten}&fileformat=mp3`


    } else if (isJW) {

        const selectors = ['#mediaPlayer1', '#mediaPlayer2']

        let dataElement;
        for (const selector of selectors) {
            dataElement = document.querySelector(selector)
            if (dataElement) {
                break
            }
        }

        if (dataElement) {
            url = dataElement.getAttribute('data-jsonurl')
        }

        const urlParams = new URLSearchParams(url)

        langWritten = urlParams.get('langwritten')

        const isEnoughData = !!url && !!langWritten

        if (!isEnoughData) {
            console.log('not enough jw data to get markers', {url})
            return;
        }
        // https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?booknum=1&output=json&pub=nwt&fileformat=MP3&alllangs=0&track=1&langwritten=S&txtCMSLang=S

    }

    const response = await fetch(url)

    const content = await response.json()

    try {
        markers = content.files[langWritten].MP3[0].markers.markers || null
    } catch (e) {
        markers = null
    }

}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.type === 'request_shortcuts') {
            sendResponse(SHORTCUTS);
        }
        return true;
    }
);

setTimeout(() => {
    initJWRefined()
}, 100)

