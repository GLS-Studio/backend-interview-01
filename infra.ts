import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

//Create a Cognito User Pool
const userPool = new aws.cognito.UserPool("backend-interview-01-pool", {
  autoVerifiedAttributes: ["email"],
  usernameAttributes: ["email"],
  passwordPolicy: {
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    requireUppercase: false,
    minimumLength: 8,
  },
  schemas: [
    {
      name: "email",
      attributeDataType: "String",
      mutable: true,
      required: true,
    },
  ],
});

// Create a Cognito User Pool Client which will be used by your app to communicate with the User Pool
const userPoolClient = new aws.cognito.UserPoolClient(
  "backend-interview-01-upclient2",
  {
    userPoolId: userPool.id,
    explicitAuthFlows: ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"],
  }
);

// Create a Cognito Identity Pool
const identityPool = new aws.cognito.IdentityPool("backend-interview-01-ip", {
  identityPoolName: "backend-interview-01-ip",
  allowUnauthenticatedIdentities: true,
  cognitoIdentityProviders: [
    {
      clientId: userPoolClient.id,
      providerName: userPool.endpoint,
    },
  ],
});

// Update the Cognito Identity Pool for the new roles
const identityPoolRoles = new aws.cognito.IdentityPoolRoleAttachment(
  "backend-interview-01-poolroles",
  {
    identityPoolId: identityPool.id,
    roles: {
      authenticated:
        "arn:aws:iam::689816527256:role/amplify-frontendinterview01-dev-165600-authRole",
      unauthenticated:
        "arn:aws:iam::689816527256:role/amplify-frontendinterview01-dev-165600-unauthRole",
    },
  }
);

// Export the ID of the created User Pool, User Pool Client, and Identity Pool
export const userPoolId = userPool.id;
export const userPoolClientId = userPoolClient.id;
export const identityPoolId = identityPool.id;

// Cognito
// const pool = new aws.cognito.UserPool("backend-interview-01-up", {
//   autoVerifiedAttributes: ["email"],
// });

// const client = new aws.cognito.UserPoolClient("backend-interview-01-upclient", {
//   userPoolId: pool.id,
//   generateSecret: false, // Set to true to generate a client secret
//   explicitAuthFlows: ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
// });

// // Export the name of the bucket
// export const userPoolId = pool.id;
// export const userPoolClientId = client.id;

// Create a new IAM user
const iamUser = new aws.iam.User("amplify-interview-01", {});

// Attach policy to the user
const iamUserPolicyAttachment = new aws.iam.UserPolicyAttachment(
  "amplify-attachment",
  {
    user: iamUser.name,
    policyArn: "arn:aws:iam::aws:policy/AdministratorAccess-Amplify", // AWS managed policy
  }
);

const keys = new aws.iam.AccessKey("frontend-keys", { user: iamUser.name });

export const accessKeyId = keys.id;
export const secretAccessKey = keys.secret;
