const tmrm = require('azure-pipelines-task-lib/mock-run');
const path = require('path');

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr = new tmrm.TaskMockRunner(taskPath);

// Test scenario: missing service connection
tmr.setInput('serviceConnection', 'NonExistentConnection');

// Don't set endpoint - this should cause an error
// tmr.setEndpointAuthorization() is not called

// Run the task - it should fail
tmr.run();
