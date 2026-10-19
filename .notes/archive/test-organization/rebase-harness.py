from pathlib import Path
p=Path('packages/docs/tests/browser')
for name in ['ShowcaseExampleCoverage.vrt.test.tsx','ShowcaseExampleInteractions.vrt.test.tsx']:
 f=p/name; t=f.read_text(encoding='utf8')
 t=t.replace('import Showcase from "../../src/showcase/Showcase"', 'import { mountDocsExamples } from "./fixtures/docs-examples"\nimport { preferenceKeys } from "../../lib/site-contract.mjs"')
 t=t.replace('["exui-showcase-language", "exui-showcase-theme", "exui-showcase-density"] as const','[preferenceKeys.language, preferenceKeys.theme, preferenceKeys.density] as const')
 t=t.replace('let root: Root','let examplesHost: ReturnType<typeof mountDocsExamples>\nlet root: Root',1)
 t=t.replace('  root.unmount()','  root.unmount()\n  examplesHost?.router.dispose()',1)
 if name.startswith('ShowcaseExampleCoverage'):
  t=t.replace('catalogPages, pageHref','catalogPages')
  t=t.replace('root.render(<Showcase />)','examplesHost = mountDocsExamples(root, "glass")')
  t=t.replace('await page.getByRole("combobox", { name: "Language" }).selectOptions(language)','await examplesHost.setting("Language", language)')
  t=t.replace('location.hash = pageHref(entry)','await examplesHost.open(entry.group, entry.id)')
  t=t.replace('full Showcase example coverage','full docs example coverage')
 else:
  t=t.replace('root.render(<Showcase />)','examplesHost = mountDocsExamples(root, "button")')
  t=t.replace('  location.hash = `#/${group}/${family}`','  await examplesHost.open(group, family)')
  t=t.replace('  await page.getByRole("combobox", { name: label, exact: true }).selectOptions(value)','  await examplesHost.setting(label, value)')
  start=t.index('  // An open modal makes the header inert;')
  end=t.index('\n}',start)
  t=t[:start]+'  // Keep the modal open while changing the real route/provider state.\n  examplesHost.setBehindModal(label, value)'+t[end:]
  t=t.replace('expect(location.hash).toBe("#/components/button")','expect(examplesHost.router.state.location.pathname).toBe("/en/docs/components/button/")')
 f.write_text(t,encoding='utf8',newline='\n')
