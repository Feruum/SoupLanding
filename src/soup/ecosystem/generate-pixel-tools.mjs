import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

// All geometry comes from saved source logos. No drawn paths, initials, fonts,
// or replacement symbols are used to construct these pixel variants.
const output = new URL('../../../public/soup/pixel-tools/', import.meta.url)
const sourceRoot = new URL('sources/', output)
const retrieval = JSON.parse(await readFile(new URL('retrieval.json', sourceRoot), 'utf8'))
const grids = [24, 32, 40]
const assets = [
  { id: 'huggingface', file: 'huggingface.svg', mono: true },
  { id: 'ollama', file: 'ollama.svg', mono: true },
  { id: 'vllm', file: 'vllm.svg', mono: true },
  { id: 'deepspeed', file: 'deepspeed-official.svg', coloredCrop: true },
  { id: 'unsloth', file: 'unsloth-original.png', crop: [0,0,.318,1], mode: 'edge-white' },
  { id: 'onnx', file: 'onnx.svg', mono: true, grid: 32 },
  { id: 'nvidia', file: 'nvidia.svg', mono: true },
  { id: 'weightsandbiases', file: 'weightsandbiases.svg', mono: true },
  { id: 'flashattention', file: 'flashattention.svg', mono: true },
  { id: 'sglang', file: 'sglang-original.svg', grid: 32 },
  { id: 'llamacpp', file: 'llamacpp.svg', mono: true },
  { id: 'mlx', file: 'mlx.png', mode: 'light', mono: true },
  { id: 'openai', file: 'openai.svg', mono: true, grid: 32 },
  { id: 'tensorboard', file: 'tensorflow.svg', mono: true },
  { id: 'gguf', file: 'gguf.svg', mono: true },
  { id: 'hqq', file: 'loramerge.svg', mono: true },
  { id: 'langfuse', file: 'langfuse-official.png', mode: 'light' },
  { id: 'langsmith', file: 'langsmith-official.svg', mode: 'light' },
  { id: 'helicone', file: 'helicone-official.svg', coloredCrop: true },
  { id: 'openpipe', file: 'openpipe-svg.svg', mono: true },
  { id: 'opentelemetry', file: 'opentelemetry-original.svg', crop: [0,0,.28,1], mono: true },
  { id: 'mlflow', file: 'mlflow-github.svg', grid: 40, adaptiveNeutral: true },
  { id: 'swanlab', file: 'swanlab-official.png', mode: 'light', mono: true },
  { id: 'trackio', file: 'trackio-official.png', mode: 'edge-white' },
  { id: 'meta', file: 'meta-official.svg', grid: 32 },
  { id: 'qwen', file: 'qwen-web.png', grid: 24 },
  { id: 'gemma', file: 'google-gemma-avatar.jpg', mode: 'ink', grid: 32 },
  { id: 'mistral', file: 'mistral-mark.svg', grid: 24 },
  { id: 'microsoft', file: 'microsoft-original.svg', mode: 'ink', grid: 24 },
  { id: 'deepseek', file: 'deepseek-mark.svg', grid: 32 },
]
const aliases = { tensorrt: 'nvidia', wandb: 'weightsandbiases', aqlm: 'hqq', otel: 'opentelemetry', 'openai-stored': 'openai', llama: 'meta', phi: 'microsoft', whisper: 'openai' }
const icons = {}
const provenance = []
const prepared = new Map()
await mkdir(output, { recursive: true })
await mkdir(new URL('qa/', import.meta.url), { recursive: true })

function bounds(data, width, height, predicate) {
  let left=width, right=-1, top=height, bottom=-1
  for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
    const at=(y*width+x)*4
    if(predicate(data[at],data[at+1],data[at+2],data[at+3])) {
      left=Math.min(left,x); right=Math.max(right,x); top=Math.min(top,y); bottom=Math.max(bottom,y)
    }
  }
  if(right<left || bottom<top) throw new Error('Logo has no visible foreground')
  return { left, top, width:right-left+1, height:bottom-top+1 }
}

