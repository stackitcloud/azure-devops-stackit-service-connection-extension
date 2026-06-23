import tl = require('azure-pipelines-task-lib/task');
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { KeyFlowCredentials } from './types';
import { parseCredentialsJson } from './utils';

/**
 * Key Flow (JSON Credentials) Authentication
 * Uses service account credentials directly
 */
export async function runKeyFlowFlow(credentialsJson: string): Promise<void> {
  tl.debug('Using Key Flow authentication');

  const credentials = parseCredentialsJson(credentialsJson);
  tl.debug('Key Flow credentials JSON parsed successfully');

  // Validate required fields
  if (!credentials.privateKey) {
    throw new Error('STACKIT Key Flow Authentication Error: Missing privateKey in credentials');
  }

  tl.debug(`Key Flow metadata - serviceAccountId set: ${Boolean(credentials.serviceAccountId)}, email set: ${Boolean(credentials.iss)}`);

  // Mask credentials in logs
  tl.setSecret(credentialsJson);

    // Set environment variables for STACKIT SDK
  const serviceAccountKeyPath = writeJsonToTempFile(credentialsJson);
  tl.setVariable('STACKIT_SERVICE_ACCOUNT_KEY_PATH', serviceAccountKeyPath);
  tl.debug(`Temporary service account key path created at: ${serviceAccountKeyPath}`);

  if (credentials.iss) {
    tl.setVariable('STACKIT_SERVICE_ACCOUNT_EMAIL', credentials.iss);
    tl.debug('Set STACKIT_SERVICE_ACCOUNT_EMAIL variable');
  }

  tl.debug('Key Flow environment variables configured');
}



function writeJsonToTempFile(credentialsJson?: string): string {
  if (!credentialsJson) {
    throw new Error('STACKIT Key Flow Authentication Error: Missing credentials');
  }

  const keyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stackit-sa-key-'));
  const keyPath = path.join(keyDir, 'service-account.key');

  // Restrictive permissions to reduce exposure on shared agents.
  fs.writeFileSync(keyPath, credentialsJson, { encoding: 'utf8', mode: 0o600 });

  return keyPath;
}
