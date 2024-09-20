const OpenAI = require('openai');

exports.handler = async function (event, context) {
    try {
        const { conversationHistory } = JSON.parse(event.body);

        if (!conversationHistory || conversationHistory.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'conversationHistory is empty' }),
            };
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Set up response headers to support streaming
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
            },
            body: await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: conversationHistory,
                stream: true,
            }).then((stream) => {
                return stream.data.pipe(res);
            }),
        };
    } catch (error) {
        console.error('Error in OpenAI:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to stream response',
                details: error.message,
            }),
        };
    }
};