async function prepare(asset) {
  const source=await readFile(new URL(asset.file,sourceRoot))
  const {data,info}=await sharp(source,{density:144}).resize(768,768,{fit:'inside',withoutEnlargement:false}).ensureAlpha().raw().toBuffer({resolveWithObject:true})
  let image=sharp(data,{raw:{width:info.width,height:info.height,channels:4}})
  if(asset.coloredCrop) {
    const box=bounds(data,info.width,info.height,(r,g,b,a)=>a>100&&Math.max(r,g,b)-Math.min(r,g,b)>60)
    image=image.extract(box)
  } else if(asset.crop) {
    const [x,y,w,h]=asset.crop
    image=image.extract({left:Math.round(x*info.width),top:Math.round(y*info.height),width:Math.floor(w*info.width),height:Math.floor(h*info.height)})
  }
  const raster=await image.raw().toBuffer({resolveWithObject:true})
  if(asset.mode==='edge-white') {
    const {width,height}=raster.info
    const visited=new Uint8Array(width*height), queue=[]
    for(let x=0;x<width;x++)queue.push(x,(height-1)*width+x)
    for(let y=0;y<height;y++)queue.push(y*width,y*width+width-1)
    for(let cursor=0;cursor<queue.length;cursor++) {
      const cell=queue[cursor]
      if(visited[cell])continue
      visited[cell]=1
      const at=cell*4
      if(raster.data[at+3]!==0 && Math.min(raster.data[at],raster.data[at+1],raster.data[at+2])<225)continue
      raster.data[at+3]=0
      const x=cell%width,y=Math.floor(cell/width)
      if(x>0)queue.push(cell-1)
      if(x<width-1)queue.push(cell+1)
      if(y>0)queue.push(cell-width)
      if(y<height-1)queue.push(cell+width)
    }
  }
  for(let i=0;i<raster.data.length;i+=4) {
    const r=raster.data[i],g=raster.data[i+1],b=raster.data[i+2]
    if(asset.mode==='ink' && Math.min(r,g,b)>225) raster.data[i+3]=0
    if(asset.mode==='light' && Math.max(r,g,b)<100) raster.data[i+3]=0
    if(asset.mono) raster.data[i]=raster.data[i+1]=raster.data[i+2]=230
  }
  const box=bounds(raster.data,raster.info.width,raster.info.height,(_r,_g,_b,a)=>a>90)
  const png=await sharp(raster.data,{raw:{width:raster.info.width,height:raster.info.height,channels:4}}).extract(box).png().toBuffer()
  prepared.set(asset.id,png)
  return {png,sha256:createHash('sha256').update(source).digest('hex')}
}

function cellColor(data, at, mono, adaptiveNeutral=false) {
  if(data[at+3]<96) return null
  if(mono) return 'currentColor'
  if(adaptiveNeutral && Math.max(data[at],data[at+1],data[at+2])-Math.min(data[at],data[at+1],data[at+2])<24)return 'currentColor'
  // Quantization retains internal brand details while removing half-alpha edges.
  return '#'+[data[at],data[at+1],data[at+2]].map(value=>Math.min(255,Math.round(value/32)*32).toString(16).padStart(2,'0')).join('')
}

