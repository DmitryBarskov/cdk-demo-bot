import { Stack, StackProps, Stage } from "aws-cdk-lib";
import { CodePipeline, ManualApprovalStep } from "aws-cdk-lib/pipelines";
import type { Construct } from "constructs";
import { CdkDemoBotStack } from "./cdk-demo-bot-stack";
import { CodeBuildStepWithPrimaryOutput } from "./CodeBuildStepWithPrimaryOutput";
import { CodePipelineSourceWithPrimaryOutput } from "./CodePipelineSourceWithPrimaryOutput";

interface PipelineStackProps extends StackProps {
  scope: string;
  stagingAccout: string,
  productionAccount: string,
  stagingRegion: string,
  productionRegion: string,
  env: {
    account: string,
    region: string
  }
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    let pipeline = new CodePipeline(this, "CdkDemoBotPipeline", {
      synth: new CodeBuildStepWithPrimaryOutput("SynthStep", {
        input: CodePipelineSourceWithPrimaryOutput.connection(
          "DmitryBarskov/cdk-demo-bot",
          "main",
          {
            connectionArn: `arn:aws:codestar-connections:us-west-2:676641176260:connection/88ab8d6e-491a-40a8-9145-4729a3fc0dde`,
            triggerOnPush: true
          }
        ),
        commands: [
          'npm install',
          `DIL_CDK_SCOPE=${props.scope ?? ''} npm run -- cdk synth -a "npx ts-node --esm bin/pipeline.ts"`
        ]
      })
    });

    pipeline.addStage(new CdkDemoBotDeployStage(this, "Staging", {
      scope: props.scope,
      env: {
        account: props.stagingAccout,
        region: props.stagingRegion
      }
    }));

    pipeline.addStage(new CdkDemoBotDeployStage(this, "Production", {
      scope: props.scope,
      env: {
        account: props.productionAccount,
        region: props.productionRegion
      },
    }), {
      pre: [
        new ManualApprovalStep("Go to Production")
      ]
    });
  }
}

interface CdkDemoBotDeployStageProps extends StackProps {
  scope: string;
}

class CdkDemoBotDeployStage extends Stage {
  constructor(scope: Construct, id: string, props: CdkDemoBotDeployStageProps) {
    super(scope, id, props);

    new CdkDemoBotStack(this, "CdkDemoBotStack", {
      stackName: `${props.scope ? `${props.scope}-` : ''}cdk-demo-bot-${id}`,
      scope: props.scope
    });
  }
}
