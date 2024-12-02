import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EvoMotorsApiStack } from "./evo_motors_api-stack";
//import { EvoMotorsMongoAtlasStack } from "./evo_motors_mongodb_stack";
import { ConfigProps } from "../../config/envConfig";
import { AdminAuthStack } from "./evo_motors_auth-stack";
import { LambdaStack } from "./evo_motors_lambda-stack";
import * as _ from "lodash";
interface IPipelineStageProps extends StageProps {
  config: Readonly<ConfigProps>;
  stageName: string;
}

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: IPipelineStageProps) {
    super(scope, id, props);

    const envVariables: { [key: string]: string | undefined } = {
      DATABASE_URL: process.env.DATABASE_URL,
      AWS_REGION_COGNITO: process.env.AWS_REGION_COGNITO,
      AWS_POOL_ID: process.env.AWS_POOL_ID,
    };

    const lambdaVariables = _.omitBy(envVariables, _.isUndefined) as {
      [key: string]: string;
    };

    // TODO: Already created, causing issues after stack deletion
    /* new EvoMotorsMongoAtlasStack(this, "EvoMotorsMongoStack", {
      config: props.config,
    }); */

    const evoMotorsAuthStack = new AdminAuthStack(
      this,
      "EvoMotorsAdminAuthStack",
    );

    //Brand lAMBDA
    const brandLambdaIntegration = new LambdaStack(this, "brandLambda", {
      lambdaDirectory: "Brand",
      envVariables: lambdaVariables,
    });

    //CarModel Lambda
    const carModelLambdaIntegration = new LambdaStack(this, "carModelLambda", {
      lambdaDirectory: "CarModel",
      envVariables: lambdaVariables,
    });

    //Product Lambda
    const productLambdaIntegration = new LambdaStack(this, "ProductLambda", {
      lambdaDirectory: "Product",
      envVariables: lambdaVariables,
    });

    //Witness Lambda
    const witnessLambdaIntegration = new LambdaStack(this, "WitnessLambda", {
      lambdaDirectory: "Witness",
      envVariables: lambdaVariables,
    });

    //Remission Lambda
    const remissionLambdaIntegration = new LambdaStack(
      this,
      "RemissionLambda",
      {
        lambdaDirectory: "Remission",
        envVariables: lambdaVariables,
      },
    );

    //Certificate Lambda
    const certificateLambdaIntegration = new LambdaStack(
      this,
      "CertificateLambda",
      {
        lambdaDirectory: "Certificate",
        envVariables: lambdaVariables,
      },
    );

    //Company Lambda
    const companyLambdaIntegration = new LambdaStack(this, "CompanyLambda", {
      lambdaDirectory: "Company",
      envVariables: lambdaVariables,
    });

    //Product Price Lambda
    const productPriceLambdaIntegration = new LambdaStack(
      this,
      "ProductPriceLambda",
      {
        lambdaDirectory: "ProductPrice",
        envVariables: lambdaVariables,
      },
    );

    //Error Code Lambda
    const errorCodeLambdaIntegration = new LambdaStack(
      this,
      "errorCodeLambda",
      {
        lambdaDirectory: "ErrorCode",
        envVariables: lambdaVariables,
      },
    );

    //Car Lambda
    const carLambdaIntegration = new LambdaStack(this, "carLambda", {
      lambdaDirectory: "Car",
      envVariables: lambdaVariables,
    });

    //Tool Lambda
    const toolLambdaIntegration = new LambdaStack(this, "toolLambda", {
      lambdaDirectory: "Tool",
      envVariables: lambdaVariables,
    });

    //Assignment Lambda
    const toolAssignmentLambdaIntegration = new LambdaStack(
      this,
      "toolAssignmentLambda",
      {
        lambdaDirectory: "ToolAssignment",
        envVariables: lambdaVariables,
      },
    );

    new EvoMotorsApiStack(this, "EvoMotorsApiStack", {
      stageName: props.stageName,
      userPool: evoMotorsAuthStack.getUserPool(),
      userPoolClient: evoMotorsAuthStack.getUserPoolClient(),
      brandLambdaIntegration: brandLambdaIntegration.lambdaIntegration,
      carModelLambdaIntegration: carModelLambdaIntegration.lambdaIntegration,
      productLambdaIntegration: productLambdaIntegration.lambdaIntegration,
      witnessLambdaIntegration: witnessLambdaIntegration.lambdaIntegration,
      remissionLambdaIntegration: remissionLambdaIntegration.lambdaIntegration,
      certificateLambdaIntegration:
        certificateLambdaIntegration.lambdaIntegration,
      companyLambdaIntegration: companyLambdaIntegration.lambdaIntegration,
      productPriceLambdaIntegration:
        productPriceLambdaIntegration.lambdaIntegration,
      errorCodeLambdaIntegration: errorCodeLambdaIntegration.lambdaIntegration,
      carLambdaIntegration: carLambdaIntegration.lambdaIntegration,
      toolLambdaIntegration: toolLambdaIntegration.lambdaIntegration,
      toolAssignmentLambdaIntegration:
        toolAssignmentLambdaIntegration.lambdaIntegration,
    });
  }
}
