const AWS = require('aws-sdk').CodePipeline();
const codePipeline = new AWS.CodePipeline();

const putJobSuccess = (jobId, context, message) => {
  codePipeline.putJobSuccessResult({ jobId }, (err, data) => {
    if (err) {
      console.log('putJobSuccess Error', err);
      return context.fail(err);
    }
    context.succeed(message);
  });
};

const putJobFailure = (jobId, message) => {
  codePipeline.putJobFailureResult({
    jobId,
    failureDetails: {
      message: JSON.stringify(message),
      type: 'JobFailed',
      externalExecutionId: context.invokeid
    }
  }, (err, data) => {
    if (err) {
      console.log('putJobFailure Error', err);
      return context.fail(err);
    }
    context.fail(message);
  });
};

module.exports.onSuccess = putJobSuccess;
module.exports.onFailure = putJobFailure;
