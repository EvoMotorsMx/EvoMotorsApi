import * as cdk from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineStage } from "./pipeline_stage-stack";
import { ConfigProps } from "../../config/envConfig";

interface IEvoMotorsCiCdStackProps extends cdk.StackProps {
  config: Readonly<ConfigProps>;
}

export class EvoMotorsCiCdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IEvoMotorsCiCdStackProps) {
    super(scope, id, props);
    const pipeline = new CodePipeline(this, "EvoMotorsPipelineId", {
      pipelineName: "EvoMotorsPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("EvoMotorsMx/EvoMotorsApi", "master"),
        commands: [
          "npm install -g aws-cdk@latest", // 🔹 Instala la última versión de CDK
          "npm ci",
          "npx cdk synth",
        ],
        primaryOutputDirectory: "cdk.out",
      }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const prodStage = pipeline.addStage(
      new PipelineStage(this, "PipelineProdStage", {
        stageName: "production",
        config: props.config,
      }),
    );
  }
}
