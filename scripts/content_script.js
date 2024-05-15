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

    const speechTimeInSeconds = Math.ceil(words.length / 140 * 60) // 140 average words per minute

    console.log({speechTimeInSeconds, words, wordsLength: words.length})

    return speechTimeInSeconds
}

/*
*
* EVENT HANDLERS
*
* */

function addCommentTime(comment, id) {
    const speechTime = calculateSpeechTime(comment)

    let speechTimeElement = document.querySelector(`#data-speech-time-${id}`)

    if (!speechTimeElement) {
        speechTimeElement = document.createElement('span')
        speechTimeElement.id = `data-speech-time-${id}`
        speechTimeElement.classList.add(`refined-jw-speech-time`)
    }
    speechTimeElement.classList.remove('refined-jw-speech-time-long')

    speechTimeElement.innerHTML = `comment time ${speechTime}s`
    document.querySelector(`#${id}`).parentElement.appendChild(speechTimeElement)

    if (speechTime > 29) {
        speechTimeElement.classList.add('refined-jw-speech-time-long')
        const summarizeBtn = document.createElement('span')
        summarizeBtn.innerHTML = '✨ summarize' + `<span class="free-badge">free</span>`
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

function highlightWithColor(document, color) {
    const selection = document.getSelection()


    const validSelection = highlightSelection(selection, color)

    if (!validSelection) {
        console.log('invalid selection')
        return false
    }

    const {
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
    'T': {
        keys: ['Shift', 'T'],
        description: "Navigate to current day or week",
        action: ({document}) => {
            const selectors = ['#navigationDailyTextToday > a',]

            return clickFirstFromList(selectors, document)
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

const highlightSelection = (selection, color) => {

    const surroundElement = document.createElement('span')
    surroundElement.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    if (color) {
        surroundElement.classList.add(`refined-jw-${color}-bg`)
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

/*
*
* LOCAL STORAGE HELPERS
*
* */

const LS_USER_PREF_AUDIO_PLAYBACK_RATE = 'userPref-audio-playbackRate';
const LS_PREVENT_SEARCH_FOCUS = 'preventSearchFocus';
const LS_CURRENT_SHORTCUT = 'currentShortcut';

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

