import { useState } from 'react'
import { useTheme } from '../App'
import { Badge, PageSearch } from '../components/UI'
import { usePageSearch } from '../hooks/usePageSearch'
import ChartNote from '../components/ChartNote'

const CANDLES = [
  { id:1,  cat:'단일봉', name:'도지', signal:'neutral', desc:'시가 ≈ 종가 — 방향 탐색 중', shape:'위아래꼬리 / 몸통 거의 없음', signalText:'방향성 불확실 — 다음 캔들이 중요', note:'고점/저점에서 나오면 반전 가능성', keywords:['도지','방향탐색','중립'] },
  { id:2,  cat:'단일봉', name:'망치형', signal:'up', desc:'아래꼬리 긴 캔들 — 하단 매수세 유입', shape:'아래꼬리 길고 몸통 작음 (위꼬리 없음)', signalText:'하락 추세 바닥에서 반등 신호', note:'음봉 망치형은 신뢰도 낮음', keywords:['망치','해머','하단지지','아래꼬리'] },
  { id:3,  cat:'단일봉', name:'역망치형', signal:'down', desc:'위꼬리 긴 캔들 — 상단 저항 신호', shape:'위꼬리 길고 몸통 작음 (아래꼬리 없음)', signalText:'상승 추세 고점에서 하락 신호', note:'슈팅스타: 고점에서 나오는 역망치 음봉', keywords:['역망치','슈팅스타','상단저항','위꼬리'] },
  { id:4,  cat:'단일봉', name:'장대양봉', signal:'up', desc:'몸통 크고 꼬리 짧은 양봉', shape:'몸통 큼 / 꼬리 짧음', signalText:'강한 매수세', note:'거래량 동반 시 신뢰도 높음', keywords:['장대양봉','강한매수'] },
  { id:5,  cat:'단일봉', name:'장대음봉', signal:'down', desc:'몸통 크고 꼬리 짧은 음봉', shape:'몸통 큼 / 꼬리 짧음', signalText:'강한 매도세', note:'거래량 동반 시 신뢰도 높음', keywords:['장대음봉','강한매도'] },
  { id:6,  cat:'2봉 패턴', name:'상승장악형', signal:'up', desc:'음봉을 감싸는 장대양봉 — 상승 반전 신호', shape:'①장대음봉 → ②장대양봉이 완전히 감쌈', signalText:'하락 후 강한 반등 신호', note:'두 캔들 방향이 반대여야 함 / 거래량 동반 시 신뢰도 높음', keywords:['상승장악형','불리쉬인겔핑','engulfing','장악형'] },
  { id:7,  cat:'2봉 패턴', name:'하락장악형', signal:'down', desc:'양봉을 감싸는 장대음봉 — 하락 반전 신호', shape:'①장대양봉 → ②장대음봉이 완전히 감쌈', signalText:'상승 후 강한 하락 신호', note:'두 캔들 방향이 반대여야 함 / 거래량 동반 시 신뢰도 높음', keywords:['하락장악형','베어리쉬인겔핑','engulfing','장악형'] },
  { id:8,  cat:'3봉 패턴', name:'모닝스타', signal:'up', desc:'하락 추세 바닥에서 나오는 상승 반전 패턴', shape:'①장대음봉 → ②도지/팽이(갭) → ③장대양봉', signalText:'바닥 반전 — 강한 상승 신호', note:'아래꼬리를 길게 남기며 도지캔들 1개까지 허용. 다음봉 또는 다다음봉에서 상승장악형 캔들이 나오면 신뢰도 올라감', keywords:['모닝스타','바닥반전','상승전환'] },
  { id:9,  cat:'3봉 패턴', name:'이브닝스타', signal:'down', desc:'상승 추세 고점에서 나오는 하락 반전 패턴', shape:'①장대양봉 → ②도지/팽이 → ③장대음봉', signalText:'고점 반전 — 하락 신호', note:'위꼬리를 만들며 저항이 강함. 다음봉이 하락장악형 캔들로 컨펌 나오면 주로 하락함', keywords:['이브닝스타','고점반전','하락전환'] },
  { id:10, cat:'3봉 패턴', name:'백삼병', signal:'up', desc:'연속 3개 양봉 — 강한 상승 신호', shape:'연속 3개 양봉 / 각 저점 상승', signalText:'상승 추세 강화', note:'3번째 양봉 저점 이탈 시 무효', keywords:['백삼병','연속양봉','쓰리화이트솔저'] },
  { id:11, cat:'3봉 패턴', name:'흑삼병', signal:'down', desc:'연속 3개 음봉 — 강한 하락 신호', shape:'연속 3개 음봉 / 각 고점 하락', signalText:'하락 추세 강화', note:'1번째 음봉 고점 돌파 시 무효', keywords:['흑삼병','연속음봉','쓰리블랙크로우'] },
  { id:12, cat:'다람쥐꼬리 패턴', name:'하락다람쥐', signal:'down', desc:'양봉을 잡아먹는 음봉 + 도지캔들 1~3개 → 꼬리까지 길게 빠지는 하락 패턴', shape:'①장대양봉 → ②장대음봉(양봉 감쌈) → ③도지 1~3개 → ④하락', signalText:'도지 구간 이후 강한 하락 — 하락 다람쥐꼬리', note:'도지캔들이 1~3개 나온 뒤 꼬리처럼 길게 빠지는 것이 특징', keywords:['하락다람쥐','다람쥐꼬리','하락패턴'] },
  { id:13, cat:'다람쥐꼬리 패턴', name:'상승다람쥐', signal:'up', desc:'음봉을 잡아먹는 양봉 + 도지캔들 → 말아올리는 상승 패턴', shape:'①장대음봉 → ②장대양봉(음봉 감쌈) → ③도지(음양 무관) → ④상승', signalText:'도지 구간 이후 강한 상승 — 상승 다람쥐꼬리', note:'도지캔들 이후 말아올리는 형태가 특징 / 음양 무관', keywords:['상승다람쥐','다람쥐꼬리','상승패턴'] },
  { id:14, cat:'레일로드 트랙 패턴', name:'레일로드 트랙', signal:'down',
    desc:'추세 마지막에 나오는 강력한 반전 신호 — 하락 예견 중 큰 양봉으로 공매도 청산/손절 유발 후 하락',
    shape:'①하락 캔들 패턴 2회 등장 → ②이평선/채널 중단 지지로 큰 장대양봉(순간 급등) → ③이후 하락 반전',
    signalText:'큰 양봉 출현 = 공매도 청산 유발 → 진짜 하락의 시작',
    note:'양봉 거래량이 상승폭 대비 낮음이 핵심 특징.',
    keywords:['레일로드트랙','로드트랙','railroad track'] },
]

