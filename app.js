'use strict';

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const SK = {
  NUTRITION: 'ft_nut', GOALS: 'ft_goals', PLANS: 'ft_plans',
  HISTORY: 'ft_hist', RUNS: 'ft_runs', SETTINGS: 'ft_settings',
  ACTIVE_WO: 'ft_active_wo', CUSTOM_EX: 'ft_custom_ex',
  SPLITS: 'ft_splits', ACTIVE_SPLIT: 'ft_active_split',
};
const DEFAULT_GOALS = { calories: 2500, protein: 150, carbs: 300, fat: 70 };
const GROUP_COLORS = {
  'Chest':'#ff6b6b','Back':'#4ecdc4','Shoulders':'#45b7d1',
  'Biceps':'#a8e6cf','Triceps':'#ffd93d','Legs':'#c9b1ff',
  'Core':'#ff9f43','Full Body':'#6c63ff','Custom':'#888',
};
const PLAN_COLORS = ['#8b5cf6','#3b82f6','#22c55e','#f59e0b','#ef4444','#ec4899','#14b8a6','#f97316'];
const EXERCISE_DB = [
  {id:'e001',name:'Barbell Bench Press',group:'Chest'},
  {id:'e002',name:'Incline Barbell Press',group:'Chest'},
  {id:'e003',name:'Decline Barbell Press',group:'Chest'},
  {id:'e004',name:'Dumbbell Bench Press',group:'Chest'},
  {id:'e005',name:'Incline Dumbbell Press',group:'Chest'},
  {id:'e006',name:'Dumbbell Fly',group:'Chest'},
  {id:'e007',name:'Cable Crossover',group:'Chest'},
  {id:'e008',name:'Push-ups',group:'Chest'},
  {id:'e009',name:'Chest Dips',group:'Chest'},
  {id:'e010',name:'Pec Deck',group:'Chest'},
  {id:'e011',name:'Conventional Deadlift',group:'Back'},
  {id:'e012',name:'Pull-ups',group:'Back'},
  {id:'e013',name:'Chin-ups',group:'Back'},
  {id:'e014',name:'Barbell Bent-over Row',group:'Back'},
  {id:'e015',name:'Dumbbell Row',group:'Back'},
  {id:'e016',name:'Lat Pulldown',group:'Back'},
  {id:'e017',name:'Seated Cable Row',group:'Back'},
  {id:'e018',name:'T-bar Row',group:'Back'},
  {id:'e019',name:'Face Pull',group:'Back'},
  {id:'e020',name:'Straight-arm Pulldown',group:'Back'},
  {id:'e021',name:'Barbell Overhead Press',group:'Shoulders'},
  {id:'e022',name:'Dumbbell Shoulder Press',group:'Shoulders'},
  {id:'e023',name:'Arnold Press',group:'Shoulders'},
  {id:'e024',name:'Lateral Raise',group:'Shoulders'},
  {id:'e025',name:'Front Raise',group:'Shoulders'},
  {id:'e026',name:'Rear Delt Fly',group:'Shoulders'},
  {id:'e027',name:'Upright Row',group:'Shoulders'},
  {id:'e028',name:'Cable Lateral Raise',group:'Shoulders'},
  {id:'e029',name:'Barbell Curl',group:'Biceps'},
  {id:'e030',name:'Dumbbell Curl',group:'Biceps'},
  {id:'e031',name:'Hammer Curl',group:'Biceps'},
  {id:'e032',name:'Incline Dumbbell Curl',group:'Biceps'},
  {id:'e033',name:'Cable Curl',group:'Biceps'},
  {id:'e034',name:'Preacher Curl',group:'Biceps'},
  {id:'e035',name:'Concentration Curl',group:'Biceps'},
  {id:'e036',name:'EZ Bar Curl',group:'Biceps'},
  {id:'e037',name:'Close-grip Bench Press',group:'Triceps'},
  {id:'e038',name:'Skullcrusher',group:'Triceps'},
  {id:'e039',name:'Tricep Pushdown',group:'Triceps'},
  {id:'e040',name:'Rope Pushdown',group:'Triceps'},
  {id:'e041',name:'Overhead Tricep Extension',group:'Triceps'},
  {id:'e042',name:'Tricep Dips',group:'Triceps'},
  {id:'e043',name:'Diamond Push-ups',group:'Triceps'},
  {id:'e044',name:'Back Squat',group:'Legs'},
  {id:'e045',name:'Front Squat',group:'Legs'},
  {id:'e046',name:'Leg Press',group:'Legs'},
  {id:'e047',name:'Romanian Deadlift',group:'Legs'},
  {id:'e048',name:'Leg Curl',group:'Legs'},
  {id:'e049',name:'Leg Extension',group:'Legs'},
  {id:'e050',name:'Standing Calf Raise',group:'Legs'},
  {id:'e051',name:'Seated Calf Raise',group:'Legs'},
  {id:'e052',name:'Walking Lunge',group:'Legs'},
  {id:'e053',name:'Bulgarian Split Squat',group:'Legs'},
  {id:'e054',name:'Hack Squat',group:'Legs'},
  {id:'e055',name:'Hip Thrust',group:'Legs'},
  {id:'e056',name:'Goblet Squat',group:'Legs'},
  {id:'e057',name:'Plank',group:'Core'},
  {id:'e058',name:'Crunches',group:'Core'},
  {id:'e059',name:'Hanging Leg Raises',group:'Core'},
  {id:'e060',name:'Russian Twist',group:'Core'},
  {id:'e061',name:'Cable Crunch',group:'Core'},
  {id:'e062',name:'Ab Wheel Rollout',group:'Core'},
  {id:'e063',name:'Bicycle Crunch',group:'Core'},
  {id:'e064',name:'Clean and Press',group:'Full Body'},
  {id:'e065',name:'Kettlebell Swing',group:'Full Body'},
  {id:'e066',name:'Burpees',group:'Full Body'},
  {id:'e067',name:'Box Jump',group:'Full Body'},
  {id:'e068',name:"Farmer's Walk",group:'Full Body'},
  {id:'e069',name:'Thruster',group:'Full Body'},
];

/* ═══════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════ */
const state = {
  tab: 'nutrition',
  workoutSubTab: 'plans',
  nutritionMonth: (() => { const n = new Date(); return { y: n.getFullYear(), m: n.getMonth() }; })(),
  activeWorkout: null,
  pickerSelected: [],
  pickerPlanColor: PLAN_COLORS[0],
  pickerPlanName: '',
  pickerPlanFreq: '2',
  editSplitDays: [],
  editSplitId: null,
  editSplitName: '',
  bodyModelRotation: 0,
  timerInterval: null,
  analyticsGymExercise: '',
  exPickerGroup: 'All',
  exPickerSearch: '',
};

/* ═══════════════════════════════════════════════════════════
   STORAGE
═══════════════════════════════════════════════════════════ */
const load = (key, def = null) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
};
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { console.error(e); } };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ═══════════════════════════════════════════════════════════
   DATE HELPERS
═══════════════════════════════════════════════════════════ */
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const dateKey  = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const parseDate = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const fmtShort  = s => { try { return parseDate(s).toLocaleDateString('en', { month:'short', day:'numeric' }); } catch { return s; } };
const fmtMonthYear = (y, m) => new Date(y, m, 1).toLocaleDateString('en', { month:'long', year:'numeric' });
const getDaysInMonth = (y, m) => new Date(y, m+1, 0).getDate();
const getFirstDOW    = (y, m) => new Date(y, m, 1).getDay();

const getLast30Days = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate()-i); days.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`); }
  return days;
};
const getLast7Days = () => getLast30Days().slice(-7);

const weekStartStr = () => {
  const d = new Date(); const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
let _toastTimer = null;
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { if(t) t.style.opacity = '0'; }, 2200);
}

/* ═══════════════════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════════════════ */
function loadTheme() {
  const theme = (load(SK.SETTINGS, {}) || {}).theme || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.getElementById('metaTheme');
  if (meta) meta.content = theme === 'dark' ? '#0a0a0a' : '#f4f4f8';
}
function toggleTheme() {
  const s = load(SK.SETTINGS, {}); s.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  save(SK.SETTINGS, s); loadTheme(); renderCurrentTab();
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════ */
const TAB_TITLES = { nutrition:'Nutrition', workouts:'Workouts', analytics:'Analytics' };

function switchTab(tab) {
  state.tab = tab;
  document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('topbarTitle').textContent = TAB_TITLES[tab];
  renderCurrentTab();
}
function renderCurrentTab() {
  if (state.tab === 'nutrition') renderNutrition();
  else if (state.tab === 'workouts') renderWorkouts();
  else renderAnalytics();
}

/* ═══════════════════════════════════════════════════════════
   OVERLAY (bottom sheet)
═══════════════════════════════════════════════════════════ */
function openOverlay(html, title) {
  const box = document.getElementById('overlay-box');
  box.innerHTML = `<div class="overlay-handle"></div>
    <div class="overlay-header">
      <span class="overlay-title">${esc(title)}</span>
      <button class="overlay-close" onclick="closeOverlay()">×</button>
    </div>
    <div class="overlay-body">${html}</div>`;
  document.getElementById('overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeOverlay() {
  document.getElementById('overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════════════
   PANEL (full-screen slide-over)
═══════════════════════════════════════════════════════════ */
function openPanel(html) {
  const p = document.getElementById('panel');
  p.innerHTML = html; p.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closePanel() {
  document.getElementById('panel').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════════════
   NUTRITION
═══════════════════════════════════════════════════════════ */
const getNutritionData = () => load(SK.NUTRITION, {});
const getGoals         = () => load(SK.GOALS, DEFAULT_GOALS);

function getDayTotals(dateStr) {
  const foods = (getNutritionData()[dateStr]?.foods) || [];
  return foods.reduce((a, f) => ({
    calories: a.calories + (Number(f.calories)||0),
    protein:  a.protein  + (Number(f.protein) ||0),
    carbs:    a.carbs    + (Number(f.carbs)   ||0),
    fat:      a.fat      + (Number(f.fat)     ||0),
  }), { calories:0, protein:0, carbs:0, fat:0 });
}

function barColor(pct) {
  if (pct >= 90 && pct <= 112) return 'prog-bar-green';
  if (pct >= 55) return 'prog-bar-yellow';
  if (pct > 112) return 'prog-bar-over';
  return 'prog-bar-red';
}
const barHex = cls => ({ 'prog-bar-green':'#22c55e','prog-bar-yellow':'#f59e0b','prog-bar-red':'#ef4444','prog-bar-over':'#f97316' })[cls] || '#888';

function renderNutrition() {
  const el = document.getElementById('tab-nutrition');
  const { y, m } = state.nutritionMonth;
  const days = getDaysInMonth(y, m);
  const firstDOW = getFirstDOW(y, m);
  const goals = getGoals();
  const t = todayStr();

  let cells = ['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < firstDOW; i++) cells += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= days; d++) {
    const ds = dateKey(y, m, d);
    const tot = getDayTotals(ds);
    const has = tot.calories > 0;
    const cpct = goals.calories > 0 ? Math.min((tot.calories/goals.calories)*100, 120) : 0;
    const ppct = goals.protein  > 0 ? Math.min((tot.protein /goals.protein) *100, 120) : 0;
    const cc = barHex(barColor(goals.calories>0?(tot.calories/goals.calories)*100:0));
    const pc = '#8b5cf6';
    const sd = getSplitDayForDate(ds);
    const sdCol = sd ? splitDayColor(sd) : null;
    const sdBadge = sd ? `<div class="cal-split-badge" style="background:${sdCol}22;color:${sdCol}">${esc(sd.label)}</div>` : '';
    cells += `<div class="cal-day${ds===t?' today':''}" onclick="openDayView('${ds}')">
      <div class="cal-day-num">${d}</div>
      ${sdBadge}
      <div class="cal-mini-bars">
        <div class="cal-mini-bar"><div class="cal-mini-bar-fill" style="width:${has?cpct:0}%;background:${cc}"></div></div>
        <div class="cal-mini-bar"><div class="cal-mini-bar-fill" style="width:${has?ppct:0}%;background:${pc}"></div></div>
      </div>
    </div>`;
  }

  el.innerHTML = `
    <div class="card card-sm">
      <div class="cal-nav">
        <button class="icon-btn" onclick="changeNutritionMonth(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="cal-nav-title">${fmtMonthYear(y,m)}</span>
        <button class="icon-btn" onclick="changeNutritionMonth(1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div style="display:flex;gap:14px;font-size:11px;color:var(--text2);padding:0 2px 10px">
        <span><span style="display:inline-block;width:8px;height:4px;border-radius:2px;background:#22c55e;margin-right:3px;vertical-align:middle"></span>Calories</span>
        <span><span style="display:inline-block;width:8px;height:4px;border-radius:2px;background:#8b5cf6;margin-right:3px;vertical-align:middle"></span>Protein</span>
        <span style="margin-left:auto;color:var(--text3)">Green = on track</span>
      </div>
      <div class="cal-grid">${cells}</div>
    </div>
    <div style="display:flex;gap:8px;padding:2px">
      <button class="btn btn-secondary btn-sm" style="flex:1" onclick="openGoalsModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
        Goals
      </button>
      <button class="btn btn-primary btn-sm" style="flex:1" onclick="openDayView('${t}')">+ Log Today</button>
    </div>`;
}

function changeNutritionMonth(dir) {
  let { y, m } = state.nutritionMonth;
  m += dir; if (m < 0) { m=11; y--; } if (m > 11) { m=0; y++; }
  state.nutritionMonth = { y, m }; renderNutrition();
}

function openDayView(dateStr) {
  const dayData = getNutritionData()[dateStr] || {};
  const foods = dayData.foods || [];
  const goals = getGoals();
  const tot = getDayTotals(dateStr);
  // Body weight entries — support legacy single value and new array format
  const bwEntries = dayData.weights?.length ? dayData.weights
    : dayData.weight ? [{ value: dayData.weight, time: '' }] : [];
  const bwAvg = bwEntries.length ? Math.round(bwEntries.reduce((s,w)=>s+w.value,0)/bwEntries.length*10)/10 : null;
  const bwListHtml = bwEntries.length
    ? bwEntries.map((w,i) => `
        <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)">
          ${w.time ? `<span style="font-size:11px;color:var(--text2);min-width:36px">${w.time}</span>` : ''}
          <span style="font-weight:700;font-size:15px;flex:1">${w.value} kg</span>
          <button class="icon-btn" style="color:var(--text3)" onclick="deleteWeight('${dateStr}',${i})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>`).join('') +
      (bwEntries.length > 1 ? `<div style="font-size:12px;color:var(--text2);padding-top:7px">Ø <b>${bwAvg} kg</b></div>` : '')
    : `<div style="font-size:12px;color:var(--text3);padding:4px 0">No entries yet</div>`;
  const sd = getSplitDayForDate(dateStr);
  const sdCol = sd ? splitDayColor(sd) : null;
  const splitBanner = sd
    ? `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:${sdCol}18;border-radius:12px;margin-bottom:10px;border:1px solid ${sdCol}44">
        <span style="font-size:20px">${sd.type==='rest'?'😴':sd.type==='run'?'🏃':'🏋️'}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px;color:${sdCol}">${esc(sd.label)}</div>
          <div style="font-size:11px;color:var(--text2)">${sd.isOverride?'Custom for today':'Planned '+( sd.type==='plan'?'workout':sd.type)}</div>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="openActivityOverride('${dateStr}')">Change</button>
        ${sd.isOverride?`<button class="icon-btn" style="color:var(--text3)" onclick="clearDayActivity('${dateStr}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`:''}
      </div>`
    : `<button class="btn btn-secondary btn-full" style="margin-bottom:10px" onclick="openActivityOverride('${dateStr}')">+ Add Activity for this day</button>`;

  const macroBoxes = ['calories','protein','carbs','fat'].map(k => {
    const unit = k === 'calories' ? 'kcal' : 'g';
    return `<div class="macro-box">
      <div class="macro-val">${tot[k]}</div>
      <div class="macro-unit">${unit}</div>
      <div class="macro-lbl">${k.charAt(0).toUpperCase()+k.slice(1)}</div>
    </div>`;
  }).join('');

  const bars = ['calories','protein','carbs','fat'].map(k => {
    const unit = k === 'calories' ? 'kcal' : 'g';
    const pct = goals[k] > 0 ? Math.min(Math.round((tot[k]/goals[k])*100), 120) : 0;
    const cls = barColor(goals[k] > 0 ? (tot[k]/goals[k])*100 : 0);
    return `<div class="prog-bar-wrap">
      <div class="prog-bar-top">
        <span class="prog-bar-label">${k.charAt(0).toUpperCase()+k.slice(1)}</span>
        <span class="prog-bar-val">${tot[k]}${unit} / ${goals[k]}${unit} (${pct}%)</span>
      </div>
      <div class="prog-bar-track"><div class="prog-bar-fill ${cls}" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');

  const foodsHtml = foods.length
    ? foods.map(f => `<div class="food-item">
        <div class="food-info">
          <div class="food-name">${esc(f.name)}</div>
          <div class="food-macros">P ${f.protein}g · C ${f.carbs}g · F ${f.fat}g</div>
        </div>
        <span class="food-cal">${f.calories} kcal</span>
        <button class="icon-btn food-delete" onclick="deleteFood('${dateStr}','${f.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>`).join('')
    : '<div style="text-align:center;padding:20px 0;color:var(--text2);font-size:14px">No food logged yet</div>';

  openPanel(`
    <div class="panel-header">
      <button class="panel-back" onclick="closePanel();renderNutrition()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <span class="panel-title">${fmtShort(dateStr)}</span>
      <button class="panel-action" onclick="openAddFoodModal('${dateStr}')">+ Add</button>
    </div>
    <div class="panel-body">
      ${splitBanner}
      <div class="card" style="margin-bottom:10px">
        <div class="card-title">Body Weight</div>
        ${bwListHtml}
        <div style="display:flex;gap:8px;align-items:center;margin-top:10px">
          <input class="input" id="bw_input" type="number" inputmode="decimal" step="0.1"
            placeholder="kg" style="flex:1;text-align:right;font-size:16px;font-weight:700;padding:9px 12px">
          <button class="btn btn-primary btn-sm" onclick="saveBodyWeight('${dateStr}')">+ Add</button>
        </div>
      </div>
      <div class="macros-grid">${macroBoxes}</div>
      <div class="card">${bars}</div>
      <div class="card">
        <div class="card-title">Food Log</div>
        ${foodsHtml}
      </div>
      <button class="btn btn-primary btn-full mt-12" onclick="openAddFoodModal('${dateStr}')">+ Add Food</button>
    </div>`);
}

