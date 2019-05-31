const { mkdtempSync, readdirSync } = require('fs');
const { tmpdir } = require('os');
const { sep } = require('path');
const unzip = require('unzip-stream');
const AWS = require('aws-sdk');
const envsub = require('envsub');

const s3 = new AWS.S3();

module.exports = async (bucketName, objectKey, {
  imageTag, envName,
}) => new Promise((resolve, reject) => {
  const tmpFolder = mkdtempSync(`${tmpdir()}${sep}`);
  return s3.getObject({
    Bucket: bucketName,
    Key: objectKey,
  })
    .createReadStream()
    .pipe(unzip.Extract({ path: tmpFolder }))
    .on('error', error => reject(error))
    .on('close', (error) => {
      if (error) {
        return reject(error);
      }
      try {
        const options = {
          envs: [
            {
              name: 'IMAGE_TAG',
              value: imageTag,
            },
          ],
          syntax: 'dollar-both',
          system: false,
          envFiles: [
            `${tmpFolder}/deploy/config/${envName}`,
          ],
        };
        const list = readdirSync(`${tmpFolder}/deploy/k8s`);
        return Promise.all(list.map((file) => {
          const templateFile = `${tmpFolder}/deploy/k8s/${file}`;
          const outputFile = `${tmpFolder}/deploy/k8s/out-${file}`;
          return envsub({ templateFile, outputFile, options });
        }))
          .then(envobj => resolve(envobj))
          .catch(err => reject(err));
      } catch (err) {
        return reject(err);
      }
    });
});
