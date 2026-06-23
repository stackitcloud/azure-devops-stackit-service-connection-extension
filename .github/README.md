# GitHub Automation

This repository includes two GitHub Actions workflows:

- `workflows/ci.yml`: Runs build, test, package, and uploads the VSIX artifact.
- `workflows/release.yml`: Builds, tests, packages, optionally publishes to Azure DevOps Marketplace, and creates GitHub releases for version tags.

## Required Secrets

- `MARKETPLACE_PAT`: Azure DevOps Marketplace personal access token with publish scope.
- `PUBLISHER_ID`: Publisher identifier for marketplace publishing.
