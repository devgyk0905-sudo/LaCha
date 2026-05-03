import { useState, createContext, useContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Concepts from './pages/Concepts'
import WaveTheory from './pages/WaveTheory'
import CandlePatterns from './pages/CandlePatterns'
import ChannelPatterns from './pages/ChannelPatterns'
import Fibonacci from './pages/Fibonacci'
import Harmonic from './pages/Harmonic'
import SearchBar from './components/SearchBar'
import ThemeToggle from './components/ThemeToggle'

export const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

const NAV = [
  { path: '/',          label: '개념 · 용어' },
  { path: '/wave',      label: '파동 이론' },
  { path: '/candle',    label: '캔들 패턴' },
  { path: '/channel',   label: '채널 패턴' },
  { path: '/fibonacci', label: '피보나치 확장' },
  { path: '/harmonic',  label: '하모닉' },
]

function Layout() {
  const { dark } = useTheme()
  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0d0f14] text-[#e8eaf0]' : 'bg-[#f5f6f8] text-[#1a1e2a]'}`}>
      <Header />
      <main className="max-w-4xl mx-auto px-5 py-8 page-enter">
        <Routes>
          <Route path="/"          element={<Concepts />} />
          <Route path="/wave"      element={<WaveTheory />} />
          <Route path="/candle"    element={<CandlePatterns />} />
          <Route path="/channel"   element={<ChannelPatterns />} />
          <Route path="/fibonacci" element={<Fibonacci />} />
          <Route path="/harmonic"  element={<Harmonic />} />
        </Routes>
      </main>
    </div>
  )
}

function Header() {
  const { dark } = useTheme()
  const borderC   = dark ? 'border-white/10' : 'border-black/10'
  const bgC       = dark ? 'bg-[#13161e]'    : 'bg-white'
  const activeC   = 'text-[#4f8ef7] border-b-2 border-[#4f8ef7]'
  const inactiveC = dark ? 'text-[#7a7f94] hover:text-[#e8eaf0]' : 'text-[#888] hover:text-[#1a1e2a]'

  return (
    <header className={`sticky top-0 z-50 ${bgC} border-b ${borderC}`}>
      <div className="max-w-4xl mx-auto px-5 flex items-center justify-between h-14 gap-4">
        <span className="font-bold text-lg tracking-tight shrink-0">
          <span className="text-[#4f8ef7]">La</span>Cha
        </span>
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
        <ThemeToggle />
      </div>
      <nav className="max-w-4xl mx-auto px-5 flex gap-0 overflow-x-auto">
        {NAV.map(n => (
          <NavLink
            key={n.path}
            to={n.path}
            end={n.path === '/'}
            className={({ isActive }) =>
              `px-4 py-3 text-sm whitespace-nowrap transition-colors ${isActive ? activeC : inactiveC}`
            }
          >
            {n.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default function App() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}
