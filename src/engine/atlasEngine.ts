import crypto from 'node:crypto';

export type ValueCategory =
  | 'SOLVED_PROBLEM'
  | 'CREATED_KNOWLEDGE'
  | 'BUILT_INFRASTRUCTURE'
  | 'HEALED_BIOLOGICAL'
  | 'PROTECTED_SYSTEMS'
  | 'OPTIMIZED_PROCESS'
  | 'CONNECTED_PEOPLE'
  | 'RESTORED_ECOLOGICAL'
  | 'ADVANCED_ART'
  | 'DISTRIBUTED_FAIRLY'
  | 'PREVENTED_HARM'
  | 'CREATED_BEAUTY';

export type ComplexityTier = 'micro' | 'small' | 'medium' | 'large' | 'massive' | 'planetary';

export const VALUE_CATEGORIES: Record<ValueCategory, { index: number; multiplier: number; verification: string }> = {
  SOLVED_PROBLEM: { index: 1, multiplier: 1.05, verification: 'Peer review' },
  CREATED_KNOWLEDGE: { index: 2, multiplier: 1.15, verification: 'Citations' },
  BUILT_INFRASTRUCTURE: { index: 3, multiplier: 1.05, verification: 'Code review' },
  HEALED_BIOLOGICAL: { index: 4, multiplier: 1.25, verification: 'Medical attestation' },
  PROTECTED_SYSTEMS: { index: 5, multiplier: 1.1, verification: 'Security audit' },
  OPTIMIZED_PROCESS: { index: 6, multiplier: 1.05, verification: 'Before/after metrics' },
  CONNECTED_PEOPLE: { index: 7, multiplier: 1.0, verification: 'Dual testimonial' },
  RESTORED_ECOLOGICAL: { index: 8, multiplier: 1.1, verification: 'Satellite/IoT' },
  ADVANCED_ART: { index: 9, multiplier: 1.0, verification: 'Public reception' },
  DISTRIBUTED_FAIRLY: { index: 10, multiplier: 1.05, verification: 'Independent audit' },
  PREVENTED_HARM: { index: 11, multiplier: 1.1, verification: 'Post-event assessment' },
  CREATED_BEAUTY: { index: 12, multiplier: 1.0, verification: 'User satisfaction' },
};

export const COMPLEXITY_TIERS: Record<ComplexityTier, number> = {
  micro: 1.0,
  small: 5.0,
  medium: 25.0,
  large: 125.0,
  massive: 625.0,
  planetary: 3125.0,
};

export interface ContributionProof {
  proof_id: string;
  creator_id: string;
  category: ValueCategory;
  tier: ComplexityTier;
  hours: number;
  description: string;
  attestation_count: number;
  attesters: string[];
  base_value: string;
  can_mint: boolean;
  timestamp: number;
}

export interface ATLASCoin {
  coin_id: string;
  proof_id: string;
  minted_for: string;
  value_basis: string;
  minted_amount: string;
  minting_timestamp: number;
  coin_hash: string;
}

export type ProposalStatus = 'draft' | 'active' | 'passed' | 'rejected' | 'executed';

export interface Proposal {
  proposal_id: string;
  title: string;
  description: string;
  proposer: string;
  category: string;
  created_at: number;
  start_time: number;
  end_time: number;
  status: ProposalStatus;
  votes_for: Record<string, number>;
  votes_against: Record<string, number>;
}

const GENESIS_SUPPLY = 1_000_000_000;
const HALVING_INTERVAL_SEC = 4 * 365 * 24 * 3600;
const VOTING_PERIOD_SEC = 7 * 86400;

class AtlasEngine {
  private proofs = new Map<string, ContributionProof>();
  private coins = new Map<string, ATLASCoin>();
  private balances = new Map<string, number>();
  private proposals = new Map<string, Proposal>();
  private voiceCredits = new Map<string, number>();
  private totalMinted = 0;
  private mintingStart = Date.now() / 1000;
  private valueEventsLastHour = 1337;
  private mintedToday = 15420.5;

  constructor() {
    // Seed initial testnet state
    this.balances.set('did:atlas:treasury', 500000);
    this.balances.set('did:atlas:alice', 1250);
    this.balances.set('did:atlas:bob', 840);

    const seedPropId = 'prop_genesis_01';
    const now = Date.now() / 1000;
    this.proposals.set(seedPropId, {
      proposal_id: seedPropId,
      title: 'Expand GAEA Satellite Oracle Coverage',
      description: 'Allocate treasury credits for real-time ecological restoration verification across equatorial basins.',
      proposer: 'did:atlas:alice',
      category: 'sustainability',
      created_at: now - 3600,
      start_time: now - 3600,
      end_time: now + VOTING_PERIOD_SEC,
      status: 'active',
      votes_for: { 'did:atlas:alice': 100, 'did:atlas:bob': 64 },
      votes_against: {},
    });
  }

