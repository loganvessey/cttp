# [Tech Spec]: CI/CD Pipeline & Deployment Strategy

| Spec Status | Target Milestone | Last Updated |
| :--- | :--- | :--- |
| **Draft** | Infrastructure | 2025-12-18 |

## 1. The Problem
*Why are we doing this?*
> Manual deployments are error-prone and slow. We currently have no "Staging" environment to test features before they hit Production, risking bugs in the live game.

## 2. Proposed Solution
Implement a **Modern CI/CD Pipeline** using Vercel.
* **Production:** Automatically deploys from `main`.
* **Staging:** Automatically deploys "Preview Apps" for every Pull Request.
* **Configuration:** Infrastructure-as-Code using `vercel.json`.

## 3. Implementation Details
* **Hosting Provider:** Vercel (Free Tier).
* **Build Command:** `npm run build`.
* **Output Directory:** `dist`.
* **Routing:** SPA (Single Page App) rewrites configured in `vercel.json` to prevent 404 errors on refresh.

## 4. Acceptance Criteria (Definition of Done)
- [ ] `vercel.json` is configured and committed.
- [ ] A Pull Request creates a live "Preview URL" automatically.
- [ ] Merging to `main` updates the production URL within 2 minutes.
- [ ] Browser refresh on a deep link (e.g., `/game`) does not crash.

## 5. Branching Strategy Impact
* We will adopt **Trunk-Based Development**.
* Long-lived `dev` branches are explicitly **forbidden**.
* All testing happens on Ephemeral Preview environments before merge.