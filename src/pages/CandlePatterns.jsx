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
  { id:10, cat:'추세 지속형', name:'백삼병', signal:'up', desc:'연속 3개 양봉 — 강한 상승 신호', shape:'연속 3개 양봉 / 각 저점 상승', signalText:'상승 추세 강화', note:'3번째 양봉 저점 이탈 시 무효', keywords:['백삼병','연속양봉','쓰리화이트솔저'] },
  { id:11, cat:'추세 지속형', name:'흑삼병', signal:'down', desc:'연속 3개 음봉 — 강한 하락 신호', shape:'연속 3개 음봉 / 각 고점 하락', signalText:'하락 추세 강화', note:'1번째 음봉 고점 돌파 시 무효', keywords:['흑삼병','연속음봉','쓰리블랙크로우'] },
]

/* 다람쥐/로드트랙/FVG는 별도 그룹 */
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

  /* 다람쥐 */
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

  /* 로드트랙 */
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

  /* FVG */
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

  const wide = ['모닝스타','이브닝스타','백삼병','흑삼병','상승장악형','하락장악형'].includes(name)
  const xwide = ['다람쥐 패턴','로드트랙 패턴','FVG'].includes(name)
  const w = xwide ? 80 : wide ? 76 : 64
  const h = xwide ? 80 : 70

  let content = shapes[name]
  if (name === '다람쥐 패턴') content = variant === 'up' ? squirrelUp : squirrelDown
  if (name === '로드트랙 패턴') content = variant === 'up' ? roadUp : roadDown
  if (name === 'FVG') content = variant === 'down' ? fvgDown : fvgUp

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
        <ChartNote page="candle" section={`candle_${item.id}`} single={true} />
      </div>
    </div>
  )
}

