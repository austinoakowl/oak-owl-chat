const OpenAI = require('openai');

exports.handler = async function (event, context) {
    try {
        const { conversationHistory } = JSON.parse(event.body);  // Get the conversation history
        console.log('Received conversationHistory:', conversationHistory);

        // Ensure that conversationHistory isn't empty before calling OpenAI
        if (!conversationHistory || conversationHistory.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'conversationHistory is empty' }),
            };
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,  // Make sure this is set in Netlify environment
        });

        // Initiating a streaming call to OpenAI
        const responseStream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',  // You can change this to 'gpt-4' if needed
            messages: conversationHistory,  // Pass the entire conversation history
            stream: true,  // Enable streaming
        });

        // Create a stream to handle data chunks as they come in
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
            body: responseStream,
        };

    } catch (error) {
        console.error('Error calling OpenAI:', error);  // Log the error

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to call OpenAI API',
                details: error.message,  // Include detailed error message
            }),
        };
    }
};
