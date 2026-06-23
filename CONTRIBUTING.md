# Contributing to STACKIT Azure DevOps Service Connection Extension

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you agree to uphold this code. Please report unacceptable behavior to the maintainers.

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- npm 10+
- Git
- TypeScript knowledge (extension is written in TypeScript)
- Familiarity with Azure DevOps extensions (see [official docs](https://learn.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops))

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/stackitcloud/azure-devops-stackit-service-connection-extension.git
cd azure-devops-stackit-service-connection-extension

# Install dependencies
npm install

# Verify setup
npm run build
npm test
```

## Making Changes

### Branch Strategy

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or for bug fixes:
   ```bash
   git checkout -b fix/your-bug-name
   ```

2. Make your changes with meaningful commits

3. Push to your fork and submit a Pull Request

### Development Workflow

1. **Make Changes**: Edit TypeScript files in `tasks/stackit-authenticate/`

2. **Build**: 
   ```bash
   npm run build
   ```

3. **Test Locally**:
   ```bash
   npm test
   ```
   Ensure all tests pass and coverage remains >80%

4. **Package for Testing**:
   ```bash
   npm run package
   ```
   This creates a `.vsix` file you can install locally

5. **Manual Testing in Azure DevOps**:
   - Upload the VSIX to your dev organization
   - Create a service connection (WIF and Key Flow variants)
   - Use the authenticate task in a test pipeline
   - Verify environment variables are set correctly

### Code Style

- Use TypeScript with strict mode enabled
- Follow naming conventions:
  - Classes: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- Format code with proper indentation (2 spaces)
- Add comments for complex logic
- Avoid console.log; use `tl.debug()` for debugging in tasks

### Testing

Tests should cover:
- ✅ WIF authentication flow
- ✅ Key Flow authentication flow
- ✅ Error handling (missing credentials, invalid inputs)
- ✅ Environment variable setup
- ✅ CLI login command execution (Key Flow)

Run tests:
```bash
npm test
```

Add new tests to `tasks/stackit-authenticate/tests/` following existing patterns.

## Pull Request Process

1. **Before submitting**:
   - Run `npm run build` - must complete without errors
   - Run `npm test` - all tests must pass
   - Update README.md if adding new features
   - Update CHANGELOG.md with your changes

2. **PR Description** should include:
   - What problem does this solve?
   - How does it solve it?
   - Testing steps (for manual testing)
   - Screenshots if UI changes

3. **PR Review**:
   - Maintainers will review code, tests, and documentation
   - Address feedback and push new commits (don't force-push unless requested)

4. **Merging**:
   - PRs require approval before merging
   - Branch is deleted after merge

## Reporting Issues

### Bugs

If you find a bug, please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (agent OS, Node version, Azure DevOps version)
- Logs (redact sensitive data)

### Feature Requests

When suggesting a new feature:
- Describe the use case
- Explain why it's needed
- Suggest implementation if you have ideas

## Project Structure

```
├── vss-extension.json              # Main manifest
├── package.json                    # Root configuration
├── tsconfig.json                   # TypeScript configuration
├── tasks/
│   └── stackit-authenticate/       # Main task
│       ├── task.json               # Task definition
│       ├── index.ts                # Task implementation
│       ├── package.json            # Task dependencies
│       └── tests/
│           ├── _suite.ts           # Test harness
│           ├── wif-flow.ts         # WIF auth tests
│           └── key-flow.ts         # Key Flow auth tests
├── .github/
│   └── workflows/
│       ├── ci.yml  # CI workflow
│       └── release.yml  # CD workflow
├── images/
│   └── extension-icon.png          # Extension icon
├── LICENSE
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
└── CHANGELOG.md
```

## Key Files

| File | Purpose |
|------|---------|
| `vss-extension.json` | Extension manifest - defines service connection type and task contribution |
| `tasks/stackit-authenticate/task.json` | Task definition - inputs, execution config |
| `tasks/stackit-authenticate/index.ts` | Task logic - reads connection, sets env vars, does CLI login |
| `tasks/stackit-authenticate/tests/_suite.ts` | Test infrastructure using MockTestRunner |

## Release Process

Releases are automated via GitHub Actions CI/CD:

1. Update version in `vss-extension.json` and `tasks/stackit-authenticate/package.json`
2. Update CHANGELOG.md
3. Commit and push to main
4. Create Git tag: `git tag v1.0.1`
5. Push tag: `git push --tags`
6. GitHub Actions automatically:
   - Builds and tests
   - Creates VSIX package
   - Publishes to Azure DevOps Marketplace
   - Creates GitHub Release with VSIX artifact

## Questions?

- Check existing [Issues](https://github.com/stackitcloud/azure-devops-stackit-service-connection-extension/issues)
- Read [Azure DevOps Extension Docs](https://learn.microsoft.com/en-us/azure/devops/extend/?view=azure-devops)
- Review existing code comments

Thank you for contributing! 🙌