/* ── 다람쥐 모달 ── */
function SquirrelModal({ onClose }) {
  const { dark } = useTheme()
  const [tab, setTab] = useState('up')
  const bgC   = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const rowBg = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'
  const tabActive   = 'bg-green-500/10 text-green-400 border border-green-500/20'
  const tabActiveD  = 'bg-red-500/10 text-red-400 border border-red-500/20'
  const tabInactive = dark ? 'text-[#7a7f94] border border-white/10' : 'text-gray-400 border border-black/10'

  const data = {
    up: { label:'상승다람쥐', signal:'up', desc:'음봉을 잡아먹는 양봉 + 도지 → 말아올리는 상승 패턴', shape:'①장대음봉 → ②장대양봉(음봉 감쌈) → ③도지 → ④상승', signalText:'도지 이후 강한 상승', note:'도지캔들 이후 말아올리는 형태 / 음양 무관' },
    down: { label:'하락다람쥐', signal:'down', desc:'양봉을 잡아먹는 음봉 + 도지 → 꼬리처럼 빠지는 하락 패턴', shape:'①장대양봉 → ②장대음봉(양봉 감쌈) → ③도지 1~3개 → ④하락', signalText:'도지 이후 강한 하락', note:'도지캔들 1~3개 나온 뒤 꼬리처럼 길게 빠짐' },
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
          <button onClick={() => setTab('up')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'up' ? tabActive : tabInactive}`}>상승다람쥐</button>
          <button onClick={() => setTab('down')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'down' ? tabActiveD : tabInactive}`}>하락다람쥐</button>
        </div>
        <div className={`flex gap-4 p-4 rounded-xl mb-4 ${rowBg}`}>
          <div className="shrink-0 flex items-center"><CandleSVG name="다람쥐 패턴" variant={tab} /></div>
          <div className="flex-1 space-y-2">
            {[['설명', cur.desc], ['구조', cur.shape], ['신호', cur.signalText], ['참고', cur.note]].map(([label, val]) => (
              <div key={label} className="flex gap-2 text-xs">
                <span className={`${muted} min-w-[28px] shrink-0`}>{label}</span>
                <span className={label === '참고' ? muted : ''}>{val}</span>
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

/* ── 로드트랙 모달 ── */
function RoadtrackModal({ onClose }) {
  const { dark } = useTheme()
  const [tab, setTab] = useState('up')
  const bgC   = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const rowBg = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'
  const tabActiveU  = 'bg-green-500/10 text-green-400 border border-green-500/20'
  const tabActiveD  = 'bg-red-500/10 text-red-400 border border-red-500/20'
  const tabInactive = dark ? 'text-[#7a7f94] border border-white/10' : 'text-gray-400 border border-black/10'

  const data = {
    up: { desc:'하락 예견 중 큰 음봉으로 공매수 청산 유발 후 상승', shape:'①상승 캔들 패턴 2회 → ②큰 장대음봉(순간 급락) → ③상승 반전', signalText:'큰 음봉 출현 = 롱 청산 유발 → 진짜 상승의 시작', note:'음봉 거래량이 하락폭 대비 낮음이 핵심' },
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
          <button onClick={() => setTab('up')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'up' ? tabActiveU : tabInactive}`}>불리쉬 (상승)</button>
          <button onClick={() => setTab('down')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'down' ? tabActiveD : tabInactive}`}>베어리쉬 (하락)</button>
        </div>
        <div className={`flex gap-4 p-4 rounded-xl mb-4 ${rowBg}`}>
          <div className="shrink-0 flex items-center"><CandleSVG name="로드트랙 패턴" variant={tab} /></div>
          <div className="flex-1 space-y-2">
            {[['설명', cur.desc], ['구조', cur.shape], ['신호', cur.signalText], ['참고', cur.note]].map(([label, val]) => (
              <div key={label} className="flex gap-2 text-xs">
                <span className={`${muted} min-w-[28px] shrink-0`}>{label}</span>
                <span className={label === '참고' ? muted : ''}>{val}</span>
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
  const bgC   = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const rowBg = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'
  const tabActiveU  = 'bg-green-500/10 text-green-400 border border-green-500/20'
  const tabActiveD  = 'bg-red-500/10 text-red-400 border border-red-500/20'
  const tabInactive = dark ? 'text-[#7a7f94] border border-white/10' : 'text-gray-400 border border-black/10'

  const data = {
    up: { desc:'상승 방향으로 형성된 가격 공백 — 되돌림 시 지지 역할', shape:'①음봉 → ②큰 양봉(급등) → ③양봉 / 1번 고점과 3번 저점 사이 갭', signalText:'갭 구간으로 되돌릴 때 지지 — 매수 타점', note:'갭이 채워지지 않을수록 상승 강도 강함' },
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
          <button onClick={() => setTab('up')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'up' ? tabActiveU : tabInactive}`}>불리쉬 FVG (상승)</button>
          <button onClick={() => setTab('down')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === 'down' ? tabActiveD : tabInactive}`}>베어리쉬 FVG (하락)</button>
        </div>
        <div className={`flex gap-4 p-4 rounded-xl mb-4 ${rowBg}`}>
          <div className="shrink-0 flex items-center">
            <svg width="80" height="80" viewBox="0 0 551 227" fill="none" xmlns="http://www.w3.org/2000/svg">
              {tab === 'up' ? <>
                <rect x="0.5" y="58.5" width="207" height="112" fill="#07831E" fillOpacity="0.1" stroke="#07831E"/>
                <rect x="8.5" y="192.5" width="28" height="18" fill="#07831E" stroke="#07831E"/>
                <line x1="21.5" y1="171" x2="21.5" y2="222" stroke="#07831E"/>
                <rect x="70.5" y="13.5" width="28" height="18" fill="#07831E" stroke="#07831E"/>
                <line x1="83.5" y1="0" x2="83.5" y2="58" stroke="#07831E"/>
                <rect x="37.5" y="52.5" width="28" height="126" fill="#07831E" stroke="#07831E"/>
                <line x1="51.5" y1="43" x2="51.5" y2="185" stroke="#07831E"/>
                <path d="M134.354 58.6464C134.158 58.4512 133.842 58.4512 133.646 58.6464L130.464 61.8284C130.269 62.0237 130.269 62.3403 130.464 62.5355C130.66 62.7308 130.976 62.7308 131.172 62.5355L134 59.7071L136.828 62.5355C137.024 62.7308 137.34 62.7308 137.536 62.5355C137.731 62.3403 137.731 62.0237 137.536 61.8284L134.354 58.6464ZM133.646 171.354C133.842 171.549 134.158 171.549 134.354 171.354L137.536 168.172C137.731 167.976 137.731 167.66 137.536 167.464C137.34 167.269 137.024 167.269 136.828 167.464L134 170.293L131.172 167.464C130.976 167.269 130.66 167.269 130.464 167.464C130.269 167.66 130.269 167.976 130.464 168.172L133.646 171.354ZM134 59L133.5 59L133.5 171L134 171L134.5 171L134.5 59L134 59Z" fill="#07831E"/>
                <text x="142" y="128" fontSize="28" fill="#07831E" fontFamily="sans-serif">FVG</text>
              </> : <>
                <rect x="343.5" y="59.5" width="207" height="111" fill="#D80505" fillOpacity="0.1" stroke="#D80505"/>
                <rect x="418.5" y="197.5" width="28" height="18" fill="#D80505" stroke="#D80505"/>
                <line x1="431.5" y1="171" x2="431.5" y2="227" stroke="#D80505"/>
                <rect x="355.5" y="18.5" width="28" height="18" fill="#D80505" stroke="#D80505"/>
                <line x1="368.5" y1="5" x2="368.5" y2="60" stroke="#D80505"/>
                <rect x="384.5" y="52.5" width="28" height="131" fill="#D80505" stroke="#D80505"/>
                <line x1="398.5" y1="48" x2="398.5" y2="190" stroke="#D80505"/>
                <path d="M488.354 58.6464C488.158 58.4512 487.842 58.4512 487.646 58.6464L484.464 61.8284C484.269 62.0237 484.269 62.3403 484.464 62.5355C484.66 62.7308 484.976 62.7308 485.172 62.5355L488 59.7071L490.828 62.5355C491.024 62.7308 491.34 62.7308 491.536 62.5355C491.731 62.3403 491.731 62.0237 491.536 61.8284L488.354 58.6464ZM487.646 171.354C487.842 171.549 488.158 171.549 488.354 171.354L491.536 168.172C491.731 167.976 491.731 167.66 491.536 167.464C491.34 167.269 491.024 167.269 490.828 167.464L488 170.293L485.172 167.464C484.976 167.269 484.66 167.269 484.464 167.464C484.269 167.66 484.269 167.976 484.464 168.172L487.646 171.354ZM488 59L487.5 59L487.5 171L488 171L488.5 171L488.5 59L488 59Z" fill="#D80505"/>
                <text x="360" y="128" fontSize="28" fill="#D80505" fontFamily="sans-serif">FVG</text>
              </>}
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            {[['설명', cur.desc], ['구조', cur.shape], ['신호', cur.signalText], ['참고', cur.note]].map(([label, val]) => (
              <div key={label} className="flex gap-2 text-xs">
                <span className={`${muted} min-w-[28px] shrink-0`}>{label}</span>
                <span className={label === '참고' ? muted : ''}>{val}</span>
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

/* ── 메인 ── */
export default function CandlePatterns() {
  const { dark } = useTheme()
  const { query, setQuery, filtered } = usePageSearch(ALL_CANDLES, ['name','desc','keywords','signalText'])
  const [selected, setSelected] = useState(null)
  const muted  = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const catC   = dark ? 'text-[#4f8ef7]' : 'text-[#185fa5]'
  const cardBg = dark ? 'bg-[#13161e] border-white/8 hover:border-white/20' : 'bg-white border-black/8 hover:border-black/20'

  const CATS = ['단일 패턴', '추세 전환형', '추세 지속형']

  const renderCard = (item) => (
    <button key={item.id} onClick={() => setSelected(item)}
      className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${cardBg}`}>
      <CandleSVG name={item.name} variant="up" />
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

      {!query && CATS.map(cat => {
        const items = ALL_CANDLES.filter(c => c.cat === cat)
        return (
          <section key={cat} className="mb-10">
            <h2 className={`text-xs font-mono font-semibold uppercase tracking-widest mb-3 ${catC}`}>{cat}</h2>
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

      {selected?.name === '다람쥐 패턴' && <SquirrelModal onClose={() => setSelected(null)} />}
      {selected?.name === '로드트랙 패턴' && <RoadtrackModal onClose={() => setSelected(null)} />}
      {selected?.name === 'FVG' && <FVGModal onClose={() => setSelected(null)} />}
      {selected && !['다람쥐 패턴','로드트랙 패턴','FVG'].includes(selected.name) && (
        <Modal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
