/* eslint-disable-next-line max-len */
module.exports = ({ cluster: { certificateAuthority, endpoint, arn } }, { executionRole, awsProfile }) => ({
  apiVersion: 'v1',
  clusters: [
    {
      cluster: {
        'certificate-authority-data': certificateAuthority.data,
        server: endpoint,
      },
      name: arn,
    },
  ],
  contexts: [
    {
      context: {
        cluster: arn,
        user: arn,
      },
      name: arn,
    },
  ],
  'current-context': arn,
  kind: 'Config',
  users: [
    {
      name: arn,
      user: {
        exec: {
          apiVersion: 'client.authentication.k8s.io/v1alpha1',
          args: [
            'token',
            '-i',
            'savvy',
            '-r',
            executionRole,
          ],
          'token-key': 'status.token',
          command: 'aws-iam-authenticator',
          env: [
            {
              name: 'AWS_PROFILE',
              value: awsProfile,
            },
          ],
        },
      },
    },
  ],
});
