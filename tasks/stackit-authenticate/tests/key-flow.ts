const tmrm = require('azure-pipelines-task-lib/mock-run');
const path = require('path');

const taskPath = path.join(__dirname, '..', 'index.js');
const tmr = new tmrm.TaskMockRunner(taskPath);

// Set up mock answers for Key Flow authentication
tmr.setInput('serviceConnection', 'MyStackitConnection');

// Mock credentials JSON
const credentialsJson = JSON.stringify({
  credentials: {
    sub: 'test-service-account',
    kid: 'test-key-id',
    iss: 'test-service-account@test.iam.stackit.cloud',
    privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA2Z3qX2BTLS...\n-----END RSA PRIVATE KEY-----'
  }
});

// Mock the service connection endpoint for Key Flow
process.env.ENDPOINT_AUTH_SCHEME_MyStackitConnection = 'none';
process.env.ENDPOINT_AUTH_PARAMETER_MyStackitConnection_CREDENTIALS = credentialsJson;

// Run the task
tmr.run();
