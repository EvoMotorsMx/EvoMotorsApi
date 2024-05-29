import * as cdk from "aws-cdk-lib";
import { CorsHttpMethod, HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpUserPoolAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";

interface EvoMotorsApiStackProps extends cdk.StackProps {
  stageName: string;
  userPool: UserPool;
  userPoolClient: UserPoolClient;
  brandLambdaIntegration: HttpLambdaIntegration;
  carModelLambdaIntegration: HttpLambdaIntegration;
  productLambdaIntegration: HttpLambdaIntegration;
  witnessLambdaIntegration: HttpLambdaIntegration;
}

export class EvoMotorsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EvoMotorsApiStackProps) {
    super(scope, id, props);

    const evoMotorsAdminHttpApi = new HttpApi(this, "EvoMotorsApi", {
      apiName: "EvoMotorsHttpApi",
      corsPreflight: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "IdToken",
        ],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
    });

    const authorizer = new HttpUserPoolAuthorizer(
      "evo-motors-userpool-authorizer",
      props.userPool,
      {
        userPoolClients: [props.userPoolClient],
        identitySource: ["$request.header.Authorization"],
      },
    );

    //Brand routes
    evoMotorsAdminHttpApi.addRoutes({
      path: "/brand",
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: props.brandLambdaIntegration,
      authorizer,
    });

    evoMotorsAdminHttpApi.addRoutes({
      path: "/brand/{brandId}",
      methods: [HttpMethod.GET, HttpMethod.PUT, HttpMethod.DELETE],
      integration: props.brandLambdaIntegration,
      authorizer,
    });

    //CarModel routes
    evoMotorsAdminHttpApi.addRoutes({
      path: "/carModel",
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: props.carModelLambdaIntegration,
      authorizer,
    });

    evoMotorsAdminHttpApi.addRoutes({
      path: "/carModel/{carModelId}",
      methods: [HttpMethod.GET, HttpMethod.PATCH, HttpMethod.DELETE],
      integration: props.carModelLambdaIntegration,
      authorizer,
    });

    //Product routes
    evoMotorsAdminHttpApi.addRoutes({
      path: "/product",
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: props.productLambdaIntegration,
      authorizer,
    });

    evoMotorsAdminHttpApi.addRoutes({
      path: "/product/{productId}",
      methods: [HttpMethod.GET, HttpMethod.PATCH, HttpMethod.DELETE],
      integration: props.productLambdaIntegration,
      authorizer,
    });

    //Witness routes
    evoMotorsAdminHttpApi.addRoutes({
      path: "/witness",
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: props.productLambdaIntegration,
      authorizer,
    });

    evoMotorsAdminHttpApi.addRoutes({
      path: "/witness/{witnessId}",
      methods: [HttpMethod.GET, HttpMethod.PATCH, HttpMethod.DELETE],
      integration: props.productLambdaIntegration,
      authorizer,
    });
  }
}
