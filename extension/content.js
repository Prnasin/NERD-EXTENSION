console.log("CONTENT SCRIPT LOADED");
let button;
let lastMouseX = 0;
let lastMouseY = 0;

// Track mouse position
document.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

let selectedText = "";

document.addEventListener("selectionchange", () => {
    const text = window.getSelection().toString().trim();

    if (text.length > 0) {
        selectedText = text;
        console.log("Stored selection:", selectedText);
    }
});
document.addEventListener("mouseup", (e) => {
    if (button && button.contains(e.target)) return;

    if (selectedText.length > 0) {
        showButton(lastMouseX, lastMouseY);
    } else {
        removeButton();
    }
});

function showButton(x, y, text) {
    removeButton();

    button = document.createElement("button");
    button.innerText = "Explain this";

    button.style.position = "fixed"; // IMPORTANT
    button.style.left = x + "px";
    button.style.top = (y + 10) + "px"; // slight offset below cursor
    button.style.zIndex = "2147483647";
    button.style.padding = "6px 10px";
    button.style.background = "black";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "6px";
    button.style.cursor = "pointer";

    // 
    chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SEND_TO_PAGE") {
        console.log("Sending to page:", msg.data);

        window.postMessage(
            {
                type: "FROM_EXTENSION",
                data: msg.data
            },
            "*"
        );
    }
});
    button.onclick = () => {
        console.log("Button clicked:", selectedText);

        chrome.runtime.sendMessage({
        type: "OPEN_EXPLAIN",
        payload: selectedText
    });

        

        
    };

    document.body.appendChild(button);
}

function removeButton() {
    if (button) {
        button.remove();
        button = null;
    }
}