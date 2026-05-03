import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import { allSearchData } from '../data/searchIndex'

export default function SearchBar() {
  const { dark } = useTheme()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    const found = allSearchData.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.keywords?.some(k => k.toLowerCase().includes(q)) ||
      item.desc?.toLowerCase().includes(q)
    ).slice(0, 8)
    setResults(found)
    setOpen(true)
  }, [query])

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const go = (item) => {
    navigate(item.path)
    setQuery('')
    setOpen(false)
  }

  const inputBg = dark ? 'bg-[#1a1e2a] border-white/10 text-[#e8eaf0] placeholder-[#7a7f94]'
                       : 'bg-[#f0f1f4] border-black/10 text-[#1a1e2a] placeholder-[#aaa]'
  const dropBg  = dark ? 'bg-[#1a1e2a] border-white/10' : 'bg-white border-black/10'
  const itemHov = dark ? 'hover:bg-white/5' : 'hover:bg-black/5'
  const catC    = dark ? 'text-[#4f8ef7]' : 'text-[#185fa5]'

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="검색... (패턴명, 용어, 규칙)"
          className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none transition-colors ${inputBg}`}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 text-xs"
          >✕</button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-xl overflow-hidden z-50 ${dropBg}`}>
          {results.map((item, i) => (
            <button
              key={i}
              onClick={() => go(item)}
              className={`w-full text-left px-4 py-3 border-b last:border-b-0 ${dark ? 'border-white/5' : 'border-black/5'} ${itemHov} transition-colors`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono ${catC}`}>{item.category}</span>
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              {item.desc && <div className="text-xs opacity-50 mt-0.5 truncate">{item.desc}</div>}
            </button>
          ))}
        </div>
      )}

      {open && query && results.length === 0 && (
        <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-xl px-4 py-3 text-sm opacity-50 ${dropBg}`}>
          검색 결과 없음
        </div>
      )}
    </div>
  )
}
