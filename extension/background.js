chrome.runtime.onMessage.addListener((message, sender) => { //listener
    if (message.type === "OPEN_EXPLAIN") {

        //  store data
        chrome.storage.local.set({ //set
            selectedCode: message.payload
        });
        
        // open ONLY ONE tab
        chrome.tabs.create({
            url: "http://localhost:3000"
        });
    }
});