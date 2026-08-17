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

## Installation

### Option 1: Git clone + symlink (recommended)

```bash
# Clone to a stable location
git clone https://github.com/haode01/dsh-mcp-manager.git /path/to/dsh-mcp-manager

# Symlink into DSH's web profile so the loader can resolve the package
ln -s /path/to/dsh-mcp-manager ~/.dsh/profiles/web/node_modules/dsh-mcp-manager

# Start DSH with the patch
dsh web --patch /path/to/dsh-mcp-manager/cordis.patch.yml
```

### Option 2: npm install in profile

```bash
cd ~/.dsh/profiles/web
npm install /path/to/dsh-mcp-manager   # or: npm install github:haode01/dsh-mcp-manager

# Start DSH with the patch
dsh web --patch /path/to/dsh-mcp-manager/cordis.patch.yml
```

### Option 3: Cordis config reference

Add to your existing DSH cordis config:

```yaml
- insert:
    - id: mcp-manager
      name: 'dsh-mcp-manager'
```

Then start DSH with that config file.

### Verify

After starting DSH, open Settings → Plugins. You should see an **MCP Manager** card. In chat, `mcp_list_connections` should return (initially empty) results.

## Usage

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