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