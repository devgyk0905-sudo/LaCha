import { useState, useRef } from 'react'
import { useTheme } from '../App'
import { Card, Badge, Alert, SectionTitle, Code, Table } from '../components/UI'
import ChartNote from '../components/ChartNote'

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
  { id: 'cor_abc', label: 'ABC' },
]

export default function WaveTheory() {
  const { dark } = useTheme()
  const [active, setActive] = useState('step')
  const [subImp, setSubImp] = useState('imp_basic')
  const [subCor, setSubCor] = useState('cor_wxy')
  const muted       = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const tabActive   = dark ? 'bg-[#1a1e2a] text-[#4f8ef7] border border-white/10' : 'bg-white text-[#185fa5] border border-black/10 shadow-sm'
  const tabInactive = dark ? 'text-[#7a7f94] hover:text-[#e8eaf0]' : 'text-gray-500 hover:text-gray-800'
  const subActive   = dark ? 'bg-[#4f8ef7]/15 text-[#4f8ef7]' : 'bg-[#185fa5]/10 text-[#185fa5]'
  const subInactive = dark ? 'text-[#7a7f94] hover:text-[#e8eaf0]' : 'text-gray-400 hover:text-gray-700'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">엘리어트 파동</h1>
        <p className={`text-sm ${muted}`}>엘리어트 파동 이론 — 충격파동 · 조정파동 · 마무리 패턴</p>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active === t.id ? tabActive : tabInactive}`}>
            {t.label}
          </button>
        ))}
      </div>

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

/* ── 판별 순서 ── */
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
      <ChartNote page="wave" section="step" label="추가 이미지" />
    </div>
  )
}

/* ── 임펄스 기본 ── */
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
      <ChartNote page="wave" section="imp_basic" label="추가 이미지" />
    </div>
  )
}

/* ── 터미널 ── */
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
      <ChartNote page="wave" section="imp_terminal" label="추가 이미지" />
    </div>
  )
}

/* ── 확장 임펄스 SVG ── */
function ImpulseExpandSVG() {
  const { dark } = useTheme()
  const stroke = dark ? '#e8eaf0' : '#1a1e2a'
  const muted  = dark ? '#7a7f94' : '#888780'

  return (
    <svg width="100%" viewBox="0 0 660 220" xmlns="http://www.w3.org/2000/svg">
      {/* ── 1파 연장 ── */}
      <line x1="10" y1="205" x2="185" y2="90" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <line x1="55" y1="185" x2="210" y2="55" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <polyline points="18,200 65,72 85,118 115,58 135,92 160,70 185,88"
        fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      <text x="60" y="64" fontSize="11" fill={stroke} textAnchor="middle">1</text>
      <text x="88" y="130" fontSize="11" fill={stroke} textAnchor="middle">2</text>
      <text x="118" y="50" fontSize="11" fill={stroke} textAnchor="middle">3</text>
      <text x="138" y="104" fontSize="11" fill={stroke} textAnchor="middle">4</text>
      <text x="188" y="80" fontSize="11" fill={stroke} textAnchor="middle">5</text>
      <text x="110" y="218" fontSize="12" fill={muted} textAnchor="middle">임펄스 1파 연장</text>

      {/* ── 3파 연장 ── */}
      <line x1="240" y1="205" x2="415" y2="90" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <line x1="275" y1="195" x2="440" y2="55" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <polyline points="248,200 278,148 298,178 345,55 370,105 398,80 418,92"
        fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      <text x="275" y="140" fontSize="11" fill={stroke} textAnchor="middle">1</text>
      <text x="302" y="192" fontSize="11" fill={stroke} textAnchor="middle">2</text>
      <text x="348" y="46" fontSize="11" fill={stroke} textAnchor="middle">3</text>
      <text x="373" y="118" fontSize="11" fill={stroke} textAnchor="middle">4</text>
      <text x="422" y="83" fontSize="11" fill={stroke} textAnchor="middle">5</text>
      <text x="335" y="218" fontSize="12" fill={muted} textAnchor="middle">임펄스 3파 연장</text>

      {/* ── 5파 연장 ── */}
      <line x1="468" y1="205" x2="643" y2="90" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <line x1="500" y1="195" x2="655" y2="68" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <polyline points="475,200 505,155 525,178 558,120 578,148 618,60 645,78"
        fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      <text x="502" y="147" fontSize="11" fill={stroke} textAnchor="middle">1</text>
      <text x="528" y="192" fontSize="11" fill={stroke} textAnchor="middle">2</text>
      <text x="560" y="112" fontSize="11" fill={stroke} textAnchor="middle">3</text>
      <text x="581" y="162" fontSize="11" fill={stroke} textAnchor="middle">4</text>
      <text x="648" y="52" fontSize="11" fill={stroke} textAnchor="middle">5</text>
      <text x="560" y="218" fontSize="12" fill={muted} textAnchor="middle">임펄스 5파 연장</text>

      <line x1="222" y1="20" x2="222" y2="205" stroke={muted} strokeWidth="0.5" opacity="0.4"/>
      <line x1="452" y1="20" x2="452" y2="205" stroke={muted} strokeWidth="0.5" opacity="0.4"/>
    </svg>
  )
}

/* ── 확장 임펄스 ── */
function ImpulseExpand() {
  const { dark } = useTheme()
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  return (
    <div className="space-y-4">
      <SectionTitle color="purple">확장 임펄스</SectionTitle>
      <p className="text-sm text-[#7a7f94]">1, 3, 5파 중 하나가 비정상적으로 길게 연장되는 패턴</p>
      <Card>
        <p className="font-semibold text-sm mb-4">파동별 연장 유형</p>
        <ImpulseExpandSVG />
      </Card>
      <Card>
        <p className="font-semibold text-sm mb-3">확장 유형 비교</p>
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
      <ChartNote page="wave" section="imp_expand" label="추가 이미지" />
    </div>
  )
}

/* ── WXY / WXYXZ — 앵커 스크롤 ── */
function CorrectWXY() {
  const { dark } = useTheme()
  const wxyRef   = useRef(null)
  const wxyxzRef = useRef(null)
  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const anchorActive   = dark ? 'bg-[#9b7de8]/15 text-[#9b7de8] border border-[#9b7de8]/30' : 'bg-[#534ab7]/10 text-[#534ab7] border border-[#534ab7]/20'
  const anchorInactive = dark ? 'text-[#7a7f94] border border-white/10 hover:text-[#e8eaf0]' : 'text-gray-400 border border-black/10 hover:text-gray-700'
  const divC           = dark ? 'border-white/8' : 'border-black/8'

  return (
    <div className="space-y-4">
      <SectionTitle color="purple">WXY / WXYXZ 복합조정</SectionTitle>

      <div className="flex gap-2">
        <button onClick={() => scrollTo(wxyRef)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${anchorActive}`}>WXY</button>
        <button onClick={() => scrollTo(wxyxzRef)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${anchorInactive}`}>WXYXZ</button>
      </div>

      {/* WXY */}
      <div ref={wxyRef} className="scroll-mt-24 space-y-4">
        <p className="text-xs font-semibold text-[#9b7de8] pt-2">WXY</p>
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

      <div className={`border-t ${divC} my-6`} />

      {/* WXYXZ */}
      <div ref={wxyxzRef} className="scroll-mt-24 space-y-4">
        <p className="text-xs font-semibold text-[#9b7de8]">WXYXZ</p>
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

      <ChartNote page="wave" section="cor_wxy" label="추가 이미지" />
    </div>
  )
}

/* ── ABC / 플랫 ── */
function CorrectABC() {
  const { dark } = useTheme()
  const divC = dark ? 'border-white/8' : 'border-black/8'

  return (
    <div className="space-y-4">
      <SectionTitle color="teal">ABC 조정</SectionTitle>
      <p className="text-sm text-[#7a7f94]">큰 추세의 반대 방향 조정 — 가격 조정의 기본</p>

      {/* ABC 내용 */}
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

      {/* 구분선 */}
      <div className={`border-t ${divC} my-2`} />

      {/* 플랫 유형 */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-[#2abfb0]">플랫 유형</p>
        <p className="text-sm text-[#7a7f94]">B파 위치와 C파 위치로 구분</p>

        {/* flat_patterns_1.svg 인라인 삽입 */}
        <Card>
          <div className="w-full overflow-x-auto">
            <svg width="100%" viewBox="0 0 921 605" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_flat)">
                <rect width="921" height="605" fill={dark ? '#0d0f14' : 'white'}/>
                <path d="M122.11 73.004H122.95C123.715 73.004 124.471 72.9853 125.218 72.948C125.974 72.9013 126.786 72.8033 127.654 72.654L127.752 73.606C126.865 73.7647 126.039 73.8673 125.274 73.914C124.518 73.9513 123.743 73.97 122.95 73.97H122.11V73.004ZM122.082 65.822H126.59V70.218H123.23V73.41H122.11V69.28H125.47V66.774H122.082V65.822ZM131.322 64.422H132.428V77.092H131.322V64.422ZM127.192 68.972H129.25V69.938H127.192V68.972ZM128.76 64.73H129.852V76.42H128.76V64.73ZM137.635 69.42H138.797V71.996H137.635V69.42ZM141.807 69.42H142.955V71.996H141.807V69.42ZM136.025 64.926H144.173V65.864H136.025V64.926ZM134.569 68.958H146.049V69.896H134.569V68.958ZM143.417 64.926H144.565V65.738C144.565 66.186 144.551 66.7087 144.523 67.306C144.495 67.9033 144.397 68.5893 144.229 69.364L143.081 69.238C143.249 68.4727 143.347 67.81 143.375 67.25C143.403 66.6807 143.417 66.1767 143.417 65.738V64.926ZM135.927 71.548H144.593V74.614H137.103V76.35H135.955V73.788H143.445V72.472H135.927V71.548ZM135.955 76.014H144.915V76.938H135.955V76.014ZM156.702 64.422H157.85V77.106H156.702V64.422ZM154.294 69.28H156.982V70.246H154.294V69.28ZM147.924 73.088H148.89C149.637 73.088 150.323 73.0787 150.948 73.06C151.573 73.0413 152.18 73.004 152.768 72.948C153.356 72.892 153.958 72.8033 154.574 72.682L154.672 73.648C154.037 73.76 153.421 73.8487 152.824 73.914C152.236 73.97 151.62 74.012 150.976 74.04C150.341 74.0587 149.646 74.068 148.89 74.068H147.924V73.088ZM147.882 65.598H153.538V70.036H149.072V73.396H147.924V69.084H152.404V66.55H147.882V65.598ZM165.328 64.814H174.61V65.71H165.328V64.814ZM165.37 68.118H174.568V69.014H165.37V68.118ZM167.232 65.15H168.394V68.72H167.232V65.15ZM171.544 65.15H172.706V68.72H171.544V65.15ZM164.264 70.064H175.702V71.002H164.264V70.064ZM165.65 72.108H174.232V74.894H166.812V76.42H165.678V74.054H173.098V72.976H165.65V72.108ZM165.678 76.056H174.61V76.952H165.678V76.056ZM186.705 64.436H187.811V73.046H186.705V64.436ZM184.675 67.74H187.055V68.692H184.675V67.74ZM183.905 64.674H184.997V71.954H183.905V64.674ZM177.717 70.834H178.543C179.141 70.834 179.691 70.8247 180.195 70.806C180.709 70.7873 181.208 70.75 181.693 70.694C182.179 70.638 182.673 70.554 183.177 70.442L183.303 71.38C182.771 71.4827 182.258 71.562 181.763 71.618C181.269 71.674 180.76 71.7113 180.237 71.73C179.715 71.7487 179.15 71.758 178.543 71.758H177.717V70.834ZM177.689 65.416H182.449V68.972H178.837V71.45H177.717V68.09H181.329V66.368H177.689V65.416ZM183.023 72.472H184.017V72.794C184.017 73.354 183.887 73.872 183.625 74.348C183.364 74.8147 183.005 75.23 182.547 75.594C182.099 75.958 181.586 76.2613 181.007 76.504C180.438 76.756 179.836 76.9333 179.201 77.036L178.739 76.126C179.178 76.0607 179.607 75.958 180.027 75.818C180.457 75.6687 180.849 75.4913 181.203 75.286C181.567 75.0807 181.885 74.8473 182.155 74.586C182.426 74.3247 182.636 74.0447 182.785 73.746C182.944 73.4473 183.023 73.13 183.023 72.794V72.472ZM183.191 72.472H184.185V72.794C184.185 73.13 184.26 73.4473 184.409 73.746C184.568 74.0447 184.783 74.3247 185.053 74.586C185.324 74.8473 185.637 75.0807 185.991 75.286C186.355 75.4913 186.747 75.6687 187.167 75.818C187.597 75.958 188.031 76.0607 188.469 76.126L188.007 77.036C187.373 76.9333 186.766 76.756 186.187 76.504C185.618 76.2613 185.105 75.958 184.647 75.594C184.199 75.23 183.845 74.8147 183.583 74.348C183.322 73.872 183.191 73.354 183.191 72.794V72.472Z" fill={dark ? '#e8eaf0' : '#1A1E2A'}/>
                <path d="M37.9235 193.885H265.465" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M37.9235 235H265.465" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M37.9235 403.308H265.465" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M54.1765 193.885L108.353 403.308" stroke="#E05A6A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M108.353 403.308L162.529 234.606" stroke="#3EC97E" strokeWidth="2" strokeLinecap="round"/>
                <path d="M162.529 235L216.706 421.569" stroke="#E05A6A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M37.9235 421.569H265.465" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M351.712 136.731H579.253" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M351.712 403.308H579.253" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M351.712 459.938H579.253" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M367.965 403.308L422.141 136.731" stroke="#E05A6A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M422.141 136.731L476.318 97.4236" stroke="#3EC97E" strokeWidth="2" strokeLinecap="round"/>
                <path d="M476.318 97.4236L530.494 459.938" stroke="#E05A6A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M665.5 193.885H893.041" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M665.5 403.308H893.041" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M665.5 100.308H893.041" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M681.753 403.308L735.929 193.885" stroke="#E05A6A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M735.929 193.885L790.106 96.5385" stroke="#3EC97E" strokeWidth="2" strokeLinecap="round"/>
                <path d="M790.106 96.5385L844.282 340" stroke="#E05A6A" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 3"/>
                <path d="M665.5 340H893.041" stroke="#888780" strokeWidth="0.5" strokeDasharray="4 3"/>
                <path d="M420.509 533H419.452C419.39 532.696 419.28 532.429 419.124 532.199C418.971 531.969 418.783 531.776 418.562 531.619C418.343 531.46 418.1 531.341 417.833 531.261C417.566 531.182 417.288 531.142 416.998 531.142C416.469 531.142 415.991 531.276 415.562 531.543C415.136 531.81 414.796 532.203 414.543 532.723C414.293 533.243 414.168 533.881 414.168 534.636C414.168 535.392 414.293 536.03 414.543 536.55C414.796 537.07 415.136 537.463 415.562 537.73C415.991 537.997 416.469 538.131 416.998 538.131C417.288 538.131 417.566 538.091 417.833 538.011C418.1 537.932 418.343 537.814 418.562 537.658C418.783 537.499 418.971 537.304 419.124 537.074C419.28 536.841 419.39 536.574 419.452 536.273H420.509C420.43 536.719 420.285 537.118 420.074 537.47C419.864 537.822 419.603 538.122 419.29 538.369C418.978 538.614 418.627 538.8 418.238 538.928C417.851 539.055 417.438 539.119 416.998 539.119C416.253 539.119 415.592 538.938 415.012 538.574C414.432 538.21 413.976 537.693 413.644 537.023C413.312 536.352 413.145 535.557 413.145 534.636C413.145 533.716 413.312 532.92 413.644 532.25C413.976 531.58 414.432 531.062 415.012 530.699C415.592 530.335 416.253 530.153 416.998 530.153C417.438 530.153 417.851 530.217 418.238 530.345C418.627 530.473 418.978 530.661 419.29 530.908C419.603 531.152 419.864 531.45 420.074 531.803C420.285 532.152 420.43 532.551 420.509 533Z" fill={dark ? '#e8eaf0' : '#1A1E2A'}/>
              </g>
              <defs>
                <clipPath id="clip0_flat">
                  <rect width="921" height="605" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: '기본 플랫', color: 'teal', b: '0.382~0.5\nA 시작점 미돌파', c: 'A 저점 이탈', note: '가장 일반적' },
            { label: '확장 플랫 (Expanded)', color: 'amber', b: '1.09~1.272\nA 시작점 돌파', c: 'A 저점 이탈', note: 'B가 A 시작점 스윕' },
            { label: '러닝 플랫 (Running)', color: 'purple', b: 'A 시작점 돌파', c: 'A 저점 미이탈', note: 'C파 약함' },
          ].map(item => (
            <Card key={item.label} accent={item.color}>
              <Badge color={item.color}>{item.label}</Badge>
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

      <ChartNote page="wave" section="cor_abc" label="추가 이미지" />
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
      <ChartNote page="wave" section="ending" label="추가 이미지" />
    </div>
  )
}
