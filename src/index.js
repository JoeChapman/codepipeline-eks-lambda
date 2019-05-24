const KubeClient = require('./lib/kube-client');
const getKubeConfig = require('./lib/kube-config');
const responses = require('./lib/responses');
const describeCluster = require('./lib/describe-cluster');
const config = require('./lib/config');

exports.handler = async (event, context) => {
  process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;

  const {
    id,
    data: {
      actionConfiguration: {
        configuration: {
          UserParameters,
        },
      },
      inputArtifacts: [{
        revision,
      }],
    },
  } = event['CodePipeline.job'];

  try {
    // UserParameters are always JSON-encoded
    const userParams = UserParameters && JSON.parse(UserParameters);
    const options = { ...config, ...userParams };
    options.imageTag = revision.substring(0, 7);

    if (options.buildEnv) {
      options.imageTag += `-${options.buildEnv}`;
    }

    const cluster = await describeCluster(options);
    const client = new KubeClient(getKubeConfig(cluster, options));
    const patch = await client.patch(options);
    await responses.onSuccess(id);
    const { body: { metadata: { status } } } = patch;
    // Tells CodePipeline the operation was successful
    context.succeed(status);
  } catch (error) {
    console.error(error, error.stack);
    try {
      await responses.onFailure(id, context, error);
      context.fail(error);
    } catch (err) {
      console.error(err, err.stack);
    }
  }
};
