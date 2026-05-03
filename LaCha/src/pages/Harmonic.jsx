import { useState } from 'react'
import { useTheme } from '../App'
import { Card } from '../components/UI'

const TABS = [
  { id: 'cypher', label: '싸이퍼 (Cypher)' },
  { id: 'xabcd',  label: 'XABCD' },
]

export default function Harmonic() {
  const { dark } = useTheme()
  const [active, setActive] = useState('cypher')
  const muted     = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const tabActive  = dark ? 'bg-[#1a1e2a] text-[#4f8ef7] border border-white/10' : 'bg-white text-[#185fa5] border border-black/10 shadow-sm'
  const tabInactive = dark ? 'text-[#7a7f94] hover:text-[#e8eaf0]' : 'text-gray-500 hover:text-gray-800'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">하모닉 패턴</h1>
        <p className={`text-sm ${muted}`}>Harmonic Patterns — 싸이퍼 · XABCD</p>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-8">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active === t.id ? tabActive : tabInactive}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card accent="purple">
        <div className="flex items-center gap-3 py-4">
          <span className="text-2xl">🚧</span>
          <div>
            <p className="font-semibold text-sm">{active === 'cypher' ? '싸이퍼 패턴' : 'XABCD 패턴'} — 추후 추가 예정</p>
            <p className={`text-xs mt-1 ${muted}`}>하모닉 패턴 개념 및 피보나치 비율이 업데이트될 예정입니다.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
