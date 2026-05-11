import { useState } from 'react'
import { useTheme } from '../App'
import { PageSearch } from '../components/UI'
import { usePageSearch } from '../hooks/usePageSearch'
import ChartNote from '../components/ChartNote'

const GREEN = '#3ec97e'
const RED   = '#e05a6a'
const GRAY  = '#888780'
const SW    = 1.0

function ChannelSVG({ name }) {
  const svgs = {
    '상승 채널': (
      <svg width="80" height="80" viewBox="-5 -5 295 305" fill="none">
        <line x1="197.99" y1="11.1213" x2="0.707138" y2="208.404" stroke={GREEN} strokeWidth={SW*5}/>
        <line x1="239.002" y1="52.1335" x2="41.7193" y2="249.416" stroke={GREEN} strokeWidth={SW*5} strokeDasharray="12 8"/>
        <line x1="280.014" y1="93.1457" x2="82.7316" y2="290.428" stroke={GREEN} strokeWidth={SW*5}/>
        <path d="M89.5 278.914V167.414L139.5 208.914L146.86 60.1336L232 142.914L220.134 24.9142" stroke={GREEN} strokeWidth={SW*5}/>
      </svg>
    ),
    '하락 채널': (
      <svg width="80" height="80" viewBox="345 -5 295 295" fill="none">
        <line x1="350.707" y1="82.7315" x2="547.99" y2="280.014" stroke={RED} strokeWidth={SW*5}/>
        <line x1="391.719" y1="41.7193" x2="589.002" y2="239.002" stroke={RED} strokeWidth={SW*5} strokeDasharray="12 8"/>
        <line x1="432.732" y1="0.707078" x2="630.014" y2="197.99" stroke={RED} strokeWidth={SW*5}/>
        <path d="M443 10.4142L398 125.414H471.5L464 163.414L566 132.414L545 220.414H612.5" stroke={RED} strokeWidth={SW*5}/>
      </svg>
    ),
    '횡보 채널': (
      <svg width="80" height="80" viewBox="708 55 290 140" fill="none">
        <line x1="991" y1="69.9142" x2="712" y2="69.9142" stroke={GRAY} strokeWidth={SW*5}/>
        <line x1="991" y1="127.914" x2="712" y2="127.914" stroke={GRAY} strokeWidth={SW*5} strokeDasharray="12 8"/>
        <line x1="991" y1="185.914" x2="712" y2="185.914" stroke={GRAY} strokeWidth={SW*5}/>
        <path d="M719 185.914L741.5 69.4142C745.5 101.081 754.2 162.514 757 154.914C759.8 147.314 770.833 109.748 776 91.9142L792.5 178.914L813 69.4142L836.5 193.914L861.5 99.4142L879.5 161.914L903 56.4142L915 132.414L924.5 99.4142L943.5 169.414C945 156.748 948.5 132.814 950.5 138.414C952.5 144.014 964.667 183.414 970.5 202.414L977.5 132.414L987 76.9142L996.5 132.414" stroke={GRAY} strokeWidth={SW*5}/>
      </svg>
    ),
    '어센딩 트라이앵글': (
      <svg width="80" height="70" viewBox="0 0 385 280" fill="none">
        <line x1="0.472046" y1="73.4135" x2="381.472" y2="73.4135" stroke={GREEN} strokeWidth={SW*5}/>
        <line x1="0.236032" y1="277.473" x2="381.236" y2="73.4727" stroke={GREEN} strokeWidth={SW*5}/>
        <path d="M12.972 272.413L49.972 73.4135L127.472 207.913L184.472 73.4135L245.472 144.913L285.972 73.4135L335.972 100.913" stroke={GREEN} strokeWidth={SW*5}/>
      </svg>
    ),
    '디센딩 트라이앵글': (
      <svg width="80" height="70" viewBox="480 70 390 215" fill="none">
        <line x1="485.472" y1="277.413" x2="863.472" y2="277.413" stroke={RED} strokeWidth={SW*5}/>
        <line x1="863.235" y1="278.353" x2="485.235" y2="74.3535" stroke={RED} strokeWidth={SW*5}/>
        <path d="M516.472 89.9135L540.472 273.913L610.472 146.913L641.972 273.913L730.472 205.913L754.472 273.913" stroke={RED} strokeWidth={SW*5}/>
      </svg>
    ),
    '대칭 삼각수렴': (
      <svg width="80" height="70" viewBox="893 0 292 230" fill="none">
        <line x1="896.676" y1="0.456745" x2="1181.68" y2="127.457" stroke={GRAY} strokeWidth={SW*5}/>
        <line x1="1181.64" y1="128.385" x2="905.639" y2="226.385" stroke={GRAY} strokeWidth={SW*5}/>
        <path d="M929.472 218.913L962.472 30.9135L1025.47 185.913L1071.47 74.9135L1109.97 152.413L1154.47 109.913" stroke={GRAY} strokeWidth={SW*5}/>
      </svg>
    ),
    '하락 쐐기': (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
        <svg x="0" y="0" width="46" height="80" viewBox="34 58 480 350">
          <line x1="89.8782" y1="58.8371" x2="441.878" y2="293.837" stroke={GREEN} strokeWidth={SW*15}/>
          <line x1="34.3841" y1="250.598" x2="426.384" y2="377.598" stroke={GREEN} strokeWidth={SW*15}/>
          <path d="M142.268 94.0005H144.268L140.5 93.065L142.268 94.0005ZM142.268 282H140.268V287.634L143.82 283.262L142.268 282ZM239.768 162H241.768V156.367L238.215 160.739L239.768 162ZM239.768 319H237.768V323.579L241.127 320.468L239.768 319ZM341.268 225L343.253 225.246L343.923 219.815L339.909 223.533L341.268 225ZM326.268 346.5L324.283 346.255L327.971 347.548L326.268 346.5ZM433.713 174.537C433.457 173.462 432.379 172.799 431.304 173.055L413.794 177.227C412.72 177.483 412.056 178.562 412.312 179.636C412.568 180.711 413.647 181.374 414.721 181.118L430.286 177.41L433.994 192.974C434.25 194.048 435.329 194.712 436.403 194.456C437.478 194.2 438.141 193.121 437.885 192.047L433.713 174.537ZM1.7677 359.5L3.53544 360.436L144.035 94.936L142.268 94.0005L140.5 93.065L-3.75509e-05 358.565L1.7677 359.5ZM142.268 94.0005H140.268V282H142.268H144.268V94.0005H142.268ZM142.268 282L143.82 283.262L241.32 163.262L239.768 162L238.215 160.739L140.715 280.739L142.268 282ZM239.768 162H237.768V319H239.768H241.768V162H239.768ZM239.768 319L241.127 320.468L342.627 226.468L341.268 225L339.909 223.533L238.409 317.533L239.768 319ZM341.268 225L339.283 224.755L324.283 346.255L326.268 346.5L328.253 346.746L343.253 225.246L341.268 225ZM326.268 346.5L327.971 347.548L433.471 176.048L431.768 175L430.064 173.953L324.564 345.453L326.268 346.5Z" fill={GREEN}/>
        </svg>
        <line x1="50" y1="74" x2="54" y2="6" stroke={GRAY} strokeWidth="1" opacity="0.5"/>
        <svg x="56" y="0" width="44" height="80" viewBox="955 40 450 430">
          <line x1="974.74" y1="172.571" x2="1376.74" y2="62.5714" stroke={GREEN} strokeWidth={SW*15}/>
          <line x1="995.248" y1="377.78" x2="1395.25" y2="140.78" stroke={GREEN} strokeWidth={SW*15}/>
          <path d="M1034.27 453.5L1036.26 453.716L1069.26 149.716L1067.27 149.5L1065.28 149.285L1032.28 453.285L1034.27 453.5ZM1067.27 149.5L1065.68 150.715L1161.18 275.715L1162.77 274.5L1164.36 273.286L1068.86 148.286L1067.27 149.5ZM1162.77 274.5L1164.61 275.285L1235.61 108.785L1233.77 108L1231.93 107.216L1160.93 273.716L1162.77 274.5ZM1233.77 108L1231.87 108.625L1267.37 216.625L1269.27 216L1271.17 215.376L1235.67 107.376L1233.77 108ZM1269.27 216L1271.16 216.646L1344.16 2.6462L1342.27 2.00049L1340.37 1.35478L1267.37 215.355L1269.27 216Z" fill={GREEN}/>
        </svg>
      </svg>
    ),
    '상승 쐐기': (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
        <svg x="0" y="0" width="46" height="80" viewBox="470 50 440 380">
          <line x1="490.74" y1="203.571" x2="892.74" y2="93.5714" stroke={RED} strokeWidth={SW*15}/>
          <line x1="511.248" y1="408.78" x2="911.248" y2="171.78" stroke={RED} strokeWidth={SW*15}/>
          <path d="M572.768 374L574.749 374.276L602.749 173.276L600.768 173L598.787 172.725L570.787 373.725L572.768 374ZM600.768 173L599.048 174.021L680.048 310.521L681.768 309.5L683.488 308.48L602.488 171.98L600.768 173ZM681.768 309.5L683.738 309.843L713.238 140.343L711.268 140L709.297 139.658L679.797 309.158L681.768 309.5ZM711.268 140L709.463 140.862L766.463 260.362L768.268 259.5L770.073 258.639L713.073 139.139L711.268 140ZM768.268 259.5L770.215 259.957L801.715 125.457L799.768 125L797.82 124.544L766.32 259.044L768.268 259.5ZM799.768 125L797.958 125.852L873.458 286.352L875.268 285.5L877.077 284.649L801.577 124.149L799.768 125Z" fill={RED}/>
        </svg>
        <line x1="50" y1="74" x2="54" y2="6" stroke={GRAY} strokeWidth="1" opacity="0.5"/>
        <svg x="56" y="0" width="44" height="80" viewBox="1450 0 450 456">
          <line x1="1532.88" y1="62.8371" x2="1884.88" y2="297.837" stroke={RED} strokeWidth={SW*15}/>
          <line x1="1477.38" y1="254.598" x2="1869.38" y2="381.598" stroke={RED} strokeWidth={SW*15}/>
          <path d="M1567.27 2.00049H1565.27V276.5H1567.27H1569.27V2.00049H1567.27ZM1567.27 276.5L1568.78 277.811L1669.78 161.311L1668.27 160L1666.76 158.69L1565.76 275.19L1567.27 276.5ZM1668.27 160L1666.29 160.277L1689.29 324.777L1691.27 324.5L1693.25 324.224L1670.25 159.724L1668.27 160ZM1691.27 324.5L1692.84 325.736L1769.84 227.736L1768.27 226.5L1766.7 225.265L1689.7 323.265L1691.27 324.5ZM1768.27 226.5L1766.27 226.616L1777.27 416.616L1779.27 416.5L1781.26 416.385L1770.26 226.385L1768.27 226.5Z" fill={RED}/>
        </svg>
      </svg>
    ),
    '헤드앤숄더': (
      <svg width="100" height="70" viewBox="-5 45 415 370" fill="none">
        <line x1="0" y1="304" x2="400" y2="304" stroke={GRAY} strokeWidth={SW*5} strokeDasharray="12 8"/>
        <path d="M11.5 382.5L13.4587 382.905L54.4587 184.405L52.5 184L50.5413 183.596L9.54134 382.096L11.5 382.5ZM52.5 184L50.7967 185.049L94.7967 256.549L96.5 255.5L98.2033 254.452L54.2033 182.952L52.5 184ZM96.5 255.5L98.2751 256.422L200.275 59.9217L198.5 59.0003L196.725 58.0789L94.7249 254.579L96.5 255.5ZM198.5 59.0003L196.681 59.8326L291.181 266.333L293 265.5L294.819 264.668L200.319 58.1681L198.5 59.0003ZM293 265.5L294.917 266.071L343.917 101.571L342 101L340.083 100.429L291.083 264.929L293 265.5ZM342 101L340.017 101.259L379.017 400.759L381 400.5L382.983 400.242L343.983 100.742L342 101Z" fill={RED} strokeWidth={SW*5}/>
      </svg>
    ),
    '역헤드앤숄더': (
      <svg width="100" height="70" viewBox="525 -5 385 410" fill="none">
        <line x1="526" y1="71.0003" x2="901" y2="71.0003" stroke={GRAY} strokeWidth={SW*5} strokeDasharray="12 8"/>
        <path d="M550 12.0003L548.064 12.5006L610.064 252.501L612 252L613.936 251.5L551.936 11.5001L550 12.0003ZM612 252L613.838 252.789L656.338 153.789L654.5 153L652.662 152.211L610.162 251.211L612 252ZM654.5 153L652.57 153.527L715.57 384.527L717.5 384L719.43 383.474L656.43 152.474L654.5 153ZM717.5 384L719.416 384.572L802.416 106.572L800.5 106L798.584 105.428L715.584 383.428L717.5 384ZM800.5 106L798.603 106.633L829.603 199.633L831.5 199L833.397 198.368L802.397 105.368L800.5 106ZM831.5 199L833.437 199.497L883.937 2.49695L882 2.00031L880.063 1.50368L829.563 198.504L831.5 199Z" fill={GREEN} strokeWidth={SW*5}/>
      </svg>
    ),
    '더블탑': (
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
        <polyline points="4,58 16,22 28,58 40,22 52,58" fill="none" stroke={RED} strokeWidth={SW}/>
        <line x1="4" y1="22" x2="52" y2="22" stroke={RED} strokeWidth={SW} strokeDasharray="4 3" opacity="0.7"/>
      </svg>
    ),
    '더블바텀': (
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
        <polyline points="4,12 16,48 28,12 40,48 52,12" fill="none" stroke={GREEN} strokeWidth={SW}/>
        <line x1="4" y1="48" x2="52" y2="48" stroke={GREEN} strokeWidth={SW} strokeDasharray="4 3" opacity="0.7"/>
      </svg>
    ),
    '아담과 이브': (
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
        <polyline points="8,20 14,58 20,20" fill="none" stroke={GREEN} strokeWidth={SW}/>
        <path d="M30 22 Q42 62 54 22" fill="none" stroke={GREEN} strokeWidth={SW}/>
        <line x1="8" y1="22" x2="54" y2="22" stroke={GREEN} strokeWidth={SW} strokeDasharray="3 2" opacity="0.5"/>
      </svg>
    ),
    '컵앤핸들': (
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
        <line x1="4" y1="12" x2="76" y2="12" stroke={GRAY} strokeWidth={SW} strokeDasharray="3 2"/>
        <path d="M4 12 Q26 56 48 12" fill="none" stroke={GREEN} strokeWidth={SW}/>
        <polyline points="48,12 56,24 64,16" fill="none" stroke={GREEN} strokeWidth={SW}/>
      </svg>
    ),
    '불 플래그': (
      <svg width="105" height="80" viewBox="-5 -5 425 410" fill="none">
        <line x1="374.215" y1="134.591" x2="95.2148" y2="134.591" stroke={GRAY} strokeWidth={SW*5}/>
        <line x1="374.215" y1="192.591" x2="95.2148" y2="192.591" stroke={GRAY} strokeWidth={SW*5} strokeDasharray="12 8"/>
        <line x1="374.215" y1="250.591" x2="95.2148" y2="250.591" stroke={GRAY} strokeWidth={SW*5}/>
        <path d="M2.71484 370.591L129.215 139.591L164.215 245.091L212.715 154.091L231.215 235.091L264.715 135.591L313.715 249.091L410.215 2.59146" stroke={GREEN} strokeWidth={SW*5} strokeLinecap="square"/>
      </svg>
    ),
    '베어 플래그': (
      <svg width="105" height="80" viewBox="625 5 300 405" fill="none">
        <line x1="914.715" y1="135.091" x2="635.715" y2="135.091" stroke={GRAY} strokeWidth={SW*5}/>
        <line x1="914.715" y1="193.091" x2="635.715" y2="193.091" stroke={GRAY} strokeWidth={SW*5} strokeDasharray="12 8"/>
        <line x1="914.715" y1="251.092" x2="635.715" y2="251.091" stroke={GRAY} strokeWidth={SW*5}/>
        <path d="M638.715 17.0915L636.754 17.4829L682.754 247.983L684.715 247.591L686.676 247.2L640.676 16.7L638.715 17.0915ZM684.715 247.591L686.588 248.291L717.588 165.291L715.715 164.591L713.841 163.892L682.841 246.892L684.715 247.591ZM715.715 164.591L714.084 165.749L749.584 215.749L751.215 214.591L752.846 213.434L717.346 163.434L715.715 164.591ZM751.215 214.591L753.068 215.343L784.068 138.843L782.215 138.091L780.361 137.34L749.361 213.84L751.215 214.591ZM782.215 138.091L780.345 138.8L821.845 248.3L823.715 247.591L825.585 246.883L784.085 137.383L782.215 138.091ZM823.715 247.591L825.595 248.274L864.095 142.274L862.215 141.591L860.335 140.909L821.835 246.909L823.715 247.591ZM862.215 141.591L860.26 142.012L915.76 400.012L917.715 399.591L919.67 399.171L864.17 141.171L862.215 141.591Z" fill={RED} strokeWidth={SW*5}/>
      </svg>
    ),
  }
  return svgs[name] || <svg width="64" height="66"><line x1="8" y1="33" x2="56" y2="33" stroke={GRAY} strokeWidth={SW}/></svg>
}

