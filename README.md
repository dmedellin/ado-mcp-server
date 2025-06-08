<!-- filepath: /workspaces/ado-mcp-server/README.md -->
# ado-mcp-server

A Model Context Protocol (MCP) server for Azure DevOps.

## Overview

This project implements an MCP server intended for integration with Azure DevOps. The server is built using the `@modelcontextprotocol/sdk` and allows extension through a modular tool registration system.

## Features

- MCP server implementation using the official SDK
- Extensible architecture for registering project and work item tools
- Full support for Azure DevOps Work Item Tracking (WIT) REST API endpoints (create, get, update, delete, list, query, batch, revisions, comments, attachments, relations)
- Runs over STDIO for integration with other systems

## Getting Started

### Prerequisites

- Node.js (version 16+ recommended)
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/dmedellin/ado-mcp-server.git
cd ado-mcp-server
npm install
```

### Usage

Start the MCP server:

```bash
npm start
```

The server will run over STDIO and can be integrated with compatible clients.

### Testing

You can test the server using the Model Context Protocol Inspector:

```bash
npx @modelcontextprotocol/inspector
```

## Project Structure

- `index.js` - Entry point; initializes and runs the MCP server.
- `features/` - Directory for registering project and work item tools.

## Scripts

- `npm start` - Start the MCP server.
- `npm test` - (Currently not implemented.)

## Configuration
No additional configuration is required for basic usage. You may extend functionality by adding new tools in the `features` directory.

## Dependencies

- [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [`zod`](https://www.npmjs.com/package/zod)

## License

ISC

---

*This project is not affiliated with Microsoft or Azure DevOps.*

## Tools

- `linkWorkItems` — Link two Azure DevOps work items (e.g., parent-child, related, etc.).
  - **Input:**
    - `sourceId` (number/string): The ID of the source work item (e.g., the child in a parent-child link).
    - `targetId` (number/string): The ID of the target work item (e.g., the parent in a parent-child link).
    - `linkType` (string, optional): The type of link (default: `System.LinkTypes.Hierarchy-Forward` for parent-child).
    - `comment` (string, optional): Optional comment for the link operation.
  - **Permissions:** Requires permission to edit work items in the Azure DevOps project.
  - **Example:**
    ```json
    {
      "sourceId": 123,
      "targetId": 456,
      "linkType": "System.LinkTypes.Hierarchy-Forward"
    }
    ```

- `unlinkWorkItems` — Remove a link (e.g., parent-child, related) between two Azure DevOps work items.
  - **Input:**
    - `sourceId` (number/string): The ID of the source work item (the one holding the link).
    - `targetId` (number/string): The ID of the target work item (the one being linked to).
    - `linkType` (string, optional): The type of link to remove (default: `System.LinkTypes.Hierarchy-Forward` for parent-child).
  - **Permissions:** Requires permission to edit work items in the Azure DevOps project.
  - **Example:**
    ```json
    {
      "sourceId": 123,
      "targetId": 456,
      "linkType": "System.LinkTypes.Hierarchy-Forward"
    }
    ```

- `listBranches` — List Git branches (refs) for an Azure DevOps repository.
  - **Input:**
    - `project` (string): Azure DevOps project name.
    - `repoId` (string): Repository ID or name.
    - `filter` (string, optional): Filter for branch names.
    - `includeLinks` (boolean, optional): Include reference links.
    - `latestStatusesOnly` (boolean, optional): Only latest statuses.
  - **Example:**
    ```json
    {
      "project": "MyProject",
      "repoId": "MyRepo",
      "filter": "refs/heads/feature/"
    }
    ```

- `cloneRepo` — Clone an Azure DevOps Git repository to the local MCP server filesystem.
  - **Input:**
    - `project` (string): Azure DevOps project name.
    - `repoId` (string): Repository ID or name.
    - `targetDir` (string, optional): Target directory for the clone (default: temp directory).
  - **Example:**
    ```json
    {
      "project": "MyProject",
      "repoId": "MyRepo",
      "targetDir": "/tmp/myrepo-clone"
    }
    ```

- For more link types, see [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/boards/queries/link-types-work-items?view=azure-devops).
