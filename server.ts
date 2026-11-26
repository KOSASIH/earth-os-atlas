import express from 'express';
import cors from 'cors';
import {
  analyticsRouter,
  governanceRouter,
  ledgerRouter,
  proofRouter,
} from './src/routes/apiRoutes.js';
import { atlasEngine } from './src/engine/atlasEngine.js';
import { docsHtml } from './src/portal/docsPage.js';

const PORT = 3000;
const HOST = '0.0.0.0';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Atlas-Key'],
    })
  );
  app.use(express.json());

  // Root & Docs Portal (analogous to FastAPI /docs + DeveloperPortal)
  app.get('/', (_req, res) => {
    res.type('html').send(docsHtml);
  });

  app.get('/docs', (_req, res) => {
    res.type('html').send(docsHtml);
  });

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      version: '3.0.0',
      network: process.env.ATLAS_NETWORK ? `atlas-${process.env.ATLAS_NETWORK}` : 'atlas-testnet',
    });
  });

  // Core Migrated API Routers
  app.use('/v1/proof', proofRouter);
  app.use('/v1/ledger', ledgerRouter);
  app.use('/v1/dao', governanceRouter);
  app.use('/v1/analytics', analyticsRouter);

  // Developer Portal & Testnet Faucet
  app.get('/v1/portal', (_req, res) => {
    res.json({ sections: atlasEngine.getPortalSections() });
  });

  app.post('/faucet', (req, res) => {
    const address = String(req.body?.address ?? '');
    if (!address) {
      res.status(400).json({ error: 'address is required' });
      return;
    }
    res.json(atlasEngine.faucet(address));
  });

  // Stub remaining un-migrated subsystems per migration guidelines
  app.all('/v1/titans/*', (_req, res) => {
    res.status(501).json({ error: 'Not yet migrated' });
  });
  app.all('/v1/mesh/*', (_req, res) => {
    res.status(501).json({ error: 'Not yet migrated' });
  });
  app.all('/v1/zkvm/*', (_req, res) => {
    res.status(501).json({ error: 'Not yet migrated' });
  });
  app.all('/v1/interplanetary/*', (_req, res) => {
    res.status(501).json({ error: 'Not yet migrated' });
  });
  app.all('/v1/justice/*', (_req, res) => {
    res.status(501).json({ error: 'Not yet migrated' });
  });

  return app;
}

const app = createApp();
app.listen(PORT, HOST, () => {
  console.log(`ATLAS — Earth OS server listening on http://${HOST}:${PORT}`);
});
