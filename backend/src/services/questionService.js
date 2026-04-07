
import { pool } from "../config/db.js";


const generateQuestions = async (code_id) => {
    try {
        const query1 = `
        SELECT topic_id FROM code_snippet_topic_mapper
        WHERE code_id = ? 
        `;
        const [result1] = await pool.execute(query1, [code_id]);
        const topicIds = result1.map(row => row.topic_id);
        console.log("1===>", topicIds)
        if (topicIds.length === 0) {
            return `No topics found for code_id ${code_id}`;
        }
        const query2 = `
        SELECT question_id, topic_id FROM question_topic_mapper
        WHERE topic_id IN (${topicIds.map(() => '?').join(',')})
        `;
        const [result2] = await pool.execute(query2, topicIds);
        const questionIds = result2.map(row => row.question_id);

        console.log("2===>", questionIds)
        // if (questionIds.length === 0) {
        //     return `No questions found for code_id ${code_id}`;
        // }

        const query3 = `
        SELECT id, url, title, difficulty FROM question_bank
        WHERE id IN (${questionIds.map(() => '?').join(',')})
        `;
        const [result3] = await pool.execute(query3, questionIds);

        const query4 = `
        SELECT id, topic FROM topics
        WHERE id IN (${topicIds.map(() => '?').join(',')})
        `;
        const [result4] = await pool.execute(query4, topicIds);


        const topicMap = {};
        result4.forEach(row => {
            topicMap[row.id] = row.topic;
        });
        console.log("4===>", result4)
        console.log("3===>", result3)
        console.log("2===>", result2)
        console.log("1===>", result1)
        console.log("===>", topicMap)

        return { questions: result3, url:query3.url, difficulty:query3.difficulty, topics: topicMap };

    } catch (error) {
        return `error generating questions: ${error}`   
    }
}
const generateQuestionsV2 = async (code_id) => {
    try {
        const query = `
        SELECT 
            qb.id AS ques_id,
            qb.title AS ques_title,
            qb.url,
            qb.difficulty,
            GROUP_CONCAT(DISTINCT t.topic ORDER BY t.topic SEPARATOR ', ') AS topics
        FROM code_snippet_topic_mapper cstm
        JOIN question_topic_mapper qtm 
            ON cstm.topic_id = qtm.topic_id
        JOIN question_bank qb 
            ON qtm.question_id = qb.id
        JOIN topics t 
            ON cstm.topic_id = t.id
        WHERE cstm.code_id = ?
        AND qb.deleted = FALSE
        AND t.deleted = FALSE
        GROUP BY qb.id, qb.title, qb.url, qb.difficulty;

        `;
        const [result] = await pool.execute(query, [code_id]);
        console.log("===>", result)
        return { questions: result };
    } catch (error) {
        console.error("Error generating questions:", error);
        throw new Error("Error generating questions");
    }
    // Implementation for generateQuestionsV2
}

const generateSimilarQuestions = async (topic) => {
    try {
        const query = `
        SELECT 
                qb.id AS ques_id,
                qb.title AS ques_title,
                qb.url,
                qb.difficulty
            FROM question_topic_mapper qtm
            JOIN question_bank qb 
                ON qtm.question_id = qb.id
            JOIN topics t 
                ON qtm.topic_id = t.id
            WHERE t.topic = ?
            AND qb.deleted = FALSE
            AND t.deleted = FALSE
            GROUP BY qb.id, qb.title, qb.url, qb.difficulty
            `;
        const [result] = await pool.execute(query, [topic]);
        console.log("===>", result)
        return { questions: result };
    } catch (error) {
        console.error("Error generating questions:", error);
        throw new Error("Error generating questions");
    }
    // Implementation for generateQuestionsV2
}
export { generateQuestions, generateQuestionsV2, generateSimilarQuestions}
