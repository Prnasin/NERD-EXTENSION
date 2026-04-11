import {
  generateQuestions,
  generateQuestionsV2,
  generateSimilarQuestions,
} from "../services/questionService.js";

// Controller function to handle POST /questions
const getQuestions = async (req, res) => { //function to get questions related to a code snippet via code_id sent in request body
  try {
    const { code_id } = req.body;
    if (!code_id) {
      return res.status(400).json({ error: "code_id required" });
    }
    const result = await generateQuestionsV2(code_id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const similarQuestions = async (req, res) => { //function to get similar questions based on a topic
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "topic required" });
    }
    const result = await generateSimilarQuestions(topic);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export { getQuestions, similarQuestions };
