import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as apigw from "aws-cdk-lib/aws-apigateway"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs"
import * as path from "node:path"
import * as ec2 from "aws-cdk-lib/aws-ec2"
import { Duration } from "aws-cdk-lib"

export class BackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = ec2.Vpc.fromVpcAttributes(this, "VPC", {
      vpcId: "vpc-0698ea47fe9c877da", // Replace with your VPC ID
      availabilityZones: ["us-east-2a", "us-east-2b", "us-east-2c"], // Replace with your AZs
      privateSubnetIds: ["subnet-0ba603369184f70bb", "subnet-0505c8cfb53cbaab9", "subnet-02cf19ae6705fed49"], // Replace with your private subnet IDs
    })

    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, "SG", "sg-0394d20b69ad97bde", {
      // Find your security group
      mutable: false,
    })

    // NOTE: You First have to add RDS_USER and RDS_PASSWORD to
    // your environment variables for your account. Same with RDS_DATABASE and RDS_HOST
    const rdsUser = process.env.RDS_USER!
    const rdsPassword = process.env.RDS_PASSWORD!
    const rdsDatabase = process.env.RDS_DATABASE!
    const rdsHost = process.env.RDS_HOST!

    // generic default handler for any API function that doesn't get its own Lambda method
    const default_fn = new lambdaNodejs.NodejsFunction(this, "LambdaDefaultFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "default.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "default")),
      vpc: vpc, // Reference the VPC defined above
      securityGroups: [securityGroup], // Associate the security group
      timeout: Duration.seconds(3), // Example timeout, adjust as needed
    })

    const api_endpoint = new apigw.LambdaRestApi(this, `donazionappapi`, {
      handler: default_fn,
      restApiName: `DonazionAppAPI`,
      proxy: false,
      defaultCorsPreflightOptions: {
        // Optional BUT very helpful: Add CORS configuration
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    })

    // Create /api resource in root
    const apiResource = api_endpoint.root.addResource("api")

    // /api/ 
    const donorResource = apiResource.addResource("donor")
    const donationcenterResource = apiResource.addResource("donationcenter")
    const organizationResource = apiResource.addResource("organization")
    const mapResource = apiResource.addResource("map")

    // /api/donor/ 
    const donorDonateResource = donorResource.addResource("donate")
    const donorListCenterResource = donorResource.addResource("listcenter")
    const donorWishlistResource = donorResource.addResource("wishlist")

    // /api/donationcenter/ 
    const donationcenterRegisterResource = donationcenterResource.addResource("register")
    const donationcenterLoginResource = donationcenterResource.addResource("login")
    const donationcenterDeleteResource = donationcenterResource.addResource("delete")
    const donationcenterDashboardResource = donationcenterResource.addResource("dashboard")
    const donationcenterInventoryResource = donationcenterResource.addResource("inventory")
    const donationcenterWishlistResource = donationcenterResource.addResource("wishlist")
    // /api/donationcenter/wishlist/  
    const donationcenterWishlistAddResource = donationcenterResource.addResource("add")
    const donationcenterWishlistRemoveResource = donationcenterResource.addResource("remove")

    // /api/organization/ 
    const organizationLoginResource = organizationResource.addResource("login")
    const organizationPasswordresetResource = organizationResource.addResource("passwordreset")
    const organizationListcentersResource = organizationResource.addResource("listcenters")
    const organizationDashboardResource = organizationResource.addResource("dashboard")
    const organizationCategoryResource = organizationResource.addResource("category")
    const organizationCategoryitemResource = organizationResource.addResource("categoryitem")
    // /api/organization/category/
    const organizationCategoryAddResource = organizationCategoryResource.addResource("add")
    const organizationCategoryRemoveResource = organizationCategoryResource.addResource("remove")
    const organizationCategoryListResource = organizationCategoryResource.addResource("list")
    // /api/organization/categoryitem/
    const organizationCategoryItemAddResource = organizationCategoryitemResource.addResource("add")
    const organizationCategoryRemoveRemoveResource = organizationCategoryitemResource.addResource("remove")
    const organizationCategoryEditResource = organizationCategoryitemResource.addResource("edit")

    // https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-apigateway/README.md
    const integration_parameters = {
      proxy: false,
      passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_MATCH,

      integrationResponses: [
        {
          // Successful response from the Lambda function, no filter defined
          statusCode: "200",
          responseTemplates: {
            "application/json": "$input.json('$')", // should just pass JSON through untouched
          },
          responseParameters: {
            "method.response.header.Content-Type": "'application/json'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials": "'true'",
          },
        },
        {
          // For errors, we check if the error message is not empty, get the error data
          selectionPattern: "(\n|.)+",
          statusCode: "400",
          responseTemplates: {
            "application/json": JSON.stringify({ state: "error", message: "$util.escapeJavaScript($input.path('$.errorMessage'))" }),
          },
          responseParameters: {
            "method.response.header.Content-Type": "'application/json'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials": "'true'",
          },
        },
      ],
    }

    const response_parameters = {
      methodResponses: [
        {
          // Successful response from the integration
          statusCode: "200",
          // Define what parameters are allowed or not
          responseParameters: {
            "method.response.header.Content-Type": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
          },
        },
        {
          // Same thing for the error responses
          statusCode: "400",
          responseParameters: {
            "method.response.header.Content-Type": true,
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
          },
        },
      ],
    }

    // Add a POST method to the '/todo/create' resource
    const create_fn = new lambdaNodejs.NodejsFunction(this, "CreateFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "create.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "create")),
      vpc: vpc, // Reference the VPC defined above
      environment: {
        // Define your environment variables here
        RDS_USER: process.env.RDS_USER!,
        RDS_PASSWORD: process.env.RDS_PASSWORD!,
        RDS_DATABASE: process.env.RDS_DATABASE!,
        RDS_HOST: process.env.RDS_HOST!,
      },
      securityGroups: [securityGroup], // Associate the security group
      timeout: Duration.seconds(3), // Example timeout, adjust as needed
    })

    createResource.addMethod("POST", new apigw.LambdaIntegration(create_fn, integration_parameters), response_parameters)

    // Add a POST method to the '/todo/append' resource
    const append_fn = new lambdaNodejs.NodejsFunction(this, "AppendFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "append.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "append")),
      vpc: vpc, // Reference the VPC defined above
      environment: {
        // Define your environment variables here
        RDS_USER: process.env.RDS_USER!,
        RDS_PASSWORD: process.env.RDS_PASSWORD!,
        RDS_DATABASE: process.env.RDS_DATABASE!,
        RDS_HOST: process.env.RDS_HOST!,
      },
      securityGroups: [securityGroup], // Associate the security group
      timeout: Duration.seconds(3), // Example timeout, adjust as needed
    })

    appendResource.addMethod("POST", new apigw.LambdaIntegration(append_fn, integration_parameters), response_parameters)

    // Add a POST method to the '/todo/delete' resource
    const delete_fn = new lambdaNodejs.NodejsFunction(this, "DeleteFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "delete.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "delete")),
      vpc: vpc, // Reference the VPC defined above
      environment: {
        // Define your environment variables here
        RDS_USER: process.env.RDS_USER!,
        RDS_PASSWORD: process.env.RDS_PASSWORD!,
        RDS_DATABASE: process.env.RDS_DATABASE!,
        RDS_HOST: process.env.RDS_HOST!,
      },
      securityGroups: [securityGroup], // Associate the security group
      timeout: Duration.seconds(3), // Example timeout, adjust as needed
    })

    deleteResource.addMethod("POST", new apigw.LambdaIntegration(delete_fn, integration_parameters), response_parameters)
  }
}
