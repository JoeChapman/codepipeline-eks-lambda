provider "aws" {
  region = "eu-west-1"
}

data "terraform_remote_state" "ci" {
  backend = "s3"

  config {
    bucket = "savvy-prod-cloud-provisioning"
    key    = "terraform/prod/ci"
    region = "${var.aws_region}"
  }
}
