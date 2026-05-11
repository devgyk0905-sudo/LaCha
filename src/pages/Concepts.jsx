import { useState, useRef } from 'react'
import { useTheme } from '../App'
import { PageSearch } from '../components/UI'
import { usePageSearch } from '../hooks/usePageSearch'
import ChartNote from '../components/ChartNote'

/* ── 데이터 ── */
const CONCEPTS = [
  /* 캔들 기초 */
  {
    category: '캔들 기초',
    title: '시가 / 종가 / 고가 / 저가',
    desc: '캔들 하나가 담고 있는 네 가지 가격 정보.',
    keywords: ['시가', '종가', '고가', '저가', 'OHLC'],
    details: [
      '시가(Open): 해당 봉이 시작된 가격',
      '종가(Close): 해당 봉이 마감된 가격',
      '고가(High): 봉 기간 중 가장 높은 가격 — 위꼬리 끝',
      '저가(Low): 봉 기간 중 가장 낮은 가격 — 아래꼬리 끝',
      '몸통: 시가와 종가 사이의 구간',
    ],
    color: 'red',
    id: 'ohlc',
    svgType: 'ohlc',
  },
  {
    category: '캔들 기초',
    title: '양봉 / 음봉',
    desc: '종가가 시가보다 높으면 양봉, 낮으면 음봉.',
    keywords: ['양봉', '음봉', '불리쉬', '베어리쉬'],
    details: [
      '양봉: 종가 > 시가 — 매수세가 우세한 봉 (TradingView 기준 초록)',
      '음봉: 종가 < 시가 — 매도세가 우세한 봉 (TradingView 기준 빨강)',
      '한국 HTS는 반대 — 양봉이 빨강, 음봉이 파랑',
      '장대양봉/장대음봉: 몸통이 크고 꼬리가 짧음 → 강한 방향성',
    ],
    color: 'red',
    id: 'bullbear',
    svgType: 'bullbear',
  },
  {
    category: '캔들 기초',
    title: '몸통 / 꼬리의 의미',
    desc: '몸통은 실제 매매 결과, 꼬리는 세력 간 힘겨루기의 흔적.',
    keywords: ['몸통', '꼬리', '위꼬리', '아래꼬리', '그림자'],
    details: [
      '몸통이 클수록: 해당 방향으로 강한 확신',
      '위꼬리: 고점까지 올랐다가 매도세에 밀린 흔적 → 상단 저항 존재',
      '아래꼬리: 저점까지 밀렸다가 매수세가 받아낸 흔적 → 하단 지지 존재',
      '꼬리가 길수록 해당 방향 세력이 강했다는 의미',
      '도지: 시가 ≈ 종가 — 몸통 거의 없음, 방향 탐색 중',
    ],
    color: 'red',
    id: 'body_tail',
    svgType: 'body_tail',
  },

  /* 이동평균선 */
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
    id: 'ma_ema',
    svgType: 'ma',
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
    id: 'golden_dead_cross',
    svgType: 'cross',
  },

  /* 보조지표 */
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
    id: 'rsi',
    svgType: 'rsi',
  },
  {
    category: '보조지표',
    title: '다이버전스',
    desc: '가격과 RSI 방향이 반대로 움직이는 추세 전환 신호.',
    keywords: ['다이버전스', 'Bull', 'Bear', '베어', '불', '하락다이버전스', '상승다이버전스'],
    details: [
      'Bull 다이버전스: 가격 저점↓ — RSI 저점↑ → 상승 전환 신호',
      'Bear 다이버전스: 가격 고점↑ — RSI 고점↓ → 하락 전환 신호',
      '30/70 근처에서 발생 시 신뢰도 높음',
      '중립 구간(50 근처)에서는 신호 강도 약함',
    ],
    color: 'teal',
    id: 'divergence',
    svgType: 'divergence',
  },

  /* 피보나치 */
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
    id: 'fib_retracement',
    svgType: 'fib_ret',
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
    id: 'fib_extension',
    svgType: 'fib_ext',
  },

  /* 채널/추세 */
  {
    category: '채널/추세',
    title: '추세선',
    desc: '고점과 고점, 저점과 저점을 연결한 선 — 추세 방향 파악.',
    keywords: ['추세선', '트렌드라인', '상승추세', '하락추세'],
    details: [
      '상승 추세선: 저점과 저점을 연결 — 지지선 역할',
      '하락 추세선: 고점과 고점을 연결 — 저항선 역할',
      '추세선 이탈 시 추세 전환 가능성',
      '접촉 횟수가 많을수록 신뢰도 높음',
    ],
    color: 'green',
    id: 'trendline',
    svgType: 'trendline',
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
      '과거에 많이 거래된 구간일수록 강도 높음',
    ],
    color: 'green',
    id: 'support_resistance',
    svgType: 'sr',
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
    id: 'supply_zone',
    svgType: 'supply',
  },

  /* 거래량 */
  {
    category: '거래량',
    title: '거래량 (식용꽃)',
    desc: '특정 기간 동안 거래된 총 수량 — 패턴 신뢰도를 보조하는 참고 지표.',
    keywords: ['거래량', '볼륨', '거래량폭발'],
    details: [
      '기술적 분석에서 거래량은 주된 판단 근거가 아닌 보조 지표로 활용함',
      '패턴과 캔들 시그널로 판단을 마친 뒤, 거래량이 맞아떨어지면 신뢰도가 한층 올라가는 정도',
      '상승 + 거래량 증가: 추세 강도 보조 확인',
      '돌파/이탈 시 거래량 급증이 동반되면 신호가 더 선명해짐',
      '단, 거래량만으로 매매 판단을 내리지 않음 — 어디까지나 마지막 마무리 확인 수단',
    ],
    color: 'purple',
    id: 'volume',
    svgType: 'volume',
  },
]

