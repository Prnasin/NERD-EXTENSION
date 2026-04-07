// import { generateAnswer } from "../services/chatbotService";
import { generateAnswer, deleteHistory } from "../services/chatbotService.js";


const getAnswer = async (req, res) => {
    try {
        const { code_id, question } = req.body;

        if (!code_id || !question) {
            return res.status(400).json({ error: "codeId & question required" });
        }

        const answer = await generateAnswer(code_id, question);

        
        res.status(200).json({
            question,
            answer,
            
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
const clearHistory = async (req, res) => {
     try {
        const { code_id } = req.body;

        if (!code_id) {
            return res.status(400).json({ error: "codeId required" });
        }

        const result = await deleteHistory(code_id);
        if(result) {
             res.status(200).json({
            status:"deleted succesfully"
            
        });
        } else {
             res.status(400).json({
            status:"failed to delete"
            
        });
        }
        
       

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }

};
export {getAnswer, clearHistory}
//microservice
//modularity