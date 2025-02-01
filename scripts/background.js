chrome.tabs.onUpdated.addListener(function
        (tabId, changeInfo, tab) {
        if (changeInfo.url) {
            chrome.tabs.sendMessage(tabId, {
                type: "url_changed",
                url: changeInfo.url
            });
        }
    }
);

// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(onContextMenuClick);

// A generic onclick callback function.
async function onContextMenuClick(info) {
    const [tab] = await chrome.tabs.query({currentWindow: true, active : true})

    chrome.tabs.sendMessage(tab.id, {
        type: "extract_request",
        info
    });
}
chrome.runtime.onInstalled.addListener(function (tabId) {
    // Create one test item for each context type.
    let contexts = [
        'selection',
        // 'link'
    ];
    for (let i = 0; i < contexts.length; i++) {
        let context = contexts[i];
        let from = chrome.i18n.getMessage(context)
        let title = chrome.i18n.getMessage('extractQuotesFrom', [from.toLowerCase()]);

        chrome.contextMenus.create({
            title: title,
            contexts: [context],
            id: context
        });
    }
});