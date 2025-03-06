import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
});

backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    actions: [
      "appsync:EventConnect",
      "appsync:EventSubscribe",
      "appsync:EventPublish",
    ],
    effect: Effect.ALLOW,
    resources: ["*"],
  })
);

backend.addOutput({
  custom: {
    events: {
      url: "https://sve2hepirveyfjothukm5fv2mu.ddpg-api.us-west-2.amazonaws.com/event",
      aws_region: "us-west-2",
      default_authorization_type: "API_KEY",
      api_key: "da2-nj62mujhqrfuxbjv7wp2tbpsdy",
    },
  },
});
