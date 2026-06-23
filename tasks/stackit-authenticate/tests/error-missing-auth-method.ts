const tmrm = require('azure-pipelines-task-lib/mock-run');
const path = require('path');

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr = new tmrm.TaskMockRunner(taskPath);

// Set up mock with no authentication method
tmr.setInput('serviceConnection', 'MyStackitConnection');

// Mock the service connection endpoint WITHOUT either auth method
process.env.ENDPOINT_AUTH_SCHEME_MyStackitConnection = 'none';
// NOTE: Neither serviceAccountName nor credentials are set

// Run the task (should fail because no auth method is provided)
tmr.run();
