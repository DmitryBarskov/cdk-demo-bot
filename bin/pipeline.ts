#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack.js';

const ensureEnv = (varName: string): void => {
  if (!process.env[varName]) {
    throw new Error(`${varName} environment variable is not set`);
  }
};

ensureEnv('DIL_CDK_SCOPE');
ensureEnv('CDK_DEFAULT_ACCOUNT');
ensureEnv('CDK_DEFAULT_REGION');

const app = new cdk.App();
new PipelineStack(app, 'CdkDemoBotStack', {
  stackName: `${process.env['DIL_CDK_SCOPE']}-cdk-demo-bot-pipeline`,
  scope: process.env['DIL_CDK_SCOPE']!,
  stagingAccout: '676641176260',
  stagingRegion: 'us-west-2',
  productionAccount: '676641176260',
  productionRegion: 'us-west-2',
  env: {
    account: process.env['CDK_DEFAULT_ACCOUNT']!,
    region: process.env['CDK_DEFAULT_REGION']!
  }
});
