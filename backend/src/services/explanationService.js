import { OpenAI } from "openai";
import { pool } from "../config/db.js";

const openai = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const generateExplanation = async (code_snippet) => {
  try {
    let messages = [
      {
        role: "system",
        content: `You are a skilled code educator. Analyze the given code snippet and provide:
1. A concise explanation of what the code does
2. Related programming topics (data structures, algorithms, design patterns, frameworks)
3. Return response as JSON
 
Guidelines:
- Explanation should be beginner-friendly but technically accurate
- Topics should cover: data structures (array, linked list, tree), algorithms (sorting, DP, greedy), design patterns, or tech stacks
- Only include topics directly relevant to the code
- Format: {"explanation": "...", "topics": ["topic1", "topic2"]}
            EXAMPLE JSON OUTPUT:
            {
                "explanation": "something something",
                "topics": ["tree", "dynamic programming"]
            }`,
      },
    ];

    messages.push({ role: "user", content: code_snippet });
    console.log(messages);

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "deepseek-chat",
      response_format: {
        type: "json_object",
      },
    });

    let answer = JSON.parse(completion.choices[0].message.content);
    const topics = answer.topics;
    const query3 = `
        SELECT id FROM topics
        WHERE topic IN (?)
        `;
    const [result3] = await pool.query(query3, [topics]);

    console.log("123====>", result3);

    const query2 = `
          INSERT INTO code_snippet_history (snippet, explanation)
          VALUES (?, ?)
        `;

    const [result] = await pool.execute(query2, [
      code_snippet,
      answer.explanation,
    ]);
    console.log(result);
    const insertid = result.insertId;
    const values = result3.map((row) => [insertid, row.id]);
    if (values.length > 0) {
      const insertQuery = `
            INSERT INTO code_snippet_topic_mapper (code_id, topic_id)
            VALUES ?
            `;

      await pool.query(insertQuery, [values]);

    }
    return { answer: answer.explanation, insertid, topics };
  } catch (error) {
    console.log("====1>", error);
    return { answer: `error generating answer: ${error}`, insertid: null };
  }
};
export { generateExplanation };
