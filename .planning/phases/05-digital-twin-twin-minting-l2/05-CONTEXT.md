# Context: Phase 05 - Digital Twin Minting (L2)

<domain>
Realizing the core value of LoopPass by minting Digital Twins for products on a low-cost, scalable Ethereum Layer 2 (Polygon, Base, or Immutable zkEVM). This phase focuses on the transition from private data ingestion to public (but privacy-preserving) on-chain identity.
</domain>

<decisions>
## Implementation Decisions

### Blockchain Infrastructure
- **D-17: Layer 2 Selection (Polygon/Base)**:
  - Select an Ethereum L2 for minting to ensure low gas fees and high throughput.
  - Implement a provider-agnostic `BlockchainService` to allow for switching networks if needed.

### Minting Strategy
- **D-18: Lazy-Minting Pattern**:
  - Implement lazy-minting (BCN-02) where the Digital Twin is created in the database immediately, but the on-chain transaction is deferred until the first consumer scan or transfer.
  - Reduces upfront costs for brands with millions of low-value items.

### On-Chain Identity
- **D-19: ERC-721/ERC-1155 Standard**:
  - Use industry-standard token interfaces for product representation.
  - Store the cryptographic hash (from Phase 4) in the token's metadata to link the physical product to its immutable audit trail.

### Scalability
- **D-20: Transaction Batching**:
  - Implement batching for on-chain transactions to further reduce gas costs and manage network congestion.
</decisions>

<pitfalls>
- **Gas Fee Volatility**: Even on L2, gas spikes can occur; implement a robust transaction manager with retries and dynamic fee estimation.
- **Private Key Security**: Securely manage the minting wallet's private keys using KMS or an encrypted vault.
- **Metadata Persistence**: Ensure that token metadata (including the data hash) is permanently accessible (e.g., via IPFS or a highly available API).
</pitfalls>
