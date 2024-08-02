document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "request_shortcuts"}, function (shortcuts) {
            if (shortcuts) {
                const manifest = chrome.runtime.getManifest();
                enableRefinedJW(manifest.version)
                renderShortcuts(shortcuts)
            }
        });
    });
})

const enableRefinedJW = (version) => {
    const title = document.querySelector('h1');
    title.innerHTML = `Refined JW is enabled`
    const versionEl = document.querySelector('.version');
    versionEl.innerHTML = `v${version}`
}