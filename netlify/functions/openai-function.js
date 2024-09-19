const { Configuration, OpenAIApi } = require('openai');

exports.handler = async function (event) {
    const { prompt } = JSON.parse(event.body);

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',  // You can replace with other models like gpt-4
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.7,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                response: response.data.choices[0].text.trim(),
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error with OpenAI API request' }),
        };
    }
};
