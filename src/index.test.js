const proxyquire = require('proxyquire');
const test = require('tape');
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');

const patchResponse = { body: { metadata: { status: 'ok' } } };
const KubeClientStub = class {};
KubeClientStub.prototype.patch = sinon.stub().returns(patchResponse);

const responsesStub = {
  onSuccess: sinon.stub().resolves('Hello Judy'),
  onFailure: sinon.stub(),
};

const describeCluster = sinon.stub().resolves({
  cluster: {
    name: 'savvy',
    arn: 'arn:aws:eks:eu-west-1:413918596456:cluster/savvy',
    createdAt: '2019-02-27T12:40:59.533Z',
    version: '1.11',
    endpoint: 'https://821EF3D4CABA886A262CCBE8524F394A.sk1.eu-west-1.eks.amazonaws.com',
    roleArn: 'arn:aws:iam::413918596456:role/cluster-assume-role',
    resourcesVpcConfig: {
      subnetIds: [Array],
      securityGroupIds: [Array],
      vpcId: 'vpc-01fceaf0f769d789f',
      endpointPublicAccess: true,
      endpointPrivateAccess: false,
    },
    status: 'ACTIVE',
    certificateAuthority: {
      data: '',
    },
    clientRequestToken: null,
    platformVersion: 'eks.2',
  },
});

const { handler } = proxyquire('./index', {
  './lib/kube-client': KubeClientStub,
  './lib/responses': responsesStub,
  './lib/describe-cluster': describeCluster,
});

test.only(__filename, async (t) => {
  t.plan(1);

  const event = {
    'CodePipeline.job': {
      id: '14e28e9f-4cdc-4b54-a0c4-cafbc5c830fd',
      accountId: '906602599955',
      data: {
        actionConfiguration: {
          configuration: {
            UserParameters: JSON.stringify({
              awsProfile: 'savvy-prod',
              namespace: 'savvy-staging',
              deployment: 'savvy-api-staging',
              container: 'savvy-api-staging',
              executionRole: 'arn:aws:iam::413918596456:role/lambda-execution-role',
            }),
          },
        },
        inputArtifacts: [{
          revision: '9386d971def3b3adcf52515e832ad0b219d7fcb1',
        }],
      },
    },
  };

  const context = {
    succeed: sinon.stub(),
    fail: sinon.stub(),
    memoryLimitInMB: '128',
    functionVersion: '$LATEST',
    invokeid: 'd5481161-8b28-4f1b-9cd7-f529eb01be9c',
    awsRequestId: 'd5481161-8b28-4f1b-9cd7-f529eb01be9c',
    invokedFunctionArn: 'arn:aws:lambda:eu-west-1:906602599955:function:lambda-cluster-deploy',
  };

  await handler(event, context);

  t.equal(context.succeed.callCount, 1);

  AWS.restore();
});
