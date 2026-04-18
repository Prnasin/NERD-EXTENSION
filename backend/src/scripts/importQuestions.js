import fs from "fs";
import csvParser from "csv-parser";
import { pool } from "../config/db.js";

const CSV_PATH = "e:/NERD_EXTENSION/backend/gfg_sde_sheet.csv";

// Get or create topic (safe version)
const getOrCreateTopic = async (conn, topicName) => {
  const [rows] = await conn.execute(`SELECT id FROM topics WHERE topic = ?`, [
    topicName,
  ]);

  if (rows.length > 0) return rows[0].id;
  const [result] = await conn.execute(
    `INSERT INTO topics (topic)
     VALUES (?)`,
    [topicName],
  );

  return result.insertId;
};

// Get or create question (IMPORTANT FIX)
const getOrCreateQuestion = async (conn, row) => {
  const [rows] = await conn.execute(
    `SELECT id FROM question_bank WHERE url = ?`,
    [row.url],
  );

  if (rows.length > 0) return rows[0].id;

  const [result] = await conn.execute(
    `INSERT INTO question_bank (title, difficulty, url)
     VALUES (?, ?, ?)`,
    [row.title, row.difficulty, row.url],
  );

  return result.insertId;
};

// Insert mapper (safe from duplicates)
const insertQuestionTopicMapper = async (conn, question_id, topic_id) => {
  await conn.execute(
    `INSERT INTO question_topic_mapper (question_id, topic_id)
     VALUES (?, ?)`,
    [question_id, topic_id],
  );
};

const processCsv = async () => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const rows = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_PATH)
        .pipe(csvParser())
        .on("data", (data) => {
          console.log("RAW ROW:", data); // Debug log to check raw CSV data
          rows.push(data);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    for (const row of rows) {
      const title = row["Question Title"];
      const topic = row["Topic"];
      const difficulty = row["Difficulty"];
      const url = row["Link"];

      console.log("Mapped Row:", { title, topic, difficulty, url }); // debug

      if (!title || !topic) {
        console.log("Skipped row:", row);
        continue;
      }

      const topics = topic.split(",").map((t) => t.trim());

      const question_id = await getOrCreateQuestion(conn, {
        title,
        difficulty,
        url,
      });

      for (const topicName of topics) {
        const topic_id = await getOrCreateTopic(conn, topicName);
        await insertQuestionTopicMapper(conn, question_id, topic_id);
      }
    }

    await conn.commit();
    console.log("CSV import completed successfully");
  } catch (error) {
    await conn.rollback();
    console.error("CSV import failed:", error);
  } finally {
    conn.release();
  }
};

processCsv();
