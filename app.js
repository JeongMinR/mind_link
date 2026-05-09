/* ==========================================
   MindGuard - 온디바이스 AI 멘탈 헬스 앱
   SPA (Single Page Application)
   ========================================== */

// ──── PHQ-7 데이터 ────
const QUESTIONS = [
  { text: '지난 2주 동안, 일이나 공부에 흥미나 즐거움을 느끼는 것이 어려웠나요?', hint: '무언가를 할 때의 재미나 흥미 정도를 생각해보세요.' },
  { text: '지난 2주 동안, 기분이 처지거나, 우울하거나, 희망이 없다고 느껴졌나요?', hint: '전반적인 기분을 평가해주세요.' },
  { text: '지난 2주 동안, 잠을 들기가 어렵거나, 자주 깨거나, 너무 많이 자나요?', hint: '수면의 질과 양 모두를 고려해주세요.' },
  { text: '지난 2주 동안, 피곤함이나 에너지 부족을 느껴졌나요?', hint: '충분히 쉬었는데도 피곤하면 해당됩니다.' },
  { text: '지난 2주 동안, 식욕이 줄었거나 늘었나요?', hint: '평소보다 달라진 식욕을 생각해보세요.' },
  { text: '지난 2주 동안, 자신을 나쁜 사람이라고 생각하거나 자신을 실망시켰다고 느껴졌나요?', hint: '자신에 대한 평가를 생각해보세요.' },
  { text: '지난 2주 동안, 일이나 공부에 집중하기가 어려웠나요?', hint: '집중력 저하로 인한 어려움을 평가해주세요.' },
];

const OPTIONS = [
  { label: '전혀 없음', score: 0 },
  { label: '2~3일', score: 1 },
  { label: '7일 이상', score: 2 },
  { label: '거의 매일', score: 3 },
];

const RESOURCES = {
  normal: [
    { icon: '🏫', bg: 'rgba(129,100,248,.15)', name: '경북대 학생상담센터', desc: '정기 상담 · 053-950-2124 · 무료' },
    { icon: '💻', bg: 'rgba(45,212,191,.15)', name: '마음이음 온라인 상담', desc: '익명 채팅 · 24시간 운영 · 무료' },
  ],
  caution: [
    { icon: '🏫', bg: 'rgba(129,100,248,.15)', name: '경북대 학생상담센터', desc: '우선 예약 · 053-950-2124 · 무료' },
    { icon: '🌐', bg: 'rgba(245,158,11,.15)', name: '대구청년센터 심리지원', desc: '심리검사 · 동구 신천동 · 무료' },
  ],
  serious: [
    { icon: '📞', bg: 'rgba(239,68,68,.15)', name: '자살예방 상담전화', desc: '24시간 · 1393 · 익명' },
    { icon: '🏥', bg: 'rgba(239,68,68,.12)', name: '대구시 정신건강복지센터', desc: '24시간 위기상담 · 1577-0199' },
    { icon: '🏫', bg: 'rgba(245,158,11,.15)', name: '경북대 학생상담센터', desc: '긴급 상담 · 053-950-2124' },
  ],
  critical: [
    { icon: '📞', bg: 'rgba(239,68,68,.15)', name: '자살예방 상담전화', desc: '24시간 · 1393 · 지금 전화' },
    { icon: '🚨', bg: 'rgba(239,68,68,.12)', name: '정신건강위기상담', desc: '24시간 · 1577-0199 · 대구' },
    { icon: '🏥', bg: 'rgba(239,68,68,.15)', name: '경북대 응급의료센터', desc: '정신과 긴급 진료 · 053-200-2114' },
  ]
};

const APP_DATA = [
  { name: '유튜브', category: '영상 콘텐츠', icon: '▶️', iconBg: 'rgba(239,68,68,.15)', today: 180, avg: 60, unit: '분', color: '#ef4444', signal: 'high', insight: '영상 콘텐츠 과다 소비는 회피 행동의 신호입니다.' },
  { name: '전화 통화', category: '사회적 소통', icon: '📞', iconBg: 'rgba(34,197,94,.15)', today: 5, avg: 25, unit: '분', color: '#818cf8', signal: 'low', insight: '통화 시간 급감은 사회적 위축의 신호입니다.' },
  { name: '카카오톡', category: '메시지·소통', icon: '💬', iconBg: 'rgba(245,158,11,.15)', today: 35, avg: 60, unit: '분', color: '#f59e0b', signal: 'low', insight: '메시지 응답 시간 증가는 대인관계 에너지 저하를 나타냅니다.' },
  { name: '넷플릭스', category: '영상 콘텐츠', icon: '🎬', iconBg: 'rgba(239,68,68,.1)', today: 120, avg: 45, unit: '분', color: '#ef4444', signal: 'high', insight: '심야 영상물 시청 증가는 수면 질 저하와 연관됩니다.' },
  { name: '인스타그램', category: '소셜 미디어', icon: '📷', iconBg: 'rgba(236,72,153,.15)', today: 15, avg: 50, unit: '분', color: '#ec4899', signal: 'low', insight: '소셜 미디어 소비 급감은 자존감 저하와 연관될 수 있습니다.' },
  { name: '공부 앱', category: '학습', icon: '📚', iconBg: 'rgba(129,100,248,.15)', today: 30, avg: 90, unit: '분', color: '#818cf8', signal: 'low', insight: '공부 시간 감소는 집중력 저하 또는 동기 부재를 나타냅니다.' },
];

