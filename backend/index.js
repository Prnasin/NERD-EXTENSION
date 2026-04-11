import express from "express"; //backend module that enables api creation
const app = express(); //create an instance of express to set up the server
import cors from "cors"; //middleware to allow cross-origin requests, enabling communication between frontend and backend 
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

//define api endpoints and link them to their respective controller functions
//api creates
//what any endpoint is hit the corresponding funs are called
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
