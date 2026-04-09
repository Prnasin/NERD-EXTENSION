import express from "express";
const app = express();
import cors from "cors";
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", //allowing for only this, where frontend running
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
import {
  getAnswer,
  clearHistory,
} from "./src/controllers/chatbotController.js";
import { checkConnection } from "./src/config/db.js";
import { getExplanation } from "./src/controllers/explanationController.js";
import {
  getQuestions,
  similarQuestions,
} from "./src/controllers/questionController.js";

app.post("/chatbot", getAnswer);
app.post("/clear-history", clearHistory);
app.post("/explanation", getExplanation);
app.post("/questions", getQuestions);
app.post("/similar-questions", similarQuestions);

const port = process.env.PORT;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await checkConnection();
  } catch (error) {
    console.log("fail to initialize", error);
  }
});
