const tmrm = require('azure-pipelines-task-lib/mock-run');
const path = require('path');

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr = new tmrm.TaskMockRunner(taskPath);

// Set up mock with missing service account name
tmr.setInput('serviceConnection', 'MyStackitConnection');

// Mock the service connection endpoint WITHOUT service account name
process.env.ENDPOINT_AUTH_SCHEME_MyStackitConnection = 'none';
// NOTE: ENDPOINT_AUTH_PARAMETER_MyStackitConnection_SERVICEACCOUNTNAME is NOT set

// Run the task (should fail because service account name is missing)
tmr.run();
