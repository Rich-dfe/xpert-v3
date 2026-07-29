interface CognitoProfile {
  email: string;
  exp: number;
  iat: number;
  auth_time: number;
  given_name?: string;
  family_name?: string;
  "cognito:groups"?: string[];
}