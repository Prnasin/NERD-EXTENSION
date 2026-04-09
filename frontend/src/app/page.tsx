"use client";
import CodeExplanation from "@/components/CodeExplanation/CodeExplanation";
import { useEffect, useState } from "react";

export default function Home() {
  const [codeId, setCodeId] = useState(0);
  useEffect(() => {
    // Listen for data from extension
    console.log("inside useeffect page.tsx", codeId);
    const handler = (e: { data: { type: string; data: any } }) => {
      if (e.data?.type === "FROM_EXTENSION") {
        console.log("Received from extension:", e.data.data);
        // You can use this data however you want
        // Example:
        // send it to your component / API / state
      }
    };

    window.addEventListener("message", handler);
    // existing SDK logic
    if (window.ChatbotSDK) {
      window.ChatbotSDK.renderMyComponent("sdk-root", {
        code_id: codeId,
      });
    } else {
      console.error("SDK not loaded yet");
    }
    return () => {
      window.removeEventListener("message", handler);
    };
  }, [codeId]);

  return (
    <div>
      <CodeExplanation setCodeId={setCodeId} />
      <div id="sdk-root"></div>
    </div>
  );
}
