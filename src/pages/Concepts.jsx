import { useState } from 'react'
import { useTheme } from '../App'
import { PageSearch } from '../components/UI'
import { usePageSearch } from '../hooks/usePageSearch'
import ChartNote from '../components/ChartNote'

/* ── 색상 상수 ── */
const GREEN  = '#3ec97e'
const RED    = '#e05a6a'
const GRAY   = '#888780'
const BLUE   = '#4f8ef7'
const AMBER  = '#f0a040'
const TEAL   = '#2abfb0'

/* ── 데이터 ── */
const CONCEPTS = [
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
    color: 'red', id: 'ohlc', svgType: 'ohlc',
  },
  {
    category: '캔들 기초',
    title: '양봉 / 음봉',
    desc: '종가가 시가보다 높으면 양봉, 낮으면 음봉.',
    keywords: ['양봉', '음봉', '불리쉬', '베어리쉬'],
    details: [
      '양봉: 종가 > 시가 — 매수세 우세 (TradingView 기준 초록)',
      '음봉: 종가 < 시가 — 매도세 우세 (TradingView 기준 빨강)',
      '한국 HTS는 반대 — 양봉이 빨강, 음봉이 파랑',
      '장대양봉/장대음봉: 몸통이 크고 꼬리가 짧음 → 강한 방향성',
    ],
    color: 'red', id: 'bullbear', svgType: 'bullbear',
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
    color: 'red', id: 'body_tail', svgType: 'body_tail',
  },
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
    color: 'blue', id: 'ma_ema', svgType: 'ma',
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
    color: 'blue', id: 'golden_dead_cross', svgType: 'cross',
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
    color: 'teal', id: 'rsi', svgType: 'rsi',
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
    color: 'teal', id: 'divergence', svgType: 'divergence',
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
    color: 'amber', id: 'fib_retracement', svgType: 'fib_ret',
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
    color: 'amber', id: 'fib_extension', svgType: 'fib_ext',
  },
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
    color: 'green', id: 'trendline', svgType: 'trendline',
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
    color: 'green', id: 'support_resistance', svgType: 'sr',
  },
  {
    category: '채널/추세',
    title: '매물대 (공급존)',
    desc: '과거에 거래가 많이 몰린 가격대 — 강한 지지/저항 역할.',
    keywords: ['매물대', '공급존', '수요존'],
    details: [
      '고거래량 + 횡보 구간 → 강한 매물대',
      '급등/급락 구간 → 되돌아올 때 강한 지지/저항',
      '매물대 돌파 시 강한 상승 신호',
      '매물대 이탈 시 강한 하락 신호',
    ],
    color: 'green', id: 'supply_zone', svgType: 'supply',
  },
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
    color: 'purple', id: 'volume', svgType: 'volume',
  },
]

