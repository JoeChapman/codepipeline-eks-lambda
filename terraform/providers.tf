provider "aws" {
  region = "eu-west-1"
}

data "terraform_remote_state" "ci" {
  backend = "s3"

  config {
    bucket = "savvy-nonprod-cloud-provisioning"
    key    = "terraform/nonprod/ci"
    region = "${var.aws_region}"
  }
}
