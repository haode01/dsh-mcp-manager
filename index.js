/**
 * dsh-mcp-manager - MCP connection lifecycle management plugin
 *
 * Dual-role plugin:
 *   Node side: registers 4 tools + settings namespace for persistence
 *   Browser side: client.js provides Settings → Plugins card
 *
 * @module dsh-mcp-manager
 */

import { defineTool } from '@deepseek-ai/dsh-tools'
import z from '@deepseek-ai/schemastery'
import { listConnections, addConnection, removeConnection } from './lib/mcp-manager.js'
import { testConnection } from './lib/test-connection.js'

export const name = 'dsh-mcp-manager'
export const inject = ['tools', 'loader']

// Schema for the mcp-manager settings namespace
const ConnectionConfig = z.array(z.object({
  serverName: z.string(),
  transport: z.union([z.const('stdio'), z.const('streamable-http')]),
  url: z.string().default(''),
  token: z.string().role('secret').default(''),
  command: z.string().default(''),
  args: z.array(z.string()).default([]),
  env: z.dict(z.string()).default({}),
  cwd: z.string().default(''),
  timeout: z.number().default(60000),
}))

// File-based persistence: read/write connections from disk directly
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const CONNECTIONS_FILE = join(homedir(), '.dsh', 'mcp-connections.json')

