const AWS = require('aws-sdk');

const { putJobSuccessResult, putJobFailureResult } = new AWS.CodePipeline();

const putJobSuccess = (jobId, ctx, message) => putJobSuccessResult({ jobId }, (err) => {
  if (err) {
    console.error('putJobSuccess Error', err);
    return ctx.fail(err);
  }
  return ctx.succeed(message);
});

const putJobFailure = (jobId, ctx, message) => putJobFailureResult({
  jobId,
  failureDetails: {
    message: JSON.stringify(message),
    type: 'JobFailed',
    externalExecutionId: ctx.invokeid,
  },
}, (err) => {
  if (err) {
    console.error('putJobFailure Error', err);
    return ctx.fail(err);
  }
  return ctx.fail(message);
});

module.exports.onSuccess = putJobSuccess;
module.exports.onFailure = putJobFailure;
