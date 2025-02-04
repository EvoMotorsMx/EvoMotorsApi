import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";

interface EvoMotorsS3StackProps extends cdk.StackProps {}

export class EvoMotorsS3Stack extends cdk.Stack {
  public readonly sportDriveTemplates: s3.Bucket;

  constructor(scope: Construct, id: string, props?: EvoMotorsS3StackProps) {
    super(scope, id, props);

    // Crear el bucket S3
    this.sportDriveTemplates = new s3.Bucket(
      this,
      "SportDriveTemplatesBucket",
      {
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.RETAIN, // Retener el bucket cuando se elimine el stack
      },
    );
  }
}
