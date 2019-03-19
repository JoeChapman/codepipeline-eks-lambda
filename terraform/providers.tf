provider "aws" {
  region = "eu-west-1"
}

data "terraform_remote_state" "codepipeline" {
  backend = "s3"

  config {
    bucket = "savvy-nonprod-cloud-provisioning"
    key    = "terraform/nonprod/codepipeline"
    region = "${var.aws_region}"
  }
}
