import { CodePipelineSource, ConnectionSourceOptions, FileSet } from "aws-cdk-lib/pipelines";

export abstract class CodePipelineSourceWithPrimaryOutput extends CodePipelineSource {
  static override connection(repoString: string, branch: string, props: ConnectionSourceOptions): CodePipelineSourceWithPrimaryOutput {
    return CodePipelineSource.connection(repoString, branch, props) as CodePipelineSourceWithPrimaryOutput;
  }

  override get primaryOutput(): FileSet {
    return super.primaryOutput!;
  }
}
