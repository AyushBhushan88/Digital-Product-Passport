# Context: Phase 10 - Circularity & Recycler Portal

## Goal
Close the product lifecycle loop by providing specialized tools for recyclers to access disassembly data and update the on-chain status of Digital Twins.

## Scope
- **Recycler Authentication**: Implement a simple, secure mechanism for recyclers to access sensitive disassembly and substance data.
- **Disassembly Guides (UX-04)**: Create a specialized view for recyclers to access REACH/RoHS substance lists and disassembly instructions.
- **Lifecycle Status Updates (UX-05)**: Enable recyclers to update the product's status (e.g., "RECYCLED", "DISMANTLED") on-chain.
- **Recycler Portal API**: Endpoints for status transitions and document retrieval.

## Requirements
- **UX-04**: Authenticated "Recycler View" for disassembly guides and substances of concern.
- **UX-05**: Functionality for recyclers to "Mark as Recycled" on-chain.

## Key Decisions (Planned)
- [ ] **Recycler Role Management (D-31)**: How to distinguish between consumers and authorized recyclers.
- [ ] **State Machine for Digital Twins (D-32)**: Defining valid status transitions (MINTED -> SOLD -> RECYCLED).

## Success Criteria
1. An authenticated recycler can view the disassembly guide for a specific product ID.
2. A recycler can successfully trigger a status update to "RECYCLED".
3. The "Provenance Timeline" accurately reflects the "RECYCLED" event and recycler metadata.
