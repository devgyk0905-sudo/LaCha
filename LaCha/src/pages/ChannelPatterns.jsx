import { useState, useRef } from 'react'
import { useTheme } from '../App'
import { PageSearch } from '../components/UI'
import { usePageSearch } from '../hooks/usePageSearch'

const CHANNELS = [
  { id:1, cat:'평행 채널', name:'상승 채널', signal:'up', desc:'우상향 평행 채널 — 상승 추세 지속', structure:'채널 하단: 지지 / 채널 상단: 저항', signalText:'하단 터치 → 매수 / 상단 터치 → 매도 고려', note:'WXY/ABC 조정이 채널 안에서 나오는 경우 많음', keywords:['상승채널','어센딩채널','평행채널','우상향'] },
  { id:2, cat:'평행 채널', name:'하락 채널', signal:'down', desc:'우하향 평행 채널 — 하락 추세 지속', structure:'채널 상단: 저항 / 채널 하단: 지지', signalText:'상단 터치 → 매도 / 하단 이탈 → 추가 하락', note:'채널 상단 돌파 시 추세 전환 신호', keywords:['하락채널','디센딩채널','우하향'] },
  { id:3, cat:'평행 채널', name:'횡보 채널', signal:'neutral', desc:'수평 평행 채널 — 방향성 없는 구간', structure:'수평 지지선 + 수평 저항선', signalText:'지지/저항 반복 — 돌파 방향으로 추세 시작', note:'WXY 기간 조정에서 자주 출현', keywords:['횡보채널','박스권','수평채널'] },
  { id:4, cat:'수렴 패턴', name:'대칭 삼각형', signal:'neutral', desc:'고점↓ 저점↑ 반복하며 수렴', structure:'하락하는 고점 + 상승하는 저점', signalText:'수렴 후 어느 방향으로든 강하게 돌파', note:'삼각수렴 abcde 파동과 동일 구조', keywords:['대칭삼각형','시메트리컬','수렴'] },
  { id:5, cat:'수렴 패턴', name:'상승 삼각형', signal:'up', desc:'수평 저항 + 상승하는 저점', structure:'수평 저항선 + 상승하는 저점', signalText:'저항 돌파 시 강한 상승', note:'저점이 높아질수록 매수세 강화', keywords:['상승삼각형','어센딩트라이앵글'] },
  { id:6, cat:'수렴 패턴', name:'하락 삼각형', signal:'down', desc:'수평 지지 + 하락하는 고점', structure:'수평 지지선 + 하락하는 고점', signalText:'지지 이탈 시 강한 하락', note:'고점이 낮아질수록 매도세 강화', keywords:['하락삼각형','디센딩트라이앵글'] },
  { id:7, cat:'쐐기형', name:'상승 쐐기', signal:'down', desc:'우상향 수렴 쐐기 — 하락 반전', structure:'상승 고점 + 더 빠르게 상승하는 저점', signalText:'지지선 이탈 시 강한 하락', note:'터미널 파동과 유사 구조', keywords:['상승쐐기','라이징웨지','쐐기'] },
  { id:8, cat:'쐐기형', name:'하락 쐐기', signal:'up', desc:'우하향 수렴 쐐기 — 상승 반전', structure:'하락 저점 + 더 빠르게 하락하는 고점', signalText:'저항선 돌파 시 강한 상승', note:'터미널 파동과 유사 구조', keywords:['하락쐐기','폴링웨지','쐐기'] },
  { id:9, cat:'반전 패턴', name:'헤드앤숄더', signal:'down', desc:'세 고점 중 중앙이 가장 높음 — 하락 반전', structure:'왼쪽 어깨 → 머리(최고점) → 오른쪽 어깨 → 넥라인 이탈', signalText:'넥라인 이탈 시 강한 하락', note:'목표값 = 넥라인 - (머리 - 넥라인)', keywords:['헤드앤숄더','H&S','헤숄'] },
  { id:10, cat:'반전 패턴', name:'더블탑/바텀', signal:'neutral', desc:'두 개의 고점/저점이 같은 레벨에서 형성', structure:'더블탑: 두 고점 비슷 / 더블바텀: 두 저점 비슷', signalText:'더블탑: 지지 이탈 하락 / 더블바텀: 저항 돌파 상승', note:'아담&이브: 첫 번째 뾰족 + 두 번째 둥근 형태', keywords:['더블탑','더블바텀','이중천장','이중바닥','아담이브'] },
]

const GREEN = '#3ec97e'
const RED   = '#e05a6a'
const GRAY  = '#888780'
const BLUE  = '#4f8ef7'

