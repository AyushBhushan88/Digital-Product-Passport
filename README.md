# LoopPass: EU Digital Product Passport (DPP) Compliance SaaS

LoopPass is a high-scale Compliance SaaS designed to help brands meet the EU Ecodesign for Sustainable Products Regulation (ESPR). It enables the creation of item-level Digital Twins with immutable provenance and sustainability metrics.

## Core Features

- **Multi-Sector Support**: Specialized schemas for Batteries (Feb 2025 Regulation), Fashion (Tier 1-4 traceability), and Electronics (BOM-level compliance).
- **High-Scale Ingestion**: Asynchronous processing engine powered by BullMQ and Redis, capable of handling massive supplier data bursts.
- **Immutable Audit Trail**: Cryptographic fingerprinting of all data changes, recorded in a private vault with on-chain anchoring.
- **GS1 Interoperability**: Automatic generation of GS1 Digital Link-compliant URIs and a public resolver for global product identity.
- **Consumer Transparency**: Mobile-responsive Passport view with a Provenance Timeline and Sustainability Scorecard (A-F grading).
- **Circularity & Recycling**: Dedicated Recycler Portal for accessing disassembly guides and marking products as "RECYCLED" on-chain.

## Technical Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ (Redis)
- **Blockchain**: Simulated L2 (Polygon/Base) for Digital Twin minting and lifecycle updates.
- **Standards**: JSON-LD, GS1 Digital Link.

## Development Roadmap (v1 Prototype)

All 10 phases of the initial roadmap have been successfully implemented:

1.  ✅ **Phase 1**: Battery Regulation Foundation & Core Data Models.
2.  ✅ **Phase 2**: High-Scale Async Ingestion Engine.
3.  ✅ **Phase 3**: Enterprise Integration Suite (SAP/PLM connectors).
4.  ✅ **Phase 4**: Immutable Audit Trail & Private Data Vault.
5.  ✅ **Phase 5**: Digital Twin Minting (L2 Simulation).
6.  ✅ **Phase 6**: GS1 Product Identity & Digital Link Resolution.
7.  ✅ **Phase 7**: Consumer Scanning & Provenance Timeline.
8.  ✅ **Phase 8**: Sustainability Scorecard (Carbon/Material grading).
9.  ✅ **Phase 9**: Sector Extension: Fashion & Electronics.
10. ✅ **Phase 10**: Circularity & Recycler Portal.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Redis (for BullMQ)
- PostgreSQL (for Prisma)

### Installation
```bash
$ npm install
```

### Running the App
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### Running Tests
```bash
$ npm run test
```

## License
MIT
