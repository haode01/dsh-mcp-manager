# dsh-mcp-manager

[English](README.md) | [中文](README.zh.md)

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
| Stdio auto-download + progress bar | ✅ | — |

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

### Option 1: `dsh plugin add` (recommended)

```bash
dsh plugin --profile web add github:haode01/dsh-mcp-manager
```

Installs into `~/.dsh/profiles/web/`, auto-adds to `cordis.yml` as a profile bundle layer. No manual symlink or `--patch` needed.

Restart DSH:

```bash
dsh web
```

### Option 2: Git clone + symlink

```bash
git clone https://github.com/haode01/dsh-mcp-manager.git /path/to/dsh-mcp-manager
ln -s /path/to/dsh-mcp-manager ~/.dsh/profiles/web/node_modules/dsh-mcp-manager
dsh web --patch /path/to/dsh-mcp-manager/cordis.patch.yml
```

### Option 3: Cordis config

```yaml
- insert:
    - id: mcp-manager
      name: 'dsh-mcp-manager'
```

### Verify

Open Settings → Plugins — an **MCP Manager** card should appear. In chat, `mcp_list_connections` should respond.

## Usage

### Add from UI

1. Settings → Plugins → MCP Manager → expand card
2. Choose HTTP or Stdio tab
3. HTTP: server name + URL (optional Bearer token)
4. Stdio: server name + full command (e.g. `npx -y @mozilla/firefox-devtools-mcp@latest`)
5. Click **Add** → auto-save → auto-test → tool list with progress bar

### Add from chat

> Add MCP connection `http://10.118.81.110:3100/mcp/openwrt` with name "openwrt"

AI calls `mcp_add_connection` — connection is immediately available and persisted.

### Test connections

Every connection has a **Test** button. HTTP tests in-browser; Stdio tests via server endpoint with download progress.

## File structure

```
dsh-mcp-manager/
├── index.js              # Server plugin: tools + HTTP endpoints + startup restore
├── lib/
│   ├── client.js         # Browser plugin: Settings UI card
│   ├── mcp-manager.js    # Runtime connection create/list/remove via ctx.loader
│   └── test-connection.js # One-shot connection test
├── cordis.patch.yml      # Cordis loader patch
└── package.json
```

## License

MIT