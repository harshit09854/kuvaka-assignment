// Service for scoring leads based on offer and lead data

const { getAIIntentScore } = require('./aiService'); // Import AI intent scoring function

const decisionMakers = ['CEO', 'CTO', 'Head of', 'Director', 'VP', 'Founder']; // List of decision maker roles
const influencers = ['Manager', 'Specialist', 'Analyst']; // List of influencer roles

// Calculate rule-based score for a lead based on role, industry, and data completeness
const getRuleScore = (lead, offer) => {
    let score = 0;

    // Add points if lead's role matches decision makers or influencers
    const role = lead.role.toLowerCase();
    if (decisionMakers.some(title => role.includes(title.toLowerCase()))) {
        score += 20;
    } else if (influencers.some(title => role.includes(title.toLowerCase()))) {
        score += 10;
    }

    // Add points if lead's industry matches or is adjacent to offer's ideal use cases
    const leadIndustry = lead.industry.toLowerCase();
    const idealIndustry = offer.ideal_use_cases.map(i => i.toLowerCase());
    if (idealIndustry.includes(leadIndustry)) {
        score += 20; // Exact match
    } else {
        // Simple adjacent match logic (can be more complex)
        const isAdjacent = idealIndustry.some(icp => leadIndustry.includes(icp.split(' ')[0]));
        if (isAdjacent) {
            score += 10;
        }
    }

    // Add points if all lead fields are present (data completeness)
    const allFieldsPresent = Object.values(lead).every(field => field && field.trim() !== '');
    if (allFieldsPresent) {
        score += 10;
    }

    return score; // Return total rule-based score
};

// Convert AI intent label to numeric points
const getAIIntentPoints = (aiIntent) => {
    switch (aiIntent.toLowerCase()) {
        case 'high':
            return 50;
        case 'medium':
            return 30;
        case 'low':
            return 10;
        default:
            return 0;
    }
};

// Score all leads by combining rule-based and AI-based scores
exports.scoreAllLeads = async (leads, offer) => {
    const scoredLeads = [];
    for (const lead of leads) {
        const ruleScore = getRuleScore(lead, offer); // Get rule-based score
        const aiResponse = await getAIIntentScore(lead, offer); // Get AI intent and reasoning
        const aiPoints = getAIIntentPoints(aiResponse.intent); // Convert AI intent to points

        const finalScore = ruleScore + aiPoints; // Combine scores
        let finalIntent = 'Low';
        if (finalScore >= 70) finalIntent = 'High';
        else if (finalScore >= 40) finalIntent = 'Medium';

        scoredLeads.push({
            ...lead,
            intent: finalIntent, // Final intent label
            score: finalScore, // Final combined score
            reasoning: aiResponse.reasoning, // AI reasoning
        });
    }
    return scoredLeads; // Return array of scored leads
};

// Score a single lead with placeholder logic (returns random score)
exports.scoreLead = (lead, offer) => {
    // Placeholder scoring logic
    return { ...lead, score: Math.random() * 100 }; // Return lead with random score
};