const GREEN = '#3ec97e'
const RED   = '#e05a6a'
const GRAY  = '#888780'

function CandleSVG({ name }) {
  const shapes = {
    '도지':       <><line x1="32" y1="8"  x2="32" y2="30" stroke={GRAY}  strokeWidth="1.5"/><rect x="20" y="30" width="24" height="3" fill={GRAY} rx="1"/><line x1="32" y1="33" x2="32" y2="56" stroke={GRAY} strokeWidth="1.5"/></>,
    '망치형':     <><line x1="32" y1="14" x2="32" y2="22" stroke={GREEN} strokeWidth="1.5"/><rect x="22" y="22" width="20" height="14" fill={GREEN} rx="1"/><line x1="32" y1="36" x2="32" y2="60" stroke={GREEN} strokeWidth="1.5"/></>,
    '역망치형':   <><line x1="32" y1="8"  x2="32" y2="30" stroke={RED}   strokeWidth="1.5"/><rect x="22" y="30" width="20" height="14" fill={RED}  rx="1"/><line x1="32" y1="44" x2="32" y2="52" stroke={RED}  strokeWidth="1.5"/></>,
    '장대양봉':   <><line x1="32" y1="10" x2="32" y2="16" stroke={GREEN} strokeWidth="1.5"/><rect x="22" y="16" width="20" height="36" fill={GREEN} rx="1"/><line x1="32" y1="52" x2="32" y2="58" stroke={GREEN} strokeWidth="1.5"/></>,
    '장대음봉':   <><line x1="32" y1="10" x2="32" y2="16" stroke={RED}   strokeWidth="1.5"/><rect x="22" y="16" width="20" height="36" fill={RED}  rx="1"/><line x1="32" y1="52" x2="32" y2="58" stroke={RED}   strokeWidth="1.5"/></>,
    '상승장악형': <><rect x="10" y="20" width="16" height="22" fill={RED}   rx="1"/><rect x="30" y="10" width="20" height="36" fill={GREEN} rx="1"/><line x1="40" y1="6"  x2="40" y2="10" stroke={GREEN} strokeWidth="1.5"/><line x1="40" y1="46" x2="40" y2="52" stroke={GREEN} strokeWidth="1.5"/></>,
    '하락장악형': <><rect x="10" y="18" width="16" height="22" fill={GREEN} rx="1"/><rect x="30" y="8"  width="20" height="38" fill={RED}   rx="1"/><line x1="40" y1="4"  x2="40" y2="8"  stroke={RED}   strokeWidth="1.5"/><line x1="40" y1="46" x2="40" y2="54" stroke={RED}   strokeWidth="1.5"/></>,
    '모닝스타':   <><rect x="4"  y="10" width="12" height="24" fill={RED}   rx="1"/><line x1="10" y1="8"  x2="10" y2="10" stroke={RED}   strokeWidth="1.5"/><line x1="10" y1="34" x2="10" y2="42" stroke={RED}   strokeWidth="1.5"/><rect x="28" y="34" width="8"  height="6"  fill={GRAY}  rx="1"/><line x1="32" y1="30" x2="32" y2="34" stroke={GRAY}  strokeWidth="1.5"/><line x1="32" y1="40" x2="32" y2="46" stroke={GRAY}  strokeWidth="1.5"/><rect x="50" y="14" width="14" height="20" fill={GREEN} rx="1"/><line x1="57" y1="10" x2="57" y2="14" stroke={GREEN} strokeWidth="1.5"/></>,
    '이브닝스타': <><rect x="4"  y="32" width="12" height="22" fill={GREEN} rx="1"/><line x1="10" y1="26" x2="10" y2="32" stroke={GREEN} strokeWidth="1.5"/><rect x="28" y="18" width="8"  height="6"  fill={GRAY}  rx="1"/><line x1="32" y1="12" x2="32" y2="18" stroke={GRAY}  strokeWidth="1.5"/><line x1="32" y1="24" x2="32" y2="30" stroke={GRAY}  strokeWidth="1.5"/><rect x="50" y="30" width="14" height="28" fill={RED}   rx="1"/><line x1="57" y1="26" x2="57" y2="30" stroke={RED}   strokeWidth="1.5"/><line x1="57" y1="58" x2="57" y2="64" stroke={RED}   strokeWidth="1.5"/></>,
    '백삼병':     <><rect x="4"  y="44" width="12" height="18" fill={GREEN} rx="1"/><line x1="10" y1="40" x2="10" y2="44" stroke={GREEN} strokeWidth="1.5"/><rect x="26" y="30" width="14" height="20" fill={GREEN} rx="1"/><line x1="33" y1="26" x2="33" y2="30" stroke={GREEN} strokeWidth="1.5"/><rect x="50" y="14" width="14" height="22" fill={GREEN} rx="1"/><line x1="57" y1="10" x2="57" y2="14" stroke={GREEN} strokeWidth="1.5"/></>,
    '흑삼병':     <><rect x="4"  y="10" width="12" height="18" fill={RED}   rx="1"/><line x1="10" y1="28" x2="10" y2="34" stroke={RED}   strokeWidth="1.5"/><rect x="26" y="22" width="14" height="22" fill={RED}   rx="1"/><line x1="33" y1="44" x2="33" y2="50" stroke={RED}   strokeWidth="1.5"/><rect x="50" y="36" width="14" height="22" fill={RED}   rx="1"/><line x1="57" y1="58" x2="57" y2="64" stroke={RED}   strokeWidth="1.5"/></>,
    '하락다람쥐': <><rect x="2" y="8" width="16" height="52" fill={GREEN} rx="1"/><rect x="22" y="4" width="16" height="60" fill={RED} rx="1"/><rect x="44" y="44" width="8" height="4" fill={RED} rx="1"/><line x1="48" y1="38" x2="48" y2="44" stroke={RED} strokeWidth="1.2"/><line x1="48" y1="48" x2="48" y2="54" stroke={RED} strokeWidth="1.2"/><rect x="56" y="48" width="8" height="4" fill={RED} rx="1"/><line x1="60" y1="42" x2="60" y2="48" stroke={RED} strokeWidth="1.2"/><line x1="60" y1="52" x2="60" y2="58" stroke={RED} strokeWidth="1.2"/></>,
    '상승다람쥐': <><rect x="2" y="8" width="16" height="52" fill={RED} rx="1"/><rect x="22" y="4" width="16" height="58" fill={GREEN} rx="1"/><rect x="44" y="26" width="8" height="4" fill={GRAY} rx="1"/><line x1="48" y1="20" x2="48" y2="26" stroke={GRAY} strokeWidth="1.2"/><line x1="48" y1="30" x2="48" y2="36" stroke={GRAY} strokeWidth="1.2"/><rect x="56" y="18" width="8" height="16" fill={GREEN} rx="1"/><line x1="60" y1="14" x2="60" y2="18" stroke={GREEN} strokeWidth="1.2"/><line x1="60" y1="34" x2="60" y2="38" stroke={GREEN} strokeWidth="1.2"/></>,
    '레일로드 트랙': <><rect x="2" y="10" width="10" height="20" fill={RED} rx="1"/><line x1="7" y1="8" x2="7" y2="10" stroke={RED} strokeWidth="1.2"/><line x1="7" y1="30" x2="7" y2="36" stroke={RED} strokeWidth="1.2"/><rect x="16" y="16" width="10" height="22" fill={RED} rx="1"/><line x1="21" y1="14" x2="21" y2="16" stroke={RED} strokeWidth="1.2"/><line x1="21" y1="38" x2="21" y2="44" stroke={RED} strokeWidth="1.2"/><rect x="32" y="6" width="14" height="52" fill={GREEN} rx="1"/><line x1="39" y1="4" x2="39" y2="6" stroke={GREEN} strokeWidth="1.5"/><line x1="39" y1="58" x2="39" y2="62" stroke={GREEN} strokeWidth="1.5"/><rect x="52" y="20" width="10" height="30" fill={RED} rx="1"/><line x1="57" y1="16" x2="57" y2="20" stroke={RED} strokeWidth="1.2"/><line x1="57" y1="50" x2="57" y2="56" stroke={RED} strokeWidth="1.2"/></>,
  }
  const wide = ['모닝스타','이브닝스타','백삼병','흑삼병','하락다람쥐','상승다람쥐','레일로드 트랙'].includes(name)
  const w = wide ? 76 : 64
  return (
    <svg width={w} height={70} viewBox={`0 0 ${w} 70`} xmlns="http://www.w3.org/2000/svg">
      {shapes[name] || <line x1="32" y1="10" x2="32" y2="60" stroke={GRAY} strokeWidth="1.5"/>}
    </svg>
  )
}

