terraform {
  backend "s3" {
    bucket         = "savvy-prod-cloud-provisioning"
    dynamodb_table = "savvy-prod-cloud-provisioning"
    key            = "terraform/prod/lambda-cluster-deploy"
    region         = "eu-west-1"
  }
}