const GREEN  = '#3ec97e'
const RED    = '#e05a6a'
const GRAY   = '#888780'
const BLUE   = '#4f8ef7'
const AMBER  = '#f0a040'
const TEAL   = '#2abfb0'
const PURPLE = '#9b7de8'

/* ── 개념별 SVG ── */
function ConceptSVG({ type }) {
  const svgs = {
    ohlc: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {/* 양봉 */}
        <line x1="20" y1="8" x2="20" y2="20" stroke={GREEN} strokeWidth="1.5"/>
        <rect x="12" y="20" width="16" height="36" fill={GREEN} rx="1"/>
        <line x1="20" y1="56" x2="20" y2="68" stroke={GREEN} strokeWidth="1.5"/>
        {/* 레이블 */}
        <line x1="36" y1="8" x2="48" y2="8" stroke={GRAY} strokeWidth="0.8" strokeDasharray="2 2"/>
        <text x="50" y="11" fontSize="7" fill={GRAY}>고가</text>
        <line x1="36" y1="20" x2="48" y2="20" stroke={GRAY} strokeWidth="0.8" strokeDasharray="2 2"/>
        <text x="50" y="23" fontSize="7" fill={GRAY}>종가</text>
        <line x1="36" y1="56" x2="48" y2="56" stroke={GRAY} strokeWidth="0.8" strokeDasharray="2 2"/>
        <text x="50" y="59" fontSize="7" fill={GRAY}>시가</text>
        <line x1="36" y1="68" x2="48" y2="68" stroke={GRAY} strokeWidth="0.8" strokeDasharray="2 2"/>
        <text x="50" y="71" fontSize="7" fill={GRAY}>저가</text>
        {/* 몸통 브라켓 */}
        <line x1="4" y1="20" x2="4" y2="56" stroke={GREEN} strokeWidth="1"/>
        <line x1="4" y1="20" x2="7" y2="20" stroke={GREEN} strokeWidth="1"/>
        <line x1="4" y1="56" x2="7" y2="56" stroke={GREEN} strokeWidth="1"/>
        <text x="1" y="41" fontSize="6" fill={GREEN} transform="rotate(-90,1,41)">몸통</text>
      </svg>
    ),
    bullbear: (
      <svg width="80" height="72" viewBox="0 0 80 72" fill="none">
        {/* 양봉 */}
        <line x1="20" y1="6" x2="20" y2="14" stroke={GREEN} strokeWidth="1.5"/>
        <rect x="13" y="14" width="14" height="36" fill={GREEN} rx="1"/>
        <line x1="20" y1="50" x2="20" y2="60" stroke={GREEN} strokeWidth="1.5"/>
        <text x="13" y="70" fontSize="8" fill={GREEN}>양봉</text>
        {/* 음봉 */}
        <line x1="60" y1="10" x2="60" y2="18" stroke={RED} strokeWidth="1.5"/>
        <rect x="53" y="18" width="14" height="36" fill={RED} rx="1"/>
        <line x1="60" y1="54" x2="60" y2="64" stroke={RED} strokeWidth="1.5"/>
        <text x="53" y="70" fontSize="8" fill={RED}>음봉</text>
        {/* 구분선 */}
        <line x1="40" y1="4" x2="40" y2="66" stroke={GRAY} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4"/>
      </svg>
    ),
    body_tail: (
      <svg width="80" height="72" viewBox="0 0 80 72" fill="none">
        <line x1="40" y1="4" x2="40" y2="18" stroke={RED} strokeWidth="1.5"/>
        <rect x="29" y="18" width="22" height="32" fill={RED} rx="1"/>
        <line x1="40" y1="50" x2="40" y2="66" stroke={RED} strokeWidth="1.5"/>
        {/* 위꼬리 레이블 */}
        <line x1="56" y1="4" x2="64" y2="4" stroke={GRAY} strokeWidth="0.8"/>
        <line x1="56" y1="18" x2="64" y2="18" stroke={GRAY} strokeWidth="0.8"/>
        <line x1="64" y1="4" x2="64" y2="18" stroke={GRAY} strokeWidth="0.8"/>
        <text x="66" y="13" fontSize="7" fill={GRAY}>위꼬리</text>
        {/* 아래꼬리 레이블 */}
        <line x1="56" y1="50" x2="64" y2="50" stroke={GRAY} strokeWidth="0.8"/>
        <line x1="56" y1="66" x2="64" y2="66" stroke={GRAY} strokeWidth="0.8"/>
        <line x1="64" y1="50" x2="64" y2="66" stroke={GRAY} strokeWidth="0.8"/>
        <text x="66" y="60" fontSize="7" fill={GRAY}>아래꼬리</text>
        {/* 몸통 레이블 */}
        <line x1="14" y1="18" x2="6" y2="18" stroke={GRAY} strokeWidth="0.8"/>
        <line x1="14" y1="50" x2="6" y2="50" stroke={GRAY} strokeWidth="0.8"/>
        <line x1="6" y1="18" x2="6" y2="50" stroke={GRAY} strokeWidth="0.8"/>
        <text x="1" y="37" fontSize="7" fill={GRAY} transform="rotate(-90,1,37)">몸통</text>
      </svg>
    ),
    ma: (
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
        <path d="M4 48 L16 36 L28 40 L40 24 L52 28 L64 12 L76 16" stroke={GRAY} strokeWidth="0.8" opacity="0.5"/>
        <path d="M4 50 L16 44 L28 42 L40 34 L52 30 L64 22 L76 20" stroke={BLUE} strokeWidth="1.5" strokeDasharray="4 2"/>
        <path d="M4 54 L16 50 L28 48 L40 44 L52 40 L64 34 L76 30" stroke={RED} strokeWidth="1.5"/>
        <text x="4" y="9" fontSize="7" fill={BLUE}>단기 MA</text>
        <text x="4" y="18" fontSize="7" fill={RED}>장기 MA</text>
        <line x1="4" y1="5" x2="18" y2="5" stroke={BLUE} strokeWidth="1.5" strokeDasharray="4 2"/>
        <line x1="4" y1="14" x2="18" y2="14" stroke={RED} strokeWidth="1.5"/>
      </svg>
    ),
    cross: (
      <svg width="80" height="64" viewBox="0 0 80 64" fill="none">
        {/* 골든크로스 */}
        <path d="M4 46 L22 28" stroke={BLUE} strokeWidth="1.5" strokeDasharray="4 2"/>
        <path d="M4 30 L22 36" stroke={RED} strokeWidth="1.5"/>
        <circle cx="17" cy="32" r="3" fill={GREEN} opacity="0.9"/>
        <text x="4" y="58" fontSize="7" fill={GREEN}>골든크로스</text>
        {/* 데드크로스 */}
        <path d="M44 28 L62 46" stroke={BLUE} strokeWidth="1.5" strokeDasharray="4 2"/>
        <path d="M44 36 L62 30" stroke={RED} strokeWidth="1.5"/>
        <circle cx="57" cy="32" r="3" fill={RED} opacity="0.9"/>
        <text x="44" y="58" fontSize="7" fill={RED}>데드크로스</text>
        <line x1="38" y1="4" x2="38" y2="60" stroke={GRAY} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3"/>
      </svg>
    ),
    rsi: (
      <svg width="80" height="64" viewBox="0 0 80 64" fill="none">
        <line x1="4" y1="16" x2="76" y2="16" stroke={RED} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7"/>
        <line x1="4" y1="48" x2="76" y2="48" stroke={GREEN} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7"/>
        <line x1="4" y1="32" x2="76" y2="32" stroke={GRAY} strokeWidth="0.5" strokeDasharray="3 2" opacity="0.4"/>
        <path d="M4 40 L16 28 L24 12 L32 20 L40 36 L52 52 L60 60 L72 44" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="58" y="14" fontSize="7" fill={RED}>70</text>
        <text x="58" y="46" fontSize="7" fill={GREEN}>30</text>
        <text x="58" y="30" fontSize="7" fill={GRAY}>50</text>
      </svg>
    ),
    divergence: (
      <svg width="80" height="68" viewBox="0 0 80 68" fill="none">
        {/* 가격 */}
        <text x="4" y="8" fontSize="7" fill={GRAY}>가격</text>
        <path d="M4 30 L24 20 L44 28 L64 16" stroke={GRAY} strokeWidth="1" opacity="0.6"/>
        <circle cx="4" cy="30" r="2" fill={GRAY}/>
        <circle cx="44" cy="28" r="2" fill={GRAY}/>
        <line x1="4" y1="30" x2="44" y2="28" stroke={RED} strokeWidth="0.8" strokeDasharray="3 2"/>
        {/* RSI */}
        <text x="4" y="44" fontSize="7" fill={GRAY}>RSI</text>
        <path d="M4 62 L24 56 L44 50 L64 44" stroke={TEAL} strokeWidth="1" opacity="0.6"/>
        <circle cx="4" cy="62" r="2" fill={TEAL}/>
        <circle cx="44" cy="50" r="2" fill={TEAL}/>
        <line x1="4" y1="62" x2="44" y2="50" stroke={GREEN} strokeWidth="0.8" strokeDasharray="3 2"/>
        <text x="48" y="24" fontSize="7" fill={RED}>↓</text>
        <text x="48" y="52" fontSize="7" fill={GREEN}>↑</text>
        <text x="56" y="36" fontSize="7" fill={GREEN}>Bull</text>
      </svg>
    ),
    fib_ret: (
      <svg width="80" height="68" viewBox="0 0 80 68" fill="none">
        <line x1="4" y1="60" x2="40" y2="8" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round"/>
        {[
          { y: 8,  label: '0', color: GREEN },
          { y: 20, label: '0.236', color: GRAY },
          { y: 28, label: '0.382', color: AMBER },
          { y: 34, label: '0.5', color: GRAY },
          { y: 40, label: '0.618', color: AMBER },
          { y: 48, label: '0.786', color: GRAY },
          { y: 60, label: '1', color: RED },
        ].map(({ y, label, color }) => (
          <g key={label}>
            <line x1="40" y1={y} x2="76" y2={y} stroke={color} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7"/>
            <text x="42" y={y - 1} fontSize="6" fill={color}>{label}</text>
          </g>
        ))}
        <path d="M40 8 L60 40" stroke={RED} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
      </svg>
    ),
    fib_ext: (
      <svg width="80" height="68" viewBox="0 0 80 68" fill="none">
        <line x1="4" y1="52" x2="24" y2="12" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="12" x2="38" y2="36" stroke={RED} strokeWidth="1.5" strokeLinecap="round"/>
        <text x="2" y="58" fontSize="6" fill={GRAY}>①</text>
        <text x="22" y="10" fontSize="6" fill={GRAY}>②</text>
        <text x="36" y="42" fontSize="6" fill={GRAY}>③</text>
        {[
          { y: 36, label: '0', color: GRAY },
          { y: 28, label: '0.618', color: AMBER },
          { y: 20, label: '1.0', color: GREEN },
          { y: 12, label: '1.382', color: AMBER },
          { y: 4,  label: '1.618', color: RED },
        ].map(({ y, label, color }) => (
          <g key={label}>
            <line x1="44" y1={y} x2="76" y2={y} stroke={color} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7"/>
            <text x="46" y={y - 1} fontSize="6" fill={color}>{label}</text>
          </g>
        ))}
      </svg>
    ),
    trendline: (
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
        {/* 상승 추세 */}
        <path d="M4 52 L16 40 L24 44 L36 30 L48 34 L60 20 L72 24" stroke={GRAY} strokeWidth="0.8" opacity="0.5"/>
        <line x1="4" y1="56" x2="72" y2="28" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round"/>
        <text x="4" y="10" fontSize="7" fill={GREEN}>상승 추세선 (지지)</text>
        <circle cx="16" cy="40" r="2" fill={GRAY} opacity="0.6"/>
        <circle cx="36" cy="30" r="2" fill={GRAY} opacity="0.6"/>
        <circle cx="60" cy="20" r="2" fill={GRAY} opacity="0.6"/>
      </svg>
    ),
    sr: (
      <svg width="80" height="64" viewBox="0 0 80 64" fill="none">
        <line x1="4" y1="16" x2="76" y2="16" stroke={RED} strokeWidth="1.2" strokeDasharray="4 2"/>
        <line x1="4" y1="48" x2="76" y2="48" stroke={GREEN} strokeWidth="1.2" strokeDasharray="4 2"/>
        <path d="M4 40 L14 28 L22 44 L32 20 L42 40 L52 20 L62 44 L72 28" stroke={GRAY} strokeWidth="1" opacity="0.6"/>
        <text x="58" y="13" fontSize="7" fill={RED}>저항</text>
        <text x="58" y="58" fontSize="7" fill={GREEN}>지지</text>
        {[22, 42, 62].map(x => (
          <circle key={x} cx={x} cy={48} r="2.5" fill={GREEN} opacity="0.5"/>
        ))}
        {[32, 52].map(x => (
          <circle key={x} cx={x} cy={16} r="2.5" fill={RED} opacity="0.5"/>
        ))}
      </svg>
    ),
    supply: (
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
        <rect x="4" y="24" width="72" height="16" fill={RED} opacity="0.12" rx="2"/>
        <line x1="4" y1="24" x2="76" y2="24" stroke={RED} strokeWidth="0.8" strokeDasharray="3 2"/>
        <line x1="4" y1="40" x2="76" y2="40" stroke={RED} strokeWidth="0.8" strokeDasharray="3 2"/>
        <path d="M4 52 L12 44 L20 48 L28 36 L34 42 L42 28 L48 34 L56 28 L64 36 L72 28" stroke={GRAY} strokeWidth="1" opacity="0.6"/>
        <text x="6" y="22" fontSize="7" fill={RED}>매물대 구간</text>
      </svg>
    ),
    volume: (
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
        {[
          { x: 6,  h: 20, c: GREEN },
          { x: 18, h: 14, c: RED },
          { x: 30, h: 18, c: GREEN },
          { x: 42, h: 12, c: RED },
          { x: 54, h: 38, c: GREEN },
          { x: 66, h: 10, c: RED },
        ].map(({ x, h, c }) => (
          <rect key={x} x={x} y={56 - h} width="10" height={h} fill={c} opacity="0.5" rx="1"/>
        ))}
        <text x="48" y="12" fontSize="7" fill={GREEN}>↑ 거래량 폭발</text>
        <line x1="57" y1="14" x2="59" y2="19" stroke={GREEN} strokeWidth="0.8"/>
      </svg>
    ),
  }
  return svgs[type] || null
}

