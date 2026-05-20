# Sprint 2 - QA Activity Log with Core Findings and Fixes (PR-03)

**Compiled by:** Faith Dablo (M5 - QA/Docs)
**Sprint Period:** Sprint 2 Review Cycle

### Core Technical Findings and Fixes

During the consolidation of components for Sprint 2 review, the QA module identified and addressed critical system behaviors.

#### Finding 1: Path Resolution Defect (Relative Import Breakdown)
- **Problem:** Files located in nested directories (`src/components/modals/ProductModal.jsx`) experienced rendering faults due to brittle relative references.
- **Fix Applied:** Refactored internal relative bindings to utilize clean parent-hop configurations to ensure consistent layout outputs.

#### Finding 2: OAuth Provider Metadata Locks
- **Problem:** Supabase dashboard controls prohibited structural alterations to the user's base identity metadata directly inside the web UI for instances bound to Google Sign-In layers.
- **Fix Applied:** Successfully bypassed browser interface limitations by running custom back-end SQL commands against the core 'auth.users' configuration layer to declare ADMIN context directly.