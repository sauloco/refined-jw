/*
*
* INIT
*
* */

const isWOL = window.location.href.includes('wol.jw.org')
const isJW = !isWOL

const JW_AUDIO_RATE_SELECTORS = {
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

const JW_VIDEO_RATE_SELECTORS = {
    '2': '#vjs_video_3 > div:nth-child(11) > ul > li:nth-child(1)',
    '1.5': '#vjs_video_3 > div:nth-child(11) > ul > li:nth-child(2)',
    '1.2': '#vjs_video_3 > div:nth-child(11) > ul > li:nth-child(3)',
    '1.1': '#vjs_video_3 > div:nth-child(11) > ul > li:nth-child(4)',
    '1': '#vjs_video_3 > div:nth-child(11) > ul > li:nth-child(5)',
    '0.9': '#vjs_video_3 > div:nth-child(11) > ul > li:nth-child(6)',
    '0.8': '#vjs_video_3 > div:nth-child(11) > ul > li:nth-child(7)',
    '0.7': '#vjs_video_3 > div:nth-child(11) > ul > li:nth-child(8)',
    '0.6': '#vjs_video_3 > div:nth-child(11) > ul > li:nth-child(9)'
}

const MEDIA_TITLE_SELECTORS = ['.mediaItemTitle', 'header > h1']

const SEEN_INDICATOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 25 25" fill="none" stroke="#4ab6fe" stroke-width="0.65"><g id="SVGRepo_iconCarrier"> <path d="M5.03033 11.4697C4.73744 11.1768 4.26256 11.1768 3.96967 11.4697C3.67678 11.7626 3.67678 12.2374 3.96967 12.5303L5.03033 11.4697ZM8.5 16L7.96967 16.5303C8.26256 16.8232 8.73744 16.8232 9.03033 16.5303L8.5 16ZM17.0303 8.53033C17.3232 8.23744 17.3232 7.76256 17.0303 7.46967C16.7374 7.17678 16.2626 7.17678 15.9697 7.46967L17.0303 8.53033ZM9.03033 11.4697C8.73744 11.1768 8.26256 11.1768 7.96967 11.4697C7.67678 11.7626 7.67678 12.2374 7.96967 12.5303L9.03033 11.4697ZM12.5 16L11.9697 16.5303C12.2626 16.8232 12.7374 16.8232 13.0303 16.5303L12.5 16ZM21.0303 8.53033C21.3232 8.23744 21.3232 7.76256 21.0303 7.46967C20.7374 7.17678 20.2626 7.17678 19.9697 7.46967L21.0303 8.53033ZM3.96967 12.5303L7.96967 16.5303L9.03033 15.4697L5.03033 11.4697L3.96967 12.5303ZM9.03033 16.5303L17.0303 8.53033L15.9697 7.46967L7.96967 15.4697L9.03033 16.5303ZM7.96967 12.5303L11.9697 16.5303L13.0303 15.4697L9.03033 11.4697L7.96967 12.5303ZM13.0303 16.5303L21.0303 8.53033L19.9697 7.46967L11.9697 15.4697L13.0303 16.5303Z" fill="#4bb6fe"/></g></svg>`


const REFINED_JW_ICON_SVG = `<div style="background: linear-gradient(45deg, #279CE0 0%, #9F71C6 57%, #DB6A6D 81%, #F39949 100%); width: 48px; height: 48px;">
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_7_61)">
<path d="M48 0H0V48H48V0Z" fill="url(#paint0_linear_7_61)"/>
<rect width="48" height="48" fill="white" fill-opacity="0.48"/>
<path d="M9.94391 34.946C12.0658 34.946 13.6246 34.3152 14.6203 33.0378C15.6848 31.5412 16.2102 29.7407 16.1137 27.9199V12.75H13.2165V27.9838C13.2809 29.132 12.9693 30.2703 12.327 31.2334C12.0342 31.6265 11.6458 31.942 11.1968 32.1511C10.7479 32.3603 10.2527 32.4565 9.7562 32.431C8.96958 32.4369 8.19158 32.2705 7.47924 31.944C6.7264 31.5965 6.01712 31.1652 5.3655 30.6585L4.125 32.8941C4.89403 33.478 5.73259 33.9686 6.62231 34.3552C7.67421 34.7801 8.80642 34.9815 9.94391 34.946Z" fill="white"/>
<path d="M24.0074 34.95H26.3548L31.4406 18.3524L36.0649 34.95H38.4748L43.725 12.75H40.8613C40.8613 12.75 37.4342 28.7753 37.2073 29.6136L32.6613 13.5964H30.3139L25.541 29.6136L22.1139 12.75H19.125L24.0074 34.95Z" fill="white"/>
</g>
<defs>
<linearGradient id="paint0_linear_7_61" x1="5.48363e-07" y1="48" x2="53.882" y2="34.2505" gradientUnits="userSpaceOnUse">
<stop stop-color="#279CE0"/>
<stop offset="0.577786" stop-color="#9F71C6"/>
<stop offset="0.816323" stop-color="#DB6A6D"/>
<stop offset="1" stop-color="#F39949"/>
</linearGradient>
<clipPath id="clip0_7_61">
<rect width="48" height="48" fill="white"/>
</clipPath>
</defs>
</svg>
</div>
`

let isRecurrentUser = false
const getUserId = () => {
    const userId = localStorage.getItem('REFINED-JW-USER-ID')

    if (!userId) {
        const newId = crypto.randomUUID();
        localStorage.setItem('REFINED-JW-USER-ID', newId)
        return newId
    }
    isRecurrentUser = true
    return userId
}


const USER_ID = getUserId()
const TRACKING_DISABLED = localStorage.getItem('REFINED-JW-TRACKING-DISABLED') === 'true'

const usageTracking = async (action, details = {}, forceNewThread = false) => {

    const sharedDetails = {
        action,
        ...details,
        user_id: USER_ID,
        is_recurrent_user: isRecurrentUser,
        location: isWOL ? 'wol' : 'jw',
        geolocation: navigator.geolocation ? JSON.stringify(navigator.geolocation, null, 2) : null,
        screen: {
            width: screen.width,
            height: screen.height
        },
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints,
        timestamp: new Date().toISOString(),
    }

    const threadId = forceNewThread ? null : localStorage.getItem('REFINED-JW-THREAD-ID')

    if (TRACKING_DISABLED) {
        console.info('tracking disabled:', threadId)
        console.info(sharedDetails)
        return
    }


    const response = await fetch(
        `https://discord.com/api/webhooks/1265755905304301611/lwpH8Q1LMiry1Gsj6UYbJuU72FnkwU7Ojo5SZDF6nMAu4aDkP7WBD-wyQUTe5qCgd_29?wait=true${threadId ? `&thread_id=${threadId}` : ''}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...(threadId ? {} : {thread_name: `${forceNewThread ? '🔴 Existent user' : '🟢 New user'} ${USER_ID}`}),
                content: "```json\n" + JSON.stringify(sharedDetails, null, 2) + "\n```"
            })
        }
    )

    if (action === 'new_user' || forceNewThread) {
        const data = await response.json()
        localStorage.setItem('REFINED-JW-THREAD-ID', data.id)
    } else if (response.status !== 200) {
        usageTracking(action, details, true)
    }
}

if (!isRecurrentUser) {
    usageTracking('new_user', {user_id: USER_ID})
}

const initJWRefined = () => {

    if (document.querySelector('.loading-indicator')) {
        setTimeout(() => initJWRefined(), 250)
        return
    }

    initAllInputs();

    loadComments();

    setSearchFocusStatus();

    setTimeout(() => loadSelections(), 1000)
    setTimeout(() => crawlForSeenLinks(), 1000)

    startShortcuts()
    resetMediaData()
    waitForAudioAvailable()
    waitForVideoAvailable()

    addHints()
    displayButtonHint()

}

const crawlForSeenLinks = () => {
    const links = document.querySelectorAll('a:has(> img)') // all links with image inside

    for (const link of links) {
        if (!link.href) {
            continue
        }
        const url = link.href.startsWith('/')
            ? (isWOL
                    ? 'https://wol.jw.org' + link.href
                    : 'https://jw.org' + link.href
            )
            : link.href
        const seen = getFromLocalStorage('seen', url)
        if (seen) {
            const overlay = link.querySelector('.syn-img-overlay')

            if (overlay) {
                overlay.append(getSeenIndicator())
            } else {
                link.append(getSeenIndicatorWithBackground())
            }
        }
    }
}

// const getSeenIndicator = () => `<span class="badge seen">Seen</span>`
const getSeenIndicator = () => {
    const span = document.createElement('span')
    span.classList.add('seen')
    span.innerHTML = SEEN_INDICATOR_SVG

    return span

}

const getSeenIndicatorWithBackground = () => {
    const div = document.createElement('div')
    div.classList.add('seen-inside-image')
    div.innerHTML = SEEN_INDICATOR_SVG

    return div
}

const displayButtonHint = () => {

    if (document.querySelector('#jw-refined-button-hint')) {
        return;
    }

    if (isWOL) {

        const button = document.createElement('li')

        button.id = 'jw-refined-button-hint'

        button.classList.add('jw-refined-button-hint', 'chrome', 'menuButton', 'showRuby', 'ml-S', 'ms-ROMAN', 'dir-ltr')

        button.innerHTML = `
            <span class='icon'>${REFINED_JW_ICON_SVG}</span>
            <span class='label'>REFINED</span>
        `


        document.querySelector('#menuBar').insertBefore(button, document.querySelector('#menuBible'))

        button.addEventListener('click', () => {
            HINT_FRAME.classList.add('open')
            usageTracking('open_hint')
        })
    }

    if (isJW) {
        const button = document.createElement('div')

        button.id = 'jw-refined-button-hint'

        button.classList.add('jw-refined-button-hint', 'tertiaryButton', 'siteFeaturesItem')

        button.innerHTML = `
                <span class="buttonIcon" aria-hidden="true">
                    ${REFINED_JW_ICON_SVG}
                </span>
                <span class="srText">Open JW Refined</span>
                <span class="buttonText">Refined</span>
        `


        document.querySelector('.siteFeaturesContainer').insertBefore(button, document.querySelector('#siteHeader > div.siteFeaturesContainer > a.tertiaryButton.siteFeaturesItem.jsChooseSiteLanguage'))

        button.addEventListener('click', () => {
            HINT_FRAME.classList.add('open')
            usageTracking('open_hint')
        })

        const button_mobile = document.createElement('div')

        button_mobile.id = 'jw-refined-button-hint'

        button_mobile.classList.add('jw-refined-button-hint', 'navBarButton')

        button_mobile.innerHTML = `
                <span class="buttonIcon" aria-hidden="true">
                    ${REFINED_JW_ICON_SVG}
                </span>
        `


        document.querySelector('.navBarControls').insertBefore(button_mobile, document.querySelector('#mobileLangOpen'))

        button_mobile.addEventListener('click', () => {
            HINT_FRAME.classList.add('open')
            usageTracking('open_hint')
        })
    }
}
let mediaDuration = 0
let seenShown = false

const resetMediaData = () => {
    mediaDuration = 0
    seenShown = false
}

let HINT_FRAME = null;
const addHints = () => {

    if (document.querySelector('#jw-refined-hint')) {
        return;
    }

    const frame = document.createElement('div')
    const hintsWrapper = document.createElement('div')
    const close = document.createElement('button')

    close.innerHTML = "&times;"

    frame.id = 'jw-refined-hint'
    hintsWrapper.id = 'jw-refined-hint-wrapper'
    close.id = 'jw-refined-hint-close'

    frame.classList.add('jw-refined-hint')
    hintsWrapper.classList.add('jw-refined-hint-wrapper', 'shortcuts-container')
    close.classList.add('jw-refined-hint-close')

    document.body.appendChild(frame)
    frame.appendChild(hintsWrapper)
    frame.appendChild(close)

    renderShortcuts(SHORTCUTS, true)

    frame.querySelector('.shortcuts-container').innerHTML += `
        <div class="note">This popup and button has been added by <a href="https://chromewebstore.google.com/detail/refined-jw/fbiababpnkmpllkemnmbfblkfngiekcd">Refined JW Chrome Extension</a>, it is not part of the official content of the page. If you encounter a problem, please report it on the <a href="https://github.com/sauloco/refined-jw/issues">GitHub issues</a> page.<div>
    `

    close.addEventListener('click', () => {
        HINT_FRAME.classList.remove('open')
        usageTracking('close_hint')
    })

    HINT_FRAME = frame
}

let subtitlesRetries = 0

const startSubtitlesHandler = async () => {
    const video = document.querySelector('video')
    if (isJW && video) {
        const pageConfig = document.querySelector('#pageConfig')
        const pubShareLink = document.querySelector('.shareButtonWrapper .link')

        const mediaPlayer = document.querySelector('.jsMediaPlayer')

        // MUST LOOK LIKE: https://b.jw-cdn.org/apis/mediator/v1/media-items/S/pub-mwbv_202405_1_VIDEO?clientType=www
        let url;
        if (pubShareLink?.dataset?.lank && pageConfig?.dataset?.wt_lang) {
            const {wt_lang: wtLang} = pageConfig.dataset
            const {lank} = pubShareLink.dataset
            url = `https://b.jw-cdn.org/apis/mediator/v1/media-items/${wtLang}/${lank}?clientType=www`
        } else if (mediaPlayer) {
            url = mediaPlayer.dataset.jsonurl
        } else {
            subtitlesRetries++
            if (subtitlesRetries < 5) {
                setTimeout(() => startSubtitlesHandler, 1000)
                return
            } else {
                console.error('could not find subtitles url')
            }
        }


        const response = await fetch(url)

        if (response) {
            const jsonResponse = await response.json()
            let subtitlesUrl;
            if (url.includes('mediator')) {
                const {media} = jsonResponse
                const {files} = media[0]

                if (!files) {
                    return
                }
                const firstFileWithSubtitles = files.find(file => !!file.subtitles)
                if (!firstFileWithSubtitles) {
                    console.info('no subtitles found')
                    return
                }

                const {duration, subtitles: {url: subsUrl}} = firstFileWithSubtitles
                mediaDuration = duration
                displaySeenStatus()
                subtitlesUrl = subsUrl
            } else {
                const {files} = jsonResponse
                const urlParams = new URLSearchParams(new URL(url).search);
                const langWritten = urlParams.get('langwritten');

                let found = false
                for (const format of Object.values(files[langWritten.toUpperCase()])) {
                    found = false
                    for (const file of format) {
                        if (file.subtitles) {
                            mediaDuration = file.duration
                            displaySeenStatus()
                            subtitlesUrl = file.subtitles.url
                            found = true
                            break
                        }
                        if (found) {
                            break
                        }
                    }
                }

            }


            const vttResponse = await fetch(subtitlesUrl)

            if (vttResponse) {
                const vtt = await vttResponse.text()

                const parser = new WebVTT.Parser(window, WebVTT.StringDecoder())

                const cues = []

                parser.oncue = function (cue) {
                    cues.push(cue);
                };

                parser.parse(vtt);
                parser.flush();

                let text = "";

                const lines = cues.map(cue => cue.text).join('\n').split('\n')
                for (const i in lines) {
                    const prevLine = lines[+i - 1]
                    const line = lines[i]
                    const nextLine = lines[+i + 1] || ''

                    text += `${line.startsWith(`‘`) && prevLine.startsWith(`‘`) ? line.substring(1) : line}${isNewLineRequired(line, nextLine) ? '\n' : ' '}`
                }

                const title = document.querySelector('#article h1')

                text = `<strong>${title.textContent}</strong>
                    
${text}
                    
<a class="jw-refined-transcription-link" href="${window.location.href}">${window.location.href}</a>
`

                const transcriptionContainer = document.querySelector('.contentArea') || document.querySelector('#sidebar')

                transcriptionContainer.innerHTML += `
<div id="jw-refined-transcription" class="jw-refined-transcription">
    <span id="jw-refined-transcription-title"  class="jw-refined-transcription-title"><h2 id="anchor_1">Transcription</h2><span class="badge promo">JW Refined</span></span>
    <div id="jw-refined-transcription-text" class="jw-refined-transcription-text">
        ${text.replace(/\n/g, '<br/>') || 'No transcription available'}
    </div>
    <button id="download-vtt" class="secondaryButton link">
        <span class="buttonText">Download as subtitles</span>
    </button>
</div>`

                const intersectorOptions = {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.1
                }

                const intersector = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            usageTracking('transcription_in_viewport')
                        }
                    })
                }, intersectorOptions)

                intersector.observe(document.querySelector('#jw-refined-transcription'))

                const downloadButton = document.querySelector('#download-vtt')

                downloadButton.addEventListener('click', () => {
                    download(vtt, `${title.textContent}_subtitles.vtt`, 'text/vtt')
                    usageTracking('download_subtitles')
                })
            }
        }
    }
}

