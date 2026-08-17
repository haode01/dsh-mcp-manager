/** Locale keys and bundles for the MCP Manager plugin card. */

export const en = {
  mcpManagerTitle: 'MCP Manager',
  mcpManagerDescription: 'Manage runtime MCP server connections.',
  mcpManagerServerName: 'Server name',
  mcpManagerServerNameHint: 'Unique namespace, e.g. "my-server". Tools appear as mcp__<name>__<tool>.',
  mcpManagerTransport: 'Transport',
  mcpManagerTransportHint: 'streamable-http for remote servers; stdio for local processes.',
  mcpManagerUrl: 'Server URL',
  mcpManagerUrlHint: 'MCP endpoint, e.g. http://10.0.0.1:3100/mcp/server',
  mcpManagerToken: 'Bearer token (optional)',
  mcpManagerTokenHint: 'Added as Authorization: Bearer <token>. Leave blank for no auth.',
  mcpManagerAdd: 'Add & Connect',
  mcpManagerAdding: 'Connecting…',
  mcpManagerAddFailed: 'Connection failed. Check the URL and token.',
  mcpManagerConnections: 'Active connections',
  mcpManagerNoConnections: 'No MCP connections. Add one above.',
  mcpManagerRemove: 'Remove',
}

export const zh = {
  mcpManagerTitle: 'MCP 管理器',
  mcpManagerDescription: '运行时管理 MCP 服务器连接。',
  mcpManagerServerName: '服务器名称',
  mcpManagerServerNameHint: '唯一命名空间，如 "my-server"。工具名称格式：mcp__<名称>__<工具>。',
  mcpManagerTransport: '传输方式',
  mcpManagerTransportHint: 'streamable-http 用于远程服务器；stdio 用于本地进程。',
  mcpManagerUrl: '服务器地址',
  mcpManagerUrlHint: 'MCP 接口地址，如 http://10.0.0.1:3100/mcp/server',
  mcpManagerToken: 'Bearer Token（可选）',
  mcpManagerTokenHint: '添加为 Authorization: Bearer <token>，留空表示无认证。',
  mcpManagerAdd: '添加并连接',
  mcpManagerAdding: '连接中…',
  mcpManagerAddFailed: '连接失败，请检查地址和 Token。',
  mcpManagerConnections: '当前连接',
  mcpManagerNoConnections: '暂无 MCP 连接，请在上方添加。',
  mcpManagerRemove: '移除',
}
