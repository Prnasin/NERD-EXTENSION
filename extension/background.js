chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "OPEN_EXPLAIN") {

        //  store data
        chrome.storage.local.set({
            selectedCode: message.payload
        });
        
        // open ONLY ONE tab
        chrome.tabs.create({
            url: "http://localhost:3000"
        });
    }
});