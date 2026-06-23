const tmrm = require('azure-pipelines-task-lib/mock-run');
const path = require('path');

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr = new tmrm.TaskMockRunner(taskPath);

// Set up mock answers for WIF authentication
tmr.setInput('serviceConnection', 'MyStackitConnection');

// Mock the service connection endpoint with WIF
process.env.ENDPOINT_AUTH_SCHEME_MyStackitConnection = 'none';
process.env.ENDPOINT_AUTH_PARAMETER_MyStackitConnection_SERVICEACCOUNTNAME = 'my-terraform-account';

// Mock pipeline context variables
process.env['SYSTEM_COLLECTIONURI'] = 'https://dev.azure.com/myorg/'\;
process.env['SYSTEM_TEAMPROJECTID'] = 'myproject';
process.env['SYSTEM_PLANID'] = 'plan123';
process.env['SYSTEM_JOBID'] = 'job456';

// Mock system access token
process.env['ENDPOINT_AUTH_PARAMETER_SYSTEMVSSCONNECTION_ACCESSTOKEN'] = 'mock-access-token';

// Run the task (it will attempt OIDC token exchange, which will fail gracefully in test)
tmr.run();
