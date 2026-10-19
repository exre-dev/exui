import json
import os
import re
from pathlib import Path

root = Path.cwd()
map_file = root / '.notes/test-organization/node-path-map.json'
mapping = json.loads(map_file.read_text(encoding='utf-8-sig'))
old_verify = 'scripts/exui-skill/verify-examples.mjs'
new_verify = 'packages/components/tests/tooling/skill/verify-examples.mjs'
if (root / old_verify).exists():
    (root / old_verify).rename(root / new_verify)
mapping[old_verify] = new_verify

def translated(old_file, new_file, relative):
    target = os.path.normpath(os.path.join(os.path.dirname(old_file), relative)).replace('\\', '/')
    target = mapping.get(target, target)
    result = os.path.relpath(target, os.path.dirname(new_file)).replace('\\', '/')
    if not result.startswith('.'):
        result = './' + result
    if relative.endswith('/') and not result.endswith('/'):
        result += '/'
    return result

for old, new in mapping.items():
    if not new.endswith('.mjs') or old == 'scripts/tasks.test.mjs':
        continue
    file = root / new
    baseline = root / '.notes/test-organization/baseline' / old
    # Static imports, runtime URL resolution and createRequire retain the same target.
    pattern = r'((?:from\s*|import\s*\(|new URL\(\s*)[\'\"])(\.[^\'\"\n]+)([\'\"])'
    if baseline.exists():
        text = baseline.read_text(encoding='utf-8')
    else:
        text = file.read_text(encoding='utf-8')
        reverse = {v: k for k, v in mapping.items()}
        def undo_relative(m):
            target = os.path.normpath(os.path.join(os.path.dirname(new), m[2])).replace('\\', '/')
            target = reverse.get(target, target)
            relative = os.path.relpath(target, os.path.dirname(old)).replace('\\', '/')
            if not relative.startswith('.'):
                relative = './' + relative
            if m[2].endswith('/') and not relative.endswith('/'):
                relative += '/'
            return m[1] + relative + m[3]
        text = re.sub(pattern, undo_relative, text)
        text = text.replace('resolve(dirname(scriptFile), "../../../../..")', 'resolve(dirname(scriptFile), "..", "..")')
    def replace_relative(m):
        target = os.path.normpath(os.path.join(os.path.dirname(old), m[2])).replace('\\', '/')
        if m[1].startswith('new URL') or target in mapping or (root / target).exists():
            return m[1] + translated(old, new, m[2]) + m[3]
        return m[0]
    text = re.sub(pattern, replace_relative, text)
    if old.startswith('scripts/'):
        levels = len(Path(new).parent.parts)
        prefix = '../' * levels
        text = re.sub(r'(path\.resolve\(import\.meta\.dirname,\s*)([\'\"])\.\.\2', lambda m: m[1] + m[2] + prefix.rstrip('/') + m[2], text)
        text = re.sub(r'((?:path\.)?resolve\((?:path\.)?dirname\(fileURLToPath\(import\.meta\.url\)\),\s*)([\'\"])\.\.\2', lambda m: m[1] + m[2] + prefix.rstrip('/') + m[2], text)
        text = text.replace('scripts/fixtures/', 'packages/docs/tests/fixtures/')
    if old == old_verify:
        text = text.replace('resolve(dirname(scriptFile), "..", "..")', 'resolve(dirname(scriptFile), "../../../../..")')
    # Dedicated gates invoked by root-relative literal paths must follow relocated scripts.
    for source, target in mapping.items():
        if not source.endswith('.json'):
            text = text.replace('"' + source + '"', '"' + target + '"').replace("'" + source + "'", "'" + target + "'")
    file.write_text(text, encoding='utf-8', newline='\n')
map_file.write_text(json.dumps(mapping, indent=2) + '\n', encoding='utf-8')
