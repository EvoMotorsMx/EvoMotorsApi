#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EvoMotorsCiCdStack } from "../lib/Stacks/evo_motors_cicd-stack";
import { getConfig } from "../config/envConfig";

const config = getConfig();
const app = new cdk.App();
new EvoMotorsCiCdStack(app, "EvoMotorsCiCdStack", { config });

app.synth();
