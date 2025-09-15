const csv = require('csv-parser');
const fs = require('fs');
const ScoringService = require('./services/scoringService');

let offer = null;
let leads = [];
let scoredResults = [];

exports.setOffer = (req, res) => {
    offer = req.body;
    res.status(200).send({ message: 'Offer details saved.' });
};

exports.uploadLeads = (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'Please upload a CSV file.' });
    }

    leads = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => leads.push(data))
        .on('end', () => {
            fs.unlinkSync(req.file.path); // Clean up the uploaded file
            res.status(200).send({ message: `${leads.length} leads uploaded.` });
        });
};

exports.scoreLeads = async (req, res) => {
    if (!offer || leads.length === 0) {
        return res.status(400).send({ message: 'Please upload an offer and leads first.' });
    }

    scoredResults = await ScoringService.scoreAllLeads(leads, offer);
    res.status(200).send({ message: 'Scoring complete. Use /results to view.' });
};

exports.getResults = (req, res) => {
    res.status(200).json(scoredResults);
};