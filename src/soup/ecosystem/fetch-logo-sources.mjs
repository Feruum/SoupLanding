import { mkdir, writeFile } from 'node:fs/promises'

const target = new URL('../../../public/soup/pixel-tools/sources/', import.meta.url)
await mkdir(target, { recursive: true })
const assets = [
  ...['huggingface','ollama','vllm','deepspeed','unsloth','onnx','nvidia','wandb','sglang','flashattention','llamacpp','mlx','openai','tensorflow','gguf','loramerge','meta','qwen','gemma','mistral','microsoft','deepseek','langfuse','langsmith','helicone','openpipe','opentelemetry','mlflow','swanlab','trackio'].map(name => ({ id: name, url: `https://trysoup.dev/logos/${name}.${name === 'mlx' ? 'png' : 'svg'}`, kind: 'upstream Soup asset' })),
  { id: 'hf-official', url: 'https://huggingface.co/datasets/huggingface/brand-assets/resolve/main/hf-logo.svg', kind: 'Hugging Face official brand asset' },
  { id: 'deepseek-official', url: 'https://raw.githubusercontent.com/deepseek-ai/DeepSeek-V3/main/figures/logo.svg', kind: 'DeepSeek official repository' },
  { id: 'gemma-official', url: 'https://ai.google.dev/static/gemma/images/gemma-logo.svg', kind: 'Google official website' },
  { id: 'qwen-official', url: 'https://raw.githubusercontent.com/QwenLM/Qwen3/main/assets/logo.png', kind: 'Qwen official repository' },
  { id: 'meta-official', url: 'https://static.xx.fbcdn.net/rsrc.php/yf/r/-7pQO6hUGK_.svg', kind: 'Meta official brand website' },
  { id: 'qwen-web', url: 'https://img.alicdn.com/imgextra/i4/O1CN01OXv3EM1FN8t9W4P79_!!6000000000474-2-tps-80-80.png', kind: 'Qwen official website icon' },
  { id: 'mistral-official', url: 'https://mistral.ai/cms-media/api/media/file/icon-m-book-red.svg', kind: 'Mistral official website icon' },
  { id: 'deepspeed-official', url: 'https://www.deepspeed.ai/assets/images/deepspeed-logo-uppercase-bold-white-1.15.svg', kind: 'DeepSpeed official website' },
  { id: 'sglang-official', url: 'https://sglang.ai/images/logo.png', kind: 'SGLang official website' },
  { id: 'helicone-official', url: 'https://www.helicone.ai/static/logo.svg', kind: 'Helicone official website' },
  { id: 'opentelemetry-official', url: 'https://opentelemetry.io/img/logos/opentelemetry-icon-color.svg', kind: 'OpenTelemetry official website' },
  { id: 'langfuse-official', url: 'https://langfuse.com/apple-touch-icon.png', kind: 'Langfuse official website' },
  { id: 'langsmith-official', url: 'https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/6a1c6031b3db015796401c5b_4e8060f75e16b02daa59026cbae4bc8f_LangSmith%20Engine_Icon_light%201.svg', kind: 'LangSmith official website' },
  { id: 'swanlab-official', url: 'https://swanlab.cn/icon.png?e31c53cba54196fe', kind: 'SwanLab official website' },
  { id: 'gemma-github', url: 'https://raw.githubusercontent.com/google-deepmind/gemma/main/docs/_static/gemma.png', kind: 'Google DeepMind official repository' },
  { id: 'unsloth-github', url: 'https://raw.githubusercontent.com/unslothai/unsloth/main/images/unsloth%20logo.png', kind: 'Unsloth official repository' },
  { id: 'mlflow-github', url: 'https://raw.githubusercontent.com/mlflow/mlflow/master/assets/logo.svg', kind: 'MLflow official repository' },
  { id: 'unsloth-original', url: 'https://raw.githubusercontent.com/unslothai/unsloth/main/images/unsloth%20logo%20only.png', kind: 'Unsloth official repository' },
  { id: 'trackio-official', url: 'https://raw.githubusercontent.com/gradio-app/trackio/main/trackio/assets/trackio_logo_light.png', kind: 'Trackio official repository' },
  { id: 'opentelemetry-original', url: 'https://raw.githubusercontent.com/open-telemetry/opentelemetry.io/main/assets/icons/logo.svg', kind: 'OpenTelemetry official repository' },
  { id: 'deepseek-original', url: 'https://raw.githubusercontent.com/deepseek-ai/DeepSeek-V2/main/figures/logo.svg', kind: 'DeepSeek official repository' },
  { id: 'microsoft-original', url: 'https://raw.githubusercontent.com/unslothai/unsloth/main/studio/frontend/public/hub/profile/logo/microsoft.svg', kind: 'Microsoft brand mark vendored in the official Unsloth repository' },
  { id: 'meta-original', url: 'https://raw.githubusercontent.com/unslothai/unsloth/main/studio/frontend/public/hub/profile/logo/meta.svg', kind: 'Meta brand mark vendored in the official Unsloth repository' },
  { id: 'deepseek-mark', url: 'https://raw.githubusercontent.com/unslothai/unsloth/main/studio/frontend/public/hub/profile/logo/deepseek.svg', kind: 'DeepSeek brand mark vendored in the official Unsloth repository' },
  { id: 'openpipe-original', url: 'https://openpipe.ai/favicon.ico', kind: 'OpenPipe official website icon' },
  { id: 'openpipe-svg', url: 'https://raw.githubusercontent.com/openpipe/openpipe/main/app/public/favicons/safari-pinned-tab.svg', kind: 'OpenPipe official repository' },
  { id: 'sglang-original', url: 'https://raw.githubusercontent.com/sgl-project/sglang/main/assets/logo_square.svg', kind: 'SGLang official repository' },
  { id: 'mistral-mark', url: 'https://raw.githubusercontent.com/unslothai/unsloth/main/studio/frontend/public/hub/profile/logo/mistral.svg', kind: 'Mistral brand mark vendored in the official Unsloth repository' },
  { id: 'weightsandbiases', url: 'https://trysoup.dev/logos/weightsandbiases.svg', kind: 'upstream Soup asset' },
]
for (const org of ['google-gemma','microsoft','deepseek-ai']) {
  const response = await fetch(`https://api.github.com/orgs/${org}`)
  if (response.ok) {
    const profile = await response.json()
    assets.push({ id: `${org}-avatar`, url: profile.avatar_url, kind: `Logo of the official ${org} GitHub organization` })
  }
}
const results = await Promise.all(assets.map(async asset => {
  try {
    const response = await fetch(asset.url, { signal: AbortSignal.timeout(25000) })
    if (!response.ok) return { ...asset, status: response.status }
    const data = Buffer.from(await response.arrayBuffer())
    const isSvg = /<svg[\s>]/i.test(data.toString('utf8', 0, 1200))
    const isPng = data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    const isJpg = data[0] === 255 && data[1] === 216
    const isWebp = data.toString('ascii',8,12) === 'WEBP'
    const isIco = data.readUInt32LE(0) === 65536
    if (!isSvg && !isPng && !isJpg && !isWebp && !isIco) return { ...asset, status: `not a supported image (${response.headers.get('content-type')})` }
    const filename = `${asset.id}.${isSvg ? 'svg' : isPng ? 'png' : isJpg ? 'jpg' : isWebp ? 'webp' : 'ico'}`
    await writeFile(new URL(filename, target), data)
    return { ...asset, status: 'saved', filename, bytes: data.length }
  } catch (error) { return { ...asset, status: error.message } }
}))
await writeFile(new URL('retrieval.json', target), `${JSON.stringify({ retrieved: new Date().toISOString(), assets: results }, null, 2)}\n`)
for (const result of results) process.stdout.write(`${result.id}: ${result.status}${result.bytes ? ` (${result.bytes})` : ''}\n`)
