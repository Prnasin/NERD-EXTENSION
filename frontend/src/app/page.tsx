"use client";
import CodeExplanation from "@/components/CodeExplanation/CodeExplanation";
import QuestionComponent from "@/components/QuestionComponent/QuestionComponent";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (window.ChatbotSDK) {
      window.ChatbotSDK.renderMyComponent("sdk-root", {
        code_id: 21,
      });
    } else {
      console.error("SDK not loaded yet");
    }
  }, []);
  return (
    <div>
      <CodeExplanation />
      {/* <QuestionComponent codeId={20}/> */}
      <div id="sdk-root"></div>
    </div>
  );
}
