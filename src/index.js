const KubeClient = require('./lib/kube-client');
const getKubeConfig = require('./lib/kube-config');
const pipelineResponses = require('./lib/pipeline-responses');
const describeCluster = require('./lib/describe-cluster');
const prepareDeployment = require('./lib/prepare-deployment');
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
        location: {
          s3Location: {
            bucketName,
            objectKey,
          },
        },
      }],
    },
  } = event['CodePipeline.job'];

  try {
    // UserParameters are always JSON-encoded
    const userParams = UserParameters && JSON.parse(UserParameters);
    const options = { ...config, ...userParams };
    options.imageTag = revision.substring(0, 7);

    if (!options.envName) {
      switch (options.namespace) {
        case 'savvy-dev':
          options.envName = 'env-dev';
          break;
        case 'savvy-staging':
          options.envName = 'env-staging';
          break;
        case 'savvy-live':
          options.envName = 'env-live';
          break;
        default:
          break;
      }
    }

    if (options.buildEnv) {
      options.imageTag += `-${options.buildEnv}`;
    }

    // Download the source code and inject the env vars
    const prepared = await prepareDeployment(bucketName, objectKey, options);

    // Log in to EKS cluster
    const cluster = await describeCluster(options);
    const kubeClient = new KubeClient(getKubeConfig(cluster, options));

    // convert yaml to json and apply to Cluster
    const deployed = await kubeClient.apply(prepared, options);

    // eslint-disable-next-line no-console
    console.log('Deployed -------->', deployed);

    // tell codepipeline it was succcessful
    await pipelineResponses.onSuccess(id);
    // tell the lambda it's done
    context.succeed('done');
  } catch (error) {
    try {
      // There is a bug when updating a Service,
      // which returns a 422. Ignore error and continue
      if (error.code && error.code === 422) {
        await pipelineResponses.onSuccess(id);
        context.succeed('done');
      } else {
        console.error(error, error.stack);
        await pipelineResponses.onFailure(id, context, error);
        context.fail(error);
      }
    } catch (err) {
      console.error(err, err.stack);
    }
  }
};
