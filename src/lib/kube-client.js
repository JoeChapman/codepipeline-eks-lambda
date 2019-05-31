const { Client } = require('kubernetes-client');
const K8sConfig = require('kubernetes-client').config;
const yaml = require('js-yaml');
const { readFileSync } = require('fs');

class KubeClient {
  constructor(kubeConfig) {
    this.client = new Client({
      config: K8sConfig.fromKubeconfig(kubeConfig),
      version: '1.12',
    });
  }

  async apply(prepared, { namespace }) {
    return Promise.all(
      prepared.map(async (doc) => {
        const content = yaml.safeLoad(readFileSync(doc.outputFile), 'utf8');

        switch (content.kind) {
          case 'Deployment':
            return this.client.apis.extensions.v1beta1
              .ns(namespace)
              .deployments(content.metadata.name)
              .put({ body: content });
          case 'Ingress':
            return this.client.apis.extensions.v1beta1
              .ns(namespace)
              .ingresses(content.metadata.name)
              .put({ body: content });
          case 'Service':
            return this.client.api.v1
              .namespaces(namespace)
              .services(content.metadata.name)
              .put({ body: content });
          case 'Namespace':
            return this.client.api.v1
              .namespaces(namespace)
              .put({ body: content });
          default:
            return content;
        }
      }),
    );
  }
}

module.exports = KubeClient;