/* ── 색상 맵 ── */
const ACCENT = {
  blue:   { light: '#185fa5', dark: '#4f8ef7' },
  teal:   { light: '#0f6e56', dark: '#2abfb0' },
  amber:  { light: '#854f0b', dark: '#f0a040' },
  red:    { light: '#a32d2d', dark: '#e05a6a' },
  purple: { light: '#534ab7', dark: '#9b7de8' },
  green:  { light: '#3b6d11', dark: '#3ec97e' },
}

/* ── 이미지 갤러리 모달 ── */
function GalleryModal({ images, onClose }) {
  const [idx, setIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const touchStartX = useRef(null)

  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(images.length - 1, i + 1))

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = e => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -40) next()
    if (dx >  40) prev()
    touchStartX.current = null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden bg-[#13161e] border border-white/10"
        onClick={e => e.stopPropagation()}>

        {/* 상단 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <span className="text-xs text-[#7a7f94] font-mono">{idx + 1} / {images.length}</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-[#7a7f94] hover:bg-white/5">✕</button>
        </div>

        {/* 이미지 영역 */}
        <div className="relative select-none"
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <img
            src={images[idx]}
            alt={`chart-${idx + 1}`}
            className="w-full object-contain max-h-72 cursor-zoom-in"
            onClick={() => setLightbox(true)}
          />
          {/* 좌우 버튼 */}
          {idx > 0 && (
            <button onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white text-sm flex items-center justify-center hover:bg-black/60">
              ‹
            </button>
          )}
          {idx < images.length - 1 && (
            <button onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white text-sm flex items-center justify-center hover:bg-black/60">
              ›
            </button>
          )}
        </div>

        {/* 인디케이터 */}
        <div className="flex justify-center gap-1.5 py-3">
          {images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white' : 'bg-white/25'}`}/>
          ))}
        </div>
      </div>

      {/* 라이트박스 */}
      {lightbox && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(false)}>
          <img src={images[idx]} alt="lightbox" className="max-w-full max-h-full object-contain cursor-zoom-out"/>
        </div>
      )}
    </div>
  )
}

