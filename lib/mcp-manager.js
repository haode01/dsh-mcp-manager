/**
 * Runtime MCP connection lifecycle management via ctx.loader.
 *
 * Provides create, list, and remove operations for mcp-client plugin instances.
 * Each mcp-client instance corresponds to one MCP server connection.
 *
 * @module dsh-mcp-manager/mcp-manager
 */

/**
 * Serializable representation of one managed MCP connection.
 *
 * @typedef {Object} McpConnectionInfo
 * @property {string} id - Loader entry id.
 * @property {string} serverName - User-assigned server name.
 * @property {string} transport - Transport type ('stdio' or 'streamable-http').
 * @property {string} [command] - Stdio command.
 * @property {string} [url] - Streamable HTTP URL.
 * @property {boolean} active - Whether the plugin fiber is active.
 * @property {boolean} disabled - Whether the entry is disabled.
 */

/**
 * Configuration for a new mcp-client instance.
 *
 * @typedef {Object} McpConnectionConfig
 * @property {string} serverName - Unique namespace for this server's tools.
 * @property {'stdio'|'streamable-http'} transport - Transport type.
 * @property {string} [command] - Executable (required for stdio).
 * @property {string[]} [args] - Command arguments (stdio).
 * @property {Object<string,string>} [env] - Extra env vars (stdio).
 * @property {string} [cwd] - Working directory (stdio).
 * @property {string} [url] - MCP endpoint URL (required for streamable-http).
 * @property {Object<string,string>} [headers] - Additional HTTP headers.
 * @property {number} [toolCallTimeoutMs] - Per-tool-call timeout (default 60000).
 * @property {boolean} [failOnStartupError] - Fail if initial connection fails (default false).
 */

/**
 * Build the mcp-client config object from the user-friendly form.
 *
 * @param {string} serverName
 * @param {McpConnectionConfig} cfg
 * @returns {Object} Config for @deepseek-ai/dsh-mcp-client
 */
function buildMcpClientConfig(serverName, cfg) {
  const base = {
    serverName,
    transport: cfg.transport,
    toolCallTimeoutMs: cfg.toolCallTimeoutMs ?? 60000,
    failOnStartupError: cfg.failOnStartupError ?? false,
  }

  if (cfg.transport === 'stdio') {
    base.command = cfg.command
    base.args = cfg.args ?? []
    base.env = cfg.env ?? {}
    if (cfg.cwd) base.cwd = cfg.cwd
  } else {
    base.url = cfg.url
    base.headers = cfg.headers ?? {}
  }

  return base
}

/**
 * Determine whether a loader entry is an mcp-client instance.
 *
 * @param {{options: {name: string, config?: any}}} entry
 * @returns {boolean}
 */
function isMcpClientEntry(entry) {
  const name = entry.options.name
  if (name === '@deepseek-ai/dsh-mcp-client') return true
  return false
}

/**
 * Extract the serverName from an mcp-client entry's config.
 *
 * @param {{options: {config?: any}}} entry
 * @returns {string|undefined}
 */
function getServerName(entry) {
  const config = entry.options.config ?? {}
  return config.serverName
}

/**
 * List all active mcp-client connections visible through the loader.
 *
 * @param {Object} ctx - Cordis context (must have loader service).
 * @returns {McpConnectionInfo[]}
 */
export function listConnections(ctx) {
  const connections = []

  for (const entry of ctx.loader.entries()) {
    if (!isMcpClientEntry(entry)) continue
    const serverName = getServerName(entry)
    if (!serverName) continue

    const config = entry.options.config ?? {}
    connections.push({
      id: String(entry.options.id ?? ''),
      serverName: String(serverName),
      transport: String(config.transport ?? 'unknown'),
      command: config.command ? String(config.command) : '',
      url: config.url ? String(config.url) : '',
      active: entry.fiber !== undefined ? true : false,
      disabled: entry.disabled ? true : false,
    })
  }

  return connections
}

/**
 * Add a new mcp-client connection dynamically.
 *
 * @param {Object} ctx - Cordis context (must have loader service).
 * @param {McpConnectionConfig} cfg - Connection configuration.
 * @returns {Promise<string>} The created loader entry id.
 * @throws If creation fails (e.g. duplicate serverName).
 */
export async function addConnection(ctx, cfg) {
  const id = `mcp-${cfg.serverName.replace(/[^A-Za-z0-9_-]/g, '_')}`
  return await ctx.loader.create({
    id,
    name: '@deepseek-ai/dsh-mcp-client',
    config: buildMcpClientConfig(cfg.serverName, cfg),
  })
}

/**
 * Remove an mcp-client connection by its serverName.
 *
 * @param {Object} ctx - Cordis context (must have loader service).
 * @param {string} serverName - The serverName to remove.
 * @returns {Promise<boolean>} true if found and removed, false if not found.
 * @throws If removal fails.
 */
export async function removeConnection(ctx, serverName) {
  for (const entry of ctx.loader.entries()) {
    if (!isMcpClientEntry(entry)) continue
    if (getServerName(entry) === serverName) {
      await ctx.loader.remove(entry.id)
      return true
    }
  }
  return false
}