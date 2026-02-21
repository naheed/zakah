/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    registerAppResource,
    RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";

// ---------------------------------------------------------------------------
// Widget Template URIs
// ---------------------------------------------------------------------------
export const WIDGET_URI = "ui://zakatflow/calculator-widget.html";

// ---------------------------------------------------------------------------
// Placeholder HTML widget — will be replaced by apps/chatgpt-widget build output
// ---------------------------------------------------------------------------
const WIDGET_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZakatFlow Calculator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1a1a2e;
      background: transparent;
      padding: 16px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .header h2 { font-size: 18px; font-weight: 600; }
    .badge {
      font-size: 12px; font-weight: 500;
      padding: 4px 10px; border-radius: 999px;
      background: #e8f5e9; color: #2e7d32;
    }
    .badge.warning { background: #fff3e0; color: #e65100; }
    .amount { font-size: 32px; font-weight: 700; color: #1a1a2e; margin: 8px 0; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin: 16px 0; }
    .detail-item { display: flex; justify-content: space-between; font-size: 14px; }
    .detail-label { color: #64748b; }
    .detail-value { font-weight: 500; }
    .divider { border-top: 1px solid #e2e8f0; margin: 16px 0; }
    .cta {
      display: block; width: 100%; padding: 12px;
      background: #1a1a2e; color: white;
      border: none; border-radius: 8px;
      font-size: 14px; font-weight: 500;
      cursor: pointer; text-align: center; text-decoration: none;
    }
    .cta:hover { background: #2d2d4e; }
    .disclaimer { font-size: 11px; color: #94a3b8; margin-top: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="card" id="result-card">
    <div class="header">
      <h2>Zakat Calculation</h2>
      <span class="badge" id="methodology-badge">Loading...</span>
    </div>
    <div id="amount-display" class="amount">—</div>
    <div id="nisab-status" style="font-size:13px; color:#64748b;">Checking nisab...</div>
    <div class="divider"></div>
    <div class="detail-grid" id="breakdown"></div>
    <div class="divider"></div>
    <a class="cta" id="report-link" href="#" target="_blank">View Full Report on ZakatFlow.org</a>
    <p class="disclaimer">
      ZakatFlow provides calculations, not fatwas. Consult a qualified scholar for personal rulings.
    </p>
  </div>
  <script type="module">
    // MCP Apps bridge: listen for tool results
    window.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(typeof event.data === 'string' ? event.data : JSON.stringify(event.data));

        // Handle ui/notifications/tool-result
        if (msg.method === 'ui/notifications/tool-result' && msg.params?.result?.structuredContent) {
          renderResult(msg.params.result.structuredContent);
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    });

    function renderResult(data) {
      // Amount
      const amountEl = document.getElementById('amount-display');
      amountEl.textContent = '$' + Number(data.zakatDue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

      // Methodology badge
      const badge = document.getElementById('methodology-badge');
      badge.textContent = data.methodology || 'Standard';

      // Nisab status
      const nisab = document.getElementById('nisab-status');
      if (data.isAboveNisab) {
        nisab.textContent = 'Above Nisab threshold ($' + Number(data.nisab || 0).toLocaleString() + ')';
        badge.classList.remove('warning');
      } else {
        nisab.textContent = 'Below Nisab — no Zakat due';
        badge.classList.add('warning');
        badge.textContent = 'Below Nisab';
      }

      // Breakdown grid
      const grid = document.getElementById('breakdown');
      const items = [
        ['Total Assets', data.totalAssets],
        ['Deductible Liabilities', data.totalLiabilities],
        ['Net Zakatable Wealth', data.netZakatableWealth],
        ['Nisab Threshold', data.nisab],
      ].filter(([, v]) => v !== undefined);

      grid.innerHTML = items.map(([label, value]) =>
        '<div class="detail-item"><span class="detail-label">' + label +
        '</span><span class="detail-value">$' +
        Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 }) +
        '</span></div>'
      ).join('');

      // Deep-link CTA
      if (data.reportLink) {
        document.getElementById('report-link').href = data.reportLink;
      }
    }
  </script>
</body>
</html>`;

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

/**
 * Registers the ZakatFlow calculator widget template as an MCP App resource.
 * This template is referenced by tools via _meta.ui.resourceUri.
 *
 * @param server - McpServer instance to register the resource on
 */
export function registerWidgetTemplate(server: McpServer) {
    registerAppResource(
        server,
        "ZakatFlow Calculator Widget",
        WIDGET_URI,
        {
            description: "Interactive Zakat calculation result card rendered inside ChatGPT",
        },
        async () => ({
            contents: [
                {
                    uri: WIDGET_URI,
                    mimeType: RESOURCE_MIME_TYPE,
                    text: WIDGET_HTML,
                    _meta: {
                        ui: {
                            prefersBorder: true,
                        },
                    },
                },
            ],
        })
    );
}
