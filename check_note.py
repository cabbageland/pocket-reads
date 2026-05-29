import json
import sys
from pathlib import Path

slug = sys.argv[1] if len(sys.argv) > 1 else 'long-tail-internet-photo-reconstruction'
p = Path('data/content.json')
data = json.loads(p.read_text())
items = []
for collection in data.get('collections', []):
    items.extend(collection.get('items', []))
items.extend(data.get('items', []))
seen = []
for x in items:
    if x.get('slug') == slug:
        seen.append(x)
print('matches', len(seen))
if seen:
    it = seen[0]
    for k in ['title', 'summary', 'whyItMatters', 'verdict', 'paperUrl', 'path']:
        print(f'{k}: {it.get(k)}')
