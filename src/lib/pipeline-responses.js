const AWS = require('aws-sdk');
const { region } = require('./config');

const pipeline = new AWS.CodePipeline({ region });

module.exports = {
  onSuccess: jobId => new Promise((resolve, reject) => {
    pipeline.putJobSuccessResult({ jobId }, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  }),

  onFailure: (jobId, context, message) => new Promise((resolve, reject) => {
    pipeline.putJobFailureResult({
      jobId,
      failureDetails: {
        message: JSON.stringify(message),
        type: 'JobFailed',
        externalExecutionId: context.invokeid,
      },
    }, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  }),

};
