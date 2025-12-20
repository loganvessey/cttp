# Five Tool: The Baseball Knowledge Engine

**Live Demo:** [Insert Vercel Link Here]  
**Status:** MVP (Phase 1)  
**Strategy:** [Read the Product Vision](./docs/strategy/001-north-star-vision.md)

![Project Banner](https://via.placeholder.com/800x200?text=Five+Tool+Game+Preview)

## ⚾ The Pitch
**Five Tool** is a re-imagining of baseball trivia as a competitive e-sport. Moving beyond static daily grids, Five Tool is built to be a live, multiplayer "Derby" for baseball history.

Currently in **MVP Phase**, the application demonstrates the core input engine, a system capable of instantly validating any player in MLB history (1871-2022) against specific statistical milestones.

## 🚀 Key Features
* **Autocomplete:** A fuzzy-search input system that handles 5,000+ historical players with zero latency.
* **Smart Disambiguation:** Automatically handles name collisions (e.g., distinguishing *Ken Griffey (1973-1991)* from *Ken Griffey (1989-2010)*).
* **Rich Context Logic:** The game engine distinguishes between a "Pure Miss" (not in DB) and a "Strategic Miss" (a valid player who just didn't crack the Top 100), providing educational stats for every guess.
* **Data Integrity:** Custom ETL pipeline normalizes the Lahman Database into a high-performance frontend payload.

## 🛠️ Architecture & Tech Stack

| Component | Tech | Decision Rationale (The "Why") |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Low overhead, fast HMR, and component modularity for the scorecard UI. |
| **Data** | Python + SQLite | We treat the Lahman SQL DB as a "Data Warehouse" and use Python to ETL (Extract, Transform, Load) optimized JSON payloads for the client. |
| **State** | Local JSON | **Trade-off:** We chose flat-file JSON over a live Postgres backend for the MVP. This reduces latency to <10ms for searches and allows for offline-first architecture, at the cost of larger initial bundle size (~500KB). |
| **Deployment** | Vercel | Zero-config CI/CD pipeline integrated directly with GitHub. |

## 📂 Project Structure
This repo is organized to demonstrate professional Product Engineering practices:

* `src/` - Application Code.
* `docs/specs/` - **Technical Specifications**. Every feature (scoring, data validation) starts here before a line of code is written.
* `docs/strategy/` - **Product Vision**. To includes the "Working Backwards" Press Release for the V2.0 vision and other strategy docs.
* `generate_data.py` - The ETL script that powers the game.

## ⚡ Getting Started

### Prerequisites
* Node.js 18+
* Python 3.x

### Installation
1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/five-tool.git](https://github.com/YOUR_USERNAME/five-tool.git)
    cd five-tool
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Generate the Data (ETL):**
    This step runs the Python pipeline to query the raw SQL database and build the optimized JSON files.
    ```bash
    python generate_data.py
    ```

4.  **Run Local Dev Server:**
    ```bash
    npm run dev
    ```

## 🗺️ Roadmap
* **Phase 1 (Current):** Single Player/Local Multiplayer MVP, Core Data Engine.
* **Phase 2:** Visual Polish, "Sandlot" Private Lobbies.
* **Phase 3:** Additional Top 100 categories, game customizability

## 📄 License
This project is open source. Data provided by the Lahman Baseball Database (Creative Commons).