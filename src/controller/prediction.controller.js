const ApiError = require('../model/ApiError');
const assert = require('assert');
const {spawn} = require('child_process');

module.exports = {
    predictHeartFailure(request, response, next) {
        setTimeout(() => {
            try {
                assert(typeof (request.body) === 'object', 'Request body must be of type object');

                const python = spawn('python', ['predict.py',
                    request.body.age,
                    request.body.anaemia,
                    request.body.creatininephosphokinase,
                    request.body.diabetes,
                    request.body.ejectionfraction,
                    request.body.highbloodpressure,
                    request.body.platelets,
                    request.body.serumcreatinine,
                    request.body.serumsodium,
                    request.body.sex,
                    request.body.smoking]);
                let dataToSend;


                // collect data from script
                python.stdout.on('data', function (data) {
                    console.log('Pipe data from python script ...');
                    dataToSend = data.toString();
                });
                // in close event we are sure that stream from child process is closed
                python.on('close', (code) => {
                    console.log(`child process close all stdio with code ${code}`);
                    // send data to browser
                    response.send(dataToSend)
                });
            } catch (error) {
                next(new ApiError(error.message, 412));
            }
        }, 3000);
    }
}