function svg(icon, grid, color='#e4d9ca') {
  const paths=icon.variants[grid].map(layer=>`<path fill="${layer.fill}" d="${layer.d}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${grid} ${grid}" width="${grid}" height="${grid}" color="${color}" shape-rendering="crispEdges">${paths}</svg>`
}

for(const asset of assets) {
  const {png,sha256}=await prepare(asset)
  const variants={}
  for(const grid of grids) {
    const pixels=await sharp(png).resize(grid-4,grid-4,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).extend({top:2,bottom:2,left:2,right:2,background:{r:0,g:0,b:0,alpha:0}}).raw().toBuffer()
    const colors=new Map()
    for(let y=0;y<grid;y++) {
      for(let x=0;x<grid;) {
        const fill=cellColor(pixels,(y*grid+x)*4,asset.mono,asset.adaptiveNeutral)
        if(!fill){x++;continue}
        let end=x+1
        while(end<grid && cellColor(pixels,(y*grid+end)*4,asset.mono,asset.adaptiveNeutral)===fill)end++
        const width=end-x
        colors.set(fill,(colors.get(fill)||'')+`M${x} ${y}h${width}v1h-${width}z`)
        x=end
      }
    }
    variants[grid]=[...colors].map(([fill,d])=>({fill,d}))
  }
  icons[asset.id]={defaultResolution:asset.grid||24,variants}
  const record=retrieval.assets.find(item=>item.filename===asset.file)
  if(!record)throw new Error(`Missing source provenance for ${asset.file}`)
  provenance.push({id:asset.id,file:`sources/${asset.file}`,url:record.url,kind:record.kind,sha256,transform:{mono:!!asset.mono,adaptiveNeutral:!!asset.adaptiveNeutral,mode:asset.mode||'alpha',crop:asset.crop||null,coloredCrop:!!asset.coloredCrop},defaultResolution:asset.grid||24})
  await writeFile(new URL(`${asset.id}.svg`,output),svg(icons[asset.id],asset.grid||24)+'\n')
}
for(const [alias,id]of Object.entries(aliases)){
  icons[alias]=icons[id]
  provenance.push({id:alias,aliasOf:id})
  await writeFile(new URL(`${alias}.svg`,output),svg(icons[id],icons[id].defaultResolution)+'\n')
}
await writeFile(new URL('pixel-paths.json',import.meta.url),JSON.stringify(icons)+'\n')
await writeFile(new URL('source-manifest.json',output),JSON.stringify({version:2,retrieved:retrieval.retrieved,grids,assets:provenance},null,2)+'\n')

async function contactSheet(ids, filename) {
  const width=880,rowHeight=112,height=60+ids.length*rowHeight
  const layers=[]
  const header='<svg xmlns="http://www.w3.org/2000/svg" width="880" height="60"><style>text{fill:#b8aa99;font:12px monospace}</style><text x="15" y="34">BRAND</text><text x="170" y="34">SOURCE</text><text x="345" y="34">24px grid</text><text x="520" y="34">32px grid</text><text x="695" y="34">40px grid</text></svg>'
  layers.push({input:Buffer.from(header),left:0,top:0})
  for(let row=0;row<ids.length;row++) {
    const id=ids[row],y=60+row*rowHeight
    const label=`<svg xmlns="http://www.w3.org/2000/svg" width="140" height="110"><text x="15" y="55" fill="#e0d3c2" font-family="monospace" font-size="11">${id}</text></svg>`
    layers.push({input:Buffer.from(label),left:0,top:y})
    const real=aliases[id]||id
    layers.push({input:await sharp(prepared.get(real)).resize(90,90,{fit:'contain',background:'#12100e'}).png().toBuffer(),left:162,top:y+7})
    for(let index=0;index<grids.length;index++) {
      const grid=grids[index]
      layers.push({input:await sharp(Buffer.from(svg(icons[id],grid))).resize(96,96,{kernel:'nearest'}).png().toBuffer(),left:330+index*175,top:y+4})
    }
  }
  await sharp({create:{width,height,channels:4,background:'#12100e'}}).composite(layers).png().toFile(fileURLToPath(new URL(`qa/${filename}`,import.meta.url)))
}
await contactSheet(['llama','qwen','gemma','mistral','phi','deepseek','whisper','huggingface'],'model-logos-before-after.png')
await contactSheet(assets.filter(asset=>!['meta','qwen','gemma','mistral','microsoft','deepseek'].includes(asset.id)).map(asset=>asset.id),'tool-logos-before-after.png')
process.stdout.write(`Built ${Object.keys(icons).length} logos from ${assets.length} saved source assets at ${grids.join('/')}px.\n`)
