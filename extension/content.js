console.log("CONTENT SCRIPT LOADED");
let button;
let lastMouseX = 0;
let lastMouseY = 0;


document.addEventListener("visibilitychange", () => { //hiding the button when user switch tab or minimize, otherwise the button will be shown in other tabs when user switch back
    if (!document.hidden) {
        selectedText = "";
        window.getSelection().removeAllRanges(); // clear selection when user switch back, otherwise the button will be shown without selection
        removeButton();
    }
});


// Track mouse position
document.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

let selectedText = "";

document.addEventListener("selectionchange", () => { //listen for selection change, if user select text, show button, otherwise hide button
    const text = window.getSelection().toString().trim();

    if (text.length > 0) {
        selectedText = text;

    } else {
        // ADD THIS (deselect case)
        selectedText = "";
        removeButton();
    }
});
document.addEventListener("mouseup", async (e) => { //listen for mouse up event, if user select text and release mouse, show button, otherwise hide button
    removeButton();
    const selectionObj = window.getSelection(); //get the selection object, not just the text, because we need the position of the selection to show the button
    const selection = selectionObj.toString().trim(); //get the selected text, if no text selected, hide button, otherwise show button

    if (!selection || selection.length < 20) {
        selectedText = "";
        removeButton();
        return;
    }

    selectedText = selection;

    const range = selectionObj.getRangeAt(0); //get the range of the selection, we will use the range to get the position of the selection to show the button
    const rect = range.getBoundingClientRect(); 

    let x = rect.right;
    let y = rect.bottom;

    // fallback if rect is invalid (very important)
    if (!x || !y || (rect.width === 0 && rect.height === 0)) {
        x = e.clientX;
        y = e.clientY;
    }

    // debounce API call (important)
    // clearTimeout(debounceTimer);

    // debounceTimer = setTimeout(async () => {
        try {
            const res = await fetch("http://localhost:3001/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: selectedText })
            });

            const data = await res.json();

            console.log("Prediction:", data);

            // ONLY show button if it's code
            if (data.prediction === "code") {
                showButton(x - 60, y + 8);
            }

        } catch (err) {
            console.error("API error:", err);
        }
    // }, 1); // small delay to avoid spam
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
                type: "OPEN_EXPLAIN", //identifier for the listener to consume the correct message
                payload: textToSend
            });
        };
    }

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;

    button.classList.add("show"); // show the button with fade-in effect
}


function removeButton() {
    if (button) {
        button.classList.remove("show"); //
    }
}  
