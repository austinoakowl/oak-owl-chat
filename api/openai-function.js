import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
    const { conversationHistory } = req.body;

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY, // Add your OpenAI key here
    });
    const openai = new OpenAIApi(configuration);

    try {
        const response = await openai.createChatCompletion({
            model: "o1-preview",  // Change to your desired model
            messages: conversationHistory,
        });

        res.status(200).json({ response: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
