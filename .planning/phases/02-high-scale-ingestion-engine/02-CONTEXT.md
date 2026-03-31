# Context: Phase 02 - High-Scale Ingestion Engine

<domain>
Expanding the ingestion capabilities from unit-level battery data to brand-level bulk supplier data ingestion, focusing on high-volume, asynchronous processing for enterprise scalability (H&M/Zara scale).
</domain>

<decisions>
## Implementation Decisions

### API Structure
- **D-05: Brand-Agnostic Ingestion Endpoint**: 
  - Create a generic `/api/ingest/supplier-data` endpoint that accepts material, carbon, and origin data from multiple tiers.
  - Use flexible payloads that can be mapped to different product sectors (Fashion, Electronics).

### Asynchronous Processing
- **D-06: BullMQ for Background Processing**:
  - Offload heavy validation and calculation tasks to background workers.
  - Use Redis as the message broker to ensure no data loss during bursts of 1,000+ RPS.

### Data Model Mapping
- **D-07: Decoupled Ingestion & Registry**:
  - Ingested data is first stored as "Raw Events" before being processed into the canonical `BatteryPassport` or other sector-specific registries.
  - Enables auditability and reprocessing if logic changes.

### Scalability
- **D-08: Throttling & Rate Limiting**:
  - Implement per-brand rate limiting to protect the platform from spikes in supplier data pushes.
</decisions>

<pitfalls>
- **BullMQ Overload**: Ensure Redis is appropriately sized for high-volume jobs.
- **Data Mapping Complexity**: Brands have different ERP exports; the generic API must be flexible enough without being overly complex.
</pitfalls>
