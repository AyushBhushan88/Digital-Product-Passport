# Requirements: LoopPass

**Defined:** 2026-03-29
**Core Value:** A scalable Compliance SaaS enabling brands to mint Digital Twins for products to meet EU regulatory standards (ESPR/DPP).

## v1 Requirements

### 1. Data Ingestion & Integration (ING)

- [ ] **ING-01**: Develop a generic, brand-agnostic REST API for supplier data ingestion (materials, carbon, origin).
- [ ] **ING-02**: Implement batch upload capability (CSV/JSON) for high-volume data ingestion.
- [ ] **ING-03**: Create pre-built patterns and connectors for SAP (BTP/S4HANA) and Oracle integration.
- [ ] **ING-04**: Develop mapping patterns for Fashion-specific PLM (Centric) systems.
- [ ] **ING-05**: Implement asynchronous data processing (BullMQ) to handle large volumes of supplier webhooks.

### 2. Digital Twin & Blockchain (BCN)

- [ ] **BCN-01**: Implement item-level Digital Twin minting on an Ethereum L2 (Polygon/Base/Immutable zkEVM).
- [ ] **BCN-02**: Develop a lazy-minting strategy to handle millions of products with zero upfront gas costs.
- [ ] **BCN-03**: Create a GS1 Digital Link-compliant URI generator and resolver for each product.
- [ ] **BCN-04**: Establish a cryptographic audit trail for material/carbon data to satisfy EU regulators.
- [ ] **BCN-05**: Implement a private data vault (PostgreSQL) linked to on-chain hashes for enterprise privacy.

### 3. Consumer & Recycler UX (UX)

- [ ] **UX-01**: Create a mobile-responsive PWA for consumer-facing QR/NFC scans.
- [ ] **UX-02**: Develop a "Sustainability Scorecard" view displaying material composition and carbon impact.
- [ ] **UX-03**: Implement a "Provenance Timeline" showcasing the product's full history and authenticity.
- [ ] **UX-04**: Provide an authenticated "Recycler View" for disassembly guides and substances of concern (REACH/RoHS).
- [ ] **UX-05**: Develop a functionality for recyclers to "Mark as Recycled" on-chain, updating the twin's status.

### 4. Sector-Specific Compliance (COM)

- [ ] **COM-01**: Implement the Feb 2025 EU Battery Regulation data model (Carbon declarations).
- [ ] **COM-02**: Develop material traceability schemas for Fashion (Tier 1-4) and Electronics (BOM).
- [ ] **COM-03**: Implement JSON-LD schema validation for all regulatory data fields.

## v2 Requirements (Deferred)

- **ZKP-01**: Zero-Knowledge Proofs for material verification without revealing supplier names.
- **BMS-01**: Real-time integration with Battery Management Systems (BMS) for state-of-health tracking.
- **DWR-01**: "Digital Wardrobe" for consumers to manage multiple product passports in one app.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Marketplace | Direct-to-consumer resale platform is not core to compliance. |
| Public Minting | High gas-fee L1 minting is not scalable for mass-market goods. |
| Hardware Mfg | LoopPass is a software middleware, not a manufacturer of tags/labels. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ING-01 | Phase 2 | Pending |
| ING-02 | Phase 3 | Pending |
| ING-03 | Phase 3 | Pending |
| ING-04 | Phase 3 | Pending |
| ING-05 | Phase 2 | Pending |
| BCN-01 | Phase 5 | Pending |
| BCN-02 | Phase 5 | Pending |
| BCN-03 | Phase 6 | Pending |
| BCN-04 | Phase 4 | Pending |
| BCN-05 | Phase 4 | Pending |
| UX-01 | Phase 7 | Pending |
| UX-02 | Phase 8 | Pending |
| UX-03 | Phase 7 | Pending |
| UX-04 | Phase 10 | Pending |
| UX-05 | Phase 10 | Pending |
| COM-01 | Phase 1 | Pending |
| COM-02 | Phase 9 | Pending |
| COM-03 | Phase 1 | Pending |

---
*Requirements defined: 2026-03-29*
