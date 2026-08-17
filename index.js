/**
 * dsh-mcp-manager - MCP connection lifecycle management plugin
 *
 * Dual-role plugin:
 *   Node side: registers 4 tools + HTTP endpoint for UI persistence
 *   Browser side: client.js provides Settings → Plugins card
 *
 * @module dsh-mcp-manager
 */

import { defineTool } from '@deepseek-ai/dsh-tools'
import { listConnections, addConnection, removeConnection } from './lib/mcp-manager.js'
import { testConnection } from './lib/test-connection.js'

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

export const name = 'dsh-mcp-manager'
export const inject = ['tools', 'loader', 'webServer']

const CONNECTIONS_FILE = join(homedir(), '.dsh', 'mcp-connections.json')

function loadConnectionsFromDisk() {
  try {
    if (existsSync(CONNECTIONS_FILE)) {
      return JSON.parse(readFileSync(CONNECTIONS_FILE, 'utf-8'))
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
function restoreConnections(ctx, section) {
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

/**
 * Full reconcile: remove all, re-add all. Called on POST from UI.
 */
async function reconcileManagedConnections(ctx, section) {
  const current = listConnections(ctx)
  for (const conn of current) {
    try { await removeConnection(ctx, conn.serverName) } catch (_) {}
  }
  if (Array.isArray(section)) {
    restoreConnections(ctx, section)
  }
}

/** Normalize a connection config from UI/client format to mcpConfig. */
function normalizeConfig(cfg) {
  const mcpConfig = {
    serverName: cfg.serverName,
    transport: cfg.transport,
  }
  if (cfg.transport === 'stdio') {
    mcpConfig.command = cfg.command
    if (cfg.args) mcpConfig.args = cfg.args
    if (cfg.env) mcpConfig.env = cfg.env
    if (cfg.cwd) mcpConfig.cwd = cfg.cwd
  } else {
    mcpConfig.url = cfg.url
    if (cfg.token) mcpConfig.headers = { Authorization: `Bearer ${cfg.token}` }
  }
  if (cfg.timeout) mcpConfig.toolCallTimeoutMs = cfg.timeout
  return mcpConfig
}

export function apply(ctx) {
  // 1. Startup: restore from file
  restoreConnections(ctx, loadConnectionsFromDisk())

  // 2. HTTP endpoint — unified file read/write for the UI
  ctx.webServer.register({
    kind: 'exact',
    path: '/mcp-manager/connections',
    handler: async (req, res) => {
      try {
        if (req.method === 'GET') {
          // Return JSON array from file (strip transient keys for rendering)
          const conns = loadConnectionsFromDisk()
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(conns))
        } else if (req.method === 'POST') {
          // Body: { connections: [...] } — overwrite file + reconcile
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const payload = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
          if (!Array.isArray(payload?.connections)) {
            throw new Error('payload.connections must be an array')
          }
          // Strip transient UI keys before saving
          const clean = payload.connections.map(function(c) {
            const s = { serverName: c.serverName, transport: c.transport }
            if (c.url) s.url = c.url
            if (c.token) s.token = c.token
            if (c.command) s.command = c.command
            if (c.args) s.args = c.args
            if (c.env) s.env = c.env
            if (c.cwd) s.cwd = c.cwd
            if (c.timeout) s.timeout = c.timeout
            return s
          })
          saveConnectionsToDisk(clean)
          await reconcileManagedConnections(ctx, clean)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true, count: clean.length }))
        } else {
          res.writeHead(405)
          res.end('Method Not Allowed')
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: err.message }))
      }
    },
  })

  // ─── Tools ───

  // Tool 1: List connections
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

  // Tool 2: Add connection
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
      const cfg = normalizeConfig(args)
      try {
        await addConnection(ctx, cfg)
        const current = loadConnectionsFromDisk().filter(c => c.serverName !== cfg.serverName)
        const stored = { serverName: cfg.serverName, transport: cfg.transport }
        if (cfg.url) stored.url = cfg.url
        if (cfg.command) stored.command = cfg.command
        if (cfg.args) stored.args = cfg.args
        if (cfg.env) stored.env = cfg.env
        if (cfg.cwd) stored.cwd = cfg.cwd
        if (cfg.toolCallTimeoutMs) stored.timeout = cfg.toolCallTimeoutMs
        saveConnectionsToDisk([...current, stored])
        return { success: true, serverName: cfg.serverName, message: `Connection "${cfg.serverName}" added` }
      } catch (err) {
        return { success: false, serverName: cfg.serverName, message: err instanceof Error ? err.message : String(err) }
      }
    },
  }))

  // Tool 3: Remove connection
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
          saveConnectionsToDisk(loadConnectionsFromDisk().filter(c => c.serverName !== args.serverName))
          return { success: true, serverName: args.serverName, message: `Connection "${args.serverName}" removed` }
        }
        return { success: false, serverName: args.serverName, message: 'No connection found' }
      } catch (err) {
        return { success: false, serverName: args.serverName, message: err instanceof Error ? err.message : String(err) }
      }
    },
  }))

  // Tool 4: Test connection
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