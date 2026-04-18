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
- Topics should be within the following options: 
    Arrays
    Sorting
    Strings
    Hashing
    Binary Search
    Matrix
    Recursion and Backtracking
    Stack
    Queue
    Deque
    Heap
    Bit Manipulation
    Linked List
    Binary Tree
    Binary Search Tree
    Greedy
    Dynamic Programming
    Graph
    Trie
- Only include topics directly relevant to the code
- Format: {"explanation": "...", "topics": ["topic1", "topic2"]}
            EXAMPLE JSON OUTPUT:
            {
                "explanation": "something something",
                "topics": ["Trie", "Dynamic Programming"]
            }`,
      },
    ];

    messages.push({ role: "user", content: code_snippet });
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "deepseek-chat",
      response_format: {
        type: "json_object", //because we want response in json format to easily extract explanation and topics and use them in frontend and database
      },
    });

    let response = JSON.parse(completion.choices[0].message.content);
    const topics = response.topics;

    const topicsQuery = `
        SELECT id FROM topics
        WHERE topic IN (?)
        `;
    const [topicsResult] = await pool.query(topicsQuery, [topics]); //topi

    const insertQuery = `
          INSERT INTO code_snippet_history (snippet, explanation)
          VALUES (?, ?)
        `;

    const [result] = await pool.execute(insertQuery, [
      code_snippet,
      response.explanation,
    ]);

    const insertid = result.insertId;

    const values = topicsResult.map((row) => [insertid, row.id]); //preparing values to insert into code_snippet_topic_mapper table to link code snippet with its topics
    if (values.length > 0) {
      const insertQuery2 = `
            INSERT INTO code_snippet_topic_mapper (code_id, topic_id)
            VALUES ?
            `;

      await pool.query(insertQuery2, [values]); //inserting multiple rows at once to link code snippet with its topics in mapper table
    }
    return { answer: response.explanation, insertid, topics };
  } catch (error) {
    return { answer: `error generating answer: ${error}`, insertid: null };
  }
};
export { generateExplanation };
