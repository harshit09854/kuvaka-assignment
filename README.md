AI Lead Scorer Backend
This project is a backend service designed to qualify and score sales leads. It accepts product information and a list of leads, then uses a hybrid scoring model—combining a deterministic rule-based engine with AI-powered intent analysis—to prioritize prospects.

Live URL: https://your-deployed-app-url.com

Features
🎯 Context-Aware: Set the context by providing details about your product or offer.

📥 Bulk Upload: Upload leads easily via a CSV file.

🤖 Hybrid Scoring: Utilizes both a rigid rule layer and a flexible AI layer for nuanced scoring.

📈 RESTful API: Simple and clear endpoints to manage the scoring process.

📄 CSV Export: (Bonus) Endpoint to export scored leads as a CSV file.

Setup & Installation
Follow these steps to run the project locally.

Clone the repository:

Bash

git clone <your-repository-url>
cd <repository-directory>
Install dependencies:

Bash

# For Node.js
npm install

# For Python
pip install -r requirements.txt
Set up environment variables:
Create a .env file in the root directory and add your AI provider's API key:

Code snippet

# Example for OpenAI
OPENAI_API_KEY="sk-..."
Run the server:

Bash

# For Node.js
npm start

# For Python
python app.py
The server will be running on http://localhost:3000.

API Usage
You can use cURL or an API client like Postman to interact with the service.

1. Set the Offer
Upload the product/offer details that will be used as context for scoring.

Bash

curl -X POST http://localhost:3000/offer \
-H "Content-Type: application/json" \
-d '{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 automated outreach", "6x more meetings booked"],
  "ideal_use_cases": ["B2B SaaS companies in the mid-market segment", "Sales teams looking to scale top-of-funnel"]
}'
2. Upload Leads
Upload a CSV file containing the leads. The CSV must have the headers: name, role, company, industry, location, linkedin_bio.

Bash

curl -X POST http://localhost:3000/leads/upload \
-F "file=@/path/to/your/leads.csv"
3. Trigger Scoring
Initiate the scoring pipeline for the uploaded leads.

Bash

curl -X POST http://localhost:3000/score
4. Get Results
Retrieve the list of scored leads.

Bash

curl -X GET http://localhost:3000/results
Example Response:

JSON

[
  {
    "name": "Ava Patel",
    "role": "Head of Growth",
    "company": "FlowMetrics",
    "intent": "High",
    "score": 85,
    "reasoning": "As Head of Growth at a SaaS company, Ava is a key decision-maker in the ideal customer profile."
  }
]
Scoring Logic Explained
Each lead's final score is the sum of a Rule Score and an AI Score.

Rule Layer (Max 50 Points)
This layer provides a baseline score based on concrete data points.

Role Relevance (+20):

+20 points for decision-maker titles (e.g., "Head", "VP", "Director", "Founder", "C-Level").

+10 points for influencer titles (e.g., "Manager", "Senior").

0 points otherwise.

Industry Match (+20):

+20 points for an exact match with the Ideal Customer Profile (ICP) industry.

+10 points for an adjacent or related industry.

0 points otherwise.

Data Completeness (+10):

+10 points if all fields (name, role, company, etc.) for the lead are present and not empty.

AI Layer (Max 50 Points)
This layer analyzes the unstructured linkedin_bio in the context of the offer to classify buying intent.

AI Prompt: The core prompt sent to the AI is structured as follows:

"Given this product offer: {offer_details}. And this lead: {lead_details}. Classify the lead's buying intent as High, Medium, or Low. Then, provide a one-sentence explanation for your classification."

Point Mapping: The AI's classification is mapped to a score:

High = 50 points

Medium = 30 points

Low = 10 points

The explanation provided by the AI is returned as the reasoning in the final result.