function openAddFoodModal(dateStr) {
  openOverlay(`
    <div class="input-group">
      <label class="input-label">Food Name</label>
      <input class="input" id="fn_name" type="text" placeholder="e.g. Oatmeal with milk">
    </div>
    <div class="input-row">
      <div class="input-group">
        <label class="input-label">Calories</label>
        <input class="input" id="fn_cal" type="number" inputmode="decimal" placeholder="0">
      </div>
      <div class="input-group">
        <label class="input-label">Protein (g)</label>
        <input class="input" id="fn_pro" type="number" inputmode="decimal" placeholder="0">
      </div>
    </div>
    <div class="input-row">
      <div class="input-group">
        <label class="input-label">Carbs (g)</label>
        <input class="input" id="fn_carb" type="number" inputmode="decimal" placeholder="0">
      </div>
      <div class="input-group">
        <label class="input-label">Fat (g)</label>
        <input class="input" id="fn_fat" type="number" inputmode="decimal" placeholder="0">
      </div>
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="submitFood('${dateStr}')">Save Food</button>`, 'Add Food');
  setTimeout(() => document.getElementById('fn_name')?.focus(), 80);
}

function submitFood(dateStr) {
  const name = document.getElementById('fn_name')?.value.trim();
  if (!name) { showToast('Enter a food name'); return; }
  const food = {
    id: uid(), name,
    calories: parseFloat(document.getElementById('fn_cal')?.value) || 0,
    protein:  parseFloat(document.getElementById('fn_pro')?.value) || 0,
    carbs:    parseFloat(document.getElementById('fn_carb')?.value) || 0,
    fat:      parseFloat(document.getElementById('fn_fat')?.value) || 0,
  };
  const data = getNutritionData();
  if (!data[dateStr]) data[dateStr] = { foods: [] };
  data[dateStr].foods.push(food);
  save(SK.NUTRITION, data);
  closeOverlay();
  openDayView(dateStr);
  showToast('Food saved!');
}

function deleteFood(dateStr, foodId) {
  const data = getNutritionData();
  if (data[dateStr]) { data[dateStr].foods = (data[dateStr].foods||[]).filter(f => f.id !== foodId); save(SK.NUTRITION, data); }
  openDayView(dateStr);
}

function saveBodyWeight(dateStr) {
  const val = parseFloat(document.getElementById('bw_input')?.value);
  if (!(val > 0)) { showToast('Enter a weight'); return; }
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const data = getNutritionData();
  if (!data[dateStr]) data[dateStr] = { foods: [] };
  // Migrate legacy single-value format
  if (data[dateStr].weight && !data[dateStr].weights) {
    data[dateStr].weights = [{ value: data[dateStr].weight, time: '' }];
    delete data[dateStr].weight;
  }
  if (!data[dateStr].weights) data[dateStr].weights = [];
  data[dateStr].weights.push({ value: val, time });
  save(SK.NUTRITION, data);
  showToast(`${val} kg logged!`);
  openDayView(dateStr);
}

function deleteWeight(dateStr, idx) {
  const data = getNutritionData();
  if (data[dateStr]?.weights) {
    data[dateStr].weights.splice(idx, 1);
    save(SK.NUTRITION, data);
  }
  openDayView(dateStr);
}

function openActivityOverride(dateStr) {
  const plans = getPlans();
  const planBtns = plans.map(p =>
    `<button class="btn btn-secondary" style="justify-content:flex-start;gap:10px;margin-bottom:6px" onclick="setDayActivity('${dateStr}','plan','${p.id}','')">
      <div style="width:10px;height:10px;border-radius:50%;background:${p.color||'var(--accent)'};flex-shrink:0"></div>
      ${esc(p.name)}
    </button>`
  ).join('');
  const hasOverride = !!getNutritionData()[dateStr]?.activityOverride;
  openOverlay(`
    <div style="display:flex;flex-direction:column;gap:0">
      ${planBtns || '<div style="color:var(--text2);font-size:13px;margin-bottom:8px">No workout plans yet</div>'}
      <button class="btn btn-secondary" style="justify-content:flex-start;gap:10px;margin-bottom:6px" onclick="setDayActivity('${dateStr}','run','','Run')">
        <span style="font-size:16px">🏃</span> Run
      </button>
      <button class="btn btn-secondary" style="justify-content:flex-start;gap:10px;margin-bottom:6px" onclick="setDayActivity('${dateStr}','rest','','Rest')">
        <span style="font-size:16px">😴</span> Rest
      </button>
      <button class="btn btn-secondary" style="justify-content:flex-start;gap:10px" onclick="openCustomDayActivity('${dateStr}')">
        <span style="font-size:16px">✏️</span> Custom…
      </button>
      ${hasOverride ? `<div class="divider" style="margin:12px 0"></div>
        <button class="btn btn-secondary btn-full" onclick="clearDayActivity('${dateStr}')">↩ Reset to split plan</button>` : ''}
    </div>
  `, 'Activity for ' + fmtShort(dateStr));
}

function setDayActivity(dateStr, type, planId, label) {
  const resolvedLabel = label || (type === 'plan' ? (getPlans().find(p=>p.id===planId)?.name || 'Workout') : type === 'run' ? 'Run' : 'Rest');
  const data = getNutritionData();
  if (!data[dateStr]) data[dateStr] = { foods: [] };
  data[dateStr].activityOverride = { type, planId: planId||'', label: resolvedLabel };
  save(SK.NUTRITION, data);
  closeOverlay();
  openDayView(dateStr);
  showToast('Activity set!');
}

function openCustomDayActivity(dateStr) {
  closeOverlay();
  openOverlay(`
    <div class="input-group">
      <label class="input-label">Activity Name</label>
      <input class="input" id="ca_label" type="text" placeholder="e.g. Yoga, Cycling, Mobility…">
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="setDayActivity('${dateStr}','custom','',document.getElementById('ca_label')?.value||'Custom')">Set Activity</button>
  `, 'Custom Activity');
}

function clearDayActivity(dateStr) {
  const data = getNutritionData();
  if (data[dateStr]) { delete data[dateStr].activityOverride; save(SK.NUTRITION, data); }
  closeOverlay();
  openDayView(dateStr);
  showToast('Reset to split');
}

function openGoalsModal() {
  const g = getGoals();
  openOverlay(`
    <div class="input-row">
      <div class="input-group"><label class="input-label">Calories (kcal)</label><input class="input" id="g_cal" type="number" inputmode="decimal" value="${g.calories}"></div>
      <div class="input-group"><label class="input-label">Protein (g)</label><input class="input" id="g_pro" type="number" inputmode="decimal" value="${g.protein}"></div>
    </div>
    <div class="input-row">
      <div class="input-group"><label class="input-label">Carbs (g)</label><input class="input" id="g_carb" type="number" inputmode="decimal" value="${g.carbs}"></div>
      <div class="input-group"><label class="input-label">Fat (g)</label><input class="input" id="g_fat" type="number" inputmode="decimal" value="${g.fat}"></div>
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="saveGoals()">Save Goals</button>`, '⚙ Daily Goals');
}

function saveGoals() {
  save(SK.GOALS, {
    calories: parseFloat(document.getElementById('g_cal')?.value) || 2500,
    protein:  parseFloat(document.getElementById('g_pro')?.value) || 150,
    carbs:    parseFloat(document.getElementById('g_carb')?.value) || 300,
    fat:      parseFloat(document.getElementById('g_fat')?.value) || 70,
  });
  closeOverlay(); renderNutrition(); showToast('Goals saved!');
}

/* ═══════════════════════════════════════════════════════════
   WORKOUTS
═══════════════════════════════════════════════════════════ */
const getPlans       = () => load(SK.PLANS,        []);
const getHistory     = () => load(SK.HISTORY,      []);
const getRuns        = () => load(SK.RUNS,          []);
const getSplits      = () => load(SK.SPLITS,        []);
const getActiveSplit = () => load(SK.ACTIVE_SPLIT,  null);
const getAllExercises = () => [...EXERCISE_DB, ...load(SK.CUSTOM_EX, [])];

function renderWorkouts() {
  const el = document.getElementById('tab-workouts');
  const sub = state.workoutSubTab;
  const tabs = ['plans','splits','history','running'].map(t =>
    `<button class="sub-tab${sub===t?' active':''}" onclick="switchWorkoutSub('${t}')">${t.charAt(0).toUpperCase()+t.slice(1)}</button>`
  ).join('');
  el.innerHTML = `<div class="sub-tabs">${tabs}</div><div id="wo-sub"></div>`;
  if (sub === 'plans') renderPlans();
  else if (sub === 'splits') renderSplits();
  else if (sub === 'history') renderHistory();
  else renderRunningList();
}
function switchWorkoutSub(tab) { state.workoutSubTab = tab; renderWorkouts(); }

/* ── Plans ──────────────────────────────────────────────── */
function renderPlans() {
  const plans = getPlans();
  const aw = load(SK.ACTIVE_WO, null);
  const el = document.getElementById('wo-sub');

  let banner = '';
  if (aw) banner = `<div class="card" style="border-color:var(--accent);background:var(--accent-glow);margin-bottom:10px">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div><div style="font-weight:700">Workout in progress</div><div style="font-size:12px;color:var(--text2)">${esc(aw.planName)}</div></div>
      <button class="btn btn-primary btn-sm" onclick="resumeWorkout()">Resume</button>
    </div>
  </div>`;

  if (!plans.length) {
    el.innerHTML = banner + `<div class="empty-state">
      <div class="empty-icon">🏋️</div>
      <div class="empty-title">No plans yet</div>
      <div class="empty-sub">Create your first workout plan — Push, Pull, Legs, or anything you like.</div>
      <button class="btn btn-primary" onclick="openNewPlan()">+ Create Plan</button>
    </div>`;
    return;
  }
  const html = plans.map(p => {
    const exs = p.exercises || [];
    const chips = exs.slice(0,4).map(e=>`<span class="ex-chip">${esc(e.name)}</span>`).join('');
    const more = exs.length > 4 ? `<span class="ex-chip">+${exs.length-4}</span>` : '';
    return `<div class="plan-card">
      <div class="plan-card-header">
        <div class="plan-color-dot" style="background:${p.color||'#8b5cf6'}"></div>
        <span class="plan-card-name">${esc(p.name)}</span>
      </div>
      <div class="plan-card-body">
        <div class="plan-ex-chips">${chips}${more}</div>
        <div class="plan-actions">
          <button class="btn btn-primary btn-sm" style="flex:1" onclick="startWorkout('${p.id}')">▶ Start</button>
          <button class="btn btn-secondary btn-sm" onclick="openEditPlan('${p.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deletePlan('${p.id}')">✕</button>
        </div>
      </div>
    </div>`;
  }).join('');
  el.innerHTML = banner + html + `<button class="btn btn-secondary btn-full mt-8" onclick="openNewPlan()">+ New Plan</button>`;
}

