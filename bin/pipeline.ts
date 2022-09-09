#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack.js';

const fetchEnv = (varName: string): string => {
  if (!process.env[varName]) {
    throw new Error(`${varName} environment variable is not set`);
  }

  return process.env[varName]!;
}

const app = new cdk.App();

new PipelineStack(app, 'CdkDemoBotStack', {
  stackName: `${fetchEnv('DIL_CDK_SCOPE')}-cdk-demo-bot-pipeline`,
  scope: fetchEnv('DIL_CDK_SCOPE'),
  stagingAccout: fetchEnv('ACCOUNT_ID'),
  stagingRegion: fetchEnv('REGION'),
  productionAccount: fetchEnv('ACCOUNT_ID'),
  productionRegion: fetchEnv('REGION'),
  env: {
    account: fetchEnv('CDK_DEFAULT_ACCOUNT'),
    region: fetchEnv('CDK_DEFAULT_REGION')
  }
});