const isNewLineRequired = (line, nextLine) => {
    if (line.endsWith('.') || line.endsWith('!') || line.endsWith('?') || line.endsWith('."') || line.endsWith(`.'`)) {
        return !(nextLine.startsWith(`‘`) || nextLine.endsWith(`’`));

    }
    return false
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
    document.addEventListener("keydown", handleShortcut);
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
        usageTracking('stopwatch')
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

    usageTracking('summarize')
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

        const {keys, description} = shortcut

        const isMockEvent = !!event.mock

        usageTracking('shortcut', {keys, description, result, isMockEvent})

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

function displayPopover(bindToSelector, html) {
    const highlightLink = document.querySelector(bindToSelector)

    if (!popover) {

        popover = document.createElement('div')
        popover.className = 'refined-jw-highlight-popover'
        popover.popover = "manual"
        popover.id = `popover-info`
        popover.innerHTML = html

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

    const startElementClassList = document.querySelector(startElementSelector).classList
    if (
        startElementClassList.contains('jw-refined-transcription-text') || startElementClassList.contains('jw-refined-transcription-title') || startElementClassList.contains('jw-refined-transcription')) {
        displayPopover('.jw-refined-transcription-title > h2', `<p>Please notice that the Transcription section is unofficial <strong>your highlights will be lost</strong> when you leave the page.</p><p class="popover-dismiss">Click on this popover to dismiss it</p>`);
    } else {
        const homeLink = document.querySelector('#menuHome > a') || document.querySelector('#siteLogo')
        const isHomePage = window.location.href === homeLink.href

        if (isHomePage) {
            displayPopover('#dailyText > div.articlePositioner > div.tabContent.active > a', `<p>Please notice as this page is dynamic <strong>your highlight will be lost</strong> when you leave the page.</p>
<p>We strongly recommend that you navigate to <a href="${highlightLink.href}" target="_blank" rel="noopener noreferrer">${highlightLink.textContent}</a> page before adding your highlight.</p>
<p class="popover-dismiss">Click on this popover to dismiss it</p>`);
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
    }


    return false
}

function getFirstElFromList(selectors, parent = document, ignoreVisibility = true) {
    for (const selector of selectors) {
        const el = parent.querySelector(selector)
        const isVisible = ignoreVisibility || el && el.offsetParent !== null
        if (el) {
            return {el, isVisible}
        }
    }
    return null
}

function clickFirstFromList(selectors, document, ignoreVisibility = true) {
    const result = getFirstElFromList(selectors, document, ignoreVisibility)
    if (result) {
        const {el, isVisible} = result
        if (el && isVisible) {
            el.click()
            setPreventSearchFocus()
            return el;
        }
    }

}

function getPlaybackRate(lsKey = LS_USER_PREF_AUDIO_PLAYBACK_RATE) {
    return Number(localStorage.getItem(lsKey)) || 1;
}

const SHORTCUTS = {
    'Escape': {
        keys: ['Esc'],
        description: "Close the popup",
        action: ({event, document}) => {
            event.preventDefault()
            event.stopPropagation()
            const selectors = ['.jw-refined-hint-close', '#mid1011214 > div.jsSimpleModalContainer > div > div > div.standardModal-toolbar > button']

            return !!clickFirstFromList(selectors, document, false)
        }
    },
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
        description: "Go to Bible or Bible Teachings",
        action: ({document}) => {
            const selectors = ['#menuBible > a']
            return !!clickFirstFromList(selectors, document)
        }
    },
    'E': {
        keys: ['Shift', 'E'],
        description: "Go to Publications",
        action: ({document}) => {
            const selectors = ['#menuPublications > a']
            return !!clickFirstFromList(selectors, document)
        }
    },
    'R': {
        keys: ['Shift', 'R'],
        description: "Go to Meetings",
        action: ({document}) => {
            const selectors = ['#menuToday > a']
            return !!clickFirstFromList(selectors, document)
        }
    },
    'T': {
        keys: ['Shift', 'T'],
        description: "Navigate to current day or week",
        action: ({document}) => {
            const selectors = ['#navigationDailyTextToday > a',]

            return !!clickFirstFromList(selectors, document)
        }
    },
    'A': {
        keys: ['Shift', 'A'],
        description: "Go to Home",
        action: ({document}) => {
            const selectors = ['#menuHome > a', '#siteLogo']
            return !!clickFirstFromList(selectors, document)
        }
    },
    'S': {
        keys: ['Shift', 'S'],
        description: "Share",
        action: ({document}) => {
            const selectors = ['#shareButtonFooter', '.jsShare',]//'#article > div > div > div > div.jsShareButtonContainer.shareButtonWrapper > button', '#article > div.articleFooterLinks > div.articleShareLinks > div > button']

            clickFirstFromList(selectors, document)

            setTimeout(() => {

                const textElement = document.querySelector('div.jsSimpleModalContainer > div > div > div.standardModal-contentContainer > div > input')
                if (textElement) {
                    textElement.focus()
                }
            }, 500)

            return true
        }
    },
    'F': {
        keys: ['Shift', 'F'],
        description: "Toggle fullscreen",
        action: ({document}) => {
            const selectors = ['#vjs_video_3 button.vjs-fullscreen-control']
            return !!clickFirstFromList(selectors, document)
        }
    },
    'L': {
        keys: ['Shift', 'L'],
        description: "Go to Languages",
        action: ({document}) => {
            const selectors = ['#libraryTitle > a', '#siteHeader > div.siteFeaturesContainer > a.tertiaryButton.siteFeaturesItem.jsChooseSiteLanguage']
            return !!clickFirstFromList(selectors, document)
        }
    },
    'C': {
        keys: ['Shift', 'C'],
        description: "Toggle captions",
        action: ({document}) => {
            const selectors = ['#vjs_video_3 > div:nth-child(10) > ul > li.vjs-menu-item.vjs-menu-item-radio:not(.vjs-selected)']

            return !!clickFirstFromList(selectors, document)
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

            return !!clickFirstFromList(selectors, document);
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
            return !!clickFirstFromList(selectors, document);
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
        action: ({document}) => {
            const selectors = ['#menuToolsPreferences > a']
            return !!clickFirstFromList(selectors, document)
        }
    },
    ' ': {
        keys: [' '],
        description: "Current audio or video play/pause",
        action: ({event}) => {
            event.preventDefault()
            event.stopPropagation()
            const maybeJWVideoPlayButtonElement = document.querySelector('#vjs_video_3 > button')
            let maybeJWVideoPlayButtonElementVisible = false
            if (maybeJWVideoPlayButtonElement) {
                const playButtonStyle = window.getComputedStyle(maybeJWVideoPlayButtonElement) || {}
                if (playButtonStyle.display !== 'none') {
                    maybeJWVideoPlayButtonElementVisible = true
                }
            }

            if (audioElement && !!audioElement.src) {
                const rate = getPlaybackRate()
                setPlaybackRate(rate)
                if (audioElement.paused) {
                    audioElement.play()
                } else {
                    audioElement.pause()
                }
            }

            if (isJW && maybeJWVideoPlayButtonElementVisible) {
                maybeJWVideoPlayButtonElement.click()
            } else if (videoElement && !!videoElement.src) {
                const rate = getPlaybackRate()
                setPlaybackRate(rate)
                if (videoElement.paused) {
                    videoElement.play()
                } else {
                    videoElement.pause()
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
            const isAudio = !!audioElement && !!audioElement.src
            const rate = getPlaybackRate(isAudio ? LS_USER_PREF_AUDIO_PLAYBACK_RATE : LS_USER_PREF_VIDEO_PLAYBACK_RATE)

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

            const isAudio = !!audioElement && !!audioElement.src
            const rate = getPlaybackRate(isAudio ? LS_USER_PREF_AUDIO_PLAYBACK_RATE : LS_USER_PREF_VIDEO_PLAYBACK_RATE)

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

            if (audioElement && !!audioElement.src) {

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

            if (videoElement && !!videoElement.src) {
                videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 15)
            }
        }
    },
    'ArrowLeft': {
        keys: ['←'],
        description: "Jump audio to previous verse, paragraph or section. If not possible then skip backward by 5 seconds",
        action: ({event}) => {
            event.preventDefault()
            event.stopPropagation()


            if (audioElement && !!audioElement.src) {

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

            if (videoElement && !!videoElement.src) {
                videoElement.currentTime = Math.max(0, videoElement.currentTime - 5)
            }

        }
    }
}

const timeNotationToSeconds = (timeNotation) => {
    const [hours, minutes, secondsAndMilis] = timeNotation.split(':')
    const [seconds, milliseconds] = secondsAndMilis.split('.')

    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) + Number(milliseconds) / 1000
}


let audioElement;
let audioPlayer;


let videoElement;

const getAvailablePlaybackRates = () =>
    isWOL
        ? [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.5, 2, 3, 4, 5]
        : [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.5, 2]
const waitForAudioAvailable = () => {
    let clearAudioSearchInterval;
    clearAudioSearchInterval = setInterval(async () => {
        const audio = document.querySelector('audio')
        const wolAudioPlayer = document.querySelector('#mep_0')
        const jwAudioPlayer = document.querySelector('#vjs_video_3 > div.vjs-control-bar')

        if (audio && (wolAudioPlayer || jwAudioPlayer)) {
            if (clearAudioSearchInterval) {
                clearInterval(clearAudioSearchInterval)
            }
            audioElement = audio
            audioPlayer = wolAudioPlayer || jwAudioPlayer
            audioElement.playbackRate = getPlaybackRate()
            displayPlaybackRate()
            await getMarkers()

            if (isJW) {
                for (const sel of Object.values(JW_AUDIO_RATE_SELECTORS)) {
                    const el = document.querySelector(sel)
                    if (el) {
                        el.addEventListener('click', () => setTimeout(displayPlaybackRate, 100))
                    }
                }
            }
        }
    }, 500)
}

const waitForVideoAvailable = () => {
    let clearVideoSearchInterval;
    clearVideoSearchInterval = setInterval(async () => {
        const video = document.querySelector('video')

        if (video) {
            if (clearVideoSearchInterval) {
                clearInterval(clearVideoSearchInterval)
            }
            videoElement = video
            videoElement.playbackRate = getPlaybackRate(LS_USER_PREF_VIDEO_PLAYBACK_RATE)
            videoElement.addEventListener('timeupdate', updateSeenStatus)
            videoElement.addEventListener('timeupdate', displaySeenStatus)
            displayPlaybackRate()
            displaySeenStatus()
            setTimeout(startSubtitlesHandler, 1000)

            if (isJW) {
                for (const sel of Object.values(JW_VIDEO_RATE_SELECTORS)) {
                    const el = document.querySelector(sel)
                    if (el) {
                        el.addEventListener('click', () => setTimeout(() => displayPlaybackRate(LS_USER_PREF_VIDEO_PLAYBACK_RATE), 100))
                    }
                }
            }
        }
    }, 500)
}

const updateSeenStatus = (ev) => {
    addToLocalStorage('current_time', ev.target.currentTime)
}

const displaySeenStatus = () => {
    const previouslySeen = getFromLocalStorage('seen')

    const time = getFromLocalStorage('current_time')

    if (!mediaDuration) {
        if (audioElement) {
            audioElement.currentTime = time
            mediaDuration = audioElement.duration
        }

        if (videoElement) {
            videoElement.currentTime = time
            mediaDuration = videoElement.duration
        }

        if (!mediaDuration) {
            setTimeout(displaySeenStatus, 1000)
        }
    }

    if ((previouslySeen || time > mediaDuration * .97) && !seenShown) {
        if (!previouslySeen) {
            addToLocalStorage('seen', true)
        }

        const result = getFirstElFromList(MEDIA_TITLE_SELECTORS, document)
        if (result) {
            const {el} = result
            el.append(getSeenIndicator())
            seenShown = true
        }
    }
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

    if (videoElement) {
        const rate = getPlaybackRate(LS_USER_PREF_VIDEO_PLAYBACK_RATE)
        const durationWrapper = document.querySelector('#vjs_video_3 > div.vjs-control-bar > div.vjs-control-group.vjs-progress-group > div.vjs-control-group.vjs-time-display-group')

        let playbackRateElement = document.querySelector('.refined-jw-audio-rate')

        if (!playbackRateElement) {
            playbackRateElement = document.createElement('span')
            playbackRateElement.className = `refined-jw-audio-rate vjs-duration vjs-time-control vjs-control`
            durationWrapper.appendChild(playbackRateElement)
        }
        playbackRateElement.innerHTML = `${rate}x`

        window.dispatchEvent(new Event('resize'));
    }
}

function setRate(rate, rateHandlerElements, lsKey) {
    let rateHandlerSelector = rateHandlerElements[rate.toString()]
    if (!rateHandlerSelector) {
        rateHandlerSelector = rateHandlerElements['1']
    }

    const rateHandler = document.querySelector(rateHandlerSelector)
    if (rateHandler) {
        rateHandler.click()
        localStorage.setItem(lsKey, rate.toString())
        displayPlaybackRate(lsKey)
        return rate
    }
    return null
}

const setPlaybackRate = (rate) => {
    if (audioElement) {
        if (isWOL) {
            const availablePlaybackRates = getAvailablePlaybackRates()
            const actualRate = Math.min(Math.max(availablePlaybackRates[0], rate), availablePlaybackRates[availablePlaybackRates.length - 1])
            audioElement.playbackRate = actualRate
            localStorage.setItem(LS_USER_PREF_AUDIO_PLAYBACK_RATE, actualRate.toString())
            displayPlaybackRate(LS_USER_PREF_AUDIO_PLAYBACK_RATE)
        } else if (isJW) {
            setRate(rate, JW_AUDIO_RATE_SELECTORS, LS_USER_PREF_AUDIO_PLAYBACK_RATE);
        }
    }
    if (videoElement && isJW) {
        setRate(rate, JW_VIDEO_RATE_SELECTORS, LS_USER_PREF_VIDEO_PLAYBACK_RATE);
    }
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
const LS_USER_PREF_VIDEO_PLAYBACK_RATE = 'userPref-video-playbackRate';
const LS_PREVENT_SEARCH_FOCUS = 'preventSearchFocus';
const LS_CURRENT_SHORTCUT = 'currentShortcut';

const LOCAL_STORAGE_KEY = 'REFINED-JW-USER-DATA'

const updateSelectionsInLocalStorage = (id, html, uri = window.location.href) => {

    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}")

    const key = uriToKey(uri)
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

    usageTracking('delete_selection')
}

const uriToKey = (uri) => {
    try {
        const url = new URL(uri)
        const {href, hash} = url
        const finalUrl = isJW ? href : href.replace(hash, "")
        return encodeURIComponent(finalUrl)
    } catch (e) {
        console.error(e)
        console.error(uri)
        return uri
    }
}

const getFromLocalStorage = (type, uri = window.location.href) => {

    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}")

    const key = uriToKey(uri)
    const currentData = userData[key] || "{}"

    if (type === 'comment') {
        return currentData[type] || {}
    } else if (type === 'selection') {
        return currentData[type] || []
    } else if (type === 'current_time') {
        return currentData[type] || 0
    } else if (type === 'seen') {
        return currentData[type] || false
    } else {
        console.error('unknown type', type)
    }
}

const addToLocalStorage = (type, value, uri = window.location.href) => {
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
    } else if (type === 'current_time') {
        userDataOfType = value
    } else if (type === 'seen') {
        userDataOfType = value
    } else {
        console.error('unknown type', type)
    }

    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}")

    const key = uriToKey(uri)
    const currentDataComplete = userData[key] || {}

    currentDataComplete[type] = userDataOfType

    userData[key] = currentDataComplete

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData))

    const trackedEvents = ['comment', 'selection']

    if (trackedEvents.includes(type)) {
        usageTracking(type)
    }
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

let setVideoCurrentTime = (time) => {

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
            console.info('not enough wol data to get markers', {langWritten, docId, bookNo, chapNo, audioPubSym})
            return;
        }

        // EXAMPLE: https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?booknum=1&output=json&pub=nwt&fileformat=MP3&alllangs=0&track=1&langwritten=S&txtCMSLang=S
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
            return;
        }

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
            usageTracking('request_shortcuts')
            sendResponse(SHORTCUTS);
        }
        if (request.type === 'url_changed') {
            initJWRefinedDeferred(500)
        }
        return true;
    }
);


const initJWRefinedDeferred = (timeout = 100) => {
    setTimeout(() => {
        initJWRefined()
    }, timeout)
}

initJWRefinedDeferred()
