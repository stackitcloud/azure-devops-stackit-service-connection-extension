import * as assert from 'assert';
import * as path from 'path';
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';

describe('STACKIT Authenticate Task', function() {
  this.timeout(10000);

  it('WIF Authentication - should set correct environment variables', async function() {
    const testFile = path.join(__dirname, 'wif-flow.ts');
    const runner = new MockTestRunner(testFile);

    await runner.runAsync();

    assert.ok(runner.succeeded, `Task should have succeeded but failed with: ${runner.stderr}`);
  });

  it('Error Handling - should handle missing service connection', async function() {
    const testFile = path.join(__dirname, 'error-missing-connection.ts');
    const runner = new MockTestRunner(testFile);

    await runner.runAsync();

    assert.ok(!runner.succeeded, 'Task should have failed');
    assert.ok(runner.failed, 'Task should be marked as failed');
  });

  it('Error Handling - should handle missing authentication method', async function() {
    const testFile = path.join(__dirname, 'error-missing-auth-method.ts');
    const runner = new MockTestRunner(testFile);

    await runner.runAsync();

    assert.ok(!runner.succeeded, 'Task should have failed when no auth method is provided');
    assert.ok(runner.failed, 'Task should be marked as failed');
  });

  it('Error Handling - should handle both auth methods provided', async function() {
    const testFile = path.join(__dirname, 'error-both-methods.ts');
    const runner = new MockTestRunner(testFile);

    await runner.runAsync();

    assert.ok(!runner.succeeded, 'Task should have failed when both auth methods are provided');
    assert.ok(runner.failed, 'Task should be marked as failed');
  });

  it('Key Flow Authentication - should set correct environment variables', async function() {
    const testFile = path.join(__dirname, 'key-flow.ts');
    const runner = new MockTestRunner(testFile);

    await runner.runAsync();

    assert.ok(runner.succeeded, `Task should have succeeded.\nStdout: ${runner.stdout}\nStderr: ${runner.stderr}`);
  });

  it('Error Handling - should handle invalid JSON credentials', async function() {
    const testFile = path.join(__dirname, 'error-invalid-json.ts');
    const runner = new MockTestRunner(testFile);

    await runner.runAsync();

    assert.ok(!runner.succeeded, 'Task should have failed with invalid JSON');
    assert.ok(runner.failed, 'Task should be marked as failed');
  });

  it('Error Handling - should handle missing service account name in WIF', async function() {
    const testFile = path.join(__dirname, 'error-missing-service-account.ts');
    const runner = new MockTestRunner(testFile);

    await runner.runAsync();

    assert.ok(!runner.succeeded, 'Task should have failed with missing service account name');
    assert.ok(runner.failed, 'Task should be marked as failed');
  });
});
