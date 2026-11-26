import { Router, Request, Response } from 'express';
import { atlasEngine, ComplexityTier, ValueCategory } from '../engine/atlasEngine.js';

export const proofRouter = Router();
export const ledgerRouter = Router();
export const governanceRouter = Router();
export const analyticsRouter = Router();

// --- Proof Endpoints ---
proofRouter.post('/create', (req: Request, res: Response) => {
  try {
    const { creator_id, category, tier, hours, description } = req.body ?? {};
    if (!creator_id || !category || !tier || hours === undefined) {
      res.status(400).json({ error: 'Missing required fields: creator_id, category, tier, hours' });
      return;
    }
    const proof = atlasEngine.recognizeProof(
      String(creator_id),
      String(category) as ValueCategory,
      String(tier) as ComplexityTier,
      Number(hours),
      description ? String(description) : ''
    );
    res.json(proof);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid proof request' });
  }
});

proofRouter.get('/list', (_req: Request, res: Response) => {
  res.json({ proofs: atlasEngine.listProofs() });
});

proofRouter.get('/:proof_id', (req: Request, res: Response) => {
  const { proof_id } = req.params;
  const proof = atlasEngine.getProof(proof_id);
  if (proof) {
    res.json({
      ...proof,
      status: 'active',
      attestations: proof.attestation_count,
    });
    return;
  }
  res.json({ proof_id, status: 'active', attestations: 0 });
});

proofRouter.post('/:proof_id/attest', (req: Request, res: Response) => {
  const { proof_id } = req.params;
  const attester = String(req.query.attester ?? req.body?.attester ?? 'did:atlas:validator');
  const result = atlasEngine.attestProof(proof_id, attester);
  res.json(result);
});

// --- Ledger Endpoints ---
ledgerRouter.post('/mint', (req: Request, res: Response) => {
  const { proof_id, confidence = 0.9 } = req.body ?? {};
  if (!proof_id) {
    res.status(400).json({ error: 'proof_id is required' });
    return;
  }
  const result = atlasEngine.mintAtlas(String(proof_id), Number(confidence));
  res.json(result);
});

ledgerRouter.get('/balance/:address', (req: Request, res: Response) => {
  const { address } = req.params;
  res.json({
    address,
    balance: atlasEngine.getBalance(address),
  });
});

ledgerRouter.post('/transfer', (req: Request, res: Response) => {
  const { sender, recipient, amount } = req.body ?? {};
  if (!sender || !recipient || amount === undefined) {
    res.status(400).json({ error: 'sender, recipient, and amount are required' });
    return;
  }
  const ok = atlasEngine.transfer(String(sender), String(recipient), Number(amount));
  res.json({
    status: ok ? 'ok' : 'insufficient_funds',
    amount: Number(amount),
  });
});

// --- Governance Endpoints ---
governanceRouter.get('/proposals', (_req: Request, res: Response) => {
  res.json({ proposals: atlasEngine.listProposals() });
});

governanceRouter.post('/propose', (req: Request, res: Response) => {
  const title = String(req.query.title ?? req.body?.title ?? '');
  const description = String(req.query.description ?? req.body?.description ?? '');
  const proposer = String(req.query.proposer ?? req.body?.proposer ?? '');
  const category = String(req.query.category ?? req.body?.category ?? 'general');

  if (!title || !proposer) {
    res.status(400).json({ error: 'title and proposer are required' });
    return;
  }

  const prop = atlasEngine.createProposal(title, description, proposer, category);
  res.json({ proposal_id: prop.proposal_id, status: 'created', proposal: prop });
});

governanceRouter.post('/vote', (req: Request, res: Response) => {
  const { proposal_id, voter, voice_credits, approve } = req.body ?? {};
  if (!proposal_id || !voter || voice_credits === undefined || approve === undefined) {
    res.status(400).json({ error: 'proposal_id, voter, voice_credits, and approve are required' });
    return;
  }
  const ok = atlasEngine.voteProposal(
    String(proposal_id),
    String(voter),
    Number(voice_credits),
    Boolean(approve)
  );
  res.json({ status: ok ? 'voted' : 'vote_failed' });
});

// --- Analytics Endpoints ---
analyticsRouter.get('/network', (_req: Request, res: Response) => {
  res.json(atlasEngine.getNetworkStats());
});

analyticsRouter.get('/price', (_req: Request, res: Response) => {
  res.json(atlasEngine.getPriceFeed());
});

analyticsRouter.get('/dashboards', (_req: Request, res: Response) => {
  res.json({ dashboards: atlasEngine.getDashboards() });
});
