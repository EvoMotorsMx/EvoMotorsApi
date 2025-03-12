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

    // Create the S3 bucket
    this.sportDriveTemplates = new s3.Bucket(
      this,
      "SportDriveTemplatesBucket",
      {
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.RETAIN, // Retain the bucket when the stack is deleted
      },
    );

    // Create the Access Point for the S3 bucket
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
              Principal: { AWS: `arn:aws:iam::${this.account}:root` }, // Restrict to this account only or specify roles
              Action: "s3:GetObject",
              Resource: `arn:aws:s3:${this.region}:${this.account}:accesspoint/sport-drive-templates-access-point/object/*`,
            },
          ],
        },
      },
    );

    // Define IAM Role with necessary permissions
    const accessPointRole = new iam.Role(this, "AccessPointRole", {
      assumedBy: new iam.ServicePrincipal("s3.amazonaws.com"),
    });

    accessPointRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        resources: [
          this.sportDriveTemplates.bucketArn + "/*", // Specific to this bucket's objects
        ],
        effect: iam.Effect.ALLOW,
      }),
    );

    // Attach the role to the access point
    this.sportDriveTemplatesAccessPoint.node.addDependency(accessPointRole);
  }
}
