 main
# 🏥 HopePMS - Hospital Product Management System

 feat/ui-product-list
 docs/sprint1-log-readme

 dev
# Hope PMS Project 
## Setup Instructions
 dev

> **Sprint 2 Core Development & QA Framework** > A secure, multi-role medical inventory and pricing tracker built with React, Vite, and Supabase.

---

## 👥 Project Team Role Assignments

| Role Token | Team Member | Primary Responsibility | Assigned Deliverables |
| :--- | :--- | :--- | :--- |
| 👑 **M1** | **Faith Dablo** | **Project Lead / Full-Stack Dev** | API Services, Core Security, Repository Setup |
| 🎨 **M2** | *Teammate Name* | Frontend UI Developer | Product Modals, Grid Interfacing, Dashboard Views |
| 🗄️ **M3** | *Teammate Name* | Database & Integration | RLS Ruleset Verification, Schema Structuring |
| 🛡️ **M5** | **Faith Dablo** | **QA Engineer / Documenter** | Rights Matrix Testing, Edge Case Logs, Activity Logs |

---

## ⚡ Sprint 2 Core Features

### 🔐 1. Role-Based Access Control (RBAC) & Security
* **App-Level Integration:** Implemented a global `UserRightsContext` powered by the custom `useRights()` hook to intercept and stream permissions seamlessly to all active interfaces.
* **Route Guards:** Embedded a hard dynamic `RouteGuard.jsx` component that explicitly locks the `/deleted-items` administration node, safely bouncing regular `USER` accounts back to safe layouts.

### 📦 2. Scalable Supabase Service Layer
* **`productService.js`:** Custom data functions handling real-time inventory hooks (`getProducts`, `addProduct`, `updateProduct`). Integrates automated application-level **Soft Delete** logic by manipulating row metrics using `ACTIVE`/`INACTIVE` record states.
* **`priceService.js`:** Secure pipeline tracking asset modification loops. It captures database snapshots and populates individual history mappings within the `priceHist` ledger schema.

---

## 🧪 Quality Assurance & Test Logs (M5)

Comprehensive testing maps were executed against deployment targets to guarantee codebase stability.

### 📊 1. Rights Matrix Validation (18-Case Grid)
Ensures granular data views depending on current account claims (`USER`, `ADMIN`, `SUPERADMIN`). All access tokens dynamically pass schema assertions.
* 📂 **Logs Location:** `test/rights-matrix-results.md`

### 🛡️ 2. Constraint & Boundary Testing (14-Case Map)
Validates network defense behavior against structural edge cases like null payloads, negative price alterations, malicious script injections, and expired session handshakes.
* 📂 **Logs Location:** `test/edge-case-testing.md`

---

## 🛠️ Repository Architecture & File Blueprint

The codebase features a modular structural mapping designed to avoid integration conflicts:

```text
src/
├── 📁 components/
│   └── 📄 RouteGuard.jsx            # Dynamic client-side route security gate
├── 📁 context/
│   └── 📄 UserRightsContext.jsx     # Global React state hook for user identities
├── 📁 services/
│   ├── 📄 productService.js          # Direct Supabase bindings for product records
│   └── 📄 priceService.js            # History mapping services for cost adjustments
├── 📄 supabaseClient.js             # Initial system connectivity client
test/
├── 📄 rights-matrix-results.md      # Official 18-case QA security validation
└── 📄 edge-case-testing.md          # 14-point edge-case system testing data
docs/
└── 📄 sprint2-activity-log.md       # Technical audit logs, bugs, and resolution briefs
