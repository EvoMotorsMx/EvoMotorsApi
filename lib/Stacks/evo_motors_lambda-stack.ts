import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import * as iam from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends StackProps {
  lambdaDirectory: string;
  envVariables: { [key: string]: string };
}

export class LambdaStack extends Stack {
  public readonly lambdaIntegration: HttpLambdaIntegration;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

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
      environment: props.envVariables,
      timeout: Duration.seconds(10),
      bundling: {
        externalModules: [
          "@aws-sdk/credential-provider-node",
          "@aws-sdk/credential-provider-ini",
          "@aws-sdk/credential-providers",
          "@aws-sdk/nested-clients/sts",
          "@aws-sdk/nested-clients/sso-oidc",
          "@smithy/core",
          "aws-sdk", // si lo tienes instalado, inclúyelo para excluirlo también
        ],
      },
    });


    // Agregar permisos para cognito-idp:ListUsers
    lambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["cognito-idp:ListUsers"],
        resources: [
          `arn:aws:cognito-idp:${this.region}:${this.account}:userpool/${process.env.AWS_COGNITO_ID}`,
        ],
      }),
    );

    // Agregar permisos para s3:GetObject
    lambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [
          `${process.env.BUCKET_NAME}/object/*`,
          `${process.env.BUCKET_ARN}/object/*`, // Agregar esta línea
        ],
      }),
    );

    this.lambdaIntegration = new HttpLambdaIntegration(
      "httpLambdaIntegration",
      lambda,
    );
  }
}