/* ── Plan Modal ─────────────────────────────────────────── */
function colorSwatches(selectedColor) {
  return PLAN_COLORS.map(c =>
    `<button type="button" onclick="selectColor(this,'${c}')"
      style="width:26px;height:26px;border-radius:50%;background:${c};border:3px solid ${c===selectedColor?'#fff':'transparent'};flex-shrink:0"
      data-color="${c}"></button>`
  ).join('');
}
function selectColor(el, c) {
  document.querySelectorAll('[data-color]').forEach(b => b.style.borderColor = 'transparent');
  el.style.borderColor = '#fff';
  state.pickerPlanColor = c;
}

function openNewPlan(preserveSelection = false) {
  if (!preserveSelection) { state.pickerSelected = []; state.pickerPlanColor = PLAN_COLORS[0]; }
  openOverlay(`
    <div class="input-group"><label class="input-label">Plan Name</label><input class="input" id="pn_name" type="text" placeholder="e.g. Push Day"></div>
    <div class="input-group"><label class="input-label">Color</label><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">${colorSwatches(state.pickerPlanColor)}</div></div>
    <button class="btn btn-secondary btn-full" style="margin-bottom:10px" onclick="openExPicker(null,'new')">+ Add Exercises <span style="color:var(--accent)">${state.pickerSelected.length ? '('+state.pickerSelected.length+' selected)' : ''}</span></button>
    <button class="btn btn-primary btn-full" onclick="savePlan(null)">Create Plan</button>`, 'New Plan');
}

function openEditPlan(planId) {
  const plan = getPlans().find(p => p.id === planId);
  if (!plan) return;
  state.pickerSelected = (plan.exercises||[]).map(e => e.id);
  state.pickerPlanColor = plan.color || PLAN_COLORS[0];
  openOverlay(`
    <div class="input-group"><label class="input-label">Plan Name</label><input class="input" id="pn_name" type="text" value="${esc(plan.name)}"></div>
    <div class="input-group"><label class="input-label">Color</label><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">${colorSwatches(state.pickerPlanColor)}</div></div>
    <button class="btn btn-secondary btn-full" style="margin-bottom:10px" onclick="openExPicker('${planId}','edit')">Manage Exercises <span style="color:var(--accent)">(${state.pickerSelected.length} selected)</span></button>
    <button class="btn btn-primary btn-full" onclick="savePlan('${planId}')">Save Changes</button>`, 'Edit Plan');
}

function savePlan(planId) {
  const name = (document.getElementById('pn_name')?.value || state.pickerPlanName || '').trim();
  if (!name) { showToast('Enter a plan name'); return; }
  const color = state.pickerPlanColor || PLAN_COLORS[0];
  const allEx = getAllExercises();
  const allPlans = getPlans();
  const existing = planId ? (allPlans.find(p=>p.id===planId)?.exercises || []) : [];
  const exercises = state.pickerSelected.map(id => {
    const ex = allEx.find(e => e.id === id);
    const prev = existing.find(e => e.id === id);
    return ex ? { id:ex.id, name:ex.name, group:ex.group, sets:prev?.sets||3, reps:prev?.reps||'8-12' } : null;
  }).filter(Boolean);

  const plans = allPlans;
  if (planId) {
    const idx = plans.findIndex(p => p.id === planId);
    if (idx >= 0) plans[idx] = { ...plans[idx], name, color, exercises };
  } else {
    plans.push({ id:uid(), name, color, exercises });
  }
  save(SK.PLANS, plans);
  closeOverlay(); renderPlans();
  showToast(planId ? 'Plan updated!' : 'Plan created!');
}

function deletePlan(planId) {
  if (!confirm('Delete this plan?')) return;
  save(SK.PLANS, getPlans().filter(p => p.id !== planId));
  renderPlans(); showToast('Plan deleted');
}

/* ── Exercise Picker ────────────────────────────────────── */
function openExPicker(planId, mode) {
  state.pickerPlanName = document.getElementById('pn_name')?.value || state.pickerPlanName || '';
  state.exPickerGroup = 'All';
  state.exPickerSearch = '';
  closeOverlay();
  renderExPicker(planId, mode);
}

function renderExPicker(planId, mode) {
  const allEx = getAllExercises();
  const groups = ['All', ...new Set(allEx.map(e => e.group))];
  const filtered = allEx.filter(e =>
    (state.exPickerGroup === 'All' || e.group === state.exPickerGroup) &&
    (!state.exPickerSearch || e.name.toLowerCase().includes(state.exPickerSearch.toLowerCase()))
  );
  const groupTabs = groups.map(g => {
    const active = state.exPickerGroup === g;
    const bg = active ? (GROUP_COLORS[g] || 'var(--accent)') : '';
    return `<button class="ex-group-btn${active?' active':''}" style="${active?`background:${bg};border-color:${bg}`:''}" onclick="setExGroup('${g}','${planId}','${mode}')">${g}</button>`;
  }).join('');
  const rows = filtered.map(e => {
    const sel = state.pickerSelected.includes(e.id);
    const col = GROUP_COLORS[e.group] || '#888';
    const abbr = e.group.substring(0,2).toUpperCase();
    return `<div class="ex-row${sel?' selected':''}" onclick="toggleEx('${e.id}','${planId}','${mode}')">
      <div class="ex-badge" style="background:${col}">${abbr}</div>
      <div style="flex:1"><div class="ex-row-name">${esc(e.name)}</div><div class="ex-row-group">${esc(e.group)}</div></div>
      <div class="ex-check">${sel?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>':''}</div>
    </div>`;
  }).join('');
  const backCall = mode === 'edit' ? `openEditPlan('${planId}')` : 'openNewPlan(true)';
  const saveCall = mode === 'edit' ? `savePlan('${planId}')` : `savePlan(null)`;
  openPanel(`
    <div class="panel-header">
      <button class="panel-back" onclick="closePanel();${backCall}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg> Cancel
      </button>
      <span class="panel-title">${state.pickerSelected.length} selected</span>
      <button class="panel-action" onclick="closePanel();${saveCall}">Save</button>
    </div>
    <div class="panel-body">
      <input class="input" type="search" placeholder="Search…" value="${esc(state.exPickerSearch)}"
        oninput="state.exPickerSearch=this.value;renderExPicker('${planId}','${mode}')">
      <div class="ex-picker-groups" style="margin:10px 0">${groupTabs}</div>
      <div class="ex-list">${rows || '<div style="text-align:center;padding:20px;color:var(--text2)">No exercises found</div>'}</div>
      <div class="divider" style="margin:14px 0"></div>
      <button class="btn btn-secondary btn-full" onclick="openCustomEx('${planId}','${mode}')">+ Add Custom Exercise</button>
      <button class="btn btn-primary btn-full mt-8" onclick="closePanel();${saveCall}">Save Plan</button>
    </div>`);
}

function setExGroup(g, planId, mode) { state.exPickerGroup = g; renderExPicker(planId, mode); }
function toggleEx(id, planId, mode) {
  const i = state.pickerSelected.indexOf(id);
  if (i >= 0) state.pickerSelected.splice(i,1); else state.pickerSelected.push(id);
  renderExPicker(planId, mode);
}

function openCustomEx(planId, mode) {
  openOverlay(`
    <div class="input-group"><label class="input-label">Exercise Name</label><input class="input" id="ce_name" type="text" placeholder="e.g. Cable Fly"></div>
    <div class="input-group">
      <label class="input-label">Muscle Group</label>
      <select class="input" id="ce_group">
        ${Object.keys(GROUP_COLORS).map(g=>`<option value="${g}">${g}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="saveCustomEx('${planId}','${mode}')">Add</button>`, 'Custom Exercise');
}
function saveCustomEx(planId, mode) {
  const name = document.getElementById('ce_name')?.value.trim();
  if (!name) { showToast('Enter a name'); return; }
  const ex = { id:'c_'+uid(), name, group: document.getElementById('ce_group')?.value||'Custom' };
  const custom = load(SK.CUSTOM_EX,[]);
  custom.push(ex); save(SK.CUSTOM_EX, custom);
  state.pickerSelected.push(ex.id);
  closeOverlay(); renderExPicker(planId, mode); showToast('Added!');
}

/* ── Active Workout ─────────────────────────────────────── */
function getLastSets(exId) {
  const hist = getHistory();
  for (let i = hist.length-1; i >= 0; i--) {
    const ex = (hist[i].exercises||[]).find(e => e.exerciseId===exId || e.id===exId);
    if (ex?.sets?.length) { const s = ex.sets[ex.sets.length-1]; return { weight:s.weight||'', reps:s.reps||'' }; }
  }
  return { weight:'', reps:'' };
}

function getLastSetsArray(exId) {
  const hist = getHistory();
  for (let i = hist.length-1; i >= 0; i--) {
    const ex = (hist[i].exercises||[]).find(e => e.exerciseId===exId || e.id===exId);
    if (ex?.sets?.length) return ex.sets.map(s => ({ weight:s.weight||'', reps:s.reps||'' }));
  }
  return null;
}

function startWorkout(planId) {
  const plan = getPlans().find(p => p.id === planId);
  if (!plan) return;
  const aw = {
    id:uid(), planId, planName:plan.name, planColor:plan.color||'#8b5cf6',
    startTime:Date.now(),
    exercises:(plan.exercises||[]).map(ex => {
      const lastArr = getLastSetsArray(ex.id);
      const fallback = { weight:'', reps:'' };
      return {
        exerciseId:ex.id, name:ex.name, group:ex.group||'',
        plannedSets:ex.sets||3, plannedReps:ex.reps||'8-12',
        sets:Array.from({length:ex.sets||3}, (_,si) => {
          const prev = lastArr?.[si] || lastArr?.[lastArr.length-1] || fallback;
          return { weight:prev.weight, reps:prev.reps, done:false };
        }),
      };
    }),
  };
  save(SK.ACTIVE_WO, aw);
  state.activeWorkout = aw;
  renderWorkoutSession();
}

function resumeWorkout() {
  state.activeWorkout = load(SK.ACTIVE_WO, null);
  if (state.activeWorkout) renderWorkoutSession();
}

function renderWorkoutSession() {
  const aw = state.activeWorkout;
  if (!aw) return;
  const exHtml = aw.exercises.map((ex, ei) => {
    const last = getLastSets(ex.exerciseId);
    const prev = last.weight && last.reps ? `Last: ${last.weight}kg × ${last.reps}` : 'No history';
    const col = GROUP_COLORS[ex.group]||'#888';
    const abbr = (ex.group||'?').substring(0,2).toUpperCase();
    const setsHtml = ex.sets.map((set, si) =>
      `<div class="set-row${set.done?' done':''}" id="sr_${ei}_${si}">
        <div class="set-num">${si+1}</div>
        <input class="set-input" type="number" inputmode="decimal" placeholder="kg" value="${esc(set.weight)}"
          style="max-width:72px" onchange="updSet(${ei},${si},'weight',this.value)">
        <span class="set-sep">×</span>
        <input class="set-input" type="number" inputmode="decimal" placeholder="reps" value="${esc(set.reps)}"
          style="max-width:72px" onchange="updSet(${ei},${si},'reps',this.value)">
        <button class="set-done-btn${set.done?' active':''}" onclick="doneSet(${ei},${si})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <button class="icon-btn" style="color:var(--text3);padding:3px" onclick="delSet(${ei},${si})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`).join('');
    return `<div class="workout-ex-card">
      <div class="workout-ex-header">
        <div class="ex-badge" style="background:${col};width:32px;height:32px;border-radius:8px;font-size:10px">${abbr}</div>
        <span class="workout-ex-name">${esc(ex.name)}</span>
        <span class="workout-ex-prev">${prev}</span>
      </div>
      <div class="workout-sets">${setsHtml}<button class="add-set-btn" onclick="addSet(${ei})">+ Add Set</button></div>
    </div>`;
  }).join('');

  openPanel(`
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="workout-session-header">
        <div>
          <div class="workout-session-title" style="color:${aw.planColor}">${esc(aw.planName)}</div>
          <div style="font-size:11px;color:var(--text2)">${new Date(aw.startTime).toLocaleDateString()}</div>
        </div>
        <div id="wo-timer" class="workout-timer">00:00</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-danger btn-sm" onclick="cancelWorkout()">✕ Cancel</button>
          <button class="btn btn-primary btn-sm" onclick="finishWorkout()">✓ Finish</button>
        </div>
      </div>
      <div class="workout-exercises" style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px">${exHtml}</div>
    </div>`);
  startTimer(aw.startTime);
}

function startTimer(t0) {
  if (state.timerInterval) clearInterval(state.timerInterval);
  const tick = () => {
    const el = document.getElementById('wo-timer'); if (!el) { clearInterval(state.timerInterval); return; }
    const s = Math.floor((Date.now()-t0)/1000);
    const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60;
    el.textContent = h ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };
  tick();
  state.timerInterval = setInterval(tick, 1000);
}

function updSet(ei, si, field, val) {
  const aw = state.activeWorkout; if (!aw) return;
  aw.exercises[ei].sets[si][field] = val; save(SK.ACTIVE_WO, aw);
}
function doneSet(ei, si) {
  const aw = state.activeWorkout; if (!aw) return;
  aw.exercises[ei].sets[si].done = !aw.exercises[ei].sets[si].done;
  save(SK.ACTIVE_WO, aw);
  const row = document.getElementById(`sr_${ei}_${si}`);
  if (row) {
    row.classList.toggle('done', aw.exercises[ei].sets[si].done);
    row.querySelector('.set-done-btn')?.classList.toggle('active', aw.exercises[ei].sets[si].done);
  }
}
function addSet(ei) {
  const aw = state.activeWorkout; if (!aw) return;
  const ex = aw.exercises[ei]; const last = ex.sets[ex.sets.length-1]||{};
  ex.sets.push({ weight:last.weight||'', reps:last.reps||'', done:false });
  save(SK.ACTIVE_WO, aw); renderWorkoutSession();
}
function delSet(ei, si) {
  const aw = state.activeWorkout; if (!aw) return;
  if (aw.exercises[ei].sets.length <= 1) { showToast('Need at least 1 set'); return; }
  aw.exercises[ei].sets.splice(si, 1); save(SK.ACTIVE_WO, aw); renderWorkoutSession();
}
function finishWorkout() {
  const aw = state.activeWorkout; if (!aw) return;
  if (!confirm('Finish and save workout?')) return;
  clearInterval(state.timerInterval);
  const hist = getHistory();
  hist.unshift({ ...aw, endTime:Date.now(), duration:Math.floor((Date.now()-aw.startTime)/1000), date:todayStr() });
  save(SK.HISTORY, hist);
  localStorage.removeItem(SK.ACTIVE_WO);
  state.activeWorkout = null;
  closePanel(); showToast('Workout saved! 💪');
  switchWorkoutSub('history');
}
function cancelWorkout() {
  if (!confirm('Cancel and discard workout?')) return;
  clearInterval(state.timerInterval);
  localStorage.removeItem(SK.ACTIVE_WO);
  state.activeWorkout = null;
  closePanel(); renderPlans();
}

/* ── History ────────────────────────────────────────────── */
function renderHistory() {
  const hist = getHistory();
  const el = document.getElementById('wo-sub');
  if (!hist.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">No workouts yet</div><div class="empty-sub">Start a workout from Plans and it'll appear here.</div></div>`;
    return;
  }
  el.innerHTML = hist.map(wo => {
    const dur = wo.duration ? `${Math.floor(wo.duration/60)}min` : '';
    const exNames = (wo.exercises||[]).map(e=>e.name).slice(0,3).join(', ');
    const more = (wo.exercises?.length||0) > 3 ? ` +${wo.exercises.length-3}` : '';
    const totalSets = (wo.exercises||[]).reduce((s,e)=>s+(e.sets?.length||0), 0);
    return `<div class="hist-card" onclick="openEditWorkout('${wo.id}')" style="cursor:pointer">
      <div class="hist-card-top">
        <span class="hist-plan-name" style="color:${wo.planColor||'var(--accent)'}">${esc(wo.planName||'Workout')}</span>
        <span class="hist-date">${fmtShort(wo.date||'')}${dur?' · '+dur:''}</span>
      </div>
      <div class="hist-ex-list">${esc(exNames+more)||'—'}</div>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">${totalSets} sets total · tap to edit</div>
    </div>`;
  }).join('');
}

