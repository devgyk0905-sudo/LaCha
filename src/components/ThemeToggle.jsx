import { useTheme } from '../App'

export default function ThemeToggle() {
  const { dark, setDark } = useTheme()
  return (
    <button
      onClick={() => setDark(d => !d)}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-colors hover:bg-white/10"
      title={dark ? '라이트 모드' : '다크 모드'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
