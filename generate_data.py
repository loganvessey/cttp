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

def format_display_name(first, last, start, end):
    """Standardizes the Name (Year-Year) format"""
    return f"{first} {last} ({start}-{end})"

# --- DATA GENERATORS ---

def generate_top_hits():
    print("Fetching Top 200 Hits Leaders (with Eras)...")
    # We now fetch years here too so the Answer Key matches the Dropdown exactly
    query = """
    SELECT 
        p.nameFirst,
        p.nameLast,
        MIN(b.yearID) as start_year,
        MAX(b.yearID) as end_year,
        SUM(b.H) AS stat
    FROM Batting b
    JOIN People p ON b.playerID = p.playerID
    GROUP BY p.playerID
    ORDER BY stat DESC
    LIMIT 200;
    """
    
    raw_data = run_query(query)
    
    json_data = []
    for index, row in enumerate(raw_data):
        first, last, start, end, stat = row
        
        display_name = format_display_name(first, last, start, end)
        
        # Create a normalized version for potential fuzzy search fallbacks later
        normalized = f"{first} {last}".lower().replace('.', '').replace('-', ' ')
        
        json_data.append({
            "rank": index + 1,
            "name": display_name, # Storing "Ty Cobb (1905-1928)" as the answer
            "stat": stat,
            "normalized": normalized
        })
        
    return json_data

def generate_master_list():
    print("Fetching Master Player List (All with Eras)...")
    
    query = """
    SELECT 
        p.nameFirst,
        p.nameLast,
        MIN(b.yearID) as start_year,
        MAX(b.yearID) as end_year
    FROM Batting b
    JOIN People p ON b.playerID = p.playerID
    GROUP BY p.playerID
    HAVING SUM(b.G) >= 100
    ORDER BY p.nameLast, p.nameFirst;
    """
    
    raw_data = run_query(query)
    
    # Simple list of strings
    final_list = []
    for row in raw_data:
        first, last, start, end = row
        display_name = format_display_name(first, last, start, end)
        final_list.append(display_name)

    # Sort alphabetically
    return sorted(list(set(final_list)))

# --- EXECUTION ---

if __name__ == "__main__":
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # 1. Generate Game Data (The Answers)
    top_hits = generate_top_hits()
    hits_path = os.path.join(OUTPUT_DIR, "top_hits.json")
    with open(hits_path, "w") as f:
        json.dump(top_hits, f, indent=2)
    print(f"✅ Generated {len(top_hits)} records in {hits_path}")

    # 2. Generate Master List (The Options)
    master_list = generate_master_list()
    master_path = os.path.join(OUTPUT_DIR, "all_players.json")
    with open(master_path, "w") as f:
        json.dump(master_list, f, indent=2)
    print(f"✅ Generated {len(master_list)} unique options in {master_path}")