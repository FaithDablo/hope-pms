# Sprint 3 - Full End-to-End Production Test Report (PR-01)

**Tester:** Faith Dablo (M5 - QA/Docs)
**Execution Environment:** Production Live Environment (Vercel + Supabase Cloud)
**Target Matrix:** Full Rights Consolidation, System Constraints, and Hard Delete Elimination

### 📊 End-to-End Execution Pass/Fail Validation Matrix

| Case | Module / Right Checked | Signed-In Role | Execution Step / Input | Observed System Output | Status |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **01** | Global Authentication | `ALL ROLES` | Trigger Google OAuth login | Successfully redirects, authenticates session tokens, and streams user context to the DOM | **PASSED** |
| **02** | `REP_001` Right Access | `USER` | Open Product List sidebar panel | Interface securely queries active products via `productService.getProducts()`. Layout loads with no errors | **PASSED** |
| **03** | `REP_001` Zero Restriction | `USER` (Rights = 0) | Attempt to access '/products' | System intercepts route via `RouteGuard.jsx` and bounces the user safely back to the home layout | **PASSED** |
| **04** | `PRD_ADD` Verification | `USER` (Rights = 0) | Inspect main dashboard workspace | The "+ New Product" button component is stripped from the view engine; direct API calls are blocked | **PASSED** |
| **05** | `PRD_DEL` Soft Delete Logic | `ADMIN` | Trigger row deletion action | System fires update request switching status to 'INACTIVE'. No data loss occurs in Supabase database tables | **PASSED** |
| **06** | Data Isolation Checks | `USER` | Perform search/filter queries | Soft-deleted (INACTIVE) entries are completely hidden and filtered out from user list and dropdown views | **PASSED** |
| **07** | Recovery Management | `ADMIN` | Click "Recover" button inside panel | Target row flips status back to 'ACTIVE' and item immediately populates all standard user data tables | **PASSED** |
| **08** | Route Guarding Intercept | `USER` | Deep-link directly into `/deleted-items` | Route guard component detects unauthorized access token and enforces redirection back to dashboard | **PASSED** |
| **09** | Admin Constraint Lock | `ADMIN` | Attempt to change rights of `SUPERADMIN` | UI freezes configuration controls; network requests are safely rejected by Row-Level Security (RLS) policies | **PASSED** |
| **10** | `REP_002` High Security | `ADMIN` | Click Top Selling Report shortcut | Throws clean 403 Access Denied warning; page contents remain completely restricted from view | **PASSED** |
| **11** | `REP_002` Full Clearance | `SUPERADMIN` | Render aggregated sales diagrams | Pulls information from `salesDetail` via `reportsService` and binds properties to interface components | **PASSED** |
| **12** | Database Blueprint Check | `ALL ROLES` | Full scan of service definitions | Verified zero instances of the SQL keyword 'DELETE' exist anywhere within codebases or API components | **PASSED** |