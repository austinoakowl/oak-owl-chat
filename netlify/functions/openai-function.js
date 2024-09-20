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
            apiKey: process.env.OPENAI_API_KEY,  // Ensure this is set in the environment
        });

        // Set up the headers to support text/event-stream for streaming
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',  // CORS header
            },
            body: await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',  // Ensure this matches your model choice
                messages: conversationHistory,  // Pass the entire conversation history
                stream: true,  // Enable streaming
            }, {
                responseType: 'stream',  // Set response type to stream
            }).then((response) => {
                // Return the streaming response
                return response.data.pipe(res);  // Pipe the stream data to the response
            }),
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
