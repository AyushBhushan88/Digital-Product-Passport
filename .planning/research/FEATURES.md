# Feature Landscape

**Domain:** Compliance SaaS (Digital Product Passport / ESPR)
**Researched:** 2024-05-22

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| QR/NFC Scanning | Standard interaction for product lookup. | Low | Must support GS1 Digital Link. |
| Material Composition | EU ESPR requirement for all sectors. | Medium | Requires mapping from PLM material libraries. |
| Carbon Footprint | Mandatory for EV batteries by Feb 2025. | High | Requires LCA calculation or ingestion. |
| Unique Digital Identity | EU requirement for item-level traceability. | Medium | Minting of unique NFTs/DIDs per unit. |
| Regulatory Dashboard | Brands need to see compliance status at a glance. | Medium | Reporting on missing data fields. |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Recycler Portal | Allows recyclers to mark items as "recycled," closing the loop. | Medium | Increases "Circularity Score" for the brand. |
| Resale Verification | Secure proof of authenticity for peer-to-peer resale. | Medium | Boosts product residual value. |
| Zero-Knowledge Proofs | Prove compliance (e.g., "recycled content >30%") without revealing suppliers. | High | Crucial for trade secret protection. |
| Repairability Score | "Right to Repair" focus for electronics. | Medium | Dynamic data based on repair history. |
| Consumer "Storytelling" | Branded, mobile-first UX for sustainability story. | Low | Marketing value beyond compliance. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Direct E-Commerce | Dilutes compliance focus, creates channel conflict. | Link to brand's own store. |
| L1 Public Minting | Prohibitively expensive gas fees for high-volume. | Use Ethereum L2 (Base/Polygon). |
| Manual Data Entry | Unscalable for high-volume brands (e.g., H&M). | Focus on API/ERP automated ingestion. |

## Feature Dependencies

```
Supplier Portal (Data) → Material Library (Mapping) → DPP (Product Passport)
Unique ID Generation → L2 Minting → Consumer Scan UI
```

## MVP Recommendation

Prioritize:
1. **Generic Supplier Ingestion API**: Get raw data into the system first.
2. **Battery Carbon Footprint Fields**: Address the Feb 2025 regulatory deadline.
3. **Item-Level L2 Minting**: Core "Digital Twin" functionality at scale.
4. **Basic QR Frontend**: Show compliance and authenticity data to consumers.

Defer: **Zero-Knowledge Proofs** (high complexity, can start with simpler permissioned access), **Full Resale Marketplace** (out of scope).

## Sources

- [ESPR (Ecodesign for Sustainable Products Regulation) Working Plan 2025-2030](https://ec.europa.eu/commission/presscorner/detail/en/ip_24_1740)
- [EU Battery Regulation (2023/1542)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1542)
