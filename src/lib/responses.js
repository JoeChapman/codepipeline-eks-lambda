const AWS = require('aws-sdk');

const codePipeline = new AWS.CodePipeline();

const putJobSuccess = (jobId, ctx, msg) => codePipeline.putJobSuccessResult({ jobId }, (err) => {
  if (err) {
    console.error('putJobSuccess Error', err);
    return ctx.fail(err);
  }
  return ctx.succeed(msg);
});

const putJobFailure = (jobId, ctx, msg) => codePipeline.putJobFailureResult({
  jobId,
  failureDetails: {
    msg: JSON.stringify(msg),
    type: 'JobFailed',
    externalExecutionId: ctx.invokeid,
  },
}, (err) => {
  if (err) {
    console.error('putJobFailure Error', err);
    return ctx.fail(err);
  }
  return ctx.fail(msg);
});

module.exports.onSuccess = putJobSuccess;
module.exports.onFailure = putJobFailure;
