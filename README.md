# CodePipeline EKS Lambda

> AWS Lambda written with Node.js, designed to deploy Kubernetes resources from CodePipeline to an EKS cluster

It is triggered from the `Invoke CodeBuild` phase of the pipeline with the hash of the Git commit that triggered CodePipeline

## Usage

- Update the package.json version number

- Run `npm run pack` to generate a file with the format `codepipeline-eks-lambda-<version number>.zip` in the root of the project

- Log in to AWS cli (I use [awsmfa](https://pypi.org/project/awsmfa/) for 2FA)

- `cd` into `terraform/`

- Update the the version number for deployment in `/variables.tf`

- Then deploy with `terraform`;

  - `terraform plan -out=plan.tf`
  - `terraform apply plan.tf`

