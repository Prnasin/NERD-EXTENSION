import { generateExplanation } from "../services/explanationService.js";
const getExplanation = async (req, res) => {
  try {
    const { code_snippet } = req.body;

    if (!code_snippet) {
      return res.status(400).json({ error: "code_snippet required" });
    }

    const {
      answer,
      insertid,
      topics,
    } = await generateExplanation(code_snippet); //params coming from service generateExplanation function
    if (insertid) {
      res.status(200).json({
        explanation: answer,
        code_id: insertid,
        topics: topics,
      });
    } else {
      res.status(400).json({
        explanation: `something went wrong`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export { getExplanation };
