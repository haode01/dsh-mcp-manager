# MCP Manager — 运行时管理 MCP 服务器连接

你作为智能助手，可以通过 `mcp_*` 系列工具来管理 MCP 服务器连接的生命周期。

## 何时使用

- **排查连接问题**: 使用 `mcp_test_connection` 测试某个 MCP 服务器是否可以连接
- **发现工具**: 测试连接后，你可以了解该服务器提供哪些工具
- **添加服务器**: 确认可用后，使用 `mcp_add_connection` 永久添加该服务器
- **清理**: 不再需要的服务器用 `mcp_remove_connection` 移除
- **查看状态**: 用 `mcp_list_connections` 查看当前所有配置

## 工作流

### 添加一个新的 MCP 服务器

1. 先测试连接: `mcp_test_connection` → 确认服务器可达
2. 如果测试成功，添加: `mcp_add_connection` → 相同的参数
3. 验证: `mcp_list_connections` → 确认新连接处于 active 状态

### 移除一个 MCP 服务器

1. 列出: `mcp_list_connections` → 找到 serverName
2. 移除: `mcp_remove_connection` → 传入 serverName
3. 确认: `mcp_list_connections` → 已移除

### 规则

- **serverName** 必须匹配 `[A-Za-z0-9_-]{1,32}`，且在已激活的连接中是唯一的
- 添加后，服务器工具立即可用，名称格式为 `mcp__<serverName>__<toolName>`
- 删除后，相关工具立即从模型中移除
- **没有持久化**: 通过 `mcp_add_connection` 添加的连接存在内存中；Host 重启后需要重新添加（除非底层配置也写入了 cordis.yml）
- 管理工具本身 **不会** 修改 `cordis.yml` 或 `cordis.patch.yml` 文件

## 工具列表

| 工具 | 描述 |
|------|------|
| `mcp_list_connections` | 列出所有已配置的 MCP 连接 |
| `mcp_add_connection` | 动态添加一个新的 MCP 连接 |
| `mcp_remove_connection` | 移除一个 MCP 连接 |
| `mcp_test_connection` | 临时连接并列出工具，不持久化 |