import { useState } from 'react'
import { useTheme } from '../App'
import { PageSearch } from '../components/UI'
import { usePageSearch } from '../hooks/usePageSearch'
import ChartNote from '../components/ChartNote'

/* ── 데이터 ── */
const SINGLE = [
  { id:1,  cat:'단일 패턴', name:'도지', signal:'neutral', desc:'시가 ≈ 종가 — 방향 탐색 중', shape:'위아래꼬리 / 몸통 거의 없음', signalText:'방향성 불확실 — 다음 캔들이 중요', note:'고점/저점에서 나오면 반전 가능성', keywords:['도지','방향탐색','중립'] },
  { id:2,  cat:'단일 패턴', name:'망치형', signal:'up', desc:'아래꼬리 긴 캔들 — 하단 매수세 유입', shape:'아래꼬리 길고 몸통 작음 (위꼬리 없음)', signalText:'하락 추세 바닥에서 반등 신호', note:'음봉 망치형은 신뢰도 낮음', keywords:['망치','해머','하단지지','아래꼬리'] },
  { id:3,  cat:'단일 패턴', name:'역망치형', signal:'down', desc:'위꼬리 긴 캔들 — 상단 저항 신호', shape:'위꼬리 길고 몸통 작음 (아래꼬리 없음)', signalText:'상승 추세 고점에서 하락 신호', note:'슈팅스타: 고점에서 나오는 역망치 음봉', keywords:['역망치','슈팅스타','상단저항','위꼬리'] },
  { id:4,  cat:'단일 패턴', name:'장대양봉', signal:'up', desc:'몸통 크고 꼬리 짧은 양봉', shape:'몸통 큼 / 꼬리 짧음', signalText:'강한 매수세', note:'거래량 동반 시 신뢰도 높음', keywords:['장대양봉','강한매수'] },
  { id:5,  cat:'단일 패턴', name:'장대음봉', signal:'down', desc:'몸통 크고 꼬리 짧은 음봉', shape:'몸통 큼 / 꼬리 짧음', signalText:'강한 매도세', note:'거래량 동반 시 신뢰도 높음', keywords:['장대음봉','강한매도'] },
]

const REVERSAL = [
  { id:6,  cat:'추세 전환형', name:'상승장악형', signal:'up', desc:'음봉을 감싸는 장대양봉 — 상승 반전 신호', shape:'①장대음봉 → ②장대양봉이 완전히 감쌈', signalText:'하락 후 강한 반등 신호', note:'두 캔들 방향이 반대여야 함 / 거래량 동반 시 신뢰도 높음', keywords:['상승장악형','불리쉬인겔핑','engulfing','장악형'] },
  { id:7,  cat:'추세 전환형', name:'하락장악형', signal:'down', desc:'양봉을 감싸는 장대음봉 — 하락 반전 신호', shape:'①장대양봉 → ②장대음봉이 완전히 감쌈', signalText:'상승 후 강한 하락 신호', note:'두 캔들 방향이 반대여야 함 / 거래량 동반 시 신뢰도 높음', keywords:['하락장악형','베어리쉬인겔핑','engulfing','장악형'] },
  { id:8,  cat:'추세 전환형', name:'모닝스타', signal:'up', desc:'하락 추세 바닥에서 나오는 상승 반전 패턴', shape:'①장대음봉 → ②십자도지(갭) → ③장대양봉', signalText:'바닥 반전 — 강한 상승 신호', note:'도지캔들 1개까지 허용. 다음봉 상승장악형 컨펌 시 신뢰도 상승', keywords:['모닝스타','바닥반전','상승전환'] },
  { id:9,  cat:'추세 전환형', name:'이브닝스타', signal:'down', desc:'상승 추세 고점에서 나오는 하락 반전 패턴', shape:'①장대양봉 → ②십자도지 → ③장대음봉', signalText:'고점 반전 — 하락 신호', note:'위꼬리를 만들며 저항이 강함. 다음봉 하락장악형 컨펌 시 신뢰도 상승', keywords:['이브닝스타','고점반전','하락전환'] },
]

const CONTINUATION = [
  { id:10, cat:'추세 지속형', name:'백삼병', signal:'up', desc:'연속 3개 양봉 — 강한 상승 신호', shape:'연속 3개 양봉 / 각 저점 상승', signalText:'상승 추세 강화', note:['1번째 양봉 저점 훼손 시 무효' , '아래꼬리 동반 시 신뢰도 더 높음'], keywords:['백삼병','연속양봉','쓰리화이트솔저'] },
  { id:11, cat:'추세 지속형', name:'흑삼병', signal:'down', desc:'연속 3개 음봉 — 강한 하락 신호', shape:'연속 3개 음봉 / 각 고점 하락', signalText:'하락 추세 강화', note:['1번째 음봉 고점 훼손 시 무효' , '위꼬리 동반 시 신뢰도 더 높음'], keywords:['흑삼병','연속음봉','쓰리블랙크로우'] },
]

const SPECIAL = [
  { id:12, cat:'추세 전환형', name:'다람쥐 패턴', signal:'both', desc:'장악형 이후 도지 출현 — 상승/하락 반전 신호', keywords:['다람쥐','다람쥐꼬리','상승다람쥐','하락다람쥐'] },
  { id:13, cat:'추세 전환형', name:'로드트랙 패턴', signal:'both', desc:'추세 마지막 강한 반전 — 불리쉬/베어리쉬', keywords:['로드트랙','레일로드트랙','railroad track','불리쉬','베어리쉬'] },
  { id:14, cat:'추세 전환형', name:'FVG', signal:'both', desc:'3캔들 사이 가격 공백 — 되돌림 지지/저항 역할', keywords:['FVG','fair value gap','공정가치갭','공백'] },
]

const ALL_CANDLES = [...SINGLE, ...REVERSAL, ...CONTINUATION, ...SPECIAL]

const GREEN = '#3ec97e'
const RED   = '#e05a6a'
const GRAY  = '#888780'

