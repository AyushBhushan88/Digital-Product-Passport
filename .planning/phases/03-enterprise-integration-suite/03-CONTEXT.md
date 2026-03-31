# Context: Phase 03 - Enterprise Integration Suite

<domain>
Streamlining the onboarding of large volumes of product data from legacy enterprise systems (ERP, PLM). This phase focuses on bulk processing and standardized mapping patterns to reduce integration friction for large brands.
</domain>

<decisions>
## Implementation Decisions

### Bulk Processing
- **D-09: CSV/JSON Batch Processing**:
  - Implement a multipart file upload endpoint for bulk data initialization.
  - Files will be parsed into individual `RawEvent` records and processed asynchronously via BullMQ.

### Enterprise Connectors
- **D-10: Standardized ERP Mapping (SAP/Oracle)**:
  - Create standardized "Connector Schemas" that map typical SAP BTP or Oracle SCM exports to LoopPass's internal data model.
  - Use a strategy pattern for different connector types.

### PLM Integration
- **D-11: Fashion PLM Adapters (Centric)**:
  - Implement specialized mapping for Fashion-specific PLM systems like Centric.
  - Support multi-tier material composition and origin mapping (ING-04).

### Scalability
- **D-12: Stream-Based File Parsing**:
  - Use streaming parsers for large CSV/JSON files to maintain low memory overhead during bulk uploads.
</decisions>

<pitfalls>
- **Memory Overhead**: Parsing 100MB+ CSV files in memory can crash the service; streaming is essential.
- **Mapping Fragility**: ERP exports vary; mapping must be flexible and provide clear error messages for invalid rows.
</pitfalls>
