const OpenAI = require('openai');

exports.handler = async function (event, context) {
    try {
        const { conversationHistory } = JSON.parse(event.body);

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,  // Make sure this is set in Netlify environment
        });

        // Call OpenAI with stream enabled
        const response = await openai.chat.completions.create({
            model: 'gpt-4',  // or 'gpt-3.5-turbo'
            messages: conversationHistory,
            stream: true,  // Stream enabled
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/event-stream',  // Required for streaming
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
            body: response.body.pipeTo( /* Add a function to process streaming data here */ ),
        };

    } catch (error) {
        console.error('Error in OpenAI:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error in OpenAI API', details: error.message }),
        };
    }
};
