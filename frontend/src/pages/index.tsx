import { useEffect } from "react";
import CodeExplanation from "@/components/CodeExplanation/CodeExplanation";
// import QuestionComponent from "@/components/QuestionComponent/QuestionComponent";
// import "./globals.css";

export default function Home() {
    console.log("Component rendering");
  useEffect(() => {
    console.log("Component rendering");
    console.log("APP STARTED");
    // ✅ Load CSS
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("chatbot-sdk.css");
  document.head.appendChild(link);

  // ✅ Load JS
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("chatbot-sdk.umd.js");
  script.async = true;

  script.onload = () => {
    console.log("SDK Loaded");

    (window as any).ChatbotSDK?.renderMyComponent("sdk-root", {
      code_id: 21,
    });
  };

  document.body.appendChild(script);
}, []);

    // ✅ Load SDK properly (LOCAL FILE)
//     const script = document.createElement("script");
//     script.src = chrome.runtime.getURL("chatbot-sdk.umd.js");
//     script.async = true;

//     script.onload = () => {
//       console.log("SDK Loaded");

//       if (window.ChatbotSDK) {
//         window.ChatbotSDK.renderMyComponent("sdk-root", {
//           code_id: 21,
//         });
//       } else {
//         console.error("SDK not found after load");
//       }
//     };

//     document.body.appendChild(script);
//   }, []);

  return (
    <div>
      <CodeExplanation />
      <div id="sdk-root"></div>
    </div>
  );
}