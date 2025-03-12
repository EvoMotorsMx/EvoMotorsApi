import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";

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
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: "*",
              Action: "s3:GetObject",
              Resource: `arn:aws:s3:us-east-1:${this.account}:accesspoint/sport-drive-templates-access-point/object/*`,
            },
          ],
        },
      },
    );

    // Define IAM Role with necessary permissions
    const accessPointRole = new iam.Role(this, "AccessPointRole", {
      assumedBy: new iam.ServicePrincipal("s3.amazonaws.com"),
      inlinePolicies: {
        AccessPointPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                "s3:CreateAccessPoint",
                "s3:PutAccessPointPolicy",
                "s3:GetBucket",
                "s3:ListBucket",
              ],
              resources: ["*"],
              effect: iam.Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    // Attach the role to the access point
    this.sportDriveTemplatesAccessPoint.node.addDependency(accessPointRole);
  }
}
