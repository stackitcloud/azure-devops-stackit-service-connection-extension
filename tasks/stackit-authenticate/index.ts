import tl = require('azure-pipelines-task-lib/task');
import { runWifFlow } from './wif-auth';
import { runKeyFlowFlow } from './key-flow-auth';

/**
 * StackitAuthenticate Task
 *
 * Authenticates with STACKIT using either:
 * 1. WIF (Workload Identity Federation) - via OIDC token exchange
 * 2. Key Flow (JSON credentials) - direct credential-based auth
 *
 * This task automatically detects which method to use based on the service connection configuration.
 */

async function run(): Promise<void> {
  try {
    tl.debug('Starting STACKIT authentication task');

    // Get task inputs
    const serviceConnectionId = tl.getInputRequired('serviceConnection');
    if (!serviceConnectionId) {
      throw new Error('Service connection is required. Please select a STACKIT service connection.');
    }

    tl.debug(`Service connection: ${serviceConnectionId}`);

    // Check which authentication method is configured
    const serviceAccountName = getOptionalEndpointAuthParameter(serviceConnectionId, 'serviceAccountName');
    const credentialsJson = getOptionalEndpointAuthParameter(serviceConnectionId, 'credentials');

    const hasWif = serviceAccountName && serviceAccountName.trim();
    const hasKeyFlow = credentialsJson && credentialsJson.trim();
    tl.debug(`Auth detection - hasWif: ${Boolean(hasWif)}, hasKeyFlow: ${Boolean(hasKeyFlow)}`);

    // Validate: exactly one method should be configured
    if (hasWif && hasKeyFlow) {
      throw new Error(
        'STACKIT Authentication Error: You provided BOTH authentication methods.\n' +
        'Please provide EXACTLY ONE of the following:\n' +
        '  • Service Account Name (for WIF authentication), OR\n' +
        '  • Service Account Credentials JSON (for Key Flow authentication)\n' +
        'Leave the unused field empty.'
      );
    }

    if (!hasWif && !hasKeyFlow) {
      throw new Error(
        'STACKIT Authentication Error: No authentication method provided.\n' +
        'Please provide EXACTLY ONE of the following in the service connection:\n' +
        '  • Service Account Name (for WIF authentication), OR\n' +
        '  • Service Account Credentials JSON (for Key Flow authentication)'
      );
    }

    // Route to appropriate authentication method
    if (hasWif) {
      tl.debug('Routing authentication to WIF flow');
      await runWifFlow(serviceConnectionId, serviceAccountName!);
    } else {
      tl.debug('Routing authentication to Key Flow');
      await runKeyFlowFlow(credentialsJson!);
    }

    tl.setResult(tl.TaskResult.Succeeded, 'Successfully authenticated with STACKIT');
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    tl.debug(`Task failed with error: ${errorMessage}`);
    tl.setResult(tl.TaskResult.Failed, errorMessage);
  }
}

function getOptionalEndpointAuthParameter(serviceConnectionId: string, parameterKey: string): string | undefined {
  try {
    return tl.getEndpointAuthorizationParameter(serviceConnectionId, parameterKey, false);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('Endpoint auth data not present')) {
      tl.debug(`Endpoint auth not present while reading ${parameterKey}; treating as empty`);
      return undefined;
    }
    throw err;
  }
}

run().catch(reason => tl.setResult(tl.TaskResult.Failed, reason));
