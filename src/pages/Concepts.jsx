import { useState, useRef } from 'react'
import { useTheme } from '../App'
import { Badge, PageSearch } from '../components/UI'
import { usePageSearch } from '../hooks/usePageSearch'

const ICON = {
  '이동평균선': '📈',
  '보조지표':   '📊',
  '피보나치':   '🌀',
  '채널/추세':  '📐',
  '거래량':     '🔊',
  '캔들':       '🕯️',
}

const CONCEPTS = [
  {
    category: '이동평균선',
    title: '이동평균선 (MA / EMA)',
    desc: '일정 기간 가격 평균을 이은 선. 추세 방향과 지지/저항 역할.',
    keywords: ['이평선', 'EMA', 'SMA', '이동평균', '20', '50', '100', '200', '365'],
    details: [
      '단기 이평선(20, 50): 가격에 민감하게 반응',
      '장기 이평선(100, 200, 365): 큰 추세 방향 파악',
      '정배열: 단기 이평선이 위, 장기 이평선이 아래 → 상승 추세',
      '역배열: 단기 이평선이 아래, 장기 이평선이 위 → 하락 추세',
    ],
    color: 'blue',
  },
  {
    category: '이동평균선',
    title: '골든크로스 / 데드크로스',
    desc: '단기 MA가 장기 MA를 돌파하는 추세 전환 신호.',
    keywords: ['골크', '골든크로스', '데드크로스', '데크'],
    details: [
      '골든크로스: 단기 MA가 장기 MA를 상향 돌파 → 매수 신호',
      '데드크로스: 단기 MA가 장기 MA를 하향 돌파 → 매도 신호',
      '이평선 간격이 넓을수록 신호 강도 높음',
    ],
    color: 'blue',
  },
  {
    category: '보조지표',
    title: 'RSI (상대강도지수)',
    desc: '0~100 사이 값으로 과매수/과매도 상태를 나타내는 지표.',
    keywords: ['RSI', '상대강도지수', '과매수', '과매도', '70', '30'],
    details: [
      '70 이상: 과매수 구간 → 하락 가능성',
      '30 이하: 과매도 구간 → 상승 가능성',
      '50 근처: 중립 구간',
      '다이버전스: 가격과 RSI 방향이 반대로 움직임',
    ],
    color: 'teal',
  },
  {
    category: '보조지표',
    title: '다이버전스',
    desc: '가격과 RSI 방향이 반대로 움직이는 추세 전환 신호.',
    keywords: ['다이버전스', 'Bull', 'Bear', '베어', '불', '하락다이버전스', '상승다이버전스'],
    details: [
      'Bull 다이버전스: 가격은 저점 낮아지는데 RSI는 저점 높아짐 → 상승 전환 신호',
      'Bear 다이버전스: 가격은 고점 높아지는데 RSI는 고점 낮아짐 → 하락 전환 신호',
      '30/70 근처에서 발생 시 신뢰도 높음',
      '중립 구간(50 근처)에서는 신호 강도 약함',
    ],
    color: 'teal',
  },
  {
    category: '피보나치',
    title: '피보나치 되돌림',
    desc: '추세 방향의 되돌림 구간을 측정 — 지지/저항 예측.',
    keywords: ['피보나치', '되돌림', '0.236', '0.382', '0.5', '0.618', '0.786'],
    details: [
      '주요 레벨: 0.236 / 0.382 / 0.5 / 0.618 / 0.786',
      '상승 추세: 저점 → 고점 방향으로 그음',
      '하락 추세: 고점 → 저점 방향으로 그음',
      '0.618 황금비율 — 가장 많이 지지/저항으로 작동',
    ],
    color: 'amber',
  },
  {
    category: '피보나치',
    title: '피보나치 확장',
    desc: '파동 목표 구간 측정 — WXY/WXYXZ에서 필수.',
    keywords: ['피보나치', '확장', '1.0', '1.236', '1.382', '1.618', 'WXY'],
    details: [
      '그리는 법: W시작(1번) → W끝(2번) → X끝(3번) 순으로 클릭',
      '주요 레벨: 0.618 / 1.0 / 1.236 / 1.272 / 1.382 / 1.618',
      'WXY에서 Y파 목표: 0.618 ~ 1.0 구간',
      'WXYXZ에서 Z파 목표: 0.618 ~ 1.0 (Y가 확장됐을 경우)',
    ],
    color: 'amber',
  },
  {
    category: '채널/추세',
    title: '지지 / 저항',
    desc: '하락을 막는 가격대(지지), 상승을 막는 가격대(저항).',
    keywords: ['지지', '저항', '지지선', '저항선', '역할전환'],
    details: [
      '지지: 수요가 공급을 압도하는 가격대',
      '저항: 공급이 수요를 압도하는 가격대',
      '역할 전환: 지지를 이탈하면 저항으로, 저항을 돌파하면 지지로 바뀜',
      '과거에 많이 거래된 구간일수록 지지/저항 강도 높음',
    ],
    color: 'green',
  },
  {
    category: '채널/추세',
    title: '매물대 (공급존)',
    desc: '과거에 거래가 많이 몰린 가격대 — 강한 지지/저항 역할.',
    keywords: ['매물대', '공급존', '수요존', '거래량'],
    details: [
      '고거래량 + 횡보 구간 → 강한 매물대',
      '급등/급락 구간 → 되돌아올 때 강한 지지/저항',
      '매물대 돌파 시 강한 상승 신호',
      '매물대 이탈 시 강한 하락 신호',
    ],
    color: 'green',
  },
  {
    category: '거래량',
    title: '거래량',
    desc: '특정 기간 동안 거래된 총 수량 — 추세 강도 확인.',
    keywords: ['거래량', '볼륨', '거래량폭발'],
    details: [
      '상승 + 거래량 증가: 강한 상승 신호',
      '상승 + 거래량 감소: 상승 신뢰도 낮음',
      '급락 + 거래량 폭발: 매도 클라이맥스 가능성',
      '백삼병 거래량 미회복 시 지속 상승 어려움',
    ],
    color: 'purple',
  },
  {
    category: '캔들',
    title: '위꼬리 / 아래꼬리',
    desc: '캔들 꼬리가 나타내는 매수/매도 세력의 흔적.',
    keywords: ['위꼬리', '아래꼬리', '꼬리', '그림자', '매수', '매도'],
    details: [
      '위꼬리: 고점까지 올렸다가 매도세에 밀린 흔적 → 상단 저항 존재',
      '아래꼬리: 저점까지 밀렸다가 매수세가 받아낸 흔적 → 하단 지지 존재',
      '꼬리가 길수록 해당 방향 세력이 강했음을 의미',
    ],
    color: 'red',
  },
]

