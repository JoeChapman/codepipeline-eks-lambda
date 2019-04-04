const AWS = require('aws-sdk').CodePipeline();

const codePipeline = new AWS.CodePipeline();

const putJobSuccess = (id, ctx, msg) => codePipeline.putJobSuccessResult({ id }, (err) => {
  if (err) {
    console.error('putJobSuccess Error', err);
    return ctx.fail(err);
  }
  return ctx.succeed(msg);
});

const putJobFailure = (id, ctx, msg) => codePipeline.putJobFailureResult({
  id,
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
