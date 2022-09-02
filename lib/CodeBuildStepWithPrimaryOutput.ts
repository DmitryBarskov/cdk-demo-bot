import { CodeBuildStep, FileSet } from "aws-cdk-lib/pipelines";

export class CodeBuildStepWithPrimaryOutput extends CodeBuildStep {
  override get primaryOutput(): FileSet {
    return super.primaryOutput!;
  }
}
