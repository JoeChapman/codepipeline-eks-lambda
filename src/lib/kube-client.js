const { Client } = require('kubernetes-client');
const K8sConfig = require('kubernetes-client').config;

class KubeClient {
  constructor(kubeConfig) {
    this.client = new Client({
      config: K8sConfig.fromKubeconfig(kubeConfig),
      version: '1.9',
    });
  }

  async patch({
    namespace, deployment, container, imageUrl, imageTag,
  }) {
    return this.client.apis.apps.v1
      .ns(namespace)
      .deploy(deployment)
      .patch({
        body: {
          spec: {
            template: {
              spec: {
                containers: [{
                  name: container,
                  image: `${imageUrl}:${imageTag}`,
                }],
              },
            },
          },
        },
      });
  }
}

module.exports = KubeClient;
