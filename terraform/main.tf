resource "aws_lambda_function" "lambda_cluster_deploy_function" {
  s3_bucket        = "lambda"
  s3_key           = "codepipeline-eks-lambda-${var.app_version}.zip"
  source_code_hash = "${base64sha256(file("../../codepipeline-eks-lambda-${var.app_version}.zip"))}"
  function_name    = "codepipeline-eks-lambda"
  role             = "${data.terraform_remote_state.ci.lambda_execution_role_arn}"
  handler          = "index.handler"
  runtime          = "nodejs8.10"
  timeout          = "20"
  memory_size      = "512"

  depends_on = [
    "aws_s3_bucket_object.lambda_cluster_deploy_function",
  ]
}

resource "aws_s3_bucket_object" "lambda_cluster_deploy_function" {
  bucket = "lambda"
  key    = "codepipeline-eks-lambda-${var.app_version}.zip"
  source = "../../codepipeline-eks-lambda-${var.app_version}.zip"
  etag   = "${md5(file("../../codepipeline-eks-lambda-${var.app_version}.zip"))}"
}
