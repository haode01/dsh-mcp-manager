# dsh-mcp-manager

[中文](README.zh.md) | [English](README.md)

DeepSeek Harness 的 MCP 连接生命周期管理插件。

在 DSH Web GUI 的 Settings → Plugins 页面管理 MCP 服务器连接，也在对话中通过工具调用。所有变更持久化到 `~/.dsh/mcp-connections.json`，重启不丢失。

## 功能

| 功能 | UI（Settings → Plugins） | 对话（工具） |
|------|------------------------|--------------|
| 列出连接 | ✅ | `mcp_list_connections` |
| 添加连接（HTTP / stdio） | ✅ | `mcp_add_connection` |
| 删除连接 | ✅ | `mcp_remove_connection` |
| 测试连接 + 展示工具列表 | ✅ | `mcp_test_connection` |
| 持久化跨重启不丢失 | ✅（自动） | ✅（自动） |
| Stdio 自动下载 + 进度条 | ✅ | — |

## 架构

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

所有读写经过同一个 JSON 文件。UI 调 HTTP 端点；服务端工具写同一文件。启动时自动恢复连接。

## 安装

### 方式一：`dsh plugin add`（推荐）

```bash
dsh plugin --profile web add github:haode01/dsh-mcp-manager
```

安装到 `~/.dsh/profiles/web/`，自动加入 `cordis.yml` 作为 profile bundle 层。无需手动 symlink 或 `--patch`。

安装后重启 DSH：

```bash
dsh web
```

### 方式二：Git clone + symlink

```bash
git clone https://github.com/haode01/dsh-mcp-manager.git /path/to/dsh-mcp-manager
ln -s /path/to/dsh-mcp-manager ~/.dsh/profiles/web/node_modules/dsh-mcp-manager
dsh web --patch /path/to/dsh-mcp-manager/cordis.patch.yml
```

### 方式三：Cordis 配置引用

```yaml
- insert:
    - id: mcp-manager
      name: 'dsh-mcp-manager'
```

### 验证

启动 DSH 后打开 Settings → Plugins，应看到 **MCP Manager** 卡片。在对话中 `mcp_list_connections` 应返回结果（初始为空）。

## 使用

### UI 添加连接

1. Settings → Plugins → MCP Manager → 展开卡片
2. 选择 HTTP 或 Stdio tab
3. HTTP：填服务器名 + URL（可选 Bearer token）
4. Stdio：填服务器名 + 完整命令（如 `npx -y @mozilla/firefox-devtools-mcp@latest`）
5. 点 **Add** → 自动保存 → 自动测试 → 显示工具列表及进度条

### 对话中添加

> 帮我把 `http://10.118.81.110:3100/mcp/openwrt` 添加为 MCP 连接，名字用 "openwrt"

AI 调用 `mcp_add_connection` 工具，连接立即可用并持久化。

### 测试连接

已添加的连接上有 **Test** 按钮。HTTP 模式浏览器直连测试；Stdio 模式通过服务端 `/mcp-manager/test-stdio` 端点测试，显示下载进度条。

## 文件结构

```
dsh-mcp-manager/
├── index.js              # 服务端插件：工具 + HTTP 端点 + 启动恢复
├── lib/
│   ├── client.js         # 浏览器插件：Settings UI 卡片
│   ├── mcp-manager.js    # 运行时连接 create/list/remove（via ctx.loader）
│   └── test-connection.js # 临时连接测试
├── cordis.patch.yml      # Cordis loader patch
└── package.json
```

## License

MIT