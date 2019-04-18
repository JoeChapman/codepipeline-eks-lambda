const AWS = require('aws-sdk');

module.exports = ({ apiVersion, region, name }) => {
  const eks = new AWS.EKS({ apiVersion, region });
  return new Promise((resolve, reject) => {
    eks.describeCluster({ name }, (err, cluster) => {
      if (err) {
        console.error(err, err.stack);
        return reject(err);
      }
      return resolve(cluster);
    });
  });
};
