/*
 * RefinedJWAI — wrapper around Chrome's built-in AI APIs (Prompt API + Summarizer API).
 *
 * Requires Chrome 131+ with Gemini Nano. The extension must be registered for the
 * Built-in AI Early Access origin trial and the token must be present in manifest.json
 * under "trial_tokens". Without a valid token, availability() returns "unavailable"
 * and all methods return null/[] gracefully.
 *
 * Origin trial registration: https://developer.chrome.com/origintrials
 */

const RefinedJWAI = (() => {
    let _session = null
    let _sessionLang = null
    let _availability = null

    const SYSTEM_PROMPT =
        'You are a concise study assistant for JW.org content. ' +
        'Help users understand Bible-based articles from jw.org and wol.jw.org. ' +
        'Keep every response short and practical.'

    const SUPPORTED_LANGUAGES = new Set(['en', 'de', 'es', 'fr', 'ja'])

    const getOutputLanguage = () => {
        const lang = (document.documentElement.lang || 'en').split('-')[0].toLowerCase()
        return SUPPORTED_LANGUAGES.has(lang) ? lang : 'en'
    }

    // ---------------------------------------------------------------------------
    // Availability
    // ---------------------------------------------------------------------------

    const checkAvailability = async () => {
        // Only cache stable terminal states — 'downloading'/'after-download' are transient
        if (_availability === 'readily' || _availability === 'unavailable') return _availability
        try {
            if (typeof LanguageModel === 'undefined') {
                _availability = 'unavailable'
            } else {
                _availability = await LanguageModel.availability()
            }
        } catch {
            _availability = 'unavailable'
        }
        return _availability
    }

    const recheckAvailability = async () => {
        _availability = null
        return checkAvailability()
    }

    const isAvailable = async () => (await checkAvailability()) !== 'unavailable'

    // ---------------------------------------------------------------------------
    // Session management
    // ---------------------------------------------------------------------------

    let _creating = null  // in-flight create() promise, shared across concurrent callers

    const getSession = async (onDownloadProgress) => {
        console.log('[RefinedJW AI] getSession called, cached session:', !!_session)
        if (_session) return _session

        const avail = await checkAvailability()
        console.log('[RefinedJW AI] availability for session creation:', avail)
        if (avail === 'unavailable') return null

        // If a create() is already in flight, wait for it instead of starting another
        if (_creating) {
            console.log('[RefinedJW AI] create() already in flight, waiting...')
            return _creating
        }

        // Log raw API state before attempting create()
        try {
            const params = await LanguageModel.params()
            console.log('[RefinedJW AI] LanguageModel.params():', JSON.stringify(params))
        } catch (e) {
            console.log('[RefinedJW AI] LanguageModel.params() not available:', e.message)
        }
        console.log('[RefinedJW AI] calling LanguageModel.create()')
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
            console.error('[RefinedJW AI] session creation timed out — model may be stuck in downloading state')
            controller.abort()
        }, 15000)

        _creating = LanguageModel.create({
            systemPrompt: SYSTEM_PROMPT,
            signal: controller.signal,
        }).then(session => {
            clearTimeout(timeoutId)
            _session = session
            _creating = null
            console.log('[RefinedJW AI] session created successfully')
            return session
        }).catch(err => {
            console.error('[RefinedJW AI] failed to create session:', err)
            _creating = null
            return null
        })

        return _creating
    }

    const destroySession = () => {
        if (_session) {
            try { _session.destroy() } catch {}
            _session = null
        }
    }

    // ---------------------------------------------------------------------------
    // Features
    // ---------------------------------------------------------------------------

    /**
     * Generate a short study note for a highlighted passage.
     * @param {string} highlightedText - the selected text
     * @param {string} [articleTitle]  - title of the current article
     * @returns {Promise<string|null>}
     */
    const generateComment = async (highlightedText, articleTitle = '') => {
        const session = await getSession()
        if (!session) return null

        const context = articleTitle
            ? `Article: "${articleTitle}"\nPassage: "${highlightedText}"`
            : `Passage: "${highlightedText}"`

        const prompt =
            `${context}\n\n` +
            'Write a concise study note (2-3 sentences) for this passage. ' +
            'Focus on its spiritual meaning or practical application.'

        try {
            return await session.prompt(prompt)
        } catch (err) {
            console.warn('RefinedJWAI: generateComment failed', err)
            return null
        }
    }

    /**
     * Generate a short study note as a stream (yields chunks as they arrive).
     * @param {string} highlightedText
     * @param {string} [articleTitle]
     * @param {function} onChunk - called with each text chunk
     * @returns {Promise<void>}
     */
    const generateCommentStreaming = async (highlightedText, articleTitle = '', onChunk) => {
        const session = await getSession()
        if (!session) return

        const context = articleTitle
            ? `Article: "${articleTitle}"\nPassage: "${highlightedText}"`
            : `Passage: "${highlightedText}"`

        const prompt =
            `${context}\n\n` +
            'Write a concise study note (2-3 sentences) for this passage. ' +
            'Focus on its spiritual meaning or practical application.'

        try {
            const stream = session.promptStreaming(prompt)
            for await (const chunk of stream) {
                if (typeof onChunk === 'function') onChunk(chunk)
            }
        } catch (err) {
            console.warn('RefinedJWAI: generateCommentStreaming failed', err)
        }
    }

    /**
     * Summarize text. Tries the dedicated Summarizer API first, falls back to
     * the Prompt API, returns null if neither is available.
     * @param {string} text
     * @returns {Promise<string|null>}
     */
    const summarize = async (text) => {
        // Try dedicated Summarizer API first
        try {
            if (typeof Summarizer !== 'undefined') {
                const avail = await Summarizer.availability()
                if (avail !== 'unavailable') {
                    const summarizer = await Summarizer.create({ type: 'tldr', length: 'short' })
                    const result = await summarizer.summarize(text)
                    summarizer.destroy()
                    return result
                }
            }
        } catch (err) {
            console.warn('RefinedJWAI: Summarizer API failed, trying Prompt API', err)
        }

        // Fallback: Prompt API
        const session = await getSession()
        if (!session) return null

        try {
            return await session.prompt(
                `Summarize the following text in 1-2 sentences:\n\n${text}`
            )
        } catch (err) {
            console.warn('RefinedJWAI: summarize via Prompt API failed', err)
            return null
        }
    }

    /**
     * Find the exact text in a paragraph that answers a given question.
     * Returns the exact substring to highlight, or null if unavailable/not found.
     * @param {string} question
     * @param {string} paragraphText
     * @returns {Promise<string|null>}
     */
    const findAnswer = async (question, paragraphText, onDownloadProgress) => {
        console.log('[RefinedJW AI] findAnswer: getting session...')
        const session = await getSession(onDownloadProgress)
        if (!session) {
            console.warn('[RefinedJW AI] findAnswer: no session available')
            return null
        }

        const prompt =
            `Question: "${question}"\n\n` +
            `Paragraph: "${paragraphText}"\n\n` +
            'Find the single sentence or short phrase from the paragraph that most directly answers the question. ' +
            'Do not include Bible references in parentheses such as "(Gen. 1:1)" or "(1 Ped. 1:6)" — stop before them. ' +
            'Return only that exact text as it appears in the paragraph — no changes, no extra words. ' +
            'Only if the question explicitly asks for multiple distinct things, return each on its own line — otherwise return just one.'

        console.log('[RefinedJW AI] findAnswer: calling session.prompt()...')
        try {
            const raw = (await session.prompt(prompt)).trim()
            console.log('[RefinedJW AI] findAnswer: prompt returned:', raw)
            const results = raw.split('\n').map(s => s.trim()).filter(Boolean)
            return results.length > 0 ? results : null
        } catch (err) {
            console.error('[RefinedJW AI] findAnswer: session.prompt() failed:', err)
            return null
        }
    }

    /**
     * Identify 3-5 key passages in an article for auto-highlighting.
     * Returns an array of exact passage strings from the article text.
     * @param {string} articleText
     * @param {string} [articleTitle]
     * @returns {Promise<string[]>}
     */
    const suggestHighlights = async (articleText, articleTitle = '') => {
        const session = await getSession()
        if (!session) return []

        const header = articleTitle ? `Article: "${articleTitle}"\n\n` : ''
        const prompt =
            `${header}${articleText}\n\n` +
            'Identify the 3 to 5 most spiritually significant sentences from this article. ' +
            'Return only the exact sentences, one per line, with no numbering or extra text.'

        try {
            const result = await session.prompt(prompt)
            return result
                .split('\n')
                .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
                .filter(Boolean)
        } catch (err) {
            console.warn('RefinedJWAI: suggestHighlights failed', err)
            return []
        }
    }

    // ---------------------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------------------

    return {
        checkAvailability,
        recheckAvailability,
        isAvailable,
        getSession,
        destroySession,
        generateComment,
        generateCommentStreaming,
        summarize,
        findAnswer,
        suggestHighlights,
    }
})()
