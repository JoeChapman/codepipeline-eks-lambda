module.exports = {
  imageUrl: process.env.IMAGE_URL || '906602599955.dkr.ecr.eu-west-1.amazonaws.com/savvy-api',
  imageTag: process.env.IMAGE_TAG || 'latest',
  namespace: process.env.NAMESPACE || 'savvy-dev',
  deployment: process.env.DEPLOYMENT || 'savvy-api-dev',
  container: process.env.CONTAINER || 'savvy-api-dev',
  awsProfile: process.env.AWS_PROFILE || 'savvy-nonprod',
  awsRegion: process.env.AWS_REGION || 'eu-west-1',
  executionRole: process.env.EXECUTION_ROLE || 'arn:aws:iam::906602599955:role/lambda-execution-role',
  sessionToken: process.env.AWS_SESSION_TOKEN || 'savvy',
  apiVersion: process.env.API_VERSION || '2017-11-01',
  params: { name: process.env.CLUSTER_NAME || 'savvy' }
};
