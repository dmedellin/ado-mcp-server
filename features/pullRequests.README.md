# Azure DevOps Git Pull Requests API Feature

This document describes the usage and test prompts for the Azure DevOps Git Pull Requests API integration in the MCP features tools.

## Overview

This feature provides tools to interact with the Azure DevOps Git Pull Requests REST API, including:
- Listing pull requests
- Getting pull request details
- Creating a new pull request
- Updating an existing pull request

## Usage

Import and register the tools (already handled in `features/index.js`).

### Example Prompts

#### List Pull Requests
```json
{
  "tool": "listPullRequests",
  "input": {
    "project": "MyProject",
    "repoId": "MyRepo",
    "status": "active"
  }
}
```

#### Get Pull Request Details
```json
{
  "tool": "getPullRequest",
  "input": {
    "project": "MyProject",
    "repoId": "MyRepo",
    "pullRequestId": 123
  }
}
```

#### Create Pull Request
```json
{
  "tool": "createPullRequest",
  "input": {
    "project": "MyProject",
    "repoId": "MyRepo",
    "sourceRefName": "feature-branch",
    "targetRefName": "main",
    "title": "Add new feature",
    "description": "Implements the new feature.",
    "reviewers": [{ "id": "user-guid" }]
  }
}
```

#### Update Pull Request
```json
{
  "tool": "updatePullRequest",
  "input": {
    "project": "MyProject",
    "repoId": "MyRepo",
    "pullRequestId": 123,
    "title": "Updated Title"
  }
}
```

---

For more details, see the [Azure DevOps Git Pull Requests REST API documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests?view=azure-devops-rest-7.2).
