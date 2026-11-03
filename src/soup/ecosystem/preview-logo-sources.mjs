import { readdir, readFile } from 'node:fs/promises'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const root = new URL('../../../public/soup/pixel-tools/sources/', import.meta.url)
const files = (await readdir(root)).filter(file => /\.(svg|png)$/.test(file))
const layers = []
for (let index=0; index<files.length; index++) {
  const x=index%6*160, y=Math.floor(index/6)*130
  const source = await sharp(await readFile(new URL(files[index],root))).resize(126,90,{fit:'contain',background:'#dedbd5'}).png().toBuffer()
  layers.push({input:source,left:x+17,top:y+6})
  const text = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="30"><text x="80" y="18" text-anchor="middle" font-size="9" font-family="monospace" fill="#ddd">${files[index]}</text></svg>`
  layers.push({input:Buffer.from(text),left:x,top:y+100})
}
await sharp({create:{width:960,height:Math.ceil(files.length/6)*130,channels:4,background:'#151515'}}).composite(layers).png().toFile(fileURLToPath(new URL('source-preview.png',import.meta.url)))