function openEditWorkout(woId) {
  const hist = getHistory();
  const wo = hist.find(w => w.id === woId);
  if (!wo) return;

  const exHtml = (wo.exercises||[]).map((ex, ei) => {
    const col = GROUP_COLORS[ex.group]||'#888';
    const abbr = (ex.group||'?').substring(0,2).toUpperCase();
    const setsHtml = (ex.sets||[]).map((set, si) =>
      `<div class="set-row${set.done!==false?' done':''}" id="hsr_${ei}_${si}">
        <div class="set-num">${si+1}</div>
        <input class="set-input" type="number" inputmode="decimal" placeholder="kg"
          value="${esc(set.weight)}" style="max-width:72px"
          onchange="updHistSet('${woId}',${ei},${si},'weight',this.value)">
        <span class="set-sep">×</span>
        <input class="set-input" type="number" inputmode="decimal" placeholder="reps"
          value="${esc(set.reps)}" style="max-width:72px"
          onchange="updHistSet('${woId}',${ei},${si},'reps',this.value)">
        <button class="icon-btn" style="color:var(--text3);padding:3px" onclick="delHistSet('${woId}',${ei},${si})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`).join('');
    return `<div class="workout-ex-card" style="margin-bottom:8px">
      <div class="workout-ex-header">
        <div class="ex-badge" style="background:${col};width:30px;height:30px;border-radius:7px;font-size:10px">${abbr}</div>
        <span class="workout-ex-name">${esc(ex.name)}</span>
      </div>
      <div class="workout-sets">
        ${setsHtml}
        <button class="add-set-btn" onclick="addHistSet('${woId}',${ei})">+ Add Set</button>
      </div>
    </div>`;
  }).join('');

  openPanel(`
    <div class="panel-header">
      <button class="panel-back" onclick="closePanel();renderHistory()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <span class="panel-title">${esc(wo.planName||'Workout')}</span>
      <button class="panel-action" onclick="deleteWorkoutEntry('${woId}')">Delete</button>
    </div>
    <div class="panel-body">
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <div class="macro-box" style="flex:1"><div class="macro-val">${fmtShort(wo.date||'')}</div><div class="macro-lbl">Date</div></div>
        <div class="macro-box" style="flex:1"><div class="macro-val">${wo.duration?Math.floor(wo.duration/60):'—'}</div><div class="macro-unit">${wo.duration?'min':''}</div><div class="macro-lbl">Duration</div></div>
        <div class="macro-box" style="flex:1"><div class="macro-val">${(wo.exercises||[]).reduce((s,e)=>s+(e.sets?.length||0),0)}</div><div class="macro-lbl">Total Sets</div></div>
      </div>
      ${exHtml}
    </div>`);
}

function updHistSet(woId, ei, si, field, val) {
  const hist = getHistory();
  const wo = hist.find(w => w.id === woId); if (!wo) return;
  if (wo.exercises[ei]?.sets[si]) wo.exercises[ei].sets[si][field] = val;
  save(SK.HISTORY, hist);
}
function addHistSet(woId, ei) {
  const hist = getHistory();
  const wo = hist.find(w => w.id === woId); if (!wo) return;
  const ex = wo.exercises[ei]; const last = ex.sets[ex.sets.length-1]||{};
  ex.sets.push({ weight:last.weight||'', reps:last.reps||'', done:true });
  save(SK.HISTORY, hist);
  openEditWorkout(woId);
}
function delHistSet(woId, ei, si) {
  const hist = getHistory();
  const wo = hist.find(w => w.id === woId); if (!wo) return;
  if (wo.exercises[ei].sets.length <= 1) { showToast('Need at least 1 set'); return; }
  wo.exercises[ei].sets.splice(si, 1);
  save(SK.HISTORY, hist);
  openEditWorkout(woId);
}
function deleteWorkoutEntry(woId) {
  if (!confirm('Delete this workout entry?')) return;
  save(SK.HISTORY, getHistory().filter(w => w.id !== woId));
  closePanel(); renderHistory(); showToast('Workout deleted');
}

