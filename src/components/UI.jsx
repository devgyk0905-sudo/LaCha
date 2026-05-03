import { useTheme } from '../App'

export function Card({ children, className = '', accent }) {
  const { dark } = useTheme()
  const base = dark ? 'bg-[#13161e] border-white/8' : 'bg-white border-black/8'
  const accentMap = {
    blue:   dark ? 'border-l-4 border-l-[#4f8ef7]' : 'border-l-4 border-l-[#185fa5]',
    teal:   dark ? 'border-l-4 border-l-[#2abfb0]' : 'border-l-4 border-l-[#0f6e56]',
    amber:  dark ? 'border-l-4 border-l-[#f0a040]' : 'border-l-4 border-l-[#854f0b]',
    red:    dark ? 'border-l-4 border-l-[#e05a6a]' : 'border-l-4 border-l-[#a32d2d]',
    purple: dark ? 'border-l-4 border-l-[#9b7de8]' : 'border-l-4 border-l-[#534ab7]',
    green:  dark ? 'border-l-4 border-l-[#3ec97e]' : 'border-l-4 border-l-[#3b6d11]',
  }
  return (
    <div className={`rounded-xl border p-5 ${base} ${accent ? accentMap[accent] : ''} ${className}`}>
      {children}
    </div>
  )
}

export function Badge({ children, color = 'blue' }) {
  const colorMap = {
    blue:   'bg-blue-500/15 text-blue-400 border-blue-500/25',
    green:  'bg-green-500/15 text-green-400 border-green-500/25',
    red:    'bg-red-500/15 text-red-400 border-red-500/25',
    amber:  'bg-amber-500/15 text-amber-400 border-amber-500/25',
    teal:   'bg-teal-500/15 text-teal-400 border-teal-500/25',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    gray:   'bg-gray-500/15 text-gray-400 border-gray-500/25',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${colorMap[color]}`}>
      {children}
    </span>
  )
}

export function Alert({ children, type = 'blue' }) {
  const { dark } = useTheme()
  const map = {
    blue:   { border: 'border-l-[#4f8ef7]', bg: dark ? 'bg-blue-500/5'  : 'bg-blue-50' },
    amber:  { border: 'border-l-[#f0a040]', bg: dark ? 'bg-amber-500/5' : 'bg-amber-50' },
    red:    { border: 'border-l-[#e05a6a]', bg: dark ? 'bg-red-500/5'   : 'bg-red-50' },
    green:  { border: 'border-l-[#3ec97e]', bg: dark ? 'bg-green-500/5' : 'bg-green-50' },
  }
  return (
    <div className={`border-l-4 ${map[type].border} ${map[type].bg} rounded-r-lg px-4 py-3 text-sm my-3`}>
      {children}
    </div>
  )
}

export function Table({ headers, rows }) {
  const { dark } = useTheme()
  const thC = dark ? 'bg-[#1a1e2a] text-[#7a7f94] border-white/10' : 'bg-gray-50 text-gray-500 border-black/10'
  const tdC = dark ? 'border-white/6' : 'border-black/6'
  const trH = dark ? 'hover:bg-white/2' : 'hover:bg-black/2'
  return (
    <div className="overflow-x-auto rounded-lg border border-white/8 mt-3">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`px-4 py-2.5 text-left text-xs font-medium border-b ${thC}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b last:border-b-0 ${tdC} ${trH} transition-colors`}>
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 align-top leading-relaxed border-b ${tdC}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SectionTitle({ children, color = 'blue' }) {
  const dotMap = {
    blue: 'bg-[#4f8ef7]', teal: 'bg-[#2abfb0]',
    amber: 'bg-[#f0a040]', purple: 'bg-[#9b7de8]',
    green: 'bg-[#3ec97e]', red: 'bg-[#e05a6a]',
  }
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-bold mb-1">
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotMap[color]}`} />
      {children}
    </h2>
  )
}

export function Code({ children }) {
  const { dark } = useTheme()
  return (
    <code className={`font-mono text-xs px-1.5 py-0.5 rounded ${dark ? 'bg-[#1a1e2a] text-[#2abfb0]' : 'bg-gray-100 text-[#0f6e56]'}`}>
      {children}
    </code>
  )
}

export function PageSearch({ query, setQuery, placeholder = '이 페이지 내 검색...' }) {
  const { dark } = useTheme()
  const inputC = dark
    ? 'bg-[#1a1e2a] border-white/10 text-[#e8eaf0] placeholder-[#7a7f94]'
    : 'bg-gray-50 border-black/10 text-[#1a1e2a] placeholder-gray-400'
  return (
    <div className="relative mb-6">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-sm">🔍</span>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none ${inputC}`}
      />
      {query && (
        <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 text-xs">✕</button>
      )}
    </div>
  )
}
