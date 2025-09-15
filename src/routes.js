const express = require('express');
const router = express.Router();
const multer = require('multer');
const scoreController = require('./scoreControllers');

const upload = multer({ dest: 'uploads/' });

router.post('/offer', scoreController.setOffer);
router.post('/leads/upload', upload.single('leads'), scoreController.uploadLeads);
router.post('/score', scoreController.scoreLeads);
router.get('/results', scoreController.getResults);

module.exports = router;