// ──── 상태 변수 ────
let currentQuestion = 0;
let answers = new Array(7).fill(null);

// ──── 파티클 생성 ────
function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['#2dd4bf', '#0ea5e9', '#818cf8', '#f472b6'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = 2 + Math.random() * 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const op = (0.15 + Math.random() * 0.3).toFixed(2);
    el.style.cssText = `width:${size}px;height:${size}px;background:${color};top:${5 + Math.random() * 90}%;left:${5 + Math.random() * 90}%;--dur:${(6 + Math.random() * 10).toFixed(1)}s;--delay:${(Math.random() * 6).toFixed(1)}s;--op:${op};`;
    container.appendChild(el);
  }
}

// ──── 화면 전환 ────
function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  if (screenName === 'splash') {
    document.getElementById('splashScreen').classList.add('active');
  } else if (screenName === 'check') {
    document.getElementById('checkScreen').classList.add('active');
    initCheckScreen();
  } else if (screenName === 'pattern') {
    document.getElementById('patternScreen').classList.add('active');
    initPatternScreen();
  }
}

// ──── CHECK 화면 초기화 ────
function initCheckScreen() {
  currentQuestion = 0;
  answers = new Array(7).fill(null);
  document.getElementById('questionWrapper').style.display = '';
  document.getElementById('resultCheckScreen').style.display = 'none';
  renderQuestion();
}

// ──── 질문 렌더 ────
function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  const pct = Math.round(((currentQuestion + 1) / 7) * 100);

  document.getElementById('progressLabel').textContent = `${currentQuestion + 1} / 7`;
  document.getElementById('progressPct').textContent = `${pct}%`;
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('qNum').textContent = `Q${currentQuestion + 1}`;
  document.getElementById('qText').textContent = q.text;
  document.getElementById('qHint').textContent = q.hint;

  const cont = document.getElementById('optionsContainer');
  cont.innerHTML = '';
  const opts = document.createElement('div');
  opts.className = 'options';
  OPTIONS.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt' + (answers[currentQuestion] === i ? ' selected' : '');
    btn.innerHTML = `<span class="opt-circle">${answers[currentQuestion] === i ? '✓' : ''}</span>${opt.label}<span class="opt-score">${opt.score}점</span>`;
    btn.onclick = () => selectQuestion(i);
    opts.appendChild(btn);
  });
  cont.appendChild(opts);

  renderDots();
  document.getElementById('prevBtn').disabled = currentQuestion === 0;
  document.getElementById('nextBtn').disabled = answers[currentQuestion] === null;
  document.getElementById('nextBtn').textContent = currentQuestion === 6 ? '결과 보기 →' : '다음 →';
}

function renderDots() {
  const cont = document.getElementById('stepDots');
  cont.innerHTML = QUESTIONS.map((_, i) =>
    `<div class="step-dot ${i < currentQuestion ? 'done' : i === currentQuestion ? 'active' : ''}" id="dot${i}"></div>`
  ).join('');
}

function selectQuestion(i) {
  answers[currentQuestion] = i;
  renderQuestion();
  document.getElementById('nextBtn').disabled = false;
}

function prevQuestion() {
  if (currentQuestion > 0) { currentQuestion--; renderQuestion(); }
}

function nextQuestion() {
  if (answers[currentQuestion] === null) return;
  if (currentQuestion < 6) { currentQuestion++; renderQuestion(); }
  else showCheckResult();
}

