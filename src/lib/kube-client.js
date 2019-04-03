const Client = require('kubernetes-client').Client;
const K8sConfig = require('kubernetes-client').config;

class KubeClient {
  constructor(kubeConfig) {
    this.client = new Client({
      config: K8sConfig.fromKubeconfig(kubeConfig),
      version: '1.9'
    });
  }

  async patch(options) {
    return await this.client.apis.apps.v1
      .ns(options.namespace)
      .deploy(options.deployment)
      .patch({
        body: {
          spec: {
            template: {
              spec: {
                containers: [{
                  name: options.container,
                  image: `${options.imageUrl}:${options.imageTag}`
                }]
              }
            }
          }
        }
      });
  }
}

module.exports = KubeClient;
