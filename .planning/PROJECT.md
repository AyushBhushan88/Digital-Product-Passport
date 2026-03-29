# LoopPass

## What This Is

LoopPass is a Compliance SaaS platform that enables brands in the textiles, electronics, and battery sectors to meet EU Digital Product Passport (DPP) regulations (ESPR). It mints unique digital twins (NFTs on a private/hybrid blockchain) for physical products at the point of manufacture, capturing their full lifecycle data.

## Core Value

Providing a scalable, API-driven infrastructure for brands to achieve EU compliance while enhancing consumer trust and product resale value through verifiable authenticity and sustainability data.

## Requirements

### Active

- [ ] **API-01**: Develop a generic, brand-agnostic API for supplier data ingestion (materials, carbon footprint).
- [ ] **API-02**: Implement initial patterns for SAP/Oracle and Fashion PLM (e.g., Centric) integration.
- [ ] **NFT-01**: Design a hybrid blockchain architecture for minting product Digital Twins.
- [ ] **UI-01**: Create a mobile-responsive consumer interface for scanning QR/NFC to view product history.
- [ ] **UI-02**: Develop a consumer-facing "Wow" experience showcasing authenticity, sustainability, and circularity.
- [ ] **DPP-01**: Implement data fields for material composition, chemical safety, and disassembly instructions.
- [ ] **CIRC-01**: Create a status update mechanism for recyclers to mark items as "Recycled" on-chain.

### Out of Scope

- **Public Minting**: Minting on purely public, high-gas-fee chains (L1 Ethereum) in v1.
- **Direct-to-Consumer Marketplace**: A full-fledged resale platform (focusing on the *checker* instead).

## Context

- Target industries: Fashion (H&M/Zara scale), Electronics, and Battery producers.
- Regulatory driver: EU Ecodesign for Sustainable Products Regulation (ESPR) by 2027.
- High-volume scalability is critical due to the scale of target brands.

## Constraints

- **Tech Stack**: Must support high-volume API requests and blockchain transactions.
- **Compliance**: Data fields must align with EU DPP regulatory standards.
- **Hybrid Chain**: Balancing data privacy with an immutable audit trail.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Consumer-First | Brands need to prove value to customers immediately while complying. | — Pending |
| API/ERP-First | Scalability for high-volume brands (H&M/Zara scale). | — Pending |
| Hybrid Blockchain | Balancing regulatory audit needs with corporate data privacy. | — Pending |

---
*Last updated: 2026-03-29 after initial questioning*
