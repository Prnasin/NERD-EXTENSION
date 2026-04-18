import { predict } from "../services/pythonService.js";

const predictInput = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const output = await predict(text);
    const result = JSON.parse(output);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prediction failed" });
  }
};
export { predictInput };
