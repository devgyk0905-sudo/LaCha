import { useState, useRef } from 'react'
import { useTheme } from '../App'
import { Card, Badge, Alert, SectionTitle, Code, Table } from '../components/UI'

const TABS = [
  { id: 'step',    label: '판별 순서' },
  { id: 'impulse', label: '충격파동' },
  { id: 'correct', label: '조정파동' },
  { id: 'ending',  label: '마무리 패턴' },
]

const SUB_IMPULSE = [
  { id: 'imp_basic',    label: '임펄스' },
  { id: 'imp_terminal', label: '터미널' },
  { id: 'imp_expand',   label: '확장' },
]

const SUB_CORRECT = [
  { id: 'cor_wxy', label: 'WXY / WXYXZ' },
  { id: 'cor_abc', label: 'ABC / 플랫' },
]

export default function WaveTheory() {
  const { dark } = useTheme()
  const [active, setActive] = useState('step')
  const [subImp, setSubImp] = useState('imp_basic')
  const [subCor, setSubCor] = useState('cor_wxy')
  const muted      = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const tabActive  = dark ? 'bg-[#1a1e2a] text-[#4f8ef7] border border-white/10' : 'bg-white text-[#185fa5] border border-black/10 shadow-sm'
  const tabInactive = dark ? 'text-[#7a7f94] hover:text-[#e8eaf0]' : 'text-gray-500 hover:text-gray-800'
  const subActive  = dark ? 'bg-[#4f8ef7]/15 text-[#4f8ef7]' : 'bg-[#185fa5]/10 text-[#185fa5]'
  const subInactive = dark ? 'text-[#7a7f94] hover:text-[#e8eaf0]' : 'text-gray-400 hover:text-gray-700'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">엘리어트 파동</h1>
        <p className={`text-sm ${muted}`}>엘리어트 파동 이론 — 충격파동 · 조정파동 · 마무리 패턴</p>
      </div>

      {/* 메인 탭 */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active === t.id ? tabActive : tabInactive}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 서브 탭 */}
      {active === 'impulse' && (
        <div className="flex gap-1.5 mb-6">
          {SUB_IMPULSE.map(s => (
            <button key={s.id} onClick={() => setSubImp(s.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${subImp === s.id ? subActive : subInactive}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}
      {active === 'correct' && (
        <div className="flex gap-1.5 mb-6">
          {SUB_CORRECT.map(s => (
            <button key={s.id} onClick={() => setSubCor(s.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${subCor === s.id ? subActive : subInactive}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="page-enter">
        {active === 'step'    && <StepSection />}
        {active === 'impulse' && subImp === 'imp_basic'    && <ImpulseBasic />}
        {active === 'impulse' && subImp === 'imp_terminal' && <ImpulseTerminal />}
        {active === 'impulse' && subImp === 'imp_expand'   && <ImpulseExpand />}
        {active === 'correct' && subCor === 'cor_wxy'      && <CorrectWXY />}
        {active === 'correct' && subCor === 'cor_abc'      && <CorrectABC />}
        {active === 'ending'  && <EndingSection />}
      </div>
    </div>
  )
}

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

/* ── 예시 사진 업로드 (2열, 클릭 확대) ── */
function ExampleImages({ label = '예시 차트 사진' }) {
  const { dark } = useTheme()
  const [images, setImages] = useState([])
  const [zoomSrc, setZoomSrc] = useState(null)
  const inputRef = useRef()
  const borderC = dark ? 'border-white/15' : 'border-black/15'
  const bgC     = dark ? 'bg-[#1a1e2a]'   : 'bg-gray-50'
  const muted   = dark ? 'text-[#7a7f94]' : 'text-gray-400'

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
  }

  return (
    <>
      <div className="mt-4">
        <p className="text-xs font-semibold mb-2">{label}</p>
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {images.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt=""
                  className="w-full rounded-lg object-cover aspect-video border border-white/10 cursor-zoom-in"
                  onClick={() => setZoomSrc(src)}
                />
                <button
                  onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs hidden group-hover:flex items-center justify-center">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <div
          onClick={() => inputRef.current.click()}
          className={`border border-dashed ${borderC} ${bgC} rounded-lg p-4 text-center cursor-pointer hover:opacity-80 transition-opacity`}>
          <p className="text-lg mb-1">+</p>
          <p className={`text-xs ${muted}`}>클릭하여 차트 사진 업로드</p>
          <p className={`text-xs ${muted} mt-0.5`}>PNG · JPG · WEBP</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      </div>

      {zoomSrc && <ImageZoomModal src={zoomSrc} onClose={() => setZoomSrc(null)} />}
    </>
  )
}

/* ── STEP 판별순서 ── */
function StepSection() {
  return (
    <div className="space-y-4">
      <SectionTitle color="blue">판별 순서</SectionTitle>
      <p className="text-sm text-[#7a7f94]">채널을 먼저 그린 뒤 단계별로 확인</p>

      <Card accent="blue">
        <p className="font-semibold text-sm mb-3">STEP 1 — 채널을 그린다</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold mb-2 text-[#4f8ef7]">채널 지킬 때</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {['WXY', 'WXYXZ', '이중플랫', '3파연장 임펄스'].map(t => <Code key={t}>{t}</Code>)}
            </div>
            <Alert type="blue">피보나치 <strong>확장</strong>으로 판별<br/>W시작(1) → W끝(2) → X끝(3) 클릭</Alert>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2 text-[#f0a040]">채널 안 지킬 때</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {['ABC', '12345'].map(t => <Code key={t}>{t}</Code>)}
            </div>
            <Alert type="amber">피보나치 <strong>되돌림</strong>으로 판별<br/>추세 방향이면 12345 / 반대면 ABC</Alert>
          </div>
        </div>
      </Card>

      <Card>
        <p className="font-semibold text-sm mb-3">STEP 2 — 채널 지킬 때: 피보나치 확장 수치</p>
        <Table
          headers={['Y/Z 마무리 위치', '채널 중단 여부', '결론']}
          rows={[
            [<Code>0.618 ~ 1.0</Code>, <span className="text-green-400">O</span>, <span className="text-green-400">WXY 종료</span>],
            [<Code>0.618 ~ 1.0</Code>, <span className="text-red-400">X</span>, <span className="text-amber-400">ABC / 12345 / WXYXZ 추가 확인</span>],
            [<Code>1.0 ~ 1.618</Code>, <span className="text-red-400">X</span>, <span className="text-amber-400">WXYXZ 가능성 → Z 찾기</span>],
            [<Code>1.618 초과</Code>, '—', <span className="text-red-400">카운팅 재검토</span>],
          ]}
        />
        <Alert type="red"><strong>절대규칙</strong>: 하나의 파동만 확장 — Y 확장 시 Z는 <Code>0.618~1.0</Code> 이내</Alert>
      </Card>

      <Card>
        <p className="font-semibold text-sm mb-3">STEP 2-2 — 채널 안 지킬 때: 되돌림 수치</p>
        <Table
          headers={['확인 항목', '수치', '결론']}
          rows={[
            ['되돌림 후 추세 방향 재개', <Code>2파가 1파의 0.382~0.618</Code>, <span className="text-blue-400">12345 의심</span>],
            ['되돌림 후 반대 방향 재개', <Code>B파가 A파의 0.382~0.618</Code>, <span className="text-teal-400">ABC 의심</span>],
            ['C파 길이', <Code>A파의 1.0~1.618배</Code>, <span className="text-teal-400">ABC 확정</span>],
            ['3규칙 모두 충족', '2파 미이탈 / 3파 최단 아님 / 4파 미겹침', <span className="text-blue-400">12345 확정</span>],
          ]}
        />
      </Card>
      <ExampleImages label="판별 순서 예시 차트" />
    </div>
  )
}

/* ── 충격파동: 임펄스 ── */
function ImpulseBasic() {
  return (
    <div className="space-y-4">
      <SectionTitle color="blue">임펄스 12345</SectionTitle>
      <p className="text-sm text-[#7a7f94]">추세 방향으로 강하고 빠르게 움직이는 기본 충격파동</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <p className="font-semibold text-sm mb-3">파동 구성</p>
          <Table
            headers={['파동', '방향', '조건']}
            rows={[
              [<Code>1파</Code>, <span className="text-green-400">추세</span>, '시작'],
              [<Code>2파</Code>, <span className="text-red-400">조정</span>, <>1파 저점 이탈 불가 / <Code>0.382~0.618</Code></>],
              [<Code>3파</Code>, <span className="text-green-400">추세</span>, '1,3,5파 중 가장 짧으면 안 됨'],
              [<Code>4파</Code>, <span className="text-red-400">조정</span>, '1파 영역 겹침 불가'],
              [<Code>5파</Code>, <span className="text-green-400">추세</span>, '거래량 감소하며 마무리'],
            ]}
          />
        </Card>
        <Card accent="red">
          <p className="font-semibold text-sm mb-3">3가지 절대 규칙</p>
          {['2파 저점이 1파 저점 아래로 내려가면 안 됨', '1,3,5파 중 3파가 가장 짧으면 안 됨', '4파가 1파 영역과 겹치면 안 됨'].map((r, i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-white/6 last:border-b-0 text-sm">
              <span className="font-mono text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded shrink-0 mt-0.5">{i+1}</span>
              <span>{r}</span>
            </div>
          ))}
          <Alert type="amber">하나라도 위반 시 → 12345 아님</Alert>
        </Card>
      </div>
      <ExampleImages label="임펄스 예시 차트" />
    </div>
  )
}

/* ── 충격파동: 터미널 ── */
function ImpulseTerminal() {
  return (
    <div className="space-y-4">
      <SectionTitle color="teal">터미널 12345 (다이아고날)</SectionTitle>
      <p className="text-sm text-[#7a7f94]">쐐기형으로 수렴하는 충격파동 — 추세 소진 신호</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <p className="font-semibold text-sm mb-3">임펄스와의 차이</p>
          <Table
            headers={['항목', '임펄스', '터미널']}
            rows={[
              ['모양', '평행/확장', <span className="text-teal-400">쐐기형 수렴</span>],
              ['1-4파 겹침', '불가', <span className="text-teal-400">허용</span>],
              ['5파 길이', '3파보다 짧아도 됨', <span className="text-teal-400">3파보다 짧음</span>],
              ['속도', '빠름', <span className="text-teal-400">느리고 지침</span>],
              ['의미', '추세 강함', <span className="text-teal-400">추세 소진</span>],
            ]}
          />
        </Card>
        <Card accent="teal">
          <p className="font-semibold text-sm mb-3">파동 조건</p>
          <Table
            headers={['파동', '조건']}
            rows={[
              [<Code>1파</Code>, '시작'],
              [<Code>2파</Code>, '1파와 겹침 허용'],
              [<Code>3파</Code>, '1파보다 길어야 함'],
              [<Code>4파</Code>, '1파 영역 겹침 허용'],
              [<Code>5파</Code>, '3파보다 짧음 — 가장 짧음'],
            ]}
          />
          <Alert type="blue">점점 짧아지고 느려지며 쐐기 수렴 → 소진 후 강한 반전</Alert>
        </Card>
      </div>
      <ExampleImages label="터미널 예시 차트" />
    </div>
  )
}

/* ── 충격파동: 확장 ── */
function ImpulseExpand() {
  const { dark } = useTheme()
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  return (
    <div className="space-y-4">
      <SectionTitle color="purple">확장 임펄스</SectionTitle>
      <p className="text-sm text-[#7a7f94]">1, 3, 5파 중 하나가 비정상적으로 길게 연장되는 패턴</p>
      <Card>
        <p className="font-semibold text-sm mb-3">확장 유형</p>
        <Table
          headers={['유형', '특징', '비고']}
          rows={[
            ['1파 확장', '1파가 가장 길게 연장', '비교적 드묾'],
            ['3파 확장', <span className="text-green-400">3파가 가장 길게 연장 — 가장 흔함</span>, '강한 추세 구간'],
            ['5파 확장', '5파가 가장 길게 연장', '거래량 감소 확인 중요'],
          ]}
        />
      </Card>
      <Alert type="amber">
        <strong>절대규칙</strong>: 1,3,5파 중 하나만 확장됨 — 두 개 이상 확장되면 카운팅 재검토
      </Alert>
      <Card accent="purple">
        <p className="font-semibold text-sm mb-2">3파 확장이 가장 흔한 이유</p>
        <p className={`text-sm ${muted}`}>3파는 추세의 핵심 구간으로 거래량과 모멘텀이 집중됨. 시장 참여자들이 추세를 인식하고 집중 매수/매도하는 구간이기 때문.</p>
      </Card>
      <ExampleImages label="확장 임펄스 예시 차트" />
    </div>
  )
}

/* ── 조정파동: WXY / WXYXZ ── */
function CorrectWXY() {
  const [sub, setSub] = useState('wxy')
  const { dark } = useTheme()
  const subActive  = dark ? 'bg-[#9b7de8]/15 text-[#9b7de8]' : 'bg-[#534ab7]/10 text-[#534ab7]'
  const subInactive = dark ? 'text-[#7a7f94] hover:text-[#e8eaf0]' : 'text-gray-400 hover:text-gray-700'

  return (
    <div className="space-y-4">
      <SectionTitle color="purple">WXY / WXYXZ 복합조정</SectionTitle>
      <div className="flex gap-2 mb-2">
        {[{id:'wxy',label:'WXY'},{id:'wxyxz',label:'WXYXZ'}].map(s => (
          <button key={s.id} onClick={() => setSub(s.id)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${sub === s.id ? subActive : subInactive}`}>
            {s.label}
          </button>
        ))}
      </div>

      {sub === 'wxy' && (
        <div className="space-y-4">
          <p className="text-sm text-[#7a7f94]">채널을 기막히게 지킨다 — ABC보다 기간이 길다 (기간 조정)</p>
          <Card accent="purple">
            <p className="font-semibold text-sm mb-3">핵심 2가지</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Alert type="blue">채널을 잘 지키네? → <strong>WXY</strong></Alert>
              <Alert type="green">피보나치 확장 <Code>0.618~1.0</Code> + 채널 중단 → <strong>진입 타점</strong></Alert>
            </div>
          </Card>
          <Card>
            <p className="font-semibold text-sm mb-3">파동 구성</p>
            <Table
              headers={['파동', '내부 구성', '비율', '위치']}
              rows={[
                [<Code>W파</Code>, '3파동 (ABC or WXY)', '기준', '조정 첫 번째'],
                [<Code>X파</Code>, '어떤 파동도 가능', '—', '연결 반등'],
                [<Code>Y파</Code>, '5파동 (임펄스/터미널/삼각수렴)', <Code>W:Y = 1:0.618~1.0</Code>, '채널 중단 종료'],
              ]}
            />
          </Card>
          <Card>
            <p className="font-semibold text-sm mb-3">WXY 찾는 순서</p>
            {['채널을 그린다 → 채널을 지키는가?', '피보나치 확장 (W시작→W끝→X끝)', '0.618~1.0 + 채널 중단 → WXY', '이중플랫 배제: Y/Z 확장 개별 확인'].map((s, i) => (
              <div key={i} className="flex gap-3 py-2.5 border-b border-white/6 last:border-b-0 text-sm">
                <span className="w-6 h-6 rounded-full bg-[#4f8ef7]/20 text-[#4f8ef7] flex items-center justify-center text-xs shrink-0 font-mono">{i+1}</span>
                <span>{s}</span>
              </div>
            ))}
          </Card>
          <Alert type="amber">실시간으로 맞추려 하지 말 것 — 조정 종료 신호 먼저 찾고, 사후에 레이블 붙이기</Alert>
        </div>
      )}

      {sub === 'wxyxz' && (
        <div className="space-y-4">
          <p className="text-sm text-[#7a7f94]">Y가 채널 중단이 아닌 최상단/최하단에서 끝났을 때 의심</p>
          <Card>
            <p className="font-semibold text-sm mb-3">파동 구성</p>
            <Table
              headers={['파동', '내부 구성', '비율 / 위치']}
              rows={[
                [<Code>W파</Code>, '3파동', '기준'],
                [<Code>X파</Code>, '어떤 파동도 가능', '—'],
                [<Code>Y파</Code>, '5파동', <><Code>1.0~1.618</Code> 확장 → 채널 중단 아님</>],
                [<Code>X파</Code>, '어떤 파동도 가능', '—'],
                [<Code>Z파</Code>, '5파동', <><Code>0.618~1.0</Code> → 채널 <strong>중단</strong> 종료</>],
              ]}
            />
          </Card>
          <Alert type="red">
            <strong>절대규칙 — 하나의 파동만 확장</strong><br/>
            Y 확장(<Code>1.0~1.618</Code>) → Z는 반드시 <Code>0.618~1.0</Code> 이내
          </Alert>
          <Card accent="amber">
            <p className="font-semibold text-sm mb-3">WXY vs WXYXZ 판별</p>
            <Table
              headers={['Y 마무리', '채널 중단', '결론']}
              rows={[
                [<Code>0.618~1.0</Code>, <span className="text-green-400">O</span>, <span className="text-green-400">WXY 종료</span>],
                [<Code>0.618~1.0</Code>, <span className="text-red-400">X</span>, <span className="text-amber-400">추가 확인</span>],
                [<Code>1.0~1.618</Code>, <span className="text-red-400">X</span>, <span className="text-amber-400">WXYXZ → Z 찾기</span>],
              ]}
            />
          </Card>
        </div>
      )}
      <ExampleImages label="WXY / WXYXZ 예시 차트" />
    </div>
  )
}

/* ── 조정파동: ABC / 플랫 ── */
function CorrectABC() {
  const [sub, setSub] = useState('abc')
  const { dark } = useTheme()
  const subActive  = dark ? 'bg-[#2abfb0]/15 text-[#2abfb0]' : 'bg-[#0f6e56]/10 text-[#0f6e56]'
  const subInactive = dark ? 'text-[#7a7f94] hover:text-[#e8eaf0]' : 'text-gray-400 hover:text-gray-700'

  return (
    <div className="space-y-4">
      <SectionTitle color="teal">ABC 조정 / 플랫 유형</SectionTitle>
      <div className="flex gap-2 mb-2">
        {[{id:'abc',label:'ABC 단순조정'},{id:'flat',label:'플랫 유형'}].map(s => (
          <button key={s.id} onClick={() => setSub(s.id)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${sub === s.id ? subActive : subInactive}`}>
            {s.label}
          </button>
        ))}
      </div>

      {sub === 'abc' && (
        <div className="space-y-4">
          <p className="text-sm text-[#7a7f94]">큰 추세의 반대 방향 조정 — 가격 조정의 기본</p>
          <Card>
            <Table
              headers={['파동', '내부 구성', '피보나치 기준', '규칙']}
              rows={[
                [<Code>A파</Code>, '3파동 또는 5파동', '—', '조정 시작'],
                [<Code>B파</Code>, <><span className="text-red-400">가장 더럽고 길다</span><br/>3파동 (ABC or WXY)</>, <><Code>기본: 0.382~0.5</Code><br/><Code>불규칙: 1.09~1.272</Code></>, 'A 시작점 기준'],
                [<Code>C파</Code>, <><strong>무조건 5파동</strong><br/>임펄스/터미널/WXYXZ</>, <><Code>1:1</Code> / <Code>1:1.236</Code><br/><Code>1:1.382</Code> / <Code>1:1.618</Code></>, 'A파 저점 이탈'],
              ]}
            />
          </Card>
          <Alert type="amber">C파 저점을 미리 잡으려 하면 안 됨 — C파 완성 확인 후 진입</Alert>
        </div>
      )}

      {sub === 'flat' && (
        <div className="space-y-4">
          <p className="text-sm text-[#7a7f94]">B파 위치와 C파 위치로 구분</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: '기본 플랫', color: 'teal', b: '0.382~0.5\nA 시작점 미돌파', c: 'A 저점 이탈', note: '가장 일반적' },
              { label: '불규칙 플랫\n(Expanded)', color: 'amber', b: '1.09~1.272\nA 시작점 돌파', c: 'A 저점 이탈', note: 'B가 A 시작점 스윕' },
              { label: '미달형 플랫\n(Running)', color: 'purple', b: 'A 시작점 돌파', c: 'A 저점 미이탈', note: '러닝 플랫 / C파 약함' },
            ].map(item => (
              <Card key={item.label} accent={item.color}>
                <Badge color={item.color}>{item.label.replace('\n', ' ')}</Badge>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex gap-2"><Code>B파</Code><span className="whitespace-pre-line">{item.b}</span></div>
                  <div className="flex gap-2"><Code>C파</Code><span>{item.c}</span></div>
                  <p className="text-[#7a7f94] mt-1">{item.note}</p>
                </div>
              </Card>
            ))}
          </div>
          <Card>
            <p className="font-semibold text-sm mb-3">C파 목표값</p>
            <Table
              headers={['목표', '비율', '비고']}
              rows={[
                ['기본', <Code>1:1</Code>, '가장 흔함'],
                ['확장 1', <Code>1:1.236</Code>, '—'],
                ['확장 2', <Code>1:1.382</Code>, '—'],
                ['확장 3', <Code>1:1.618</Code>, '강한 하락 시'],
              ]}
            />
          </Card>
        </div>
      )}
      <ExampleImages label="ABC / 플랫 예시 차트" />
    </div>
  )
}

/* ── 마무리 패턴 ── */
function EndingSection() {
  return (
    <div className="space-y-4">
      <SectionTitle color="green">Y파 / C파 마무리 패턴</SectionTitle>
      <p className="text-sm text-[#7a7f94]">조정 종료 신호 — 이 중 하나가 나오면 반대 방향 전환</p>
      <Alert type="blue">
        <strong>공통</strong>: 5개 파동 / 조정 종료 신호 / 반대 방향 전환<br/>
        <strong>C파</strong>: 임펄스 / 터미널만 가능 — <span className="text-red-400">삼각수렴 불가</span><br/>
        <strong>Y파</strong>: 임펄스 / 터미널 / 삼각수렴 모두 가능
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: '임펄스 12345', color: 'blue',
            rows: [['1파','시작'],['2파','1파의 0.382~0.618'],['3파','가장 짧으면 안 됨'],['4파','1파 영역 겹침 불가'],['5파','거래량 감소']],
            note: '겹침 없음 / 강하고 빠름', trust: '높음', tc: 'text-green-400' },
          { label: '터미널 12345', color: 'teal',
            rows: [['1파','시작'],['2파','1파와 겹침 허용'],['3파','1파보다 길어야 함'],['4파','1파 영역 겹침 허용'],['5파','3파보다 짧음']],
            note: '쐐기형 수렴 / 점점 짧아짐', trust: '중간', tc: 'text-amber-400' },
          { label: '삼각수렴 ABCDE', color: 'green',
            rows: [['A파','가장 긴 하락'],['B파','A 시작점 미돌파'],['C파','A 저점 미이탈'],['D파','B 고점 미돌파'],['E파','가장 짧음']],
            note: '고점↓ 저점↑ / E파 후 돌파 / Y파만', trust: '중간', tc: 'text-amber-400' },
        ].map(item => (
          <Card key={item.label} accent={item.color}>
            <Badge color={item.color}>{item.label}</Badge>
            <div className="mt-3 space-y-1.5">
              {item.rows.map(([w, c]) => (
                <div key={w} className="flex gap-2 text-xs">
                  <Code>{w}</Code><span className="text-[#7a7f94]">{c}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#7a7f94] mt-3">{item.note}</p>
            <p className="text-xs mt-1">신뢰도: <span className={item.tc}>{item.trust}</span></p>
          </Card>
        ))}
      </div>
      <ExampleImages label="마무리 패턴 예시 차트" />
    </div>
  )
}
