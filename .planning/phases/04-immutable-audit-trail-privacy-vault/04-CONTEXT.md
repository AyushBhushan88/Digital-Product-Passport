# Context: Phase 04 - Immutable Audit Trail & Privacy Vault

<domain>
Securing enterprise data by implementing a cryptographic audit trail and a privacy-focused storage layer. This phase ensures that every data change is verifiable and that sensitive information is protected according to EU standards (ESPR/DPP).
</domain>

<decisions>
## Implementation Decisions

### Cryptographic Hashing
- **D-13: SHA-256 Payload Hashing**:
  - Generate a unique SHA-256 hash for every ingestion payload.
  - This hash serves as the "fingerprint" for the data, enabling eventually consistent on-chain verification without revealing the raw data (BCN-04).

### Audit Logging
- **D-14: Immutable Audit Log**:
  - Implement an `AuditLog` model in PostgreSQL to track every creation or modification of product data.
  - Each entry includes the actor, the change type, a timestamp, and the cryptographic hash of the new state.

### Data Privacy
- **D-15: Field-Level Encryption (Optional for v1)**:
  - Identify sensitive fields (e.g., specific supplier costs or names) for encryption.
  - Use a private PostgreSQL vault to store sensitive data linked to on-chain hashes (BCN-05).

### Verification
- **D-16: Automated Integrity Checks**:
  - Implement a mechanism to periodically verify the integrity of the audit log by re-hashing data and comparing it against recorded hashes.
</decisions>

<pitfalls>
- **Hashing Performance**: Large JSON payloads can be slow to hash; use efficient serialization before hashing.
- **Key Management**: If implementing encryption, secure key management (KMS/Vault) is critical to prevent data loss or exposure.
</pitfalls>