/* ── 아코디언 아이템 ── */
function AccordionItem({ item, accentColor, sectionIdx, itemIdx }) {
  const [open, setOpen]       = useState(false)
  const [gallery, setGallery] = useState(false)
  const { dark } = useTheme()

  const muted   = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const detailC = dark ? 'text-[#b0b4c4]' : 'text-gray-600'
  const borderB = dark ? 'border-white/8' : 'border-black/8'

  // ChartNote에서 저장된 이미지 URL 목록 (실제로는 ChartNote가 관리)
  // 갤러리 버튼은 이미지가 있을 때만 노출 — 여기서는 항상 표시하되 ChartNote 연동
  const noteSection = `concept_${item.id}`

  return (
    <div className={`border-b ${borderB} last:border-b-0`}>
      {/* 트리거 */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3.5 text-left group"
      >
        <span className="text-sm font-medium">{item.title}</span>
        <span className={`text-sm transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
          style={{ color: accentColor }}>+</span>
      </button>

      {/* 본문 */}
      {open && (
        <div className="pb-5">
          {/* SVG + 설명 */}
          <div className="flex gap-4 mb-4">
            {item.svgType && (
              <div className="shrink-0">
                <ConceptSVG type={item.svgType} />
              </div>
            )}
            <div className="flex-1">
              <p className={`text-xs mb-3 leading-relaxed ${muted}`}>{item.desc}</p>
              <ul className="space-y-1.5">
                {item.details.map((d, i) => (
                  <li key={i} className={`text-xs flex gap-2 ${detailC}`}>
                    <span className="opacity-30 shrink-0 mt-0.5">—</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ChartNote + 차트 예시 버튼 */}
          <div className="flex items-center gap-2 flex-wrap">
            <ChartNote page="concepts" section={noteSection} label="예시 차트" single={true} />
          </div>

          {/* 키워드 */}
          <div className="flex flex-wrap gap-1 mt-3">
            {item.keywords.map(k => (
              <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark
                ? 'bg-white/5 border-white/10 text-[#7a7f94]'
                : 'bg-black/5 border-black/10 text-gray-500'}`}>{k}</span>
            ))}
          </div>
        </div>
      )}

      {gallery && <GalleryModal images={[]} onClose={() => setGallery(false)} />}
    </div>
  )
}

