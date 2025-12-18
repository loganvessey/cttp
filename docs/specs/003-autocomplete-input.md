# [Feature]: Autocomplete Player Search (Immaculate Grid Style)

| Spec Status | Target Milestone | Last Updated |
| :--- | :--- | :--- |
| **Approved** | MVP | 2025-12-18 |

## 1. The Problem
* **Ambiguity:** Users typing "Jones" or "Martinez" get frustrated by "Which one?" errors.
* **Spelling:** Strict matching punishes minor typos (e.g., "Yastrzemski").
* **Game Integrity:** A dropdown that only shows valid answers (Top 100) acts as a spoiler/cheat sheet.

## 2. Proposed Solution
Replace the text input with a **Combobox / Autocomplete** component.
* **Behavior:** User types 2+ characters -> Dropdown appears with matching names.
* **Selection:** Clicking a name submits the guess.
* **Validation:** The input only accepts players from our Master List.

## 3. Data Strategy (The "Uplift")
To prevent spoilers, the frontend needs a "Universe" of plausible players, not just the winners.
* **Master List:** A new JSON file (`all_players.json`) containing the Top 5,000 players by Career Games Played (or WAR).
* **Privacy:** This list contains *Names Only* (and maybe IDs). It does NOT contain ranks or stats.
* **Workflow:**
    1. User picks "Barry Bonds" from dropdown.
    2. App checks `top_hits.json` to see if he is Rank 1-100 (Hit), 101-200 (Miss), or Unranked (Strike).

## 4. Implementation Details
* **Component:** `react-select` or a custom `datalist` implementation.
* **Performance:** 5,000 names is light enough (~100KB) to load client-side without lag.

## 5. Success Criteria
* [ ] Typing "Grif" shows "Ken Griffey Jr", "Ken Griffey Sr", "Alfredo Griffin".
* [ ] Selecting "Ken Griffey Jr" correctly maps to his stats in `top_hits.json`.
* [ ] Selecting a player NOT in the Top 100 triggers a valid "Strike".