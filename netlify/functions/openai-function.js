const OpenAI = require('openai');

exports.handler = async function (event, context) {
    try {
        const { conversationHistory } = JSON.parse(event.body);  // Get the conversation history
        console.log('Received conversationHistory:', conversationHistory);

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,  // Make sure this is set in Netlify environment
        });

        // Call OpenAI without using assistant_id
        const response = await openai.chat.completions.create({
            model: 'gpt-4',  // You can change this to 'gpt-3.5-turbo' if needed
            messages: conversationHistory,  // Pass the entire conversation history
        });

        console.log('OpenAI response:', response);  // Log the full response from OpenAI

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
