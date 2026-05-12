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
import bgTexture from './assets/bg-texture.png'

export const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

const NAV = [
  { path: '/candle',    label: '캔들 패턴' },
  { path: '/channel',   label: '채널 패턴' },
  { path: '/wave',      label: '파동 이론' },
  { path: '/',          label: '개념·용어' },
  { path: '/fibonacci', label: '피보나치 확장' },
  { path: '/harmonic',  label: '하모닉' },
]

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
        <p className="text-xs text-[#7a7f94]">© 2026 Lady&Chart · All rights reserved</p>
      </footer>
    </div>
  )
}

function Header() {
  const { dark, setDark } = useTheme()

  /* 라이트: 종이 텍스처 + 블러로 뒤 비침 / 다크: 기존 반투명 */
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

  /* 활성 탭: 텍스트 색상만, 박스 없음 */
  const activeC   = dark
    ? 'text-[#e8eaf0] font-medium'
    : 'text-[#1c1b18] font-medium'
  const inactiveC = dark
    ? 'text-[#7a7f94] hover:text-[#e8eaf0]'
    : 'text-[#9a9890] hover:text-[#1c1b18]'

  return (
    <header
      className={`sticky top-0 z-50 border-b ${borderC}`}
      style={headerStyle}
    >
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-[52px] gap-4">

        {/* 로고 */}
        <div className="flex items-center gap-2 shrink-0">
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
            className="text-base tracking-tight"
            style={{
              fontFamily: "'Georgia', 'DM Serif Display', serif",
              fontWeight: 500,
              letterSpacing: '-0.3px',
            }}
          >
            Lady&amp;Chart
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

      {/* 네비게이션 — 활성 탭 박스 없이 텍스트 색상만 */}
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
  )
}

export default function App() {
  /* 라이트 모드 디폴트 */
  const [dark, setDark] = useState(false)

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