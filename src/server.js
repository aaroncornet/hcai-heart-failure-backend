const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const chalk = require('chalk');

// Importing config
const { port } = require('./config/config');
const ApiError = require('./model/ApiError');

// Importing routes
const prediction_routes = require('./route/prediction.routes');

// bodyParser parses the body from a request
let app = express();
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));

// parse application/vnd.api+json as json
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.use('/api/prediction',prediction_routes);

// Postprocessing; catch all non-existing endpoint requests
app.use('*', function (req, res, next) {
    const error = new ApiError('Non-existing endpoint', 404);
    next(error);
});

// Catch-all error handlers
app.use((err, req, res, next) => {
    //console.error(err);
    res.status((err.code || 404)).json(err).end();
});

// Start application listening on provided port
app.listen(port, () => console.log(chalk.green('[SERVER] Server running on port ' + port)));

// Testcases need our app - export it.
module.exports = app;