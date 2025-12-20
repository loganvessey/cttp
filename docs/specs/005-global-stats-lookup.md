# [Spec] Global Stats Availability for Rich Misses

| Spec Status | Target Milestone | Last Updated |
| :--- | :--- | :--- |
| **Accepted** | MVP Polish | 2025-12-19 |

## 1. The Problem
* **Current State:** The app only stores rank/hit data for the Top 200 players.
* **User Frustration:** If a user guesses a valid player like "Nomar Garciaparra" (who is likely Rank ~300+), the app accepts the input but displays "MISS! Not in Top 200" with no stats.
* **Goal:** Treat *every* valid player guess as a "Contextual Strike," displaying their actual Rank and Total Hits.

## 2. Proposed Solution
* **Data:** Update `generate_data.py` to remove the `LIMIT 200` constraint from the stats query. Generate a `ranked_stats.json` file containing ~5,000 records (All players with >100 games).
* **Logic:**
    1.  User guesses "Player X".
    2.  App looks up Player X in `ranked_stats.json`.
    3.  **If Rank <= 100:** HIT (Points).
    4.  **If Rank > 100:** STRIKE (Display: "MISS! Rank #405 - 1,500 Hits").

## 3. Technical Implementation
* **Backend:** `generate_data.py` -> Remove limit, ensure consistent sort order.
* **Frontend:** `App.jsx` -> Import full dataset, remove "Not in Top 200" generic message logic for valid players.

## 4. Performance Check
* 5,000 records * ~100 bytes = ~500KB JSON file. This is acceptable for a client-side web app.