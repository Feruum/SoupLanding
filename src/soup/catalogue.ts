import type english from './messages/en.json'
export type Messages = typeof english
const catalogues = import.meta.glob<{ default: Messages }>('./messages/*.json')
export async function getMessages(code: string): Promise<Messages> {
  const load = catalogues[`./messages/${code}.json`]
  if (!load) throw new Error(`Missing Soup catalogue: ${code}`)
  return (await load()).default
}
