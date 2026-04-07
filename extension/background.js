
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "OPEN_EXPLAIN") {
        // ✅ Store in extension storage
        chrome.storage.local.set({ selectedText: message.payload });

        // ✅ Open tab
        chrome.tabs.create({
            url: "index.html"
        });
    }
});