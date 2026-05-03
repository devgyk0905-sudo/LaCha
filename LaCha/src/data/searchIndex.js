export const allSearchData = [
  // 개념/용어
  { category: '용어', title: '이동평균선 (MA)', path: '/', desc: '일정 기간 가격의 평균을 이은 선', keywords: ['이평선', 'EMA', 'SMA', '이동평균'] },
  { category: '용어', title: '골든크로스', path: '/', desc: '단기 MA가 장기 MA를 상향 돌파', keywords: ['골크', '골든크로스'] },
  { category: '용어', title: '데드크로스', path: '/', desc: '단기 MA가 장기 MA를 하향 돌파', keywords: ['데크', '데드크로스'] },
  { category: '용어', title: '정배열', path: '/', desc: '단기~장기 이평선이 위에서 아래로 순서대로 정렬', keywords: ['정배열', '역배열'] },
  { category: '용어', title: 'RSI', path: '/', desc: '상대강도지수 — 과매수/과매도 판단 지표', keywords: ['RSI', '다이버전스', '과매수', '과매도'] },
  { category: '용어', title: '다이버전스', path: '/', desc: '가격과 RSI의 방향이 반대로 움직이는 현상', keywords: ['다이버전스', 'Bear', 'Bull', '베어', '불'] },
  { category: '용어', title: '피보나치 되돌림', path: '/', desc: '추세 방향의 되돌림 구간 측정', keywords: ['피보나치', '되돌림', '0.382', '0.618'] },
  { category: '용어', title: '피보나치 확장', path: '/', desc: '파동 목표 구간 측정', keywords: ['피보나치', '확장', '1.618', '1.272'] },
  { category: '용어', title: '지지', path: '/', desc: '하락을 막는 가격대', keywords: ['지지', '저항', '지지선'] },
  { category: '용어', title: '저항', path: '/', desc: '상승을 막는 가격대', keywords: ['저항', '지지', '저항선'] },
  { category: '용어', title: '매물대', path: '/', desc: '과거에 거래가 많이 몰린 가격대 — 공급존', keywords: ['매물대', '공급존', '수요존'] },
  { category: '용어', title: '갭', path: '/', desc: '전 캔들 종가와 현 캔들 시가 사이의 빈 공간', keywords: ['갭', '갭업', '갭다운', '갭 메우기'] },

  // 파동
  { category: '파동', title: '12345 충격파동', path: '/wave', desc: '추세 방향의 5파동 구조', keywords: ['충격파동', '임펄스', '12345'] },
  { category: '파동', title: 'ABC 단순조정', path: '/wave', desc: '3파동 가격 조정', keywords: ['ABC', '조정', '플랫'] },
  { category: '파동', title: 'WXY 복합조정', path: '/wave', desc: '2단 복합 기간 조정', keywords: ['WXY', '복합조정', '기간조정'] },
  { category: '파동', title: 'WXYXZ 복합조정', path: '/wave', desc: '3단 복합 기간 조정', keywords: ['WXYXZ', '삼중복합'] },
  { category: '파동', title: '임펄스 마무리', path: '/wave', desc: 'Y/C파 마무리 — 겹침 없는 5파동', keywords: ['임펄스', '마무리', '5파동'] },
  { category: '파동', title: '터미널 마무리', path: '/wave', desc: 'Y/C파 마무리 — 쐐기형 수렴 5파동', keywords: ['터미널', '다이아고날', '쐐기'] },
  { category: '파동', title: '삼각수렴 마무리', path: '/wave', desc: 'Y파 마무리 — ABCDE 수렴', keywords: ['삼각수렴', 'ABCDE', '수렴'] },
  { category: '파동', title: '기본 플랫', path: '/wave', desc: 'B파 0.382~0.5 되돌림', keywords: ['플랫', '기본플랫'] },
  { category: '파동', title: '불규칙 플랫', path: '/wave', desc: 'B파가 A 시작점 돌파 (Expanded)', keywords: ['불규칙플랫', '익스팬디드', 'expanded'] },
  { category: '파동', title: '미달형 플랫', path: '/wave', desc: 'C파가 A 저점 미이탈 (Running)', keywords: ['미달형', '러닝플랫', 'running'] },

  // 캔들
  { category: '캔들', title: '도지', path: '/candle', desc: '시가=종가 — 방향성 불확실', keywords: ['도지', '방향탐색'] },
  { category: '캔들', title: '망치형', path: '/candle', desc: '아래꼬리 긴 캔들 — 하단 지지 신호', keywords: ['망치', '해머', '하단지지'] },
  { category: '캔들', title: '역망치형', path: '/candle', desc: '위꼬리 긴 캔들 — 상단 저항 신호', keywords: ['역망치', '슈팅스타', '상단저항'] },
  { category: '캔들', title: '모닝스타', path: '/candle', desc: '바닥 반전 3봉 패턴', keywords: ['모닝스타', '바닥반전', '상승전환'] },
  { category: '캔들', title: '이브닝스타', path: '/candle', desc: '고점 반전 3봉 패턴', keywords: ['이브닝스타', '고점반전', '하락전환'] },
  { category: '캔들', title: '백삼병', path: '/candle', desc: '연속 3개 양봉 — 상승 신호', keywords: ['백삼병', '쓰리화이트솔저', '연속양봉'] },
  { category: '캔들', title: '흑삼병', path: '/candle', desc: '연속 3개 음봉 — 하락 신호', keywords: ['흑삼병', '쓰리블랙크로우', '연속음봉'] },
  { category: '캔들', title: '슈팅스타', path: '/candle', desc: '고점에서 나오는 역망치 음봉', keywords: ['슈팅스타', '고점', '하락신호'] },

  // 채널
  { category: '채널', title: '상승 채널', path: '/channel', desc: '우상향 평행 채널', keywords: ['상승채널', '어센딩채널', '평행채널'] },
  { category: '채널', title: '하락 채널', path: '/channel', desc: '우하향 평행 채널', keywords: ['하락채널', '디센딩채널'] },
  { category: '채널', title: '쐐기형', path: '/channel', desc: '수렴하는 추세선 — 상승쐐기/하락쐐기', keywords: ['쐐기', '웨지', '수렴'] },
  { category: '채널', title: '대칭 삼각형', path: '/channel', desc: '고점↓ 저점↑ 수렴 — 방향 돌파 대기', keywords: ['대칭삼각형', '시메트리컬', '수렴'] },
  { category: '채널', title: '상승 삼각형', path: '/channel', desc: '수평 저항 + 고점↑ — 상방 돌파 우세', keywords: ['상승삼각형', '어센딩트라이앵글'] },
  { category: '채널', title: '하락 삼각형', path: '/channel', desc: '수평 지지 + 저점↓ — 하방 돌파 우세', keywords: ['하락삼각형', '디센딩트라이앵글'] },
]