/* ── SVG ── */
function CandleSVG({ name, variant }) {
  const shapes = {
    '도지': <><line x1="32" y1="8" x2="32" y2="30" stroke={GRAY} strokeWidth="1.5"/><rect x="20" y="30" width="24" height="3" fill={GRAY} rx="1"/><line x1="32" y1="33" x2="32" y2="56" stroke={GRAY} strokeWidth="1.5"/></>,
    '망치형': <><line x1="32" y1="14" x2="32" y2="22" stroke={GREEN} strokeWidth="1.5"/><rect x="22" y="22" width="20" height="14" fill={GREEN} rx="1"/><line x1="32" y1="36" x2="32" y2="60" stroke={GREEN} strokeWidth="1.5"/></>,
    '역망치형': <><line x1="32" y1="8" x2="32" y2="30" stroke={RED} strokeWidth="1.5"/><rect x="22" y="30" width="20" height="14" fill={RED} rx="1"/><line x1="32" y1="44" x2="32" y2="52" stroke={RED} strokeWidth="1.5"/></>,
    '장대양봉': <><line x1="32" y1="10" x2="32" y2="16" stroke={GREEN} strokeWidth="1.5"/><rect x="22" y="16" width="20" height="36" fill={GREEN} rx="1"/><line x1="32" y1="52" x2="32" y2="58" stroke={GREEN} strokeWidth="1.5"/></>,
    '장대음봉': <><line x1="32" y1="10" x2="32" y2="16" stroke={RED} strokeWidth="1.5"/><rect x="22" y="16" width="20" height="36" fill={RED} rx="1"/><line x1="32" y1="52" x2="32" y2="58" stroke={RED} strokeWidth="1.5"/></>,
    '상승장악형': <>
      <line x1="18" y1="22" x2="18" y2="26" stroke={RED} strokeWidth="1.5"/>
      <rect x="12" y="26" width="12" height="18" fill={RED} rx="1"/>
      <line x1="18" y1="44" x2="18" y2="48" stroke={RED} strokeWidth="1.5"/>
      <line x1="46" y1="6" x2="46" y2="12" stroke={GREEN} strokeWidth="1.5"/>
      <rect x="40" y="12" width="12" height="50" fill={GREEN} rx="1"/>
      <line x1="46" y1="62" x2="46" y2="66" stroke={GREEN} strokeWidth="1.5"/>
    </>,
    '하락장악형': <>
      <line x1="18" y1="22" x2="18" y2="26" stroke={GREEN} strokeWidth="1.5"/>
      <rect x="12" y="26" width="12" height="18" fill={GREEN} rx="1"/>
      <line x1="18" y1="44" x2="18" y2="48" stroke={GREEN} strokeWidth="1.5"/>
      <line x1="46" y1="6" x2="46" y2="12" stroke={RED} strokeWidth="1.5"/>
      <rect x="40" y="12" width="12" height="50" fill={RED} rx="1"/>
      <line x1="46" y1="62" x2="46" y2="66" stroke={RED} strokeWidth="1.5"/>
    </>,
    '모닝스타': <>
      <line x1="13" y1="6" x2="13" y2="12" stroke={RED} strokeWidth="1.5"/>
      <rect x="7" y="12" width="12" height="32" fill={RED} rx="1"/>
      <line x1="13" y1="44" x2="13" y2="50" stroke={RED} strokeWidth="1.5"/>
      <line x1="38" y1="36" x2="38" y2="44" stroke={GRAY} strokeWidth="1.5"/>
      <line x1="32" y1="44" x2="44" y2="44" stroke={GRAY} strokeWidth="1.5"/>
      <line x1="38" y1="44" x2="38" y2="52" stroke={GRAY} strokeWidth="1.5"/>
      <line x1="63" y1="6" x2="63" y2="12" stroke={GREEN} strokeWidth="1.5"/>
      <rect x="57" y="12" width="12" height="32" fill={GREEN} rx="1"/>
      <line x1="63" y1="44" x2="63" y2="50" stroke={GREEN} strokeWidth="1.5"/>
    </>,
    '이브닝스타': <>
      <line x1="13" y1="18" x2="13" y2="24" stroke={GREEN} strokeWidth="1.5"/>
      <rect x="7" y="24" width="12" height="32" fill={GREEN} rx="1"/>
      <line x1="13" y1="56" x2="13" y2="62" stroke={GREEN} strokeWidth="1.5"/>
      <line x1="38" y1="10" x2="38" y2="18" stroke={GRAY} strokeWidth="1.5"/>
      <line x1="32" y1="18" x2="44" y2="18" stroke={GRAY} strokeWidth="1.5"/>
      <line x1="38" y1="18" x2="38" y2="26" stroke={GRAY} strokeWidth="1.5"/>
      <line x1="63" y1="18" x2="63" y2="24" stroke={RED} strokeWidth="1.5"/>
      <rect x="57" y="24" width="12" height="32" fill={RED} rx="1"/>
      <line x1="63" y1="56" x2="63" y2="62" stroke={RED} strokeWidth="1.5"/>
    </>,
    '백삼병': <>
      <rect x="4" y="44" width="12" height="18" fill={GREEN} rx="1"/>
      <line x1="10" y1="40" x2="10" y2="44" stroke={GREEN} strokeWidth="1.5"/>
      <rect x="26" y="30" width="14" height="20" fill={GREEN} rx="1"/>
      <line x1="33" y1="26" x2="33" y2="30" stroke={GREEN} strokeWidth="1.5"/>
      <rect x="50" y="14" width="14" height="22" fill={GREEN} rx="1"/>
      <line x1="57" y1="10" x2="57" y2="14" stroke={GREEN} strokeWidth="1.5"/>
    </>,
    '흑삼병': <>
      <rect x="4" y="10" width="12" height="18" fill={RED} rx="1"/>
      <line x1="10" y1="28" x2="10" y2="34" stroke={RED} strokeWidth="1.5"/>
      <rect x="26" y="22" width="14" height="22" fill={RED} rx="1"/>
      <line x1="33" y1="44" x2="33" y2="50" stroke={RED} strokeWidth="1.5"/>
      <rect x="50" y="36" width="14" height="22" fill={RED} rx="1"/>
      <line x1="57" y1="58" x2="57" y2="64" stroke={RED} strokeWidth="1.5"/>
    </>,
  }

  const squirrelUp = <>
    <rect x="4" y="16" width="18" height="52" fill={GREEN} rx="1"/>
    <rect x="26" y="12" width="18" height="60" fill={RED} rx="1"/>
    <line x1="54" y1="4" x2="54" y2="10" stroke={RED} strokeWidth="1.5"/>
    <rect x="48" y="10" width="12" height="5" fill={RED} rx="1"/>
    <line x1="54" y1="15" x2="54" y2="20" stroke={RED} strokeWidth="1.5"/>
    <line x1="70" y1="4" x2="70" y2="8" stroke={GREEN} strokeWidth="1.5"/>
    <rect x="64" y="8" width="12" height="14" fill={GREEN} rx="1"/>
    <line x1="70" y1="22" x2="70" y2="26" stroke={GREEN} strokeWidth="1.5"/>
  </>
  const squirrelDown = <>
    <rect x="4" y="8" width="18" height="44" fill={GREEN} rx="1"/>
    <rect x="26" y="4" width="18" height="52" fill={RED} rx="1"/>
    <line x1="52" y1="52" x2="52" y2="58" stroke={RED} strokeWidth="1.5"/>
    <rect x="46" y="58" width="12" height="5" fill={RED} rx="1"/>
    <line x1="52" y1="63" x2="52" y2="68" stroke={RED} strokeWidth="1.5"/>
    <line x1="68" y1="60" x2="68" y2="66" stroke={RED} strokeWidth="1.5"/>
    <rect x="62" y="66" width="12" height="5" fill={RED} rx="1"/>
    <line x1="68" y1="71" x2="68" y2="76" stroke={RED} strokeWidth="1.5"/>
  </>

  const roadUp = <>
    <line x1="14" y1="8" x2="14" y2="28" stroke={GRAY} strokeWidth="1.5" strokeLinecap="round"/>
    <polygon points="14,28 11,22 17,22" fill={GRAY}/>
    <line x1="62" y1="8" x2="62" y2="28" stroke={GRAY} strokeWidth="1.5" strokeLinecap="round"/>
    <polygon points="62,28 59,22 65,22" fill={GRAY}/>
    <line x1="29" y1="32" x2="29" y2="36" stroke={RED} strokeWidth="1.5"/>
    <rect x="23" y="36" width="12" height="28" fill={RED} rx="1"/>
    <line x1="29" y1="64" x2="29" y2="68" stroke={RED} strokeWidth="1.5"/>
    <line x1="47" y1="32" x2="47" y2="36" stroke={GREEN} strokeWidth="1.5"/>
    <rect x="41" y="36" width="12" height="28" fill={GREEN} rx="1"/>
    <line x1="47" y1="64" x2="47" y2="68" stroke={GREEN} strokeWidth="1.5"/>
  </>
  const roadDown = <>
    <line x1="14" y1="72" x2="14" y2="52" stroke={GRAY} strokeWidth="1.5" strokeLinecap="round"/>
    <polygon points="14,52 11,58 17,58" fill={GRAY}/>
    <line x1="62" y1="72" x2="62" y2="52" stroke={GRAY} strokeWidth="1.5" strokeLinecap="round"/>
    <polygon points="62,52 59,58 65,58" fill={GRAY}/>
    <line x1="29" y1="12" x2="29" y2="16" stroke={GREEN} strokeWidth="1.5"/>
    <rect x="23" y="16" width="12" height="28" fill={GREEN} rx="1"/>
    <line x1="29" y1="44" x2="29" y2="48" stroke={GREEN} strokeWidth="1.5"/>
    <line x1="47" y1="12" x2="47" y2="16" stroke={RED} strokeWidth="1.5"/>
    <rect x="41" y="16" width="12" height="28" fill={RED} rx="1"/>
    <line x1="47" y1="44" x2="47" y2="48" stroke={RED} strokeWidth="1.5"/>
  </>

  const fvgUp = <>
    <rect x="2" y="18" width="70" height="36" fill="rgba(62,201,126,0.15)" stroke={GREEN} strokeWidth="0.8" rx="1"/>
    <line x1="14" y1="40" x2="14" y2="46" stroke={RED} strokeWidth="1.5"/>
    <rect x="8" y="46" width="12" height="22" fill={RED} rx="1"/>
    <line x1="14" y1="68" x2="14" y2="74" stroke={RED} strokeWidth="1.5"/>
    <line x1="38" y1="4" x2="38" y2="12" stroke={GREEN} strokeWidth="1.5"/>
    <rect x="32" y="12" width="14" height="42" fill={GREEN} rx="1"/>
    <line x1="38" y1="54" x2="38" y2="60" stroke={GREEN} strokeWidth="1.5"/>
    <line x1="60" y1="12" x2="60" y2="18" stroke={GREEN} strokeWidth="1.5"/>
    <rect x="54" y="18" width="12" height="18" fill={GREEN} rx="1"/>
    <line x1="60" y1="36" x2="60" y2="42" stroke={GREEN} strokeWidth="1.5"/>
    <line x1="68" y1="18" x2="68" y2="54" stroke={GREEN} strokeWidth="1"/>
    <polygon points="68,18 65,24 71,24" fill={GREEN}/>
    <polygon points="68,54 65,48 71,48" fill={GREEN}/>
  </>
  const fvgDown = <>
    <rect x="2" y="26" width="70" height="36" fill="rgba(224,90,106,0.15)" stroke={RED} strokeWidth="0.8" rx="1"/>
    <line x1="14" y1="6" x2="14" y2="12" stroke={GREEN} strokeWidth="1.5"/>
    <rect x="8" y="12" width="12" height="20" fill={GREEN} rx="1"/>
    <line x1="14" y1="32" x2="14" y2="38" stroke={GREEN} strokeWidth="1.5"/>
    <line x1="38" y1="18" x2="38" y2="26" stroke={RED} strokeWidth="1.5"/>
    <rect x="32" y="26" width="14" height="42" fill={RED} rx="1"/>
    <line x1="38" y1="68" x2="38" y2="76" stroke={RED} strokeWidth="1.5"/>
    <line x1="60" y1="26" x2="60" y2="32" stroke={RED} strokeWidth="1.5"/>
    <rect x="54" y="32" width="12" height="18" fill={RED} rx="1"/>
    <line x1="60" y1="50" x2="60" y2="56" stroke={RED} strokeWidth="1.5"/>
    <line x1="68" y1="26" x2="68" y2="62" stroke={RED} strokeWidth="1"/>
    <polygon points="68,26 65,32 71,32" fill={RED}/>
    <polygon points="68,62 65,56 71,56" fill={RED}/>
  </>

  const wide  = ['모닝스타','이브닝스타','백삼병','흑삼병','상승장악형','하락장악형'].includes(name)
  const xwide = ['다람쥐 패턴','로드트랙 패턴','FVG'].includes(name)
  const w = xwide ? 80 : wide ? 76 : 64
  const h = xwide ? 80 : 70

  let content = shapes[name]
  if (name === '다람쥐 패턴')   content = variant === 'up' ? squirrelUp   : squirrelDown
  if (name === '로드트랙 패턴') content = variant === 'up' ? roadUp       : roadDown
  if (name === 'FVG')           content = variant === 'down' ? fvgDown    : fvgUp

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      {content || <line x1="32" y1="10" x2="32" y2="60" stroke={GRAY} strokeWidth="1.5"/>}
    </svg>
  )
}

