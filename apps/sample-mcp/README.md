# sample-mcp

A Model Context Protocol (MCP) server built with mcp-framework.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

```

## Project Structure

```
sample-mcp/
├── src/
│   ├── tools/        # MCP Tools
│   │   └── ExampleTool.ts
│   └── index.ts      # Server entry point
├── package.json
└── tsconfig.json
```

## Adding Components

The project comes with an example tool in `src/tools/ExampleTool.ts`. You can add more tools using the CLI:

```bash
# Add a new tool
mcp add tool my-tool

# Example tools you might create:
mcp add tool data-processor
mcp add tool api-client
mcp add tool file-handler
```

## Tool Development

Example tool structure:

```typescript
import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface MyToolInput {
  message: string;
}

class MyTool extends MCPTool<MyToolInput> {
  name = "my_tool";
  description = "Describes what your tool does";

  schema = {
    message: {
      type: z.string(),
      description: "Description of this input parameter",
    },
  };

  async execute(input: MyToolInput) {
    // Your tool logic here
    return `Processed: ${input.message}`;
  }
}

export default MyTool;
```

## Publishing to npm

1. Update your package.json:
   - Ensure `name` is unique and follows npm naming conventions
   - Set appropriate `version`
   - Add `description`, `author`, `license`, etc.
   - Check `bin` points to the correct entry file

2. Build and test locally:
   ```bash
   npm run build
   npm link
   sample-mcp  # Test your CLI locally
   ```

3. Login to npm (create account if necessary):
   ```bash
   npm login
   ```

4. Publish your package:
   ```bash
   npm publish
   ```

After publishing, users can add it to their claude desktop client (read below) or run it with npx
```

## Using with Claude Desktop

### Local Development

Add this configuration to your Claude Desktop config file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sample-mcp": {
      "command": "node",
      "args":["/absolute/path/to/sample-mcp/dist/index.js"]
    }
  }
}
```

### After Publishing

Add this configuration to your Claude Desktop config file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sample-mcp": {
      "command": "npx",
      "args": ["sample-mcp"]
    }
  }
}
```

## Building and Testing

1. Make changes to your tools
2. Run `npm run build` to compile
3. The server will automatically load your tools on startup

## Learn More

- [MCP Framework Github](https://github.com/QuantGeekDev/mcp-framework)
- [MCP Framework Docs](https://mcp-framework.com)


---


## References

[SDK](https://github.com/modelcontextprotocol/typescript-sdk)
[latest spec version](https://modelcontextprotocol.io/specification/2025-06-18)

[how-to-1](https://medium.com/@pankaj_pandey/5b0537bfa44f)

[issues - zod v4](https://github.com/modelcontextprotocol/typescript-sdk/issues/796)
[isues - zod](https://github.com/modelcontextprotocol/typescript-sdk/issues/745)




---

node server.js
# MCP server running at http://localhost:3000/mcp

npx @modelcontextprotocol/inspector
```

Then open it in your browser, select **Streamable HTTP** as transport type, and enter:
```
http://localhost:3000/mcp




## test with curl

```bash
# 1. Initialize — grab the Mcp-Session-Id from the response headers
curl -si -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc":"2.0","id":1,"method":"initialize",
    "params":{
      "protocolVersion":"2025-03-26",
      "clientInfo":{"name":"curl-client","version":"1.0"},
      "capabilities":{}
    }
  }'

# 2. List tools (replace SESSION_ID with the value from above)
curl -s -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: SESSION_ID" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# 3. Call the add tool
curl -s -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: SESSION_ID" \
  -d '{
    "jsonrpc":"2.0","id":3,"method":"tools/call",
    "params":{"name":"add","arguments":{"a":7,"b":5}}
  }'
```

## test with claud desktop

Add this to your Claude Desktop config (~/Library/Application Support/Claude/claude_desktop_config.json):

```json
{
  "mcpServers": {
    "my-remote-server": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:3000/mcp"]
    }
  }
}
```

mcp-remote is a lightweight bridge that lets Claude Desktop (stdio-based) talk to a remote Streamable HTTP server.

## Stateless Mode

Stateless Mode (for Serverless / Production)
If you don't need session state, swap to a simpler stateless version:

```js
// Stateless: one fresh server+transport per request, no session tracking
app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // disables sessions
  });
  const server = createMcpServer();
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
  await server.close();
});

app.get("/mcp", (req, res) => res.status(405).send("Use POST"));
app.delete("/mcp", (req, res) => res.status(405).send("Use POST"));
```