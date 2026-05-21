import { useState, useRef } from 'react'
import { useTheme } from '../App'
import { Code, Table, Alert } from '../components/UI'
import ChartNote from '../components/ChartNote'

const TABS = [
  { id: 'step',    label: '판별 순서' },
  { id: 'impulse', label: '충격파동' },
  { id: 'correct', label: '조정파동' },
  { id: 'ending',  label: '마무리 패턴' },
]

const SUB_IMPULSE = [
  { id: 'imp_basic',    label: '임펄스' },
  { id: 'imp_expand',   label: '확장' },
  { id: 'imp_terminal', label: '터미널' },
]

const SUB_CORRECT = [
  { id: 'cor_wxy', label: 'WXY / WXYXZ' },
  { id: 'cor_abc', label: 'ABC' },
]

/* ── 공통 컴포넌트 ── */
function SectionHead({ num, title }) {
  const { dark } = useTheme()
  const numC  = dark ? 'text-white/30'   : 'text-black/30'
  const lineC = dark ? 'border-white/10' : 'border-black/10'
  return (
    <div className="flex items-center gap-2.5 mb-5 mt-7 first:mt-0">
      <span className={`text-xs font-mono ${numC}`}>{String(num).padStart(2,'0')}</span>
      <span className="text-xs font-semibold uppercase tracking-widest">{title}</span>
      <div className={`flex-1 border-t ${lineC}`} />
    </div>
  )
}

function Desc({ children }) {
  return <p className="text-sm text-[#7a7f94] mb-5 leading-relaxed">{children}</p>
}

function WaveAlert({ type = 'blue', children }) {
  const colors = {
    blue:  'border-[#4f8ef7] bg-[#4f8ef7]/5',
    red:   'border-[#e05a6a] bg-[#e05a6a]/5',
    amber: 'border-[#f0a040] bg-[#f0a040]/5',
    green: 'border-[#3ec97e] bg-[#3ec97e]/5',
    teal:  'border-[#2abfb0] bg-[#2abfb0]/5',
  }
  return (
    <div className={`border-l-2 px-4 py-3 text-xs leading-relaxed my-4 ${colors[type]}`}>
      {children}
    </div>
  )
}

