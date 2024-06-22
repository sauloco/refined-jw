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