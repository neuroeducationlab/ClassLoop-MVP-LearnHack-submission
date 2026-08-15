import { useEffect, useRef } from 'react'

/**
 * useReveal — attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport the `.reveal` → `.visible` class
 * transition is triggered (defined in index.css).
 *
 * Usage:
 *   const ref = useReveal()
 *   <div ref={ref} className="reveal">…</div>
 *
 * For a container where ALL children should reveal on scroll, pass
 * childrenQuery = 'true' and wrap children with className="reveal".
 */
export function useReveal(childrenQuery?: boolean) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = childrenQuery
      ? Array.from(el.querySelectorAll<HTMLElement>('.reveal'))
      : [el]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
  }, [childrenQuery])

  return ref as React.RefObject<HTMLDivElement>
}
