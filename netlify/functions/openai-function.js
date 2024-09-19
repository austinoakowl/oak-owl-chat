const OpenAI = require('openai');

exports.handler = async function (event, context) {
    const { prompt } = JSON.parse(event.body);

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,  // Uses the environment variable from Netlify
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',  // Or use 'text-davinci-003' if preferred
            messages: [{ role: 'user', content: prompt }],
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                response: response.choices[0].message.content,  // Sends back AI's response
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
