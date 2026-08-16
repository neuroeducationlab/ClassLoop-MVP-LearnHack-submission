import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { DICTIONARY_EN, PATTERN_RULES } from '@/data/dictionary-en'

/**
 * Whole-app Thai → English layer.
 *
 * Rather than threading t('key') through ~500 strings in 17 files, this walks
 * the rendered text nodes and swaps any phrase found in DICTIONARY_EN. That way
 * one table covers the UI *and* the seed content (quiz stems, activity steps,
 * community posts) that pages render straight from data.
 *
 * Trade-off, stated plainly: this is a presentation-grade layer, not production
 * i18n. It translates what it can find and leaves anything unmapped in Thai.
 * A real build would move these strings into per-component keys.
 *
 * Mechanics that keep it safe under React:
 *  - originals are remembered per text node, so switching back to Thai restores
 *    the exact source text instead of round-tripping through the dictionary
 *  - a MutationObserver re-translates nodes React re-renders or newly mounts
 *  - `busy` guards our own writes so the observer never feeds itself
 */

const THAI = /[฀-๿]/

/** Attributes worth translating — placeholders and labels are user-visible. */
const ATTRS = ['placeholder', 'aria-label', 'title'] as const

const originalText = new WeakMap<Text, string>()
const originalAttr = new WeakMap<Element, Map<string, string>>()

let busy = false

/** Exact phrase first, then runtime-composed patterns. */
function lookup(text: string): string | undefined {
  const exact = DICTIONARY_EN[text]
  if (exact) return exact
  for (const { re, to } of PATTERN_RULES) {
    if (re.test(text)) return text.replace(re, to)
  }
  return undefined
}

function translateTextNode(node: Text) {
  const source = originalText.get(node) ?? node.nodeValue ?? ''
  if (!THAI.test(source)) return

  const hit = lookup(source.trim())
  if (!hit) return

  if (!originalText.has(node)) originalText.set(node, source)
  // preserve the node's original leading/trailing whitespace
  const [, lead = '', , trail = ''] = source.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? []
  node.nodeValue = `${lead}${hit}${trail}`
}

function translateAttrs(el: Element) {
  for (const attr of ATTRS) {
    const stored = originalAttr.get(el)?.get(attr)
    const source = stored ?? el.getAttribute(attr)
    if (!source || !THAI.test(source)) continue

    const hit = lookup(source.trim())
    if (!hit) continue

    if (!stored) {
      const map = originalAttr.get(el) ?? new Map<string, string>()
      map.set(attr, source)
      originalAttr.set(el, map)
    }
    el.setAttribute(attr, hit)
  }
}

function walk(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text)
    return
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return

  const el = root as Element
  if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return
  translateAttrs(el)

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  let cur = walker.nextNode()
  while (cur) {
    nodes.push(cur as Text)
    cur = walker.nextNode()
  }
  for (const n of nodes) translateTextNode(n)

  for (const child of el.querySelectorAll('[placeholder], [aria-label], [title]')) {
    translateAttrs(child)
  }
}

function restore(root: Element) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let cur = walker.nextNode()
  while (cur) {
    const original = originalText.get(cur as Text)
    if (original !== undefined) (cur as Text).nodeValue = original
    cur = walker.nextNode()
  }
  for (const el of [root, ...root.querySelectorAll('[placeholder], [aria-label], [title]')]) {
    const map = originalAttr.get(el)
    if (!map) continue
    for (const [attr, value] of map) el.setAttribute(attr, value)
  }
}

export default function AutoTranslate() {
  const { lang } = useApp()

  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return

    if (lang !== 'en') {
      busy = true
      restore(root)
      busy = false
      return
    }

    const run = (fn: () => void) => {
      busy = true
      fn()
      busy = false
    }

    run(() => walk(root))

    const observer = new MutationObserver((records) => {
      if (busy) return
      run(() => {
        for (const rec of records) {
          if (rec.type === 'characterData') {
            // React replaced the text — forget the stale original first
            originalText.delete(rec.target as Text)
            translateTextNode(rec.target as Text)
          } else if (rec.type === 'attributes' && rec.target instanceof Element) {
            originalAttr.get(rec.target)?.delete(rec.attributeName ?? '')
            translateAttrs(rec.target)
          } else {
            for (const added of rec.addedNodes) walk(added)
          }
        }
      })
    })

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRS],
    })

    return () => observer.disconnect()
  }, [lang])

  return null
}
