"use client";

import { useEffect, useState } from "react";

interface Question { //type defined for question object
  ques_title: string;
  url: string;
  difficulty: string;
  topics: string;
}

const QuestionComponent = ({ codeId }: { codeId: number }) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    getQuestions();
  }, [codeId]);

  const getQuestions = async () => {
    try {
      const res = await fetch("http://localhost:3001/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code_id: codeId }),
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <div>
      {/* <h2>Related Questions</h2>
      <ul >
        {questions.map((q, idx) => (
          <li >
           
            <span> | Difficulty: {q.difficulty}</span>
            <span> | Topic: {q.topics}</span>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default QuestionComponent;