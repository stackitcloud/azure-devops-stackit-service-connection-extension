const tmrm = require('azure-pipelines-task-lib/mock-run');
const path = require('path');

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr = new tmrm.TaskMockRunner(taskPath);

// Set up mock with BOTH auth methods
tmr.setInput('serviceConnection', 'MyStackitConnection');

// Mock the service connection endpoint with BOTH methods set
process.env.ENDPOINT_AUTH_SCHEME_MyStackitConnection = 'none';
process.env.ENDPOINT_AUTH_PARAMETER_MyStackitConnection_SERVICEACCOUNTNAME = 'my-sa';
process.env.ENDPOINT_AUTH_PARAMETER_MyStackitConnection_CREDENTIALS = '{"privateKey":"test"}';

// Run the task (should fail because both auth methods are provided)
tmr.run();
