const express = require('express');
const router = express.Router();
const { getStates, getStateById } = require('../controllers/stateController');

router.get('/', getStates);
router.get('/:id', getStateById);

module.exports = router;
