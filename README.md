# lambda-cluster-deploy
> Node.js Lambda to deploy updates to the EKS cluster

Triggered from a the Invoke CodeBuild phase with the hash of the Git commit that triggered CodePipeline

## Usage

 * Clone this repository
 * `npm install`
 * `npm run pack`

This should create a `.zip` folder at the route of the project with can be uploaded via the AWS Lambda interface.

### `npm run pack`

Generate a .zip package file to upload to to AWS Lambda with Terraform.

`cd src && zip -r - . -x '*.test.js' -x 'package*' > ../$npm_package_name-$npm_package_version.zip`

There are a couple of things going on in this script so to break it down a bit

 - `cd src`: navigate into the `/src` directory from project root.
 - `zip -r - .`: zip recursively (`-r`) files from current location (`.`) to stdout (`-`);
 - `-x '*.test.js'`: excluding `.test.js` files. This is a glob pattern so is wrapped in quotes.
 - `-x 'package*'` : excluding package & package-lock files
 - `> ../$npm_package_name-$npm_package_version.zip` redirect from stdout into the parent folder using package name and package version in the file name.

 Redirecting via stdout means that the .zip is fully re-written each time and files that have been deleted from the project will not remain in the zip file.