/* ── 이미지 확대 모달 ── */
function ImageZoomModal({ src, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <img src={src} alt="" className="max-w-full max-h-[90vh] rounded-xl object-contain" />
    </div>
  )
}

/* ── 개념 상세 모달 ── */
function ConceptModal({ item, onClose }) {
  const { dark } = useTheme()
  const [image, setImage] = useState(null)
  const [zoomSrc, setZoomSrc] = useState(null)
  const inputRef = useRef()

  const bgC      = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted    = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const detailC  = dark ? 'text-[#b0b4c4]' : 'text-gray-600'
  const rowBg    = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'
  const uploadBg = dark ? 'bg-[#1a1e2a] border-white/15' : 'bg-gray-50 border-black/15'

  const accentColorMap = {
    blue:   dark ? '#4f8ef7' : '#185fa5',
    teal:   dark ? '#2abfb0' : '#0f6e56',
    amber:  dark ? '#f0a040' : '#854f0b',
    red:    dark ? '#e05a6a' : '#a32d2d',
    purple: dark ? '#9b7de8' : '#534ab7',
    green:  dark ? '#3ec97e' : '#3b6d11',
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      >
        <div
          className={`w-full max-w-lg rounded-2xl border p-6 ${bgC} max-h-[90vh] overflow-y-auto`}
          onClick={e => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{ICON[item.category] || '📌'}</span>
              <div>
                <h2 className="text-base font-semibold">{item.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge color={item.color}>{item.category}</Badge>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${muted} ${dark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}
            >✕</button>
          </div>

          {/* 설명 */}
          <p className={`text-sm mb-4 ${muted}`}>{item.desc}</p>

          {/* 상세 내용 */}
          <div className={`rounded-xl p-4 mb-4 ${rowBg}`}
            style={{ borderLeft: `3px solid ${accentColorMap[item.color]}` }}>
            <p className="text-xs font-semibold mb-2.5" style={{ color: accentColorMap[item.color] }}>핵심 내용</p>
            <ul className="space-y-2">
              {item.details.map((d, i) => (
                <li key={i} className={`text-xs flex gap-2 ${detailC}`}>
                  <span className="opacity-40 shrink-0 mt-0.5">—</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 키워드 */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {item.keywords.map(k => (
              <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark ? 'bg-white/5 border-white/10 text-[#7a7f94]' : 'bg-black/5 border-black/10 text-gray-500'}`}>
                {k}
              </span>
            ))}
          </div>

          {/* 이미지 업로드 */}
          <p className="text-xs font-semibold mb-2">예시 차트 사진</p>
          {image ? (
            <div className="mb-3">
              <div className="relative group">
                <img
                  src={image}
                  alt=""
                  className="w-full rounded-lg object-cover border border-white/10 cursor-zoom-in"
                  onClick={() => setZoomSrc(image)}
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs hidden group-hover:flex items-center justify-center"
                >✕</button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => inputRef.current.click()}
              className={`border border-dashed rounded-xl p-4 text-center cursor-pointer hover:opacity-70 transition-opacity ${uploadBg}`}
            >
              <p className={`text-lg mb-0.5 ${muted}`}>+</p>
              <p className={`text-xs ${muted}`}>클릭하여 차트 사진 업로드</p>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>

      {zoomSrc && <ImageZoomModal src={zoomSrc} onClose={() => setZoomSrc(null)} />}
    </>
  )
}

/* ── 개념 카드 ── */
function ConceptCard({ item, onClick }) {
  const { dark } = useTheme()
  const cardBg = dark
    ? 'bg-[#13161e] border-white/8 hover:border-white/20'
    : 'bg-white border-black/8 hover:border-black/20'
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'

  const accentColorMap = {
    blue:   dark ? '#4f8ef7' : '#185fa5',
    teal:   dark ? '#2abfb0' : '#0f6e56',
    amber:  dark ? '#f0a040' : '#854f0b',
    red:    dark ? '#e05a6a' : '#a32d2d',
    purple: dark ? '#9b7de8' : '#534ab7',
    green:  dark ? '#3ec97e' : '#3b6d11',
  }

  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all cursor-pointer w-full ${cardBg}`}
      style={{ borderLeft: `3px solid ${accentColorMap[item.color]}` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">{ICON[item.category] || '📌'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug mb-1">{item.title}</p>
          <p className={`text-xs leading-relaxed line-clamp-2 ${muted}`}>{item.desc}</p>
        </div>
      </div>
    </button>
  )
}

/* ── 메인 ── */
export default function Concepts() {
  const { dark } = useTheme()
  const { query, setQuery, filtered } = usePageSearch(CONCEPTS, ['title', 'desc', 'keywords', 'details'])
  const [selected, setSelected] = useState(null)

  const categories = [...new Set(CONCEPTS.map(c => c.category))]
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const catC  = dark ? 'text-[#4f8ef7]' : 'text-[#185fa5]'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">개념 · 용어</h1>
        <p className={`text-sm ${muted}`}>기술적 분석 핵심 용어 — 클릭하면 상세 보기</p>
      </div>

      <PageSearch query={query} setQuery={setQuery} placeholder="용어 검색... (예: RSI, 피보나치, 골든크로스)" />
      {query && <p className={`text-xs mb-4 ${muted}`}>{filtered.length}개 결과</p>}

      {!query && categories.map(cat => {
        const items = CONCEPTS.filter(c => c.category === cat)
        return (
          <section key={cat} className="mb-8">
            <h2 className={`text-xs font-mono font-semibold uppercase tracking-widest mb-3 ${catC}`}>{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map(item => (
                <ConceptCard key={item.title} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </section>
        )
      })}

      {query && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.length === 0
            ? <p className={`text-sm ${muted}`}>검색 결과 없음</p>
            : filtered.map(item => (
              <ConceptCard key={item.title} item={item} onClick={() => setSelected(item)} />
            ))
          }
        </div>
      )}

      {selected && <ConceptModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
