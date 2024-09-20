const OpenAI = require('openai');

exports.handler = async function (event, context) {
    const { conversationHistory } = JSON.parse(event.body);  // Get the entire conversation history from the request

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,  // Uses the environment variable from Netlify
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',  // Replace with the appropriate model if necessary
            assistant_id: 'asst_eVUGfhUghz4jcZL8zKhrOj6',  // Use your custom Assistant ID here
            messages: conversationHistory,  // Send the full conversation history
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                response: response.choices[0].message.content,  // Send back AI's response
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to call OpenAI API',
                details: error.message,
            }),
        };
    }
};