function ChannelSVG({ name }) {
  const shapes = {
    '상승 채널':   <><line x1="8" y1="58" x2="56" y2="18" stroke={GREEN} strokeWidth="1.5"/><line x1="8" y1="48" x2="56" y2="8"  stroke={GREEN} strokeWidth="1.5" strokeDasharray="3 2"/><polyline points="8,54 18,44 28,48 38,32 48,36 56,22" fill="none" stroke={GREEN} strokeWidth="1" opacity="0.6"/></>,
    '하락 채널':   <><line x1="8" y1="8"  x2="56" y2="48" stroke={RED}   strokeWidth="1.5"/><line x1="8" y1="18" x2="56" y2="58" stroke={RED}   strokeWidth="1.5" strokeDasharray="3 2"/><polyline points="8,12 18,22 28,18 38,34 48,30 56,44" fill="none" stroke={RED}   strokeWidth="1" opacity="0.6"/></>,
    '횡보 채널':   <><line x1="8" y1="18" x2="56" y2="18" stroke={GRAY} strokeWidth="1.5"/><line x1="8" y1="48" x2="56" y2="48" stroke={GRAY} strokeWidth="1.5" strokeDasharray="3 2"/><polyline points="8,48 18,18 28,48 38,18 48,48 56,18" fill="none" stroke={GRAY} strokeWidth="1" opacity="0.6"/></>,
    '대칭 삼각형': <><line x1="8" y1="10" x2="52" y2="33" stroke={GRAY} strokeWidth="1.5"/><line x1="8" y1="56" x2="52" y2="33" stroke={GRAY} strokeWidth="1.5"/><polyline points="8,12 20,44 30,20 40,38 50,30" fill="none" stroke={BLUE} strokeWidth="1" opacity="0.7"/></>,
    '상승 삼각형': <><line x1="8" y1="16" x2="56" y2="16" stroke={GREEN} strokeWidth="1.5"/><line x1="8" y1="56" x2="52" y2="20" stroke={GREEN} strokeWidth="1.5" strokeDasharray="3 2"/></>,
    '하락 삼각형': <><line x1="8" y1="50" x2="56" y2="50" stroke={RED}   strokeWidth="1.5"/><line x1="8" y1="10" x2="52" y2="46" stroke={RED}   strokeWidth="1.5" strokeDasharray="3 2"/></>,
    '상승 쐐기':   <><line x1="8" y1="48" x2="52" y2="22" stroke={RED}   strokeWidth="1.5"/><line x1="8" y1="56" x2="52" y2="30" stroke={RED}   strokeWidth="1.5" strokeDasharray="3 2"/></>,
    '하락 쐐기':   <><line x1="8" y1="18" x2="52" y2="44" stroke={GREEN} strokeWidth="1.5"/><line x1="8" y1="10" x2="52" y2="36" stroke={GREEN} strokeWidth="1.5" strokeDasharray="3 2"/></>,
    '헤드앤숄더':  <><polyline points="8,50 16,38 22,42 30,14 38,42 44,38 52,50" fill="none" stroke={RED} strokeWidth="1.5"/><line x1="8" y1="44" x2="52" y2="44" stroke={RED} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/></>,
    '더블탑/바텀': <><polyline points="8,50 18,20 28,50 38,20 48,50" fill="none" stroke={GRAY} strokeWidth="1.5"/><line x1="8" y1="20" x2="48" y2="20" stroke={RED} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/></>,
  }
  return (
    <svg width="64" height="66" viewBox="0 0 64 66" xmlns="http://www.w3.org/2000/svg">
      {shapes[name] || <line x1="8" y1="33" x2="56" y2="33" stroke={GRAY} strokeWidth="1.5"/>}
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
  const [images, setImages] = useState([])
  const inputRef = useRef()
  const bgC      = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted    = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const rowBg    = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'
  const uploadBg = dark ? 'bg-[#1a1e2a] border-white/15' : 'bg-gray-50 border-black/15'

  const handleFiles = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
  }

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
          <div className="shrink-0 flex items-center"><ChannelSVG name={item.name} /></div>
          <div className="flex-1 space-y-2">
            {[['설명', item.desc], ['구조', item.structure], ['신호', item.signalText], ['참고', item.note]].map(([label, val]) => (
              <div key={label} className="flex gap-2 text-xs">
                <span className={`${muted} min-w-[28px] shrink-0`}>{label}</span>
                <span className={label === '참고' ? muted : ''}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {item.keywords.map(k => (
            <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark ? 'bg-white/5 border-white/10 text-[#7a7f94]' : 'bg-black/5 border-black/10 text-gray-500'}`}>{k}</span>
          ))}
        </div>

        <p className="text-xs font-semibold mb-2">예시 차트 사진</p>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} alt="" className="w-full rounded-lg object-cover aspect-video border border-white/10" />
                <button onClick={() => setImages(prev => prev.filter((_,j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs hidden group-hover:flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        )}
        <div onClick={() => inputRef.current.click()}
          className={`border border-dashed rounded-xl p-4 text-center cursor-pointer hover:opacity-70 transition-opacity ${uploadBg}`}>
          <p className={`text-lg mb-0.5 ${muted}`}>+</p>
          <p className={`text-xs ${muted}`}>클릭하여 차트 사진 업로드</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      </div>
    </div>
  )
}

export default function ChannelPatterns() {
  const { dark } = useTheme()
  const { query, setQuery, filtered } = usePageSearch(CHANNELS, ['name','desc','keywords','signalText'])
  const [selected, setSelected] = useState(null)
  const muted  = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const catC   = dark ? 'text-[#4f8ef7]' : 'text-[#185fa5]'
  const cardBg = dark ? 'bg-[#13161e] border-white/8 hover:border-white/20' : 'bg-white border-black/8 hover:border-black/20'
  const cats   = [...new Set(CHANNELS.map(c => c.cat))]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">채널 패턴</h1>
        <p className={`text-sm ${muted}`}>평행 채널 · 수렴 패턴 · 쐐기형 · 반전 패턴 — 클릭하면 상세 보기</p>
      </div>

      <PageSearch query={query} setQuery={setQuery} placeholder="채널 패턴 검색... (예: 쐐기, 삼각형, 더블탑)" />
      {query && <p className={`text-xs mb-4 ${muted}`}>{filtered.length}개 결과</p>}

      {!query && cats.map(cat => (
        <section key={cat} className="mb-10">
          <h2 className={`text-xs font-mono font-semibold uppercase tracking-widest mb-3 ${catC}`}>{cat}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CHANNELS.filter(c => c.cat === cat).map(item => (
              <button key={item.id} onClick={() => setSelected(item)}
                className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${cardBg}`}>
                <ChannelSVG name={item.name} />
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
                <ChannelSVG name={item.name} />
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
