import sqlite3
import json
import os

# --- CONFIGURATION ---
DB_PATH = "lahman_1871-2022.sqlite"
OUTPUT_DIR = "src/data"

def get_connection():
    return sqlite3.connect(DB_PATH)

def run_query(query):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    return results

# --- DATA GENERATORS ---

def generate_top_hits():
    # 1. Fetch Top 500 Players (Hits)
    # We fetch 500 so we can handle "Misses" (Rank 101-500)
    query = """
    SELECT 
        p.nameFirst || ' ' || p.nameLast AS name,
        SUM(b.H) AS stat
    FROM Batting b
    JOIN People p ON b.playerID = p.playerID
    GROUP BY p.playerID
    ORDER BY stat DESC
    LIMIT 500;
    """
    
    raw_data = run_query(query)
    
    # 2. Format as JSON with Ranks
    json_data = []
    for index, row in enumerate(raw_data):
        rank = index + 1
        name = row[0]
        stat = row[1]
        
        # Create a "normalized" version for searching (lowercase, no dots)
        # e.g. "Ken Griffey Jr." -> "ken griffey jr"
        normalized = name.lower().replace('.', '').replace('-', ' ')
        
        json_data.append({
            "rank": rank,
            "name": name,
            "stat": stat,
            "normalized": normalized
        })
        
    return json_data

def generate_master_list():
    # 3. Fetch "Universe of Players" (Top 5000 by Games Played)
    # This populates the Autocomplete dropdown so it's not a cheat sheet.
    # We verify against the Batting table to ensure they are batters (since this is a Hits game)
    query = """
    SELECT 
        p.nameFirst || ' ' || p.nameLast AS name,
        SUM(b.G) AS games
    FROM Batting b
    JOIN People p ON b.playerID = p.playerID
    GROUP BY p.playerID
    ORDER BY games DESC
    LIMIT 5000;
    """
    
    raw_data = run_query(query)
    
    # Just a simple list of names for the dropdown
    # We remove duplicates just in case (e.g. slight data variances)
    names = [row[0] for row in raw_data]
    unique_names = sorted(list(set(names)))
    
    return unique_names

# --- EXECUTION ---

if __name__ == "__main__":
    # Ensure output directory exists
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # 1. Generate Game Data (The Answers)
    top_hits = generate_top_hits()
    hits_path = os.path.join(OUTPUT_DIR, "top_hits.json")
    with open(hits_path, "w") as f:
        json.dump(top_hits, f, indent=2)
    print(f"✅ Generated {len(top_hits)} records in {hits_path}")

    # 2. Generate Master List (The Dropdown Options)
    master_list = generate_master_list()
    master_path = os.path.join(OUTPUT_DIR, "all_players.json")
    with open(master_path, "w") as f:
        json.dump(master_list, f, indent=2)
    print(f"✅ Generated {len(master_list)} records in {master_path}")