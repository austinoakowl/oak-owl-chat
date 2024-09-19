const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

exports.handler = async function (event, context) {
    const { prompt } = JSON.parse(event.body);

    // Set up OpenAI configuration with your API key
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    try {
        // Send the prompt to OpenAI and get the response
        const response = await openai.createCompletion({
            model: 'text-davinci-003', // You can change this to another model
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.7,
        });

        // Return the AI response
        return {
            statusCode: 200,
            body: JSON.stringify({
                response: response.data.choices[0].text,
            }),
        };
    } catch (error) {
        // Handle errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error with OpenAI API request' }),
        };
    }
};
