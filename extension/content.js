console.log("CONTENT SCRIPT LOADED");
let button;
let lastMouseX = 0;
let lastMouseY = 0;
// document.addEventListener("visibilitychange", () => {
//     if (!document.hidden) {
//         // when user comes back to tab
//         selectedText = "";
//         removeButton();
//     }
// });
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        selectedText = "";
        window.getSelection().removeAllRanges(); // ⭐ IMPORTANT
        removeButton();
    }
});
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
    } else {
        // 🔥 ADD THIS (deselect case)
        selectedText = "";
        removeButton();
    }
});
document.addEventListener("mouseup", (e) => {
    if (button && button.contains(e.target)) return;
    removeButton();
    const selectionObj = window.getSelection();
    const selection = selectionObj.toString().trim();

    if (!selection || selection.length < 20) {
        selectedText = "";
        removeButton();
        return;
    }

    selectedText = selection;

    const range = selectionObj.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    let x = rect.right;
    let y = rect.bottom;

    // 🔥 fallback if rect is invalid (very important)
    if (!x || !y || (rect.width === 0 && rect.height === 0)) {
        x = e.clientX;
        y = e.clientY;
    }

    // 🎯 show near selection end (down-left)
    showButton(x - 60, y + 8);
});


function showButton(x, y) {
    if (!button) {
        button = document.createElement("button");
        button.className = "explain-btn";
        button.innerHTML = "🧠 Ask Nerd";
        document.body.appendChild(button);

        button.onclick = () => {
            const textToSend = selectedText;

            selectedText = "";
            window.getSelection().removeAllRanges();
            removeButton();

            chrome.runtime.sendMessage({
                type: "OPEN_EXPLAIN",
                payload: textToSend
            });
        };
    }

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;

    button.classList.add("show");
}


function removeButton() {
    if (button) {
        button.classList.remove("show");
    }
}  
    // showButton(lastMouseX, lastMouseY); with something like this