window.__ModuleLoader__.load({
  id: "dsh-mcp-manager",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    var jsx = require("react/jsx-runtime");
    var React = require("react");

    // ── CSS ──
    var CSS_ID = "dsh-mcp-manager/styles.css";
    var CSS = [
      ".mc-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none;transition:border-color .16s,background .16s}",
      ".mc-card:hover{border-color:var(--dsw-alias-label-dimmed)}",
      ".mc-card.is-open{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}",
      ".mc-header{appearance:none;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:12px;align-items:center;gap:12px;padding:14px 16px;display:flex}",
      ".mc-header:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}",
      ".mc-head-text{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}",
      ".mc-name{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}",
      ".mc-desc{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}",
      ".mc-chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s;width:14px;height:14px}",
      ".mc-chevron.is-open{transform:rotate(180deg)}",
      ".mc-badge{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}",
      ".mc-badge.is-active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,transparent);color:var(--dsw-alias-brand-primary)}",
      ".mc-body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding-bottom:8px}",
      ".mc-sec{padding:16px 0 8px}",
      ".mc-sec+.mc-sec{border-top:1px solid var(--dsw-alias-border-l2)}",
      ".mc-sec-t{color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin:0 0 12px}",
      ".mc-field{margin-bottom:10px}",
      ".mc-field:last-child{margin-bottom:0}",
      ".mc-label{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:1.5;margin-bottom:5px;display:block}",
      ".mc-hint{color:var(--dsw-alias-label-tertiary);margin:4px 0 0;font-size:12px;line-height:1.5}",
      ".mc-input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;width:100%;box-sizing:border-box;transition:border-color .12s}",
      ".mc-input:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}",
      ".mc-input:disabled{opacity:.5;cursor:default}",
      ".mc-input.is-err{border-color:var(--dsw-alias-label-error)}",
      ".mc-textarea{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:8px 12px;font-size:13px;line-height:1.5;width:100%;box-sizing:border-box;resize:vertical;min-height:60px;transition:border-color .12s}",
      ".mc-textarea:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}",
      ".mc-textarea:disabled{opacity:.5;cursor:default}",
      ".mc-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
      ".mc-err{color:var(--dsw-alias-label-error);font-size:12px;margin:0}",
      ".mc-err-bann{color:var(--dsw-alias-label-error);font-size:12px;margin:6px 0 0;padding:6px 10px;border-radius:6px;background:color-mix(in srgb,var(--dsw-alias-label-error) 8%,transparent);line-height:1.5}",
      ".mc-tabs{display:flex;gap:2px;background:var(--dsw-alias-bg-layer-2);border-radius:9px;padding:3px;margin-bottom:14px}",
      ".mc-tab{flex:1;appearance:none;border:none;background:transparent;font:inherit;font-size:12px;font-weight:500;color:var(--dsw-alias-label-secondary);padding:5px 8px;border-radius:7px;cursor:pointer;transition:background .12s,color .12s;white-space:nowrap}",
      ".mc-tab.is-active{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);box-shadow:0 1px 3px rgba(0,0,0,.12)}",
      ".mc-footer{display:flex;align-items:center;gap:8px;padding:12px 0 4px;border-top:1px solid var(--dsw-alias-border-l2);margin-top:6px}",
      ".mc-btn{appearance:none;font:inherit;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:5px 14px;font-size:13px;line-height:1.5;transition:opacity .12s,background .12s,border-color .12s,color .12s;flex-shrink:0}",
      ".mc-btn:disabled{opacity:.4;cursor:default}",
      ".mc-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}",
      ".mc-btn-primary{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3)}",
      ".mc-btn-primary.is-loading{position:relative;color:transparent!important}",
      ".mc-btn-primary.is-loading::after{content:'';position:absolute;inset:50%;width:14px;height:14px;margin:-7px 0 0 -7px;border:2px solid transparent;border-top-color:var(--dsw-alias-bg-layer-3);border-radius:50%;animation:mc-spin .6s linear infinite}",
      "@keyframes mc-spin{to{transform:rotate(1turn)}}",
      ".mc-btn-ghost{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:transparent}",
      ".mc-btn-ghost:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed)}",
      ".mc-btn-test{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-brand-primary);background:transparent}",
      ".mc-btn-test:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-brand-primary) 8%,transparent);border-color:var(--dsw-alias-brand-primary)}",
      ".mc-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}",
      ".mc-item{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;overflow:hidden;background:var(--dsw-alias-bg-layer-3);transition:border-color .12s}",
      ".mc-item:hover{border-color:var(--dsw-alias-label-dimmed)}",
      ".mc-item.is-exp{border-color:var(--dsw-alias-label-dimmed);background:var(--dsw-alias-bg-layer-2)}",
      ".mc-item-top{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;user-select:none}",
      ".mc-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}",
      ".mc-dot.http{background:#22c55e}",
      ".mc-dot.stdio{background:#f59e0b}",
      ".mc-dot.testing{background:var(--dsw-alias-brand-primary);animation:mc-pulse 1s ease-in-out infinite}",
      "@keyframes mc-pulse{0%,100%{opacity:1}50%{opacity:.3}}",
      ".mc-item-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}",
      ".mc-item-name{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".mc-item-meta{font-size:11px;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;gap:5px;align-items:center}",
      ".mc-tag{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:4px;padding:1px 5px;font-size:10px;font-weight:600;flex-shrink:0;letter-spacing:.02em}",
      ".mc-tag.http{background:color-mix(in srgb,#22c55e 12%,transparent);color:#16a34a}",
      ".mc-tag.stdio{background:color-mix(in srgb,#f59e0b 12%,transparent);color:#d97706}",
      ".mc-tag.tools{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,transparent);color:var(--dsw-alias-brand-primary)}",
      ".mc-rmv{appearance:none;border:none;background:transparent;cursor:pointer;padding:4px 6px;border-radius:6px;color:var(--dsw-alias-label-tertiary);line-height:0;transition:color .12s,background .12s;flex-shrink:0}",
      ".mc-rmv:hover{color:var(--dsw-alias-label-error);background:color-mix(in srgb,var(--dsw-alias-label-error) 8%,transparent)}",
      ".mc-item-body{border-top:1px solid var(--dsw-alias-border-l2);padding:10px 12px}",
      ".mc-tool-count{font-size:13px;font-weight:500;color:var(--dsw-alias-label-primary);margin:0 0 8px}",
      ".mc-tools{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}",
      ".mc-tool-chip{font-size:11px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-module-platform);border-radius:5px;padding:2px 7px;white-space:nowrap;font-family:ui-monospace,'Cascadia Code','Source Code Pro',Menlo,Consolas,monospace}",
      ".mc-no-tools{font-size:12px;color:var(--dsw-alias-label-tertiary);margin:0}",
      ".mc-empty{color:var(--dsw-alias-label-tertiary);font-size:13px;margin:4px 0;text-align:center;padding:12px 0}",
      ".mc-note{display:flex;gap:8px;align-items:flex-start;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 6%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-brand-primary) 18%,transparent);border-radius:8px;padding:10px 12px;margin-top:12px}",
      ".mc-note p{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5;margin:0}",
    ].join("");

    if (typeof document !== "undefined" &&
        document.querySelector("style[data-plugin-css=" + JSON.stringify(CSS_ID) + "]") === null) {
      var st = document.createElement("style");
      st.dataset.plugin = "dsh-mcp-manager";
      st.dataset.pluginCss = CSS_ID;
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    // ── i18n ──
    var I18N = {
      en: {
        cardTitle: "MCP Connections",
        cardDesc: "Add, test, and manage MCP server connections.",
        badgeCount: function(n) { return n + " active"; },
        tabHttp: "Streamable HTTP",
        tabStdio: "Stdio (local)",
        secAdd: "Add connection",
        secList: "Connections",
        labelName: "Server name",
        hintName: "Unique ID — tools become mcp__<name>__<tool>",
        labelUrl: "Server URL",
        hintUrl: "MCP endpoint — e.g. http://10.0.0.1:3100/mcp/server",
        labelToken: "Bearer token",
        hintToken: "Optional — stored in session only",
        labelCmd: "Command",
        hintCmd: "Executable — e.g. npx, node, /usr/bin/python3",
        labelArgs: "Arguments",
        hintArgs: "One per line",
        labelEnv: "Environment variables",
        hintEnv: "KEY=VALUE — one per line",
        labelCwd: "Working dir",
        hintCwd: "Absolute path — blank for default",
        labelTimeout: "Timeout (ms)",
        hintTimeout: "Per-call timeout — default 60000",
        btnAdd: "Add",
        btnAdding: "Adding…",
        btnTest: "Test",
        btnTesting: "Testing…",
        btnRemove: "Remove",
        btnClearAll: "Clear all",
        errName: "Required — letters, digits, _ or - (max 32).",
        errUrl: "Server URL is required.",
        errCmd: "Command is required.",
        errTestTitle: "Connection failed",
        errTestNoTools: "Connected but no tools found.",
        toolsOf: "tools discovered",
        toolsN: "{n} tools",
        noToolsYet: "Not yet tested.",
        testHint: "Test the connection to discover available tools.",
        emptyList: "No connections yet. Add one above.",
        note: "Connections are session-scoped. Ask the AI to persist them to the config file.",
        expand: "Show settings",
        collapse: "Hide settings",
        expandItem: "Show tool list",
        collapseItem: "Hide tool list",
      },
      zh: {
        cardTitle: "MCP 连接管理",
        cardDesc: "添加、测试和管理 MCP 服务器连接。",
        badgeCount: function(n) { return n + " 个"; },
        tabHttp: "Streamable HTTP",
        tabStdio: "Stdio（本地）",
        secAdd: "添加连接",
        secList: "连接列表",
        labelName: "服务器名称",
        hintName: "唯一 ID — 工具名为 mcp__<名称>__<工具>",
        labelUrl: "服务器地址",
        hintUrl: "MCP 接口 — 如 http://10.0.0.1:3100/mcp/server",
        labelToken: "Bearer Token",
        hintToken: "可选 — 仅存于会话中",
        labelCmd: "可执行文件",
        hintCmd: "启动命令 — 如 npx、node、/usr/bin/python3",
        labelArgs: "参数",
        hintArgs: "每行一个",
        labelEnv: "环境变量",
        hintEnv: "KEY=VALUE — 每行一条",
        labelCwd: "工作目录",
        hintCwd: "绝对路径 — 留空使用默认",
        labelTimeout: "超时（毫秒）",
        hintTimeout: "单次调用超时 — 默认 60000",
        btnAdd: "添加",
        btnAdding: "添加中…",
        btnTest: "测试",
        btnTesting: "测试中…",
        btnRemove: "移除",
        btnClearAll: "清空全部",
        errName: "必填 — 只允许字母、数字、_ 或 -（最多 32 位）。",
        errUrl: "服务器地址不能为空。",
        errCmd: "可执行文件不能为空。",
        errTestTitle: "连接失败",
        errTestNoTools: "已连接但未找到工具。",
        toolsOf: "发现工具",
        toolsN: "{n} 个工具",
        noToolsYet: "尚未测试。",
        testHint: "点击测试按钮发现可用工具。",
        emptyList: "暂无连接，请在上方添加。",
        note: "连接为会话级别，重启后丢失。如需永久保存，请让 AI 写入配置文件。",
        expand: "展开设置",
        collapse: "收起设置",
        expandItem: "展开工具列表",
        collapseItem: "收起工具列表",
      },
    };

    function useLang() {
      try { return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en"; }
      catch (_) { return "en"; }
    }

    // ── Icons ──
    function IconChevron(props) {
      return jsx.jsx("svg", {
        className: "mc-chevron" + (props.open ? " is-open" : ""),
        width: 14, height: 14, viewBox: "0 0 14 14", fill: "none",
        children: jsx.jsx("path", {
          d: "M2.5 5L7 9.5L11.5 5", stroke: "currentColor", strokeWidth: 1.5,
          strokeLinecap: "round", strokeLinejoin: "round",
        }),
      });
    }

    function IconInfo() {
      return jsx.jsx("svg", {
        width: 14, height: 14, viewBox: "0 0 14 14", fill: "none",
        style: { flexShrink: 0, marginTop: 1, color: "var(--dsw-alias-brand-primary)" },
        children: jsx.jsxs("svg", { children: [
          jsx.jsx("circle", { cx: 7, cy: 7, r: 5.5, stroke: "currentColor", strokeWidth: 1.3 }),
          jsx.jsx("path", { d: "M7 6.5v3M7 4.5v.5", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" }),
        ]}),
      });
    }

    // ── Server backend (direct fetch to /mcp-manager/connections) ──
    var API_BASE = "/mcp-manager/connections";

    var pendingSave = null; // debounce timer for POST saves

    function loadFromServer() {
      return fetch(API_BASE).then(function(r) { return r.json(); }).catch(function() { return []; });
    }

    function saveToServer(connections) {
      // Strip transient UI keys before sending
      var clean = connections.map(function(c) {
        var s = { serverName: c.serverName, transport: c.transport };
        if (c.url) s.url = c.url;
        if (c.token) s.token = c.token;
        if (c.command) s.command = c.command;
        if (c.args) s.args = c.args;
        if (c.env) s.env = c.env;
        if (c.cwd) s.cwd = c.cwd;
        if (c.timeout) s.timeout = c.timeout;
        return s;
      });
      // Debounce: batch rapid changes into one request
      if (pendingSave) clearTimeout(pendingSave);
      pendingSave = setTimeout(function() {
        pendingSave = null;
        fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ connections: clean }),
        }).then(function(r) {
          if (!r.ok) console.error("mcp-manager: save failed", r.status);
        }).catch(function(err) {
          console.error("mcp-manager: save error", err);
        });
      }, 200);
    }

    // sessionStorage — fallback cache + transient state (test results)
    var STORAGE_KEY = "dsh-mcp-manager:v2";
    function loadStored() {
      try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]"); }
      catch (_) { return []; }
    }
    function saveStored(list) {
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (_) {}
    }

    // ── MCP protocol (browser fetch) ──
    function mcpCall(url, token, method, id, params) {
      params = params || {};
      var headers = { "Content-Type": "application/json", Accept: "application/json, text/event-stream" };
      if (token) headers.Authorization = "Bearer " + token;
      return fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ jsonrpc: "2.0", method: method, id: id, params: params }),
      }).then(function(r) { return r.json(); });
    }

    // ── Helpers ──
    var NAME_RE = /^[A-Za-z0-9_-]{1,32}$/;
    function parseLines(text) { return text.split("\n").map(function(l) { return l.trim(); }).filter(Boolean); }
    function parseEnv(text) {
      var out = {};
      parseLines(text).forEach(function(line) {
        var idx = line.indexOf("=");
        if (idx > 0) out[line.slice(0, idx).trim()] = line.slice(idx + 1);
      });
      return out;
    }
    var INIT_FIELDS = { name: "", url: "", token: "", cmd: "", args: "", env: "", cwd: "", timeout: "" };

    // ── Field ──
    function Field(props) {
      return jsx.jsxs("div", {
        className: "mc-field",
        children: [
          jsx.jsx("label", { className: "mc-label", htmlFor: props.id, children: props.label }),
          props.children,
          props.error
            ? jsx.jsx("p", { className: "mc-err", children: props.error })
            : props.hint ? jsx.jsx("p", { className: "mc-hint", children: props.hint }) : null,
        ],
      });
    }

    // ── Connection item (expandable, with Test + tool list) ──
    function ConnItem(props) {
      var c = props.conn; var t = props.t; var onUpdate = props.onUpdate;
      var isHttp = c.transport === "streamable-http";
      var cls = isHttp ? "http" : "stdio";
      var _exp = React.useState(false); var exp = _exp[0]; var setExp = _exp[1];
      var testing = c._testing === true;
      var testErr = c._testErr || "";
      var tools = c._tools; // undefined=not tested, []=empty, [...] = list

      function handleTest(e) {
        e.stopPropagation();
        var copy = Object.assign({}, c, { _testing: true, _testErr: "", _tools: undefined });
        onUpdate(copy);
        if (isHttp) {
          var url = c.url; var token = c.token || "";
          mcpCall(url, token, "initialize", 0, { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "dsh-mcp-manager", version: "0.1.0" } })
            .then(function(initR) {
              if (initR.error) throw new Error(initR.error.message || "Initialize failed");
              return mcpCall(url, token, "tools/list", 1, {});
            }).then(function(toolsR) {
              if (toolsR.error) throw new Error(toolsR.error.message || "tools/list failed");
              var tl = (toolsR.result && toolsR.result.tools) ? toolsR.result.tools : [];
              var names = tl.map(function(tool) { return tool.name; });
              var copy2 = Object.assign({}, copy, { _testing: false, _testErr: "", _tools: names });
              onUpdate(copy2);
            }).catch(function(err) {
              var copy2 = Object.assign({}, copy, { _testing: false, _testErr: err.message || "Connection failed", _tools: [] });
              onUpdate(copy2);
            });
        } else {
          var copy2 = Object.assign({}, copy, { _testing: false, _testErr: "Stdio endpoints cannot be tested from the browser.", _tools: [] });
          onUpdate(copy2);
        }
      }

      var hasTested = tools !== undefined;
      var toolCount = hasTested ? tools.length : 0;

      return jsx.jsxs("li", {
        className: "mc-item" + (exp ? " is-exp" : ""),
        children: [
          jsx.jsxs("div", {
            className: "mc-item-top",
            onClick: function() { setExp(!exp); },
            children: [
              jsx.jsx("span", { className: "mc-dot " + cls + (testing ? " testing" : "") }),
              jsx.jsxs("span", {
                className: "mc-item-info",
                children: [
                  jsx.jsx("span", { className: "mc-item-name", children: c.serverName }),
                  jsx.jsxs("span", {
                    className: "mc-item-meta",
                    children: [
                      jsx.jsx("span", { className: "mc-tag " + cls, children: isHttp ? "HTTP" : "stdio" }),
                      hasTested ? jsx.jsx("span", { className: "mc-tag tools", children: t.toolsN.replace("{n}", String(toolCount)) }) : null,
                      isHttp ? c.url : c.command,
                    ],
                  }),
                ],
              }),
              isHttp ? jsx.jsx("button", {
                type: "button",
                className: "mc-btn mc-btn-test",
                style: { fontSize: 12, padding: "3px 10px" },
                disabled: testing,
                onClick: handleTest,
                children: testing ? t.btnTesting : t.btnTest,
              }) : null,
              jsx.jsx("button", {
                type: "button",
                className: "mc-rmv",
                title: t.btnRemove,
                onClick: function(e) { e.stopPropagation(); props.onRemove(c.serverName); },
                children: jsx.jsx("svg", {
                  width: 14, height: 14, viewBox: "0 0 14 14", fill: "none",
                  children: jsx.jsx("path", {
                    d: "M2 3.5h10M5.5 3.5V2.5h3v1M3.5 3.5l.75 8h6l.75-8",
                    stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round",
                  }),
                }),
              }),
            ],
          }),
          exp ? jsx.jsx("div", {
            className: "mc-item-body",
            children: testErr
              ? jsx.jsx("p", { className: "mc-err-bann", children: t.errTestTitle + ": " + testErr })
              : hasTested
                ? toolCount > 0
                  ? jsx.jsxs(jsx.Fragment, { children: [
                      jsx.jsx("p", { className: "mc-tool-count", children: toolCount + " " + t.toolsOf }),
                      jsx.jsx("div", {
                        className: "mc-tools",
                        children: tools.map(function(name) {
                          return jsx.jsx("span", { className: "mc-tool-chip", children: "mcp__" + c.serverName + "__" + name }, name);
                        }),
                      }),
                    ]})
                  : jsx.jsx("p", { className: "mc-no-tools", children: t.errTestNoTools })
                : jsx.jsx("p", { className: "mc-no-tools", children: t.testHint }),
          }) : null,
        ],
      });
    }

    // ── Main card ──
    function McpManagerCard(props) {
      var lang = useLang(); var t = I18N[lang];
      var _open = React.useState(false); var open = _open[0]; var setOpen = _open[1];
      var _conns = React.useState(loadStored); var conns = _conns[0]; var setConns = _conns[1];

      // On mount: load connections from server
      React.useEffect(function() {
        loadFromServer().then(function(remote) {
          if (Array.isArray(remote) && remote.length > 0) {
            setConns(remote);
            saveStored(remote);
          }
        });
      }, []);
      var _trans = React.useState("streamable-http"); var transport = _trans[0]; var setTransport = _trans[1];
      var _fields = React.useState(INIT_FIELDS); var fields = _fields[0]; var setFields = _fields[1];
      var _errors = React.useState({}); var errors = _errors[0]; var setErrors = _errors[1];
      var _adding = React.useState(false); var adding = _adding[0]; var setAdding = _adding[1];

      function setField(k, v) {
        setFields(function(p) { var n = Object.assign({}, p); n[k] = v; return n; });
        setErrors(function(p) { var n = Object.assign({}, p); delete n[k]; return n; });
      }

      function updateConn(idx, conn) {
        setConns(function(list) { var next = list.slice(); next[idx] = conn; saveStored(next); return next; });
        // Note: test results (_tools, _testing) stay in sessionStorage only — not persisted to settings
      }

      function validate() {
        var errs = {};
        if (!NAME_RE.test(fields.name.trim())) errs.name = t.errName;
        if (transport === "streamable-http" && !fields.url.trim()) errs.url = t.errUrl;
        if (transport === "stdio" && !fields.cmd.trim()) errs.cmd = t.errCmd;
        setErrors(errs);
        return Object.keys(errs).length === 0;
      }

      function handleAdd() {
        if (!validate()) return;
        setAdding(true);
        var conn = { serverName: fields.name.trim(), transport: transport };
        if (transport === "streamable-http") {
          conn.url = fields.url.trim();
          if (fields.token.trim()) conn.token = fields.token.trim();
        } else {
          conn.command = fields.cmd.trim();
          var argLines = parseLines(fields.args);
          if (argLines.length) conn.args = argLines;
          var envMap = parseEnv(fields.env);
          if (Object.keys(envMap).length) conn.env = envMap;
          if (fields.cwd.trim()) conn.cwd = fields.cwd.trim();
          conn.timeout = parseInt(fields.timeout) || 60000;
        }
        var next = conns.concat([conn]);
        setConns(next); saveStored(next);
        saveToServer(next);
        setFields(INIT_FIELDS); setErrors({});
        setAdding(false);
      }

      function handleRemove(serverName) {
        var next = conns.filter(function(c) { return c.serverName !== serverName; });
        setConns(next); saveStored(next);
        saveToServer(next);
      }

      function handleClear() {
        setConns([]); saveStored([]);
        saveToServer([]);
      }

      var isHttp = transport === "streamable-http";
      var hasConns = conns.length > 0;

      return jsx.jsxs("li", {
        className: "mc-card" + (open ? " is-open" : ""),
        children: [
          jsx.jsxs("button", {
            type: "button", className: "mc-header", "aria-expanded": open,
            "aria-label": (open ? t.collapse : t.expand) + ": " + t.cardTitle,
            onClick: function() { setOpen(!open); },
            children: [
              jsx.jsxs("span", {
                className: "mc-head-text",
                children: [
                  jsx.jsx("span", { className: "mc-name", children: t.cardTitle }),
                  jsx.jsx("span", { className: "mc-desc", children: t.cardDesc }),
                ],
              }),
              hasConns ? jsx.jsx("span", { className: "mc-badge is-active", children: t.badgeCount(conns.length) }) : null,
              jsx.jsx(IconChevron, { open: open }),
            ],
          }),
          open ? jsx.jsx("div", {
            className: "mc-body",
            children: jsx.jsxs(jsx.Fragment, { children: [
              jsx.jsxs("div", {
                className: "mc-sec",
                children: [
                  jsx.jsx("p", { className: "mc-sec-t", children: t.secAdd }),
                  jsx.jsxs("div", {
                    className: "mc-tabs", role: "tablist",
                    children: [
                      jsx.jsx("button", { type: "button", role: "tab", className: "mc-tab" + (isHttp ? " is-active" : ""), "aria-selected": isHttp, onClick: function() { setTransport("streamable-http"); setErrors({}); }, children: t.tabHttp }),
                      jsx.jsx("button", { type: "button", role: "tab", className: "mc-tab" + (!isHttp ? " is-active" : ""), "aria-selected": !isHttp, onClick: function() { setTransport("stdio"); setErrors({}); }, children: t.tabStdio }),
                    ],
                  }),
                  jsx.jsx(Field, {
                    id: "mc-f-name", label: t.labelName, hint: t.hintName, error: errors.name,
                    children: jsx.jsx("input", { id: "mc-f-name", className: "mc-input" + (errors.name ? " is-err" : ""), type: "text", placeholder: "my-server", value: fields.name, disabled: adding, onChange: function(e) { setField("name", e.target.value); } }),
                  }),
                  isHttp ? jsx.jsxs(jsx.Fragment, { children: [
                    jsx.jsx(Field, {
                      id: "mc-f-url", label: t.labelUrl, hint: t.hintUrl, error: errors.url,
                      children: jsx.jsx("input", { id: "mc-f-url", className: "mc-input" + (errors.url ? " is-err" : ""), type: "text", placeholder: "http://10.0.0.1:3100/mcp/server", value: fields.url, disabled: adding, onChange: function(e) { setField("url", e.target.value); } }),
                    }),
                    jsx.jsx(Field, {
                      id: "mc-f-token", label: t.labelToken, hint: t.hintToken,
                      children: jsx.jsx("input", { id: "mc-f-token", className: "mc-input", type: "password", autoComplete: "off", value: fields.token, disabled: adding, onChange: function(e) { setField("token", e.target.value); } }),
                    }),
                  ]}) : null,
                  !isHttp ? jsx.jsxs(jsx.Fragment, { children: [
                    jsx.jsx(Field, {
                      id: "mc-f-cmd", label: t.labelCmd, hint: t.hintCmd, error: errors.cmd,
                      children: jsx.jsx("input", { id: "mc-f-cmd", className: "mc-input" + (errors.cmd ? " is-err" : ""), type: "text", placeholder: "npx", value: fields.cmd, disabled: adding, onChange: function(e) { setField("cmd", e.target.value); } }),
                    }),
                    jsx.jsx(Field, {
                      id: "mc-f-args", label: t.labelArgs, hint: t.hintArgs,
                      children: jsx.jsx("textarea", { id: "mc-f-args", className: "mc-textarea", placeholder: "-y\n@modelcontextprotocol/server-filesystem", value: fields.args, disabled: adding, onChange: function(e) { setField("args", e.target.value); } }),
                    }),
                    jsx.jsxs("div", { className: "mc-row2", children: [
                      jsx.jsx(Field, { id: "mc-f-cwd", label: t.labelCwd, hint: t.hintCwd, children: jsx.jsx("input", { id: "mc-f-cwd", className: "mc-input", type: "text", placeholder: "/home/arc", value: fields.cwd, disabled: adding, onChange: function(e) { setField("cwd", e.target.value); } }) }),
                      jsx.jsx(Field, { id: "mc-f-timeout", label: t.labelTimeout, hint: t.hintTimeout, children: jsx.jsx("input", { id: "mc-f-timeout", className: "mc-input", type: "text", inputMode: "numeric", placeholder: "60000", value: fields.timeout, disabled: adding, onChange: function(e) { setField("timeout", e.target.value); } }) }),
                    ]}),
                    jsx.jsx(Field, { id: "mc-f-env", label: t.labelEnv, hint: t.hintEnv, children: jsx.jsx("textarea", { id: "mc-f-env", className: "mc-textarea", placeholder: "NODE_ENV=production", value: fields.env, disabled: adding, onChange: function(e) { setField("env", e.target.value); } }) }),
                  ]}) : null,
                  jsx.jsx("div", { className: "mc-footer", children: jsx.jsx("button", { type: "button", className: "mc-btn mc-btn-primary", disabled: adding, onClick: handleAdd, children: adding ? t.btnAdding : t.btnAdd }) }),
                ],
              }),
              jsx.jsxs("div", {
                className: "mc-sec",
                children: [
                  jsx.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }, children: [
                    jsx.jsx("p", { className: "mc-sec-t", style: { margin: 0, flex: 1 }, children: t.secList }),
                    hasConns ? jsx.jsx("button", { type: "button", className: "mc-btn mc-btn-ghost", style: { fontSize: 12, padding: "3px 10px" }, onClick: handleClear, children: t.btnClearAll }) : null,
                  ]}),
                  hasConns
                    ? jsx.jsx("ul", { className: "mc-list", children: conns.map(function(c, i) { return jsx.jsx(ConnItem, { conn: c, t: t, onUpdate: function(nc) { updateConn(i, nc); }, onRemove: handleRemove }, c.serverName); }) })
                    : jsx.jsx("p", { className: "mc-empty", children: t.emptyList }),
                  jsx.jsxs("div", { className: "mc-note", children: [jsx.jsx(IconInfo, {}), jsx.jsx("p", { children: t.note })] }),
                ],
              }),
            ]}),
          }) : null,
        ],
      });
    }

    // ── Plugin entry ──
    exports.name = "dsh-mcp-manager/client";
    exports.inject = ["slots", "locale"];

    exports.apply = function apply(ctx) {
      var NS = "mcp-manager";
      ctx.effect(function() { return ctx.locale.register(NS, { en: I18N.en, zh: I18N.zh }); }, "dsh-mcp-manager: locale");

      ctx.slots.inject("settings.plugin.item", function() {
        return ctx.slots.register({ name: "settings.plugin.item", id: "mcp-manager", order: 100, locale: NS }, function() {
          return jsx.jsx(McpManagerCard, {});
        });
      });
    };

    return module.exports;
  }
});
