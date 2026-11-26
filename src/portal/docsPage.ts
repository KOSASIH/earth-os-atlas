export const docsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ATLAS — Earth OS | API & Developer Portal</title>
  <meta name="description" content="The Living Economic Operating System. Proof-of-Value > Proof-of-Work." />
  <style>
    :root {
      --bg: #0b0f17;
      --surface: #131a26;
      --border: #232d3f;
      --text: #e6edf3;
      --muted: #8b949e;
      --accent: #f59e0b;
      --green: #10b981;
      --blue: #3b82f6;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding: 20px 24px;
      background: var(--surface);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand h1 { margin: 0; font-size: 1.35rem; color: var(--accent); }
    .brand p { margin: 4px 0 0; font-size: 0.85rem; color: var(--muted); }
    .badge {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.78rem;
      background: rgba(16, 185, 129, 0.15);
      color: var(--green);
      border: 1px solid rgba(16, 185, 129, 0.35);
    }
    main { max-width: 1120px; margin: 0 auto; padding: 24px; display: grid; gap: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
    }
    .card h2 { margin: 0 0 12px; font-size: 1rem; color: var(--accent); }
    .kpi-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .kpi { flex: 1; min-width: 140px; background: var(--bg); padding: 12px; border-radius: 6px; border: 1px solid var(--border); }
    .kpi .label { font-size: 0.75rem; color: var(--muted); }
    .kpi .val { font-size: 1.15rem; font-weight: bold; margin-top: 4px; }
    label { display: block; font-size: 0.78rem; color: var(--muted); margin: 8px 0 4px; }
    input, select {
      width: 100%;
      padding: 8px 10px;
      border-radius: 5px;
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--text);
      font-family: inherit;
      font-size: 0.85rem;
    }
    button {
      margin-top: 12px;
      padding: 8px 14px;
      border-radius: 5px;
      border: 0;
      background: var(--accent);
      color: #0b0f17;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.85rem;
    }
    button.secondary { background: var(--blue); color: #fff; margin-left: 6px; }
    pre {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 12px;
      overflow-x: auto;
      font-size: 0.8rem;
      margin: 10px 0 0;
      max-height: 220px;
    }
    .endpoint { font-size: 0.82rem; padding: 6px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; gap: 8px; }
    .endpoint:last-child { border-bottom: 0; }
    .method { font-weight: bold; color: var(--green); min-width: 48px; display: inline-block; }
    .method.post { color: var(--accent); }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <h1>ATLAS — Earth OS v3.0.0</h1>
      <p>The Living Economic Operating System · Proof-of-Value &gt; Proof-of-Work</p>
    </div>
    <div class="badge" id="healthBadge">Checking node health...</div>
  </header>

  <main>
    <div class="card">
      <h2>Network &amp; Market Telemetry</h2>
      <div class="kpi-row">
        <div class="kpi"><div class="label">Mesh Peers</div><div class="val" id="kpiPeers">—</div></div>
        <div class="kpi"><div class="label">Mesh Health</div><div class="val" id="kpiHealth">—</div></div>
        <div class="kpi"><div class="label">Value Events / hr</div><div class="val" id="kpiEvents">—</div></div>
        <div class="kpi"><div class="label">ATLAS Minted Today</div><div class="val" id="kpiMinted">—</div></div>
        <div class="kpi"><div class="label">ATLAS / USDC</div><div class="val" id="kpiPrice">—</div></div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h2>1. Create Contribution Proof (HERMES)</h2>
        <label>Creator DID</label>
        <input id="proofCreator" value="did:atlas:alice" />
        <label>Value Category</label>
        <select id="proofCategory">
          <option value="CREATED_KNOWLEDGE">CREATED_KNOWLEDGE (1.15x)</option>
          <option value="BUILT_INFRASTRUCTURE">BUILT_INFRASTRUCTURE (1.05x)</option>
          <option value="HEALED_BIOLOGICAL">HEALED_BIOLOGICAL (1.25x)</option>
          <option value="RESTORED_ECOLOGICAL">RESTORED_ECOLOGICAL (1.10x)</option>
          <option value="SOLVED_PROBLEM">SOLVED_PROBLEM (1.05x)</option>
          <option value="PROTECTED_SYSTEMS">PROTECTED_SYSTEMS (1.10x)</option>
          <option value="OPTIMIZED_PROCESS">OPTIMIZED_PROCESS (1.05x)</option>
          <option value="CONNECTED_PEOPLE">CONNECTED_PEOPLE (1.00x)</option>
          <option value="ADVANCED_ART">ADVANCED_ART (1.00x)</option>
          <option value="DISTRIBUTED_FAIRLY">DISTRIBUTED_FAIRLY (1.05x)</option>
          <option value="PREVENTED_HARM">PREVENTED_HARM (1.10x)</option>
          <option value="CREATED_BEAUTY">CREATED_BEAUTY (1.00x)</option>
        </select>
        <label>Complexity Tier</label>
        <select id="proofTier">
          <option value="micro">micro (1x)</option>
          <option value="small">small (5x)</option>
          <option value="medium" selected>medium (25x)</option>
          <option value="large">large (125x)</option>
          <option value="massive">massive (625x)</option>
          <option value="planetary">planetary (3125x)</option>
        </select>
        <label>Hours</label>
        <input id="proofHours" type="number" step="0.5" value="8" />
        <label>Description</label>
        <input id="proofDesc" value="Verified Earth OS contribution" />
        <button onclick="createProof()">POST /v1/proof/create</button>
        <pre id="proofOut">Ready.</pre>
      </div>

      <div class="card">
        <h2>2. Mint &amp; Ledger State</h2>
        <label>Proof ID</label>
        <input id="mintProofId" placeholder="Create a proof first or paste proof_id" />
        <label>Confidence (0.0 - 1.0)</label>
        <input id="mintConfidence" type="number" step="0.05" value="0.9" />
        <button onclick="mintAtlas()">POST /v1/ledger/mint</button>
        <button class="secondary" onclick="checkBalance()">GET /v1/ledger/balance</button>
        <button class="secondary" onclick="faucet()">POST /faucet</button>
        <pre id="ledgerOut">Ready.</pre>
      </div>

      <div class="card">
        <h2>3. Governance DAO (Quadratic Voting)</h2>
        <label>Proposal Title</label>
        <input id="propTitle" value="Fund Regional Nanite Compute Node" />
        <label>Proposer DID</label>
        <input id="propProposer" value="did:atlas:alice" />
        <label>Category</label>
        <input id="propCategory" value="infrastructure" />
        <button onclick="createProposal()">POST /v1/dao/propose</button>
        <button class="secondary" onclick="loadProposals()">GET /v1/dao/proposals</button>
        <pre id="daoOut">Ready.</pre>
      </div>
    </div>

    <div class="card">
      <h2>REST API Reference</h2>
      <div class="endpoint"><span><span class="method">GET</span> /health</span><span>Node health check</span></div>
      <div class="endpoint"><span><span class="method post">POST</span> /v1/proof/create</span><span>Create contribution proof</span></div>
      <div class="endpoint"><span><span class="method">GET</span> /v1/proof/:proof_id</span><span>Get proof details</span></div>
      <div class="endpoint"><span><span class="method post">POST</span> /v1/proof/:proof_id/attest</span><span>Attest to a proof</span></div>
      <div class="endpoint"><span><span class="method post">POST</span> /v1/ledger/mint</span><span>Mint ATLAS from proof</span></div>
      <div class="endpoint"><span><span class="method">GET</span> /v1/ledger/balance/:address</span><span>Check ATLAS balance</span></div>
      <div class="endpoint"><span><span class="method post">POST</span> /v1/ledger/transfer</span><span>Transfer ATLAS tokens</span></div>
      <div class="endpoint"><span><span class="method post">POST</span> /v1/dao/propose</span><span>Create governance proposal</span></div>
      <div class="endpoint"><span><span class="method post">POST</span> /v1/dao/vote</span><span>Quadratic vote on proposal</span></div>
      <div class="endpoint"><span><span class="method">GET</span> /v1/analytics/network</span><span>Network statistics</span></div>
      <div class="endpoint"><span><span class="method">GET</span> /v1/analytics/price</span><span>ATLAS/USDC price feed</span></div>
      <div class="endpoint"><span><span class="method post">POST</span> /faucet</span><span>Testnet faucet (+1000 ATLAS)</span></div>
    </div>
  </main>

  <script>
    async function refreshStats() {
      try {
        const [health, net, price] = await Promise.all([
          fetch('/health').then(r => r.json()),
          fetch('/v1/analytics/network').then(r => r.json()),
          fetch('/v1/analytics/price').then(r => r.json())
        ]);
        document.getElementById('healthBadge').textContent = health.status.toUpperCase() + ' · ' + health.network;
        document.getElementById('kpiPeers').textContent = net.peers;
        document.getElementById('kpiHealth').textContent = (net.mesh_health * 100).toFixed(0) + '%';
        document.getElementById('kpiEvents').textContent = net.value_events_last_hour;
        document.getElementById('kpiMinted').textContent = net.atlas_minted_today;
        document.getElementById('kpiPrice').textContent = '$' + price.price + ' (' + price.change_24h + ')';
      } catch (e) {
        document.getElementById('healthBadge').textContent = 'Offline';
      }
    }

    async function createProof() {
      const res = await fetch('/v1/proof/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_id: document.getElementById('proofCreator').value,
          category: document.getElementById('proofCategory').value,
          tier: document.getElementById('proofTier').value,
          hours: Number(document.getElementById('proofHours').value),
          description: document.getElementById('proofDesc').value
        })
      });
      const data = await res.json();
      if (data.proof_id) document.getElementById('mintProofId').value = data.proof_id;
      document.getElementById('proofOut').textContent = JSON.stringify(data, null, 2);
      refreshStats();
    }

    async function mintAtlas() {
      const proofId = document.getElementById('mintProofId').value || 'demo-proof-1';
      const confidence = Number(document.getElementById('mintConfidence').value);
      const res = await fetch('/v1/ledger/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof_id: proofId, confidence })
      });
      document.getElementById('ledgerOut').textContent = JSON.stringify(await res.json(), null, 2);
      refreshStats();
    }

    async function checkBalance() {
      const addr = encodeURIComponent(document.getElementById('proofCreator').value);
      const res = await fetch('/v1/ledger/balance/' + addr);
      document.getElementById('ledgerOut').textContent = JSON.stringify(await res.json(), null, 2);
    }

    async function faucet() {
      const address = document.getElementById('proofCreator').value;
      const res = await fetch('/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      document.getElementById('ledgerOut').textContent = JSON.stringify(await res.json(), null, 2);
    }

    async function createProposal() {
      const res = await fetch('/v1/dao/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: document.getElementById('propTitle').value,
          description: 'Submitted via ATLAS Explorer',
          proposer: document.getElementById('propProposer').value,
          category: document.getElementById('propCategory').value
        })
      });
      document.getElementById('daoOut').textContent = JSON.stringify(await res.json(), null, 2);
    }

    async function loadProposals() {
      const res = await fetch('/v1/dao/proposals');
      document.getElementById('daoOut').textContent = JSON.stringify(await res.json(), null, 2);
    }

    refreshStats();
  </script>
</body>
</html>`;
