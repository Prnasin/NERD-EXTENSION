
chrome.storage.local.get(["selectedText"], (result) => {
    const text = result.selectedText;

    document.getElementById("code").innerText = text || "No text found";
});