/* ── 메인 ── */
const CATEGORY_ORDER = ['캔들 기초', '이동평균선', '보조지표', '피보나치', '채널/추세', '거래량']

export default function Concepts() {
  const { dark } = useTheme()
  const { query, setQuery, filtered } = usePageSearch(CONCEPTS, ['title', 'desc', 'keywords', 'details'])

  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const catC  = dark ? 'text-[#4f8ef7]' : 'text-[#185fa5]'
  const divC  = dark ? 'border-white/10' : 'border-black/10'

  const colorForCategory = (cat) => {
    const item = CONCEPTS.find(c => c.category === cat)
    if (!item) return dark ? '#4f8ef7' : '#185fa5'
    return ACCENT[item.color]?.[dark ? 'dark' : 'light'] ?? '#888'
  }

  const accentForItem = (item) =>
    ACCENT[item.color]?.[dark ? 'dark' : 'light'] ?? '#888'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">개념 · 용어</h1>
        <p className={`text-sm ${muted}`}>기술적 분석 핵심 용어 — 클릭하면 상세 보기</p>
      </div>

      <PageSearch query={query} setQuery={setQuery} placeholder="용어 검색... (예: RSI, 피보나치, 골든크로스)" />
      {query && <p className={`text-xs mb-4 ${muted}`}>{filtered.length}개 결과</p>}

      {/* 카테고리별 아코디언 */}
      {!query && CATEGORY_ORDER.map((cat, si) => {
        const items = CONCEPTS.filter(c => c.category === cat)
        if (!items.length) return null
        const accent = colorForCategory(cat)

        return (
          <section key={cat} className="mb-10">
            {/* 섹션 헤더 */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-gray-400">
                {String(si + 1).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                {cat}
              </span>
              <div className={`flex-1 border-t ${divC}`} />
            </div>

            {/* 아코디언 목록 */}
            <div>
              {items.map((item, ii) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  accentColor={accentForItem(item)}
                  sectionIdx={si}
                  itemIdx={ii}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* 검색 결과 */}
      {query && (
        <div>
          {filtered.length === 0
            ? <p className={`text-sm ${muted}`}>검색 결과 없음</p>
            : filtered.map((item, ii) => (
              <AccordionItem
                key={item.id}
                item={item}
                accentColor={accentForItem(item)}
                sectionIdx={0}
                itemIdx={ii}
              />
            ))
          }
        </div>
      )}
    </div>
  )
}
