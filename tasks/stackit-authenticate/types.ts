export interface StackitAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface KeyFlowCredentials {
  serviceAccountId?: string;
  privateKeyId?: string;
  privateKey?: string;
  iss?: string;
}
