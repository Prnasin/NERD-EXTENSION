
// export default function Chatbot({ name }) {
//   return <h1>Hello {name}</h1>;
// }
'use client';

import { useState } from "react";
import './chatbot.css';


export default function Chatbot ({ code_id }) {
  const [isOpen, setIsOpen]= useState(false);
  const [messages, setMessages] = useState([]); //array of all messages in chat
  const [input, setInput] = useState('');
  const [isLoading, setLoading]= useState(false);

  const addMessages = (text, from)=> {
    const newMessage = {
      id: Date.now().toString(),
      text:text,
      from:from,

    };
    setMessages((prev)=> [...prev, newMessage]);
  };

  const handleSend = async ()=> {
    try {
      const text = input.trim();

      if(!text) return;

      addMessages(text,'user');
      setInput('');
      setLoading(true);

    
      const res = await fetch("http://localhost:3001/chatbot", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ code_id, question:text}),  // Send the message to api
      });
      const data = await res.json();
      addMessages(data.answer, 'bot')
      
    } catch (error) {
      addMessages('Error sending message', 'bot');
      
    } finally {
      setLoading(false);
    }
  };
 
  const formatMessage = (text) => {
    console.log("1==>", text)
  if (!text) return "";

  let formatted = text;

  // 1️⃣ Code blocks ```...```
  formatted = formatted.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre style='white-space:pre-wrap;
word-break:break-word;'><code>${code.trim()}</code></pre>`;
  });

  // 2️⃣ Inline code `...`
  formatted = formatted.replace(/`(.*?)`/g, "<code>$1</code>");

  // 3️⃣ Bold (**text** or ***text***)
  formatted = formatted.replace(/\*\*\*(.*?)\*\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 4️⃣ Lists (- item)
  formatted = formatted.replace(/(?:^|\n)- (.*?)(?=\n|$)/g, "<li style='margin-left: 15px;'>$1</li>");
  formatted = formatted.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");

  // 5️⃣ Line breaks 0
  formatted = formatted.replace(/\n/g, "<br/>");
console.log("2===>", formatted)
  return `
  <div style="
    word-wrap:break-word;
    overflow-wrap:break-word;
    word-break:break-word;
    max-width:100%;
  ">
    ${formatted}
  </div>
`;
};


  return (
    <>
      {/* Chat Button - Always visible */}
      <button
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}  // Toggle chat box on/off
      >
        💬
      </button>

      {/* Chat Box - Only visible if isOpen is true */}
      {isOpen && (
        <div className="chat-box">
          {/* Header */}
          <div className="header">
            <span>AI Code Assistent</span>
            {/* Close button */}
            <span
              className="close-icon"
              onClick={() => setIsOpen(false)}  // Close chat
            >
              ✕
            </span>
          </div>

          {/* Messages Area */}
          <div className="message-area">
            {/* Loop through all messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}  // Required by React for lists
                className={`bubble ${
                  msg.from === 'user' ? 'bubble-user' : 'bubble-bot'
                }`}
              >
                <div
        dangerouslySetInnerHTML={{
          __html: formatMessage(msg.text),
        }}
      />
              </div>
            ))}

            {/* Show "Typing..." when bot is responding */}
            {isLoading && (
              <div className="bubble bubble-bot typing">
                Typing...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="input-container">
            {/* Text input field */}
            <input
              type="text"
              className="input"
              placeholder="Type a message"
              value={input}  // Controlled input
              onChange={(e) => setInput(e.target.value)}  // Update input state
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}  // Send on Enter
              disabled={isLoading}  // Disable while loading
            />

            {/* Send button */}
            <button
              className="send-button"
              onClick={handleSend}  // Send message on click
              disabled={isLoading}  // Disable while loading
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};
    
