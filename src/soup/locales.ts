import registry from '../i18n/locales.json'

export const soupLocales = Object.fromEntries([
  ...Object.entries(registry).map(([code, entry]) => [
    code,
    {
      name: entry.name,
      script: entry.script,
      direction: 'direction' in entry ? String(entry.direction) : 'ltr',
    },
  ]),
  ['kk', { name: 'Қазақша', direction: 'ltr', script: 'Cyrl' }],
]) as Record<string, { name: string; direction: string; script: string }>

export const localePath = (code: string) => (code === 'en' ? '/' : `/${code}/`)

export type FooterGroup = {
  script: string
  label: string
  locales: { code: string; name: string }[]
}
// Compute the translated script labels on the server, keeping browser ICU differences out of hydration.
export function getFooterGroups(language: string): FooterGroup[] {
  const names = new Intl.DisplayNames([language], { type: 'script' })
  const groups = new Map<string, FooterGroup>()
  for (const [code, locale] of Object.entries(soupLocales)) {
    if (!groups.has(locale.script))
      groups.set(locale.script, {
        script: locale.script,
        label: names.of(locale.script) ?? locale.script,
        locales: [],
      })
    groups.get(locale.script)!.locales.push({ code, name: locale.name })
  }
  return [...groups.values()].map((group) => ({
    ...group,
    locales: group.locales.sort((a, b) =>
      a.code === 'en'
        ? -1
        : b.code === 'en'
          ? 1
          : a.name.localeCompare(b.name, 'en'),
    ),
  }))
}
