import { useState, useMemo } from 'react'

export function usePageSearch(items, keys = ['title', 'desc', 'keywords']) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(item =>
      keys.some(key => {
        const val = item[key]
        if (!val) return false
        if (Array.isArray(val)) return val.some(v => v.toLowerCase().includes(q))
        return val.toLowerCase().includes(q)
      })
    )
  }, [query, items])

  return { query, setQuery, filtered }
}
