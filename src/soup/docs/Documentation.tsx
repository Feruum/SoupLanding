import { useEffect, useRef, useState } from 'react'
import type { Messages } from '../catalogue'
import type { DocPage } from './documents'
import manifest from './manifest.json'
import { searchDocuments, searchWords } from './search'
import type { SearchIndex } from './search'
import './docs.css'

const basePath = (language: string) =>
  language === 'en' ? '/docs' : `/${language}/docs`

const documentIndexBySlug = new Map(
  manifest.documents.map((doc, index) => [doc.slug, index]),
)
let loadedSearchIndex: SearchIndex | null = null
let searchIndexPromise: Promise<SearchIndex> | null = null

function useDocumentSearch(query: string) {
  const [index, setIndex] = useState<SearchIndex | null>(loadedSearchIndex)
  const [unavailable, setUnavailable] = useState(false)
  const words = searchWords(query)
  useEffect(() => {
    if (!query.trim() || index || unavailable) return
    let mounted = true
    searchIndexPromise ??= import('./search-index.json').then((module) => {
      loadedSearchIndex = module.default
      return loadedSearchIndex
    })
    searchIndexPromise
      .then((value) => {
        if (mounted) setIndex(value)
      })
      .catch(() => {
        if (mounted) setUnavailable(true)
      })
    return () => {
      mounted = false
    }
  }, [query, index, unavailable])
  const matches = index
    ? searchDocuments(index, query)
    : !words.length
      ? null
      : new Set(
          manifest.documents.flatMap((doc, position) =>
            words.every((word) =>
              searchWords(`${doc.title} ${doc.slug} ${doc.description}`).some(
                (candidate) => candidate.startsWith(word),
              ),
            )
              ? [position]
              : [],
          ),
        )
  return { matches, loading: words.length > 0 && !index && !unavailable }
}

function CodeBlock({
  code,
  language,
  m,
}: {
  code: string
  language: string
  m: Messages
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const pre = useRef<HTMLPreElement>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    [],
  )
  async function copy() {
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = null
    try {
      await navigator.clipboard.writeText(code)
      setStatus('copied')
    } catch {
      if (pre.current) {
        pre.current.focus()
        const range = document.createRange()
        range.selectNodeContents(pre.current)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
      setStatus('failed')
      return
    }
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setStatus('idle'), 2500)
  }
  const label =
    status === 'copied' ? m.copied : status === 'failed' ? m.copyFailed : m.copy
  return (
    <div className="soup-docs-code">
      <div className="soup-docs-codebar">
        <span lang="en">{language || 'terminal'}</span>
        <button type="button" onClick={copy} aria-label={label}>
          <span aria-hidden="true">{status === 'copied' ? '[✓]' : '[⧉]'}</span>{' '}
          {label}
        </button>
      </div>
      <pre
        ref={pre}
        tabIndex={0}
        aria-label={status === 'failed' ? m.copyFailed : undefined}
      >
        <code>
          {code.split('\n').map((line, i, lines) => (
            <span
              className={
                line.trimStart().startsWith('#')
                  ? 'soup-docs-comment'
                  : undefined
              }
              key={i}
            >
              {line}
              {i < lines.length - 1 ? '\n' : ''}
            </span>
          ))}
        </code>
      </pre>
      <span className="soup-docs-sr" role="status">
        {status === 'idle' ? '' : label}
      </span>
    </div>
  )
}

