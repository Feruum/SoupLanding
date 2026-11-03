const sites = {
  meta: 'https://about.meta.com/',
  qwen: 'https://qwen.ai/',
  gemma: 'https://ai.google.dev/gemma',
  mistral: 'https://mistral.ai/',
  microsoft: 'https://www.microsoft.com/',
  deepseek: 'https://www.deepseek.com/',
  unsloth: 'https://unsloth.ai/',
  deepspeed: 'https://www.deepspeed.ai/',
  sglang: 'https://sglang.ai/',
  langfuse: 'https://langfuse.com/',
  langsmith: 'https://www.langchain.com/langsmith',
  helicone: 'https://www.helicone.ai/',
  openpipe: 'https://openpipe.ai/',
  opentelemetry: 'https://opentelemetry.io/',
  mlflow: 'https://mlflow.org/',
  swanlab: 'https://swanlab.cn/en',
  trackio: 'https://huggingface.co/docs/trackio/index',
}
await Promise.all(Object.entries(sites).map(async ([name, url]) => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
    const text = await response.text()
    const candidates = [...text.matchAll(/<(?:link|img)\b[^>]*>/gi)].map(([tag]) => {
      if (!/icon|logo|brand/i.test(tag)) return null
      const match = /(?:href|src)=["']([^"']+)["']/.exec(tag)
      if (!match || match[1].startsWith('data:')) return null
      return new URL(match[1].replaceAll('&amp;', '&'), url).href
    }).filter(Boolean)
    process.stdout.write(`${name}: ${response.status}\n${[...new Set(candidates)].slice(0, 12).join('\n')}\n`)
    if (name === 'gemma') process.stdout.write([...text.matchAll(/.{0,80}(?:\.svg|gemma-logo|gemma_logo|<svg).{0,180}/gi)].map(match => match[0]).slice(0,30).join('\n')+'\n')
  } catch (error) { process.stdout.write(`${name}: ${error.message}\n`) }
}))
for (const [repo, branch] of [['sgl-project/sglang','main'],['mobiusml/hqq','master'],['Vahe1994/AQLM','main'],['openpipe/openpipe','main']]) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`, { signal: AbortSignal.timeout(20000) })
    const data = await response.json()
    process.stdout.write(`${repo}: ${response.status}\n${data.tree?.map(item => item.path).filter(path => /logo|favicon|icon.*\.(?:svg|png)/i.test(path)).slice(0,35).join('\n')}\n`)
  } catch(error) { process.stdout.write(`${repo}: ${error.message}\n`) }
}
