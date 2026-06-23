const tmrm = require('azure-pipelines-task-lib/mock-run');
const path = require('path');

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr = new tmrm.TaskMockRunner(taskPath);

// Set up mock answers with invalid JSON
tmr.setInput('serviceConnection', 'MyStackitConnection');

// Mock the service connection endpoint with invalid JSON
process.env.ENDPOINT_AUTH_SCHEME_MyStackitConnection = 'none';
process.env.ENDPOINT_AUTH_PARAMETER_MyStackitConnection_CREDENTIALS = '{invalid json - this should fail';

// Run the task - it should fail
tmr.run();