function SignalBadge({ signal }) {
  if (signal === 'up')   return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">상승</span>
  if (signal === 'down') return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">하락</span>
  if (signal === 'both') return <div className="flex gap-1"><span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">상승</span><span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">하락</span></div>
  return <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#7a7f94] border border-white/10">중립</span>
}

const CHANNELS = [
  { id:1,  cat:'평행 채널', name:'상승 채널',         signal:'up',      desc:'우상향 평행 채널 — 상승 추세 지속',                          structure:'채널 하단: 지지 / 채널 상단: 저항',                              signalText:'하단 터치 → 매수 / 상단 터치 → 매도 고려',      note:'WXY/ABC 조정이 채널 안에서 나오는 경우 많음',           keywords:['상승채널','어센딩채널','평행채널','우상향'] },
  { id:2,  cat:'평행 채널', name:'하락 채널',         signal:'down',    desc:'우하향 평행 채널 — 하락 추세 지속',                          structure:'채널 상단: 저항 / 채널 하단: 지지',                              signalText:'상단 터치 → 매도 / 하단 이탈 → 추가 하락',      note:'채널 상단 돌파 시 추세 전환 신호',                     keywords:['하락채널','디센딩채널','우하향'] },
  { id:3,  cat:'평행 채널', name:'횡보 채널',         signal:'neutral', desc:'수평 평행 채널 — 방향성 없는 구간',                          structure:'수평 지지선 + 수평 저항선',                                       signalText:'지지/저항 반복 — 돌파 방향으로 추세 시작',       note:'WXY 기간 조정에서 자주 출현',                           keywords:['횡보채널','박스권','수평채널'] },
  { id:4,  cat:'수렴 패턴', name:'어센딩 트라이앵글', signal:'up',      desc:'수평 저항 + 상승하는 저점 — 상방 돌파 우세',                 structure:'수평 저항선 + 상승하는 저점',                                     signalText:'저항 돌파 시 강한 상승',                         note:'저점이 높아질수록 매수세 강화 / 수렴 중 거래량 감소 → 돌파 시 폭발', keywords:['어센딩트라이앵글','상승삼각형','ascending triangle'] },
  { id:5,  cat:'수렴 패턴', name:'디센딩 트라이앵글', signal:'down',    desc:'수평 지지 + 하락하는 고점 — 하방 돌파 우세',                 structure:'수평 지지선 + 하락하는 고점',                                     signalText:'지지 이탈 시 강한 하락',                         note:'고점이 낮아질수록 매도세 강화 / 수렴 중 거래량 감소 → 돌파 시 폭발', keywords:['디센딩트라이앵글','하락삼각형','descending triangle'] },
  { id:6,  cat:'수렴 패턴', name:'대칭 삼각수렴',     signal:'neutral', desc:'고점↓ 저점↑ 반복하며 수렴 — 돌파 방향으로 추세',            structure:'하락하는 고점 + 상승하는 저점',                                   signalText:'수렴 후 어느 방향으로든 강하게 돌파',            note:'수렴 중 거래량 점진적 감소 → 돌파 시 거래량 폭발로 확인', keywords:['대칭삼각형','시메트리컬','수렴','삼각수렴'] },
  { id:7,  cat:'쐐기형',   name:'하락 쐐기',          signal:'up',      desc:'우하향으로 수렴하는 쐐기 — 상승 반전',                       structure:'하락 저점 + 더 빠르게 하락하는 고점 (수렴)',                       signalText:'저항선 돌파 시 강한 상승',                       note:'거래량과 무관 — 삼각수렴과 혼동 주의',                  keywords:['하락쐐기','폴링웨지','falling wedge','쐐기'] },
  { id:8,  cat:'쐐기형',   name:'상승 쐐기',          signal:'down',    desc:'우상향으로 수렴하는 쐐기 — 하락 반전',                       structure:'상승 고점 + 더 빠르게 상승하는 저점 (수렴)',                       signalText:'지지선 이탈 시 강한 하락',                       note:'거래량과 무관 — 삼각수렴과 혼동 주의',                  keywords:['상승쐐기','라이징웨지','rising wedge','쐐기'] },
  { id:9,  cat:'반전 패턴', name:'헤드앤숄더',         signal:'down',    desc:'세 고점 중 중앙이 가장 높음 — 하락 반전',                    structure:'왼쪽 어깨 → 머리(최고점) → 오른쪽 어깨 → 넥라인 이탈',           signalText:'넥라인 이탈 시 강한 하락',                       note:'목표값 = 넥라인 - (머리 - 넥라인)',                      keywords:['헤드앤숄더','H&S','헤숄'] },
  { id:10, cat:'반전 패턴', name:'역헤드앤숄더',       signal:'up',      desc:'세 저점 중 중앙이 가장 낮음 — 상승 반전',                    structure:'왼쪽 어깨 → 머리(최저점) → 오른쪽 어깨 → 넥라인 돌파',           signalText:'넥라인 돌파 시 강한 상승',                       note:'목표값 = 넥라인 + (넥라인 - 머리)',                      keywords:['역헤드앤숄더','역헤숄','inverse H&S'] },
  { id:11, cat:'반전 패턴', name:'더블탑',             signal:'down',    desc:'상승 추세 후 두 고점이 같은 레벨 — 하락 반전',               structure:'고점1 → 조정 → 고점2(유사 레벨) → 넥라인 이탈',                  signalText:'넥라인 이탈 시 강한 하락',                       note:'두 번째 고점이 첫 번째보다 살짝 낮을수록 신뢰도 높음',  keywords:['더블탑','이중천장','M형'] },
  { id:12, cat:'반전 패턴', name:'더블바텀',           signal:'up',      desc:'하락 추세 후 두 저점이 같은 레벨 — 상승 반전',               structure:'저점1 → 반등 → 저점2(유사 레벨) → 넥라인 돌파',                  signalText:'넥라인 돌파 시 강한 상승',                       note:'두 번째 저점이 첫 번째보다 살짝 높을수록 신뢰도 높음',  keywords:['더블바텀','이중바닥','쌍바닥','W형'] },
  { id:13, cat:'반전 패턴', name:'아담과 이브',        signal:'up',      desc:'더블바텀 변형 — 첫 저점 뾰족(아담), 두 번째 저점 둥글고 완만(이브)', structure:'아담(뾰족한 저점) → 반등 → 이브(둥근 저점) → 상승',          signalText:'이브 저점 형성 후 넥라인 돌파 시 강한 상승',     note:'이브가 아담보다 살짝 높은 경우 신뢰도 높음',            keywords:['아담이브','아담과이브','adam eve','더블바텀'] },
  { id:14, cat:'반전 패턴', name:'컵앤핸들',           signal:'up',      desc:'U자형 컵 + 소폭 눌림(핸들) 후 상승 — 강세 지속 패턴',        structure:'U자형 하락-회복(컵) → 소폭 조정(핸들) → 저항 돌파',              signalText:'핸들 구간 이후 저항 돌파 시 강한 상승',          note:'컵이 깊을수록, 핸들이 얕을수록 신뢰도 높음',            keywords:['컵앤핸들','cup and handle','컵핸들'] },
  { id:15, cat:'지속 패턴', name:'불 플래그',          signal:'up',      desc:'강한 상승(깃대) 후 소폭 하락 조정(깃발) — 상승 지속',        structure:'장대양봉 급등(폴) → 평행 하락 채널(플래그) → 돌파',               signalText:'플래그 상단 돌파 시 강한 상승 재개',             note:'폴이 길고 강할수록 신뢰도 높음',                        keywords:['불플래그','bull flag','상승플래그','깃발패턴'] },
  { id:16, cat:'지속 패턴', name:'베어 플래그',        signal:'down',    desc:'강한 하락(깃대) 후 소폭 반등 조정(깃발) — 하락 지속',        structure:'장대음봉 급락(폴) → 평행 상승 채널(플래그) → 이탈',               signalText:'플래그 하단 이탈 시 강한 하락 재개',             note:'폴이 길고 강할수록 신뢰도 높음',                        keywords:['베어플래그','bear flag','하락플래그','깃발패턴'] },
]

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
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.keywords.map(k => (
            <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark ? 'bg-white/5 border-white/10 text-[#7a7f94]' : 'bg-black/5 border-black/10 text-gray-500'}`}>{k}</span>
          ))}
        </div>
        <ChartNote page="channel" section={`channel_${item.id}`} />
      </div>
    </div>
  )
}

/* ── 쐐기형 모달 ── */
function WedgeModal({ item, onClose }) {
  const { dark } = useTheme()
  const bgC   = dark ? 'bg-[#13161e] border-white/15' : 'bg-white border-black/15'
  const muted = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const rowBg = dark ? 'bg-[#0d0f14]'   : 'bg-gray-50'
  const divC  = dark ? 'border-white/8'  : 'border-black/8'

  const isDown = item.name === '하락 쐐기'
  const variants = isDown
    ? [
        { label:'상승 중 하락', viewBox:'34 58 480 350',  color:GREEN, desc:'상승 추세 중 나타나는 조정 구간 — 쐐기 돌파 후 상승 재개',    signal:'저항선 상방 돌파 → 상승 재개',
          path: <><line x1="89.8782" y1="58.8371" x2="441.878" y2="293.837" stroke={GREEN} strokeWidth="6"/><line x1="34.3841" y1="250.598" x2="426.384" y2="377.598" stroke={GREEN} strokeWidth="6"/><path d="M142.268 94.0005H144.268L140.5 93.065L142.268 94.0005ZM142.268 282H140.268V287.634L143.82 283.262L142.268 282ZM239.768 162H241.768V156.367L238.215 160.739L239.768 162ZM239.768 319H237.768V323.579L241.127 320.468L239.768 319ZM341.268 225L343.253 225.246L343.923 219.815L339.909 223.533L341.268 225ZM326.268 346.5L324.283 346.255L327.971 347.548L326.268 346.5ZM433.713 174.537C433.457 173.462 432.379 172.799 431.304 173.055L413.794 177.227C412.72 177.483 412.056 178.562 412.312 179.636C412.568 180.711 413.647 181.374 414.721 181.118L430.286 177.41L433.994 192.974C434.25 194.048 435.329 194.712 436.403 194.456C437.478 194.2 438.141 193.121 437.885 192.047L433.713 174.537ZM1.7677 359.5L3.53544 360.436L144.035 94.936L142.268 94.0005L140.5 93.065L-3.75509e-05 358.565L1.7677 359.5ZM142.268 94.0005H140.268V282H142.268H144.268V94.0005H142.268ZM142.268 282L143.82 283.262L241.32 163.262L239.768 162L238.215 160.739L140.715 280.739L142.268 282ZM239.768 162H237.768V319H239.768H241.768V162H239.768ZM239.768 319L241.127 320.468L342.627 226.468L341.268 225L339.909 223.533L238.409 317.533L239.768 319ZM341.268 225L339.283 224.755L324.283 346.255L326.268 346.5L328.253 346.746L343.253 225.246L341.268 225ZM326.268 346.5L327.971 347.548L433.471 176.048L431.768 175L430.064 173.953L324.564 345.453L326.268 346.5Z" fill={GREEN}/></> },
        { label:'하락 중 하락', viewBox:'955 40 450 430',  color:GREEN, desc:'하락 추세 중 나타나는 하락 쐐기 — 강한 상승 반전 신호',       signal:'저항선 상방 돌파 → 강한 상승 반전',
          path: <><line x1="974.74" y1="172.571" x2="1376.74" y2="62.5714" stroke={GREEN} strokeWidth="6"/><line x1="995.248" y1="377.78" x2="1395.25" y2="140.78" stroke={GREEN} strokeWidth="6"/><path d="M1034.27 453.5L1036.26 453.716L1069.26 149.716L1067.27 149.5L1065.28 149.285L1032.28 453.285L1034.27 453.5ZM1067.27 149.5L1065.68 150.715L1161.18 275.715L1162.77 274.5L1164.36 273.286L1068.86 148.286L1067.27 149.5ZM1162.77 274.5L1164.61 275.285L1235.61 108.785L1233.77 108L1231.93 107.216L1160.93 273.716L1162.77 274.5ZM1233.77 108L1231.87 108.625L1267.37 216.625L1269.27 216L1271.17 215.376L1235.67 107.376L1233.77 108ZM1269.27 216L1271.16 216.646L1344.16 2.6462L1342.27 2.00049L1340.37 1.35478L1267.37 215.355L1269.27 216Z" fill={GREEN}/></> },
      ]
    : [
        { label:'상승 중 상승', viewBox:'470 50 440 380',  color:RED,   desc:'상승 추세 중 나타나는 상승 쐐기 — 추세 소진 후 하락 반전',   signal:'지지선 하방 이탈 → 하락 반전',
          path: <><line x1="490.74" y1="203.571" x2="892.74" y2="93.5714" stroke={RED} strokeWidth="6"/><line x1="511.248" y1="408.78" x2="911.248" y2="171.78" stroke={RED} strokeWidth="6"/><path d="M572.768 374L574.749 374.276L602.749 173.276L600.768 173L598.787 172.725L570.787 373.725L572.768 374ZM600.768 173L599.048 174.021L680.048 310.521L681.768 309.5L683.488 308.48L602.488 171.98L600.768 173ZM681.768 309.5L683.738 309.843L713.238 140.343L711.268 140L709.297 139.658L679.797 309.158L681.768 309.5ZM711.268 140L709.463 140.862L766.463 260.362L768.268 259.5L770.073 258.639L713.073 139.139L711.268 140ZM768.268 259.5L770.215 259.957L801.715 125.457L799.768 125L797.82 124.544L766.32 259.044L768.268 259.5ZM799.768 125L797.958 125.852L873.458 286.352L875.268 285.5L877.077 284.649L801.577 124.149L799.768 125Z" fill={RED}/></> },
        { label:'하락 중 상승', viewBox:'1450 0 450 456', color:RED,   desc:'하락 추세 중 나타나는 반등 쐐기 — 하락 지속 신호',            signal:'지지선 하방 이탈 → 하락 재개',
          path: <><line x1="1532.88" y1="62.8371" x2="1884.88" y2="297.837" stroke={RED} strokeWidth="6"/><line x1="1477.38" y1="254.598" x2="1869.38" y2="381.598" stroke={RED} strokeWidth="6"/><path d="M1567.27 2.00049H1565.27V276.5H1567.27H1569.27V2.00049H1567.27ZM1567.27 276.5L1568.78 277.811L1669.78 161.311L1668.27 160L1666.76 158.69L1565.76 275.19L1567.27 276.5ZM1668.27 160L1666.29 160.277L1689.29 324.777L1691.27 324.5L1693.25 324.224L1670.25 159.724L1668.27 160ZM1691.27 324.5L1692.84 325.736L1769.84 227.736L1768.27 226.5L1766.7 225.265L1689.7 323.265L1691.27 324.5ZM1768.27 226.5L1766.27 226.616L1777.27 416.616L1779.27 416.5L1781.26 416.385L1770.26 226.385L1768.27 226.5Z" fill={RED}/></> },
      ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.6)'}} onClick={onClose}>
      <div className={`w-full max-w-lg rounded-2xl border p-6 ${bgC} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${muted}`}>쐐기형</span>
              <SignalBadge signal={item.signal} />
            </div>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${muted} ${dark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>✕</button>
        </div>
        {variants.map((v, i) => (
          <div key={v.label}>
            <p className="text-xs font-semibold mb-2" style={{ color: v.color }}>{v.label}</p>
            <div className={`flex gap-4 p-4 rounded-xl mb-2 ${rowBg}`}>
              <div className="shrink-0 flex items-center">
                <svg width="100" height="80" viewBox={v.viewBox} fill="none">{v.path}</svg>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2 text-xs"><span className={`${muted} min-w-[28px] shrink-0`}>설명</span><span>{v.desc}</span></div>
                <div className="flex gap-2 text-xs"><span className={`${muted} min-w-[28px] shrink-0`}>신호</span><span>{v.signal}</span></div>
                <div className="flex gap-2 text-xs"><span className={`${muted} min-w-[28px] shrink-0`}>참고</span><span className={muted}>거래량과 무관 — 삼각수렴과 혼동 주의</span></div>
              </div>
            </div>
            {i === 0 && <div className={`border-t ${divC} my-4`} />}
          </div>
        ))}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-2">
          {item.keywords.map(k => (
            <span key={k} className={`text-xs px-2 py-0.5 rounded-full border ${dark ? 'bg-white/5 border-white/10 text-[#7a7f94]' : 'bg-black/5 border-black/10 text-gray-500'}`}>{k}</span>
          ))}
        </div>
        <ChartNote page="channel" section={`wedge_${item.id}`} />
      </div>
    </div>
  )
}

/* ── 섹션 헤더 ── */
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
export default function ChannelPatterns() {
  const { dark } = useTheme()
  const { query, setQuery, filtered } = usePageSearch(CHANNELS, ['name','desc','keywords','signalText'])
  const [selected, setSelected] = useState(null)
  const muted  = dark ? 'text-[#7a7f94]' : 'text-gray-500'
  const cardBg = dark ? 'bg-[#13161e] border-white/8 hover:border-white/20' : 'bg-white border-black/8 hover:border-black/20'
  const CATS   = ['평행 채널', '수렴 패턴', '쐐기형', '반전 패턴', '지속 패턴']

  const renderCard = (item) => (
    <button key={item.id} onClick={() => setSelected(item)}
      className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${cardBg}`}>
      <ChannelSVG name={item.name} />
      <span className="text-sm font-medium text-center">{item.name}</span>
      <SignalBadge signal={item.signal} />
    </button>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">채널 패턴</h1>
        <p className={`text-sm ${muted}`}>평행 채널 · 수렴 패턴 · 쐐기형 · 반전 패턴 · 지속 패턴 — 클릭하면 상세 보기</p>
      </div>

      <PageSearch query={query} setQuery={setQuery} placeholder="채널 패턴 검색... (예: 쐐기, 컵앤핸들, 불플래그)" />
      {query && <p className={`text-xs mb-4 ${muted}`}>{filtered.length}개 결과</p>}

      {!query && CATS.map((cat, si) => (
        <section key={cat} className="mb-10">
          <SectionHeader label={cat} index={si} dark={dark} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CHANNELS.filter(c => c.cat === cat).map(renderCard)}
          </div>
        </section>
      ))}

      {query && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.length === 0
            ? <p className={`text-sm col-span-4 ${muted}`}>검색 결과 없음</p>
            : filtered.map(renderCard)
          }
        </div>
      )}

      {selected && ['하락 쐐기','상승 쐐기'].includes(selected.name) && <WedgeModal item={selected} onClose={() => setSelected(null)} />}
      {selected && !['하락 쐐기','상승 쐐기'].includes(selected.name) && <Modal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
