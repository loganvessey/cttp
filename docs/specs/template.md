# [Feature Name]: [Short Description]

| Spec Status | Target Milestone | Last Updated |
| :--- | :--- | :--- |
| **Draft** / In Review / Approved | Milestone 2 (MVP) | YYYY-MM-DD |

## 1. The "Why" (User Value)
*One clear sentence on the problem we are solving.*
> **Example:** "Players currently have no way to track turns or set up a game, making the app usable only for solo practice."

## 2. User Stories (Requirements)
*The specific capabilities we must deliver.*

### P0 (Must Haves)
- [ ] **As a** Host, **I want** to enter names for up to 4 players, **so that** we can track individual scores.
- [ ] **As a** Player, **I want** to clearly see whose turn it is, **so that** I don't guess out of order.
- [ ] **As a** System, **I must** prevent duplicate names in the lobby, **so that** scoring doesn't get confused.

### P1 (Nice to Haves / Scope Cuts)
- [ ] *As a Player, I want to choose an avatar color.* (Cut for MVP)
- [ ] *As a Host, I want to edit a name after adding it.*

## 3. Technical Implementation Notes
*Quick notes for the engineer (you) on how to build it.*
* **Components Needed:** `SetupScreen.jsx`, `LobbyList.jsx`.
* **State Changes:** Need to move `players` state from App.jsx to a global context or pass down via props.
* **Data Validation:** Simple string trim() and non-empty check.

## 4. Edge Cases & Risks
*What could go wrong?*
* *User enters 0 players and hits start.*
* *User enters a name that is just spaces.*
* *Screen resize on mobile hides the "Start Game" button.*

## 5. Success Criteria (Definition of Done)
* How do we know this is finished?
* [ ] Unit tests pass for the "Player Add" function.
* [ ] A game can be started with 3 players and flow correctly.