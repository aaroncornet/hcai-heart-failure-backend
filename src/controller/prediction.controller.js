const ApiError = require('../model/ApiError');
const assert = require('assert');
const {spawn} = require('child_process');

module.exports = {
    predictHeartFailure(request, response, next) {
        try {
            assert(typeof(request.body) === 'object', 'Request body must be of type object');

            assert(request.body.age, 'Age is missing from body');
            /*assert(request.body.anaemia, 'Anaemia is missing from body');
            assert(request.body.creatininephosphokinase, 'creatinine_phosphokinase is missing from body');
            assert(request.body.diabetes, 'diabetes is missing from body');
            assert(request.body.ejectionfraction, 'ejection_fraction is missing from body');
            assert(request.body.highbloodpressure, 'high_blood_pressure is missing from body');
            assert(request.body.platelets, 'platelets is missing from body');
            assert(request.body.serumcreatinine, 'serum_creatinine is missing from body');
            assert(request.body.serumsodium, 'serum_sodium is missing from body');
            assert(request.body.sex, 'sex is missing from body');
            assert(request.body.smoking, 'smoking is missing from body');*/

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
    }
}