/* ── Running ────────────────────────────────────────────── */
function calcPace(distKm, timeSec) {
  if (!distKm || !timeSec) return '--';
  const ps = timeSec/distKm; return `${Math.floor(ps/60)}:${String(Math.round(ps%60)).padStart(2,'0')}`;
}
function parseDuration(s) {
  const parts = String(s).replace(/[^0-9:]/g,'').split(':').map(Number);
  if (parts.length===3) return parts[0]*3600+parts[1]*60+parts[2];
  if (parts.length===2) return parts[0]*60+parts[1];
  return Number(s)||0;
}
function fmtDuration(sec) {
  const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
  return h ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
}
function fmtTimeHMS(sec) {
  const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
// Auto-format time input: user types digits only, colons inserted automatically
function onTimeKey(el) {
  let digits = el.value.replace(/\D/g,'').slice(0,6);
  let formatted = digits;
  if (digits.length > 4) formatted = digits.slice(0,2)+':'+digits.slice(2,4)+':'+digits.slice(4);
  else if (digits.length > 2) formatted = digits.slice(0,2)+':'+digits.slice(2);
  el.value = formatted;
}
// On blur: pad with leading zeros to always produce hh:mm:ss
function onTimeBlur(el) {
  let digits = el.value.replace(/\D/g,'');
  if (!digits) return;
  digits = digits.padStart(6, '0').slice(0, 6);
  el.value = digits.slice(0,2)+':'+digits.slice(2,4)+':'+digits.slice(4);
}

function renderRunningList() {
  const runs = getRuns();
  const el = document.getElementById('wo-sub');
  const addBtn = `<button class="btn btn-primary btn-full" style="margin-bottom:12px" onclick="openAddRun()">+ Log Run</button>`;
  if (!runs.length) {
    el.innerHTML = addBtn + `<div class="empty-state" style="padding-top:16px"><div class="empty-icon">🏃</div><div class="empty-title">No runs yet</div><div class="empty-sub">Log your first run to track your pace and distance over time.</div></div>`;
    return;
  }
  el.innerHTML = addBtn + runs.map(r => {
    const isInterval = r.type === 'interval';
    const pace = isInterval ? '--' : calcPace(r.distance, r.time);
    const icon = isInterval ? '⚡' : '🏃';
    const badge = isInterval
      ? `<span style="background:rgba(249,115,22,.15);color:#f97316;font-size:10px;font-weight:700;padding:2px 7px;border-radius:5px;margin-left:6px">INTERVAL</span>`
      : '';
    const detail = isInterval
      ? `${r.intervals}× ${fmtDuration(r.workTime)} / ${fmtDuration(r.restTime)} rest`
      : `${fmtDuration(r.time)}`;
    const sub = r.notes ? ` · ${esc(r.notes)}` : '';
    return `<div class="run-card" onclick="openEditRun('${r.id}')">
      <div class="run-icon" style="${isInterval?'background:rgba(249,115,22,.15)':''}">${icon}</div>
      <div class="run-info">
        <div class="run-date">${fmtShort(r.date)}${badge}</div>
        <div class="run-main">${r.distance} km</div>
        <div class="run-details">${detail}${sub}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        ${isInterval
          ? `<div class="run-pace">${r.intervals}<span style="font-size:10px;font-weight:400"> reps</span></div>`
          : `<div class="run-pace">${pace}</div><div class="run-pace-label">min/km</div>`}
      </div>
    </div>`;
  }).join('');
}

// Run form builder (shared by add and edit)
function runFormHTML(r = {}) {
  const isInt = r.type === 'interval';
  return `
    <div class="input-group"><label class="input-label">Date</label><input class="input" id="r_date" type="date" value="${r.date||todayStr()}"></div>
    <div class="input-group">
      <label class="input-label">Type</label>
      <div style="display:flex;gap:8px">
        <button type="button" id="r_type_normal" onclick="setRunType('normal')"
          class="btn btn-sm" style="flex:1;${!isInt?'background:var(--accent);color:#fff':'background:var(--card2);color:var(--text)'}">Normal Run</button>
        <button type="button" id="r_type_interval" onclick="setRunType('interval')"
          class="btn btn-sm" style="flex:1;${isInt?'background:#f97316;color:#fff':'background:var(--card2);color:var(--text)'}">Interval Run</button>
      </div>
    </div>
    <div class="input-group"><label class="input-label">Distance (km)</label><input class="input" id="r_dist" type="number" inputmode="decimal" step="0.01" placeholder="5.0" value="${r.distance||''}"></div>
    <div id="r_normal_fields" style="display:${isInt?'none':'block'}">
      <div class="input-group">
        <label class="input-label">Total Time (hh:mm:ss — type digits only)</label>
        <input class="input" id="r_time" type="text" inputmode="numeric" placeholder="00:25:30"
          value="${r.time?fmtTimeHMS(r.time):''}" oninput="onTimeKey(this)" onblur="onTimeBlur(this)">
      </div>
    </div>
    <div id="r_interval_fields" style="display:${isInt?'block':'none'}">
      <div class="input-group"><label class="input-label">Number of Intervals</label><input class="input" id="r_intervals" type="number" inputmode="decimal" placeholder="8" value="${r.intervals||''}"></div>
      <div class="input-row">
        <div class="input-group">
          <label class="input-label">Work Time (hh:mm:ss)</label>
          <input class="input" id="r_worktime" type="text" inputmode="numeric" placeholder="00:01:00"
            value="${r.workTime?fmtTimeHMS(r.workTime):''}" oninput="onTimeKey(this)" onblur="onTimeBlur(this)">
        </div>
        <div class="input-group">
          <label class="input-label">Rest Time (hh:mm:ss)</label>
          <input class="input" id="r_resttime" type="text" inputmode="numeric" placeholder="00:00:30"
            value="${r.restTime?fmtTimeHMS(r.restTime):''}" oninput="onTimeKey(this)" onblur="onTimeBlur(this)">
        </div>
      </div>
    </div>
    <div class="input-group"><label class="input-label">Notes (optional)</label><input class="input" id="r_notes" type="text" placeholder="Morning run, felt great…" value="${esc(r.notes||'')}"></div>`;
}

function setRunType(type) {
  const isInt = type === 'interval';
  document.getElementById('r_normal_fields').style.display = isInt ? 'none' : 'block';
  document.getElementById('r_interval_fields').style.display = isInt ? 'block' : 'none';
  document.getElementById('r_type_normal').style.cssText += isInt ? ';background:var(--card2);color:var(--text)' : ';background:var(--accent);color:#fff';
  document.getElementById('r_type_interval').style.cssText += isInt ? ';background:#f97316;color:#fff' : ';background:var(--card2);color:var(--text)';
}

function collectRunForm() {
  const isInterval = document.getElementById('r_interval_fields').style.display !== 'none';
  const dist = parseFloat(document.getElementById('r_dist')?.value);
  if (!dist) { showToast('Enter distance'); return null; }
  const run = {
    date: document.getElementById('r_date')?.value || todayStr(),
    type: isInterval ? 'interval' : 'normal',
    distance: dist,
    notes: document.getElementById('r_notes')?.value.trim() || '',
  };
  if (isInterval) {
    run.intervals = parseInt(document.getElementById('r_intervals')?.value) || 0;
    run.workTime  = parseDuration(document.getElementById('r_worktime')?.value || '');
    run.restTime  = parseDuration(document.getElementById('r_resttime')?.value || '');
    if (!run.intervals || !run.workTime) { showToast('Enter intervals and work time'); return null; }
    run.time = run.intervals * (run.workTime + run.restTime); // total session time
  } else {
    const t = document.getElementById('r_time')?.value.trim();
    if (!t) { showToast('Enter time'); return null; }
    run.time = parseDuration(t);
  }
  return run;
}

function openAddRun() {
  openOverlay(`${runFormHTML()}<button class="btn btn-primary btn-full mt-8" onclick="saveRun()">Save Run</button>`, 'Log Run');
}
function saveRun() {
  const run = collectRunForm(); if (!run) return;
  run.id = uid();
  const runs = getRuns(); runs.unshift(run); save(SK.RUNS, runs);
  closeOverlay(); renderRunningList(); showToast('Run logged! 🏃');
}

function openEditRun(id) {
  const run = getRuns().find(r => r.id === id);
  if (!run) return;
  openOverlay(`${runFormHTML(run)}
    <div style="display:flex;gap:8px;margin-top:8px">
      <button class="btn btn-primary" style="flex:1" onclick="saveEditRun('${id}')">Save Changes</button>
      <button class="btn btn-danger" onclick="deleteRun('${id}')">Delete</button>
    </div>`, 'Edit Run');
}
function saveEditRun(id) {
  const updated = collectRunForm(); if (!updated) return;
  updated.id = id;
  const runs = getRuns().map(r => r.id === id ? updated : r);
  save(SK.RUNS, runs);
  closeOverlay(); renderRunningList(); showToast('Run updated!');
}

function deleteRun(id) {
  if (!confirm('Delete this run?')) return;
  save(SK.RUNS, getRuns().filter(r => r.id !== id));
  closeOverlay(); renderRunningList(); showToast('Run deleted');
}

/* ── Splits ─────────────────────────────────────────────── */
function splitDayColor(day) {
  if (!day) return '#888';
  if (day.type === 'rest') return '#6b7280';
  if (day.type === 'run')  return '#22c55e';
  const plan = getPlans().find(p => p.id === day.planId);
  return plan?.color || '#8b5cf6';
}

function getSplitDayForDate(dateStr) {
  const override = getNutritionData()[dateStr]?.activityOverride;
  if (override) return { ...override, isOverride: true };
  const as = getActiveSplit(); if (!as) return null;
  const split = getSplits().find(s => s.id === as.splitId); if (!split?.days.length) return null;
  const d0 = parseDate(as.startDate), d1 = parseDate(dateStr);
  const diff = Math.round((d1 - d0) / 86400000);
  if (diff < 0) return null;
  return split.days[diff % split.days.length] || null;
}

function renderSplits() {
  const splits = getSplits();
  const as = getActiveSplit();
  const el = document.getElementById('wo-sub');

  let activeBanner = '';
  if (as) {
    const split = splits.find(s => s.id === as.splitId);
    if (split) {
      const todayDay = getSplitDayForDate(todayStr());
      const diff = Math.round((parseDate(todayStr()) - parseDate(as.startDate)) / 86400000);
      const cycleDay = diff >= 0 ? (diff % split.days.length) + 1 : '—';
      activeBanner = `<div class="card" style="border-color:var(--accent);background:var(--accent-glow);margin-bottom:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <div>
            <div style="font-weight:700;color:var(--accent)">${esc(split.name)}</div>
            <div style="font-size:12px;color:var(--text2)">Day ${cycleDay}/${split.days.length} · Today: <b style="color:var(--text)">${esc(todayDay?.label||'—')}</b></div>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="deactivateSplit()">Stop</button>
        </div>
      </div>`;
    }
  }

  if (!splits.length) {
    el.innerHTML = activeBanner + `<div class="empty-state">
      <div class="empty-icon">📅</div>
      <div class="empty-title">No splits yet</div>
      <div class="empty-sub">Create a repeating schedule — Push, Run, Rest, Pull… shown in the nutrition calendar.</div>
      <button class="btn btn-primary" onclick="openNewSplit()">+ Create Split</button>
    </div>`;
    return;
  }

  el.innerHTML = activeBanner + splits.map(s => {
    const isActive = as?.splitId === s.id;
    const pills = s.days.map(d => {
      const col = splitDayColor(d);
      return `<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:5px;background:${col}22;color:${col}">${esc(d.label)}</span>`;
    }).join('');
    return `<div class="plan-card">
      <div class="plan-card-header">
        <div class="plan-color-dot" style="background:${isActive?'var(--accent)':'var(--border)'}"></div>
        <span class="plan-card-name">${esc(s.name)}</span>
        <span class="plan-card-freq">${s.days.length}d cycle</span>
      </div>
      <div class="plan-card-body">
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">${pills}</div>
        <div class="plan-actions">
          ${isActive
            ? `<button class="btn btn-secondary btn-sm" style="flex:1" onclick="activateSplit('${s.id}')">↺ Reset Start</button>`
            : `<button class="btn btn-primary btn-sm" style="flex:1" onclick="activateSplit('${s.id}')">▶ Activate</button>`
          }
          <button class="btn btn-secondary btn-sm" onclick="openEditSplit('${s.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSplit('${s.id}')">✕</button>
        </div>
      </div>
    </div>`;
  }).join('') + `<button class="btn btn-secondary btn-full mt-8" onclick="openNewSplit()">+ New Split</button>`;
}

function openNewSplit() {
  state.editSplitId = null;
  state.editSplitDays = [];
  state.editSplitName = '';
  renderSplitEditor();
}

function openEditSplit(splitId) {
  const split = getSplits().find(s => s.id === splitId); if (!split) return;
  state.editSplitId = splitId;
  state.editSplitDays = split.days.map(d => ({...d}));
  state.editSplitName = split.name;
  renderSplitEditor();
}

function renderSplitEditor() {
  const isEdit = !!state.editSplitId;
  const plans = getPlans();

  const daysList = state.editSplitDays.length
    ? state.editSplitDays.map((d, i) => {
        const col = splitDayColor(d);
        const icon = d.type === 'run' ? '🏃' : d.type === 'rest' ? '😴' : '🏋️';
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
          <div style="width:30px;height:30px;border-radius:8px;background:${col}22;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">${icon}</div>
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${esc(d.label)}</div>
            <div style="font-size:11px;color:var(--text2)">${d.type==='plan'?'Workout Plan':d.type==='run'?'Run Day':'Rest Day'}</div>
          </div>
          <button class="icon-btn" style="color:var(--text3)" onclick="removeSplitDay(${i})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>`;
      }).join('')
    : `<div style="color:var(--text2);font-size:13px;padding:12px 0;text-align:center">No days yet — add some below</div>`;

  const planBtns = plans.map(p =>
    `<button class="btn btn-secondary" style="justify-content:flex-start;gap:10px" onclick="addSplitDay('plan','${p.id}')">
      <div style="width:10px;height:10px;border-radius:50%;background:${p.color||'var(--accent)'};flex-shrink:0"></div>
      ${esc(p.name)}
    </button>`
  ).join('');

  openPanel(`
    <div class="panel-header">
      <button class="panel-back" onclick="closePanel();renderSplits()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
        Cancel
      </button>
      <span class="panel-title">${isEdit ? 'Edit Split' : 'New Split'}</span>
      <button class="panel-action" onclick="saveSplit()">Save</button>
    </div>
    <div class="panel-body">
      <div class="input-group">
        <label class="input-label">Split Name</label>
        <input class="input" id="sp_name" type="text" placeholder="e.g. Push / Run / Rest"
          value="${esc(state.editSplitName)}" oninput="state.editSplitName=this.value">
      </div>
      <div style="margin-bottom:4px">
        <div class="card-title">${state.editSplitDays.length}-Day Cycle</div>
        ${daysList}
      </div>
      <div class="divider" style="margin:14px 0"></div>
      <div class="card-title" style="margin-bottom:8px">Add Day</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${planBtns || '<div style="color:var(--text2);font-size:13px;padding:4px 0">No workout plans yet — create plans first</div>'}
        <button class="btn btn-secondary" style="justify-content:flex-start;gap:10px" onclick="addSplitDay('run','')">
          <span style="font-size:16px">🏃</span> Run Day
        </button>
        <button class="btn btn-secondary" style="justify-content:flex-start;gap:10px" onclick="addSplitDay('rest','')">
          <span style="font-size:16px">😴</span> Rest Day
        </button>
      </div>
    </div>`);
}

function addSplitDay(type, planId) {
  state.editSplitName = document.getElementById('sp_name')?.value ?? state.editSplitName;
  const label = type === 'rest' ? 'Rest'
    : type === 'run'  ? 'Run'
    : (getPlans().find(p => p.id === planId)?.name || 'Workout');
  state.editSplitDays.push({ type, planId: planId||'', label });
  renderSplitEditor();
}

function removeSplitDay(i) {
  state.editSplitName = document.getElementById('sp_name')?.value ?? state.editSplitName;
  state.editSplitDays.splice(i, 1);
  renderSplitEditor();
}

function saveSplit() {
  const name = (document.getElementById('sp_name')?.value || state.editSplitName || '').trim();
  if (!name) { showToast('Enter a split name'); return; }
  if (!state.editSplitDays.length) { showToast('Add at least one day'); return; }
  const splits = getSplits();
  if (state.editSplitId) {
    const idx = splits.findIndex(s => s.id === state.editSplitId);
    if (idx >= 0) splits[idx] = { ...splits[idx], name, days: [...state.editSplitDays] };
  } else {
    splits.push({ id: uid(), name, days: [...state.editSplitDays] });
  }
  save(SK.SPLITS, splits);
  state.editSplitName = '';
  closePanel();
  renderSplits();
  showToast(state.editSplitId ? 'Split updated!' : 'Split created!');
}

function activateSplit(splitId) {
  const split = getSplits().find(s => s.id === splitId); if (!split) return;
  openOverlay(`
    <p style="color:var(--text2);font-size:13px;margin-bottom:14px">
      Which date should be <b>Day 1</b> of "<b>${esc(split.name)}</b>"?
    </p>
    <div class="input-group">
      <label class="input-label">Start Date (Day 1)</label>
      <input class="input" id="sp_start" type="date" value="${todayStr()}">
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="confirmActivateSplit('${splitId}')">Activate</button>
  `, 'Activate Split');
}

function confirmActivateSplit(splitId) {
  const startDate = document.getElementById('sp_start')?.value || todayStr();
  save(SK.ACTIVE_SPLIT, { splitId, startDate });
  closeOverlay();
  renderSplits();
  renderNutrition();
  showToast('Split activated!');
}

function deactivateSplit() {
  save(SK.ACTIVE_SPLIT, null);
  renderSplits();
  renderNutrition();
  showToast('Split deactivated');
}

function deleteSplit(splitId) {
  if (!confirm('Delete this split?')) return;
  const as = getActiveSplit();
  if (as?.splitId === splitId) save(SK.ACTIVE_SPLIT, null);
  save(SK.SPLITS, getSplits().filter(s => s.id !== splitId));
  renderSplits();
  showToast('Split deleted');
}

/* ── Muscle Model ───────────────────────────────────────── */
const MUSCLE_GROUPS = ['Chest','Back','Shoulders','Biceps','Triceps','Core','Legs'];

// Returns { group: sessionCount } for the last 28 days (unique workout days per group)
// Green ≥8 (2+/week), Orange ≥4 (1+/week), Red <4 (<1/week)
function getMuscleTrainingStatus() {
  const hist = getHistory();
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 28);
  const cutoffStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth()+1).padStart(2,'0')}-${String(cutoff.getDate()).padStart(2,'0')}`;
  const sessionDates = {};
  hist.forEach(wo => {
    if (wo.date < cutoffStr) return;
    const groups = new Set((wo.exercises||[]).map(e => e.group).filter(Boolean));
    groups.forEach(g => { if (!sessionDates[g]) sessionDates[g] = new Set(); sessionDates[g].add(wo.date); });
  });
  const counts = {};
  Object.entries(sessionDates).forEach(([g, s]) => { counts[g] = s.size; });
  return counts;
}

function muscleFreqColor(sessions) {
  if (sessions >= 8) return { hex: '#22c55e', rgb: [0.09, 0.68, 0.28] }; // green  2+/week
  if (sessions >= 4) return { hex: '#f59e0b', rgb: [0.92, 0.55, 0.03] }; // orange 1+/week
  return                    { hex: '#ef4444', rgb: [0.88, 0.18, 0.18] }; // red    <1/week
}

function colorMuscleModel(mv, status) {
  if (!mv.model) return;
  mv.model.materials.forEach(mat => {
    if (!MUSCLE_GROUPS.includes(mat.name)) return;
    const { rgb } = muscleFreqColor(status[mat.name] || 0);
    mat.pbrMetallicRoughness.setBaseColorFactor([...rgb, 1.0]);
  });
}

function muscleStatusColor(group, status) {
  const n = status[group] || 0;
  if (n >= 8) return 'rgba(34,197,94,0.72)';
  if (n >= 4) return 'rgba(245,158,11,0.65)';
  return 'rgba(239,68,68,0.58)';
}

function bodyModelSVG(view, status) {
  // Legacy — kept for reference but no longer used
  const mc = g => muscleStatusColor(g, status);
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const bf = dark ? '#252525' : '#dedad4';
  const sf = dark ? '#2e2420' : '#f0dfc8';
  const st = dark ? '#3a3a3a' : '#bbb4ac';
  const lt = dark ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.45)';

  const base = `
    <circle cx="80" cy="27" r="21" fill="${sf}" stroke="${st}" stroke-width="1.5"/>
    <rect x="73" y="46" width="14" height="16" rx="5" fill="${sf}"/>
    <path d="M 36,62 Q 57,56 80,56 Q 103,56 124,62 L 126,84 Q 103,78 80,78 Q 57,78 34,84 Z" fill="${bf}" stroke="${st}" stroke-width="1"/>
    <path d="M 38,80 L 38,122 Q 40,134 50,136 L 50,164 L 110,164 L 110,136 Q 120,134 122,122 L 122,80 Z" fill="${bf}" stroke="${st}" stroke-width="1"/>
    <path d="M 50,162 L 110,162 L 114,182 Q 98,195 80,196 Q 62,195 46,182 Z" fill="${bf}" stroke="${st}" stroke-width="1"/>
    <path d="M 36,80 Q 26,84 22,98 L 18,142 Q 18,148 24,147 L 30,147 L 34,102 L 38,80 Z" fill="${bf}" stroke="${st}" stroke-width="1"/>
    <path d="M 124,80 Q 134,84 138,98 L 142,142 Q 142,148 136,147 L 130,147 L 126,102 L 122,80 Z" fill="${bf}" stroke="${st}" stroke-width="1"/>
    <path d="M 18,142 Q 16,148 18,162 L 22,182 Q 24,187 30,186 L 32,186 L 32,147 L 18,142 Z" fill="${sf}" stroke="${st}" stroke-width="1"/>
    <path d="M 142,142 Q 144,148 142,162 L 138,182 Q 136,187 130,186 L 128,186 L 128,147 L 142,142 Z" fill="${sf}" stroke="${st}" stroke-width="1"/>
    <ellipse cx="62" cy="237" rx="23" ry="51" fill="${bf}" stroke="${st}" stroke-width="1"/>
    <ellipse cx="98" cy="237" rx="23" ry="51" fill="${bf}" stroke="${st}" stroke-width="1"/>
    <ellipse cx="57" cy="321" rx="15" ry="36" fill="${bf}" stroke="${st}" stroke-width="1"/>
    <ellipse cx="103" cy="321" rx="15" ry="36" fill="${bf}" stroke="${st}" stroke-width="1"/>
    <ellipse cx="51" cy="361" rx="18" ry="9" fill="${sf}" stroke="${st}" stroke-width="1"/>
    <ellipse cx="109" cy="361" rx="18" ry="9" fill="${sf}" stroke="${st}" stroke-width="1"/>`;

  if (view === 'front') return `<svg viewBox="0 0 160 378" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    ${base}
    <path d="M 36,62 Q 26,67 22,82 L 22,102 Q 28,110 36,106 L 36,80 Z" fill="${mc('Shoulders')}"/>
    <path d="M 124,62 Q 134,67 138,82 L 138,102 Q 132,110 124,106 L 124,80 Z" fill="${mc('Shoulders')}"/>
    <path d="M 40,80 L 40,122 Q 46,130 56,130 L 78,126 L 78,82 Q 58,78 40,80 Z" fill="${mc('Chest')}"/>
    <path d="M 120,80 L 120,122 Q 114,130 104,130 L 82,126 L 82,82 Q 102,78 120,80 Z" fill="${mc('Chest')}"/>
    <ellipse cx="22" cy="116" rx="10" ry="26" fill="${mc('Biceps')}"/>
    <ellipse cx="138" cy="116" rx="10" ry="26" fill="${mc('Biceps')}"/>
    <rect x="54" y="122" width="52" height="44" rx="8" fill="${mc('Core')}"/>
    <line x1="80" y1="122" x2="80" y2="166" stroke="${st}" stroke-width="1" opacity="0.5"/>
    <line x1="54" y1="138" x2="106" y2="138" stroke="${st}" stroke-width="1" opacity="0.5"/>
    <line x1="54" y1="154" x2="106" y2="154" stroke="${st}" stroke-width="1" opacity="0.5"/>
    <ellipse cx="62" cy="234" rx="20" ry="45" fill="${mc('Legs')}"/>
    <ellipse cx="98" cy="234" rx="20" ry="45" fill="${mc('Legs')}"/>
    <ellipse cx="57" cy="320" rx="12" ry="28" fill="${mc('Legs')}" opacity="0.75"/>
    <ellipse cx="103" cy="320" rx="12" ry="28" fill="${mc('Legs')}" opacity="0.75"/>
    <text x="29" y="93" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">DELT</text>
    <text x="131" y="93" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">DELT</text>
    <text x="59" y="102" text-anchor="middle" font-size="6.5" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">CHEST</text>
    <text x="101" y="102" text-anchor="middle" font-size="6.5" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">CHEST</text>
    <text x="22" y="115" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">BIC</text>
    <text x="138" y="115" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">BIC</text>
    <text x="80" y="146" text-anchor="middle" font-size="7" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">CORE</text>
    <text x="62" y="235" text-anchor="middle" font-size="7" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">QUAD</text>
    <text x="98" y="235" text-anchor="middle" font-size="7" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">QUAD</text>
  </svg>`;

  return `<svg viewBox="0 0 160 378" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    ${base}
    <path d="M 36,62 Q 26,67 22,82 L 22,102 Q 28,110 36,106 L 36,80 Z" fill="${mc('Shoulders')}"/>
    <path d="M 124,62 Q 134,67 138,82 L 138,102 Q 132,110 124,106 L 124,80 Z" fill="${mc('Shoulders')}"/>
    <path d="M 40,62 L 120,62 L 118,94 Q 80,100 42,94 Z" fill="${mc('Back')}"/>
    <path d="M 36,88 L 46,88 L 50,148 Q 44,156 36,150 L 32,136 Z" fill="${mc('Back')}"/>
    <path d="M 124,88 L 114,88 L 110,148 Q 116,156 124,150 L 128,136 Z" fill="${mc('Back')}"/>
    <rect x="54" y="140" width="52" height="26" rx="7" fill="${mc('Back')}"/>
    <ellipse cx="22" cy="118" rx="10" ry="26" fill="${mc('Triceps')}"/>
    <ellipse cx="138" cy="118" rx="10" ry="26" fill="${mc('Triceps')}"/>
    <path d="M 46,162 L 80,160 L 114,162 L 114,184 Q 98,196 80,196 Q 62,196 46,184 Z" fill="${mc('Legs')}"/>
    <ellipse cx="62" cy="234" rx="20" ry="45" fill="${mc('Legs')}"/>
    <ellipse cx="98" cy="234" rx="20" ry="45" fill="${mc('Legs')}"/>
    <ellipse cx="57" cy="320" rx="12" ry="30" fill="${mc('Legs')}" opacity="0.8"/>
    <ellipse cx="103" cy="320" rx="12" ry="30" fill="${mc('Legs')}" opacity="0.8"/>
    <text x="29" y="90" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">DELT</text>
    <text x="131" y="90" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">DELT</text>
    <text x="80" y="76" text-anchor="middle" font-size="6.5" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">TRAPS</text>
    <text x="40" y="122" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">LAT</text>
    <text x="120" y="122" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">LAT</text>
    <text x="80" y="156" text-anchor="middle" font-size="6.5" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">LOWER</text>
    <text x="22" y="118" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">TRI</text>
    <text x="138" y="118" text-anchor="middle" font-size="6" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">TRI</text>
    <text x="80" y="180" text-anchor="middle" font-size="7" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">GLUTES</text>
    <text x="62" y="235" text-anchor="middle" font-size="7" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">HAMS</text>
    <text x="98" y="235" text-anchor="middle" font-size="7" fill="${lt}" font-weight="700" font-family="system-ui,sans-serif">HAMS</text>
  </svg>`;
}

function initAnalyticsMuscleViewer() {
  const mv = document.getElementById('analyticsMV');
  const overlay = document.getElementById('analyticsMuscleOverlay');
  if (!mv || !overlay) return;

  const status = getMuscleTrainingStatus();
  const applyColors = () => colorMuscleModel(mv, status);
  if (mv.model) applyColors();
  else mv.addEventListener('load', applyColors, { once: true });

  // [group, side, y%] — labels positioned outside the body silhouette
  const LABEL_DEFS = [
    ['Shoulders', 'left',  22],
    ['Back',      'left',  33],
    ['Triceps',   'left',  45],
    ['Chest',     'right', 33],
    ['Biceps',    'right', 45],
    ['Core',      'right', 54],
    ['Legs',      'right', 68],
  ];

  const labelEls = {};
  LABEL_DEFS.forEach(([group, side, y]) => {
    const col = muscleFreqColor(status[group] || 0).hex;
    const isLeft = side === 'left';
    const wrap = document.createElement('div');
    wrap.style.cssText = [
      'position:absolute', isLeft ? 'left:4px' : 'right:4px', `top:${y}%`,
      'transform:translateY(-50%)', 'display:flex', 'align-items:center', 'gap:3px',
      'flex-direction:' + (isLeft ? 'row' : 'row-reverse'),
      'opacity:0', 'transition:opacity .2s', 'pointer-events:none',
    ].join(';');

    const pill = document.createElement('button');
    pill.style.cssText = [
      `background:${col}ee`, 'color:#fff', `border:1.5px solid ${col}`,
      'border-radius:20px', 'padding:3px 9px', 'font-size:10px', 'font-weight:700',
      'letter-spacing:.05em', 'cursor:pointer', 'pointer-events:auto',
      'backdrop-filter:blur(6px)', 'text-shadow:0 1px 3px rgba(0,0,0,.7)',
      'white-space:nowrap', 'line-height:1.5',
    ].join(';');
    pill.textContent = group.toUpperCase();
    pill.addEventListener('click', e => { e.stopPropagation(); showMuscleGroupOverlay(group); });

    const arrow = document.createElement('span');
    arrow.style.cssText = 'color:rgba(255,255,255,.55);font-size:11px;line-height:1;flex-shrink:0';
    arrow.textContent = isLeft ? '→' : '←';

    wrap.appendChild(pill);
    wrap.appendChild(arrow);
    overlay.appendChild(wrap);
    labelEls[group] = wrap;
  });

  let currentTheta = 0, isDragging = false, activeGroup = null;
  let freezeTimer = null, inactivityTimer = null;
  let glowFrame = null, glowPhase = 0;

  const getTheta = () => { try { const o = mv.getCameraOrbit(); return o ? o.theta * 180 / Math.PI : currentTheta; } catch { return currentTheta; } };
  const setOrbit = theta => { currentTheta = theta; mv.cameraOrbit = `${theta}deg 90deg auto`; };

  const stopGlow = () => {
    if (glowFrame) { cancelAnimationFrame(glowFrame); glowFrame = null; }
    if (mv.model) colorMuscleModel(mv, status);
  };

  const startGlow = group => {
    stopGlow();
    const base = muscleFreqColor(status[group] || 0).rgb;
    glowPhase = 0;
    const tick = () => {
      glowPhase += 0.07;
      const t = (Math.sin(glowPhase) + 1) / 2;
      if (mv.model) {
        mv.model.materials.forEach(mat => {
          if (mat.name === group) {
            const c = base.map(v => Math.min(1, v + t * 0.55));
            mat.pbrMetallicRoughness.setBaseColorFactor([...c, 1.0]);
          }
        });
      }
      glowFrame = requestAnimationFrame(tick);
    };
    tick();
  };

  const hideAll = () => {
    Object.values(labelEls).forEach(el => { el.style.opacity = '0'; el.style.pointerEvents = 'none'; });
    stopGlow();
    activeGroup = null;
  };

  const resumeAutoRotate = () => { hideAll(); mv.setAttribute('auto-rotate', ''); };

  const activateGroup = group => {
    activeGroup = group;
    mv.removeAttribute('auto-rotate');
    Object.entries(labelEls).forEach(([g, el]) => {
      const on = g === group;
      el.style.opacity = on ? '1' : '0';
      el.style.pointerEvents = on ? 'auto' : 'none';
    });
    startGlow(group);
    if (freezeTimer) clearTimeout(freezeTimer);
    if (inactivityTimer) clearTimeout(inactivityTimer);
    freezeTimer = setTimeout(resumeAutoRotate, 5000);
  };

  const resetInactivity = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (freezeTimer) clearTimeout(freezeTimer);
    hideAll();
    inactivityTimer = setTimeout(resumeAutoRotate, 4000);
  };

  // Precise 3D muscle detection using model-viewer hit coordinates
  // Model world bounds (after GLTF root transform): Y=-8..+7.88 (height), X=-3.6..+3.6, Z=-1.7..+1.7
  const detectMuscleFrom3D = (pos, normal) => {
    const y = pos.y;               // height: ~-8 feet → ~+7.9 head
    const absX = Math.abs(pos.x);  // lateral: 0 = center, ~3.6 = edge
    const isFront = normal.z > 0;  // surface normal toward camera = front face

    if (y > 6.2)  return null;     // head
    if (y < -6.5) return null;     // feet/floor
    if (y > 4.8 && absX > 1.4) return 'Shoulders';
    if (y > 4.0 && absX < 1.8) return isFront ? 'Chest' : 'Back';
    if (y > 0.5 && absX > 1.4) return isFront ? 'Biceps' : 'Triceps';
    if (y > 0.5 && absX < 1.8) return isFront ? 'Core' : 'Back';
    if (y > -6.5) return 'Legs';
    return null;
  };

  mv.addEventListener('click', e => {
    if (isDragging) return;
    currentTheta = getTheta();
    const rect = mv.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    let hit = null;
    try { hit = mv.positionAndNormalFromPoint(px, py); } catch {}
    const group = hit ? detectMuscleFrom3D(hit.position, hit.normal) : null;
    if (group) activateGroup(group);
    else { hideAll(); mv.setAttribute('auto-rotate', ''); }
  });

  let startX = 0, startTheta = 0;

  mv.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX; startTheta = getTheta(); isDragging = false;
    mv.removeAttribute('auto-rotate');
    if (freezeTimer) clearTimeout(freezeTimer);
    if (inactivityTimer) clearTimeout(inactivityTimer);
  }, { passive: true });
  mv.addEventListener('touchmove', e => {
    if (Math.abs(e.touches[0].clientX - startX) > 6) {
      isDragging = true; e.preventDefault();
      setOrbit(startTheta - (e.touches[0].clientX - startX) * 0.4);
    }
  }, { passive: false });
  mv.addEventListener('touchend', () => {
    if (isDragging) resetInactivity();
    setTimeout(() => { isDragging = false; }, 50);
  });

  mv.addEventListener('mousedown', e => {
    startX = e.clientX; startTheta = getTheta(); isDragging = false; e.preventDefault();
    mv.removeAttribute('auto-rotate');
    if (freezeTimer) clearTimeout(freezeTimer);
    if (inactivityTimer) clearTimeout(inactivityTimer);
    const onMove = ev => {
      if (Math.abs(ev.clientX - startX) > 4) { isDragging = true; setOrbit(startTheta - (ev.clientX - startX) * 0.4); }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMove);
      if (isDragging) resetInactivity();
      setTimeout(() => { isDragging = false; }, 50);
    }, { once: true });
  });
}

function showMuscleGroupOverlay(group) {
  const status = getMuscleTrainingStatus();
  const n = status[group] || 0;
  const col = muscleFreqColor(n).hex;
  const lastStr = n === 0 ? 'Not trained in last 4 weeks'
                : n >= 8  ? `${n}× in 4 weeks — on track (2+/week)`
                : n >= 4  ? `${n}× in 4 weeks — ok (1+/week)`
                :           `${n}× in 4 weeks — train more`;
  const exercises = getAllExercises().filter(e => e.group === group);
  openOverlay(`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
      <span style="width:10px;height:10px;border-radius:50%;background:${col};flex-shrink:0"></span>
      <span style="color:var(--text3);font-size:13px">${lastStr}</span>
    </div>
    <div style="font-size:11px;color:var(--text3);letter-spacing:.07em;margin-bottom:8px">EXERCISES (${exercises.length})</div>
    <div style="display:flex;flex-direction:column;gap:5px">
      ${exercises.map(ex => `
        <div style="background:var(--card);border-radius:10px;padding:9px 12px;font-size:13px;display:flex;align-items:center;gap:8px">
          <span style="width:6px;height:6px;border-radius:50%;background:${col};flex-shrink:0"></span>
          <span>${esc(ex.name)}</span>
          ${ex.custom ? '<span style="margin-left:auto;font-size:10px;color:var(--text3)">custom</span>' : ''}
        </div>`).join('')}
    </div>`, group);
}

function openMuscleMap() {
  const status = getMuscleTrainingStatus();
  state.muscleStatus = status;
  state.muscleInteract = false;

  openPanel(`
    <div class="panel-header">
      <button class="panel-back" onclick="closePanel();renderAnalytics()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <span class="panel-title">Muscle Map</span>
      <span></span>
    </div>
    <div class="panel-body" style="padding:0;overflow:hidden;height:100%;position:relative">
      <div id="modelContent" style="position:absolute;inset:0;transition:transform 0.38s cubic-bezier(.4,0,.2,1)">
        <model-viewer
          id="muscleModelViewer"
          src="male_muscles_named.glb"
          auto-rotate
          rotation-per-second="15deg"
          auto-rotate-delay="0"
          camera-orbit="0deg 90deg auto"
          camera-target="auto"
          field-of-view="110deg"
          style="width:100%;height:100%;background:transparent;--progress-bar-color:var(--accent);touch-action:none;cursor:pointer"
          loading="eager"
        ></model-viewer>
        <div id="muscleOverlay" style="position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 0.3s"></div>
      </div>
      <div id="muscleTapHint" style="position:absolute;bottom:28px;left:0;right:0;text-align:center;color:rgba(255,255,255,.38);font-size:12px;pointer-events:none;letter-spacing:.08em;transition:opacity 0.5s">
        TAP TO INTERACT
      </div>
      <div id="musclePopup" style="position:absolute;top:0;bottom:0;right:0;width:60%;background:var(--surface);border-radius:16px 0 0 16px;padding:16px 14px 28px;overflow-y:auto;box-shadow:-6px 0 28px rgba(0,0,0,.45);transform:translateX(102%);transition:transform 0.38s cubic-bezier(.4,0,.2,1)"></div>
    </div>`);
  requestAnimationFrame(initMuscleViewer);
}

function initMuscleViewer() {
  const mv = document.getElementById('muscleModelViewer');
  const overlay = document.getElementById('muscleOverlay');
  if (!mv || !overlay) return;

  const status = state.muscleStatus || {};

  const applyColors = () => colorMuscleModel(mv, status);
  if (mv.model) applyColors();
  else mv.addEventListener('load', applyColors, { once: true });

  // [group, x%, y%, side]  side: front|back|both
  const LABEL_DEFS = [
    ['Chest',     48, 30, 'front'],
    ['Shoulders', 22, 20, 'front'],
    ['Biceps',    10, 38, 'front'],
    ['Core',      48, 45, 'front'],
    ['Legs',      48, 65, 'both' ],
    ['Back',      48, 30, 'back' ],
    ['Triceps',   10, 38, 'back' ],
  ];

  const muscleColor = g => muscleFreqColor(status[g] || 0).hex;

  const labelEls = LABEL_DEFS.map(([group, x, y, side]) => {
    const col = muscleColor(group);
    const btn = document.createElement('button');
    btn.dataset.group = group;
    btn.dataset.side = side;
    btn.style.cssText = [
      'position:absolute', `left:${x}%`, `top:${y}%`,
      'transform:translate(-50%,-50%)',
      `background:${col}cc`, 'color:#fff', `border:1.5px solid ${col}`,
      'border-radius:20px', 'padding:4px 11px', 'font-size:11px', 'font-weight:700',
      'letter-spacing:.05em', 'cursor:pointer', 'pointer-events:auto',
      'backdrop-filter:blur(6px)', '-webkit-backdrop-filter:blur(6px)',
      'text-shadow:0 1px 3px rgba(0,0,0,.6)', 'white-space:nowrap',
      'transition:opacity .15s', 'line-height:1.4',
    ].join(';');
    btn.textContent = group.toUpperCase();
    btn.addEventListener('click', e => { e.stopPropagation(); showMusclePopup(group); });
    overlay.appendChild(btn);
    return btn;
  });

  let currentTheta = 0;

  const updateLabels = theta => {
    currentTheta = theta;
    const rad = (((theta % 360) + 360) % 360) * Math.PI / 180;
    const fc = Math.cos(rad);
    labelEls.forEach(el => {
      const side = el.dataset.side;
      const op = side === 'both' ? 1 : side === 'front' ? Math.max(0, fc) : Math.max(0, -fc);
      el.style.opacity = op;
      el.style.pointerEvents = op > 0.25 ? 'auto' : 'none';
    });
  };

  const enterInteract = () => {
    if (state.muscleInteract) return;
    state.muscleInteract = true;
    mv.removeAttribute('auto-rotate');
    try { const o = mv.getCameraOrbit(); if (o) currentTheta = o.theta * 180 / Math.PI; } catch {}
    overlay.style.opacity = '1';
    updateLabels(currentTheta);
    const hint = document.getElementById('muscleTapHint');
    if (hint) { hint.style.opacity = '0'; setTimeout(() => hint.remove(), 600); }
  };

  mv.addEventListener('click', enterInteract);

  let startX = 0, startTheta = 0, dragging = false;
  const getTheta = () => {
    try { const o = mv.getCameraOrbit(); return o ? o.theta * 180 / Math.PI : currentTheta; }
    catch { return currentTheta; }
  };
  const setOrbit = theta => {
    mv.cameraOrbit = `${theta}deg 90deg auto`;
    if (state.muscleInteract) updateLabels(theta);
  };

  mv.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX; startTheta = getTheta(); dragging = true;
  }, { passive: true });
  mv.addEventListener('touchmove', e => {
    if (!dragging) return;
    if (Math.abs(e.touches[0].clientX - startX) > 6) {
      enterInteract();
      e.preventDefault();
      setOrbit(startTheta - (e.touches[0].clientX - startX) * 0.4);
    }
  }, { passive: false });
  mv.addEventListener('touchend', () => { dragging = false; });

  mv.addEventListener('mousedown', e => {
    startX = e.clientX; startTheta = getTheta(); dragging = true;
    e.preventDefault();
    const onMove = ev => {
      if (!dragging) return;
      if (Math.abs(ev.clientX - startX) > 4) { enterInteract(); setOrbit(startTheta - (ev.clientX - startX) * 0.4); }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', () => { dragging = false; document.removeEventListener('mousemove', onMove); }, { once: true });
  });
}

function showMusclePopup(group) {
  const popup = document.getElementById('musclePopup');
  const modelContent = document.getElementById('modelContent');
  if (!popup) return;

  const status = state.muscleStatus || {};
  const n = status[group] || 0;
  const col = muscleFreqColor(n).hex;
  const lastStr = n === 0 ? 'Not trained in last 4 weeks'
                : n >= 8  ? `${n}× — on track (2+/week)`
                : n >= 4  ? `${n}× — ok (1+/week)`
                :           `${n}× — train more`;
  const exercises = getAllExercises().filter(e => e.group === group);

  const closeMusclePopup = () => {
    popup.style.transform = 'translateX(102%)';
    if (modelContent) modelContent.style.transform = '';
  };

  popup.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:8px;min-width:0">
        <span style="width:11px;height:11px;border-radius:50%;background:${col};flex-shrink:0"></span>
        <span style="font-size:15px;font-weight:700;white-space:nowrap">${group}</span>
      </div>
      <button id="musclePopupClose" style="background:none;border:none;padding:4px;cursor:pointer;color:var(--text3);line-height:0;flex-shrink:0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:12px">${lastStr}</div>
    <div style="font-size:11px;color:var(--text3);letter-spacing:.07em;margin-bottom:8px">EXERCISES (${exercises.length})</div>
    <div style="display:flex;flex-direction:column;gap:5px">
      ${exercises.map(ex => `
        <div style="background:var(--card);border-radius:10px;padding:8px 10px;font-size:12px;display:flex;align-items:center;gap:7px">
          <span style="width:6px;height:6px;border-radius:50%;background:${col};flex-shrink:0"></span>
          <span>${esc(ex.name)}</span>
          ${ex.custom ? '<span style="margin-left:auto;font-size:10px;color:var(--text3)">custom</span>' : ''}
        </div>`).join('')}
    </div>`;

  document.getElementById('musclePopupClose').addEventListener('click', closeMusclePopup);

  // Slide in popup from right, slide model to left
  popup.style.transform = 'translateX(0)';
  if (modelContent) modelContent.style.transform = 'translateX(-26%) scale(0.72)';

  setTimeout(() => {
    const handler = e => {
      if (!popup.contains(e.target) && !e.target.closest('[data-group]')) {
        closeMusclePopup();
        document.removeEventListener('touchstart', handler);
        document.removeEventListener('mousedown', handler);
      }
    };
    document.addEventListener('touchstart', handler, { passive: true });
    document.addEventListener('mousedown', handler);
  }, 60);
}

