import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

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
      bundling: {
        externalModules: ["@aws-sdk/core/client", "@aws-sdk/core"],
        nodeModules: ["@smithy/core"],
      },
      timeout: Duration.seconds(10),
    });

    this.lambdaIntegration = new HttpLambdaIntegration(
      "httpLambdaIntegration",
      lambda,
    );
  }
}
