chrome.storage.local.get(["selectedCode"], (result) => {
    if (result.selectedCode) {
        window.postMessage(
            {
                type: "FROM_EXTENSION",
                data: result.selectedCode
            },
            "*"
        );
    }
});