from pathlib import Path
import re, json, shutil, hashlib, os

repo=Path.cwd()
src=repo/'packages/docs/src/showcase'
dest=repo/'packages/docs/tests/browser'
dest.mkdir(parents=True,exist_ok=True)
removed={'ComponentsOverview.vrt.test.tsx':'DocsOverview.vrt.test.tsx','ShowcaseSharing.vrt.test.tsx':'DocsExamples.vrt.test.tsx','ShowcaseCatalog.vrt.test.tsx':None,'ShowcaseLocale.vrt.test.tsx':'DocsSettings.vrt.test.tsx'}
mapping=[]
def rebase(text, old, new):
    pattern=r'((?:\bfrom\s*|\bimport\s*\(?\s*|vi\.mock\(\s*)["\'])(\.{1,2}/[^"\']+)(["\'])'
    def change(m):
        target=(old.parent/m[2]).resolve()
        path=os.path.relpath(target,new.parent).replace('\\','/')
        if not path.startswith('.'): path='./'+path
        return m[1]+path+m[3]
    return re.sub(pattern,change,text)

for old in sorted(src.glob('*.vrt.test.tsx')):
    name=old.name
    if name in removed:
        mapping.append({'from':old.relative_to(repo).as_posix(),'to':str((dest/removed[name]).relative_to(repo).as_posix()) if removed[name] else None,'action':'retire legacy shell; unique current-host assertions retained'})
        old.unlink()
        continue
    new=dest/('FormAppearance.vrt.test.tsx' if name=='FormSurfaceOutline.vrt.test.tsx' else name)
    if name=='FormSurfaces.vrt.test.tsx':
        mapping.append({'from':old.relative_to(repo).as_posix(),'to':(dest/'FormAppearance.vrt.test.tsx').relative_to(repo).as_posix(),'action':'merge background assertions'})
        old.unlink()
        continue
    new.write_text(rebase(old.read_text(encoding='utf8'),old,new),encoding='utf8',newline='\n')
    mapping.append({'from':old.relative_to(repo).as_posix(),'to':new.relative_to(repo).as_posix(),'action':'move'})
    old.unlink()

fixture=src/'ComponentRecipeContract.tsx'
target=dest/'fixtures/ComponentRecipeContract.tsx'
target.parent.mkdir(parents=True,exist_ok=True)
target.write_text(rebase(fixture.read_text(encoding='utf8'),fixture,target),encoding='utf8',newline='\n')
fixture.unlink()
test=dest/'ComponentRecipeContract.vrt.test.tsx'
test.write_text(test.read_text().replace('../../src/showcase/ComponentRecipeContract','./fixtures/ComponentRecipeContract'),encoding='utf8',newline='\n')
mapping.append({'from':fixture.relative_to(repo).as_posix(),'to':target.relative_to(repo).as_posix(),'action':'move test-exclusive fixture'})

oldbaselines=src/'__screenshots__/ComponentRecipeContract.vrt.test.tsx'
newbaselines=dest/'__screenshots__/ComponentRecipeContract.vrt.test.tsx'
newbaselines.mkdir(parents=True,exist_ok=True)
for old in sorted(oldbaselines.glob('*.png')):
    new=newbaselines/old.name
    digest=hashlib.sha256(old.read_bytes()).hexdigest()
    shutil.move(str(old),new)
    assert hashlib.sha256(new.read_bytes()).hexdigest()==digest
    mapping.append({'from':old.relative_to(repo).as_posix(),'to':new.relative_to(repo).as_posix(),'action':'move baseline bytes','sha256':digest})
for old in (src/'__screenshots__/ShowcaseCatalog.vrt.test.tsx').glob('*.png'):
    mapping.append({'from':old.relative_to(repo).as_posix(),'to':None,'action':'remove obsolete shell baseline','sha256':hashlib.sha256(old.read_bytes()).hexdigest()})
    old.unlink()

config=repo/'packages/docs/vitest.config.ts'
config.write_text(config.read_text().replace('src/**/*.vrt.test.tsx','tests/browser/**/*.vrt.test.tsx'),encoding='utf8',newline='\n')
config=repo/'packages/docs/tsconfig.json'
config.write_text(config.read_text().replace('"include": ["src",','"include": ["tests", "src",'),encoding='utf8',newline='\n')
config=repo/'packages/docs/package.json'
config.write_text(config.read_text().replace('oxlint src app lib *.ts','oxlint src app lib tests *.ts'),encoding='utf8',newline='\n')
config=repo/'packages/docs/.gitignore'
text=config.read_text()
text=text[text.index('# Preserve the 24'):].replace('src/showcase/','tests/browser/')
text=text.replace('# Preserve the 24 reviewed Windows component baselines during the package move.','# Preserve the 24 reviewed Windows component baselines.')
text=text.replace('!tests/browser/__screenshots__/ComponentRecipeContract', '!tests/browser/__screenshots__/ComponentRecipeContract',1)
text='!tests/browser/__screenshots__/\ntests/browser/__screenshots__/*\n'+text
config.write_text(text,encoding='utf8',newline='\n')
(repo/'.notes/test-organization/browser-path-map.json').write_text(json.dumps(mapping,indent=2)+'\n',encoding='utf8')

tabs=dest/'Tabs.vrt.test.tsx'
text=tabs.read_text(); start=text.index('  it("records the two reported examples for visual inspection"')
text=text[:start]+text[text.index('\n})',start):]
tabs.write_text(text,encoding='utf8',newline='\n')

form=dest/'FormAppearance.vrt.test.tsx'
text=form.read_text().replace('    const borders = new Set<string>()','''    const field = (label: string) => [...host.querySelectorAll<HTMLElement>('[data-slot="field"]')]
      .find(item => item.querySelector('[data-slot="field-label"]')?.textContent === label)!
    const backgrounds = [
      field("Text").querySelector('[data-slot="input"]')!,
      field("Search").querySelector('.ex-form-multiselect')!,
      field("Date").querySelector('.ex-form-date-trigger')!,
      field("Files").querySelector('.ex-form-files button')!,
    ].map(surface => getComputedStyle(surface).backgroundColor)
    expect(new Set(backgrounds).size, JSON.stringify(backgrounds)).toBe(1)
    const borders = new Set<string>()''')
form.write_text(text,encoding='utf8',newline='\n')