/* ── SVG 개념도 ── */
function ConceptSVG({ type, dark }) {
  const text = dark ? '#b0b4c4' : '#5a5852'

  const svgs = {

    ohlc: (
      <svg width="100%" height="130" viewBox="0 0 380 130" fill="none">
        {/* 양봉 */}
        <line x1="80" y1="10" x2="80" y2="30" stroke={GREEN} strokeWidth="2"/>
        <rect x="62" y="30" width="36" height="60" fill={GREEN} rx="2"/>
        <line x1="80" y1="90" x2="80" y2="118" stroke={GREEN} strokeWidth="2"/>
        <line x1="104" y1="10"  x2="118" y2="10"  stroke={GRAY} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
        <text x="121" y="14"  fontSize="11" fill={text}>고가</text>
        <line x1="104" y1="30"  x2="118" y2="30"  stroke={GRAY} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
        <text x="121" y="34"  fontSize="11" fill={text}>종가</text>
        <line x1="104" y1="90"  x2="118" y2="90"  stroke={GRAY} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
        <text x="121" y="94"  fontSize="11" fill={text}>시가</text>
        <line x1="104" y1="118" x2="118" y2="118" stroke={GRAY} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
        <text x="121" y="122" fontSize="11" fill={text}>저가</text>
        <line x1="44" y1="30" x2="44" y2="90" stroke={GREEN} strokeWidth="1.2"/>
        <line x1="44" y1="30" x2="50" y2="30" stroke={GREEN} strokeWidth="1.2"/>
        <line x1="44" y1="90" x2="50" y2="90" stroke={GREEN} strokeWidth="1.2"/>
        <text x="4"  y="64" fontSize="11" fill={GREEN}>몸통</text>
        <text x="64" y="128" fontSize="12" fill={GREEN} fontWeight="500">양봉</text>
        {/* 구분선 */}
        <line x1="190" y1="10" x2="190" y2="120" stroke={GRAY} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.25"/>
        {/* 음봉 */}
        <line x1="290" y1="10" x2="290" y2="30" stroke={RED} strokeWidth="2"/>
        <rect x="272" y="30" width="36" height="60" fill={RED} rx="2"/>
        <line x1="290" y1="90" x2="290" y2="118" stroke={RED} strokeWidth="2"/>
        <line x1="314" y1="10"  x2="328" y2="10"  stroke={GRAY} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
        <text x="331" y="14"  fontSize="11" fill={text}>고가</text>
        <line x1="314" y1="30"  x2="328" y2="30"  stroke={GRAY} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
        <text x="331" y="34"  fontSize="11" fill={text}>시가</text>
        <line x1="314" y1="90"  x2="328" y2="90"  stroke={GRAY} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
        <text x="331" y="94"  fontSize="11" fill={text}>종가</text>
        <line x1="314" y1="118" x2="328" y2="118" stroke={GRAY} strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
        <text x="331" y="122" fontSize="11" fill={text}>저가</text>
        <text x="274" y="128" fontSize="12" fill={RED} fontWeight="500">음봉</text>
      </svg>
    ),

    bullbear: (
      <svg width="100%" height="120" viewBox="0 0 380 120" fill="none">
        <line x1="60"  y1="8"  x2="60"  y2="18" stroke={GREEN} strokeWidth="2"/>
        <rect x="44"  y="18" width="32" height="72" fill={GREEN} rx="2"/>
        <line x1="60"  y1="90" x2="60"  y2="108" stroke={GREEN} strokeWidth="2"/>
        <text x="36"  y="118" fontSize="11" fill={GREEN}>장대양봉</text>
        <line x1="140" y1="30" x2="140" y2="42" stroke={GREEN} strokeWidth="2"/>
        <rect x="124" y="42" width="32" height="32" fill={GREEN} rx="2"/>
        <line x1="140" y1="74" x2="140" y2="90" stroke={GREEN} strokeWidth="2"/>
        <text x="124" y="118" fontSize="11" fill={GREEN}>양봉</text>
        <line x1="190" y1="4" x2="190" y2="108" stroke={GRAY} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.3"/>
        <line x1="240" y1="30" x2="240" y2="42" stroke={RED} strokeWidth="2"/>
        <rect x="224" y="42" width="32" height="32" fill={RED} rx="2"/>
        <line x1="240" y1="74" x2="240" y2="90" stroke={RED} strokeWidth="2"/>
        <text x="224" y="118" fontSize="11" fill={RED}>음봉</text>
        <line x1="320" y1="8"  x2="320" y2="18" stroke={RED} strokeWidth="2"/>
        <rect x="304" y="18" width="32" height="72" fill={RED} rx="2"/>
        <line x1="320" y1="90" x2="320" y2="108" stroke={RED} strokeWidth="2"/>
        <text x="300" y="118" fontSize="11" fill={RED}>장대음봉</text>
      </svg>
    ),

    body_tail: (
      <svg width="100%" height="130" viewBox="0 0 380 130" fill="none">
        {/* 양봉 */}
        <line x1="100" y1="8"   x2="100" y2="28"  stroke={GREEN} strokeWidth="2"/>
        <rect x="82"  y="28"  width="36" height="60" fill={GREEN} rx="2"/>
        <line x1="100" y1="88"  x2="100" y2="115" stroke={GREEN} strokeWidth="2"/>
        <line x1="122" y1="8"   x2="145" y2="8"   stroke={GRAY} strokeWidth="1"/>
        <line x1="122" y1="28"  x2="145" y2="28"  stroke={GRAY} strokeWidth="1"/>
        <line x1="145" y1="8"   x2="145" y2="28"  stroke={GRAY} strokeWidth="1"/>
        <text x="149" y="16" fontSize="10" fill={text}>위꼬리</text>
        <text x="149" y="28" fontSize="9"  fill={text} opacity="0.6">매도 저항 흔적</text>
        <line x1="58"  y1="28"  x2="35"  y2="28"  stroke={GRAY} strokeWidth="1"/>
        <line x1="58"  y1="88"  x2="35"  y2="88"  stroke={GRAY} strokeWidth="1"/>
        <line x1="35"  y1="28"  x2="35"  y2="88"  stroke={GRAY} strokeWidth="1"/>
        <text x="2"  y="62" fontSize="10" fill={text}>몸통</text>
        <line x1="122" y1="88"  x2="145" y2="88"  stroke={GRAY} strokeWidth="1"/>
        <line x1="122" y1="115" x2="145" y2="115" stroke={GRAY} strokeWidth="1"/>
        <line x1="145" y1="88"  x2="145" y2="115" stroke={GRAY} strokeWidth="1"/>
        <text x="149" y="100" fontSize="10" fill={text}>아래꼬리</text>
        <text x="149" y="112" fontSize="9"  fill={text} opacity="0.6">매수 지지 흔적</text>
        <text x="82"  y="128" fontSize="12" fill={GREEN} fontWeight="500">양봉</text>
        {/* 구분선 */}
        <line x1="190" y1="10" x2="190" y2="120" stroke={GRAY} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.25"/>
        {/* 음봉 */}
        <line x1="280" y1="8"   x2="280" y2="28"  stroke={RED} strokeWidth="2"/>
        <rect x="262" y="28"  width="36" height="60" fill={RED} rx="2"/>
        <line x1="280" y1="88"  x2="280" y2="115" stroke={RED} strokeWidth="2"/>
        <line x1="302" y1="8"   x2="325" y2="8"   stroke={GRAY} strokeWidth="1"/>
        <line x1="302" y1="28"  x2="325" y2="28"  stroke={GRAY} strokeWidth="1"/>
        <line x1="325" y1="8"   x2="325" y2="28"  stroke={GRAY} strokeWidth="1"/>
        <text x="329" y="20" fontSize="10" fill={text}>위꼬리</text>
        <line x1="302" y1="88"  x2="325" y2="88"  stroke={GRAY} strokeWidth="1"/>
        <line x1="302" y1="115" x2="325" y2="115" stroke={GRAY} strokeWidth="1"/>
        <line x1="325" y1="88"  x2="325" y2="115" stroke={GRAY} strokeWidth="1"/>
        <text x="329" y="104" fontSize="10" fill={text}>아래꼬리</text>
        <text x="262" y="128" fontSize="12" fill={RED} fontWeight="500">음봉</text>
      </svg>
    ),

    ma: (
      <svg width="100%" height="120" viewBox="0 0 546 249" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M2.62537 127.572C5.19889 122.728 14.1004 114.49 24.1048 109.433C29.345 106.784 38.0976 101.454 52.9371 93.9584C67.7766 86.4626 88.3648 76.8203 102.28 70.7405C122.579 61.8712 132.571 59.7721 138.498 58.8393C144.492 57.8961 152.97 56.0298 163.164 54.906C171.479 53.9894 176.778 54.1531 198.675 53.0349C219.089 51.9924 258.44 51.175 292.308 48.5621C326.176 45.9492 353.382 41.8698 368.5 39.212C385.959 36.1426 389.934 33.9245 393.823 32.9917C398.078 31.6881 407.704 29.0696 425.095 23.8495C435.133 20.4837 447.633 15.6626 461.625 9.57153" stroke="#D80505" strokeWidth="3" strokeLinecap="round"/>
        <path d="M10.8292 150.132C11.5335 149.022 27.6783 141.588 50.0373 132.815C66.3532 126.413 82.614 123.985 96.6947 121.558C101.846 120.67 102.909 120.241 124.916 119.125C146.922 118.009 189.831 116.159 214.617 114.651C239.403 113.143 244.766 112.033 251.105 111.091C264.555 109.093 280.187 106.797 295.151 102.699C320.566 95.7389 337.67 85.1242 345.254 81.5643C347.106 80.6954 348.505 79.5181 358.002 75.0613C367.499 70.6045 385.02 62.8345 394.761 58.6467C411.108 51.6194 422.186 47.003 429.592 42.6975C431.234 41.7557 432.306 41.0157 433.574 40.6345C434.842 40.2533 459.586 30.6212 462.143 29.5" stroke="#FFA600" strokeWidth="3" strokeLinecap="round"/>
        <path d="M24.1604 168.591C32.3936 161.591 42.8793 155.98 57.1438 152.112C68.2023 149.113 78.1772 147.896 108.165 146.496C133.671 145.305 180.151 145.096 218.766 142.306C257.381 139.517 286.743 134.654 307.073 130.585C338.056 124.385 350.018 120.17 353.2 119.822C362.446 118.813 373.265 112.822 383.784 108.606C390.617 105.868 396.917 101.601 410.415 94.9379C428.847 84.3906 439.333 78.8011 448.546 74.2222C451.362 72.8222 455.078 70.7379 461.16 68.5906" stroke="#00BBFF" strokeWidth="3" strokeLinecap="round"/>
        <path d="M2.62537 195.253C6.04455 195.253 10.1994 195.253 22.0318 193.064C31.5911 191.295 47.883 186.495 93.4359 179.423C138.989 172.35 213.185 162.717 254.143 157.024C295.101 151.332 300.571 149.872 304.928 148.536C318.044 144.515 330.992 139.558 342.436 135.847C351.995 132.747 362.448 130.694 370.421 128.765C377.418 127.073 394.485 121.582 410.975 116.832C414.948 115.655 420.077 113.904 428.361 111.688C436.645 109.472 447.928 106.844 461.625 103.253" stroke="#A200FF" strokeWidth="3" strokeLinecap="round"/>
        <path d="M1.59406 246.533C0.95671 246.533 3.49646 246.852 11.5068 246.379C16.7007 246.071 23.9786 243.671 62.3308 237.101C100.683 230.53 169.836 219.362 207.85 212.97C245.864 206.578 250.644 205.302 259.48 203.368C281.015 198.655 296.109 195.294 301.555 193.365C309.894 190.411 318.628 189.492 327.918 186.446C343.052 181.484 354.05 177.56 359.337 176.438C373.922 173.344 382.016 169.834 388.974 168.373C391.96 167.747 407.047 165.975 428.123 162.431C440.324 159.835 443.868 158.22 446.432 157.577C448.04 157.253 450.271 156.934 454.5 155.638" stroke={c} strokeWidth="3" strokeLinecap="round"/>
        <path d="M1.6427 71L121.643 82.5L219.143 191L302.143 10.5L396.643 96L418.143 35.5" stroke={c} strokeWidth="2" opacity="0.4"/>
      </svg>
    ),
    divergence: null,
    trendline: (
      <svg width="100%" height="110" viewBox="0 0 444 192" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M26.0291 29L72.5291 167.5L155.029 29L272.029 167.5L351.529 22.5" stroke={c} strokeWidth="3"/>
        <line x1="0.029" y1="169" x2="413.029" y2="169" stroke="#D80505" strokeWidth="2" strokeDasharray="4 4"/>
        <line x1="0.014" y1="27" x2="413.015" y2="21" stroke="#07831E" strokeWidth="2" strokeDasharray="4 4"/>
        <circle cx="26.029" cy="29" r="5" fill="#3EC97E"/>
        <circle cx="71.029" cy="170" r="5" fill="#D80505"/>
        <circle cx="271.029" cy="170" r="5" fill="#D80505"/>
        <circle cx="155.029" cy="27" r="5" fill="#3EC97E"/>
        <circle cx="351.029" cy="23" r="5" fill="#3EC97E"/>
        <text x="4" y="18" fontSize="13" fill="#07831E" fontWeight="500">저항선 (고점)</text>
        <text x="4" y="186" fontSize="13" fill="#D80505" fontWeight="500">지지선 (저점)</text>
      </svg>
    ),
    sr: (
      <svg width="100%" height="110" viewBox="0 0 444 204" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M7.02905 2.5L72.5291 167.5L243.529 22L272.529 198L357.029 10" stroke={c} strokeWidth="3"/>
        <line x1="0.029" y1="169" x2="413.029" y2="169" stroke={c} strokeWidth="2" strokeDasharray="4 4" opacity="0.5"/>
        <line x1="0.014" y1="27" x2="413.015" y2="21" stroke={c} strokeWidth="2" strokeDasharray="4 4" opacity="0.5"/>
        <circle cx="243.529" cy="22.5" r="12" stroke="#07831E" strokeWidth="3"/>
        <circle cx="72.5291" cy="166.5" r="12" stroke="#D80505" strokeWidth="3"/>
        <text x="258" y="18" fontSize="13" fill="#07831E" fontWeight="500">저항</text>
        <text x="88" y="185" fontSize="13" fill="#D80505" fontWeight="500">지지</text>
      </svg>
    ),

    cross: (
      <svg width="100%" height="100" viewBox="0 0 521 180" fill="none" preserveAspectRatio="xMidYMid meet">
        <line x1="2.52311" y1="59.6444" x2="192.523" y2="149.644" stroke="#00BBFF" strokeWidth="3"/>
        <line x1="0.940467" y1="178.831" x2="164.94" y2="46.8315" stroke="#FFA600" strokeWidth="3"/>
        <line x1="248.523" y1="38.6444" x2="438.523" y2="128.644" stroke="#FFA600" strokeWidth="3"/>
        <line x1="246.94" y1="157.831" x2="410.94" y2="25.8315" stroke="#00BBFF" strokeWidth="3"/>
        <circle cx="92.881" cy="102" r="9" fill="#3EC97E"/>
        <circle cx="338.881" cy="81" r="9" fill="#D80505"/>
        <line x1="437.881" y1="8" x2="455.881" y2="8" stroke="#FFA600" strokeWidth="2"/>
        <line x1="437.881" y1="27" x2="455.881" y2="27" stroke="#00BBFF" strokeWidth="2"/>
        <text x="460" y="12" fontSize="13" fill={c}>단기</text>
        <text x="460" y="31" fontSize="13" fill={c}>장기</text>
        <text x="10" y="35" fontSize="13" fill="#3EC97E" fontWeight="500">골든크로스</text>
        <text x="255" y="20" fontSize="13" fill="#D80505" fontWeight="500">데드크로스</text>
      </svg>
    ),

    rsi: (
      <svg width="100%" height="110" viewBox="0 0 380 110" fill="none">
        <rect x="20" y="4"  width="340" height="28" fill={RED}   opacity="0.05" rx="2"/>
        <rect x="20" y="82" width="340" height="22" fill={GREEN} opacity="0.06" rx="2"/>
        <line x1="20" y1="22" x2="360" y2="22" stroke={RED}   strokeWidth="1.2" strokeDasharray="4 2" opacity="0.7"/>
        <line x1="20" y1="88" x2="360" y2="88" stroke={GREEN} strokeWidth="1.2" strokeDasharray="4 2" opacity="0.7"/>
        <line x1="20" y1="55" x2="360" y2="55" stroke={GRAY}  strokeWidth="0.8" strokeDasharray="4 2" opacity="0.35"/>
        <path d="M20 70 L60 50 L90 15 L120 30 L150 60 L190 95 L230 105 L270 78 L310 40 L350 55"
          stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="365" y="26"  fontSize="11" fill={RED}>70</text>
        <text x="365" y="92"  fontSize="11" fill={GREEN}>30</text>
        <text x="365" y="59"  fontSize="11" fill={GRAY}>50</text>
        <text x="25"  y="17"  fontSize="10" fill={RED}   opacity="0.8">과매수 구간</text>
        <text x="25"  y="103" fontSize="10" fill={GREEN} opacity="0.8">과매도 구간</text>
      </svg>
    ),

    divergence: null,

    fib_ret: (
      <svg width="100%" height="130" viewBox="0 0 380 130" fill="none">
        <line x1="30" y1="115" x2="180" y2="15" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
        {[
          { y: 15,  label: '0',       color: GREEN },
          { y: 35,  label: '0.236',   color: GRAY  },
          { y: 55,  label: '0.382',   color: AMBER },
          { y: 65,  label: '0.5',     color: GRAY  },
          { y: 78,  label: '0.618 ★', color: AMBER },
          { y: 95,  label: '0.786',   color: GRAY  },
          { y: 115, label: '1',       color: RED   },
        ].map(({ y, label, color }) => (
          <g key={label}>
            <line x1="180" y1={y} x2="360" y2={y} stroke={color} strokeWidth="1" strokeDasharray="4 2" opacity="0.8"/>
            <text x="186" y={y - 2} fontSize="11" fill={color}>{label}</text>
          </g>
        ))}
        <path d="M180 15 L275 78" stroke={RED} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.55"/>
        <text x="30" y="128" fontSize="10" fill={GRAY}>저점 → 고점 방향으로 그음 (상승 추세 기준)</text>
      </svg>
    ),

    fib_ext: (
      <svg width="100%" height="130" viewBox="0 0 380 130" fill="none">
        <line x1="30"  y1="100" x2="120" y2="20"  stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
        <line x1="120" y1="20"  x2="180" y2="65"  stroke={RED}   strokeWidth="2" strokeLinecap="round"/>
        <circle cx="30"  cy="100" r="4" fill={GRAY}/>
        <circle cx="120" cy="20"  r="4" fill={GRAY}/>
        <circle cx="180" cy="65"  r="4" fill={GRAY}/>
        <text x="14"  y="115" fontSize="10" fill={GRAY}>①</text>
        <text x="114" y="14"  fontSize="10" fill={GRAY}>②</text>
        <text x="174" y="80"  fontSize="10" fill={GRAY}>③</text>
        {[
          { y: 65, label: '0',       color: GRAY  },
          { y: 52, label: '0.618',   color: AMBER },
          { y: 38, label: '1.0',     color: GREEN },
          { y: 24, label: '1.382',   color: AMBER },
          { y: 10, label: '1.618 ★', color: RED   },
        ].map(({ y, label, color }) => (
          <g key={label}>
            <line x1="200" y1={y} x2="370" y2={y} stroke={color} strokeWidth="1" strokeDasharray="4 2" opacity="0.8"/>
            <text x="206" y={y - 2} fontSize="11" fill={color}>{label}</text>
          </g>
        ))}
        <text x="30" y="128" fontSize="10" fill={GRAY}>① W시작 → ② W끝 → ③ X끝 순으로 클릭</text>
      </svg>
    ),

    supply: (
      <svg width="100%" height="110" viewBox="0 0 380 110" fill="none">
        <rect x="20" y="38" width="340" height="28" fill={RED} opacity="0.1" rx="3"/>
        <line x1="20" y1="38" x2="360" y2="38" stroke={RED} strokeWidth="1.2" strokeDasharray="4 2"/>
        <line x1="20" y1="66" x2="360" y2="66" stroke={RED} strokeWidth="1.2" strokeDasharray="4 2"/>
        <path d="M20 90 L60 70 L100 85 L140 55 L180 68 L220 45 L260 62 L300 50 L340 55" stroke={GRAY} strokeWidth="1.2" opacity="0.55"/>
        <text x="25" y="32" fontSize="11" fill={RED} fontWeight="500">매물대 구간 (강한 지지/저항)</text>
        <text x="20" y="105" fontSize="10" fill={GRAY} opacity="0.8">고거래량 + 횡보 구간 — 돌파 시 강한 상승, 이탈 시 강한 하락</text>
      </svg>
    ),

    volume: (
      <svg width="100%" height="110" viewBox="0 0 380 110" fill="none">
        {[
          { x: 20,  h: 30, c: GREEN },
          { x: 60,  h: 20, c: RED   },
          { x: 100, h: 25, c: GREEN },
          { x: 140, h: 15, c: RED   },
          { x: 180, h: 18, c: GREEN },
          { x: 220, h: 12, c: RED   },
          { x: 260, h: 75, c: GREEN },
          { x: 300, h: 16, c: RED   },
          { x: 340, h: 14, c: GREEN },
        ].map(({ x, h, c }) => (
          <rect key={x} x={x} y={90 - h} width="28" height={h} fill={c} opacity="0.5" rx="2"/>
        ))}
        <text x="252" y="10" fontSize="11" fill={GREEN} fontWeight="500">↑ 거래량 폭발</text>
        <line x1="274" y1="12" x2="274" y2="16" stroke={GREEN} strokeWidth="1"/>
        <text x="20" y="106" fontSize="10" fill={GRAY} opacity="0.8">패턴 신뢰도 보조 확인 — 단독 매매 판단으로 쓰지 않음</text>
      </svg>
    ),
  }

  const svg = svgs[type] ?? null
  if (!svg) return null
  return (
    <div className={`w-full rounded-xl p-4 mb-4 ${dark ? 'bg-[#0d0f14]' : 'bg-black/[0.04]'}`}>
      {svg}
    </div>
  )
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

/* ── 아코디언 아이템 ── */
function AccordionItem({ item, accentColor }) {
  const [open, setOpen] = useState(false)
  const { dark } = useTheme()
  const muted   = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const detailC = dark ? 'text-[#b0b4c4]' : 'text-gray-600'
  const borderB = dark ? 'border-white/8'  : 'border-black/8'

  return (
    <div className={`border-b ${borderB} last:border-b-0`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <span className="text-sm font-medium">{item.title}</span>
        <span
          className="text-base shrink-0 ml-2 transition-transform duration-200"
          style={{ color: accentColor, display: 'inline-block', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >+</span>
      </button>

      {open && (
        <div className="pb-5">
          {/* SVG — 세로 배치, 전체 너비 */}
          {item.svgType && <ConceptSVG type={item.svgType} dark={dark} />}

          {/* 설명 */}
          <p className={`text-xs mb-3 leading-relaxed text-center ${muted}`}>{item.desc}</p>

          {/* 세부 항목 */}
          <ul className="space-y-1.5 mb-4">
            {item.details.map((d, i) => (
              <li key={i} className={`text-xs flex gap-2 justify-center ${detailC}`}>
                <span className="opacity-30 shrink-0 mt-0.5">—</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* 더보기 */}
          <ChartNote page="concepts" section={`concept_${item.id}`} label="더보기" single={true} />

          {/* 키워드 */}
          <div className="flex flex-wrap gap-1 mt-3">
            {item.keywords.map(k => (
              <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${
                dark
                  ? 'bg-white/5 border-white/10 text-[#7a7f94]'
                  : 'bg-black/5 border-black/10 text-gray-500'
              }`}>{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── 메인 ── */
const CATEGORY_ORDER = ['캔들 기초', '이동평균선', '보조지표', '피보나치', '채널/추세', '거래량']

export default function Concepts() {
  const { dark } = useTheme()
  const { query, setQuery, filtered } = usePageSearch(CONCEPTS, ['title', 'desc', 'keywords', 'details'])
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const divC  = dark ? 'border-white/10' : 'border-black/10'

  const accentForItem = (item) =>
    ACCENT[item.color]?.[dark ? 'dark' : 'light'] ?? '#888'

  const accentForCategory = (cat) => {
    const item = CONCEPTS.find(c => c.category === cat)
    return item ? accentForItem(item) : '#888'
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">개념 · 용어</h1>
        <p className={`text-sm ${muted}`}>기술적 분석 핵심 용어 — 클릭하면 상세 보기</p>
      </div>

      <PageSearch query={query} setQuery={setQuery} placeholder="용어 검색... (예: RSI, 피보나치, 골든크로스)" />
      {query && <p className={`text-xs mb-4 ${muted}`}>{filtered.length}개 결과</p>}

      {!query && CATEGORY_ORDER.map((cat, si) => {
        const items = CONCEPTS.filter(c => c.category === cat)
        if (!items.length) return null
        const accent = accentForCategory(cat)
        return (
          <section key={cat} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono" style={{ color: `${accent}99` }}>
                {String(si + 1).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                {cat}
              </span>
              <div className={`flex-1 border-t ${divC}`} />
            </div>
            <div>
              {items.map(item => (
                <AccordionItem key={item.id} item={item} accentColor={accentForItem(item)} />
              ))}
            </div>
          </section>
        )
      })}

      {query && (
        <div>
          {filtered.length === 0
            ? <p className={`text-sm ${muted}`}>검색 결과 없음</p>
            : filtered.map(item => (
              <AccordionItem key={item.id} item={item} accentColor={accentForItem(item)} />
            ))
          }
        </div>
      )}
    </div>
  )
}