function WaveTable({ headers, rows }) {
  const { dark } = useTheme()
  const thC   = dark ? 'text-[#7a7f94] border-white/10' : 'text-gray-400 border-black/10'
  const tdC   = dark ? 'border-white/8'  : 'border-black/8'
  return (
    <div className="w-full overflow-x-auto mb-1">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`text-left font-medium pb-2 pr-4 border-b ${thC}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={`py-2 pr-4 border-b leading-relaxed align-top ${tdC} last-of-type:border-b-0`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StepList({ steps }) {
  return (
    <div className="space-y-0">
      {steps.map((s, i) => (
        <div key={i} className="flex gap-3 py-2.5 border-b border-white/6 last:border-b-0 text-xs leading-relaxed">
          <span className="w-5 h-5 rounded-full bg-[#4f8ef7]/15 text-[#4f8ef7] flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">{i+1}</span>
          <span>{s}</span>
        </div>
      ))}
    </div>
  )
}

function RuleList({ rules }) {
  return (
    <div className="space-y-0">
      {rules.map((r, i) => (
        <div key={i} className="flex gap-3 py-2.5 border-b border-white/6 last:border-b-0 text-xs leading-relaxed">
          <span className="font-mono text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">{i+1}</span>
          <span>{r}</span>
        </div>
      ))}
    </div>
  )
}

function Divider() {
  const { dark } = useTheme()
  return <div className={`border-t my-7 ${dark ? 'border-white/8' : 'border-black/8'}`} />
}

/* ── 메인 ── */
export default function WaveTheory() {
  const { dark } = useTheme()
  const [active, setActive] = useState('step')
  const [subImp, setSubImp] = useState('imp_basic')
  const [subCor, setSubCor] = useState('cor_wxy')

  const muted       = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const tabBorderC  = dark ? 'border-white/10' : 'border-black/10'
  const tabActiveC  = 'text-[color:var(--tw-text-opacity)] font-medium border-b-2 border-[#3ec97e] text-current'
  const tabInactiveC = `${muted} border-b-2 border-transparent hover:text-current`
  const subActiveC  = dark
    ? 'bg-white/8 text-[#e8eaf0] border-white/15 font-medium'
    : 'bg-black/5 text-gray-800 border-black/15 font-medium'
  const subInactiveC = dark
    ? 'text-[#7a7f94] border-white/8 hover:text-[#e8eaf0]'
    : 'text-gray-400 border-black/8 hover:text-gray-700'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">엘리어트 파동</h1>
        <p className={`text-sm ${muted}`}>엘리어트 파동 이론 — 충격파동 · 조정파동 · 마무리 패턴</p>
      </div>

      {/* 메인 탭 */}
      <div className={`flex gap-0 border-b mb-7 ${tabBorderC}`}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`px-0 mr-6 py-2 text-xs transition-all ${active === t.id ? tabActiveC : tabInactiveC}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 서브탭 */}
      {active === 'impulse' && (
        <div className="flex gap-2 mb-7">
          {SUB_IMPULSE.map(s => (
            <button key={s.id} onClick={() => setSubImp(s.id)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${subImp === s.id ? subActiveC : subInactiveC}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}
      {active === 'correct' && (
        <div className="flex gap-2 mb-7">
          {SUB_CORRECT.map(s => (
            <button key={s.id} onClick={() => setSubCor(s.id)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${subCor === s.id ? subActiveC : subInactiveC}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="page-enter">
        {active === 'step'    && <StepSection />}
        {active === 'impulse' && subImp === 'imp_basic'    && <ImpulseBasic />}
        {active === 'impulse' && subImp === 'imp_expand'   && <ImpulseExpand />}
        {active === 'impulse' && subImp === 'imp_terminal' && <ImpulseTerminal />}
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
    <div>
      <SectionHead num={1} title="STEP 1 — 채널을 그린다" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        <div>
          <p className="text-xs font-semibold text-[#4f8ef7] mb-3">채널 지킬 때</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['WXY', 'WXYXZ', '이중플랫(ABC X ABC)', '3파연장 임펄스'].map(t => <Code key={t}>{t}</Code>)}
          </div>
          <WaveAlert type="blue">피보나치 <strong>확장</strong>으로 판별<br/>시작점 0(1) → W(2) → X(3) 지점 연결</WaveAlert>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#f0a040] mb-3">채널 안 지킬 때</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['ABC', '12345'].map(t => <Code key={t}>{t}</Code>)}
          </div>
          <WaveAlert type="amber">피보나치 <strong>되돌림</strong>으로 판별<br/>추세 방향이면 12345 / 반대면 ABC</WaveAlert>
        </div>
      </div>

      <SectionHead num={2} title="STEP 2 — 채널 지킨다면: 피보나치 확장" />
      <WaveTable
        headers={['Y/Z 마무리 위치', '채널 중단 여부', '결론']}
        rows={[
          [<Code>0.618 ~ 1.0</Code>, <span className="text-green-400">O</span>, <span className="text-green-400">WXY 종료</span>],
          [<Code>0.618 ~ 1.0</Code>, <span className="text-red-400">X</span>, <span className="text-amber-400">ABC / 12345 / WXYXZ 추가 확인</span>],
          [<Code>1.0 ~ 1.618</Code>, <span className="text-red-400">X</span>, <span className="text-amber-400">WXYXZ 가능성 → Z 찾기</span>],
          [<Code>1.618 초과</Code>, '—', <span className="text-red-400">카운팅 재검토</span>],
        ]}
      />
      <WaveAlert type="red"><strong>절대규칙</strong>: Y와 Z 중 하나의 파동만 확장 — Y 확장 시 Z는 <Code>0.618~1.0</Code> 이내 종료</WaveAlert>

      <SectionHead num={3} title="STEP 2-2 — 채널 안 지킨다면: 피보나치 되돌림" />
      <WaveTable
        headers={['확인 항목', '수치', '결론']}
        rows={[
          ['되돌림 후 추세 방향 재개', <Code>2파가 1파의 0.382~0.618</Code>, <span className="text-[#4f8ef7]">12345 의심</span>],
          ['되돌림 후 반대 방향 재개', <Code>B파가 A파의 0.382~0.618</Code>, <span className="text-[#2abfb0]">ABC 의심</span>],
          ['C파 길이', <Code>A파의 1.0~1.618</Code>, <span className="text-[#2abfb0]">ABC 확정</span>],
          ['3규칙 모두 충족', '2파 미이탈 / 3파 최단 아님 / 4파 미겹침', <span className="text-[#4f8ef7]">12345 확정</span>],
        ]}
      />

      <ChartNote page="wave" section="step" label="추가 이미지" />
    </div>
  )
}

/* ── 임펄스 기본 ── */
function ImpulseBasic() {
  return (
    <div>
      <SectionHead num={1} title="임펄스 12345" />
      <Desc>추세 방향으로 강하고 빠르게 움직이는 기본 충격파동</Desc>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
        <div>
          <p className="text-xs font-semibold mb-4">파동 구성</p>
          <WaveTable
            headers={['파동', '방향', '조건']}
            rows={[
              [<Code>1파</Code>, <span className="text-green-400">추세</span>, '시작'],
              [<Code>2파</Code>, <span className="text-red-400">조정</span>, <>1파 저점 이탈 불가 / <Code>0.382~0.618</Code></>],
              [<Code>3파</Code>, <span className="text-green-400">추세</span>, '1,3,5파 중 가장 짧으면 안 됨'],
              [<Code>4파</Code>, <span className="text-red-400">조정</span>, '1파 영역 겹침 불가'],
              [<Code>5파</Code>, <span className="text-green-400">추세</span>, '거래량 감소하며 마무리'],
            ]}
          />
        </div>
        <div>
          <p className="text-xs font-semibold mb-4">3가지 절대 규칙</p>
          <RuleList rules={[
            '2파 저점이 1파 저점 아래로 내려가면 안 됨',
            '1,3,5파 중 3파가 가장 짧으면 안 됨',
            '4파가 1파 영역과 겹치면 안 됨',
          ]} />
          <WaveAlert type="amber">하나라도 위반 시 → 12345 아님</WaveAlert>
        </div>
      </div>

      <ChartNote page="wave" section="imp_basic" label="추가 이미지" />
    </div>
  )
}

/* ── 터미널 ── */
function ImpulseTerminal() {
  return (
    <div>
      <SectionHead num={1} title="터미널 12345 (다이아고날)" />
      <Desc>쐐기형으로 수렴하는 충격파동 — 추세 소진 신호</Desc>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
        <div>
          <p className="text-xs font-semibold mb-4">임펄스와의 차이</p>
          <WaveTable
            headers={['항목', '임펄스', '터미널']}
            rows={[
              ['모양', '평행/확장', <span className="text-[#2abfb0]">쐐기형 수렴</span>],
              ['1-4파 겹침', '불가', <span className="text-[#2abfb0]">허용</span>],
              ['5파 길이', '3파보다 짧아도 됨', <span className="text-[#2abfb0]">3파보다 짧음</span>],
              ['속도', '빠름', <span className="text-[#2abfb0]">느리고 지침</span>],
              ['의미', '추세 강함', <span className="text-[#2abfb0]">추세 소진</span>],
            ]}
          />
        </div>
        <div>
          <p className="text-xs font-semibold mb-4">파동 조건</p>
          <WaveTable
            headers={['파동', '조건']}
            rows={[
              [<Code>1파</Code>, '시작'],
              [<Code>2파</Code>, '1파와 겹침 허용'],
              [<Code>3파</Code>, '1파보다 길어야 함'],
              [<Code>4파</Code>, '1파 영역 겹침 허용'],
              [<Code>5파</Code>, '3파보다 짧음 — 가장 짧음'],
            ]}
          />
          <WaveAlert type="blue">점점 짧아지고 느려지며 쐐기 수렴 → 소진 후 강한 반전</WaveAlert>
        </div>
      </div>

      <ChartNote page="wave" section="imp_terminal" label="추가 이미지" />
    </div>
  )
}

/* ── 확장 임펄스 SVG ── */
function ImpulseExpandSVG() {
  const { dark } = useTheme()
  const c = dark ? '#e8eaf0' : '#1a1e2a'
  const m = dark ? '#7a7f94' : '#888780'
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center gap-2">
        <svg width="100%" height="160" viewBox="0 0 280 353" fill="none">
          <line x1="0.322911" y1="245.618" x2="279.323" y2="9.61826" stroke={c} strokeOpacity="0.5"/>
          <line x1="144.189" y1="307.796" x2="267.189" y2="32.7958" stroke={c} strokeOpacity="0.5"/>
          <path d="M51.6458 352L64.6458 268L86.1458 307.5L99.1458 197.5L128.646 235L147.146 124.5L199.646 183L208.646 71.5L240.146 92.5L247.646 38.5" stroke={c} strokeWidth="2"/>
          <path d="M141.828 95.2727V104H140.772V96.3807H140.72L138.59 97.7955V96.7216L140.772 95.2727H141.828Z" fill={c}/>
          <path d="M190.916 213V212.233L193.797 209.08C194.135 208.71 194.414 208.389 194.632 208.116C194.851 207.841 195.013 207.582 195.118 207.341C195.226 207.097 195.28 206.841 195.28 206.574C195.28 206.267 195.206 206.001 195.058 205.777C194.914 205.553 194.715 205.379 194.462 205.257C194.209 205.135 193.925 205.074 193.61 205.074C193.274 205.074 192.982 205.143 192.732 205.283C192.485 205.419 192.293 205.611 192.156 205.858C192.023 206.105 191.956 206.395 191.956 206.727H190.951C190.951 206.216 191.068 205.767 191.304 205.381C191.54 204.994 191.861 204.693 192.267 204.477C192.676 204.261 193.135 204.153 193.644 204.153C194.155 204.153 194.608 204.261 195.003 204.477C195.398 204.693 195.708 204.984 195.932 205.351C196.156 205.717 196.269 206.125 196.269 206.574C196.269 206.895 196.21 207.209 196.094 207.516C195.98 207.82 195.781 208.159 195.497 208.534C195.216 208.906 194.826 209.361 194.326 209.898L192.365 211.994V212.062H196.422V213H190.916Z" fill={c}/>
          <path d="M206.678 50.1193C206.115 50.1193 205.614 50.0227 205.174 49.8295C204.736 49.6364 204.388 49.3679 204.129 49.0241C203.874 48.6776 203.735 48.2756 203.712 47.8182H204.786C204.808 48.0994 204.905 48.3423 205.076 48.5469C205.246 48.7486 205.469 48.9048 205.745 49.0156C206.02 49.1264 206.326 49.1818 206.661 49.1818C207.036 49.1818 207.368 49.1165 207.658 48.9858C207.948 48.8551 208.175 48.6733 208.34 48.4403C208.504 48.2074 208.587 47.9375 208.587 47.6307C208.587 47.3097 208.507 47.027 208.348 46.7827C208.189 46.5355 207.956 46.3423 207.649 46.2031C207.343 46.0639 206.968 45.9943 206.524 45.9943H205.826V45.0568H206.524C206.871 45.0568 207.175 44.9943 207.436 44.8693C207.701 44.7443 207.906 44.5682 208.054 44.3409C208.205 44.1136 208.28 43.8466 208.28 43.5398C208.28 43.2443 208.215 42.9872 208.084 42.7685C207.953 42.5497 207.769 42.3793 207.53 42.2571C207.294 42.1349 207.016 42.0739 206.695 42.0739C206.394 42.0739 206.11 42.1293 205.843 42.2401C205.578 42.348 205.362 42.5057 205.195 42.7131C205.027 42.9176 204.936 43.1648 204.922 43.4545H203.899C203.916 42.9972 204.054 42.5966 204.313 42.2528C204.571 41.9062 204.909 41.6364 205.327 41.4432C205.747 41.25 206.209 41.1534 206.712 41.1534C207.252 41.1534 207.715 41.2628 208.101 41.4815C208.487 41.6974 208.784 41.983 208.992 42.3381C209.199 42.6932 209.303 43.0767 209.303 43.4886C209.303 43.9801 209.174 44.3991 208.915 44.7457C208.659 45.0923 208.311 45.3324 207.871 45.4659V45.5341C208.422 45.625 208.852 45.8594 209.162 46.2372C209.472 46.6122 209.627 47.0767 209.627 47.6307C209.627 48.1051 209.497 48.5312 209.239 48.9091C208.983 49.2841 208.634 49.5795 208.191 49.7955C207.747 50.0114 207.243 50.1193 206.678 50.1193Z" fill={c}/>
          <path d="M237.495 125.21V124.341L241.33 118.273H241.961V119.619H241.535L238.637 124.205V124.273H243.802V125.21H237.495ZM241.603 127V124.946V124.541V118.273H242.609V127H241.603Z" fill={c}/>
          <path d="M245.626 12.1193C245.126 12.1193 244.676 12.0199 244.275 11.821C243.875 11.6222 243.554 11.3494 243.312 11.0028C243.071 10.6562 242.939 10.2614 242.916 9.81818H243.939C243.978 10.2131 244.157 10.5398 244.476 10.7983C244.797 11.054 245.18 11.1818 245.626 11.1818C245.984 11.1818 246.302 11.098 246.581 10.9304C246.862 10.7628 247.082 10.5327 247.241 10.2401C247.403 9.9446 247.484 9.6108 247.484 9.23864C247.484 8.85795 247.4 8.51847 247.233 8.22017C247.068 7.91903 246.841 7.68182 246.551 7.50852C246.261 7.33523 245.93 7.24716 245.558 7.24432C245.291 7.24148 245.017 7.28267 244.735 7.3679C244.454 7.45028 244.223 7.55682 244.041 7.6875L243.052 7.56818L243.581 3.27273H248.115V4.21023H244.467L244.16 6.78409H244.211C244.39 6.64205 244.615 6.52415 244.885 6.4304C245.155 6.33665 245.436 6.28977 245.728 6.28977C246.262 6.28977 246.738 6.41761 247.156 6.6733C247.576 6.92614 247.906 7.27273 248.145 7.71307C248.386 8.15341 248.507 8.65625 248.507 9.22159C248.507 9.77841 248.382 10.2756 248.132 10.7131C247.885 11.1477 247.544 11.4915 247.109 11.7443C246.674 11.9943 246.18 12.1193 245.626 12.1193Z" fill={c}/>
          <path d="M54.8906 348.273V357H53.8338V349.381H53.7827L51.652 350.795V349.722L53.8338 348.273H54.8906Z" fill={c}/>
        </svg>
        <p className="text-xs text-center" style={{color: m}}>1파 연장</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <svg width="100%" height="160" viewBox="0 0 209 360" fill="none">
          <line x1="5.38308" y1="272.686" x2="208.383" y2="20.6864" stroke={c} strokeOpacity="0.5"/>
          <line x1="0.386232" y1="359.682" x2="208.386" y2="106.682" stroke={c} strokeOpacity="0.5"/>
          <path d="M2.77246 353.5L24.2725 251L56.2725 297L68.7725 212.5L81.7725 232.5L96.2725 89L114.772 144.5L120.272 67.5L174.772 144.5L200.772 31.5" stroke={c} strokeWidth="2"/>
          <path d="M23.955 230.273V239H22.8982V231.381H22.847L20.7164 232.795V231.722L22.8982 230.273H23.955Z" fill={c}/>
          <path d="M55.0431 330V329.233L57.9237 326.08C58.2618 325.71 58.5402 325.389 58.759 325.116C58.9777 324.841 59.1396 324.582 59.2448 324.341C59.3527 324.097 59.4067 323.841 59.4067 323.574C59.4067 323.267 59.3328 323.001 59.1851 322.777C59.0402 322.553 58.8414 322.379 58.5885 322.257C58.3357 322.135 58.0516 322.074 57.7362 322.074C57.401 322.074 57.1084 322.143 56.8584 322.283C56.6112 322.419 56.4195 322.611 56.2831 322.858C56.1496 323.105 56.0828 323.395 56.0828 323.727H55.0771C55.0771 323.216 55.195 322.767 55.4308 322.381C55.6666 321.994 55.9877 321.693 56.3939 321.477C56.803 321.261 57.2618 321.153 57.7703 321.153C58.2817 321.153 58.7348 321.261 59.1297 321.477C59.5246 321.693 59.8343 321.984 60.0587 322.351C60.2831 322.717 60.3953 323.125 60.3953 323.574C60.3953 323.895 60.3371 324.209 60.2206 324.516C60.107 324.82 59.9081 325.159 59.624 325.534C59.3428 325.906 58.9521 326.361 58.4521 326.898L56.4919 328.994V329.062H60.5487V330H55.0431Z" fill={c}/>
          <path d="M119.804 51.1193C119.242 51.1193 118.741 51.0227 118.3 50.8295C117.863 50.6364 117.515 50.3679 117.256 50.0241C117 49.6776 116.861 49.2756 116.839 48.8182H117.912C117.935 49.0994 118.032 49.3423 118.202 49.5469C118.373 49.7486 118.596 49.9048 118.871 50.0156C119.147 50.1264 119.452 50.1818 119.787 50.1818C120.162 50.1818 120.495 50.1165 120.785 49.9858C121.074 49.8551 121.302 49.6733 121.466 49.4403C121.631 49.2074 121.714 48.9375 121.714 48.6307C121.714 48.3097 121.634 48.027 121.475 47.7827C121.316 47.5355 121.083 47.3423 120.776 47.2031C120.469 47.0639 120.094 46.9943 119.651 46.9943H118.952V46.0568H119.651C119.998 46.0568 120.302 45.9943 120.563 45.8693C120.827 45.7443 121.033 45.5682 121.181 45.3409C121.331 45.1136 121.407 44.8466 121.407 44.5398C121.407 44.2443 121.341 43.9872 121.211 43.7685C121.08 43.5497 120.895 43.3793 120.657 43.2571C120.421 43.1349 120.142 43.0739 119.821 43.0739C119.52 43.0739 119.236 43.1293 118.969 43.2401C118.705 43.348 118.489 43.5057 118.321 43.7131C118.154 43.9176 118.063 44.1648 118.049 44.4545H117.026C117.043 43.9972 117.181 43.5966 117.439 43.2528C117.698 42.9062 118.036 42.6364 118.454 42.4432C118.874 42.25 119.336 42.1534 119.839 42.1534C120.378 42.1534 120.841 42.2628 121.228 42.4815C121.614 42.6974 121.911 42.983 122.118 43.3381C122.326 43.6932 122.429 44.0767 122.429 44.4886C122.429 44.9801 122.3 45.3991 122.042 45.7457C121.786 46.0923 121.438 46.3324 120.998 46.4659V46.5341C121.549 46.625 121.979 46.8594 122.289 47.2372C122.598 47.6122 122.753 48.0767 122.753 48.6307C122.753 49.1051 122.624 49.5312 122.366 49.9091C122.11 50.2841 121.76 50.5795 121.317 50.7955C120.874 51.0114 120.37 51.1193 119.804 51.1193Z" fill={c}/>
          <path d="M170.622 180.21V179.341L174.457 173.273H175.088V174.619H174.661L171.764 179.205V179.273H176.929V180.21H170.622ZM174.73 182V179.946V179.541V173.273H175.735V182H174.73Z" fill={c}/>
          <path d="M197.753 12.1193C197.253 12.1193 196.802 12.0199 196.402 11.821C196.001 11.6222 195.68 11.3494 195.439 11.0028C195.197 10.6562 195.065 10.2614 195.043 9.81818H196.065C196.105 10.2131 196.284 10.5398 196.602 10.7983C196.923 11.054 197.307 11.1818 197.753 11.1818C198.111 11.1818 198.429 11.098 198.707 10.9304C198.989 10.7628 199.209 10.5327 199.368 10.2401C199.53 9.9446 199.611 9.6108 199.611 9.23864C199.611 8.85795 199.527 8.51847 199.359 8.22017C199.195 7.91903 198.967 7.68182 198.677 7.50852C198.388 7.33523 198.057 7.24716 197.685 7.24432C197.418 7.24148 197.143 7.28267 196.862 7.3679C196.581 7.45028 196.349 7.55682 196.168 7.6875L195.179 7.56818L195.707 3.27273H200.241V4.21023H196.594L196.287 6.78409H196.338C196.517 6.64205 196.741 6.52415 197.011 6.4304C197.281 6.33665 197.562 6.28977 197.855 6.28977C198.389 6.28977 198.865 6.41761 199.283 6.6733C199.703 6.92614 200.033 7.27273 200.271 7.71307C200.513 8.15341 200.633 8.65625 200.633 9.22159C200.633 9.77841 200.508 10.2756 200.258 10.7131C200.011 11.1477 199.67 11.4915 199.236 11.7443C198.801 11.9943 198.307 12.1193 197.753 12.1193Z" fill={c}/>
        </svg>
        <p className="text-xs text-center" style={{color: m}}>3파 연장</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <svg width="100%" height="160" viewBox="0 0 280 361" fill="none">
          <line x1="4.50525" y1="320.767" x2="150.505" y2="43.7669" stroke={c} strokeOpacity="0.5"/>
          <line x1="21.6594" y1="330.591" x2="279.659" y2="148.591" stroke={c} strokeOpacity="0.5"/>
          <path d="M0.947571 360.5L30.4476 273L51.9476 308L93.9476 157L137.448 246L148.448 142.5L181.448 167L199.448 80.5L224.948 116.5L246.448 30.5" stroke={c} strokeWidth="2"/>
          <path d="M27.1301 250.273V259H26.0733V251.381H26.0221L23.8915 252.795V251.722L26.0733 250.273H27.1301Z" fill={c}/>
          <path d="M43.2182 345V344.233L46.0988 341.08C46.4369 340.71 46.7153 340.389 46.9341 340.116C47.1528 339.841 47.3148 339.582 47.4199 339.341C47.5278 339.097 47.5818 338.841 47.5818 338.574C47.5818 338.267 47.5079 338.001 47.3602 337.777C47.2153 337.553 47.0165 337.379 46.7636 337.257C46.5108 337.135 46.2267 337.074 45.9113 337.074C45.5761 337.074 45.2835 337.143 45.0335 337.283C44.7863 337.419 44.5946 337.611 44.4582 337.858C44.3247 338.105 44.2579 338.395 44.2579 338.727H43.2523C43.2523 338.216 43.3702 337.767 43.606 337.381C43.8417 336.994 44.1628 336.693 44.569 336.477C44.9781 336.261 45.4369 336.153 45.9454 336.153C46.4568 336.153 46.9099 336.261 47.3048 336.477C47.6997 336.693 48.0094 336.984 48.2338 337.351C48.4582 337.717 48.5704 338.125 48.5704 338.574C48.5704 338.895 48.5122 339.209 48.3957 339.516C48.2821 339.82 48.0832 340.159 47.7991 340.534C47.5179 340.906 47.1273 341.361 46.6273 341.898L44.667 343.994V344.062H48.7238V345H43.2182Z" fill={c}/>
          <path d="M88.9795 134.119C88.417 134.119 87.9156 134.023 87.4753 133.83C87.0378 133.636 86.6898 133.368 86.4312 133.024C86.1756 132.678 86.0363 132.276 86.0136 131.818H87.0875C87.1102 132.099 87.2068 132.342 87.3773 132.547C87.5477 132.749 87.7707 132.905 88.0463 133.016C88.3219 133.126 88.6273 133.182 88.9625 133.182C89.3375 133.182 89.6699 133.116 89.9596 132.986C90.2494 132.855 90.4767 132.673 90.6415 132.44C90.8062 132.207 90.8886 131.938 90.8886 131.631C90.8886 131.31 90.8091 131.027 90.65 130.783C90.4909 130.536 90.2579 130.342 89.9511 130.203C89.6443 130.064 89.2693 129.994 88.8261 129.994H88.1273V129.057H88.8261C89.1727 129.057 89.4767 128.994 89.7381 128.869C90.0023 128.744 90.2082 128.568 90.356 128.341C90.5065 128.114 90.5818 127.847 90.5818 127.54C90.5818 127.244 90.5165 126.987 90.3858 126.768C90.2551 126.55 90.0704 126.379 89.8318 126.257C89.596 126.135 89.3176 126.074 88.9966 126.074C88.6954 126.074 88.4113 126.129 88.1443 126.24C87.8801 126.348 87.6642 126.506 87.4966 126.713C87.329 126.918 87.2381 127.165 87.2238 127.455H86.2011C86.2182 126.997 86.356 126.597 86.6145 126.253C86.873 125.906 87.2111 125.636 87.6287 125.443C88.0491 125.25 88.5108 125.153 89.0136 125.153C89.5534 125.153 90.0165 125.263 90.4028 125.482C90.7892 125.697 91.0861 125.983 91.2935 126.338C91.5008 126.693 91.6045 127.077 91.6045 127.489C91.6045 127.98 91.4753 128.399 91.2167 128.746C90.9611 129.092 90.6131 129.332 90.1727 129.466V129.534C90.7238 129.625 91.1542 129.859 91.4639 130.237C91.7736 130.612 91.9284 131.077 91.9284 131.631C91.9284 132.105 91.7991 132.531 91.5406 132.909C91.2849 133.284 90.9355 133.58 90.4923 133.795C90.0491 134.011 89.5449 134.119 88.9795 134.119Z" fill={c}/>
          <path d="M134.797 277.21V276.341L138.632 270.273H139.263V271.619H138.837L135.939 276.205V276.273H141.104V277.21H134.797ZM138.905 279V276.946V276.541V270.273H139.91V279H138.905Z" fill={c}/>
          <path d="M243.928 12.1193C243.428 12.1193 242.978 12.0199 242.577 11.821C242.176 11.6222 241.855 11.3494 241.614 11.0028C241.372 10.6562 241.24 10.2614 241.218 9.81818H242.24C242.28 10.2131 242.459 10.5398 242.777 10.7983C243.098 11.054 243.482 11.1818 243.928 11.1818C244.286 11.1818 244.604 11.098 244.882 10.9304C245.164 10.7628 245.384 10.5327 245.543 10.2401C245.705 9.9446 245.786 9.6108 245.786 9.23864C245.786 8.85795 245.702 8.51847 245.534 8.22017C245.37 7.91903 245.142 7.68182 244.853 7.50852C244.563 7.33523 244.232 7.24716 243.86 7.24432C243.593 7.24148 243.318 7.28267 243.037 7.3679C242.756 7.45028 242.524 7.55682 242.343 7.6875L241.354 7.56818L241.882 3.27273H246.416V4.21023H242.769L242.462 6.78409H242.513C242.692 6.64205 242.916 6.52415 243.186 6.4304C243.456 6.33665 243.738 6.28977 244.03 6.28977C244.564 6.28977 245.04 6.41761 245.458 6.6733C245.878 6.92614 246.208 7.27273 246.446 7.71307C246.688 8.15341 246.809 8.65625 246.809 9.22159C246.809 9.77841 246.684 10.2756 246.434 10.7131C246.186 11.1477 245.845 11.4915 245.411 11.7443C244.976 11.9943 244.482 12.1193 243.928 12.1193Z" fill={c}/>
        </svg>
        <p className="text-xs text-center" style={{color: m}}>5파 연장</p>
      </div>
    </div>
  )
}

/* ── 확장 임펄스 ── */
function ImpulseExpand() {
  const { dark } = useTheme()
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  return (
    <div>
      <SectionHead num={1} title="확장 임펄스" />
      <Desc>1, 3, 5파 중 하나가 비정상적으로 길게 연장되는 패턴</Desc>

      <div className={`rounded-lg p-4 ${dark ? 'bg-white/5' : 'bg-white/70'}`}>
        <ImpulseExpandSVG />
      </div>

      <div className="mt-6">
        <WaveTable
          headers={['유형', '특징', '비고']}
          rows={[
            ['1파 확장', '1파가 가장 길게 연장', '비교적 드묾'],
            ['3파 확장', <span className="text-green-400">3파가 가장 길게 연장 — 가장 흔함</span>, '강한 추세 구간'],
            ['5파 확장', '5파가 가장 길게 연장', '거래량 감소 확인 중요'],
          ]}
        />
      </div>

      <WaveAlert type="amber"><strong>절대규칙</strong>: 1,3,5파 중 하나만 확장 — 두 개 이상 확장되면 카운팅 재검토</WaveAlert>
      <p className={`text-xs leading-relaxed ${muted}`}>3파는 추세의 핵심 구간으로 거래량과 모멘텀이 집중됨. 시장 참여자들이 추세를 인식하고 집중 매수/매도하는 구간이기 때문에 가장 흔하게 연장됨.</p>

      <Divider />

      {/* 02 — 1파 연장 */}
      <SectionHead num={2} title="임펄스 1파 연장" />
      <Desc>추후 추가 예정</Desc>

      <Divider />

      {/* 03 — 3파 연장 */}
      <SectionHead num={3} title="임펄스 3파 연장" />
      <Desc>3파가 연장될 때 내부에서 나타나는 준비 구간 — 1212 세팅</Desc>

      <p className="text-xs font-semibold mb-3">1212 세팅</p>
      <p className={`text-xs leading-relaxed mb-4 ${muted}`}>
        1파 → 2파 → 3파의 3-1 → 3-2 순서로 진행되며, 이 네 파동이 완성된 시점을 1212 세팅이라 부름.
        3-2파가 종료되는 순간이 1212 완성이자 매수 타점. 이후 3-3 → 3-4 → 3-5로 이어지는
        가장 강하고 빠른 상승 구간이 시작됨.
      </p>

      <WaveTable
        headers={['구간', '내용']}
        rows={[
          [<Code>1212 세팅</Code>, '1파 → 2파 → 3-1파 → 3-2파 완성 구간'],
          ['매수 타점', '3-2파 종료 시점 — 1212 완성'],
          ['이후 전개', '3-3(가장 강함) → 3-4 → 3-5 → 4파 → 5파'],
          ['구조 유효 조건', '1파 고점과 3-1파 고점을 연결한 채널 안에서 진행'],
          ['구조 무효 조건', '3-2파가 1파 고점을 넘으면 무효'],
        ]}
      />

      <WaveAlert type="green">
        <strong>3-2파 종료 = 1212 완성 = 진입 타점</strong><br/>
        이후 3-3파는 전체 파동 중 가장 강하고 빠른 구간 — 수익 극대화 구간
      </WaveAlert>

      <div className={`rounded-lg p-3 mt-4 ${dark ? 'bg-white/5' : 'bg-white/70'}`}>
        <Elliott3rdWaveSVG dark={dark} />
      </div>

      <Divider />

      {/* 04 — 5파 연장 */}
      <SectionHead num={4} title="임펄스 5파 연장" />
      <Desc>추후 추가 예정</Desc>

      <ChartNote page="wave" section="imp_expand" label="추가 이미지" />
    </div>
  )
}

/* ── 3파연장 1212 SVG ── */
function Elliott3rdWaveSVG({ dark }) {
  const c  = dark ? '#e8eaf0' : '#1a1e2a'
  const c2 = dark ? '#1a1e2a' : '#ffffff'
  return (
    <svg viewBox="0 0 760 440" xmlns="http://www.w3.org/2000/svg" width="100%">
      <defs>
        <mask id="imagine-text-gaps-btbanu" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="760" height="440" fill={c2}/>
          <rect x="16" y="8.51" width="161.67" height="23.62" fill={c} rx="2"/>
          <rect x="16" y="28.64" width="224.42" height="18.46" fill={c} rx="2"/>
          <rect x="44" y="62.64" width="22.99" height="18.46" fill={c} rx="2"/>
          <rect x="128" y="62.64" width="22.99" height="18.46" fill={c} rx="2"/>
          <rect x="187" y="62.64" width="113.78" height="18.46" fill={c} rx="2"/>
          <rect x="524.97" y="62.64" width="24.02" height="18.46" fill={c} rx="2"/>
          <rect x="595" y="62.64" width="22.99" height="18.46" fill={c} rx="2"/>
          <rect x="116" y="80.67" width="87.99" height="17.42" fill={c} rx="2"/>
          <rect x="26" y="360.61" width="28.44" height="19.49" fill={c} rx="2"/>
          <rect x="108" y="177.58" width="20.39" height="20.52" fill={c} rx="2"/>
          <rect x="144" y="272.58" width="20.39" height="20.52" fill={c} rx="2"/>
          <rect x="218" y="163.61" width="29.55" height="19.49" fill={c} rx="2"/>
          <rect x="236" y="233.61" width="29.55" height="19.49" fill={c} rx="2"/>
          <rect x="348" y="83.61" width="44.30" height="19.49" fill={c} rx="2"/>
          <rect x="374" y="133.61" width="29.55" height="19.49" fill={c} rx="2"/>
          <rect x="508" y="68.61" width="29.55" height="19.49" fill={c} rx="2"/>
          <rect x="543" y="202.58" width="20.39" height="20.52" fill={c} rx="2"/>
          <rect x="691" y="97.58" width="20.39" height="20.52" fill={c} rx="2"/>
          <rect x="231" y="292.67" width="46.55" height="17.42" fill={c} rx="2"/>
          <rect x="224" y="303.67" width="73.25" height="17.42" fill={c} rx="2"/>
          <rect x="46" y="387.67" width="22.29" height="17.42" fill={c} rx="2"/>
          <rect x="126" y="387.67" width="22.29" height="17.42" fill={c} rx="2"/>
          <rect x="314.97" y="387.67" width="40.87" height="17.42" fill={c} rx="2"/>
          <rect x="527.97" y="387.67" width="23.32" height="17.42" fill={c} rx="2"/>
          <rect x="639.97" y="387.67" width="23.32" height="17.42" fill={c} rx="2"/>
          <rect x="44" y="410.64" width="35.69" height="18.46" fill={c} rx="2"/>
          <rect x="114" y="410.64" width="35.69" height="18.46" fill={c} rx="2"/>
          <rect x="184" y="410.64" width="43.47" height="18.46" fill={c} rx="2"/>
        </mask>
      </defs>
      <text x="20" y="26" fontSize="13" fontWeight="500" fill={c} fontFamily="sans-serif">3파 연장 임펄스 — 전체 구조</text>
      <text x="20" y="42" fontSize="10" fill="#888780" fontFamily="sans-serif">1212 세팅 이후 3-3, 3-4, 3-5 거쳐 4파·5파로 마무리</text>
      <rect x="38" y="60" width="80" height="310" rx="4" fill="#EEEDFE" opacity="0.4"/>
      <text x="48" y="76" fontSize="10" fontWeight="500" fill="#3C3489" fontFamily="sans-serif">1파</text>
      <rect x="122" y="60" width="55" height="310" rx="4" fill="#FAECE7" opacity="0.4"/>
      <text x="132" y="76" fontSize="10" fontWeight="500" fill="#993C1D" fontFamily="sans-serif">2파</text>
      <rect x="181" y="60" width="340" height="310" rx="4" fill="#E1F5EE" opacity="0.3"/>
      <text x="191" y="76" fontSize="10" fontWeight="500" fill="#0F6E56" fontFamily="sans-serif">3파 (연장) — 내부 12345</text>
      <rect x="525" y="60" width="60" height="310" rx="4" fill="#FAECE7" opacity="0.4"/>
      <text x="530" y="76" fontSize="10" fontWeight="500" fill="#993C1D" fontFamily="sans-serif">4파</text>
      <rect x="589" y="60" width="145" height="310" rx="4" fill="#EEEDFE" opacity="0.3"/>
      <text x="599" y="76" fontSize="10" fontWeight="500" fill="#3C3489" fontFamily="sans-serif">5파</text>
      <rect x="38" y="82" width="280" height="14" rx="3" fill="#534AB7" opacity="0.12"/>
      <text x="120" y="93" fontSize="9" fontWeight="500" fill="#534AB7" fontFamily="sans-serif">← 1212 세팅 구간 →</text>
      <polyline points="50,360 110,200 165,270 220,185 265,230 350,105 400,155 510,90 545,200 700,120" fill="none" stroke="#3C3489" strokeWidth="2.5" strokeLinejoin="round" mask="url(#imagine-text-gaps-btbanu)"/>
      <circle cx="50" cy="360" r="5" fill="#3C3489"/>
      <circle cx="110" cy="200" r="5" fill="#3C3489"/>
      <circle cx="165" cy="270" r="5" fill="#993C1D"/>
      <circle cx="220" cy="185" r="5" fill="#0F6E56"/>
      <circle cx="265" cy="230" r="5" fill="#993C1D"/>
      <circle cx="350" cy="105" r="6" fill="#0F6E56"/>
      <circle cx="400" cy="155" r="5" fill="#993C1D"/>
      <circle cx="510" cy="90" r="6" fill="#0F6E56"/>
      <circle cx="545" cy="200" r="5" fill="#993C1D"/>
      <circle cx="700" cy="120" r="5" fill="#3C3489"/>
      <text x="30" y="375" fontSize="11" fill="#3C3489" fontFamily="sans-serif">시작</text>
      <text x="112" y="193" fontSize="12" fontWeight="500" fill="#3C3489" fontFamily="sans-serif">①</text>
      <text x="148" y="288" fontSize="12" fontWeight="500" fill="#993C1D" fontFamily="sans-serif">②</text>
      <text x="222" y="178" fontSize="11" fontWeight="500" fill="#0F6E56" fontFamily="sans-serif">3-①</text>
      <text x="240" y="248" fontSize="11" fontWeight="500" fill="#993C1D" fontFamily="sans-serif">3-②</text>
      <text x="352" y="98" fontSize="11" fontWeight="500" fill="#0F6E56" fontFamily="sans-serif">3-③🚀</text>
      <text x="378" y="148" fontSize="11" fontWeight="500" fill="#993C1D" fontFamily="sans-serif">3-④</text>
      <text x="512" y="83" fontSize="11" fontWeight="500" fill="#0F6E56" fontFamily="sans-serif">3-⑤</text>
      <text x="547" y="218" fontSize="12" fontWeight="500" fill="#993C1D" fontFamily="sans-serif">④</text>
      <text x="695" y="113" fontSize="12" fontWeight="500" fill="#3C3489" fontFamily="sans-serif">⑤</text>
      <line x1="265" y1="245" x2="265" y2="290" stroke="#534AB7" strokeWidth="1" strokeDasharray="3,2" mask="url(#imagine-text-gaps-btbanu)"/>
      <text x="235" y="305" fontSize="9" fill="#534AB7" fontFamily="sans-serif">1212 완성</text>
      <text x="228" y="316" fontSize="9" fill="#534AB7" fontFamily="sans-serif">→ 3-③ 폭발 직전</text>
      <line x1="38" y1="388" x2="118" y2="388" stroke="#3C3489" strokeWidth="1" mask="url(#imagine-text-gaps-btbanu)"/>
      <text x="50" y="400" fontSize="9" fill="#3C3489" fontFamily="sans-serif">1파</text>
      <line x1="122" y1="388" x2="177" y2="388" stroke="#993C1D" strokeWidth="1" mask="url(#imagine-text-gaps-btbanu)"/>
      <text x="130" y="400" fontSize="9" fill="#993C1D" fontFamily="sans-serif">2파</text>
      <line x1="181" y1="388" x2="521" y2="388" stroke="#0F6E56" strokeWidth="1" mask="url(#imagine-text-gaps-btbanu)"/>
      <text x="320" y="400" fontSize="9" fill="#0F6E56" fontFamily="sans-serif">3파 전체</text>
      <line x1="525" y1="388" x2="585" y2="388" stroke="#993C1D" strokeWidth="1" mask="url(#imagine-text-gaps-btbanu)"/>
      <text x="533" y="400" fontSize="9" fill="#993C1D" fontFamily="sans-serif">4파</text>
      <line x1="589" y1="388" x2="734" y2="388" stroke="#3C3489" strokeWidth="1" mask="url(#imagine-text-gaps-btbanu)"/>
      <text x="645" y="400" fontSize="9" fill="#3C3489" fontFamily="sans-serif">5파</text>
      <circle cx="40" cy="420" r="4" fill="#3C3489"/>
      <text x="48" y="424" fontSize="10" fill="#3C3489" fontFamily="sans-serif">상승파</text>
      <circle cx="110" cy="420" r="4" fill="#993C1D"/>
      <text x="118" y="424" fontSize="10" fill="#993C1D" fontFamily="sans-serif">조정파</text>
      <circle cx="180" cy="420" r="4" fill="#0F6E56"/>
      <text x="188" y="424" fontSize="10" fill="#0F6E56" fontFamily="sans-serif">3파 내부</text>
    </svg>
  )
}

/* ── WXY / WXYXZ ── */
function CorrectWXY() {
  return (
    <div>
      {/* WXY */}
      <SectionHead num={1} title="WXY 복합조정" />
      <Desc>채널을 기막히게 지킨다 — ABC보다 기간이 길다. WXY는 "기간 조정"이다.</Desc>

      <WaveTable
        headers={['파동', '내부 구성', '비율', '위치']}
        rows={[
          [<Code>W파</Code>, '3파동 (ABC or WXY)', '기준', '조정 첫 번째'],
          [<Code>X파</Code>, '어떤 파동도 가능', '—', '연결 반등'],
          [<Code>Y파</Code>, '5파동 (임펄스/터미널/삼각수렴)', <Code>W:Y = 1:0.618~1.0</Code>, '채널 중단 종료'],
        ]}
      />

      <WaveAlert type="blue">채널 지키네? → <strong>WXY</strong><br/>피보나치 확장 <Code>0.618~1.0</Code> + 채널 중단 → 진입 타점</WaveAlert>

      <p className="text-xs font-semibold mb-3">WXY 찾는 순서</p>
      <StepList steps={[
        '채널을 그린다 → 채널을 지키는가?',
        '피보나치 확장 (W시작 → W끝 → X끝)',
        '0.618~1.0 + 채널 중단 → WXY 종료',
        '이중플랫 배제: Y/Z 확장 개별 확인',
      ]} />

      <WaveAlert type="amber">실시간으로 맞추려 하지 말 것 — 조정 종료 신호 먼저 찾고, 사후에 레이블 붙이기</WaveAlert>

      <Divider />

      {/* WXYXZ */}
      <SectionHead num={2} title="WXYXZ" />
      <Desc>Y가 채널 중단이 아닌 최상단/최하단에서 끝났을 때 의심</Desc>

      <WaveTable
        headers={['파동', '내부 구성', '비율 / 위치']}
        rows={[
          [<Code>W파</Code>, '3파동', '기준'],
          [<Code>X파</Code>, '어떤 파동도 가능', '—'],
          [<Code>Y파</Code>, '5파동', <><Code>1.0~1.618</Code> 확장 — <span className="text-red-400">채널 중단 아님</span></>],
          [<Code>X파</Code>, '어떤 파동도 가능', '—'],
          [<Code>Z파</Code>, '5파동', <><Code>0.618~1.0</Code> — <span className="text-green-400">채널 중단 종료</span></>],
        ]}
      />

      <WaveAlert type="red">
        <strong>절대규칙 — 하나의 파동만 확장</strong><br/>
        Y 확장(<Code>1.0~1.618</Code>) → Z는 반드시 <Code>0.618~1.0</Code> 이내
      </WaveAlert>

      <p className="text-xs font-semibold mb-3">WXY vs WXYXZ 판별</p>
      <WaveTable
        headers={['Y 마무리', '채널 중단', '결론']}
        rows={[
          [<Code>0.618~1.0</Code>, <span className="text-green-400">O</span>, <span className="text-green-400">WXY 종료</span>],
          [<Code>0.618~1.0</Code>, <span className="text-red-400">X</span>, <span className="text-amber-400">추가 확인</span>],
          [<Code>1.0~1.618</Code>, <span className="text-red-400">X</span>, <span className="text-amber-400">WXYXZ → Z 찾기</span>],
        ]}
      />

      <ChartNote page="wave" section="cor_wxy" label="추가 이미지" />
    </div>
  )
}

/* ── ABC X ABC 이중플랫 SVG ── */
function DoubleABCSVG() {
  const { dark } = useTheme()
  const c = dark ? '#e8eaf0' : '#1a1e2a'
  const replace = (svg) => svg
    .replace(/fill="black"/g, `fill="${c}"`)
    .replace(/stroke="black"/g, `stroke="${c}"`)

  return (
    <div className="mt-4 mb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold mb-2 text-green-400">상승 채널</p>
          <svg width="100%" height="163" viewBox="0 0 280 163" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40.5948 71H38.7482L44.0891 56.4545H45.9073L51.2482 71H49.4016L45.055 58.7557H44.9414L40.5948 71ZM41.2766 65.3182H48.7198V66.8807H41.2766V65.3182Z" fill={c}/>
            <path d="M199.595 34H197.748L203.089 19.4545H204.907L210.248 34H208.402L204.055 21.7557H203.941L199.595 34ZM200.277 28.3182H207.72V29.8807H200.277V28.3182Z" fill={c}/>
            <path d="M17.7368 150L19.2368 124L30.7368 138L35.2368 104.5L42.7368 120L48.7368 89.5L57.7368 117.5L66.7368 101L77.2368 124L83.2368 97.5L90.7368 113L95.2368 73.5L102.237 89.5L108.737 63" stroke={c} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M174.737 113.5L177.737 91.5L188.737 104.5L192.737 71.5L199.737 86L207.737 57L216.737 83.5L225.737 66L236.237 91.5L241.237 66L248.737 78L254.237 41L259.737 57L265.737 30.5" stroke={c} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M108.737 63.5L76.2368 126.5L49.7368 90L18.2368 151.5" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M174.737 114L208.237 55L235.237 93.5L266.737 28.5" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M108.737 63.5L175.237 113.5" stroke="#00BBFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M74.9982 158V143.455H80.0834C81.0967 143.455 81.9324 143.63 82.5905 143.98C83.2487 144.326 83.7387 144.792 84.0607 145.379C84.3827 145.962 84.5436 146.608 84.5436 147.318C84.5436 147.943 84.4324 148.459 84.2098 148.866C83.992 149.274 83.7032 149.596 83.3434 149.832C82.9882 150.069 82.6023 150.244 82.1857 150.358V150.5C82.6308 150.528 83.0782 150.685 83.528 150.969C83.9778 151.253 84.3542 151.66 84.6573 152.19C84.9603 152.721 85.1118 153.369 85.1118 154.136C85.1118 154.866 84.9461 155.521 84.6147 156.104C84.2832 156.686 83.76 157.148 83.0451 157.489C82.3301 157.83 81.3997 158 80.2539 158H74.9982ZM76.7595 156.438H80.2539C81.4044 156.438 82.2212 156.215 82.7041 155.77C83.1918 155.32 83.4357 154.776 83.4357 154.136C83.4357 153.644 83.3102 153.189 83.0593 152.773C82.8083 152.351 82.4508 152.015 81.9868 151.764C81.5228 151.509 80.9736 151.381 80.3391 151.381H76.7595V156.438ZM76.7595 149.847H80.0266C80.5569 149.847 81.0351 149.742 81.4612 149.534C81.8921 149.326 82.233 149.032 82.484 148.653C82.7397 148.275 82.8675 147.83 82.8675 147.318C82.8675 146.679 82.645 146.137 82.1999 145.692C81.7548 145.242 81.0493 145.017 80.0834 145.017H76.7595V149.847Z" fill={c}/>
            <path d="M233.998 121V106.455H239.083C240.097 106.455 240.932 106.63 241.591 106.98C242.249 107.326 242.739 107.792 243.061 108.379C243.383 108.962 243.544 109.608 243.544 110.318C243.544 110.943 243.432 111.459 243.21 111.866C242.992 112.274 242.703 112.596 242.343 112.832C241.988 113.069 241.602 113.244 241.186 113.358V113.5C241.631 113.528 242.078 113.685 242.528 113.969C242.978 114.253 243.354 114.66 243.657 115.19C243.96 115.721 244.112 116.369 244.112 117.136C244.112 117.866 243.946 118.521 243.615 119.104C243.283 119.686 242.76 120.148 242.045 120.489C241.33 120.83 240.4 121 239.254 121H233.998ZM235.76 119.438H239.254C240.404 119.438 241.221 119.215 241.704 118.77C242.192 118.32 242.436 117.776 242.436 117.136C242.436 116.644 242.31 116.189 242.059 115.773C241.808 115.351 241.451 115.015 240.987 114.764C240.523 114.509 239.974 114.381 239.339 114.381H235.76V119.438ZM235.76 112.847H239.027C239.557 112.847 240.035 112.742 240.461 112.534C240.892 112.326 241.233 112.032 241.484 111.653C241.74 111.275 241.867 110.83 241.867 110.318C241.867 109.679 241.645 109.137 241.2 108.692C240.755 108.242 240.049 108.017 239.083 108.017H235.76V112.847Z" fill={c}/>
            <path d="M271.703 9H269.941C269.837 8.49337 269.655 8.0483 269.394 7.66477C269.139 7.28125 268.826 6.95928 268.457 6.69886C268.092 6.43371 267.688 6.23485 267.242 6.10227C266.797 5.9697 266.333 5.90341 265.85 5.90341C264.97 5.90341 264.172 6.12595 263.457 6.57102C262.747 7.0161 262.181 7.67188 261.76 8.53835C261.343 9.40483 261.135 10.4678 261.135 11.7273C261.135 12.9867 261.343 14.0497 261.76 14.9162C262.181 15.7827 262.747 16.4384 263.457 16.8835C264.172 17.3286 264.97 17.5511 265.85 17.5511C266.333 17.5511 266.797 17.4848 267.242 17.3523C267.688 17.2197 268.092 17.0232 268.457 16.7628C268.826 16.4976 269.139 16.1733 269.394 15.7898C269.655 15.4015 269.837 14.9564 269.941 14.4545H271.703C271.57 15.1979 271.329 15.8632 270.978 16.4503C270.628 17.0374 270.192 17.5369 269.671 17.9489C269.151 18.3561 268.566 18.6662 267.917 18.8793C267.273 19.0923 266.584 19.1989 265.85 19.1989C264.61 19.1989 263.507 18.8958 262.541 18.2898C261.575 17.6837 260.815 16.822 260.261 15.7045C259.707 14.5871 259.43 13.2614 259.43 11.7273C259.43 10.1932 259.707 8.86742 260.261 7.75C260.815 6.63258 261.575 5.77083 262.541 5.16477C263.507 4.55871 264.61 4.25568 265.85 4.25568C266.584 4.25568 267.273 4.36222 267.917 4.57528C268.566 4.78835 269.151 5.10085 269.671 5.51278C270.192 5.91998 270.628 6.41714 270.978 7.00426C271.329 7.58665 271.57 8.25189 271.703 9Z" fill={c}/>
            <path d="M114.703 42H112.941C112.837 41.4934 112.655 41.0483 112.394 40.6648C112.139 40.2812 111.826 39.9593 111.457 39.6989C111.092 39.4337 110.688 39.2348 110.242 39.1023C109.797 38.9697 109.333 38.9034 108.85 38.9034C107.97 38.9034 107.172 39.1259 106.457 39.571C105.747 40.0161 105.181 40.6719 104.76 41.5384C104.343 42.4048 104.135 43.4678 104.135 44.7273C104.135 45.9867 104.343 47.0497 104.76 47.9162C105.181 48.7827 105.747 49.4384 106.457 49.8835C107.172 50.3286 107.97 50.5511 108.85 50.5511C109.333 50.5511 109.797 50.4848 110.242 50.3523C110.688 50.2197 111.092 50.0232 111.457 49.7628C111.826 49.4976 112.139 49.1733 112.394 48.7898C112.655 48.4015 112.837 47.9564 112.941 47.4545H114.703C114.57 48.1979 114.329 48.8632 113.978 49.4503C113.628 50.0374 113.192 50.5369 112.671 50.9489C112.151 51.3561 111.566 51.6662 110.917 51.8793C110.273 52.0923 109.584 52.1989 108.85 52.1989C107.61 52.1989 106.507 51.8958 105.541 51.2898C104.575 50.6837 103.815 49.822 103.261 48.7045C102.707 47.5871 102.43 46.2614 102.43 44.7273C102.43 43.1932 102.707 41.8674 103.261 40.75C103.815 39.6326 104.575 38.7708 105.541 38.1648C106.507 37.5587 107.61 37.2557 108.85 37.2557C109.584 37.2557 110.273 37.3622 110.917 37.5753C111.566 37.7884 112.151 38.1009 112.671 38.5128C113.192 38.92 113.628 39.4171 113.978 40.0043C114.329 40.5866 114.57 41.2519 114.703 42Z" fill={c}/>
            <line x1="0.11846" y1="90.5142" x2="275.118" y2="23.5142" stroke={c}/>
            <line x1="4.11846" y1="156.514" x2="279.118" y2="89.5142" stroke={c}/>
            <path d="M119.936 90.5455L122.373 94.4787H122.447L124.885 90.5455H126.233L123.26 95.2727L126.233 100H124.885L122.447 96.1406H122.373L119.936 100H118.588L121.635 95.2727L118.588 90.5455H119.936ZM127.371 90.51H133.923V91.394H127.371V90.51ZM127.215 98.102L127.085 97.192C127.787 97.192 128.554 97.1877 129.386 97.179C130.218 97.1617 131.071 97.1313 131.947 97.088C132.822 97.036 133.658 96.9623 134.456 96.867L134.521 97.673C133.706 97.803 132.865 97.8983 131.999 97.959C131.132 98.0197 130.287 98.0587 129.464 98.076C128.649 98.0933 127.899 98.102 127.215 98.102ZM128.632 91.186H129.685V97.439H128.632V91.186ZM131.609 91.186H132.649V97.439H131.609V91.186ZM135.184 89.249H136.263V101.014H135.184V89.249ZM136.016 93.955H138.187V94.852H136.016V93.955Z" fill="#00BBFF"/>
            <line x1="4.11679" y1="120.515" x2="279.117" y2="52.5146" stroke={c} strokeDasharray="2 2"/>
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold mb-2 text-red-400">하락 채널</p>
          <svg width="100%" height="163" viewBox="0 0 327 190" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M78.358 106.476H76.5114L81.8523 91.9301H83.6705L89.0114 106.476H87.1648L82.8182 94.2313H82.7045L78.358 106.476ZM79.0398 100.794H86.483V102.356H79.0398V100.794Z" fill={c}/>
            <path d="M106.761 22.4756V7.93013H111.847C112.86 7.93013 113.696 8.10532 114.354 8.4557C115.012 8.80134 115.502 9.26773 115.824 9.85485C116.146 10.4372 116.307 11.0835 116.307 11.7938C116.307 12.4188 116.196 12.9349 115.973 13.3421C115.755 13.7493 115.466 14.0712 115.107 14.308C114.751 14.5447 114.366 14.7199 113.949 14.8335V14.9756C114.394 15.004 114.841 15.1602 115.291 15.4443C115.741 15.7284 116.117 16.1356 116.42 16.6659C116.723 17.1962 116.875 17.8449 116.875 18.6119C116.875 19.3411 116.709 19.9969 116.378 20.5793C116.046 21.1617 115.523 21.6233 114.808 21.9642C114.093 22.3051 113.163 22.4756 112.017 22.4756H106.761ZM108.523 20.9131H112.017C113.168 20.9131 113.984 20.6905 114.467 20.2455C114.955 19.7957 115.199 19.2512 115.199 18.6119C115.199 18.1195 115.073 17.665 114.822 17.2483C114.571 16.8269 114.214 16.4907 113.75 16.2398C113.286 15.9841 112.737 15.8563 112.102 15.8563H108.523V20.9131ZM108.523 14.3222H111.79C112.32 14.3222 112.798 14.218 113.224 14.0097C113.655 13.8013 113.996 13.5078 114.247 13.129C114.503 12.7502 114.631 12.3051 114.631 11.7938C114.631 11.1546 114.408 10.6124 113.963 10.1673C113.518 9.71754 112.813 9.49263 111.847 9.49263H108.523V14.3222Z" fill={c}/>
            <path d="M145.466 112.476H143.705C143.6 111.969 143.418 111.524 143.158 111.14C142.902 110.757 142.589 110.435 142.22 110.174C141.856 109.909 141.451 109.71 141.006 109.578C140.561 109.445 140.097 109.379 139.614 109.379C138.733 109.379 137.935 109.602 137.22 110.047C136.51 110.492 135.944 111.147 135.523 112.014C135.106 112.88 134.898 113.943 134.898 115.203C134.898 116.462 135.106 117.525 135.523 118.392C135.944 119.258 136.51 119.914 137.22 120.359C137.935 120.804 138.733 121.027 139.614 121.027C140.097 121.027 140.561 120.96 141.006 120.828C141.451 120.695 141.856 120.499 142.22 120.238C142.589 119.973 142.902 119.649 143.158 119.265C143.418 118.877 143.6 118.432 143.705 117.93H145.466C145.333 118.674 145.092 119.339 144.741 119.926C144.391 120.513 143.955 121.013 143.435 121.424C142.914 121.832 142.329 122.142 141.68 122.355C141.036 122.568 140.348 122.674 139.614 122.674C138.373 122.674 137.27 122.371 136.304 121.765C135.338 121.159 134.578 120.298 134.024 119.18C133.47 118.063 133.193 116.737 133.193 115.203C133.193 113.669 133.47 112.343 134.024 111.226C134.578 110.108 135.338 109.246 136.304 108.64C137.27 108.034 138.373 107.731 139.614 107.731C140.348 107.731 141.036 107.838 141.68 108.051C142.329 108.264 142.914 108.576 143.435 108.988C143.955 109.396 144.391 109.893 144.741 110.48C145.092 111.062 145.333 111.727 145.466 112.476Z" fill={c}/>
            <path d="M49.5 10.9756L52 36.9756L62 23.4756L67 58.9756L75 41.4756L81 72.4756L90 43.4756L97 60.9756L112.5 32.4756L115.5 63.4756L127.5 46.9756V86.4756L140.656 68.4756V98.4756L141 99.9756" stroke={c} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M193 60.4756V86.9756L206.5 74.4756L210 107.476L216.5 92.9756L224 124.476L233 92.9756L240.5 111.976L254.5 80.9756L259 114.976L273.5 96.4756L271 139.976L283.5 114.976V150.976" stroke={c} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M141 101.976L112 31.4756L81.5 73.9756L50 10.9756" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M192 59.4756L224 126.976L254.5 77.9756L282.5 149.476" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M141 101.976L192 59.4756" stroke="#00BBFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M215.358 149.476H213.511L218.852 134.93H220.67L226.011 149.476H224.165L219.818 137.231H219.705L215.358 149.476ZM216.04 143.794H223.483V145.356H216.04V143.794Z" fill={c}/>
            <path d="M251.761 68.4756V53.9301H256.847C257.86 53.9301 258.696 54.1053 259.354 54.4557C260.012 54.8013 260.502 55.2677 260.824 55.8548C261.146 56.4372 261.307 57.0835 261.307 57.7938C261.307 58.4188 261.196 58.9349 260.973 59.3421C260.755 59.7493 260.466 60.0712 260.107 60.308C259.751 60.5447 259.366 60.7199 258.949 60.8335V60.9756C259.394 61.004 259.841 61.1602 260.291 61.4443C260.741 61.7284 261.117 62.1356 261.42 62.6659C261.723 63.1962 261.875 63.8449 261.875 64.6119C261.875 65.3411 261.709 65.9969 261.378 66.5793C261.046 67.1617 260.523 67.6233 259.808 67.9642C259.093 68.3051 258.163 68.4756 257.017 68.4756H251.761ZM253.523 66.9131H257.017C258.168 66.9131 258.984 66.6905 259.467 66.2455C259.955 65.7957 260.199 65.2512 260.199 64.6119C260.199 64.1195 260.073 63.665 259.822 63.2483C259.571 62.8269 259.214 62.4907 258.75 62.2398C258.286 61.9841 257.737 61.8563 257.102 61.8563H253.523V66.9131ZM253.523 60.3222H256.79C257.32 60.3222 257.798 60.218 258.224 60.0097C258.655 59.8013 258.996 59.5078 259.247 59.129C259.503 58.7502 259.631 58.3051 259.631 57.7938C259.631 57.1546 259.408 56.6124 258.963 56.1673C258.518 55.7175 257.813 55.4926 256.847 55.4926H253.523V60.3222Z" fill={c}/>
            <path d="M288.466 160.476H286.705C286.6 159.969 286.418 159.524 286.158 159.14C285.902 158.757 285.589 158.435 285.22 158.174C284.856 157.909 284.451 157.71 284.006 157.578C283.561 157.445 283.097 157.379 282.614 157.379C281.733 157.379 280.935 157.602 280.22 158.047C279.51 158.492 278.944 159.147 278.523 160.014C278.106 160.88 277.898 161.943 277.898 163.203C277.898 164.462 278.106 165.525 278.523 166.392C278.944 167.258 279.51 167.914 280.22 168.359C280.935 168.804 281.733 169.027 282.614 169.027C283.097 169.027 283.561 168.96 284.006 168.828C284.451 168.695 284.856 168.499 285.22 168.238C285.589 167.973 285.902 167.649 286.158 167.265C286.418 166.877 286.6 166.432 286.705 165.93H288.466C288.333 166.674 288.092 167.339 287.741 167.926C287.391 168.513 286.955 169.013 286.435 169.424C285.914 169.832 285.329 170.142 284.68 170.355C284.036 170.568 283.348 170.674 282.614 170.674C281.373 170.674 280.27 170.371 279.304 169.765C278.338 169.159 277.578 168.298 277.024 167.18C276.47 166.063 276.193 164.737 276.193 163.203C276.193 161.669 276.47 160.343 277.024 159.226C277.578 158.108 278.338 157.246 279.304 156.64C280.27 156.034 281.373 155.731 282.614 155.731C283.348 155.731 284.036 155.838 284.68 156.051C285.329 156.264 285.914 156.576 286.435 156.988C286.955 157.396 287.391 157.893 287.741 158.48C288.092 159.062 288.333 159.727 288.466 160.476Z" fill={c}/>
            <path d="M20 0.475586L322 98.4756" stroke={c}/>
            <path d="M4.65332 58.4756L306.653 156.476" stroke={c}/>
            <path d="M10.6533 29.4756L312.653 127.476" stroke={c} strokeDasharray="2 2"/>
            <path d="M167.699 84.021L170.136 87.9543H170.21L172.648 84.021H173.996L171.023 88.7483L173.996 93.4756H172.648L170.21 89.6162H170.136L167.699 93.4756H166.351L169.398 88.7483L166.351 84.021H167.699ZM175.134 83.9856H181.686V84.8696H175.134V83.9856ZM174.978 91.5776L174.848 90.6676C175.55 90.6676 176.317 90.6633 177.149 90.6546C177.981 90.6373 178.834 90.6069 179.71 90.5636C180.585 90.5116 181.421 90.4379 182.219 90.3426L182.284 91.1486C181.469 91.2786 180.628 91.3739 179.762 91.4346C178.895 91.4953 178.05 91.5343 177.227 91.5516C176.412 91.5689 175.662 91.5776 174.978 91.5776ZM176.395 84.6616H177.448V90.9146H176.395V84.6616ZM179.372 84.6616H180.412V90.9146H179.372V84.6616ZM182.947 82.7246H184.026V94.4896H182.947V82.7246ZM183.779 87.4306H185.95V88.3276H183.779V87.4306Z" fill="#00BBFF"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ── ABC / 플랫 ── */
function CorrectABC() {
  const { dark } = useTheme()
  const divC = dark ? 'border-white/8' : 'border-black/8'

  return (
    <div>
      <SectionHead num={1} title="ABC 조정" />
      <Desc>큰 추세의 반대 방향 조정 — 가격 조정의 기본. 채널을 지키지 않는다.</Desc>

      <WaveTable
        headers={['파동', '내부 구성', '피보나치 기준', '규칙']}
        rows={[
          [<Code>A파</Code>, '3파동 또는 5파동', '—', '조정 시작'],
          [<Code>B파</Code>, <><span className="text-red-400">가장 더럽고 길다</span><br/>3파동 (ABC or WXY)</>, <><Code>기본: 0.382~0.5</Code><br/><Code>불규칙: 1.09~1.272</Code></>, 'A 시작점 기준'],
          [<Code>C파</Code>, <><strong>무조건 5파동</strong><br/>임펄스/터미널/WXYXZ</>, <><Code>1:1</Code> / <Code>1:1.236</Code><br/><Code>1:1.382</Code> / <Code>1:1.618</Code></>, 'A파 저점 이탈'],
        ]}
      />
      <WaveAlert type="amber">C파 저점을 미리 잡으려 하면 안 됨 — C파 완성 확인 후 진입</WaveAlert>

      <Divider />

      {/* 플랫 유형 */}
      <SectionHead num={2} title="플랫 유형" />
      <Desc>B파 위치와 C파 위치로 구분</Desc>

      <div className="w-full overflow-x-auto mb-6">
        <img
          src="/flat_patterns_1.svg"
          alt="플랫 유형 비교 다이어그램"
          className="w-full"
          style={{ filter: dark ? 'invert(1) hue-rotate(180deg)' : 'none' }}
        />
      </div>

      <WaveTable
        headers={['유형', 'B파', 'C파', '비고']}
        rows={[
          ['기본 플랫', <Code>1:0.382~0.5</Code>, 'A 저점 이탈', '가장 일반적'],
          ['확장 플랫', <Code>1.09~1.272 (A 시작점 돌파)</Code>, 'A 저점 이탈', 'B가 A 시작점 스윕'],
          ['러닝 플랫', 'A 시작점 돌파', <span className="text-amber-400">A 저점 미이탈</span>, 'C파 약함'],
        ]}
      />

      <Divider />

      {/* 플랫 유형 피보나치 판별 */}
      <SectionHead num={3} title="플랫 유형 피보나치 판별법" />
      <Desc>눈으로 먼저 보고, 피보나치로 수치 확인 — 피보나치 수치가 최종 기준</Desc>

      <p className="text-xs font-semibold mb-3">그리는 법 (2단계)</p>
      <StepList steps={[
        '시작점 → A 방향으로 피보나치 되돌림 → B파 수치 확인',
        'A → 시작점 방향으로 피보나치 되돌림 → C파 수치 확인',
      ]} />

      <WaveTable
        headers={['유형', 'B파', 'C파', '비고']}
        rows={[
          ['기본 플랫', <Code>1 미만 (0.382~0.5)</Code>, <Code>1:1 이상</Code>, '가장 일반적'],
          ['확장 플랫', <Code>1.09~1.272 (1 초과)</Code>, <Code>1:1 이상</Code>, 'B가 A 되돌림 1 초과'],
          ['러닝 플랫', <Code>1 초과</Code>, <span className="text-amber-400">1:1 미달</span>, 'C파 약함 — 미달형'],
        ]}
      />

      <WaveAlert type="amber">
        <strong>핵심 판별 포인트</strong><br/>
        B파가 A 되돌림 <Code>1을 초과</Code>했는가? → YES면 확장 또는 러닝<br/>
        C파가 <Code>1:1</Code>에 미달했는가? → YES면 러닝 플랫 (눈으로 저점 근처처럼 보여도 피보 수치가 기준)
      </WaveAlert>

      <WaveAlert type="blue">
        <strong>B가 A 시작점 스윕 시</strong><br/>
        C가 A 저점을 <Code>1:1</Code> 이상 이탈 → 확장 플랫 (단, 힘이 약해지는 구조)<br/>
        C가 A 저점을 <Code>1:1</Code> 미달 → 러닝 플랫
      </WaveAlert>

      <Divider />
      <SectionHead num={4} title="ABC X ABC 이중플랫" />
      <Desc>채널 내에서 WXYXZ처럼 보이지만 다른 구조 — 절대규칙 위반 시 이중플랫으로 판별</Desc>

      <WaveTable
        headers={['파동', '내부 구성', '비고']}
        rows={[
          [<Code>첫 번째 ABC</Code>, 'A파(3) → B파(3) → C파(5)', '기준'],
          [<Code>X파</Code>, '연결 반등/조정', 'B-B 추세선 기준'],
          [<Code>두 번째 ABC</Code>, 'A파(3) → B파(3) → C파(5)', '확장 없이 종료'],
        ]}
      />

      <DoubleABCSVG />

      <p className="text-xs font-semibold mb-3">판별 순서</p>
      <StepList steps={[
        '1차 판별: 채널 중단에서 끝난 파동이 없음 → Y 또는 Z가 될 수 없음',
        '2차 판별: 소파동을 들여다보면 ABC + ABC 구조 확인 → 두 저점(B-B)을 연결하면 BB 추세선(채널 하단) 완성 → 두 ABC 사이를 X로 설정',
      ]} />

      <WaveAlert type="red">
        <strong>WXYXZ가 될 수 없는 이유</strong><br/>
        WXY 절대규칙 "한 파동에서 연장은 하나만" — Y가 1.382로 연장, Z도 1 초과로 연장 → 연장 2개 → WXYXZ 불가 → ABC X ABC로 확정
      </WaveAlert>

      <p className="text-xs font-semibold mb-3">C파 목표</p>
      <WaveTable
        headers={['레벨', '비고']}
        rows={[
          [<Code>1.382</Code>, '1차 목표'],
          [<Code>1.272</Code>, '2차 목표'],
        ]}
      />

      <WaveAlert type="blue">
        <strong>플랜A / 플랜B 항상 병행</strong><br/>
        채널 내 파동 → 플랜A: WXYXZ / 플랜B: ABC X ABC — 항상 두 가지 시나리오를 동시에 열어둘 것
      </WaveAlert>

      <ChartNote page="wave" section="cor_abc" label="추가 이미지" />
    </div>
  )
}

/* ── 마무리 패턴 ── */
function EndingSection() {
  return (
    <div>
      <SectionHead num={1} title="Y파 / C파 마무리 패턴" />
      <Desc>조정 종료 신호 — 이 중 하나가 나오면 반대 방향 전환</Desc>

      <WaveAlert type="blue">
        <strong>공통</strong>: 5개 파동 / 조정 종료 신호 / 반대 방향 전환<br/>
        <strong>C파</strong>: 임펄스 / 터미널만 가능 — <span className="text-red-400">삼각수렴 불가</span><br/>
        <strong>Y파</strong>: 임펄스 / 터미널 / 삼각수렴 모두 가능
      </WaveAlert>

      {[
        { label: '임펄스 12345',
          rows: [['1파','시작'],['2파','1파의 0.382~0.618'],['3파','가장 짧으면 안 됨'],['4파','1파 영역 겹침 불가'],['5파','거래량 감소']],
          note: '겹침 없음 / 강하고 빠름', trust: '높음', tc: 'text-green-400' },
        { label: '터미널 12345',
          rows: [['1파','시작'],['2파','1파와 겹침 허용'],['3파','1파보다 길어야 함'],['4파','1파 영역 겹침 허용'],['5파','3파보다 짧음']],
          note: '쐐기형 수렴 / 점점 짧아짐', trust: '중간', tc: 'text-amber-400' },
        { label: '삼각수렴 ABCDE (Y파만)',
          rows: [['A파','가장 긴 하락'],['B파','A 시작점 미돌파'],['C파','A 저점 미이탈'],['D파','B 고점 미돌파'],['E파','가장 짧음']],
          note: '고점↓ 저점↑ / E파 후 돌파', trust: '중간', tc: 'text-amber-400' },
      ].map((item, i) => (
        <div key={i} className="mb-6">
          <p className="text-xs font-semibold mb-3">{item.label}</p>
          <WaveTable
            headers={['파동', '조건']}
            rows={item.rows.map(([w, c]) => [<Code>{w}</Code>, c])}
          />
          <p className="text-xs text-[#7a7f94] mt-2">{item.note} — 신뢰도: <span className={item.tc}>{item.trust}</span></p>
          {i < 2 && <Divider />}
        </div>
      ))}

      <ChartNote page="wave" section="ending" label="추가 이미지" />
    </div>
  )
}