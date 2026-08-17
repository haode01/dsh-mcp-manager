/**
 * Temporary MCP connection test utility.
 * Connects to an MCP server (stdio or streamable-http), lists its tools,
 * then cleanly disconnects — without registering anything on ctx.tools.
 *
 * Used by the `mcp_test_connection` tool for non-destructive validation.
 *
 * @module dsh-mcp-manager/test-connection
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

/**
 * Test connection configuration — a subset of mcp-client's config
 * used only for ephemeral connect-and-list validation.
 *
 * @typedef {Object} McpTestConfig
 * @property {'stdio'|'streamable-http'} transport - Transport type.
 * @property {string} [command] - Executable for stdio transport.
 * @property {string[]} [args] - Arguments for stdio transport.
 * @property {Object<string,string>} [env] - Extra env vars for stdio transport.
 * @property {string} [url] - URL for streamable-http transport.
 * @property {Object<string,string>} [headers] - HTTP headers for streamable-http.
 * @property {number} [toolCallTimeoutMs] - Per-tool-call timeout (default 15000).
 */

/**
 * Test result from a test-connection run.
 *
 * @typedef {Object} McpTestResult
 * @property {boolean} success - Whether the connection and tool listing succeeded.
 * @property {number} toolCount - Number of tools discovered.
 * @property {Array<{name: string, description: string, parameterCount: number}>} tools - Tool list.
 * @property {string} [error] - Error message when success is false.
 */

/**
 * Connect to an MCP server as a one-shot test, list its tools, and disconnect.
 *
 * @param {McpTestConfig} config - Connection parameters.
 * @returns {Promise<McpTestResult>} Test result.
 */
export async function testConnection(config) {
  const client = new Client(
    { name: 'dsh-mcp-tester', version: '0.1.0' },
    { capabilities: {} },
  )

  let transport

  switch (config.transport) {
    case 'stdio': {
      if (!config.command) {
        return { success: false, toolCount: 0, tools: [], error: 'stdio transport requires "command"' }
      }
      transport = new StdioClientTransport({
        command: config.command,
        args: config.args ?? [],
        env: config.env ?? {},
        stderr: 'pipe',
      })
      break
    }
    case 'streamable-http': {
      if (!config.url) {
        return { success: false, toolCount: 0, tools: [], error: 'streamable-http transport requires "url"' }
      }
      transport = new StreamableHTTPClientTransport(new URL(config.url), {
        headers: config.headers ?? {},
      })
      break
    }
    default:
      return { success: false, toolCount: 0, tools: [], error: `Unsupported transport: ${config.transport}` }
  }

  try {
    await client.connect(transport)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    try { await client.close() } catch { /* suppress close error */ }
    return { success: false, toolCount: 0, tools: [], error: `Connection failed: ${msg}` }
  }

  let result
  try {
    result = await client.listTools()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    try { await client.close() } catch { /* suppress */ }
    return { success: false, toolCount: 0, tools: [], error: `listTools() failed: ${msg}` }
  }

  // Clean disconnect
  try { await client.close() } catch { /* suppress */ }

  const tools = (result.tools ?? []).map(tool => ({
    name: tool.name,
    description: (tool.description ?? '').slice(0, 200),
    parameterCount: typeof tool.inputSchema === 'object' && tool.inputSchema !== null
      ? Object.keys((tool.inputSchema).properties ?? {}).length
      : 0,
  }))

  return { success: true, toolCount: tools.length, tools }
}