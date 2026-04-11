"use client";
import CodeExplanation from "@/components/CodeExplanation/CodeExplanation";
import { useEffect, useState } from "react";

export default function Home() {
  const [codeId, setCodeId] = useState(0);
  useEffect(() => {
    // SDK logic
    if (window.ChatbotSDK) {
      window.ChatbotSDK.renderMyComponent("sdk-root", { //container id, props 
        code_id: codeId,
      });
    } else {
      console.error("SDK not loaded yet");
    }
  
  }, [codeId]); // every time codeId changes, the chatbot will re-render with the new codeId, and we can use this codeId to fetch the explanation for the new code in the chatbot component
  //initially codeid is 0. As soon as explanation api gets called codeId is reset with anew codeId and useeffect called again and eventually sdk gets loaded again

  return (
    <div>
      <CodeExplanation setCodeId={setCodeId} />
      <div id="sdk-root"></div>
      {/* // This is where the chatbot will be rendered by the SDK, we can render it in any page, and we can also pass props to it */}
    </div>
  );
}
