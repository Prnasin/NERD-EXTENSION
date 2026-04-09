"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./codeExplanation.css";

interface SimilarQuestion {
  ques_title: string;
  url: string;
  difficulty: string;
  topics: string;
}
const CodeExplanation = ({
  setCodeId,
}: {
  setCodeId: Dispatch<SetStateAction<number>>;
}) => {
  const [explanation, setExplanation] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [similarQuestions, setSimilarQuestions] = useState<SimilarQuestion[]>(
    [],
  );
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("mount");

    // ONLY runs on refresh / first load
    const savedCode = localStorage.getItem("selectedCode");
    const savedExplanation = localStorage.getItem("explanation");
    const savedTopics = localStorage.getItem("topics");
    const code_id = localStorage.getItem("code_id");

    if (savedCode && savedExplanation && savedTopics) {
      console.log("Loaded from localStorage");

      setText(savedCode);
      setExplanation(savedExplanation);
      setTopics(JSON.parse(savedTopics));
      setCodeId(Number(code_id));
    }

    //  ONLY runs when extension sends message
    const handler = (event: any) => {
      if (event.data?.type === "FROM_EXTENSION") {
        console.log("From extension");

        const newCode = event.data.data;
        if (newCode === localStorage.getItem("selectedCode")) {
          console.log("Same code → skipping API");
          return;
        }
        //  DO NOT TOUCH localStorage here
        setText(newCode);
        getExplanation(newCode);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleClick = async (topic: string) => {
    try {
      const res = await fetch("http://localhost:3001/similar-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
        }),
      });

      const result = await res.json();

      setSimilarQuestions(result.questions);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching explanation:", err);
    }
  };
  const getExplanation = async (codeSnippet: string) => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3001/explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code_snippet: String(codeSnippet),
        }),
      });

      const result = await res.json();

      setExplanation(result.explanation || "");
      localStorage.setItem("code_id", result.code_id);
      localStorage.setItem("selectedCode", codeSnippet);
      localStorage.setItem("explanation", result.explanation || "");
      localStorage.setItem("topics", JSON.stringify(result.topics || []));

      setCodeId(result.code_id);
      setTopics(Array.isArray(result.topics) ? result.topics : []);
    } catch (err) {
      console.error("Error fetching explanation:", err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="title">Code Explanation Assistant</h2>

        <div className="card">
          <h3 className="sectionTitle">📝 Code Snippet</h3>
          <pre className="codeBlock">{text}</pre>
        </div>

        <div className="card">
          <h3 className="sectionTitle">💡 Explanation</h3>
          {loading ? (
            <div className="dotsLoader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <p className="explanation">{explanation}</p>
          )}
        </div>

        <div className="card">
          <h3 className="sectionTitle">🏷️ Topics</h3>
          {loading ? (
            <div className="dotsLoader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <div className="topics">
              {Array.isArray(topics) && topics.length > 0 ? (
                topics.map((item, index) => (
                  <span key={index} onClick={() => handleClick(item)}>
                    {item}
                  </span>
                ))
              ) : (
                <p>No topics found</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2026 Code Explanation Assistant. All rights reserved.</p>
      </footer>

      {/* QUESTIONS MODAL */}
      <div className={`modalOverlay ${!showModal ? "hidden" : ""}`}>
        <div className="questionsModal">
          <div className="modalHeader">
            <h3>❓ Related Questions</h3>
            <button
              className="modalCloseButton"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <div className="modalContent">
            {similarQuestions.length > 0 ? (
              <ul className="questionsList">
                {similarQuestions.map((q, idx) => (
                  <li key={idx} className="questionItem">
                    <a href={q.url} target="_blank" rel="noopener noreferrer">
                      {q.ques_title || "Question"}
                    </a>
                    <div className="questionMeta">
                      <span
                        className={`difficulty ${q.difficulty?.toLowerCase()}`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="topicBadge">{q.topics}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="emptyState">No questions found for this topic</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeExplanation;
