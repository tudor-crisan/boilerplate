
import os
import re

def detect_indentation(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except (UnicodeDecodeError, PermissionError):
        return None

    space_2 = 0
    space_4 = 0
    
    for line in lines:
        stripped = line.lstrip()
        if not stripped: continue
        indent = len(line) - len(stripped)
        
        if indent == 0: continue
        
        if indent % 2 != 0: continue # Odd indentation, ignore
        
        if indent == 2: space_2 += 1
        elif indent == 4: space_4 += 1
        elif indent == 6: space_2 += 1
        elif indent == 8: space_4 += 1 # Could be 2*4 or 4*2, ambiguous but counts for both if not careful. 
        # Actually simplest check:
        # If we see 2, 6, 10, 14... it is DEFINITELY not 4-space indent (unless mixed).
        
    # Heuristic:
    # If we see *any* 2-space indents (2, 6, 10), it's likely 2-space or mixed.
    # If we see NO 2-space indents, but we see 4, 8, 12... it's likely 4-space.
    
    has_2 = False
    has_4_mul = False
    
    for line in lines:
        stripped = line.lstrip()
        if not stripped: continue
        indent = len(line) - len(stripped)
        if indent == 0: continue
        
        if indent % 4 == 2: # 2, 6, 10, 14...
            has_2 = True
        elif indent > 0 and indent % 4 == 0: # 4, 8, 12...
            has_4_mul = True
            
    if has_2:
        return "2"
    if has_4_mul and not has_2:
        return "4"
    return "unknown"

for root, dirs, files in os.walk('.'):
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
    if '.next' in dirs:
        dirs.remove('.next')
    if '.git' in dirs:
        dirs.remove('.git')
        
    for file in files:
        if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.md')):
            path = os.path.join(root, file)
            indent = detect_indentation(path)
            if indent == "4":
                print(path)
