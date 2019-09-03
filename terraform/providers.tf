provider "aws" {
  region  = "eu-west-1"
  version = "2.16"
}

data "terraform_remote_state" "ci" {
  backend = "s3"

  config {
    bucket = "cloud-provisioning"
    key    = "terraform/nonprod/ci"
    region = "${var.aws_region}"
  }
}
