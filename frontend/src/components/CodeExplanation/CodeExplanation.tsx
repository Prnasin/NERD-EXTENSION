"use client";
import { useEffect, useState } from "react";
import "./codeExplanation.css";
// import "../styles/globals.css";
// interface similarQuestions { //type defined for question object
//   ques_title: string;
//   url: string;
//   difficulty: string;
//   topics: string;
// }
interface SimilarQuestion {
  ques_title: string;
  url: string;
  difficulty: string;
  topics: string;
}
const CodeExplanation = () => {
  const [explanation, setExplanation] = useState("");
  const [topics, setTopics] = useState([]);
  const [codeId, setCodeId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [similarQuestions, setSimilarQuestions] = useState<SimilarQuestion[]>(
    [],
  );
  const [text, setText] = useState(
    "for (int i = 0; i < m; i++) { for (int j = 0; j < n; j++) { transposeGrid[j][i] = grid[i][j]; } }",
  );
  useEffect(() => {
    getExplanation();
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

      console.log("==>", result);
      setSimilarQuestions(result.questions);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching explanation:", err);
    }
  };
  const getExplanation = async () => {
    try {
      setLoading(true);
      // console.log("Calling API");
      const res = await fetch("http://localhost:3001/explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code_snippet: text,
        }),
      });

      const result = await res.json();

      console.log("==>", result);

      // store only data array
      setExplanation(result.explanation);
      setTopics(result.topics);
    } catch (err) {
      console.error("Error fetching explanation:", err);
    } finally {
      setLoading(false); //
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
              {topics.map((item, index) => (
                <span
                  key={index}
                  onClick={() => handleClick(item)}
                  role="button"
                  tabIndex={0}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL - EMBEDDED CHATBOT WILL GO HERE */}
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
