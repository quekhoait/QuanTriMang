const express = require('express');
const { demo } = require('../controller/FileController');
const router = express.Router();

router.post('/demo',demo);

module.exports = router;