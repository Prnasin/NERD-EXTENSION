// chatbotsdk is a react js project, not a nextjs project
import React from "react";
import { createRoot } from "react-dom/client";
import Chatbot from "./Chatbot";

function renderMyComponent(containerId, props = {}) {
  const el = document.getElementById(containerId); //get div with id sdk-root from page.tsx
  const root = createRoot(el);
  root.render(<Chatbot {...props} />);
}

// expose globally (THIS is key for <script>)
window.ChatbotSDK = {
  renderMyComponent,
};
