const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.getAIIntentScore = async (lead, offer) => {
    const prompt = `
    Based on the following product/offer and prospect details, classify the prospect's buying intent as "High", "Medium", or "Low". Provide a short reasoning (1-2 sentences).

    Product/Offer Details:
    - Name: ${offer.name}
    - Value Propositions: ${offer.value_props.join(', ')}
    - Ideal Use Cases: ${offer.ideal_use_cases.join(', ')}

    Prospect Details:
    - Name: ${lead.name}
    - Role: ${lead.role}
    - Company: ${lead.company}
    - Industry: ${lead.industry}
    - LinkedIn Bio: ${lead.linkedin_bio}

    Output format:
    Intent: [High/Medium/Low]
    Reasoning: [1-2 sentences]
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
        });

        const output = completion.choices[0].message.content;
        const intentMatch = output.match(/Intent: (High|Medium|Low)/i);
        const reasoningMatch = output.match(/Reasoning: (.*)/i);

        const intent = intentMatch ? intentMatch[1] : 'Low';
        const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'AI reasoning could not be extracted.';

        return { intent, reasoning };
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return { intent: 'Low', reasoning: 'AI service unavailable.' };
    }
};

// Service for AI-related operations (stub for future AI logic)