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
        const body = yaml.safeLoad(readFileSync(doc.outputFile), 'utf8');

        switch (body.kind) {
          case 'Deployment':
            try {
              return this.client.apis.extensions.v1beta1.ns(namespace).deployments.post({ body });
            } catch (error) {
              if (error.code !== 409) throw error;
              return this.client.apis.extensions.v1beta1
                .ns(namespace)
                .deployments(body.metadata.name)
                .put({ body });
            }
          case 'Ingress':
            try {
              return this.client.apis.extensions.v1beta1.ns(namespace).ingresses.post({ body });
            } catch (error) {
              if (error.code !== 409) throw error;
              return this.client.apis.extensions.v1beta1
                .ns(namespace)
                .ingresses(body.metadata.name)
                .put({ body });
            }
          case 'Service':
            try {
              return this.client.api.v1.namespaces(namespace).services.post({ body });
            } catch (error) {
              if (error.code !== 409) throw error;
              return this.client.api.v1
                .namespaces(namespace)
                .services(body.metadata.name)
                .put({ body });
            }
          case 'Namespace':
            try {
              return this.client.api.v1.namespaces.post({ body });
            } catch (error) {
              if (error.code !== 409) throw error;
              return this.client.api.v1.namespaces(namespace).put({ body });
            }
          default:
            return body;
        }
      }),
    );
  }
}

module.exports = KubeClient;
