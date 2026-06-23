# Security Policy

## Reporting a Vulnerability

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please email security concerns to: **[security contact to be configured by STACKIT]**

Include:
- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if you have one)

We will acknowledge receipt within 48 hours and work to resolve the issue promptly.

## Security Considerations

### Credential Handling

This extension handles sensitive STACKIT credentials in two ways:

#### WIF (Workload Identity Federation)
- **What it stores**: Service account name (non-sensitive)
- **How**: Encrypted by Azure DevOps in service connection storage
- **How it's used**: Passed as `STACKIT_SERVICE_ACCOUNT` environment variable
- **Risk**: Low - only the SA name is exposed

#### Key Flow
- **What it stores**: Full JSON credentials (highly sensitive)
- **How**: Encrypted by Azure DevOps in service connection storage
- **How it's used**: 
  - Parsed internally in the task
   - Written to a temporary file with restricted permissions for CLI login (`0600`)
   - Temporary credentials file is deleted immediately after CLI login attempt
  - CLI login is automatic and credentials are never logged
- **Risk**: Medium - full credentials in JSON must be handled carefully

### Logging and Masking

- **All secrets are masked** in Azure Pipelines logs using `tl.setSecret()`
- Credentials are **never logged directly**
- Environment variables containing credentials are marked as secret
- Debug output excludes credential values

### Environment Variables

Variables exported by the task:

| Variable | Masked | Sensitive |
|----------|--------|-----------|
| `STACKIT_AUTH_TYPE` | No | No |
| `STACKIT_SERVICE_ACCOUNT` | No | No (name only) |
| `STACKIT_CREDENTIALS` | Yes | **Yes** (Key Flow only) |
| `STACKIT_PROJECT_ID` | No | No |
| `STACKIT_ORGANIZATION` | No | No |

### CLI Login Security

For Key Flow authentication:
- Credentials are read from service connection
- Passed to STACKIT CLI via temporary credentials file to avoid process argument exposure
- CLI login runs with a bounded timeout to avoid hung processes
- Child process environment is reduced to essential system and proxy variables
- CLI authenticates and caches tokens locally
- Cached tokens are scoped to the agent's temporary directory
- No credentials remain in logs or build artifacts

### Best Practices for Users

1. **Service Connection Management**:
   - Restrict access to service connections in Azure DevOps
   - Use project-level connections (not organization-level) when possible
   - Regularly rotate credentials in STACKIT

2. **Pipeline Configuration**:
   - Don't log `STACKIT_CREDENTIALS` variable directly
   - Use authenticated output from STACKIT CLI instead of passing raw credentials
   - Keep pipelines in version control but ensure service connection references stay private

3. **Agent Security**:
   - Run agents in secure, isolated environments
   - Ensure STACKIT CLI is installed from trusted sources
   - Keep agents and Node.js up to date

4. **Network Security**:
   - Ensure communication with STACKIT API is over HTTPS
   - Use VPN/private networks if available for agent-to-API communication

### Dependency Security

The extension depends on:
- `azure-pipelines-task-lib`: Official Microsoft library for Azure DevOps tasks
- `typescript`, `@types/node`: Standard build dependencies

We regularly update dependencies to patch security vulnerabilities. Check [Dependabot alerts](https://github.com/stackitcloud/azure-devops-stackit-service-connection-extension/security/dependabot) for known issues.

### Code Security Measures

1. **Input Validation**: All inputs are validated before use
2. **Error Handling**: Errors are caught and reported safely without leaking secrets
3. **Principle of Least Privilege**: Task only requests permissions it needs
4. **No Hardcoded Credentials**: Zero hardcoded secrets in source code

### Release Security

1. **Code Review**: All code changes reviewed before merging
2. **Automated Tests**: Security-related tests run on every commit
3. **Signed Commits**: Releases are signed (GPG) for authenticity
4. **VSIX Integrity**: Published extensions can be verified against source

## Compliance

This extension complies with:
- ✅ Azure DevOps security guidelines
- ✅ Microsoft Secure Development Lifecycle (SDL)
- ✅ OWASP security practices for credential handling
- ✅ GitHub security best practices

## Security Updates

We will:
- Fix critical security issues immediately
- Release security patches as soon as possible
- Notify users through:
  - GitHub security advisories
  - Release notes
  - Email to extension subscribers (when available)

## Known Limitations

1. **CLI Installation**: The task assumes STACKIT CLI is installed. Malicious or compromised CLI could be a vector.
   - **Mitigation**: Install CLI from official, trusted sources only.

2. **Credential Scope**: Credentials remain valid for the entire pipeline after authentication.
   - **Mitigation**: Use short-lived tokens in STACKIT when possible.

3. **Agent Security**: Extension security is limited by agent security.
   - **Mitigation**: Use secure, isolated agents.

## Questions?

If you have security questions or concerns:
- Email: **[security contact]**
- GitHub Discussions: [Security Discussion](https://github.com/stackitcloud/azure-devops-stackit-service-connection-extension/discussions)

---

**Last Updated**: 2026-06-16