function loadConnectionsFromDisk() {
  try {
    if (existsSync(CONNECTIONS_FILE)) {
      const raw = readFileSync(CONNECTIONS_FILE, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (_) {}
  return []
}

function saveConnectionsToDisk(list) {
  try {
    writeFileSync(CONNECTIONS_FILE, JSON.stringify(list, null, 2), 'utf-8')
  } catch (_) {}
}

/**
 * Restore persisted connections from disk on startup.
 */
function restoreConnections(ctx) {
  const section = loadConnectionsFromDisk()
  if (!Array.isArray(section)) return

  for (const cfg of section) {
    if (!cfg.serverName || !cfg.transport) continue
    try {
      const mcpConfig = {
        serverName: cfg.serverName,
        transport: cfg.transport,
      }
      if (cfg.transport === 'stdio') {
        if (!cfg.command) continue
        mcpConfig.command = cfg.command
        if (cfg.args) mcpConfig.args = cfg.args
        if (cfg.env) mcpConfig.env = cfg.env
        if (cfg.cwd) mcpConfig.cwd = cfg.cwd
      } else {
        if (!cfg.url) continue
        mcpConfig.url = cfg.url
        if (cfg.token) mcpConfig.headers = { Authorization: `Bearer ${cfg.token}` }
      }
      if (cfg.timeout) mcpConfig.toolCallTimeoutMs = cfg.timeout
      addConnection(ctx, mcpConfig).catch(() => {})
    } catch (_) { /* skip bad entries */ }
  }
}

export function apply(ctx) {
  // Restore connections on startup
  restoreConnections(ctx)

  // Register settings namespace (best-effort)
  try {
    if (ctx.settings) {
      const scope = ctx.settings.register('mcp-manager', ConnectionConfig, {
        applies: 'live',
        base: [],
      })
      scope.watch(function() {
        reconcileManagedConnections(ctx, scope.get())
      })
    }
  } catch (e) { /* settings unavailable */ }

  // Poll disk for UI-added connections every 5 seconds
  let lastKnown = JSON.stringify(loadConnectionsFromDisk())
  const pollInterval = setInterval(function() {
    const current = JSON.stringify(loadConnectionsFromDisk())
    if (current !== lastKnown) {
      lastKnown = current
      const conns = JSON.parse(current)
      if (Array.isArray(conns) && conns.length > 0) {
        reconcileManagedConnections(ctx, conns)
      }
    }
  }, 5000)

  ctx.effect(function() {
    return function() { clearInterval(pollInterval); }
  }, 'mcp-manager: file-poll')

  // ---- Tool 1: List connections ----
  ctx.tools.register(defineTool({
    name: 'mcp_list_connections',
    description: 'List all currently configured MCP server connections and their status.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        properties: {
          connections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                serverName: { type: 'string' },
                transport: { type: 'string' },
                command: { type: 'string' },
                url: { type: 'string' },
                active: { type: 'boolean' },
                disabled: { type: 'boolean' },
              },
              additionalProperties: true,
            },
          },
        },
        additionalProperties: true,
      },
      render(_args, value) {
        const connections = value?.connections ?? []
        if (connections.length === 0) {
          return [{ type: 'text', text: 'No MCP server connections are currently configured.' }]
        }
        const lines = connections.map(c => {
          const endpoint = c.command || c.url || '(unknown)'
          const statusColor = c.disabled ? '⚪' : c.active ? '🟢' : '🔴'
          return `${statusColor} **${c.serverName}** (${c.transport}) — ${endpoint}`
        })
        return [{ type: 'text', text: `## MCP Connections (${connections.length})\n\n${lines.join('\n')}` }]
      },
    },
    async execute() {
      return { connections: listConnections(ctx) }
    },
  }))

  // ---- Tool 2: Add connection ----
  ctx.tools.register(defineTool({
    name: 'mcp_add_connection',
    description: 'Add a new MCP server connection at runtime. Supports stdio and streamable-http. Connection is immediately available and persisted.',
    parameters: {
      serverName: { type: 'string', required: true, description: 'Unique namespace. Tools become mcp__<serverName>__<toolName>.' },
      transport: { type: 'string', required: true, enum: ['stdio', 'streamable-http'] },
      command: { type: 'string', description: 'Executable command (required for stdio).' },
      args: { type: 'array', items: { type: 'string' } },
      env: { type: 'object', additionalProperties: true },
      cwd: { type: 'string' },
      url: { type: 'string', description: 'MCP endpoint URL (required for streamable-http).' },
      headers: { type: 'object', additionalProperties: true },
      toolCallTimeoutMs: { type: 'number' },
      failOnStartupError: { type: 'boolean' },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          serverName: { type: 'string' },
          message: { type: 'string' },
        },
        additionalProperties: true,
      },
      render(_args, value) {
        if (value?.success) return [{ type: 'text', text: `✅ MCP connection "${value.serverName}" added successfully.` }]
        return [{ type: 'text', text: `❌ Failed: ${value?.message ?? 'unknown error'}` }]
      },
    },
    async execute(args) {
      const cfg = { serverName: args.serverName, transport: args.transport }
      if (args.transport === 'stdio') {
        if (!args.command) throw new Error('stdio transport requires "command"')
        cfg.command = args.command
        if (args.args) cfg.args = args.args
        if (args.env) cfg.env = args.env
        if (args.cwd) cfg.cwd = args.cwd
      } else {
        if (!args.url) throw new Error('streamable-http transport requires "url"')
        cfg.url = args.url
        if (args.headers) cfg.headers = args.headers
      }
      if (args.toolCallTimeoutMs !== undefined) cfg.toolCallTimeoutMs = args.toolCallTimeoutMs
      if (args.failOnStartupError !== undefined) cfg.failOnStartupError = args.failOnStartupError

      try {
        await addConnection(ctx, cfg)
        // Persist: write to disk
        const current = loadConnectionsFromDisk()
        const stored = { serverName: cfg.serverName, transport: cfg.transport }
        if (cfg.url) stored.url = cfg.url
        if (cfg.command) stored.command = cfg.command
        if (cfg.args) stored.args = cfg.args
        if (cfg.env) stored.env = cfg.env
        if (cfg.cwd) stored.cwd = cfg.cwd
        if (cfg.toolCallTimeoutMs) stored.timeout = cfg.toolCallTimeoutMs
        const filtered = current.filter(c => c.serverName !== cfg.serverName)
        saveConnectionsToDisk([...filtered, stored])
        return { success: true, serverName: cfg.serverName, message: `Connection "${cfg.serverName}" added` }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        return { success: false, serverName: cfg.serverName, message: msg }
      }
    },
  }))

  // ---- Tool 3: Remove connection ----
  ctx.tools.register(defineTool({
    name: 'mcp_remove_connection',
    description: 'Remove a configured MCP server connection. All tools from that server are immediately unregistered.',
    parameters: {
      serverName: { type: 'string', required: true },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          serverName: { type: 'string' },
          message: { type: 'string' },
        },
        additionalProperties: true,
      },
      render(_args, value) {
        if (value?.success) return [{ type: 'text', text: `✅ MCP connection "${value.serverName}" removed.` }]
        return [{ type: 'text', text: `⚠️ No connection found with serverName "${value?.serverName ?? 'unknown'}".` }]
      },
    },
    async execute(args) {
      try {
        const removed = await removeConnection(ctx, args.serverName)
        if (removed) {
          // Persist: write to disk
          const current = loadConnectionsFromDisk().filter(c => c.serverName !== args.serverName)
          saveConnectionsToDisk(current)
          return { success: true, serverName: args.serverName, message: `Connection "${args.serverName}" removed` }
        }
        return { success: false, serverName: args.serverName, message: `No connection found` }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        return { success: false, serverName: args.serverName, message: msg }
      }
    },
  }))

  // ---- Tool 4: Test connection ----
  ctx.tools.register(defineTool({
    name: 'mcp_test_connection',
    description: 'Test-connect to an MCP server without persisting the connection.',
    parameters: {
      transport: { type: 'string', required: true, enum: ['stdio', 'streamable-http'] },
      command: { type: 'string' },
      args: { type: 'array', items: { type: 'string' } },
      env: { type: 'object', additionalProperties: true },
      url: { type: 'string' },
      headers: { type: 'object', additionalProperties: true },
      toolCallTimeoutMs: { type: 'number' },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          toolCount: { type: 'number' },
          tools: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                parameterCount: { type: 'number' },
              },
              additionalProperties: true,
            },
          },
          error: { type: 'string' },
        },
        additionalProperties: true,
      },
      render(_args, value) {
        if (value?.success) {
          if (value.toolCount === 0) return [{ type: 'text', text: '✅ Connected, but the server advertised no tools.' }]
          const list = value.tools.map(t => `  - **${t.name}** (${t.parameterCount} params): ${t.description?.slice(0, 120) ?? 'no description'}`)
          return [{ type: 'text', text: `✅ Test passed — ${value.toolCount} tools:\n\n${list.join('\n')}` }]
        }
        return [{ type: 'text', text: `❌ Test failed: ${value?.error ?? 'unknown error'}` }]
      },
    },
    async execute(args) {
      const testConfig = {
        transport: args.transport,
        toolCallTimeoutMs: args.toolCallTimeoutMs ?? 15_000,
      }
      if (args.transport === 'stdio') {
        if (!args.command) throw new Error('stdio transport requires "command"')
        testConfig.command = args.command
        if (args.args) testConfig.args = args.args
        if (args.env) testConfig.env = args.env
      } else {
        if (!args.url) throw new Error('streamable-http transport requires "url"')
        testConfig.url = args.url
        if (args.headers) testConfig.headers = args.headers
      }
      return await testConnection(testConfig)
    },
  }))
}

/** File-based persistence helpers above. */

/**
 * Reconcile: remove all mcp-manager-owned loader entries, re-add from settings.
 */
async function reconcileManagedConnections(ctx, section) {
  const current = listConnections(ctx)
  for (const conn of current) {
    try { await removeConnection(ctx, conn.serverName) } catch (_) {}
  }
  if (section && Array.isArray(section)) {
    for (const cfg of section) {
      if (!cfg.serverName || !cfg.transport) continue
      const mcpConfig = {
        serverName: cfg.serverName,
        transport: cfg.transport,
      }
      if (cfg.url) mcpConfig.url = cfg.url
      if (cfg.token) mcpConfig.headers = { Authorization: `Bearer ${cfg.token}` }
      if (cfg.command) mcpConfig.command = cfg.command
      if (cfg.args) mcpConfig.args = cfg.args
      if (cfg.env) mcpConfig.env = cfg.env
      if (cfg.cwd) mcpConfig.cwd = cfg.cwd
      if (cfg.timeout) mcpConfig.toolCallTimeoutMs = cfg.timeout
      try { await addConnection(ctx, mcpConfig) } catch (_) {}
    }
  }
}