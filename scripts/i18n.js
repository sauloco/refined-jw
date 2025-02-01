document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (key) {
            el.innerHTML = chrome.i18n.getMessage(key);
        }
    });
});

function getLocale(key, ...args) {
    try {
        const value = chrome.i18n.getMessage(key, args);
        if (!value) {
            console.error(`Missing translation for ${key}`);
        }
        return value || key;
    } catch (e) {
        console.error(`Failed to get translation for ${key}`);
        console.error(e);
        return key;
    }


}