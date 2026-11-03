import type { Messages } from '../catalogue'
import type { DocPage } from './documents'
import { Documentation } from './Documentation'
import page from './pages/getting-started.json'

export const docTitle = page.title
export const docDescription = page.description
export function GettingStartedArticle({
  m,
  language = 'en',
}: {
  m: Messages
  language?: string
}) {
  return <Documentation doc={page as DocPage} m={m} language={language} />
}