// ──── CHECK 결과 ────
function showCheckResult() {
  document.getElementById('questionWrapper').style.display = 'none';
  document.getElementById('resultCheckScreen').style.display = 'flex';

  const totalScore = answers.reduce((a, b) => a + OPTIONS[b].score, 0);
  const healthScore = Math.round((1 - totalScore / 21) * 100);

  setTimeout(() => {
    document.getElementById('ringScore').textContent = healthScore;
    document.getElementById('resultCircle').style.strokeDashoffset = 390 * (1 - healthScore / 100);
  }, 200);

  let level, desc, risk, levelColor;
  if (totalScore <= 4) {
    level = '✅ 정상'; risk = 'normal'; levelColor = 'var(--safe)';
    desc = '현재 정신건강 상태가 양호합니다. 규칙적인 자기관리로 건강한 상태를 유지하세요.';
  } else if (totalScore <= 9) {
    level = '⚠️ 주의'; risk = 'caution'; levelColor = 'var(--warn)';
    desc = '경미한 우울 증상이 감지됩니다. 지금이 상담 받기 좋은 시기입니다.';
  } else if (totalScore <= 14) {
    level = '🔴 심각'; risk = 'serious'; levelColor = 'var(--danger)';
    desc = '중등도 우울 증상이 감지되었습니다. 전문가 상담을 강력히 권장합니다.';
  } else {
    level = '🚨 응급'; risk = 'critical'; levelColor = '#ff0000';
    desc = '심각한 우울 증상이 감지되었습니다. 즉시 전문 기관에 연락하세요. 당신은 혼자가 아닙니다.';
  }

  const chip = document.getElementById('resultLevelChip');
  chip.textContent = level;
  chip.style.color = levelColor;
  document.getElementById('resultDesc').textContent = desc;

  const aiTexts = {
    normal: `당신의 답변을 분석한 결과, <strong>정신건강 상태가 안정적</strong>입니다. 현재 수준을 유지하기 위해 규칙적인 운동, 충분한 수면, 사회활동을 권장합니다.`,
    caution: `<strong>경미한 우울 증상</strong>이 감지되었습니다. 이 단계에서 상담을 받으면 증상 악화를 예방할 수 있습니다. 대구 지역 상담센터에 문의해보세요.`,
    serious: `<strong>중등도 우울 증상</strong>이 나타나고 있습니다. 전문가의 도움이 필요한 상태입니다. 아래 상담 기관 중 가장 가까운 곳에 즉시 연락하시기 바랍니다.`,
    critical: `<strong>심각한 우울 증상</strong>이 나타나고 있습니다. 즉시 전문가의 도움이 필요합니다. 아래의 위기상담 전화로 지금 바로 연락하세요. 24시간 언제든 도움을 받을 수 있습니다.`,
  };

  document.getElementById('aiBox').style.display = 'block';
  document.getElementById('aiBody').innerHTML = aiTexts[risk];

  document.getElementById('resourceCards').innerHTML = RESOURCES[risk]
    .map(r => `<div class="res-card"><div class="res-icon" style="background:${r.bg}">${r.icon}</div><div><div class="res-name">${r.name}</div><div class="res-desc">${r.desc}</div></div><div class="res-arrow">›</div></div>`)
    .join('');
}

function restartCheck() {
  initCheckScreen();
}

