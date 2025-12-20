# [Data Spec]: Universal Player Era Formatting

| Spec Status | Target Milestone | Last Updated |
| :--- | :--- | :--- |
| **Approved** | MVP Refinement | 2025-12-19 |

## 1. The Problem
* **Ambiguity:** Names like "Ken Griffey" are duplicated across history.
* **Inconsistency:** Only showing years for duplicates makes the UI look "glitchy" or uneven.
* **Context:** Users benefit from seeing the era (e.g., 1920s vs 1990s) to confirm they are guessing the right player.

## 2. Proposed Solution
Standardize the **Display Name** format for ALL players in both the Dropdown (`all_players.json`) and the Answer Key (`top_hits.json`).
* **Format:** `First Last (StartYear-EndYear)`
* **Scope:** Apply this to every single record, regardless of uniqueness.

### Examples:
* "Babe Ruth (1914-1935)"
* "Ken Griffey (1973-1991)"
* "Ken Griffey (1989-2010)"

## 3. Implementation Details
* **Update `generate_data.py`:**
    * Modify `top_hits` query to fetch min/max `yearID`.
    * Modify `master_list` query to fetch min/max `yearID`.
    * Format strings in Python before saving to JSON.
* **Impact:** This ensures the User's guess (from the dropdown) matches the Answer Key string exactly `===`, requiring no regex cleanup on the frontend.

## 4. Acceptance Criteria
* [ ] Every name in the autocomplete dropdown includes parenthetical years.
* [ ] Selecting "Ty Cobb (1905-1928)" is accepted as a Correct Answer.