  recognizeProof(
    creatorId: string,
    category: ValueCategory,
    tier: ComplexityTier,
    hours: number,
    description = ''
  ): ContributionProof {
    if (!(category in VALUE_CATEGORIES)) {
      throw new Error(`Invalid category: ${category}`);
    }
    if (!(tier in COMPLEXITY_TIERS)) {
      throw new Error(`Invalid tier: ${tier}`);
    }
    if (!Number.isFinite(hours) || hours <= 0) {
      throw new Error('hours must be a positive number');
    }

    const tierMultiplier = COMPLEXITY_TIERS[tier];
    const baseValue = (tierMultiplier * hours).toFixed(4);
    const proof: ContributionProof = {
      proof_id: crypto.randomUUID(),
      creator_id: creatorId,
      category,
      tier,
      hours: Number(hours.toFixed(2)),
      description,
      attestation_count: 0,
      attesters: [],
      base_value: baseValue,
      can_mint: false,
      timestamp: Date.now() / 1000,
    };

    this.proofs.set(proof.proof_id, proof);
    this.valueEventsLastHour += 1;
    return proof;
  }

  getProof(proofId: string): ContributionProof | null {
    return this.proofs.get(proofId) ?? null;
  }

  listProofs(): ContributionProof[] {
    return Array.from(this.proofs.values()).reverse();
  }

  attestProof(proofId: string, attester: string): { proof_id: string; attester: string; status: string; attestation_count: number; can_mint: boolean } {
    const existing = this.proofs.get(proofId);
    if (!existing) {
      return {
        proof_id: proofId,
        attester,
        status: 'attestation_submitted',
        attestation_count: 1,
        can_mint: false,
      };
    }

    if (!existing.attesters.includes(attester)) {
      existing.attesters.push(attester);
      existing.attestation_count = existing.attesters.length;
      existing.can_mint = existing.attestation_count >= 2;
    }

    return {
      proof_id: existing.proof_id,
      attester,
      status: 'attestation_submitted',
      attestation_count: existing.attestation_count,
      can_mint: existing.can_mint,
    };
  }

  currentReward(): number {
    const elapsed = Date.now() / 1000 - this.mintingStart;
    const halvings = Math.floor(elapsed / HALVING_INTERVAL_SEC);
    return 100 / Math.pow(2, halvings);
  }

  mintAtlas(proofId: string, confidence = 0.9): { proof_id: string; minted: string; amount: string; confidence: number; tx_hash: string } | { error: string } {
    const scaled = Number((this.currentReward() * confidence).toFixed(4));
    if (this.totalMinted + scaled > GENESIS_SUPPLY) {
      return { error: 'supply_exhausted' };
    }

    const proof = this.proofs.get(proofId);
    const recipient = proof ? proof.creator_id : 'did:atlas:testnet';
    const coinHash = crypto
      .createHash('sha256')
      .update(`${proofId}:${Date.now()}`)
      .digest('hex')
      .slice(0, 64);

    const coin: ATLASCoin = {
      coin_id: crypto.randomUUID(),
      proof_id: proofId,
      minted_for: recipient,
      value_basis: proof ? proof.base_value : '100.0000',
      minted_amount: scaled.toFixed(4),
      minting_timestamp: Date.now() / 1000,
      coin_hash: coinHash,
    };

    this.coins.set(coin.coin_id, coin);
    this.totalMinted += scaled;
    this.mintedToday += scaled;

    const currentBalance = this.balances.get(recipient) ?? 0;
    this.balances.set(recipient, Number((currentBalance + scaled).toFixed(4)));

    return {
      proof_id: proofId,
      minted: coin.minted_amount,
      amount: coin.minted_amount,
      confidence,
      tx_hash: `0x${coinHash}`,
    };
  }

  getBalance(address: string): string {
    return (this.balances.get(address) ?? 0).toFixed(4);
  }

  faucet(address: string): { address: string; amount: string; tx_hash: string; balance: string } {
    const amount = 1000;
    const current = this.balances.get(address) ?? 0;
    const next = Number((current + amount).toFixed(4));
    this.balances.set(address, next);
    const txHash = `0x${crypto.createHash('sha256').update(`faucet:${address}:${Date.now()}`).digest('hex').slice(0, 64)}`;
    return {
      address,
      amount: String(amount),
      tx_hash: txHash,
      balance: next.toFixed(4),
    };
  }

