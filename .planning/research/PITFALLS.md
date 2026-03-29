# Domain Pitfalls

**Domain:** Compliance SaaS (Digital Product Passport / ESPR)
**Researched:** 2024-05-22

## Critical Pitfalls

Mistakes that cause rewrites or major regulatory issues.

### Pitfall 1: Multi-Tier Blindness
**What goes wrong:** Brands can't meet ESPR mandatory material disclosures because they don't know their Tier 2+ suppliers (e.g., the dye house for a shirt, or the source of cobalt in a battery).
**Why it happens:** Supply chains are notoriously opaque and transactional rather than transparent.
**Consequences:** The DPP is generated with "unknown" data, leading to customs delays or fines in the EU market.
**Prevention:** Implement a low-friction supplier portal or data ingestion API early, and use industry-standard material databases (e.g., Ecoinvent) for fallback estimates.

### Pitfall 2: EBOM/MBOM Misalignment
**What goes wrong:** The product passport data reflects the "as-designed" version from the PLM, not the "as-produced" version from the ERP.
**Why it happens:** In manufacturing, materials are often swapped based on availability (e.g., different grade of plastic used for a specific batch).
**Consequences:** Misleading sustainability data or incorrect chemical composition in the DPP, which can lead to "greenwashing" accusations or safety risks.
**Prevention:** Always use the ERP (MBOM) as the master of the "unit" and only pull design attributes (e.g., recyclability specs) from the PLM.

### Pitfall 3: Regulatory "Multi-Speed" Compliance
**What goes wrong:** Building a rigid architecture for Fashion that doesn't account for the stricter, dynamic requirements of the Battery Regulation.
**Why it happens:** ESPR is a framework; each sector has its own "Delegated Act" with unique fields (e.g., State of Health for batteries, microplastics for textiles).
**Consequences:** Expensive system rewrites when the next sector's rules are finalized.
**Prevention:** Use a flexible, schema-less (or semi-structured) metadata registry for DPP fields rather than fixed database columns.

## Moderate Pitfalls

### Pitfall 1: Data Carrier Durability
**What goes wrong:** The physical QR code or NFC tag becomes unreadable before the product reaches the end of its life (e.g., washed off a shirt or damaged in an electronic device).
**Prevention:** Research sector-specific physical carriers (woven labels for textiles, etched codes for batteries).

### Pitfall 2: Data Sovereignty & Localization
**What goes wrong:** Chinese or US suppliers refuse to push data to an EU-based blockchain registry due to local data security laws.
**Prevention:** Offer "Edge Ingestion" where data is validated locally before a hash/proof is sent to the EU registry.

## Minor Pitfalls

### Pitfall 1: "Greenwashing" Liability
**What goes wrong:** Brands use the DPP solely for marketing without verifying supplier claims.
**Prevention:** Include a "Verification Status" in the DPP (Self-Reported vs. 3rd Party Audited).

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1: Batteries | Dynamic State of Health (SoH) data | Integrate with IoT/BMS (Battery Management Systems) early. |
| Phase 2: ERP Sync | Serial-level scalability in SAP | Use a middleware buffer; don't try to force unique IDs into batch-oriented ERP fields. |
| Phase 3: Consumer UI | "QR Code Fatigue" | Ensure the UI provides immediate value (authenticity, resale) not just dry compliance data. |

## Sources

- [Circularise: Top 5 Challenges for DPP](https://www.circularise.com/digital-product-passport)
- [McKinsey: The Digital Product Passport and the future of fashion](https://www.mckinsey.com/industries/retail/our-insights/the-digital-product-passport)
- [EU Commission: Ecodesign for Sustainable Products Regulation (ESPR)](https://ec.europa.eu/commission/presscorner/detail/en/ip_22_2013)
