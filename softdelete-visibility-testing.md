# Sprint 2 - Soft Delete, Recovery, and API Visibility Verification (PR-02)

**Tester:** Faith Dablo (M5 - QA/Docs)
**Execution Date:** May 19, 2026
**Scope:** Soft Delete Validation, Admin Recovery, Direct API Bypass Security, and Stamp Column Control

### Soft Delete & Isolation Testing Log

| Case | Test Target | Role Scope | Execution Attempt | Expected Output (Per Project Guide) | Result | Status |
|---|---|---|---|---|---|---|
| **01** | Soft Delete Execution | ADMIN | Click delete on a product row | System updates status to 'INACTIVE' instead of removing row | Database updated successfully | **PASSED** |
| **02** | User Isolation Check | USER | Fetch listing table data | Soft-deleted (INACTIVE) items are completely invisible | UI list hides row immediately | **PASSED** |
| **03** | Global Search Leak | USER | Search specifically for INACTIVE item name | Item does not populate standard query results or dropdowns | Zero results returned | **PASSED** |
| **04** | Admin Pane Visibility | ADMIN | Open Deleted Items list panel | All soft-deleted (INACTIVE) rows populate the panel view | List renders complete rows | **PASSED** |
| **05** | SuperAdmin Pane Visibility | SUPERADMIN | Access '/deleted-items' endpoint | Fully fetches INACTIVE records alongside system logs | Unrestricted table render | **PASSED** |
| **06** | Data Recovery Trigger | ADMIN | Click Recover button on INACTIVE item | Status flips to 'ACTIVE' and item instantly reappears for users | Row visible globally | **PASSED** |
| **07** | Route Guard Block | USER | Deep-link access direct to `/deleted-items` | Intercepted via Route Guard and redirected back to Home | Bounced to dashboard safely | **PASSED** |
| **08** | Route Guard Layout Leak | USER | Check Sidebar navigation options | The link or icon for Deleted Items panel is completely hidden | Navigation element stripped | **PASSED** |
| **09** | Supabase Direct Bypass | USER | Direct Supabase network API call | Row-Level Security (RLS) policies intercept select statements | Returns 0 rows for user token | **PASSED** |
| **10** | Stamp Hiding Audit | USER | Inspect product detail payloads | Stamp column is completely stripped and hidden | Field absent in data object | **PASSED** |
| **11** | Stamp Access Audit | ADMIN | Inspect active inventory management pane | Stamp metadata logs are visible to admin scopes | Renders text string correctly | **PASSED** |
| **12** | Database Safety Check | ALL ROLES | Run script validations | No hard 'DELETE' SQL statement exists anywhere in code | Checked repository assets | **PASSED** |
| **13** | Numeric Boundary Safeguard | ADMIN | Input negative price `-500.00` | Aborts save operation, triggers boundary input error | Client verification halts submit | **PASSED** |
| **14** | Empty Payload Action | ALL ROLES | Click submit on blank modal form | Input locks reject operation, preventing empty inserts | Validation fires successfully | **PASSED** |s