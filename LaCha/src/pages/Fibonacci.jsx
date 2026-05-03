import { useTheme } from '../App'
import { Card, Alert, SectionTitle } from '../components/UI'

export default function Fibonacci() {
  const { dark } = useTheme()
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">추세기반 피보나치 확장</h1>
        <p className={`text-sm ${muted}`}>Trend-Based Fibonacci Extension</p>
      </div>
      <Card accent="amber">
        <div className="flex items-center gap-3 py-4">
          <span className="text-2xl">🚧</span>
          <div>
            <p className="font-semibold text-sm">추후 추가 예정</p>
            <p className={`text-xs mt-1 ${muted}`}>피보나치 확장 개념 및 실전 활용법이 업데이트될 예정입니다.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
