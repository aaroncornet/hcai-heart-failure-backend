const router = require('express').Router();
const PredictionController = require('../controller/prediction.controller')

router.post('', PredictionController.predictHeartFailure);

module.exports = router;