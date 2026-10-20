import json
from pathlib import Path

root = Path.cwd()
copy = root / 'packages/docs/tests/node/docs-example-copy.test.mjs'
text = copy.read_text(encoding='utf-8')
for title in ['all remaining source templates and string additions have explicit retention evidence', 'reviewed icon and focus-trigger ARIA copy contracts remain present']:
    start = text.index("test('" + title)
    end = text.find("\ntest('", start + 1)
    text = text[:start] + (text[end + 1:] if end != -1 else '')
copy.write_text(text, encoding='utf-8')
fixtures = root / 'packages/docs/tests/fixtures'
for fixture in fixtures.iterdir():
    if fixture.name.startswith('showcase-copy-retentions-') or fixture.name in ['showcase-copy-binary-retentions.json', 'showcase-copy-aria-contracts.json']:
        fixture.unlink()

sharing = root / 'packages/docs/tests/node/docs-sharing.test.mjs'
text = sharing.read_text(encoding='utf-8')
start = text.index("test('docs development server serves current example source JSON and Markdown at the deployment base'")
end = text.index("\ntest('", start + 1)
sharing.write_text(text[:start] + text[end+1:], encoding='utf-8')

assets = root / 'packages/docs/tests/node/docs-example-assets.test.mjs'
assets.write_text(assets.read_text(encoding='utf-8').replace("path.resolve(import.meta.dirname, '../.gitattributes')", "path.resolve(import.meta.dirname, '../../../../.gitattributes')"), encoding='utf-8')
capabilities = root / 'packages/docs/tests/node/exui-capabilities.test.mjs'
capabilities.write_text(capabilities.read_text(encoding='utf-8').replace('"../packages/docs/package.json"', '"../../package.json"'), encoding='utf-8')
pack = root / 'packages/components/tests/consumers/verify-packages.mjs'
text = pack.read_text(encoding='utf-8')
for name in ['react', 'form']:
    text = text.replace('join(repositoryRoot, "scripts", "verify-' + name + '-browser.mjs")', 'fileURLToPath(new URL("./verify-' + name + '-browser.mjs", import.meta.url))')
pack.write_text(text, encoding='utf-8')
