import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
interface EvoMotorsS3StackProps extends cdk.StackProps {}

export class EvoMotorsS3Stack extends cdk.Stack {
  public readonly sportDriveTemplates: s3.Bucket;
  public readonly sportDriveTemplatesAccessPoint: s3.CfnAccessPoint;

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

    // Crear el Access Point para el bucket S3
    this.sportDriveTemplatesAccessPoint = new s3.CfnAccessPoint(
      this,
      "SportDriveTemplatesAccessPoint",
      {
        bucket: this.sportDriveTemplates.bucketName,
        name: "sport-drive-templates-access-point",
        policy: {
          version: "2012-10-17",
          statement: [
            {
              effect: "Allow",
              principal: "*",
              action: "s3:GetObject",
              resource: `arn:aws:s3:us-east-1:${this.account}:accesspoint/sport-drive-templates-access-point/object/*`,
            },
          ],
        },
      },
    );
  }
}
