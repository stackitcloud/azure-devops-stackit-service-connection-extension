# STACKIT Azure DevOps Service Connection Extension

Azure DevOps extension to authenticate with STACKIT cloud platform using either **Workload Identity Federation (WIF)** or **Key Flow** (JSON credentials). This extension provides a secure service connection type and an authentication task that sets up environment variables and can perform CLI login when explicitly enabled.

## Features

- ✅ **Service Connection Type**: Secure credential storage for STACKIT authentication
- ✅ **WIF Authentication**: Workload Identity Federation - minimal setup, just provide service account name
- ✅ **OIDC Token Exchange**: Automatic Azure DevOps OIDC token → STACKIT access token conversion
- ✅ **Environment Setup**: Sets required environment variables for STACKIT SDK
- ✅ **Secret Masking**: Access tokens masked in pipeline logs
- ✅ **Linux Support**: Task runs on Linux agents only

## Authentication Methods

### Important: Choose Exactly One

When creating a STACKIT service connection, you **must provide exactly one authentication method**:

| Method | Field | When to Use | What to Provide |
|--------|-------|-------------|----------------|
| **WIF** | Service Account Name | Recommended for Azure DevOps environments with federated identity setup | The STACKIT service account name (e.g., `my-terraform-account`) |
| **Key Flow** | Service Account Credentials (JSON) | For local development or where WIF is unavailable | Full JSON file contents from STACKIT service account |

### Configuration Rules

- ✅ **Do this**: Fill EITHER the Service Account Name field OR the Credentials JSON field
- ❌ **Don't do this**: Leave both fields empty
- ❌ **Don't do this**: Fill both fields with values

If you misconfigure the connection (empty or both filled), the `stackit-authenticate` task will fail with a clear error message telling you which field to fix.

## Installation

### For Users

1. **Install from Marketplace** (when published):
   - Visit [Azure DevOps Marketplace](https://marketplace.visualstudio.com/items?itemName=stackitcloud.stackit-service-connection)
   - Click "Get it free"
   - Select your Azure DevOps organization

2. **Local Development Install** (VSIX):
   - Download the VSIX file from [Releases](https://github.com/stackitcloud/azure-devops-stackit-service-connection-extension/releases)
   - Go to `https://dev.azure.com/{organization}/_settings/extensions`
   - Click "Upload extension"
   - Select the VSIX file

### For Developers

1. **Clone and Setup**:
   ```bash
   git clone https://github.com/stackitcloud/azure-devops-stackit-service-connection-extension.git
   cd azure-devops-stackit-service-connection-extension
   npm install
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Test**:
   ```bash
   npm test
   ```

4. **Package**:
   ```bash
   npm run package
   ```

## Usage

### Creating a Service Connection

#### WIF (Workload Identity Federation)

1. In Azure DevOps, go to **Project Settings** → **Service connections**
2. Click **New service connection** → **STACKIT**
3. Choose **WIF** authentication scheme
4. Enter:
   - **Service Account Name**: Name of your STACKIT service account
5. Test the connection
6. Save

#### Key Flow (JSON Credentials)

1. In Azure DevOps, go to **Project Settings** → **Service connections**
2. Click **New service connection** → **STACKIT**
3. Choose **Generic** authentication scheme
4. Paste the full JSON credentials from your STACKIT service account
5. Test the connection (optional)
6. Save

### Using in Pipelines

#### Example: WIF Authentication

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: StackitAuthenticate@1
    inputs:
      serviceConnection: 'My STACKIT Connection (WIF)'
    displayName: 'Authenticate with STACKIT (WIF)'

  - script: |
      echo "Service Account: $STACKIT_SERVICE_ACCOUNT_EMAIL"
    displayName: 'Verify STACKIT Authentication'
```

#### Example: Key Flow Authentication

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: StackitAuthenticate@1
    inputs:
      serviceConnection: 'My STACKIT Connection (Key Flow)'
    displayName: 'Authenticate with STACKIT (Key Flow)'

  - script: |
      # For Key Flow, credentials are available via STACKIT_SERVICE_ACCOUNT_KEY_PATH
      stackit auth activate-service-account
      stackit projects list
    displayName: 'List STACKIT Projects'
```

### Task Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `serviceConnection` | Service Connection | Yes | STACKIT service connection to use |


### Environment Variables Set by Task

| Variable | WIF | Key Flow | Description |
|----------|-----|----------|-------------|
| `STACKIT_SERVICE_ACCOUNT_EMAIL` | ✅ | ✅ | Service account name (WIF) or email (Key Flow) |
| `STACKIT_SERVICE_CONNECTION_ID` | ✅ | ❌ | Azure DevOps service connection ID (used for OIDC token retrieval) |
| `STACKIT_SERVICE_ACCOUNT_KEY_PATH` | ❌ | ✅ | Path to temporary file with JSON credentials (automatically cleaned up) |

## Requirements

- Azure DevOps Agent with Node.js 20+ (standard on modern agents)
- STACKIT CLI installed on the agent (`stackit` command available)
- For Key Flow: Valid STACKIT service account credentials in JSON format
- For WIF: Configured Workload Identity Federation in STACKIT

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Setting up development environment
- Running tests locally
- Submitting pull requests
- Code style and conventions

## Security

See [SECURITY.md](SECURITY.md) for:
- Reporting security vulnerabilities
- Security considerations
- Data privacy and credential handling

## Publishing

### Prerequisites

- GitHub account with access to this repository
- Azure DevOps Marketplace Publisher account
- Marketplace Personal Access Token (PAT)

### CI/CD Workflows

- `ci.yml`: Build, test, package, and upload VSIX artifact on push/PR
- `release.yml`: Build, test, package, publish (tag/manual), and attach VSIX to GitHub Release

### Automatic Publishing (CI/CD)

1. **Set GitHub Secrets** (in repository settings):
   - `MARKETPLACE_PAT`: Your Azure DevOps Marketplace Personal Access Token

2. **Publish** via GitHub Actions (`release.yml`):
   - Push a tag: `git tag v1.0.1 && git push --tags`
   - Or merge to `main` with version bump in `vss-extension.json`
   - GitHub Actions will automatically build, test, and publish

### Manual Publishing

```bash
# Build and package
npm run build
npm run package

# Publish to marketplace
npm run package:publish
```

## Troubleshooting

### Service Connection fails to save
- Ensure you're using the correct authentication scheme (WIF vs Key Flow)
- For Key Flow: validate JSON format is correct (copy directly from STACKIT UI)
- Check that STACKIT API URL is reachable

### Task fails with "STACKIT CLI not found"
- Ensure STACKIT CLI (`stackit` command) is installed on the agent
- Add CLI installation step before authentication task if needed

### Variables not available in next steps
- Verify the task ran successfully (check logs)
- Use explicit environment variable reference in YAML if needed:
  ```yaml
  - task: StackitAuthenticate@1
    name: StackitAuth
  - script: echo $(STACKIT_SERVICE_ACCOUNT_EMAIL)
  ```

## License

[Apache 2.0](LICENSE)

## Support

For issues, feature requests, or questions:
- GitHub Issues: [Report an issue](https://github.com/stackitcloud/azure-devops-stackit-service-connection-extension/issues)
- Documentation: [GitHub Wiki](https://github.com/stackitcloud/azure-devops-stackit-service-connection-extension/wiki)

---
