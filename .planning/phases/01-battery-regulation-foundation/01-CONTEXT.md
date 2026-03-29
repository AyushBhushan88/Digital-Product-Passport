# Phase 1: Battery Regulation Foundation - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Establishing the core compliance engine for the Feb 2025 Battery Regulation deadline, focusing on data validation, JSON-LD schemas, and carbon calculation logic.

</domain>

<decisions>
## Implementation Decisions

### Validation Strictness
- **D-01:** Implement a layered validation approach:
  - Reject all non-compliant critical fields with an error message.
  - Flag less critical fields for manual review.
  - Accept compliant data as much as possible while flagging/rejecting specific fields.

### JSON-LD Structure
- **D-02:** Adopt a hybrid JSON-LD structure:
  - Use a combination of custom and standard (e.g., Schema.org) ontologies for maximum flexibility and compliance.

### Carbon Calculation Logic
- **D-03:** Implement a comprehensive carbon calculation engine:
  - Support for the EU-mandated formula as the foundational requirement.
  - Provide an enhanced version with additional sustainability metrics for advanced manufacturers.
  - Enable multiple models tailored to specific battery types (e.g., LFP vs. NCM) or manufacturer-specific needs.

### Privacy vs. Audit Trail
- **D-04:** Use a Private Data Vault + On-chain Hash pattern:
  - Store full material/carbon data in a private PostgreSQL database.
  - Anchor cryptographic hashes on the hybrid blockchain (Ethereum L2) for a tamper-proof audit trail.

### Claude's Discretion
- Downstream agents have discretion over the specific technical implementation of the validation engine and JSON-LD schema generation, provided they adhere to the captured decisions.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `REQUIRMENTS.md`: COM-01, COM-03
- `ROADMAP.md`: Phase 1 details
- `research/SUMMARY.md`: EU Battery Regulation findings (Feb 2025 deadline)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None. (Greenfield project)

### Established Patterns
- None. (Phase 1 establishes core patterns)

### Integration Points
- None. (Foundational phase)

</code_context>

<specifics>
## Specific Ideas
- The validation engine should be modular and easily extensible as new "Delegated Acts" are finalized.
- Carbon calculation logic should be isolated from the core compliance engine to allow for frequent updates.

</specifics>

<deferred>
## Deferred Ideas
- **ZKP-01**: Zero-Knowledge Proofs for material verification (planned for v2).
- **BMS-01**: Real-time integration with Battery Management Systems (BMS) for state-of-health tracking (planned for v2).

</deferred>

---

*Phase: 01-battery-regulation-foundation*
*Context gathered: 2026-03-29*
