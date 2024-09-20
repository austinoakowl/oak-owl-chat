const OpenAI = require('openai');

exports.handler = async function (event, context) {
    try {
        const { conversationHistory } = JSON.parse(event.body);  // Get the conversation history
        console.log('Received conversationHistory:', conversationHistory);

        if (!conversationHistory || conversationHistory.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'conversationHistory is empty' }),
            };
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Call OpenAI with streaming enabled
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversationHistory,
            stream: true,  // Enable streaming
        });

        // Add logging to capture raw response
        console.log('Raw OpenAI response:', response);

        return {
            statusCode: 200,
            body: JSON.stringify({
                response: response.choices[0].message.content,
            }),
        };
    } catch (error) {
        console.error('Error in OpenAI:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to call OpenAI API',
                details: error.message,
            }),
        };
    }
};
