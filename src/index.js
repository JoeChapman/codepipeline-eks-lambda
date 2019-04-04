const AWS = require('aws-sdk');
const KubeClient = require('./lib/kube-client');
const getKubeConfig = require('./lib/kube-config');
const responses = require('./lib/responses');
const config = require('./config');

exports.handler = (event, context) => {
  process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;

  const jobId = event['CodePipeline.job'].id;

  const eks = new AWS.EKS({
    apiVersion: config.apiVersion,
    region: config.awsRegion,
  });

  eks.describeCluster(config.params, async (err, data) => {
    if (err) {
      console.error(err, err.stack);
    } else {
      try {
        const kubeConfig = getKubeConfig(data, config);
        const client = new KubeClient(kubeConfig);
        const patch = await client.patch(config);
        const message = patch.body.metadata.status;
        responses.onSuccess(jobId, context, message);
      } catch (error) {
        console.error(error, error.stack);
        responses.onFailure(jobId, context, error);
      }
    }
  });
};
