const functions = require('firebase-functions');
const OpenAI = require('openai');
const cors = require('cors')({ origin: true }); // Optional: if you need CORS support for API requests

const openai = new OpenAI({
    apiKey: functions.config().openai.key,  // Store API key in Firebase config
});

// Export the Firebase function
exports.openaiFunction = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(400).send('Invalid request method');
        }

        const { conversationHistory } = req.body;

        try {
    const response = await openai.chat.completions.create({
        model: 'o1-preview',
        messages: conversationHistory,
    });

    res.status(200).send({
        response: response.choices[0].message.content,
    });
} catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).send({
        error: 'Internal Server Error. Please try again later.',
    });
}
    });
});

