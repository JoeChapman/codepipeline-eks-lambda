module.exports = (data, options) => ({
  apiVersion: 'v1',
  clusters: [
    {
      'cluster': {
        'certificate-authority-data': data.cluster.certificateAuthority.data,
        'server': data.cluster.endpoint
      },
      'name': data.cluster.arn
    }
  ],
  contexts: [
    {
      'context': {
        'cluster': data.cluster.arn,
        'user': data.cluster.arn
      },
      'name': data.cluster.arn
    }
  ],
  'current-context': data.cluster.arn,
  kind: 'Config',
  users: [
     {
        'name': data.cluster.arn,
        'user': {
           'exec': {
              'apiVersion': 'client.authentication.k8s.io/v1alpha1',
              'args': [
                 'token',
                 '-i',
                 'savvy',
                 '-r',
                 options.executionRole
              ],
              'token-key': 'status.token',
              'command': 'aws-iam-authenticator',
              'env': [
                 {
                    'name': 'AWS_PROFILE',
                    'value': options.awsProfile
                 }
              ]
           }
        }
     }
  ]
});
