import json
import re

log_path = r"C:\Users\yashd\.gemini\antigravity-ide\brain\0a3c77be-e0ed-4783-bd0e-bb001eda212f\.system_generated\logs\transcript.jsonl"

drive_links = set()
try:
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                obj = json.loads(line)
                # Search for drive links in content, tool_calls, etc.
                text = json.dumps(obj)
                links = re.findall(r'https://drive\.google\.com/file/d/[a-zA-Z0-9_-]+/view\?usp=[a-zA-Z0-9_-]+', text)
                for l in links:
                    drive_links.add(l)
            except Exception as e:
                pass
except Exception as e:
    print("Error reading log:", e)

print("Found Google Drive links in history:")
for dl in sorted(list(drive_links)):
    print(" -", dl)
