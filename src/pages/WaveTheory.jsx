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
  { id: 'cor_abc', label: 'ABC / 플랫' },
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

/* ── 임펄스 ── */
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
      {/* 채널 하단선 */}
      <line x1="10" y1="205" x2="185" y2="90" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      {/* 채널 상단선 */}
      <line x1="55" y1="185" x2="210" y2="55" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      {/* 파동: 1파(길게), 2파, 3파, 4파, 5파 */}
      <polyline
        points="18,200 65,72 85,118 115,58 135,92 160,70 185,88"
        fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"
      />
      {/* 숫자 레이블 */}
      <text x="60" y="64" fontSize="11" fill={stroke} textAnchor="middle">1</text>
      <text x="88" y="130" fontSize="11" fill={stroke} textAnchor="middle">2</text>
      <text x="118" y="50" fontSize="11" fill={stroke} textAnchor="middle">3</text>
      <text x="138" y="104" fontSize="11" fill={stroke} textAnchor="middle">4</text>
      <text x="188" y="80" fontSize="11" fill={stroke} textAnchor="middle">5</text>
      {/* 제목 */}
      <text x="110" y="218" fontSize="12" fill={muted} textAnchor="middle">임펄스 1파 연장</text>

      {/* ── 3파 연장 ── */}
      <line x1="240" y1="205" x2="415" y2="90" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <line x1="275" y1="195" x2="440" y2="55" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <polyline
        points="248,200 278,148 298,178 345,55 370,105 398,80 418,92"
        fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"
      />
      <text x="275" y="140" fontSize="11" fill={stroke} textAnchor="middle">1</text>
      <text x="302" y="192" fontSize="11" fill={stroke} textAnchor="middle">2</text>
      <text x="348" y="46" fontSize="11" fill={stroke} textAnchor="middle">3</text>
      <text x="373" y="118" fontSize="11" fill={stroke} textAnchor="middle">4</text>
      <text x="422" y="83" fontSize="11" fill={stroke} textAnchor="middle">5</text>
      <text x="335" y="218" fontSize="12" fill={muted} textAnchor="middle">임펄스 3파 연장</text>

      {/* ── 5파 연장 ── */}
      <line x1="468" y1="205" x2="643" y2="90" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <line x1="500" y1="195" x2="655" y2="68" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <polyline
        points="475,200 505,155 525,178 558,120 578,148 618,60 645,78"
        fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"
      />
      <text x="502" y="147" fontSize="11" fill={stroke} textAnchor="middle">1</text>
      <text x="528" y="192" fontSize="11" fill={stroke} textAnchor="middle">2</text>
      <text x="560" y="112" fontSize="11" fill={stroke} textAnchor="middle">3</text>
      <text x="581" y="162" fontSize="11" fill={stroke} textAnchor="middle">4</text>
      <text x="648" y="52" fontSize="11" fill={stroke} textAnchor="middle">5</text>
      <text x="560" y="218" fontSize="12" fill={muted} textAnchor="middle">임펄스 5파 연장</text>

      {/* 구분선 */}
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

      {/* 1파/3파/5파 연장 다이어그램 */}
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

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const subActive   = dark ? 'bg-[#9b7de8]/15 text-[#9b7de8] border border-[#9b7de8]/30' : 'bg-[#534ab7]/10 text-[#534ab7] border border-[#534ab7]/20'
  const subInactive = dark ? 'text-[#7a7f94] border border-white/10 hover:text-[#e8eaf0]' : 'text-gray-400 border border-black/10 hover:text-gray-700'
  const divC        = dark ? 'border-white/8' : 'border-black/8'

  return (
    <div className="space-y-4">
      <SectionTitle color="purple">WXY / WXYXZ 복합조정</SectionTitle>

      {/* 앵커 링크 버튼 */}
      <div className="flex gap-2">
        <button onClick={() => scrollTo(wxyRef)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${subActive}`}>
          WXY
        </button>
        <button onClick={() => scrollTo(wxyxzRef)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${subInactive}`}>
          WXYXZ
        </button>
      </div>

      {/* WXY 섹션 */}
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

      {/* 구분선 */}
      <div className={`border-t ${divC} my-6`} />

      {/* WXYXZ 섹션 */}
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

/* ── ABC / 플랫 — 통합 + SVG ── */
function CorrectABC() {
  const { dark } = useTheme()
  const divC = dark ? 'border-white/8' : 'border-black/8'

  /* 플랫 다이어그램 SVG (Figma 수정본) */
  const FlatDiagram = () => {
    const stroke = dark ? '#e8eaf0' : '#1a1e2a'
    const muted  = dark ? '#7a7f94' : '#888780'
    const green  = '#3ec97e'
    const red    = '#e05a6a'
    return (
      <svg width="100%" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg">
        {/* 제목 */}
        <text x="340" y="22" fontSize="13" fontWeight="500" fill={stroke} textAnchor="middle">플랫 유형 비교</text>
        <text x="340" y="38" fontSize="11" fill={muted} textAnchor="middle">B파 위치와 C파 위치로 유형 구분</text>

        {/* ── 기본 플랫 (좌) ── */}
        <text x="100" y="62" fontSize="12" fontWeight="500" fill={stroke} textAnchor="middle">기본 플랫</text>
        <text x="100" y="76" fontSize="10" fill={muted} textAnchor="middle">B: A 시작점 미돌파</text>
        {/* 기준선 */}
        <line x1="18" y1="100" x2="190" y2="100" stroke={muted} strokeWidth="0.5" strokeDasharray="4 3"/>
        <line x1="18" y1="270" x2="190" y2="270" stroke={muted} strokeWidth="0.5" strokeDasharray="4 3"/>
        {/* A파 */}
        <polyline points="30,100 70,270" fill="none" stroke={red} strokeWidth="2" strokeLinecap="round"/>
        {/* B파 */}
        <polyline points="70,270 110,145" fill="none" stroke={green} strokeWidth="2" strokeLinecap="round"/>
        {/* C파 */}
        <polyline points="110,145 170,288" fill="none" stroke={red} strokeWidth="2" strokeLinecap="round"/>
        {/* 레이블 */}
        <text x="44" y="192" fontSize="11" fill={red}>A</text>
        <text x="82" y="218" fontSize="11" fill={green}>B</text>
        <text x="142" y="228" fontSize="11" fill={red}>C</text>
        {/* 기준선 레이블 */}
        <text x="20" y="97" fontSize="9" fill={muted}>A 시작점</text>
        <text x="20" y="267" fontSize="9" fill={muted}>A 저점</text>
        {/* B 고점 표시 */}
        <line x1="110" y1="100" x2="110" y2="145" stroke={green} strokeWidth="0.8" strokeDasharray="3 2"/>
        <text x="114" y="125" fontSize="9" fill={green}>B 0.382~0.5</text>
        {/* C 저점 이탈 */}
        <line x1="18" y1="288" x2="190" y2="288" stroke={red} strokeWidth="0.5" strokeDasharray="3 2" opacity="0.6"/>
        <text x="22" y="302" fontSize="9" fill={red}>C 저점 이탈</text>

        {/* ── 확장 플랫 (중) ── */}
        <text x="340" y="62" fontSize="12" fontWeight="500" fill={stroke} textAnchor="middle">확장 플랫</text>
        <text x="340" y="76" fontSize="10" fill={muted} textAnchor="middle">B: A 시작점 돌파</text>
        <line x1="258" y1="100" x2="430" y2="100" stroke={muted} strokeWidth="0.5" strokeDasharray="4 3"/>
        <line x1="258" y1="270" x2="430" y2="270" stroke={muted} strokeWidth="0.5" strokeDasharray="4 3"/>
        <polyline points="270,100 310,270" fill="none" stroke={red} strokeWidth="2" strokeLinecap="round"/>
        <polyline points="310,270 350,72" fill="none" stroke={green} strokeWidth="2" strokeLinecap="round"/>
        <polyline points="350,72 410,305" fill="none" stroke={red} strokeWidth="2" strokeLinecap="round"/>
        <text x="284" y="192" fontSize="11" fill={red}>A</text>
        <text x="322" y="192" fontSize="11" fill={green}>B</text>
        <text x="382" y="210" fontSize="11" fill={red}>C</text>
        <text x="260" y="97" fontSize="9" fill={muted}>A 시작점</text>
        <text x="260" y="267" fontSize="9" fill={muted}>A 저점</text>
        {/* B 고점 (A 시작점 돌파) */}
        <line x1="258" y1="72" x2="430" y2="72" stroke={green} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7"/>
        <text x="262" y="68" fontSize="9" fill={green}>B 고점 1.09~1.272 (시작점 돌파)</text>
        {/* C 저점 크게 이탈 */}
        <line x1="258" y1="305" x2="430" y2="305" stroke={red} strokeWidth="0.5" strokeDasharray="3 2" opacity="0.6"/>
        <text x="262" y="318" fontSize="9" fill={red}>C 저점 크게 이탈</text>

        {/* ── 러닝 플랫 (우) ── */}
        <text x="580" y="62" fontSize="12" fontWeight="500" fill={stroke} textAnchor="middle">러닝 플랫</text>
        <text x="580" y="76" fontSize="10" fill={muted} textAnchor="middle">C: A 저점 미이탈</text>
        <line x1="498" y1="100" x2="660" y2="100" stroke={muted} strokeWidth="0.5" strokeDasharray="4 3"/>
        <line x1="498" y1="270" x2="660" y2="270" stroke={muted} strokeWidth="0.5" strokeDasharray="4 3"/>
        <polyline points="510,100 550,270" fill="none" stroke={red} strokeWidth="2" strokeLinecap="round"/>
        <polyline points="550,270 590,74" fill="none" stroke={green} strokeWidth="2" strokeLinecap="round"/>
        {/* C파 — 약한 하락 (점선) */}
        <polyline points="590,74 645,252" fill="none" stroke={red} strokeWidth="2" strokeLinecap="round" strokeDasharray="6 3"/>
        <text x="524" y="192" fontSize="11" fill={red}>A</text>
        <text x="562" y="188" fontSize="11" fill={green}>B</text>
        <text x="620" y="175" fontSize="11" fill={red}>C</text>
        <text x="500" y="97" fontSize="9" fill={muted}>A 시작점</text>
        <text x="500" y="267" fontSize="9" fill={muted}>A 저점</text>
        {/* B 고점 */}
        <line x1="498" y1="74" x2="660" y2="74" stroke={green} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7"/>
        <text x="502" y="70" fontSize="9" fill={green}>B 고점 (시작점 돌파)</text>
        {/* C 저점 미이탈 */}
        <text x="502" y="258" fontSize="9" fill={green}>C 저점 미이탈 ↑</text>
        <text x="502" y="315" fontSize="9" fill={muted}>C파 점선 = 약한 하락</text>

        {/* 구분선 */}
        <line x1="228" y1="50" x2="228" y2="340" stroke={muted} strokeWidth="0.5" opacity="0.3"/>
        <line x1="468" y1="50" x2="468" y2="340" stroke={muted} strokeWidth="0.5" opacity="0.3"/>

        {/* 하단 요약 */}
        <rect x="18" y="330" width="190" height="36" rx="6" fill="none" stroke={muted} strokeWidth="0.5"/>
        <text x="113" y="345" fontSize="10" fill={green} textAnchor="middle">B: 0.382~0.5</text>
        <text x="113" y="359" fontSize="10" fill={red} textAnchor="middle">C: A 저점 이탈</text>

        <rect x="250" y="330" width="190" height="36" rx="6" fill="none" stroke={muted} strokeWidth="0.5"/>
        <text x="345" y="345" fontSize="10" fill={green} textAnchor="middle">B: 1.09~1.272</text>
        <text x="345" y="359" fontSize="10" fill={red} textAnchor="middle">C: A 저점 크게 이탈</text>

        <rect x="478" y="330" width="190" height="36" rx="6" fill="none" stroke={muted} strokeWidth="0.5"/>
        <text x="573" y="345" fontSize="10" fill={green} textAnchor="middle">B: A 시작점 돌파</text>
        <text x="573" y="359" fontSize="10" fill={green} textAnchor="middle">C: A 저점 미이탈</text>
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      <SectionTitle color="teal">ABC 조정 / 플랫 유형</SectionTitle>

      {/* ABC 섹션 */}
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

      {/* 구분선 */}
      <div className={`border-t ${divC} my-2`} />

      {/* 플랫 유형 섹션 */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-[#2abfb0]">플랫 유형</p>
        <p className="text-sm text-[#7a7f94]">B파 위치와 C파 위치로 구분</p>

        {/* 플랫 SVG 다이어그램 */}
        <Card>
          <FlatDiagram />
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
