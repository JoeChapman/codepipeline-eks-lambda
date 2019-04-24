terraform {
  backend "s3" {
    bucket         = "savvy-nonprod-cloud-provisioning"
    dynamodb_table = "savvy-nonprod-cloud-provisioning"
    key            = "terraform/nonprod/lambda-cluster-deploy"
    region         = "eu-west-1"
  }
}
