# Roadmap: LoopPass

## Phases

- [ ] **Phase 1: Battery Regulation Foundation** - Core data model and validation for Feb 2025 Battery deadline.
- [ ] **Phase 2: High-Scale Ingestion Engine** - REST API and asynchronous processing for supplier data.
- [ ] **Phase 3: Enterprise Integration Suite** - Batch uploads and ERP/PLM integration patterns.
- [ ] **Phase 4: Immutable Audit Trail & Privacy Vault** - Secure private storage and cryptographic hashing.
- [ ] **Phase 5: Digital Twin Minting (L2)** - High-volume, low-cost L2 blockchain infrastructure.
- [ ] **Phase 6: GS1 Product Identity & Resolution** - Global interoperability via GS1 Digital Link.
- [ ] **Phase 7: Consumer Scanning & Provenance** - Mobile-responsive history and authenticity view.
- [ ] **Phase 8: Sustainability Scorecard** - Visualizing carbon impact and material composition.
- [ ] **Phase 9: Sector Extension: Fashion & Electronics** - Multi-tier traceability for textiles and BOM for electronics.
- [ ] **Phase 10: Circularity & Recycler Portal** - Closing the loop with recycler tools and status updates.

## Phase Details

### Phase 1: Battery Regulation Foundation
**Goal**: Establish the core compliance engine for the Feb 2025 Battery deadline.
**Depends on**: Nothing
**Requirements**: COM-01, COM-03
**Success Criteria**:
  1. System validates incoming battery data against Feb 2025 carbon declaration standards.
  2. Data schemas are strictly validated using JSON-LD for regulatory compliance.
**Plans**: 4 plans
- [ ] 01-01-PLAN.md — Foundation & Battery Data Models
- [ ] 01-02-PLAN.md — Validation Engine
- [ ] 01-03-PLAN.md — Carbon Calculation Engine
- [ ] 01-04-PLAN.md — API & Verification

### Phase 2: High-Scale Ingestion Engine
**Goal**: Enable brands to push massive volumes of supplier data asynchronously.
**Depends on**: Phase 1
**Requirements**: ING-01, ING-05
**Success Criteria**:
  1. Brand-agnostic REST API accepts multi-tier supplier data (materials, carbon, origin).
  2. System handles bursts of 1,000+ webhooks per second via BullMQ without data loss.
**Plans**: TBD

### Phase 3: Enterprise Integration Suite
**Goal**: Streamline data onboarding from legacy ERP and Fashion PLM systems.
**Depends on**: Phase 2
**Requirements**: ING-02, ING-03, ING-04
**Success Criteria**:
  1. User can batch-upload product data via CSV/JSON for bulk initialization.
  2. Verified connection patterns for SAP BTP/S4HANA and Centric PLM successfully map external data to LoopPass schemas.
**Plans**: TBD

### Phase 4: Immutable Audit Trail & Privacy Vault
**Goal**: Secure sensitive enterprise data while maintaining a verifiable audit trail.
**Depends on**: Phase 1
**Requirements**: BCN-04, BCN-05
**Success Criteria**:
  1. Sensitive material data is encrypted and stored in a private PostgreSQL vault.
  2. Cryptographic hashes of private data are generated for eventual on-chain anchoring.
  3. Every data change creates an immutable audit trail entry.
**Plans**: TBD

### Phase 5: Digital Twin Minting (L2)
**Goal**: Efficiently mint millions of product twins on a low-cost Ethereum Layer 2.
**Depends on**: Phase 4
**Requirements**: BCN-01, BCN-02
**Success Criteria**:
  1. Digital Twins are minted on a selected L2 (Base/Polygon) with minimal gas costs.
  2. Lazy-minting allows product IDs to be created instantly, with on-chain minting deferred until first scan or sale.
**Plans**: TBD

### Phase 6: GS1 Product Identity & Resolution
**Goal**: Ensure global interoperability using the GS1 Digital Link standard.
**Depends on**: Phase 5
**Requirements**: BCN-03
**Success Criteria**:
  1. System generates GS1 Digital Link-compliant URIs for every product.
  2. A public resolver redirects product URIs to the appropriate consumer or business view.
**Plans**: TBD

### Phase 7: Consumer Scanning & Provenance
**Goal**: Allow consumers to verify product history and authenticity via mobile scan.
**Depends on**: Phase 6
**Requirements**: UX-01, UX-03
**Success Criteria**:
  1. Consumer can scan a QR code and view the product's full history in a mobile PWA.
  2. The provenance timeline accurately reflects all recorded lifecycle events.
**Plans**: TBD
**UI hint**: yes

### Phase 8: Sustainability Scorecard
**Goal**: Provide transparent, easy-to-understand sustainability metrics to consumers.
**Depends on**: Phase 7
**Requirements**: UX-02
**Success Criteria**:
  1. Consumer can view a "Sustainability Scorecard" detailing carbon impact and material composition.
  2. Metrics are visually presented in a "Wow" experience to build brand trust.
**Plans**: TBD
**UI hint**: yes

### Phase 9: Sector Extension: Fashion & Electronics
**Goal**: Support specialized traceability requirements for textiles and electronic goods.
**Depends on**: Phase 1
**Requirements**: COM-02
**Success Criteria**:
  1. System supports multi-tier (Tier 1-4) fashion traceability schemas.
  2. Bill of Materials (BOM) schemas for electronics are validated and stored.
**Plans**: TBD

### Phase 10: Circularity & Recycler Portal
**Goal**: Close the product loop by enabling recyclers to update product status.
**Depends on**: Phase 9, Phase 6
**Requirements**: UX-04, UX-05
**Success Criteria**:
  1. Authenticated recyclers can view disassembly guides and REACH/RoHS substance lists.
  2. Recycler can "Mark as Recycled", triggering an on-chain state change for the Digital Twin.
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Battery Regulation Foundation | 4/4 | Completed | 2026-03-31 |
| 2. High-Scale Ingestion Engine | 2/2 | Completed | 2026-03-31 |
| 3. Enterprise Integration Suite | 2/2 | Completed | 2026-03-31 |
| 4. Immutable Audit Trail & Privacy Vault | 1/1 | Completed | 2026-03-31 |
| 5. Digital Twin Minting (L2) | 1/1 | Completed | 2026-03-31 |
| 6. GS1 Product Identity & Resolution | 0/1 | Not started | - |
| 7. Consumer Scanning & Provenance | 0/1 | Not started | - |
| 8. Sustainability Scorecard | 0/1 | Not started | - |
| 9. Sector Extension: Fashion & Electronics | 0/1 | Not started | - |
| 10. Circularity & Recycler Portal | 0/1 | Not started | - |
