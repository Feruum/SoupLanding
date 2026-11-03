import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

const publicRoot = new URL('../../../public/soup/pixel-tools/', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('source-manifest.json', publicRoot), 'utf8'))
const icons = JSON.parse(await readFile(new URL('pixel-paths.json', import.meta.url), 'utf8'))
const digest = value => createHash('sha256').update(value).digest('hex')

test('every delivered logo has an original source file with verified provenance', async () => {
  assert.equal(Object.keys(icons).length, manifest.assets.length)
  for (const source of manifest.assets.filter(item => !item.aliasOf)) {
    assert.match(source.url, /^https:\/\//)
    assert.match(source.kind, /official|upstream Soup/)
    const original = await readFile(new URL(source.file, publicRoot))
    assert.equal(digest(original), source.sha256, `${source.id}: original source changed`)
    if (source.file.endsWith('.svg')) {
      assert.doesNotMatch(original.toString(), /<script\b|\bonload\s*=|\bonerror\s*=/i)
    }
    assert.ok(icons[source.id], source.id)
  }
})

test('all 24/32/40px variants contain only solid cells on the integer pixel grid', () => {
  for (const [id, icon] of Object.entries(icons)) for (const grid of [24,32,40]) {
    const layers = icon.variants[grid]
    assert.ok(layers.length, `${id}/${grid}: no logo`)
    let area = 0
    for (const layer of layers) {
      assert.match(layer.fill, /^(?:currentColor|#[0-9a-f]{6})$/)
      const pattern = /M(\d+) (\d+)h(\d+)v1h-(\d+)z/g
      const rectangles = [...layer.d.matchAll(pattern)]
      assert.equal(rectangles.map(match=>match[0]).join(''), layer.d)
      for (const [,x,y,w,back] of rectangles) {
        assert.equal(w,back)
        assert.ok(+w>0 && +x>=0 && +y>=0 && +x + +w<=grid && +y<grid, `${id}/${grid}: cell outside grid`)
        area += +w
      }
    }
    assert.ok(area>5, `${id}/${grid}: empty mark`)
    assert.ok(area<grid*grid*.9, `${id}/${grid}: solid placeholder box`)
  }
})

test('all eight model identities use distinct source-derived geometry', () => {
  const models = ['llama','qwen','gemma','mistral','phi','deepseek','whisper','huggingface']
  const shapes = models.map(model=>digest(JSON.stringify(icons[model].variants[32])))
  assert.equal(new Set(shapes).size, models.length)
  const byId = Object.fromEntries(manifest.assets.map(source=>[source.id,source]))
  assert.equal(byId.llama.aliasOf,'meta')
  assert.equal(byId.phi.aliasOf,'microsoft')
  assert.equal(byId.whisper.aliasOf,'openai')
  assert.match(byId.qwen.url,/alicdn\.com/)
  assert.match(byId.gemma.kind,/official google-gemma/)
  assert.match(byId.meta.kind,/Meta official/)
})

test('monochrome original marks inherit the active theme foreground', () => {
  const mono = manifest.assets.filter(source=>source.transform?.mono).map(source=>source.id)
  for (const id of mono) for (const grid of [24,32,40]) {
    assert.ok(icons[id].variants[grid].every(layer=>layer.fill==='currentColor'), id)
  }
})

test('public SVGs match the selected variant and render without fractional alpha', async () => {
  for (const [id, icon] of Object.entries(icons)) {
    const svg=await readFile(new URL(`${id}.svg`,publicRoot))
    const text=svg.toString()
    assert.match(text,/shape-rendering="crispEdges"/)
    assert.doesNotMatch(text,/<text\b|<image\b|<script\b/)
    assert.match(text,new RegExp(`viewBox="0 0 ${icon.defaultResolution} ${icon.defaultResolution}"`))
    for (const layer of icon.variants[icon.defaultResolution]) assert.ok(text.includes(layer.d), id)
    const {data,info}=await sharp(svg).ensureAlpha().raw().toBuffer({resolveWithObject:true})
    assert.equal(info.width,icon.defaultResolution)
    for(let at=3;at<data.length;at+=4)assert.ok(data[at]===0||data[at]===255,`${id}: antialiased pixel`)
  }
})

test('recipes and model clusters render real logo components, without letter badges', async () => {
  const component=await readFile(new URL('../OmarchySections.tsx',import.meta.url),'utf8')
  assert.doesNotMatch(component,/recipe\.mark|model\.mark|mark:\s*['"]/)
  assert.match(component,/PixelModelIcon model=\{recipe\.model\}/)
  assert.match(component,/PixelModelIcon model=\{model\.model\}/)
})
