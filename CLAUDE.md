<!-- GSD:project-start source:PROJECT.md -->
## Project

**LoopPass**

LoopPass is a Compliance SaaS platform that enables brands in the textiles, electronics, and battery sectors to meet EU Digital Product Passport (DPP) regulations (ESPR). It mints unique digital twins (NFTs on a private/hybrid blockchain) for physical products at the point of manufacture, capturing their full lifecycle data.

**Core Value:** Providing a scalable, API-driven infrastructure for brands to achieve EU compliance while enhancing consumer trust and product resale value through verifiable authenticity and sustainability data.

### Constraints

- **Tech Stack**: Must support high-volume API requests and blockchain transactions.
- **Compliance**: Data fields must align with EU DPP regulatory standards.
- **Hybrid Chain**: Balancing data privacy with an immutable audit trail.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework (Middleware)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js / TypeScript | v20+ | Backend API | High-throughput, asynchronous I/O, vast ecosystem for ERP/Blockchain connectors. |
| NestJS | v10+ | Framework | Modular architecture, easy to test, enterprise-grade dependency injection. |
### Blockchain & Identity
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Ethereum L2 (Base / Polygon) | Current | Settlement Layer | Ultra-low gas fees (<$0.001) with EIP-4844; high security via Ethereum L1 anchoring. |
| ERC-721 / ERC-1155 | Standard | Digital Twins | Industry-standard NFT protocols for unique product identities. |
| W3C DIDs | v1.0 | Product Identity | Decentralized Identifiers allow for vendor-agnostic product identity management. |
### Database & Storage
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| PostgreSQL | v16 | System Meta-data | Relational data for system users, brands, and mapping rules. |
| IPFS (via Pinata) | Current | Public Metadata | Immutable, decentralized storage for the non-sensitive portion of the DPP. |
| Redis | v7 | Caching | Low-latency response for high-volume consumer scanning. |
### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| AWS / GCP | Cloud Provider | Hosting | Multi-region support for EU and Global supply chains. |
| Terraform / Pulumi | Current | IaC | Scalable, repeatable infrastructure deployment. |
## Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| GS1 Digital Link | Standard | Resolver | For mapping QR codes to the DPP registry in a standard-compliant way. |
| ethers.js / viem | Latest | Chain Interaction | Communicating with L2 smart contracts. |
| Prisma / TypeORM | Latest | Database ORM | Type-safe database operations. |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Blockchain | Ethereum L2 | Hyperledger Fabric | Fabric is fully private and lacks the "Trust Anchor" and consumer-facing ease of a public/hybrid L2. |
| Blockchain | Ethereum L2 | Ethereum L1 | Gas costs on L1 ($5-$50/mint) are prohibitive for high-volume consumer goods. |
| Storage | IPFS | S3 / Cloud Storage | Centralized storage lacks the immutability guarantees of the DPP "Digital Twin" concept. |
## Installation
# Core Dependencies
# Dev Dependencies
## Sources
- [Ethereum Dencun Upgrade Documentation](https://ethereum.org/en/developers/docs/upgrades/dencun/)
- [GS1 Digital Link Standard](https://www.gs1.org/standards/Digital-Link)
- [EU Digital Product Passport Technical Specifications (Cirpass)](https://cirpassproject.eu/)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
