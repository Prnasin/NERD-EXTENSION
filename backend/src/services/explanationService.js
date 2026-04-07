import { OpenAI } from "openai";
import { pool } from "../config/db.js";

const openai = new OpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL,
    apiKey: process.env.DEEPSEEK_API_KEY,
});

const generateExplanation = async (code_snippet) => {
    try {


        let messages = [{ role: "system", content: `You are a coding assistant. Return explanation in 2 lines and related topic for the given code snippet in json format. Topics can be any data structure (for example:array, linked list), any algorithms (for example:dynamic programming), or any tech stacks (for example:node js, next js)
            EXAMPLE JSON OUTPUT:
            {
                "explanation": "something something",
                "topics": ["trees", "dynamic programming"]
            }`
        }];

        messages.push({ role: "user", "content": code_snippet })
        console.log(messages)

        const completion = await openai.chat.completions.create({

            messages: messages,
            model: "deepseek-chat",
            response_format: {
                'type': 'json_object'
            }

        });

        let answer = JSON.parse(completion.choices[0].message.content);
        const topics = answer.topics
        const query3 = `
        SELECT id FROM topics
        WHERE topic IN (?)
        `;
        const [result3] = await pool.query(query3, [topics])
        

        console.log("123====>", result3)
        


        
        const query2 = `
          INSERT INTO code_snippet_history (snippet, explanation)
          VALUES (?, ?)
        `;

        const [result] = await pool.execute(query2, [code_snippet, answer.explanation]);
        console.log(result)
        const insertid = result.insertId
        const values = result3.map(row => [insertid, row.id]);
        const insertQuery = `
            INSERT INTO code_snippet_topic_mapper (code_id, topic_id)
            VALUES ?
            `;

        await pool.query(insertQuery, [values]);
    
        console.log("===>", answer)
        

        return { answer:answer.explanation, insertid, topics};
    } catch (error) {
        console.log("====1>", error)
        return { answer: `error generating answer: ${error}`, insertid: null }

    }
}
export { generateExplanation }