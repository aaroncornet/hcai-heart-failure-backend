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

app.use(function (req, res, next) {
    let allowedOrigins = ['http://localhost:4200','https://hcai-heart-failure-frontend.herokuapp.com'];
    let currentOrigin = req.headers.origin;
    if(allowedOrigins.indexOf(currentOrigin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', currentOrigin);
    }

    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200 *');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, x-access-token ,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if(req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next();
    }
});

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