// ──── PATTERN 화면 ────
function initPatternScreen() {
  const highSignalApps = APP_DATA.filter(a => a.signal === 'high').length;
  const lowSignalApps = APP_DATA.filter(a => a.signal === 'low').length;
  
  let riskScore = 0;
  let riskLevel = 'normal';

  APP_DATA.forEach(app => {
    if (app.signal === 'high') riskScore += 25;
    else if (app.signal === 'low') riskScore += 15;
  });

  if (riskScore <= 35) riskLevel = 'normal';
  else if (riskScore <= 60) { riskLevel = 'caution'; riskScore = 55; }
  else if (riskScore <= 85) { riskLevel = 'serious'; riskScore = 72; }
  else { riskLevel = 'critical'; riskScore = 90; }

  const banner = document.getElementById('riskBanner');
  banner.className = `risk-banner risk-${riskLevel === 'normal' ? 'low' : riskLevel === 'caution' ? 'mid' : 'high'} fade-up d2`;

  const levelTexts = {
    normal: { icon: '✅', title: '건강한 사용 패턴', desc: '현재 앱 사용 패턴이 건강한 범위 내입니다. 이 상태를 유지하세요.' },
    caution: { icon: '⚠️', title: '주의 필요한 패턴', desc: '회피성 콘텐츠 소비와 사회적 상호작용 감소가 감지됩니다.' },
    serious: { icon: '🔴', title: '심각한 행동 변화', desc: '복수의 경고 신호가 감지되었습니다. 전문가 상담을 권장합니다.' },
    critical: { icon: '🚨', title: '긴급 개입 필요', desc: '극단적인 행동 변화가 감지되었습니다. 즉시 도움을 받으세요.' },
  };

  const lt = levelTexts[riskLevel];
  document.getElementById('riskTitle').textContent = `${lt.icon} ${lt.title}`;
  document.getElementById('riskDesc').textContent = lt.desc;
  document.getElementById('riskScorePill').textContent = `위험도 지수 ${riskScore} / 100`;
  
  const totalScreenTime = APP_DATA.reduce((a, b) => a + b.today, 0);
  const totalAvg = APP_DATA.reduce((a, b) => a + b.avg, 0);
  const screenTimeDelta = totalScreenTime - totalAvg;

  // 앱 카드
  document.getElementById('appCards').innerHTML = APP_DATA.map(app => {
    const delta = app.today - app.avg;
    const pct = Math.round((delta / app.avg) * 100);
    const deltaStr = (delta > 0 ? '+' : '') + pct + '%';
    const deltaClass = delta > 0 ? 'delta-up' : delta < 0 ? 'delta-down' : 'delta-norm';
    const signalIcon = app.signal === 'high' ? '↑' : '↓';
    return `<div class="app-card"><div class="app-card-top"><div class="app-icon" style="background:${app.iconBg}">${app.icon}</div><div class="app-meta"><div class="app-name">${app.name}</div><div class="app-category">${app.category}</div></div><div class="app-right"><div class="app-today" style="color:${app.color}">${app.today}<span style="font-size:9px;font-weight:400;color:var(--sub)">${app.unit}</span></div><div class="app-avg">평균 ${app.avg}${app.unit}</div><div class="app-delta ${deltaClass}">${signalIcon} ${deltaStr}</div></div></div></div>`;
  }).join('');

  // 행동 지표
  document.getElementById('behaviorGrid').innerHTML = `
    <div class="beh-card"><div class="beh-label">총 스크린 타임</div><div class="beh-val" style="color:#818cf8">${totalScreenTime}분</div><div class="beh-trend" style="color:${screenTimeDelta > 0 ? 'var(--danger)' : 'var(--safe)'}">${screenTimeDelta > 0 ? '↑' : '↓'} ${Math.abs(screenTimeDelta)}분</div></div>
    <div class="beh-card"><div class="beh-label">사회적 상호작용</div><div class="beh-val" style="color:${lowSignalApps > 2 ? 'var(--danger)' : 'var(--safe)'}">${100 - lowSignalApps * 15}%</div><div class="beh-trend" style="color:${lowSignalApps > 2 ? 'var(--danger)' : 'var(--safe)'}">${lowSignalApps > 2 ? '감소 추세' : '정상 범위'}</div></div>
    <div class="beh-card"><div class="beh-label">회피성 콘텐츠</div><div class="beh-val" style="color:${highSignalApps > 1 ? 'var(--danger)' : 'var(--safe)'}">${highSignalApps}개</div><div class="beh-trend" style="color:${highSignalApps > 1 ? 'var(--danger)' : 'var(--safe)'}">${highSignalApps > 1 ? '주의 필요' : '정상'}</div></div>
    <div class="beh-card"><div class="beh-label">학습 시간</div><div class="beh-val" style="color:${APP_DATA[5].today < 50 ? 'var(--danger)' : 'var(--safe)'}">${APP_DATA[5].today}분</div><div class="beh-trend" style="color:${APP_DATA[5].today < 50 ? 'var(--danger)' : 'var(--safe)'}">평균 대비</div></div>
  `;

  // AI 분석
  const aiAnalyses = {
    normal: `앱 사용 패턴이 <strong>전반적으로 건강</strong>합니다. 콘텐츠 소비와 사회활동의 균형이 잘 맞춰져 있습니다. 현재 상태를 유지하기 위해 규칙적인 생활을 권장합니다.`,
    caution: `<strong>회피성 콘텐츠 소비</strong> (유튜브+넷플릭스) 증가와 <strong>사회적 상호작용 감소</strong> (통화+메시지)가 동시에 감지됩니다. 스트레스 관리와 대인관계 활동을 의식적으로 늘려보세요.`,
    serious: `<strong>복합 경고 신호</strong>가 감지되었습니다: 영상물 중독 패턴, 사회적 고립, 학습 능력 저하. 이러한 패턴은 우울증 초기 단계와 일치합니다. 전문가 상담이 필요합니다.`,
    critical: `<strong>극단적인 행동 변화</strong>가 나타나고 있습니다. 사실상 모든 건강 지표에서 위험 신호를 보이고 있습니다. 즉시 심리 전문가의 도움이 필요한 상태입니다.`,
  };

  document.getElementById('aiAnalysis').innerHTML = aiAnalyses[riskLevel];

  // 자원
  document.getElementById('patternResourceCards').innerHTML = RESOURCES[riskLevel]
    .map(r => `<div class="res-card"><div class="res-icon" style="background:${r.bg}">${r.icon}</div><div><div class="res-name">${r.name}</div><div class="res-desc">${r.desc}</div></div><div class="res-arrow">›</div></div>`)
    .join('');
}

// ──── 초기화 ────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  showScreen('splash');
});
