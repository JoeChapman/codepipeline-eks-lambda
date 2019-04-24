output "lambda_execution_role_arn" {
  value = "${data.terraform_remote_state.ci.lambda_execution_role_arn}"
}
