console.log("CONTENT SCRIPT LOADED");
let button;
let lastMouseX = 0;
let lastMouseY = 0;

// Track mouse position
document.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

// Detect selection
document.addEventListener("mouseup", (e) => {
    if (button && button.contains(e.target)) return;
    const text = window.getSelection().toString().trim();
    console.log("Selected text:", text);

    if (text.length > 0) {
        showButton(lastMouseX, lastMouseY, text);
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
    button.onclick = () => {
        console.log("Button clicked:", text);

        // ✅ STORE TEXT
        chrome.storage.local.set({
            selectedText: text
        });

        // ✅ Trigger extension page
        chrome.runtime.sendMessage({
            type: "OPEN_EXPLAIN"
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