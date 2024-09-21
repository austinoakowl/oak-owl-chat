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
            apiKey: process.env.OPENAI_API_KEY,  // Ensure this is set in Netlify environment
        });

        // Call OpenAI API for a response
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',  // You can use other models as well
            messages: conversationHistory,  // Pass the entire conversation history
        });

        console.log('OpenAI response:', response);  // Log the response for debugging

        return {
            statusCode: 200,
            body: JSON.stringify({
                response: response.choices[0].message.content,  // Send back the AI's response
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
