import tl = require('azure-pipelines-task-lib/task');

/**
 * WIF (Workload Identity Federation) Authentication
 * Injects service connection details so OIDC token retrieval can happen later in the pipeline
 */
export async function runWifFlow(serviceConnectionId: string, serviceAccountName: string): Promise<void> {
  tl.debug('Using WIF (Workload Identity Federation) authentication');
  tl.debug(`Preparing deferred WIF metadata for service connection: ${serviceConnectionId}`);

  tl.setVariable('STACKIT_SERVICE_ACCOUNT_EMAIL', serviceAccountName);
  tl.setVariable('STACKIT_SERVICE_CONNECTION_ID', serviceConnectionId);


  tl.debug('WIF metadata injected; OIDC token retrieval deferred to downstream steps');
}