  transfer(sender: string, recipient: string, amount: number): boolean {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    const senderBal = this.balances.get(sender) ?? 0;
    if (senderBal < amount) return false;

    this.balances.set(sender, Number((senderBal - amount).toFixed(4)));
    const recBal = this.balances.get(recipient) ?? 0;
    this.balances.set(recipient, Number((recBal + amount).toFixed(4)));
    return true;
  }

  grantVoice(voter: string, credits: number): void {
    this.voiceCredits.set(voter, (this.voiceCredits.get(voter) ?? 0) + credits);
  }

  createProposal(title: string, description: string, proposer: string, category: string): Proposal {
    this.grantVoice(proposer, 200);
    const pid = crypto.createHash('sha256').update(`${proposer}:${title}:${Date.now()}`).digest('hex').slice(0, 16);
    const now = Date.now() / 1000;
    const proposal: Proposal = {
      proposal_id: pid,
      title,
      description,
      proposer,
      category,
      created_at: now,
      start_time: now,
      end_time: now + VOTING_PERIOD_SEC,
      status: 'active',
      votes_for: {},
      votes_against: {},
    };
    this.proposals.set(pid, proposal);
    return proposal;
  }

  voteProposal(proposalId: string, voter: string, voiceCredits: number, approve: boolean): boolean {
    const prop = this.proposals.get(proposalId);
    if (!prop || prop.status !== 'active') return false;
    if (Date.now() / 1000 > prop.end_time) return false;

    this.grantVoice(voter, voiceCredits + 100);
    const available = this.voiceCredits.get(voter) ?? 0;
    if (voiceCredits > available || voiceCredits <= 0) return false;

    this.voiceCredits.set(voter, available - voiceCredits);
    if (approve) {
      prop.votes_for[voter] = (prop.votes_for[voter] ?? 0) + voiceCredits;
    } else {
      prop.votes_against[voter] = (prop.votes_against[voter] ?? 0) + voiceCredits;
    }
    return true;
  }

  listProposals(): Array<Proposal & { quadratic_for: number; quadratic_against: number }> {
    return Array.from(this.proposals.values()).map((p) => {
      const qFor = Object.values(p.votes_for).reduce((acc, c) => acc + Math.floor(Math.sqrt(c)), 0);
      const qAgainst = Object.values(p.votes_against).reduce((acc, c) => acc + Math.floor(Math.sqrt(c)), 0);
      return { ...p, quadratic_for: qFor, quadratic_against: qAgainst };
    });
  }

  getNetworkStats() {
    return {
      peers: 42,
      mesh_health: 0.98,
      value_events_last_hour: this.valueEventsLastHour,
      atlas_minted_today: this.mintedToday.toFixed(4),
      top_categories: ['BUILT_INFRASTRUCTURE', 'CREATED_KNOWLEDGE', 'HEALED_BIOLOGICAL'] as ValueCategory[],
    };
  }

  getPriceFeed() {
    return {
      symbol: 'ATLAS/USDC',
      price: '1.0042',
      change_24h: '+0.42%',
      volume_24h: '2441900',
      market_cap: '1004200000',
    };
  }

  getDashboards() {
    return [
      { id: 'executive', name: 'Executive Overview', category: 'executive', widgets: 6 },
      { id: 'economic', name: 'Economic Engine', category: 'economic', widgets: 6 },
      { id: 'governance', name: 'Governance & DAO', category: 'governance', widgets: 6 },
      { id: 'network', name: 'Network & Mesh', category: 'network', widgets: 6 },
      { id: 'sustainability', name: 'Sustainability & Ecology', category: 'sustainability', widgets: 6 },
    ];
  }

  getPortalSections() {
    return [
      { section_id: 'getting_started', title: 'Getting Started', description: 'Quick start guides and installation', order: 1 },
      { section_id: 'api_reference', title: 'API Reference', description: 'Complete REST API documentation', order: 2 },
      { section_id: 'guides', title: 'Guides', description: 'Tutorials and walkthroughs', order: 3 },
      { section_id: 'playground', title: 'Playground', description: 'In-browser code execution', order: 4 },
      { section_id: 'sdks', title: 'SDKs', description: 'Client libraries for 4 languages', order: 5 },
      { section_id: 'architecture', title: 'Architecture', description: 'System design and diagrams', order: 6 },
      { section_id: 'community', title: 'Community', description: 'Examples, recipes, showcase', order: 7 },
    ];
  }
}

export const atlasEngine = new AtlasEngine();
