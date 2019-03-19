resource "aws_lambda_function" "lambda_cluster_deploy_function" {
  s3_bucket        = "${var.cluster-name}-${var.environment}-lambda"
  s3_key           = "lambda-cluster-deploy-${var.app_version}.zip"
  source_code_hash = "${base64sha256(file("../lambda-cluster-deploy-${var.app_version}.zip"))}"
  function_name    = "lambda-cluster-deploy"
  role             = "${data.terraform_remote_state.codepipeline.lambda_execution_role_arn}"
  handler          = "index.handler"
  runtime          = "nodejs8.10"
  publish          = true
}
