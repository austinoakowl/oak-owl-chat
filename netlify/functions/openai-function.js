const OpenAI = require('openai');

exports.handler = async function (event, context) {
    try {
        const { conversationHistory } = JSON.parse(event.body);
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

        // Enable streaming for real-time responses
        const responseStream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversationHistory,
            stream: true,
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/event-stream',  // Make sure to use event-stream type
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
            body: responseStream,  // The streaming response
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