function SignalBadge({ signal }) {
  if (signal === 'up')   return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">상승</span>
  if (signal === 'down') return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">하락</span>
  if (signal === 'both') return (
    <div className="flex gap-1">
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">상승</span>
      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">하락</span>
    </div>
  )
  return <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#7a7f94] border border-white/10">중립</span>
}

/* ── 일반 모달 ── */
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
            <span className={label === '참고' ? muted : ''}>
              {label === '참고' && Array.isArray(val)
                ? val.map((v, i) => <span key={i} className="block">{v}</span>)
                : val}
            </span>
          </div>
        ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.keywords.map(k => (
            <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark ? 'bg-white/5 border-white/10 text-[#7a7f94]' : 'bg-black/5 border-black/10 text-gray-500'}`}>{k}</span>
          ))}
        </div>
        <ChartNote page="candle" section={`candle_${item.id}`} single={true} />
      </div>
    </div>
  )
}

/* ── 다람쥐 모달 ── */
function SquirrelModal({ onClose }) {
  const { dark } = useTheme()
  const [tab, setTab] = useState('up')
  const bgC        = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted      = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const rowBg      = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'
  const tabActive  = 'bg-green-500/10 text-green-400 border border-green-500/20'
  const tabActiveD = 'bg-red-500/10 text-red-400 border border-red-500/20'
  const tabInactive = dark ? 'text-[#7a7f94] border border-white/10' : 'text-gray-400 border border-black/10'

  const data = {
    up:   { desc:'음봉을 잡아먹는 양봉 + 도지 → 말아올리는 상승 패턴', shape:'①장대음봉 → ②장대양봉(음봉 감쌈) → ③도지 → ④상승', signalText:'도지 이후 강한 상승', note:'도지캔들 이후 말아올리는 형태 / 음양 무관' },
    down: { desc:'양봉을 잡아먹는 음봉 + 도지 → 꼬리처럼 빠지는 하락 패턴', shape:'①장대양봉 → ②장대음봉(양봉 감쌈) → ③도지 1~3개 → ④하락', signalText:'도지 이후 강한 하락', note:'도지캔들 1~3개 나온 뒤 꼬리처럼 길게 빠짐' },
  }
  const cur = data[tab]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.6)'}} onClick={onClose}>
      <div className={`w-full max-w-lg rounded-2xl border p-6 ${bgC} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">다람쥐 패턴</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${muted}`}>추세 전환형</span>
              <SignalBadge signal="both" />
            </div>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${muted} ${dark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>✕</button>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('up')}   className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'up'   ? tabActive  : tabInactive}`}>상승다람쥐</button>
          <button onClick={() => setTab('down')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'down' ? tabActiveD : tabInactive}`}>하락다람쥐</button>
        </div>
        <div className={`flex gap-4 p-4 rounded-xl mb-4 ${rowBg}`}>
          <div className="shrink-0 flex items-center"><CandleSVG name="다람쥐 패턴" variant={tab} /></div>
          <div className="flex-1 space-y-2">
            {[['설명', cur.desc], ['구조', cur.shape], ['신호', cur.signalText], ['참고', cur.note]].map(([label, val]) => (
              <div key={label} className="flex gap-2 text-xs">
                <span className={`${muted} min-w-[28px] shrink-0`}>{label}</span>
                <span className={label === '참고' ? muted : ''}>
                  {label === '참고' && Array.isArray(val)
                    ? val.map((v, i) => <span key={i} className="block">{v}</span>)
                    : val}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['다람쥐','다람쥐꼬리','상승다람쥐','하락다람쥐'].map(k => (
            <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark ? 'bg-white/5 border-white/10 text-[#7a7f94]' : 'bg-black/5 border-black/10 text-gray-500'}`}>{k}</span>
          ))}
        </div>
        <ChartNote page="candle" section={`squirrel_${tab}`} single={true} />
      </div>
    </div>
  )
}

/* ── 로드트랙 SVG ── */
function RoadtrackBullishSVG() {
  return (
    <svg width="110" height="92" viewBox="0 0 244 204" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="88.266" y="62.5" width="28" height="121" fill="#D80505" stroke="#D80505"/>
      <rect x="126.266" y="78.5" width="28" height="105" fill="#07831E" stroke="#07831E"/>
      <line x1="102.266" y1="48" x2="102.266" y2="195" stroke="#D80505"/>
      <line x1="140.266" y1="62" x2="140.266" y2="204" stroke="#07831E"/>
      <path d="M64.9576 78.6006C65.5078 78.6488 65.9928 78.2418 66.0409 77.6916L66.8254 68.7258C66.8735 68.1757 66.4665 67.6906 65.9163 67.6425C65.3661 67.5944 64.8811 68.0014 64.833 68.5515L64.1357 76.5211L56.1662 75.8238C55.616 75.7757 55.1309 76.1827 55.0828 76.7329C55.0347 77.2831 55.4417 77.7681 55.9918 77.8162L64.9576 78.6006ZM0.765991 1L-5.32269e-05 1.64279L1.23608 3.11595L2.00212 2.47316L2.76817 1.83037L1.53204 0.357212L0.765991 1ZM4.47438 5.41949L3.70834 6.06227L6.1806 9.0086L6.94664 8.36581L7.71269 7.72302L5.24043 4.7767L4.47438 5.41949ZM9.4189 11.3121L8.65286 11.9549L11.1251 14.9012L11.8912 14.2585L12.6572 13.6157L10.1849 10.6693L9.4189 11.3121ZM14.3634 17.2048L13.5974 17.8476L16.0696 20.7939L16.8357 20.1511L17.6017 19.5083L15.1295 16.562L14.3634 17.2048ZM19.3079 23.0974L18.5419 23.7402L21.0142 26.6865L21.7802 26.0438L22.5462 25.401L20.074 22.4546L19.3079 23.0974ZM24.2525 28.9901L23.4864 29.6329L25.9587 32.5792L26.7247 31.9364L27.4908 31.2936L25.0185 28.3473L24.2525 28.9901ZM29.197 34.8827L28.4309 35.5255L30.9032 38.4718L31.6692 37.8291L32.4353 37.1863L29.963 34.2399L29.197 34.8827ZM34.1415 40.7754L33.3755 41.4182L35.8477 44.3645L36.6138 43.7217L37.3798 43.0789L34.9075 40.1326L34.1415 40.7754ZM39.086 46.668L38.32 47.3108L40.7922 50.2571L41.5583 49.6144L42.3243 48.9716L39.8521 46.0252L39.086 46.668ZM44.0305 52.5607L43.2645 53.2035L45.7368 56.1498L46.5028 55.507L47.2688 54.8642L44.7966 51.9179L44.0305 52.5607ZM48.9751 58.4533L48.209 59.0961L50.6813 62.0424L51.4473 61.3997L52.2134 60.7569L49.7411 57.8105L48.9751 58.4533ZM53.9196 64.346L53.1535 64.9888L55.6258 67.9351L56.3918 67.2923L57.1579 66.6495L54.6856 63.7032L53.9196 64.346ZM58.8641 70.2386L58.0981 70.8814L60.5703 73.8277L61.3364 73.1849L62.1024 72.5422L59.6301 69.5958L58.8641 70.2386ZM63.8086 76.1313L63.0426 76.7741L64.2787 78.2472L65.0448 77.6044L65.8108 76.9617L64.5747 75.4885L63.8086 76.1313Z" fill="#3ec97e"/>
      <path d="M243.041 0.912892C242.993 0.362708 242.508 -0.0442828 241.958 0.00385311L232.992 0.788254C232.442 0.83639 232.035 1.32142 232.083 1.87161C232.131 2.42179 232.616 2.82878 233.166 2.78064L241.136 2.0834L241.833 10.053C241.881 10.6031 242.366 11.0101 242.916 10.962C243.466 10.9139 243.873 10.4288 243.825 9.87864L243.041 0.912892ZM177.766 77.6045L178.532 78.2473L179.768 76.7741L179.002 76.1313L178.236 75.4885L177 76.9617L177.766 77.6045ZM181.474 73.185L182.24 73.8278L184.713 70.8815L183.947 70.2387L183.181 69.5959L180.708 72.5422L181.474 73.185ZM186.419 67.2924L187.185 67.9351L189.657 64.9888L188.891 64.346L188.125 63.7032L185.653 66.6496L186.419 67.2924ZM191.363 61.3997L192.129 62.0425L194.602 59.0962L193.836 58.4534L193.07 57.8106L190.597 60.7569L191.363 61.3997ZM196.308 55.5071L197.074 56.1498L199.546 53.2035L198.78 52.5607L198.014 51.9179L195.542 54.8643L196.308 55.5071ZM201.252 49.6144L202.019 50.2572L204.491 47.3109L203.725 46.6681L202.959 46.0253L200.486 48.9716L201.252 49.6144ZM206.197 43.7218L206.963 44.3645L209.435 41.4182L208.669 40.7754L207.903 40.1326L205.431 43.079L206.197 43.7218ZM211.142 37.8291L211.908 38.4719L214.38 35.5256L213.614 34.8828L212.848 34.24L210.375 37.1863L211.142 37.8291ZM216.086 31.9365L216.852 32.5793L219.324 29.6329L218.558 28.9901L217.792 28.3474L215.32 31.2937L216.086 31.9365ZM221.031 26.0438L221.797 26.6866L224.269 23.7403L223.503 23.0975L222.737 22.4547L220.264 25.401L221.031 26.0438ZM225.975 20.1512L226.741 20.794L229.213 17.8476L228.447 17.2048L227.681 16.5621L225.209 19.5084L225.975 20.1512ZM230.92 14.2585L231.686 14.9013L234.158 11.955L233.392 11.3122L232.626 10.6694L230.154 13.6157L230.92 14.2585ZM235.864 8.36587L236.63 9.00866L239.102 6.06233L238.336 5.41954L237.57 4.77676L235.098 7.72308L235.864 8.36587ZM240.809 2.47322L241.575 3.11601L242.811 1.64284L242.045 1.00005L241.279 0.357261L240.043 1.83043L240.809 2.47322Z" fill="#3ec97e"/>
    </svg>
  )
}

function RoadtrackBearishSVG() {
  return (
    <svg width="97" height="99" viewBox="0 0 216 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="112.266" y="14.5" width="28" height="106" fill="#D80505" stroke="#D80505"/>
      <rect x="74.266" y="16.5" width="28" height="119" fill="#07831E" stroke="#07831E"/>
      <line x1="126.266" y1="8" x2="126.266" y2="129" stroke="#D80505"/>
      <line x1="88.266" x2="88.266" y2="142" stroke="#07831E"/>
      <path d="M213.958 219.601C214.508 219.649 214.993 219.242 215.041 218.692L215.825 209.726C215.873 209.176 215.466 208.691 214.916 208.642C214.366 208.594 213.881 209.001 213.833 209.552L213.136 217.521L205.166 216.824C204.616 216.776 204.131 217.183 204.083 217.733C204.035 218.283 204.442 218.768 204.992 218.816L213.958 219.601ZM149.766 142L149 142.643L150.236 144.116L151.002 143.473L151.768 142.83L150.532 141.357L149.766 142ZM153.474 146.419L152.708 147.062L155.181 150.009L155.947 149.366L156.713 148.723L154.24 145.777L153.474 146.419ZM158.419 152.312L157.653 152.955L160.125 155.901L160.891 155.258L161.657 154.616L159.185 151.669L158.419 152.312ZM163.363 158.205L162.597 158.848L165.07 161.794L165.836 161.151L166.602 160.508L164.129 157.562L163.363 158.205ZM168.308 164.097L167.542 164.74L170.014 167.687L170.78 167.044L171.546 166.401L169.074 163.455L168.308 164.097ZM173.252 169.99L172.486 170.633L174.959 173.579L175.725 172.936L176.491 172.294L174.019 169.347L173.252 169.99ZM178.197 175.883L177.431 176.526L179.903 179.472L180.669 178.829L181.435 178.186L178.963 175.24L178.197 175.883ZM183.142 181.775L182.375 182.418L184.848 185.364L185.614 184.722L186.38 184.079L183.908 181.133L183.142 181.775ZM188.086 187.668L187.32 188.311L189.792 191.257L190.558 190.614L191.324 189.972L188.852 187.025L188.086 187.668ZM193.031 193.561L192.264 194.203L194.737 197.15L195.503 196.507L196.269 195.864L193.797 192.918L193.031 193.561ZM197.975 199.453L197.209 200.096L199.681 203.042L200.447 202.4L201.213 201.757L198.741 198.811L197.975 199.453ZM202.92 205.346L202.154 205.989L204.626 208.935L205.392 208.292L206.158 207.65L203.686 204.703L202.92 205.346ZM207.864 211.239L207.098 211.881L209.57 214.828L210.336 214.185L211.102 213.542L208.63 210.596L207.864 211.239ZM212.809 217.131L212.043 217.774L213.279 219.247L214.045 218.604L214.811 217.962L213.575 216.488L212.809 217.131Z" fill="#e05a6a"/>
      <path d="M66.0409 141.913C65.9928 141.363 65.5078 140.956 64.9576 141.004L55.9918 141.788C55.4417 141.836 55.0347 142.321 55.0828 142.872C55.1309 143.422 55.616 143.829 56.1662 143.781L64.1357 143.083L64.833 151.053C64.8811 151.603 65.3661 152.01 65.9163 151.962C66.4665 151.914 66.8735 151.429 66.8254 150.879L66.0409 141.913ZM0.765991 218.604L1.53204 219.247L2.76817 217.774L2.00212 217.131L1.23608 216.489L-5.32269e-05 217.962L0.765991 218.604ZM4.47438 214.185L5.24043 214.828L7.71269 211.881L6.94664 211.239L6.1806 210.596L3.70834 213.542L4.47438 214.185ZM9.4189 208.292L10.1849 208.935L12.6572 205.989L11.8912 205.346L11.1251 204.703L8.65286 207.65L9.4189 208.292ZM14.3634 202.4L15.1295 203.042L17.6017 200.096L16.8357 199.453L16.0696 198.811L13.5974 201.757L14.3634 202.4ZM19.3079 196.507L20.074 197.15L22.5462 194.204L21.7802 193.561L21.0142 192.918L18.5419 195.864L19.3079 196.507ZM24.2525 190.614L25.0185 191.257L27.4908 188.311L26.7247 187.668L25.9587 187.025L23.4864 189.972L24.2525 190.614ZM29.197 184.722L29.963 185.365L32.4353 182.418L31.6692 181.775L30.9032 181.133L28.4309 184.079L29.197 184.722ZM34.1415 178.829L34.9075 179.472L37.3798 176.526L36.6138 175.883L35.8477 175.24L33.3755 178.186L34.1415 178.829ZM39.086 172.936L39.8521 173.579L42.3243 170.633L41.5583 169.99L40.7922 169.347L38.32 172.294L39.086 172.936ZM44.0305 167.044L44.7966 167.687L47.2688 164.74L46.5028 164.097L45.7368 163.455L43.2645 166.401L44.0305 167.044ZM48.9751 161.151L49.7411 161.794L52.2134 158.848L51.4473 158.205L50.6813 157.562L48.209 160.508L48.9751 161.151ZM53.9196 155.259L54.6856 155.901L57.1579 152.955L56.3918 152.312L55.6258 151.669L53.1535 154.616L53.9196 155.259ZM58.8641 149.366L59.6301 150.009L62.1024 147.062L61.3364 146.42L60.5703 145.777L58.0981 148.723L58.8641 149.366ZM63.8086 143.473L64.5747 144.116L65.8108 142.643L65.0448 142L64.2787 141.357L63.0426 142.83L63.8086 143.473Z" fill="#e05a6a"/>
    </svg>
  )
}

/* ── 로드트랙 모달 ── */
function RoadtrackModal({ onClose }) {
  const { dark } = useTheme()
  const [tab, setTab] = useState('up')
  const bgC        = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted      = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const rowBg      = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'
  const tabActiveU  = 'bg-green-500/10 text-green-400 border border-green-500/20'
  const tabActiveD  = 'bg-red-500/10 text-red-400 border border-red-500/20'
  const tabInactive = dark ? 'text-[#7a7f94] border border-white/10' : 'text-gray-400 border border-black/10'

  const data = {
    up:   { desc:'하락 예견 중 큰 음봉으로 공매수 청산 유발 후 상승', shape:'①상승 캔들 패턴 2회 → ②큰 장대음봉(순간 급락) → ③상승 반전', signalText:'큰 음봉 출현 = 롱 청산 유발 → 진짜 상승의 시작', note:'음봉 거래량이 하락폭 대비 낮음이 핵심' },
    down: { desc:'하락 예견 중 큰 양봉으로 공매도 청산 유발 후 하락', shape:'①하락 캔들 패턴 2회 → ②큰 장대양봉(순간 급등) → ③하락 반전', signalText:'큰 양봉 출현 = 숏 청산 유발 → 진짜 하락의 시작', note:'양봉 거래량이 상승폭 대비 낮음이 핵심' },
  }
  const cur = data[tab]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.6)'}} onClick={onClose}>
      <div className={`w-full max-w-lg rounded-2xl border p-6 ${bgC} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">로드트랙 패턴</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${muted}`}>추세 전환형</span>
              <SignalBadge signal="both" />
            </div>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${muted} ${dark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>✕</button>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('up')}   className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'up'   ? tabActiveU : tabInactive}`}>불리쉬 (상승)</button>
          <button onClick={() => setTab('down')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'down' ? tabActiveD : tabInactive}`}>베어리쉬 (하락)</button>
        </div>
        <div className={`flex gap-4 p-4 rounded-xl mb-4 ${rowBg}`}>
          <div className="shrink-0 flex items-center">
            {tab === 'up' ? <RoadtrackBullishSVG /> : <RoadtrackBearishSVG />}
          </div>
          <div className="flex-1 space-y-2">
            {[['설명', cur.desc], ['구조', cur.shape], ['신호', cur.signalText], ['참고', cur.note]].map(([label, val]) => (
              <div key={label} className="flex gap-2 text-xs">
                <span className={`${muted} min-w-[28px] shrink-0`}>{label}</span>
                <span className={label === '참고' ? muted : ''}>
                  {label === '참고' && Array.isArray(val)
                    ? val.map((v, i) => <span key={i} className="block">{v}</span>)
                    : val}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['로드트랙','레일로드트랙','불리쉬','베어리쉬','railroad track'].map(k => (
            <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark ? 'bg-white/5 border-white/10 text-[#7a7f94]' : 'bg-black/5 border-black/10 text-gray-500'}`}>{k}</span>
          ))}
        </div>
        <ChartNote page="candle" section={`roadtrack_${tab}`} single={true} />
      </div>
    </div>
  )
}

/* ── FVG 모달 ── */
function FVGModal({ onClose }) {
  const { dark } = useTheme()
  const [tab, setTab] = useState('up')
  const bgC        = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted      = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const rowBg      = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'
  const tabActiveU  = 'bg-green-500/10 text-green-400 border border-green-500/20'
  const tabActiveD  = 'bg-red-500/10 text-red-400 border border-red-500/20'
  const tabInactive = dark ? 'text-[#7a7f94] border border-white/10' : 'text-gray-400 border border-black/10'

  const data = {
    up:   { desc:'상승 방향으로 형성된 가격 공백 — 되돌림 시 지지 역할', shape:'①음봉 → ②큰 양봉(급등) → ③양봉 / 1번 고점과 3번 저점 사이 갭', signalText:'갭 구간으로 되돌릴 때 지지 — 매수 타점', note:'갭이 채워지지 않을수록 상승 강도 강함' },
    down: { desc:'하락 방향으로 형성된 가격 공백 — 되돌림 시 저항 역할', shape:'①양봉 → ②큰 음봉(급락) → ③음봉 / 1번 저점과 3번 고점 사이 갭', signalText:'갭 구간으로 되돌릴 때 저항 — 매도 타점', note:'갭이 채워지지 않을수록 하락 강도 강함' },
  }
  const cur = data[tab]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.6)'}} onClick={onClose}>
      <div className={`w-full max-w-lg rounded-2xl border p-6 ${bgC} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">FVG (Fair Value Gap)</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${muted}`}>추세 전환형</span>
              <SignalBadge signal="both" />
            </div>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${muted} ${dark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>✕</button>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('up')}   className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'up'   ? tabActiveU : tabInactive}`}>불리쉬 FVG (상승)</button>
          <button onClick={() => setTab('down')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'down' ? tabActiveD : tabInactive}`}>베어리쉬 FVG (하락)</button>
        </div>
        <div className={`flex gap-4 p-4 rounded-xl mb-4 ${rowBg}`}>
          <div className="shrink-0 flex items-center">
            {tab === 'up' ? (
              <svg width="94" height="100" viewBox="0 0 208 222" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="58.5" width="207" height="112" fill="#07831E" fillOpacity="0.1" stroke="#07831E"/>
                <rect x="8.5" y="192.5" width="28" height="18" fill="#07831E" stroke="#07831E"/>
                <line x1="21.5" y1="171" x2="21.5" y2="222" stroke="#07831E"/>
                <rect x="70.5" y="13.5" width="28" height="18" fill="#07831E" stroke="#07831E"/>
                <line x1="83.5" y1="0" x2="83.5" y2="58" stroke="#07831E"/>
                <rect x="37.5" y="52.5" width="28" height="126" fill="#07831E" stroke="#07831E"/>
                <line x1="51.5" y1="43" x2="51.5" y2="185" stroke="#07831E"/>
                <path d="M134.354 58.6464C134.158 58.4512 133.842 58.4512 133.646 58.6464L130.464 61.8284C130.269 62.0237 130.269 62.3403 130.464 62.5355C130.66 62.7308 130.976 62.7308 131.172 62.5355L134 59.7071L136.828 62.5355C137.024 62.7308 137.34 62.7308 137.536 62.5355C137.731 62.3403 137.731 62.0237 137.536 61.8284L134.354 58.6464ZM133.646 171.354C133.842 171.549 134.158 171.549 134.354 171.354L137.536 168.172C137.731 167.976 137.731 167.66 137.536 167.464C137.34 167.269 137.024 167.269 136.828 167.464L134 170.293L131.172 167.464C130.976 167.269 130.66 167.269 130.464 167.464C130.269 167.66 130.269 167.976 130.464 168.172L133.646 171.354ZM134 59L133.5 59L133.5 171L134 171L134.5 171L134.5 59L134 59Z" fill="#3ec97e"/>
                <path d="M142.057 128V119.273H147.29V120.21H143.114V123.159H146.898V124.097H143.114V128H142.057ZM149.458 119.273L152.049 126.619H152.151L154.742 119.273H155.85L152.645 128H151.554L148.35 119.273H149.458ZM162.765 122C162.671 121.713 162.548 121.456 162.394 121.229C162.244 120.999 162.063 120.803 161.853 120.641C161.646 120.479 161.41 120.355 161.146 120.27C160.881 120.185 160.592 120.142 160.276 120.142C159.759 120.142 159.289 120.276 158.866 120.543C158.442 120.81 158.106 121.203 157.856 121.723C157.606 122.243 157.481 122.881 157.481 123.636C157.481 124.392 157.607 125.03 157.86 125.55C158.113 126.07 158.455 126.463 158.887 126.73C159.319 126.997 159.805 127.131 160.344 127.131C160.844 127.131 161.285 127.024 161.665 126.811C162.049 126.595 162.347 126.291 162.56 125.899C162.776 125.504 162.884 125.04 162.884 124.506L163.208 124.574H160.583V123.636H163.907V124.574C163.907 125.293 163.754 125.918 163.447 126.449C163.143 126.98 162.722 127.392 162.185 127.685C161.651 127.974 161.038 128.119 160.344 128.119C159.572 128.119 158.893 127.938 158.308 127.574C157.725 127.21 157.271 126.693 156.944 126.023C156.62 125.352 156.458 124.557 156.458 123.636C156.458 122.946 156.55 122.325 156.735 121.774C156.923 121.22 157.187 120.749 157.528 120.359C157.869 119.97 158.272 119.672 158.738 119.464C159.204 119.257 159.717 119.153 160.276 119.153C160.737 119.153 161.165 119.223 161.563 119.362C161.964 119.499 162.32 119.693 162.633 119.946C162.948 120.196 163.211 120.496 163.421 120.845C163.631 121.192 163.776 121.577 163.856 122H162.765Z" fill="#3ec97e"/>
              </svg>
            ) : (
              <svg width="94" height="94" viewBox="0 0 208 209" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="41.5" width="207" height="111" fill="#D80505" fillOpacity="0.1" stroke="#D80505"/>
                <rect x="75.5" y="179.5" width="28" height="18" fill="#D80505" stroke="#D80505"/>
                <line x1="88.5" y1="153" x2="88.5" y2="209" stroke="#D80505"/>
                <rect x="12.5" y="0.5" width="28" height="18" fill="#D80505" stroke="#D80505"/>
                <rect x="41.5" y="34.5" width="28" height="131" fill="#D80505" stroke="#D80505"/>
                <line x1="55.5" y1="30" x2="55.5" y2="172" stroke="#D80505"/>
                <path d="M145.354 40.6464C145.158 40.4512 144.842 40.4512 144.646 40.6464L141.464 43.8284C141.269 44.0237 141.269 44.3403 141.464 44.5355C141.66 44.7308 141.976 44.7308 142.172 44.5355L145 41.7071L147.828 44.5355C148.024 44.7308 148.34 44.7308 148.536 44.5355C148.731 44.3403 148.731 44.0237 148.536 43.8284L145.354 40.6464ZM144.646 153.354C144.842 153.549 145.158 153.549 145.354 153.354L148.536 150.172C148.731 149.976 148.731 149.66 148.536 149.464C148.34 149.269 148.024 149.269 147.828 149.464L145 152.293L142.172 149.464C141.976 149.269 141.66 149.269 141.464 149.464C141.269 149.66 141.269 149.976 141.464 150.172L144.646 153.354ZM145 41L144.5 41L144.5 153L145 153L145.5 153L145.5 41L145 41Z" fill="#e05a6a"/>
                <path d="M153.057 110V101.273H158.29V102.21H154.114V105.159H157.898V106.097H154.114V110H153.057ZM160.458 101.273L163.049 108.619H163.151L165.742 101.273H166.85L163.645 110H162.554L159.35 101.273H160.458ZM173.765 104C173.671 103.713 173.548 103.456 173.394 103.229C173.244 102.999 173.063 102.803 172.853 102.641C172.646 102.479 172.41 102.355 172.146 102.27C171.881 102.185 171.592 102.142 171.276 102.142C170.759 102.142 170.289 102.276 169.866 102.543C169.442 102.81 169.106 103.203 168.856 103.723C168.606 104.243 168.481 104.881 168.481 105.636C168.481 106.392 168.607 107.03 168.86 107.55C169.113 108.07 169.455 108.463 169.887 108.73C170.319 108.997 170.805 109.131 171.344 109.131C171.844 109.131 172.285 109.024 172.665 108.811C173.049 108.595 173.347 108.291 173.56 107.899C173.776 107.504 173.884 107.04 173.884 106.506L174.208 106.574H171.583V105.636H174.907V106.574C174.907 107.293 174.754 107.918 174.447 108.449C174.143 108.98 173.722 109.392 173.185 109.685C172.651 109.974 172.038 110.119 171.344 110.119C170.572 110.119 169.893 109.938 169.308 109.574C168.725 109.21 168.271 108.693 167.944 108.023C167.62 107.352 167.458 106.557 167.458 105.636C167.458 104.946 167.55 104.325 167.735 103.774C167.923 103.22 168.187 102.749 168.528 102.359C168.869 101.97 169.272 101.672 169.738 101.464C170.204 101.257 170.717 101.153 171.276 101.153C171.737 101.153 172.165 101.223 172.563 101.362C172.964 101.499 173.32 101.693 173.633 101.946C173.948 102.196 174.211 102.496 174.421 102.845C174.631 103.192 174.776 103.577 174.856 104H173.765Z" fill="#e05a6a"/>
              </svg>
            )}
          </div>
          <div className="flex-1 space-y-2">
            {[['설명', cur.desc], ['구조', cur.shape], ['신호', cur.signalText], ['참고', cur.note]].map(([label, val]) => (
              <div key={label} className="flex gap-2 text-xs">
                <span className={`${muted} min-w-[28px] shrink-0`}>{label}</span>
                <span className={label === '참고' ? muted : ''}>
                  {label === '참고' && Array.isArray(val)
                    ? val.map((v, i) => <span key={i} className="block">{v}</span>)
                    : val}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['FVG','fair value gap','공정가치갭','불리쉬','베어리쉬'].map(k => (
            <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark ? 'bg-white/5 border-white/10 text-[#7a7f94]' : 'bg-black/5 border-black/10 text-gray-500'}`}>{k}</span>
          ))}
        </div>
        <ChartNote page="candle" section={`fvg_${tab}`} single={true} />
      </div>
    </div>
  )
}

/* ── 섹션 헤더 공통 컴포넌트 ── */
function SectionHeader({ label, index, dark }) {
  const divC   = dark ? 'border-white/10' : 'border-black/10'
  const numC   = dark ? 'text-[#4f8ef7]/60' : 'text-[#185fa5]/50'
  const titleC = dark ? 'text-[#4f8ef7]'    : 'text-[#185fa5]'
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`text-xs font-mono ${numC}`}>{String(index + 1).padStart(2, '0')}</span>
      <span className={`text-xs font-semibold uppercase tracking-widest ${titleC}`}>{label}</span>
      <div className={`flex-1 border-t ${divC}`} />
    </div>
  )
}

/* ── 메인 ── */
export default function CandlePatterns() {
  const { dark } = useTheme()
  const { query, setQuery, filtered } = usePageSearch(ALL_CANDLES, ['name','desc','keywords','signalText'])
  const [selected, setSelected] = useState(null)
  const muted  = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const cardBg = dark ? 'bg-[#13161e] border-white/8 hover:border-white/20' : 'bg-white border-black/8 hover:border-black/20'
  const CATS   = ['단일 패턴', '추세 전환형', '추세 지속형']

  const renderCard = (item) => (
    <button key={item.id} onClick={() => setSelected(item)}
      className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${cardBg}`}>
      {item.name === 'FVG'
        ? <svg width="94" height="100" viewBox="0 0 208 222" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="58.5" width="207" height="112" fill="#07831E" fillOpacity="0.1" stroke="#07831E"/>
            <rect x="8.5" y="192.5" width="28" height="18" fill="#07831E" stroke="#07831E"/>
            <line x1="21.5" y1="171" x2="21.5" y2="222" stroke="#07831E"/>
            <rect x="70.5" y="13.5" width="28" height="18" fill="#07831E" stroke="#07831E"/>
            <line x1="83.5" y1="0" x2="83.5" y2="58" stroke="#07831E"/>
            <rect x="37.5" y="52.5" width="28" height="126" fill="#07831E" stroke="#07831E"/>
            <line x1="51.5" y1="43" x2="51.5" y2="185" stroke="#07831E"/>
            <path d="M134.354 58.6464C134.158 58.4512 133.842 58.4512 133.646 58.6464L130.464 61.8284C130.269 62.0237 130.269 62.3403 130.464 62.5355C130.66 62.7308 130.976 62.7308 131.172 62.5355L134 59.7071L136.828 62.5355C137.024 62.7308 137.34 62.7308 137.536 62.5355C137.731 62.3403 137.731 62.0237 137.536 61.8284L134.354 58.6464ZM133.646 171.354C133.842 171.549 134.158 171.549 134.354 171.354L137.536 168.172C137.731 167.976 137.731 167.66 137.536 167.464C137.34 167.269 137.024 167.269 136.828 167.464L134 170.293L131.172 167.464C130.976 167.269 130.66 167.269 130.464 167.464C130.269 167.66 130.269 167.976 130.464 168.172L133.646 171.354ZM134 59L133.5 59L133.5 171L134 171L134.5 171L134.5 59L134 59Z" fill="#3ec97e"/>
            <path d="M142.057 128V119.273H147.29V120.21H143.114V123.159H146.898V124.097H143.114V128H142.057ZM149.458 119.273L152.049 126.619H152.151L154.742 119.273H155.85L152.645 128H151.554L148.35 119.273H149.458ZM162.765 122C162.671 121.713 162.548 121.456 162.394 121.229C162.244 120.999 162.063 120.803 161.853 120.641C161.646 120.479 161.41 120.355 161.146 120.27C160.881 120.185 160.592 120.142 160.276 120.142C159.759 120.142 159.289 120.276 158.866 120.543C158.442 120.81 158.106 121.203 157.856 121.723C157.606 122.243 157.481 122.881 157.481 123.636C157.481 124.392 157.607 125.03 157.86 125.55C158.113 126.07 158.455 126.463 158.887 126.73C159.319 126.997 159.805 127.131 160.344 127.131C160.844 127.131 161.285 127.024 161.665 126.811C162.049 126.595 162.347 126.291 162.56 125.899C162.776 125.504 162.884 125.04 162.884 124.506L163.208 124.574H160.583V123.636H163.907V124.574C163.907 125.293 163.754 125.918 163.447 126.449C163.143 126.98 162.722 127.392 162.185 127.685C161.651 127.974 161.038 128.119 160.344 128.119C159.572 128.119 158.893 127.938 158.308 127.574C157.725 127.21 157.271 126.693 156.944 126.023C156.62 125.352 156.458 124.557 156.458 123.636C156.458 122.946 156.55 122.325 156.735 121.774C156.923 121.22 157.187 120.749 157.528 120.359C157.869 119.97 158.272 119.672 158.738 119.464C159.204 119.257 159.717 119.153 160.276 119.153C160.737 119.153 161.165 119.223 161.563 119.362C161.964 119.499 162.32 119.693 162.633 119.946C162.948 120.196 163.211 120.496 163.421 120.845C163.631 121.192 163.776 121.577 163.856 122H162.765Z" fill="#3ec97e"/>
          </svg>
        : item.name === '로드트랙 패턴'
        ? <RoadtrackBullishSVG />
        : <CandleSVG name={item.name} variant="up" />
      }
      <span className="text-sm font-medium text-center">{item.name}</span>
      <SignalBadge signal={item.signal} />
    </button>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">캔들 패턴</h1>
        <p className={`text-sm ${muted}`}>단일 패턴 · 추세 전환형 · 추세 지속형 — 클릭하면 상세 보기</p>
      </div>

      <PageSearch query={query} setQuery={setQuery} placeholder="캔들 패턴 검색... (예: 모닝스타, 흑삼병, FVG)" />
      {query && <p className={`text-xs mb-4 ${muted}`}>{filtered.length}개 결과</p>}

      {!query && CATS.map((cat, si) => {
        const items = ALL_CANDLES.filter(c => c.cat === cat)
        return (
          <section key={cat} className="mb-10">
            <SectionHeader label={cat} index={si} dark={dark} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map(renderCard)}
            </div>
          </section>
        )
      })}

      {query && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.length === 0
            ? <p className={`text-sm col-span-4 ${muted}`}>검색 결과 없음</p>
            : filtered.map(renderCard)
          }
        </div>
      )}

      {selected?.name === '다람쥐 패턴'   && <SquirrelModal  onClose={() => setSelected(null)} />}
      {selected?.name === '로드트랙 패턴' && <RoadtrackModal onClose={() => setSelected(null)} />}
      {selected?.name === 'FVG'            && <FVGModal       onClose={() => setSelected(null)} />}
      {selected && !['다람쥐 패턴','로드트랙 패턴','FVG'].includes(selected.name) && (
        <Modal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
