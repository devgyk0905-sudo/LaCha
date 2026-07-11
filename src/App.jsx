import { useState, createContext, useContext, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Concepts from './pages/Concepts'
import WaveTheory from './pages/WaveTheory'
import CandlePatterns from './pages/CandlePatterns'
import ChannelPatterns from './pages/ChannelPatterns'
import Fibonacci from './pages/Fibonacci'
import Harmonic from './pages/Harmonic'
import SearchBar from './components/SearchBar'
import ThemeToggle from './components/ThemeToggle'
import bgTexture from './assets/bg-texture.png'

export const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

const NAV = [
  { path: '/',          label: '개념·용어' },
  { path: '/candle',    label: '캔들 패턴' },
  { path: '/channel',   label: '채널 패턴' },
  { path: '/wave',      label: '파동 이론' },
  { path: '/fibonacci', label: '피보나치 확장' },
  { path: '/harmonic',  label: '하모닉' },
]

/* ── 로그인 모달 ── */
function LoginModal({ onClose }) {
  const { dark } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputC = dark
    ? 'bg-[#0d0f14] border-white/10 text-[#e8eaf0] placeholder-[#7a7f94]'
    : 'bg-white border-black/10 text-[#1a1e2a] placeholder-gray-400'

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    else onClose()
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <form
        onSubmit={handleLogin}
        className={`flex flex-col gap-3 w-72 p-6 rounded-xl shadow-xl ${dark ? 'bg-[#1a1e2a]' : 'bg-white'}`}
      >
        <p className="text-sm font-semibold mb-2">관리자 로그인</p>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`border rounded px-3 py-2 text-sm outline-none ${inputC}`}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={`border rounded px-3 py-2 text-sm outline-none ${inputC}`}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#3ec97e] text-white rounded px-3 py-2 text-sm hover:opacity-90 transition-opacity"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}

function Layout() {
  const { dark } = useTheme()

  const bgStyle = dark
    ? { backgroundColor: '#0d0f14' }
    : {
        backgroundImage: `url(${bgTexture})`,
        backgroundSize: '400px 266px',
        backgroundRepeat: 'repeat',
        backgroundColor: '#eceae3',
      }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? 'text-[#e8eaf0]' : 'text-[#1c1b18]'}`}
      style={bgStyle}
    >
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-8 page-enter">
        <Routes>
          <Route path="/"          element={<Concepts />} />
          <Route path="/wave"      element={<WaveTheory />} />
          <Route path="/candle"    element={<CandlePatterns />} />
          <Route path="/channel"   element={<ChannelPatterns />} />
          <Route path="/fibonacci" element={<Fibonacci />} />
          <Route path="/harmonic"  element={<Harmonic />} />
        </Routes>
      </main>
      <footer className="max-w-4xl mx-auto px-6 py-6 text-center">
        <p className="text-xs text-[#7a7f94]">© 2026 Chart+Book · All rights reserved</p>
      </footer>
    </div>
  )
}

function Header() {
  const { dark } = useTheme()
  const [clickCount, setClickCount] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const clickTimer = useRef(null)

  function handleLogoClick() {
    setClickCount(prev => {
      const next = prev + 1
      if (next >= 5) {
        setShowLogin(true)
        clearTimeout(clickTimer.current)
        return 0
      }
      clearTimeout(clickTimer.current)
      clickTimer.current = setTimeout(() => setClickCount(0), 2000)
      return next
    })
  }

  const headerStyle = dark
    ? { background: 'rgba(13,15,20,0.82)', backdropFilter: 'blur(18px) saturate(1.2)' }
    : {
        backgroundImage: `url(${bgTexture})`,
        backgroundSize: '400px 266px',
        backgroundRepeat: 'repeat',
        backgroundColor: 'rgba(236,234,227,0.72)',
        backdropFilter: 'blur(18px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.3)',
      }

  const borderC   = dark ? 'border-white/10' : 'border-black/10'
  const activeC   = dark ? 'text-[#e8eaf0] font-medium' : 'text-[#1c1b18] font-medium'
  const inactiveC = dark ? 'text-[#7a7f94] hover:text-[#e8eaf0]' : 'text-[#9a9890] hover:text-[#1c1b18]'

  return (
    <>
      <header className={`sticky top-0 z-50 border-b ${borderC}`} style={headerStyle}>
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-[52px] gap-4">
          {/* 로고 — 5회 클릭 시 로그인 모달 */}
          <div
            className="flex items-center gap-2 shrink-0 cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <div
              className="w-6 h-6 rounded-[7px] flex items-center justify-center"
              style={{ background: dark ? '#e8eaf0' : '#1c1b18' }}
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                <polyline
                  points="1,11 4,6 7,8 10,2 13,4"
                  stroke={dark ? '#0d0f14' : '#eceae3'}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-base tracking-tight leading-none"
              style={{
                fontFamily: "'Georgia', 'DM Serif Display', serif",
                fontWeight: 500,
                letterSpacing: '-0.3px',
              }}
            >
              Chart<span className="text-amber-400">+</span>Book
            </span>
          </div>

          {/* 검색 + 테마토글 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 max-w-[180px]">
              <SearchBar />
            </div>
            <ThemeToggle />
          </div>
        </div>

        <nav className="max-w-4xl mx-auto px-6 flex gap-0 overflow-x-auto">
          {NAV.map(n => (
            <NavLink
              key={n.path}
              to={n.path}
              end={n.path === '/'}
              className={({ isActive }) =>
                `px-4 py-2.5 text-sm whitespace-nowrap transition-colors duration-150 ${isActive ? activeC : inactiveC}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <ThemeContext.Provider value={{ dark, setDark, user }}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}