function DocNavigation({
  current,
  m,
  language,
  onNavigate,
}: {
  current?: string
  m: Messages
  language: string
  onNavigate?: () => void
}) {
  const [search, setSearch] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const { matches, loading } = useDocumentSearch(search)
  const groups = manifest.navigation
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => {
        const index = documentIndexBySlug.get(link.slug)
        return matches === null || (index !== undefined && matches.has(index))
      }),
    }))
    .filter((group) => group.links.length)
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !(
          event.target instanceof HTMLElement &&
          (event.target.matches('input, textarea, select') ||
            event.target.isContentEditable)
        )
      ) {
        event.preventDefault()
        input.current?.focus()
      }
    }
    document.addEventListener('keydown', shortcut)
    return () => document.removeEventListener('keydown', shortcut)
  }, [])
  return (
    <nav aria-label={m.docsNavigation} className="soup-docs-nav">
      <a
        className="soup-docs-nav-home"
        href={basePath(language)}
        onClick={onNavigate}
      >
        [ ./ ] {m.navDocs}
      </a>
      <label className="soup-docs-search">
        <span className="soup-docs-sr">{m.docsSearch}</span>
        <span aria-hidden="true">/</span>
        <input
          ref={input}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={m.docsSearch}
        />
      </label>
      <div className="soup-docs-nav-groups" lang="en" dir="ltr">
        {groups.map((group) => (
          <div className="soup-docs-nav-group" key={group.title}>
            <p>{group.title}</p>
            <ul>
              {group.links.map((link) => (
                <li key={link.slug}>
                  <a
                    href={`${basePath(language)}/${link.slug}`}
                    aria-current={current === link.slug ? 'page' : undefined}
                    onClick={onNavigate}
                  >
                    <span>{link.title}</span>
                    {link.version && <small>{link.version}</small>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {loading && (
          <p lang={language} role="status" aria-busy="true">
            {m.docsSearch}…
          </p>
        )}
        {!groups.length && !loading && <p lang={language}>{m.docsNoResults}</p>}
      </div>
    </nav>
  )
}

export function Documentation({
  doc,
  m,
  language = 'en',
}: {
  doc: DocPage
  m: Messages
  language?: string
}) {
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [active, setActive] = useState('')
  const article = useRef<HTMLElement>(null)
  useEffect(() => {
    const elements = article.current?.querySelectorAll('h2[id], h3[id]')
    if (!elements?.length || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-100px 0px -65% 0px', threshold: 0 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [doc.slug])
  useEffect(() => {
    if (!navigationOpen) return
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavigationOpen(false)
    }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [navigationOpen])
  return (
    <div className="soup-docs">
      <div className="soup-docs-mobilebar">
        <button
          type="button"
          aria-expanded={navigationOpen}
          aria-controls="soup-docs-sidebar"
          onClick={() => setNavigationOpen(!navigationOpen)}
        >
          [{navigationOpen ? '−' : '+'}]{' '}
          {navigationOpen ? m.close : m.docsOpenNavigation}
        </button>
        <a href="#docs-inline-contents">{m.docsContents} ↓</a>
      </div>
      {navigationOpen && (
        <button
          type="button"
          className="soup-docs-backdrop"
          aria-label={m.close}
          onClick={() => setNavigationOpen(false)}
        />
      )}
      <aside
        id="soup-docs-sidebar"
        className={`soup-docs-sidebar${navigationOpen ? ' is-open' : ''}`}
      >
        <DocNavigation
          current={doc.slug}
          m={m}
          language={language}
          onNavigate={() => setNavigationOpen(false)}
        />
      </aside>
      <div className="soup-docs-main">
        <div className="soup-docs-breadcrumb">
          <a href={basePath(language)}>{m.navDocs}</a>
          <span aria-hidden="true">/</span>
          <span lang="en">{doc.title}</span>
        </div>
        <div className="soup-docs-status">
          <span>
            <span className="soup-docs-dot" aria-hidden="true" />{' '}
            {m.docsEnglish}
          </span>
          <a href={doc.source} target="_blank" rel="noopener noreferrer">
            {m.docsSource} ↗
          </a>
        </div>
        <details
          id="docs-inline-contents"
          className="soup-docs-inline-contents"
        >
          <summary>{m.docsContents}</summary>
          <nav lang="en" dir="ltr">
            <ul>
              {doc.headings.map((heading, i) => (
                <li key={`${heading.id}-${i}`}>
                  <a href={`#${heading.id}`}>{heading.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
        <article
          ref={article}
          className="soup-docs-article"
          lang="en"
          dir="ltr"
          aria-label={doc.title}
        >
          {doc.blocks.map((block, index) =>
            block.kind === 'code' ? (
              <CodeBlock
                key={index}
                code={block.code}
                language={block.language}
                m={m}
              />
            ) : (
              <div
                key={index}
                dangerouslySetInnerHTML={{
                  __html: block.html.replaceAll(
                    '__DOCS_BASE__',
                    basePath(language),
                  ),
                }}
              />
            ),
          )}
        </article>
      </div>
      <aside
        id="docs-contents"
        className="soup-docs-contents"
        aria-label={m.docsContents}
      >
        <p>{m.docsContents}</p>
        <nav lang="en" dir="ltr">
          <ul>
            {doc.headings.map((heading, i) => (
              <li
                key={`${heading.id}-${i}`}
                className={heading.level > 2 ? 'is-nested' : undefined}
              >
                <a
                  href={`#${heading.id}`}
                  aria-current={active === heading.id ? 'location' : undefined}
                >
                  {heading.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#docs-top"
          className="soup-docs-backtop"
          aria-label={m.navStart}
        >
          ↑ ./top
        </a>
      </aside>
    </div>
  )
}

export function DocumentationIndex({
  m,
  language = 'en',
}: {
  m: Messages
  language?: string
}) {
  const [search, setSearch] = useState('')
  const { matches, loading } = useDocumentSearch(search)
  const docs = manifest.documents.filter(
    (_doc, index) => matches === null || matches.has(index),
  )
  return (
    <div className="soup-docs soup-docs-index">
      <aside className="soup-docs-sidebar">
        <DocNavigation m={m} language={language} />
      </aside>
      <div className="soup-docs-main">
        <div className="soup-docs-status">
          <span>
            <span className="soup-docs-dot" aria-hidden="true" />{' '}
            {m.docsEnglish}
          </span>
          <span>131 / DOCUMENTS</span>
        </div>
        <h1>{m.navDocs}</h1>
        <a
          className="soup-docs-index-start"
          href={`${basePath(language)}/getting-started`}
        >
          [ → ] {m.navStart}
        </a>
        <label className="soup-docs-index-search">
          <span>{m.docsSearch}</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={m.docsSearchPlaceholder}
          />
        </label>
        <p
          className="soup-docs-index-count"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading
            ? `${m.docsSearch}…`
            : `${String(docs.length).padStart(3, '0')} / ${manifest.documents.length}`}
        </p>
        <div className="soup-docs-index-list" lang="en" dir="ltr">
          {docs.map((doc, i) => (
            <a href={`${basePath(language)}/${doc.slug}`} key={doc.slug}>
              <span className="soup-docs-index-number">
                {String(i + 1).padStart(3, '0')}
              </span>
              <div>
                <h2>{doc.title}</h2>
                <p>{doc.description}</p>
                <code>./{doc.slug}</code>
              </div>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
          {!docs.length && !loading && <p lang={language}>{m.docsNoResults}</p>}
        </div>
      </div>
    </div>
  )
}
