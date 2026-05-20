# HopePMS - Final System Manual & Presentation Blueprint (PR-02)

**Prepared by:** Faith Dablo (M5 - QA/Docs)
**Project Subtitle:** HOPE, INC. — Product Management System
**Development Cycle:** Sprint 3 Deliverables Baseline

---

## 📘 Part 1: Official End-User Operating Manual

### 1. System Authentication and Sign-In
* **Standard Pathway:** Access the deployment home domain via `https://hope-inc-pms.vercel.app`.
* **OAuth Access:** Click the **Sign In with Google** module. Select an authorized enterprise account credential. The application will authenticate your session and automatically parse your unique roles model.

### 2. Multi-Role Navigation & Workspace Restrictions
* **Standard USER Environment:** * Access is restricted strictly to viewing the primary Product Grid component. 
  * Product lines declared as `INACTIVE` (soft-deleted) will not display across queries, lookups, or tables.
  * Access tokens to the Administrative Settings or the `/deleted-items` panel are explicitly blocked.
* **ADMIN Environment:**
  * Grants access to add products, adjust cost metrics, and process soft deletions.
  * Features visibility to the *Deleted Items* control panel. Administrators can select items from this view and click **Recover** to toggle status traits back to active states.
* **SUPERADMIN Environment:**
  * Has complete administrative access to the system.
  * Grants exclusive viewing privileges for the core **Top Selling Report (REP_002)** module graph viewports.

---

## 📊 Part 2: Project Presentation Slides Outline

### Slide 1: Title & Core Blueprint
* **Header:** HOPE, INC. — Product Management System (HopePMS)
* **Metadata:** Sprint 3 Consolidated Engineering Review
* **Presenter:** Full Engineering Board Team Roster

### Slide 2: Structural Problem Domain
* Highlight instructor-mandated database regulations: Explicit elimination of database row drop operations (`DELETE` syntax ban).
* Strict isolation protocols separating `USER`, `ADMIN`, and `SUPERADMIN` access rights.

### Slide 3: Codebase Architecture Overview
* **Services Model:** Breakdown of custom data bindings (`productService`, `priceService`, `reportsService`).
* **Security Intercepts:** Practical operation of global state wrappers (`UserRightsContext`) alongside dynamic routing middleware (`RouteGuard.jsx`).

### Slide 4: QA Execution Matrix & Production Sign-off
* Overview of 18-case role matrix tracking and 14-case system environment smoke tests.
* Structural verification proving comprehensive compliance and technical deployment readiness.