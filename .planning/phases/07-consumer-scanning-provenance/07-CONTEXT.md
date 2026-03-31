# Context: Phase 07 - Consumer Scanning & Provenance

<domain>
Delivering the "Wow" experience to end consumers through a mobile-responsive web view (PWA) that displays the product's digital passport. This phase focuses on transparency and trust by visualizing the product's journey and immutable audit trail.
</domain>

<decisions>
## Implementation Decisions

### Mobile Experience
- **D-24: Mobile-Responsive Passport View**:
  - Implement a dedicated view for consumers, accessible via the GS1 Digital Link redirection.
  - Prioritize fast loading times and "above the fold" critical information (Model Name, Serial, Authenticity Status).

### Provenance Visualization
- **D-25: Provenance Timeline Component**:
  - Create a visual timeline showing key lifecycle events: Manufacturing, Ingestion, Minting, and (eventually) Recycling.
  - Pull data from the `AuditLog` and `Registry` to build the story of the product.

### Trust & Authenticity
- **D-26: On-Chain Verification Badge**:
  - Include a visual indicator that the product record is anchored on-chain.
  - Link to the L2 block explorer for technical users to verify the transaction.

### Tech Stack
- **D-27: NestJS Rendering (Server-Side)**:
  - For the initial prototype, use server-side rendering (EJS or similar) or simple static JSON responses that can be consumed by a generic frontend.
</decisions>

<pitfalls>
- **Information Overload**: Avoid cluttering the mobile view with too much technical data; use progressive disclosure (e.g., "See technical details" button).
- **Network Latency**: Ensure the provenance data is fetched efficiently to prevent slow page loads on mobile networks.
- **Visual Consistency**: Maintain brand identity across the passport view to build consumer trust.
</pitfalls>
