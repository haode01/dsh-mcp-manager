# dsh-mcp-manager

MCP connection lifecycle management plugin for DeepSeek Harness.

Manage MCP server connections from the DSH Web GUI Settings → Plugins page, and from chat via `mcp_list_connections` / `mcp_add_connection` / `mcp_remove_connection` / `mcp_test_connection` tools. All changes persist to `~/.dsh/mcp-connections.json` and survive restarts.

## Features

| Feature | UI (Settings → Plugins) | Chat (tools) |
|---------|------------------------|--------------|
| List connections | ✅ | `mcp_list_connections` |
| Add connection (HTTP/stdio) | ✅ | `mcp_add_connection` |
| Remove connection | ✅ | `mcp_remove_connection` |
| Test connection + show tools | ✅ | `mcp_test_connection` |
| Persist across restarts | ✅ (auto) | ✅ (auto) |

## Architecture

```
┌──────────────┐     GET/POST      ┌─────────────────────────┐
│  Browser UI  │ ─────────────────→│  /mcp-manager/connections│
│ (client.js)  │ ←── JSON array ── │  (index.js handler)      │
└──────────────┘                   └───────────┬─────────────┘
                                               │ read/write
                                    ┌──────────▼──────────────┐
                                    │ ~/.dsh/mcp-connections.json
                                    └──────────┬──────────────┘
                                               │ startup restore
                                    ┌──────────▼──────────────┐
                                    │  ctx.loader.create()     │
                                    │  @deepseek-ai/dsh-mcp-client
                                    └──────────────────────────┘
```

All reads and writes go through a single JSON file. The UI calls the HTTP endpoint; server tools write the same file. At startup, connections are restored automatically.

## Usage

### 1. Symlink into DSH profile

```bash
ln -s /path/to/dsh-mcp-manager ~/.dsh/profiles/web/node_modules/dsh-mcp-manager
```

### 2. Start DSH with the patch

```bash
dsh web --patch /path/to/dsh-mcp-manager/cordis.patch.yml
```

### 3. Add connections

**From UI**: Settings → Plugins → MCP Manager → fill form → Add.

**From chat**: ask AI to call `mcp_add_connection`, e.g.:

> Add an MCP connection to http://10.118.81.110:3100/mcp/openwrt with server name "openwrt"

### 4. Test a connection

Click **Test** in the UI to probe the MCP endpoint and see its tools. No persistence — test only.

## File structure

```
dsh-mcp-manager/
├── index.js              # Server plugin: tools + HTTP endpoint + startup restore
├── lib/
│   ├── client.js         # Browser plugin: Settings UI card
│   ├── mcp-manager.js    # Runtime connection create/list/remove via ctx.loader
│   └── test-connection.js # Ephemeral MCP connection test
├── cordis.patch.yml      # Cordis loader patch
└── package.json
```

## License

MIT