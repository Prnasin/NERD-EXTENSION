import { OpenAI } from "openai";
import { pool } from "../config/db.js";

const openai = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const generateAnswer = async (code_id, question) => {
  try {
    const query3 = `
    SELECT role, content FROM conversation_history
    WHERE code_id = ? and DELETED = ?
    `;
    const [result3] = await pool.execute(query3, [code_id, 0]);
    const query4 = `
    SELECT snippet, explanation FROM code_snippet_history
    WHERE id = ? and DELETED = ?
    `;
    const [result4] = await pool.execute(query4, [code_id, 0]);

    let messages = [
      {
        role: "system",
        content:
          `You are an expert code assistant specializing in explaining and debugging code. 
Your role is to:
- Answer code-related questions clearly and concisely in 2-3 sentences
- Provide accurate technical explanations with examples when helpful
- Ask clarifying questions if the context is unclear
- Suggest best practices and improvements
- Guide users to understand concepts rather than just providing answers

Context: You have access to the code snippet and its explanation. Reference them when answering questions.

If asked about non-code topics, politely redirect: "I'm specialized in code assistance. Could you rephrase your question related to the code?"

Keep responses focused, technical, and developer-friendly.`,
      },
    ];
    messages.push({ role: "user", content: result4[0].snippet });
    messages.push({ role: "assistant", content: result4[0].explanation });
    messages.push(...result3);

    messages.push({ role: "user", content: question });
    console.log(messages);
    const query = `
      INSERT INTO conversation_history (code_id, role, content)
      VALUES (?, ?, ?)
    `;

    await pool.execute(query, [code_id, "user", question]);

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "deepseek-chat",
    });

    let answer = completion.choices[0].message.content;
    const query2 = `
      INSERT INTO conversation_history (code_id, role, content)
      VALUES (?, ?, ?)
    `;

    await pool.execute(query2, [code_id, "assistant", answer]);

    return answer;
  } catch (error) {
    return `error generating answer: ${error}`;
  }
};
const deleteHistory = async (code_id) => {
  try {
    const query3 = `
    UPDATE conversation_history
    SET deleted = 1
    WHERE code_id = ? and deleted = ?
    `;
    await pool.execute(query3, [code_id, 0]);
    return true;
  } catch (error) {
    return false;
  }
};

export { generateAnswer, deleteHistory };
