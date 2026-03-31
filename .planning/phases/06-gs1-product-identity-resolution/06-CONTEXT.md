# Context: Phase 06 - GS1 Product Identity & Resolution

<domain>
Ensuring global interoperability by adopting the GS1 Digital Link standard for product identification. This phase enables every Digital Twin to be represented by a standardized URI that can be resolved to different services (e.g., consumer transparency, business audit).
</domain>

<decisions>
## Implementation Decisions

### URI Generation
- **D-21: GS1 Digital Link Standard**:
  - Adopt the GS1 Digital Link URI syntax: `https://id.looppass.io/01/{GTIN}/21/{Serial}`.
  - Enables physical tags (QR/NFC) to be read by both standard web browsers and specialized supply chain apps.

### Resolver Service
- **D-22: Central URI Resolver**:
  - Implement a redirection service that parses GS1 identifiers and resolves them to the internal product registry or the L2 blockchain record.
  - Support multiple destination types based on user agents or query parameters (e.g., `?type=passport`).

### Interoperability
- **D-23: JSON-LD Support**:
  - Ensure the resolver can provide JSON-LD responses for machine-to-machine communication, facilitating data exchange with other DPP platforms.
</decisions>

<pitfalls>
- **URI Complexity**: Serial numbers can be long and complex; ensure the URI generator handles encoding correctly.
- **Redirection Latency**: The resolver is a high-traffic component; implement caching for resolved URIs to minimize latency.
- **GS1 Syntax Errors**: Strictly validate GTINs (14 digits) and Serial numbers to prevent resolution failures.
</pitfalls>
