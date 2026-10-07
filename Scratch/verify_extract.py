import os
import json

# Read the executed notebook to extract clean verbatim outputs
with open('DD_Foundation_Analysis_Executed.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

def get_clean_output(cell_idx):
    c = nb['cells'][cell_idx]
    lines = []
    for o in c.get('outputs', []):
        if 'text' in o:
            lines.extend(o['text'])
        elif 'data' in o and 'text/plain' in o['data']:
            lines.extend(o['data']['text/plain'])
    raw = ''.join(lines).strip()
    cleaned = []
    for l in raw.split('\n'):
        l_str = l.strip()
        if l_str.startswith('<Figure') or l_str.startswith('<IPython') or l_str.startswith('Saving ') or 'upload dialog' in l_str:
            continue
        cleaned.append(l)
    return '\n'.join(cleaned).strip()

# Extract outputs for each step
out_g2 = get_clean_output(3)
out_g3 = get_clean_output(5)
out_g4 = get_clean_output(6) + "\n\n" + get_clean_output(7)
out_g5 = get_clean_output(9)
out_g6 = get_clean_output(11)
out_g7 = get_clean_output(14)
out_g8_jds = get_clean_output(18)
out_g8_sds = get_clean_output(19)
out_g9 = get_clean_output(20) + "\n\n" + get_clean_output(21) + "\n\n" + get_clean_output(23) + "\n\n" + get_clean_output(24)
out_g10 = get_clean_output(26)
out_g11_jds = get_clean_output(28)
out_g11_sds = get_clean_output(29)
out_g12 = get_clean_output(30)
out_g13 = get_clean_output(32)
out_g14 = get_clean_output(33)

print("Extracted all outputs successfully!")
print(f"G3 length: {len(out_g3)}, G8 JDS length: {len(out_g8_jds)}, G11 JDS length: {len(out_g11_jds)}")
