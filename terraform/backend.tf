terraform {
  backend "s3" {
    bucket         = "cloud-provisioning"
    dynamodb_table = "cloud-provisioning"
    key            = "terraform/codepipeline-eks-lambda"
    region         = "eu-west-1"
  }
}
