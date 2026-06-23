import { KeyFlowCredentials } from './types';

/**
 * Parses a JSON string into KeyFlowCredentials.
 * Throws a user-friendly error on invalid JSON.
 */
export function parseCredentialsJson(credentialsJson: string): KeyFlowCredentials {
  try {
    const parsed = JSON.parse(credentialsJson) as {
      credentials?: {
        sub?: string;
        kid?: string;
        privateKey?: string;
        iss?: string;
      };
    };

    return {
      serviceAccountId: parsed.credentials?.sub,
      privateKeyId: parsed.credentials?.kid,
      privateKey: parsed.credentials?.privateKey,
      iss: parsed.credentials?.iss
    };
  } catch {
    throw new Error(
      'STACKIT Key Flow Authentication Error: Invalid JSON credentials.\n' +
      'Please ensure the credentials field contains valid JSON from your STACKIT service account.'
    );
  }
}
