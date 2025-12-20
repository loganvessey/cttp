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
    return f"{first} {last} ({start}-{end})"

# --- DATA GENERATORS ---

def generate_ranked_stats():
    print("Fetching Global Stats (All Players)...")
    # REMOVED 'LIMIT 200' -> Now fetching everyone with stats
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
    HAVING stat IS NOT NULL AND stat > 0
    ORDER BY stat DESC;
    """
    
    raw_data = run_query(query)
    
    json_data = []
    for index, row in enumerate(raw_data):
        first, last, start, end, stat = row
        display_name = format_display_name(first, last, start, end)
        
        json_data.append({
            "rank": index + 1,
            "name": display_name,
            "stat": stat
        })
        
    return json_data

def generate_master_list():
    print("Fetching Master Name List...")
    # This matches the dropdown logic
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
    final_list = []
    for row in raw_data:
        first, last, start, end = row
        display_name = format_display_name(first, last, start, end)
        final_list.append(display_name)

    return sorted(list(set(final_list)))

# --- EXECUTION ---

if __name__ == "__main__":
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # 1. Generate FULL Ranked Stats (Was 'top_hits.json')
    ranked_stats = generate_ranked_stats()
    # Saving as 'ranked_stats.json' to be clear it's everyone
    stats_path = os.path.join(OUTPUT_DIR, "ranked_stats.json")
    with open(stats_path, "w") as f:
        json.dump(ranked_stats, f, indent=2)
    print(f"✅ Generated {len(ranked_stats)} ranked records in {stats_path}")

    # 2. Generate Dropdown Options
    master_list = generate_master_list()
    master_path = os.path.join(OUTPUT_DIR, "all_players.json")
    with open(master_path, "w") as f:
        json.dump(master_list, f, indent=2)
    print(f"✅ Generated {len(master_list)} unique options in {master_path}")