function SignalBadge({ signal }) {
  if (signal === 'up')   return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">상승</span>
  if (signal === 'down') return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">하락</span>
  return <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#7a7f94] border border-white/10">중립</span>
}

function Modal({ item, onClose }) {
  const { dark } = useTheme()
  const bgC   = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const rowBg = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.6)'}} onClick={onClose}>
      <div className={`w-full max-w-lg rounded-2xl border p-6 ${bgC} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${muted}`}>{item.cat}</span>
              <SignalBadge signal={item.signal} />
            </div>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${muted} ${dark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>✕</button>
        </div>

        <div className={`flex gap-4 p-4 rounded-xl mb-4 ${rowBg}`}>
          <div className="shrink-0 flex items-center"><CandleSVG name={item.name} /></div>
          <div className="flex-1 space-y-2">
            {[['설명', item.desc], ['구조', item.shape], ['신호', item.signalText], ['참고', item.note]].map(([label, val]) => (
              <div key={label} className="flex gap-2 text-xs">
                <span className={`${muted} min-w-[28px] shrink-0`}>{label}</span>
                <span className={label === '참고' ? muted : ''}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.keywords.map(k => (
            <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark ? 'bg-white/5 border-white/10 text-[#7a7f94]' : 'bg-black/5 border-black/10 text-gray-500'}`}>{k}</span>
          ))}
        </div>

        <ChartNote page="candle" section={`candle_${item.id}`} label="예시 차트 사진" single={true} />
      </div>
    </div>
  )
}

export default function CandlePatterns() {
  const { dark } = useTheme()
  const { query, setQuery, filtered } = usePageSearch(CANDLES, ['name','desc','keywords','signalText'])
  const [selected, setSelected] = useState(null)
  const muted  = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const catC   = dark ? 'text-[#4f8ef7]' : 'text-[#185fa5]'
  const cardBg = dark ? 'bg-[#13161e] border-white/8 hover:border-white/20' : 'bg-white border-black/8 hover:border-black/20'
  const cats   = [...new Set(CANDLES.map(c => c.cat))]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">캔들 패턴</h1>
        <p className={`text-sm ${muted}`}>단일봉 · 2봉 · 3봉 · 다람쥐꼬리 · 레일로드 트랙 — 클릭하면 상세 보기</p>
      </div>

      <PageSearch query={query} setQuery={setQuery} placeholder="캔들 패턴 검색... (예: 모닝스타, 흑삼병, 다람쥐)" />
      {query && <p className={`text-xs mb-4 ${muted}`}>{filtered.length}개 결과</p>}

      {!query && cats.map(cat => (
        <section key={cat} className="mb-10">
          <h2 className={`text-xs font-mono font-semibold uppercase tracking-widest mb-3 ${catC}`}>{cat}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CANDLES.filter(c => c.cat === cat).map(item => (
              <button key={item.id} onClick={() => setSelected(item)}
                className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${cardBg}`}>
                <CandleSVG name={item.name} />
                <span className="text-sm font-medium text-center">{item.name}</span>
                <SignalBadge signal={item.signal} />
              </button>
            ))}
          </div>
        </section>
      ))}

      {query && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.length === 0
            ? <p className={`text-sm col-span-4 ${muted}`}>검색 결과 없음</p>
            : filtered.map(item => (
              <button key={item.id} onClick={() => setSelected(item)}
                className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${cardBg}`}>
                <CandleSVG name={item.name} />
                <span className="text-sm font-medium text-center">{item.name}</span>
                <SignalBadge signal={item.signal} />
              </button>
            ))
          }
        </div>
      )}

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