/* ═══════════════════════════════════════════════════════════
   ANALYTICS
═══════════════════════════════════════════════════════════ */
function renderAnalytics() {
  const el = document.getElementById('tab-analytics');
  const ws = weekStartStr();
  const hist = getHistory(), runs = getRuns();

  const woWeek = hist.filter(w => w.date >= ws).length;
  const runWeek = runs.filter(r => r.date >= ws).reduce((s,r)=>s+r.distance, 0);
  const last7 = getLast7Days();
  const weekCals = last7.map(d=>getDayTotals(d).calories).filter(c=>c>0);
  const weekPros = last7.map(d=>getDayTotals(d).protein).filter(c=>c>0);
  const avgCal = weekCals.length ? Math.round(weekCals.reduce((a,b)=>a+b,0)/weekCals.length) : 0;
  const avgPro = weekPros.length ? Math.round(weekPros.reduce((a,b)=>a+b,0)/weekPros.length) : 0;

  const allExNames = [...new Set(hist.flatMap(w=>(w.exercises||[]).map(e=>e.name)))];
  if (!state.analyticsGymExercise && allExNames.length) state.analyticsGymExercise = allExNames[0];
  const exOpts = allExNames.map(n=>`<option value="${esc(n)}"${n===state.analyticsGymExercise?' selected':''}>${esc(n)}</option>`).join('');
  const muscleStatus = getMuscleTrainingStatus();
  const trainedThisWeek = MUSCLE_GROUPS.filter(g => (muscleStatus[g]||99) <= 7).length;

  el.innerHTML = `
    <div class="section-hd"><span class="section-title">This Week</span></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">🏋️</div><div><span class="stat-val">${woWeek}</span></div><div class="stat-lbl">Workouts</div></div>
      <div class="stat-card"><div class="stat-icon">🏃</div><div><span class="stat-val">${runWeek.toFixed(1)}</span><span class="stat-unit">km</span></div><div class="stat-lbl">Running</div></div>
      <div class="stat-card"><div class="stat-icon">🔥</div><div><span class="stat-val">${avgCal}</span><span class="stat-unit">kcal</span></div><div class="stat-lbl">Avg Calories</div></div>
      <div class="stat-card"><div class="stat-icon">🥩</div><div><span class="stat-val">${avgPro}</span><span class="stat-unit">g</span></div><div class="stat-lbl">Avg Protein</div></div>
    </div>

    <div class="chart-card" style="padding:0;overflow:hidden;margin-top:10px">
      <div style="position:relative;height:420px">
        <model-viewer
          id="analyticsMV"
          src="male_muscles_named.glb"
          auto-rotate
          rotation-per-second="15deg"
          auto-rotate-delay="0"
          camera-orbit="0deg 90deg 300%"
          camera-target="auto"
          field-of-view="75deg"
          environment-image="neutral"
          exposure="1.6"
          tone-mapping="neutral"
          style="width:100%;height:100%;background:transparent;--progress-bar-color:var(--accent);touch-action:none;cursor:pointer"
          loading="eager"
        ></model-viewer>
        <div id="analyticsMuscleOverlay" style="position:absolute;inset:0;pointer-events:none;overflow:hidden"></div>
      </div>
      <div style="padding:8px 12px 12px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid var(--border)">
        ${MUSCLE_GROUPS.map(g => {
          const col = muscleStatusColor(g, muscleStatus);
          const n = muscleStatus[g] || 0;
          const tag = n === 0 ? '' : ` · ${n}×`;
          return `<button onclick="showMuscleGroupOverlay('${g}')" style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;background:${col};color:#fff;border:none;cursor:pointer;letter-spacing:.03em">${g}${tag}</button>`;
        }).join('')}
      </div>
    </div>

    <div class="section-hd mt-8"><span class="section-title">Nutrition</span></div>
    <div class="chart-card">
      <div class="chart-title">Calories — Last 30 Days</div>
      <div class="chart-wrap"><canvas id="c_cal" height="160"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Protein — Last 30 Days</div>
      <div class="chart-wrap"><canvas id="c_pro" height="160"></canvas></div>
    </div>

    <div class="section-hd mt-8"><span class="section-title">Body Weight</span></div>
    <div class="chart-card">
      <div class="chart-title">Weight — Last 30 Days (kg)</div>
      <div class="chart-wrap"><canvas id="c_weight" height="160"></canvas></div>
    </div>

    <div class="section-hd mt-8"><span class="section-title">Gym Progress</span></div>
    <div class="chart-card">
      <div class="input-group" style="margin-bottom:10px">
        <select class="input" id="gymExSel" onchange="state.analyticsGymExercise=this.value;drawGymCharts()">
          ${allExNames.length ? exOpts : '<option value="">No workout history yet</option>'}
        </select>
      </div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:6px">Avg weight per session (kg)</div>
      <div class="chart-wrap"><canvas id="c_gym_w" height="150"></canvas></div>
      <div style="font-size:12px;color:var(--text2);margin:12px 0 6px">Estimated 1RM — Epley formula (kg)</div>
      <div class="chart-wrap"><canvas id="c_gym_1rm" height="140"></canvas></div>
    </div>

    <div class="section-hd mt-8"><span class="section-title">Running</span></div>
    <div class="chart-card">
      <div class="chart-title">Pace — Normal Runs (min/km)</div>
      <div class="chart-wrap"><canvas id="c_run_pace" height="150"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Weekly Distance (km)</div>
      <div class="chart-wrap"><canvas id="c_run_wk" height="150"></canvas></div>
    </div>
    ${runs.some(r=>r.type==='interval') ? `<div class="chart-card">
      <div class="chart-title" style="color:#f97316">⚡ Interval Sessions — Reps per Session</div>
      <div class="chart-wrap"><canvas id="c_run_intervals" height="140"></canvas></div>
    </div>` : ''}` ;

  requestAnimationFrame(() => { drawNutCharts(); drawWeightChart(); drawGymCharts(); drawRunCharts(); initAnalyticsMuscleViewer(); });
}

function drawNutCharts() {
  const days = getLast30Days();
  const labels = days.map(d => { const dt=parseDate(d); return `${dt.getMonth()+1}/${dt.getDate()}`; });
  const goals = getGoals();
  const cal = document.getElementById('c_cal'); if (cal) drawBar(cal, labels, days.map(d=>getDayTotals(d).calories), { color:'#8b5cf6', goalLine:goals.calories });
  const pro = document.getElementById('c_pro'); if (pro) drawBar(pro, labels, days.map(d=>getDayTotals(d).protein),  { color:'#3b82f6', goalLine:goals.protein });
}

function drawWeightChart() {
  const days = getLast30Days();
  const data = getNutritionData();
  const labels = days.map(d => { const dt=parseDate(d); return `${dt.getMonth()+1}/${dt.getDate()}`; });
  const weights = days.map(d => {
    const dd = data[d];
    if (!dd) return null;
    if (dd.weights?.length) {
      const avg = dd.weights.reduce((s,w)=>s+w.value,0) / dd.weights.length;
      return Math.round(avg * 10) / 10;
    }
    return dd.weight ? parseFloat(dd.weight) : null;
  });
  const wc = document.getElementById('c_weight');
  if (wc) drawLine(wc, labels, [{ values: weights, color: '#8b5cf6' }]);
}

function drawGymCharts() {
  const exName = state.analyticsGymExercise || document.getElementById('gymExSel')?.value;
  if (!exName) return;
  const sessions = getHistory()
    .filter(w=>(w.exercises||[]).some(e=>e.name===exName))
    .sort((a,b)=>a.date.localeCompare(b.date)).slice(-20);
  const labels = sessions.map(w=>fmtShort(w.date));
  const avgW = sessions.map(w => {
    const sets = (w.exercises||[]).find(e=>e.name===exName)?.sets || [];
    const weights = sets.map(s=>parseFloat(s.weight)||0).filter(v=>v>0);
    return weights.length ? Math.round(weights.reduce((a,b)=>a+b,0)/weights.length*10)/10 : 0;
  });
  const orm = sessions.map(w => {
    const sets = (w.exercises||[]).find(e=>e.name===exName)?.sets||[];
    return Math.max(...sets.map(s => { const wt=parseFloat(s.weight)||0, r=parseFloat(s.reps)||0; return wt&&r ? Math.round(wt*(1+r/30)) : 0; }), 0);
  });
  const wc = document.getElementById('c_gym_w');   if (wc)  drawLine(wc,  labels, [{values:avgW, color:'#f59e0b'}]);
  const rc = document.getElementById('c_gym_1rm'); if (rc)  drawLine(rc,  labels, [{values:orm,   color:'#ef4444'}]);
}

function drawRunCharts() {
  const allRuns = getRuns().sort((a,b)=>a.date.localeCompare(b.date));
  // Pace chart: normal runs only (pace meaningless for intervals)
  const normalRuns = allRuns.filter(r => r.type !== 'interval').slice(-20);
  const paceLabels = normalRuns.map(r=>fmtShort(r.date));
  const paces = normalRuns.map(r => r.distance&&r.time ? parseFloat((r.time/60/r.distance).toFixed(2)) : 0);
  const pc = document.getElementById('c_run_pace');
  if (pc) drawLine(pc, paceLabels, [{values:paces, color:'#22c55e'}]);

  // Weekly distance: all runs
  const wkData = getWeeklyRunDist(8);
  const wc = document.getElementById('c_run_wk');
  if (wc) drawBar(wc, wkData.labels, wkData.values, { color:'#14b8a6' });

  // Interval summary chart if any exist
  const intervalRuns = allRuns.filter(r => r.type === 'interval').slice(-15);
  const ic = document.getElementById('c_run_intervals');
  if (ic && intervalRuns.length) {
    const iLabels = intervalRuns.map(r=>fmtShort(r.date));
    const iCounts = intervalRuns.map(r=>r.intervals||0);
    drawBar(ic, iLabels, iCounts, { color:'#f97316' });
  }
}

function getWeeklyRunDist(n) {
  const runs = getRuns(); const now = new Date();
  const labels=[], values=[];
  for (let w=n-1; w>=0; w--) {
    const ws = new Date(now); const dow = ws.getDay()||7; ws.setDate(now.getDate()-(dow-1)-w*7); ws.setHours(0,0,0,0);
    const we = new Date(ws); we.setDate(ws.getDate()+7);
    const s=`${ws.getFullYear()}-${String(ws.getMonth()+1).padStart(2,'0')}-${String(ws.getDate()).padStart(2,'0')}`;
    const e=`${we.getFullYear()}-${String(we.getMonth()+1).padStart(2,'0')}-${String(we.getDate()).padStart(2,'0')}`;
    const dist=runs.filter(r=>r.date>=s&&r.date<e).reduce((a,r)=>a+r.distance,0);
    labels.push(`W${n-w}`); values.push(parseFloat(dist.toFixed(1)));
  }
  return { labels, values };
}

/* ═══════════════════════════════════════════════════════════
   CHART ENGINE
═══════════════════════════════════════════════════════════ */
function initCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio||1, 2);
  const card = canvas.closest('.chart-card');
  const w = card ? Math.max(100, card.clientWidth - 32) : 300;
  const h = parseInt(canvas.getAttribute('height')) || 160;
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  return { ctx, w, h };
}
function cTheme() {
  const dark=document.documentElement.getAttribute('data-theme')==='dark';
  return { text:dark?'#777':'#666', grid:dark?'rgba(255,255,255,.07)':'rgba(0,0,0,.07)' };
}

function drawBar(canvas, labels, values, opts={}) {
  const {ctx,w,h}=initCanvas(canvas);
  const {color='#8b5cf6', goalLine=null}=opts;
  const th=cTheme();
  const P={t:10,r:8,b:28,l:38};
  const cw=w-P.l-P.r, ch=h-P.t-P.b;
  ctx.clearRect(0,0,w,h);

  const max=Math.max(...values,goalLine||0)*1.18||100;
  const step=Math.pow(10,Math.floor(Math.log10(max/4)));
  const niceMax=Math.ceil(max/step)*step;

  // grid
  for(let i=0;i<=4;i++){
    const y=P.t+ch-ch*i/4;
    ctx.strokeStyle=th.grid; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P.l,y); ctx.lineTo(P.l+cw,y); ctx.stroke();
    ctx.fillStyle=th.text; ctx.font='10px system-ui'; ctx.textAlign='right';
    ctx.fillText(Math.round(niceMax*i/4), P.l-4, y+3.5);
  }

  const bw=Math.max(2,(cw/labels.length)*0.65);
  const gap=(cw/labels.length-bw)/2;
  const stepLbl=Math.ceil(labels.length/8);

  labels.forEach((lbl,i) => {
    const v=values[i]||0;
    const bh=(v/niceMax)*ch;
    const x=P.l+(i/labels.length)*cw+gap;
    const y=P.t+ch-bh;
    const bc=(goalLine&&v>=goalLine*0.9)?'#22c55e':color;
    ctx.fillStyle=bc;
    if(ctx.roundRect){ctx.beginPath();ctx.roundRect(x,y,bw,bh,2);ctx.fill();}
    else ctx.fillRect(x,y,bw,bh);
    if(i%stepLbl===0||i===labels.length-1){
      ctx.fillStyle=th.text; ctx.font='9px system-ui'; ctx.textAlign='center';
      ctx.fillText(lbl, x+bw/2, h-P.b+13);
    }
  });

  if(goalLine&&goalLine>0){
    const y=P.t+ch-(goalLine/niceMax)*ch;
    ctx.strokeStyle='#22c55e'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(P.l,y); ctx.lineTo(P.l+cw,y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#22c55e'; ctx.font='9px system-ui'; ctx.textAlign='right';
    ctx.fillText('goal', P.l+cw, y-3);
  }
}

function drawLine(canvas, labels, datasets, opts={}) {
  const {ctx,w,h}=initCanvas(canvas);
  const th=cTheme();
  const P={t:10,r:8,b:28,l:38};
  const cw=w-P.l-P.r, ch=h-P.t-P.b;
  ctx.clearRect(0,0,w,h);

  const allV=datasets.flatMap(d=>d.values).filter(v=>v!=null&&v>0);
  if(!allV.length){
    ctx.fillStyle=th.text; ctx.font='13px system-ui'; ctx.textAlign='center';
    ctx.fillText('No data yet', w/2, h/2); return;
  }
  const minV=Math.min(...allV), maxV=Math.max(...allV);
  const pad=(maxV-minV)*0.12||maxV*0.1||1;
  const lo=minV-pad, hi=maxV+pad, range=hi-lo;

  for(let i=0;i<=4;i++){
    const y=P.t+ch-ch*i/4;
    ctx.strokeStyle=th.grid; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P.l,y); ctx.lineTo(P.l+cw,y); ctx.stroke();
    ctx.fillStyle=th.text; ctx.font='10px system-ui'; ctx.textAlign='right';
    ctx.fillText((lo+range*i/4).toFixed(1), P.l-4, y+3.5);
  }

  const n=labels.length;
  const xOf=i => P.l+(n>1?i/(n-1):0.5)*cw;
  const yOf=v => P.t+ch-((v-lo)/range)*ch;

  datasets.forEach(({values,color}) => {
    const pts=values.map((v,i)=>v!=null?{x:xOf(i),y:yOf(v)}:null);
    ctx.strokeStyle=color; ctx.lineWidth=2.5; ctx.lineJoin='round';
    ctx.beginPath(); let first=true;
    pts.forEach(p=>{ if(!p)return; if(first){ctx.moveTo(p.x,p.y);first=false;}else ctx.lineTo(p.x,p.y); });
    ctx.stroke();
    ctx.fillStyle=color;
    pts.forEach(p=>{ if(!p)return; ctx.beginPath();ctx.arc(p.x,p.y,3.5,0,Math.PI*2);ctx.fill(); });
  });

  const stepLbl=Math.ceil(n/7);
  ctx.fillStyle=th.text; ctx.font='9px system-ui';
  labels.forEach((lbl,i) => {
    if(i%stepLbl!==0&&i!==n-1) return;
    ctx.textAlign=i===0?'left':i===n-1?'right':'center';
    ctx.fillText(lbl, xOf(i), h-P.b+13);
  });
}

/* ═══════════════════════════════════════════════════════════
   EXPORT / IMPORT
═══════════════════════════════════════════════════════════ */
function exportData() {
  const d={
    exported:new Date().toISOString(),
    nutrition:load(SK.NUTRITION,{}), goals:load(SK.GOALS,DEFAULT_GOALS),
    plans:load(SK.PLANS,[]), history:load(SK.HISTORY,[]),
    runs:load(SK.RUNS,[]), customExercises:load(SK.CUSTOM_EX,[]),
  };
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));
  a.download=`fittrack-${todayStr()}.json`; a.click();
  showToast('Exported!');
}
function importData() {
  const input=document.createElement('input');
  input.type='file'; input.accept='.json';
  input.onchange=e=>{
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=ev=>{
      try {
        const d=JSON.parse(ev.target.result);
        if(d.nutrition) save(SK.NUTRITION,d.nutrition);
        if(d.goals)     save(SK.GOALS,d.goals);
        if(d.plans)     save(SK.PLANS,d.plans);
        if(d.history)   save(SK.HISTORY,d.history);
        if(d.runs)      save(SK.RUNS,d.runs);
        if(d.customExercises) save(SK.CUSTOM_EX,d.customExercises);
        renderCurrentTab(); showToast('Imported!');
      } catch { showToast('Invalid file'); }
    };
    r.readAsText(file);
  };
  input.click();
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
function init() {
  loadTheme();
  state.activeWorkout = load(SK.ACTIVE_WO, null);

  document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab))
  );
  document.getElementById('btnTheme')?.addEventListener('click', toggleTheme);
  document.getElementById('btnExport')?.addEventListener('click', () =>
    openOverlay(`
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn btn-secondary btn-full" onclick="exportData();closeOverlay()">⬇ Export JSON Backup</button>
        <button class="btn btn-secondary btn-full" onclick="importData();closeOverlay()">⬆ Import JSON Backup</button>
      </div>`, 'Data Backup')
  );
  document.getElementById('overlay')?.addEventListener('click', e => { if(e.target.id==='overlay') closeOverlay(); });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  renderNutrition();
}

document.addEventListener('DOMContentLoaded', init);
