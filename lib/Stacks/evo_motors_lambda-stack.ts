import { Stack, StackProps } from "aws-cdk-lib";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends StackProps {
  lambdaDirectory: string;
  envVariables: { [key: string]: string };
  bucket?: s3.Bucket;
  readPdfLambdaName?: string;
}

export class LambdaStack extends Stack {
  public readonly lambdaIntegration: HttpLambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const environment = {
      ...props.envVariables,
      ...(props.bucket && { BUCKET_NAME: props.bucket.bucketName }),
      ...(props.readPdfLambdaName && {
        READ_PDF_LAMBDA_NAME: props.readPdfLambdaName,
      }),
    };

    const lambda = new NodejsFunction(this, "lambdaIntegration", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "src",
        "infrastructure",
        "web",
        "routes",
        `${props.lambdaDirectory}`,
        "handler.ts",
      ),
      environment,
      bundling: {
        externalModules: ["@aws-sdk/core/client", "@aws-sdk/core"],
        nodeModules: ["@smithy/core"],
      },
    });

    // Otorgar permisos de lectura al bucket S3 si se proporciona
    if (props.bucket) {
      props.bucket.grantRead(lambda);
    }

    // Otorgar permisos para invocar la función Lambda de lectura de PDF
    if (props.readPdfLambdaName) {
      lambda.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ["lambda:InvokeFunction"],
          resources: [
            `arn:aws:lambda:${this.region}:${this.account}:function:${props.readPdfLambdaName}`,
          ],
        }),
      );
    }

    this.lambdaIntegration = new HttpLambdaIntegration(
      "httpLambdaIntegration",
      lambda,
    );
  }
}
