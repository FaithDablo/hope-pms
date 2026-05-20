# Sprint 2 - 18-Case Rights Matrix Test Results (PR-01)

**Tester:** Faith Dablo (M5 - QA/Docs)
**Execution Date:** May 19, 2026
**Target:** Dynamic Access Security and Permissions Layer

### Security Matrix Pass/Fail Log (18 Test Scenarios)

| Case | Right Tested | User Role | Initial Setup | Action Attempted | Result | Status |
|---|---|---|---|---|---|---|
| **01** | REP_001 | USER | Value = 1 | Click Product List sidebar | Grid loads correctly | **PASSED** |
| **02** | REP_001 | USER | Value = 0 | Access '/products' directly | Redirected to Home / Guarded | **PASSED** |
| **03** | REP_001 | ADMIN | Value = 1 | Load main interface | Grid renders complete headers | **PASSED** |
| **04** | PRD_ADD | USER | Value = 1 | Click "+ New Product" button | Product creation modal opens | **PASSED** |
| **05** | PRD_ADD | USER | Value = 0 | View product listing page | "+ New Product" button is hidden | **PASSED** |
| **06** | PRD_EDIT | USER | Value = 1 | Click Edit Icon on row | Opens update form pre-filled | **PASSED** |
| **07** | PRD_EDIT | USER | Value = 0 | View product data table | Action column hides Edit trigger | **PASSED** |
| **08** | PRD_DEL | USER | Value = 1 | Click Delete Icon on row | Soft delete prompt displays | **PASSED** |
| **09** | PRD_DEL | USER | Value = 0 | Check product action items | Delete button is stripped | **PASSED** |
| **10** | REP_002 | USER | Value = 0 | Attempt direct path bypass | Locked via standard App Router | **PASSED** |
| **11** | REP_002 | ADMIN | Value = 0 | Click Top Selling report | Throws 403 Forbidden intercept | **PASSED** |
| **12** | REP_002 | SUPERADMIN | Value = 1 | Load dashboard component | Charts render without errors | **PASSED** |
| **13** | ADM_USER | USER | Value = 0 | Force browser to '/admin' | Immediate bounce to login | **PASSED** |
| **14** | ADM_USER | ADMIN | Value = 1 | Open management sub-menu | Full account roster populates | **PASSED** |
| **15** | PRD_DEL | ADMIN | Value = 1 | Trigger removal on row | Database flags status INACTIVE | **PASSED** |
| **16** | PRD_EDIT | ADMIN | Value = 1 | Submit dynamic cost patch | App triggers historic price log | **PASSED** |
| **17** | REP_001 | SUPERADMIN | Value = 1 | Request core list dump | Unfiltered array bypasses scope | **PASSED** |
| **18** | PRD_ADD | SUPERADMIN | Value = 1 | Submit full asset payload | RLS tokens authorize save | **PASSED** |