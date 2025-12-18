import sqlite3
import pandas as pd
import os

# 1. SETUP: Define file paths
# Make sure this matches the filename you downloaded
DB_FILE = 'lahman_1871-2022.sqlite' 
OUTPUT_DIR = 'src/data'

# Check if DB exists
if not os.path.exists(DB_FILE):
    print(f"❌ Error: Could not find {DB_FILE}. Did you move it to the cttp root folder?")
    exit()

# Connect to the database
conn = sqlite3.connect(DB_FILE)

def generate_category(category_name, sql_query, filename):
    print(f"Processing: {category_name}...")
    
    # Run the SQL query
    try:
        df = pd.read_sql_query(sql_query, conn)
    except Exception as e:
        print(f"❌ SQL Error in {category_name}: {e}")
        return

    # Add a 'rank' column (1, 2, 3...)
    df['rank'] = df.index + 1
    
    # Create 'normalized' column for easier checking (lowercase, no periods)
    # e.g. "Ken Griffey Jr." -> "ken griffey jr"
    df['normalized'] = df['name'].str.lower().str.replace('.', '', regex=False)

    # Save to JSON in the React folder
    output_path = f"{OUTPUT_DIR}/{filename}"
    df.to_json(output_path, orient='records', indent=2)
    print(f"✅ Saved {filename} ({len(df)} records)")

# --- THE QUERIES ---

# Query 1: Top 100 Career Hits
hits_query = """
SELECT 
    p.nameFirst || ' ' || p.nameLast AS name,
    SUM(b.H) AS stat
FROM Batting b
JOIN People p ON b.playerID = p.playerID
GROUP BY p.playerID
ORDER BY stat DESC
LIMIT 100;
"""

# Query 2: Top 100 Career Home Runs
hr_query = """
SELECT 
    p.nameFirst || ' ' || p.nameLast AS name,
    SUM(b.HR) AS stat
FROM Batting b
JOIN People p ON b.playerID = p.playerID
GROUP BY p.playerID
ORDER BY stat DESC
LIMIT 100;
"""

# Query 3: Top 100 Career Strikeouts (Pitching)
k_query = """
SELECT 
    p.nameFirst || ' ' || p.nameLast AS name,
    SUM(pit.SO) AS stat
FROM Pitching pit
JOIN People p ON pit.playerID = p.playerID
GROUP BY p.playerID
ORDER BY stat DESC
LIMIT 100;
"""

# --- EXECUTE ---
generate_category("Hits", hits_query, "top_hits.json")
generate_category("Home Runs", hr_query, "top_hr.json")
generate_category("Pitching Strikeouts", k_query, "top_strikeouts.json")

conn.close()
print("\n🎉 Data generation complete! Check src/data/")