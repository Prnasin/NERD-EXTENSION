chrome.storage.local.get(["selectedCode"], (result) => { //get
    if (result.selectedCode) {
        window.postMessage(
            {
                type: "FROM_EXTENSION", //unique identifier for frontend to consume/listen the correct message
                data: result.selectedCode
            },
            "*" //target all origins, every origin can receive, no restriction
        );
    }
});