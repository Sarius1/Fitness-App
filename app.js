'use strict';

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const SK = {
  NUTRITION: 'ft_nut', GOALS: 'ft_goals', PLANS: 'ft_plans',
  HISTORY: 'ft_hist', RUNS: 'ft_runs', SETTINGS: 'ft_settings',
  ACTIVE_WO: 'ft_active_wo', CUSTOM_EX: 'ft_custom_ex',
  SPLITS: 'ft_splits', ACTIVE_SPLIT: 'ft_active_split',
  REPEAT_MEALS: 'ft_rmeal',
  SUPPLEMENTS: 'ft_suppl', SUPPL_LOG: 'ft_suppl_log',
  STEPS: 'ft_steps', REMINDERS: 'ft_reminders',
};
const DEFAULT_GOALS = { calories: 2500, protein: 150, carbs: 300, fat: 70 };
const GROUP_COLORS = {
  // Broad (backwards-compat)
  'Chest':'#ff6b6b','Back':'#4ecdc4','Shoulders':'#45b7d1',
  'Biceps':'#a8e6cf','Triceps':'#ffd93d','Legs':'#c9b1ff',
  'Core':'#ff9f43','Full Body':'#6c63ff','Custom':'#888','Runs':'#22c55e',
  // Specific
  'Upper Chest':'#ff9999',
  'Lats':'#22d3ee',
  'Traps':'#06b6d4',
  'Lower Back':'#0891b2',
  'Front Delts':'#fb923c',
  'Side Delts':'#f97316',
  'Rear Delts':'#ea580c',
  'Forearms':'#a3e635',
  'Quads':'#e879f9',
  'Hamstrings':'#c026d3',
  'Glutes':'#db2777',
  'Adductors':'#f43f5e',
  'Abductors':'#fb7185',
  'Calves':'#2dd4bf',
  'Abs':'#facc15',
  'Obliques':'#ca8a04',
};
const PLAN_COLORS = ['#8b5cf6','#3b82f6','#22c55e','#f59e0b','#ef4444','#ec4899','#14b8a6','#f97316'];
const GIF = '%C3%BCbungsmodelle/';
const EXERCISE_DB = [
  // ── Runs ────────────────────────────────────────────────
  {id:'r001',name:'Run',              group:'Runs', groups:['Runs']},
  {id:'r002',name:'Intervall Run',   group:'Runs', groups:['Runs']},
  {id:'r003',name:'Tempo Run',       group:'Runs', groups:['Runs']},
  // ── Chest ───────────────────────────────────────────────
  {id:'p001',name:'Bankdrücken',                 group:'Chest',       groups:['Chest'],                        gif:GIF+'Bench%20press.gif'},
  {id:'p002',name:'Butterfly-Maschine',          group:'Chest',       groups:['Chest'],                        gif:GIF+'butterfly_uebung-butterfly_maschine.gif'},
  {id:'p003',name:'Hebel-Schrägbankdrücken',     group:'Upper Chest', groups:['Upper Chest'],                  gif:GIF+'Lever-Incline-Chest-Press.gif'},
  // ── Back ────────────────────────────────────────────────
  {id:'p004',name:'Latzug',                      group:'Lats',        groups:['Lats'],                         gif:GIF+'lat%20pulldown.gif'},
  {id:'p005',name:'Maschinen-Rudern (sitzend)',  group:'Lats',        groups:['Lats','Traps'],                 gif:GIF+'Seated-Machine-Row.gif'},
  {id:'p006',name:'T-Stangen-Rudern (Maschine)',group:'Traps',       groups:['Traps','Rear Delts'],           gif:GIF+'t-bar-row-machine.gif'},
  // ── Shoulders ───────────────────────────────────────────
  {id:'p007',name:'Maschinen-Schulterpresse',    group:'Front Delts', groups:['Front Delts','Side Delts'],     gif:GIF+'Machine-Shoulder-Press.gif'},
  {id:'p008',name:'Maschinen-Seitheben',         group:'Side Delts',  groups:['Side Delts'],                   gif:GIF+'Lateral%20raise%20machine.gif'},
  {id:'p009',name:'Hintere Schulter (Maschine)',group:'Rear Delts',  groups:['Rear Delts'],                   gif:GIF+'rear%20delts.gif'},
  // ── Arms ────────────────────────────────────────────────
  {id:'p010',name:'Preacher Curl',               group:'Biceps',      groups:['Biceps'],                       gif:GIF+'Preacher-Curl.gif'},
  {id:'p011',name:'Trizeps Pushdown',            group:'Triceps',     groups:['Triceps'],                      gif:GIF+'Tricep%20Pushdown.gif'},
  {id:'p012',name:'Einarm Trizeps Pushdown',     group:'Triceps',     groups:['Triceps'],                      gif:GIF+'One-arm-triceps-pushdown.gif'},
  // ── Legs ────────────────────────────────────────────────
  {id:'p013',name:'Hack Squat',                  group:'Quads',       groups:['Quads'],                        gif:GIF+'hack-squat-min.gif'},
  {id:'p014',name:'Beinstreckmaschine',          group:'Quads',       groups:['Quads'],                        gif:GIF+'leg-extension-machine.gif'},
  {id:'p015',name:'Liegend Beincurl',            group:'Hamstrings',  groups:['Hamstrings'],                   gif:GIF+'Lying-leg-curl-gif.gif'},
  {id:'p016',name:'Adduktoren-Maschine',         group:'Adductors',   groups:['Adductors'],                    gif:GIF+'adductors.gif'},
  {id:'p017',name:'Abduktoren-Maschine',         group:'Abductors',   groups:['Abductors'],                    gif:GIF+'Abductor%20machine.gif'},
  // ── Core ────────────────────────────────────────────────
  {id:'p018',name:'Bauchmuskel-Maschine',        group:'Abs',         groups:['Abs'],                          gif:GIF+'abs.gif'},
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
  pickerMachineSettings: {},
  pickerPlanColor: PLAN_COLORS[0],
  pickerPlanName: '',
  pickerPlanFreq: '2',
  editSplitDays: [],
  editSplitId: null,
  editSplitName: '',
  bodyModelRotation: 0,
  timerInterval: null,
  analyticsGymExercise: '',
  analyticsRange: '30d',
  historyFilter: '',
  runTypeFilter: 'all',
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
   I18N
═══════════════════════════════════════════════════════════ */
// Keys identical in both languages — no need to duplicate
const TR_SHARED = {
  tab_workouts:'Workouts', tab_analytics:'Analytics', supplements:'Supplements',
  protein:'Protein', start:'▶ Start', normal:'Normal', tempo:'Tempo',
  work_time:'Work Time (hh:mm:ss)', rest_time:'Rest Time (hh:mm:ss)',
  gym_progress:'Gym Progress', pace_chart:'Pace — Normal Runs (min/km)',
  reminder_text:'Text', language:'Sprache / Language',
};
const TR = {
  de: {
    tab_nutrition:'Ernährung', tab_workouts:'Workouts', tab_analytics:'Analytics',
    calendar:'Kalender', meals:'Mahlzeiten', supplements:'Supplements',
    back:'Zurück', save:'Speichern', cancel:'Abbrechen', delete:'Löschen', edit:'Bearbeiten',
    name:'Name', date:'Datum', notes_opt:'Notizen (optional)', search:'Suchen…',
    log_today:'+ Heute loggen', goals:'Ziele', on_track:'Grün = auf Kurs',
    body_weight:'Körpergewicht', food_log:'Essensprotokoll', no_food:'Noch nichts eingetragen',
    add_food:'+ Essen hinzufügen', steps:'Schritte', log_run:'🏃 Run loggen',
    add_supplement:'+ Supplement hinzufügen', no_supplements:'Keine Supplements eingetragen',
    dosage:'Dosierung (optional)', supplement_saved:'Supplement gespeichert!',
    saved_meals:'Gespeicherte Mahlzeiten', no_saved_meals:'Keine gespeicherten Mahlzeiten',
    save_meal:'+ Neue Mahlzeit speichern', meal_saved:'Mahlzeit gespeichert!',
    new_meal:'Neue Mahlzeit', saved:'Gespeicherte',
    calories:'Kalorien', protein:'Protein', carbs:'Kohlenhydrate', fat:'Fett',
    add:'Hinzufügen', meal_title:'Mahlzeit speichern', food_name:'Lebensmittel',
    save_goals:'Ziele speichern', goals_saved:'Ziele gespeichert!', daily_goals:'⚙ Tagesziele',
    add_activity:'+ Aktivität für diesen Tag', change:'Ändern', reset_split:'↩ Zurück zum Split',
    custom_today:'Angepasst für heute', planned:'Geplant',
    no_plans:'Noch keine Pläne', create_plan:'+ Plan erstellen', new_plan:'+ Neuer Plan',
    resume:'Fortsetzen', start:'▶ Start', plan_name:'Planname', color:'Farbe',
    choose_ex:'+ Übungen wählen', edit_ex:'Übungen bearbeiten', create:'Plan erstellen',
    save_changes:'Änderungen speichern', new_plan_title:'Neuer Plan', edit_plan_title:'Plan bearbeiten',
    selected:'ausgewählt', no_ex_found:'Keine Übungen gefunden',
    add_custom_ex:'+ Eigene Übung hinzufügen', save_plan:'Plan speichern', target_km:'Ziel km',
    cancel_workout:'✕ Abbrechen', finish_workout:'✓ Abschließen',
    last_sets:'Zuletzt:', no_history:'Kein Verlauf', add_set:'+ Satz hinzufügen',
    min_set:'Mindestens 1 Satz benötigt', machine_settings:'Maschineneinstellung',
    settings_for:'Einstellungen für', locker_prompt:'Schließfach / Spindel (optional)',
    start_workout:'▶ Training starten',
    no_workouts:'Noch keine Workouts', sets_total:'Sätze gesamt', tap_edit:'Tippen zum Bearbeiten',
    duration:'Dauer', all_plans:'Alle Pläne',
    run_log_title:'Run loggen', run_saved:'Run gespeichert! 🏃',
    no_runs:'Noch keine Läufe', type:'Typ', all:'Alle', normal:'Normal', interval:'Intervall', tempo:'Tempo',
    distance_km:'Distanz (km)', total_time:'Gesamtzeit (hh:mm:ss)',
    intervals_n:'Anzahl Intervalle', work_time:'Work Time (hh:mm:ss)', rest_time:'Rest Time (hh:mm:ss)',
    save_run:'Lauf speichern', run_loggen:'+ Run loggen',
    this_week:'Diese Woche', avg_calories:'Ø Kalorien', avg_protein:'Ø Protein',
    days_7:'7 Tage', days_30:'30 Tage', total:'Gesamt',
    nutrition_section:'Ernährung', body_weight_section:'Körpergewicht', weight_kg:'Gewicht (kg)',
    steps_per_day:'Schritte pro Tag', gym_progress:'Gym Progress', running_section:'Laufen',
    pace_chart:'Pace — Normal Runs (min/km)', weekly_dist:'Wöchentliche Distanz (km)',
    no_hist:'Noch kein Verlauf', avg_weight:'Ø Gewicht pro Session (kg)',
    settings:'Einstellungen', theme:'Design', dark:'🌙 Dunkel', light:'☀️ Hell',
    step_goal:'Schrittziel', reminders:'Erinnerungen', no_reminders:'Keine Erinnerungen',
    add_reminder:'+ Erinnerung hinzufügen', reminder_title:'Erinnerung hinzufügen',
    reminder_text:'Text', reminder_time:'Uhrzeit', reminder_saved:'Erinnerung gespeichert!',
    language:'Sprache', weight_logged:'kg gespeichert!', steps_saved:'Schritte gespeichert!',
    food_saved:'Essen gespeichert!', enter_name:'Name eingeben',
    edit_food_title:'Gericht bearbeiten', activity_set:'Aktivität gesetzt!', reset_done:'Zurückgesetzt',
    splits_tab:'Splits', plans_tab:'Pläne', history_tab:'Verlauf', running_tab:'Laufen',
    custom_ex_title:'Eigene Übung', ex_name:'Übungsname', muscle_group:'Muskelgruppe',
    interval_chart:'⚡ Intervall-Sessions — Wiederholungen',
  },
  en: {
    tab_nutrition:'Nutrition', tab_workouts:'Workouts', tab_analytics:'Analytics',
    calendar:'Calendar', meals:'Saved Meals', supplements:'Supplements',
    back:'Back', save:'Save', cancel:'Cancel', delete:'Delete', edit:'Edit',
    name:'Name', date:'Date', notes_opt:'Notes (optional)', search:'Search…',
    log_today:'+ Log Today', goals:'Goals', on_track:'Green = on track',
    body_weight:'Body Weight', food_log:'Food Log', no_food:'No food logged yet',
    add_food:'+ Add Food', steps:'Steps', log_run:'🏃 Log Run',
    add_supplement:'+ Add Supplement', no_supplements:'No supplements added',
    dosage:'Dosage (optional)', supplement_saved:'Supplement saved!',
    saved_meals:'Saved Meals', no_saved_meals:'No saved meals',
    save_meal:'+ Save New Meal', meal_saved:'Meal saved!',
    new_meal:'New Meal', saved:'Saved',
    calories:'Calories', protein:'Protein', carbs:'Carbs', fat:'Fat',
    add:'Add', meal_title:'Save Meal', food_name:'Food Name',
    save_goals:'Save Goals', goals_saved:'Goals saved!', daily_goals:'⚙ Daily Goals',
    add_activity:'+ Add Activity for this day', change:'Change', reset_split:'↩ Reset to split plan',
    custom_today:'Custom for today', planned:'Planned',
    no_plans:'No plans yet', create_plan:'+ Create Plan', new_plan:'+ New Plan',
    resume:'Resume', start:'▶ Start', plan_name:'Plan Name', color:'Color',
    choose_ex:'+ Choose Exercises', edit_ex:'Manage Exercises', create:'Create Plan',
    save_changes:'Save Changes', new_plan_title:'New Plan', edit_plan_title:'Edit Plan',
    selected:'selected', no_ex_found:'No exercises found',
    add_custom_ex:'+ Add Custom Exercise', save_plan:'Save Plan', target_km:'Target km',
    cancel_workout:'✕ Cancel', finish_workout:'✓ Finish',
    last_sets:'Last:', no_history:'No history', add_set:'+ Add Set',
    min_set:'Need at least 1 set', machine_settings:'Machine Settings',
    settings_for:'Settings for', locker_prompt:'Locker / Spindle (optional)',
    start_workout:'▶ Start Workout',
    no_workouts:'No workouts yet', sets_total:'sets total', tap_edit:'tap to edit',
    duration:'Duration', all_plans:'All Plans',
    run_log_title:'Log Run', run_saved:'Run saved! 🏃',
    no_runs:'No runs yet', type:'Type', all:'All', normal:'Normal', interval:'Interval', tempo:'Tempo',
    distance_km:'Distance (km)', total_time:'Total Time (hh:mm:ss)',
    intervals_n:'Number of Intervals', work_time:'Work Time (hh:mm:ss)', rest_time:'Rest Time (hh:mm:ss)',
    save_run:'Save Run', run_loggen:'+ Log Run',
    this_week:'This Week', avg_calories:'Avg Calories', avg_protein:'Avg Protein',
    days_7:'7 Days', days_30:'30 Days', total:'Total',
    nutrition_section:'Nutrition', body_weight_section:'Body Weight', weight_kg:'Weight (kg)',
    steps_per_day:'Steps per Day', gym_progress:'Gym Progress', running_section:'Running',
    pace_chart:'Pace — Normal Runs (min/km)', weekly_dist:'Weekly Distance (km)',
    no_hist:'No workout history yet', avg_weight:'Avg weight per session (kg)',
    settings:'Settings', theme:'Theme', dark:'🌙 Dark', light:'☀️ Light',
    step_goal:'Step Goal', reminders:'Reminders', no_reminders:'No reminders',
    add_reminder:'+ Add Reminder', reminder_title:'Add Reminder',
    reminder_text:'Text', reminder_time:'Time', reminder_saved:'Reminder saved!',
    language:'Language', weight_logged:'kg logged!', steps_saved:'Steps saved!',
    food_saved:'Food saved!', enter_name:'Enter name',
    edit_food_title:'Edit Food', activity_set:'Activity set!', reset_done:'Reset to split',
    splits_tab:'Splits', plans_tab:'Plans', history_tab:'History', running_tab:'Running',
    custom_ex_title:'Custom Exercise', ex_name:'Exercise Name', muscle_group:'Muscle Group',
    interval_chart:'⚡ Interval Sessions — Reps per Session',
  },
};
const lang = () => (load(SK.SETTINGS, {}).language || 'de');
const t = k => TR[lang()]?.[k] ?? TR_SHARED[k] ?? TR.de[k] ?? k;

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════ */
const TAB_TITLES = () => ({ nutrition:t('tab_nutrition'), workouts:t('tab_workouts'), analytics:t('tab_analytics') });

function switchTab(tab) {
  state.tab = tab;
  document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('topbarTitle').textContent = TAB_TITLES()[tab];
  renderCurrentTab();
}
function renderCurrentTab() {
  document.getElementById('topbarTitle').textContent = TAB_TITLES()[state.tab];
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
  const t_today = todayStr();

  const suppls = getSupplements();
  const supplLog = suppls.length ? getSupplLog() : {};
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
    const daySupplLog = supplLog[ds] || {};
    const takenSuppl = suppls.filter(s => daySupplLog[s.id]);
    const supplDots = takenSuppl.length
      ? `<div style="display:flex;gap:1px;flex-wrap:wrap;margin-top:2px">${takenSuppl.map(() =>
          `<svg viewBox="0 0 8 8" width="6" height="6"><polyline points="1,4 3,6 7,2" stroke="#22c55e" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        ).join('')}</div>`
      : '';
    cells += `<div class="cal-day${ds===t_today?' today':''}" onclick="openDayView('${ds}')">
      <div class="cal-day-num">${d}</div>
      ${sdBadge}
      <div class="cal-mini-bars">
        <div class="cal-mini-bar"><div class="cal-mini-bar-fill" style="width:${has?cpct:0}%;background:${cc}"></div></div>
        <div class="cal-mini-bar"><div class="cal-mini-bar-fill" style="width:${has?ppct:0}%;background:${pc}"></div></div>
      </div>
      ${supplDots}
    </div>`;
  }

  const nutView = state.nutritionView || 'calendar';
  const repeatMeals = getRepeatMeals();
  const supplements = getSupplements();

  const repeatMealsHtml = repeatMeals.length
    ? repeatMeals.map(rm => `
        <div style="display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid var(--border)">
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${esc(rm.name)}</div>
            <div style="font-size:11px;color:var(--text3)">${rm.calories} kcal · P ${rm.protein}g · C ${rm.carbs}g · F ${rm.fat}g</div>
          </div>
          <button class="icon-btn" style="color:var(--danger)" onclick="deleteRepeatMeal('${rm.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>`).join('')
    : `<div style="color:var(--text3);font-size:13px;padding:16px 0;text-align:center">${t('no_saved_meals')}</div>`;

  const supplHtml = supplements.length
    ? supplements.map(s => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${esc(s.name)}</div>
            ${s.dose ? `<div style="font-size:11px;color:var(--text3)">${esc(s.dose)}</div>` : ''}
          </div>
          <button class="icon-btn" style="color:var(--danger)" onclick="deleteSupplement('${s.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>`).join('')
    : `<div style="color:var(--text3);font-size:13px;padding:16px 0;text-align:center">${t('no_supplements')}</div>`;

  const tabBtn = (view, lbl) => {
    const active = nutView === view;
    return `<button onclick="state.nutritionView='${view}';renderNutrition()" style="flex:1;padding:7px;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;background:${active?'var(--accent)':'transparent'};color:${active?'#fff':'var(--text2)'}">${lbl}</button>`;
  };

  el.innerHTML = `
    <div style="display:flex;gap:0;margin-bottom:10px;background:var(--card);border-radius:12px;padding:3px">
      ${tabBtn('calendar',t('calendar'))}
      ${tabBtn('meals',t('meals'))}
      ${tabBtn('supplements',t('supplements'))}
    </div>
    ${nutView === 'calendar' ? `
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
        <span><span style="display:inline-block;width:8px;height:4px;border-radius:2px;background:#22c55e;margin-right:3px;vertical-align:middle"></span>${t('calories')}</span>
        <span><span style="display:inline-block;width:8px;height:4px;border-radius:2px;background:#8b5cf6;margin-right:3px;vertical-align:middle"></span>${t('protein')}</span>
        <span style="margin-left:auto;color:var(--text3)">${t('on_track')}</span>
      </div>
      <div class="cal-grid">${cells}</div>
    </div>
    <div style="display:flex;gap:8px;padding:2px">
      <button class="btn btn-secondary btn-sm" style="flex:1" onclick="openGoalsModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
        ${t('goals')}
      </button>
      <button class="btn btn-primary btn-sm" style="flex:1" onclick="openDayView('${t_today}')">${t('log_today')}</button>
    </div>`
    : nutView === 'meals' ? `
    <div class="card">
      <div class="card-title">${t('saved_meals')}</div>
      ${repeatMealsHtml}
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="openSaveRepeatMealModal()">${t('save_meal')}</button>`
    : `
    <div class="card">
      <div class="card-title">${t('supplements')}</div>
      ${supplHtml}
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="openAddSupplementModal()">${t('add_supplement')}</button>`}
  `;
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
        ${sd.type==='plan'&&sd.planId?`<button class="btn btn-sm btn-primary" onclick="promptStartWorkout('${sd.planId}')">▶ Start</button>`:''}
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
    const rawPct = goals[k] > 0 ? (tot[k]/goals[k])*100 : 0;
    const barPct = Math.min(rawPct, 120);
    const dispPct = goals[k] > 0 ? Math.round(rawPct) : 0;
    const cls = barColor(rawPct);
    return `<div class="prog-bar-wrap">
      <div class="prog-bar-top">
        <span class="prog-bar-label">${k.charAt(0).toUpperCase()+k.slice(1)}</span>
        <span class="prog-bar-val">${tot[k]}${unit} / ${goals[k]}${unit} (${dispPct}%)</span>
      </div>
      <div class="prog-bar-track"><div class="prog-bar-fill ${cls}" style="width:${barPct}%"></div></div>
    </div>`;
  }).join('');

  const foodsHtml = foods.length
    ? foods.map(f => `<div class="food-item">
        <div class="food-info" style="flex:1;min-width:0">
          <div class="food-name">${esc(f.name)}</div>
          <div class="food-macros">P ${f.protein}g · C ${f.carbs}g · F ${f.fat}g</div>
        </div>
        <span class="food-cal">${f.calories} kcal</span>
        <button class="icon-btn" style="color:var(--text2);padding:4px" onclick="openEditFoodModal('${dateStr}','${f.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="icon-btn food-delete" onclick="deleteFood('${dateStr}','${f.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>`).join('')
    : `<div style="text-align:center;padding:20px 0;color:var(--text2);font-size:14px">${t("no_food")}</div>`;

  const stepsData = getSteps();
  const todaySteps = stepsData[dateStr] || 0;
  const stepGoal = getSettings().stepGoal || 0;

  openPanel(`
    <div class="panel-header">
      <button class="panel-back" onclick="closePanel();renderNutrition()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
        ${t('back')}
      </button>
      <span class="panel-title">${fmtShort(dateStr)}</span>
    </div>
    <div class="panel-body">
      ${splitBanner}
      <div class="card" style="margin-bottom:10px">
        <div class="card-title">${t('body_weight')}</div>
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
        <div class="card-title">${t('food_log')}</div>
        ${foodsHtml}
        <button class="btn btn-secondary btn-sm" style="margin-top:10px;width:100%" onclick="openAddFoodModal('${dateStr}')">${t('add_food')}</button>
      </div>
      <div class="card mt-12">
        <div class="card-title">${t('steps')}</div>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="input" id="steps_input" type="number" inputmode="numeric" placeholder="z.B. 8500"
            value="${todaySteps || ''}" style="flex:1;text-align:right;font-size:16px;font-weight:700;padding:9px 12px">
          ${stepGoal ? `<span style="font-size:12px;color:var(--text3);white-space:nowrap">/ ${stepGoal}</span>` : ''}
          <button class="btn btn-primary btn-sm" onclick="saveSteps('${dateStr}')">Speichern</button>
        </div>
        ${todaySteps && stepGoal ? `<div class="prog-bar-track" style="margin-top:8px"><div class="prog-bar-fill prog-bar-green" style="width:${Math.min((todaySteps/stepGoal)*100,100)}%"></div></div>` : ''}
      </div>
      <button class="btn btn-secondary btn-full mt-12" onclick="openAddRunFromDay('${dateStr}')">🏃 Run loggen</button>
      ${renderDaySupplements(dateStr)}
    </div>`);
}

function openAddFoodModal(dateStr) {
  const meals = getRepeatMeals();
  const savedMealsHtml = meals.length
    ? meals.map(rm => `
        <button class="btn btn-secondary" style="justify-content:flex-start;flex-direction:column;align-items:flex-start;gap:2px;margin-bottom:5px" onclick="addRepeatMealToDay('${dateStr}','${rm.id}')">
          <span style="font-weight:700">${esc(rm.name)}</span>
          <span style="font-size:11px;color:var(--text3)">${rm.calories} kcal · P ${rm.protein}g · C ${rm.carbs}g · F ${rm.fat}g</span>
        </button>`).join('')
    : `<div style="color:var(--text3);font-size:13px;padding:8px 0">Noch keine gespeicherten Mahlzeiten</div>`;

  openOverlay(`
    <div style="display:flex;gap:6px;margin-bottom:14px">
      <button id="tab_new" onclick="toggleFoodTab('new','${dateStr}')" style="flex:1;padding:8px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:var(--accent);color:#fff">${t('new_meal')}</button>
      <button id="tab_saved" onclick="toggleFoodTab('saved','${dateStr}')" style="flex:1;padding:8px;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:var(--card);color:var(--text2)">${t('saved')}</button>
    </div>
    <div id="food_tab_new">
      <div class="input-group">
        <label class="input-label">${t('food_name')}</label>
        <input class="input" id="fn_name" type="text" placeholder="z.B. Haferflocken mit Milch">
      </div>
      <div class="input-row">
        <div class="input-group">
          <label class="input-label">${t('calories')}</label>
          <input class="input" id="fn_cal" type="number" inputmode="decimal" placeholder="0">
        </div>
        <div class="input-group">
          <label class="input-label">${t('protein')} (g)</label>
          <input class="input" id="fn_pro" type="number" inputmode="decimal" placeholder="0">
        </div>
      </div>
      <div class="input-row">
        <div class="input-group">
          <label class="input-label">${t('carbs')} (g)</label>
          <input class="input" id="fn_carb" type="number" inputmode="decimal" placeholder="0">
        </div>
        <div class="input-group">
          <label class="input-label">${t('fat')} (g)</label>
          <input class="input" id="fn_fat" type="number" inputmode="decimal" placeholder="0">
        </div>
      </div>
      <button class="btn btn-primary btn-full mt-8" onclick="submitFood('${dateStr}')">Hinzufügen</button>
    </div>
    <div id="food_tab_saved" style="display:none">
      ${savedMealsHtml}
    </div>`, 'Mahlzeit hinzufügen');
  setTimeout(() => document.getElementById('fn_name')?.focus(), 80);
}

function toggleFoodTab(tab, dateStr) {
  document.getElementById('food_tab_new').style.display   = tab === 'new'   ? '' : 'none';
  document.getElementById('food_tab_saved').style.display = tab === 'saved' ? '' : 'none';
  document.getElementById('tab_new').style.background    = tab === 'new'   ? 'var(--accent)' : 'var(--card)';
  document.getElementById('tab_new').style.color         = tab === 'new'   ? '#fff' : 'var(--text2)';
  document.getElementById('tab_saved').style.background  = tab === 'saved' ? 'var(--accent)' : 'var(--card)';
  document.getElementById('tab_saved').style.color       = tab === 'saved' ? '#fff' : 'var(--text2)';
}

function addRepeatMealToDay(dateStr, mealId) {
  const meal = getRepeatMeals().find(m => m.id === mealId);
  if (!meal) return;
  const data = getNutritionData();
  if (!data[dateStr]) data[dateStr] = { foods: [] };
  data[dateStr].foods.push({ id: uid(), name: meal.name, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat });
  save(SK.NUTRITION, data);
  closeOverlay();
  openDayView(dateStr);
  showToast(`${meal.name} hinzugefügt!`);
}

function openSaveRepeatMealModal() {
  openOverlay(`
    <div class="input-group">
      <label class="input-label">Name</label>
      <input class="input" id="rm_name" type="text" placeholder="z.B. Haferflocken">
    </div>
    <div class="input-row">
      <div class="input-group">
        <label class="input-label">Calories</label>
        <input class="input" id="rm_cal" type="number" inputmode="decimal" placeholder="0">
      </div>
      <div class="input-group">
        <label class="input-label">Protein (g)</label>
        <input class="input" id="rm_pro" type="number" inputmode="decimal" placeholder="0">
      </div>
    </div>
    <div class="input-row">
      <div class="input-group">
        <label class="input-label">Carbs (g)</label>
        <input class="input" id="rm_carb" type="number" inputmode="decimal" placeholder="0">
      </div>
      <div class="input-group">
        <label class="input-label">Fat (g)</label>
        <input class="input" id="rm_fat" type="number" inputmode="decimal" placeholder="0">
      </div>
    </div>
    <button class="btn btn-primary btn-full mt-8" onclick="submitRepeatMeal()">Speichern</button>`, t('meal_title'));
  setTimeout(() => document.getElementById('rm_name')?.focus(), 80);
}

function submitRepeatMeal() {
  const name = document.getElementById('rm_name')?.value.trim();
  if (!name) { showToast('Name eingeben'); return; }
  const meals = getRepeatMeals();
  meals.push({
    id: uid(), name,
    calories: parseFloat(document.getElementById('rm_cal')?.value) || 0,
    protein:  parseFloat(document.getElementById('rm_pro')?.value) || 0,
    carbs:    parseFloat(document.getElementById('rm_carb')?.value) || 0,
    fat:      parseFloat(document.getElementById('rm_fat')?.value) || 0,
  });
  save(SK.REPEAT_MEALS, meals);
  closeOverlay();
  renderNutrition();
  showToast(t('meal_saved'));
}

function deleteRepeatMeal(id) {
  save(SK.REPEAT_MEALS, getRepeatMeals().filter(m => m.id !== id));
  renderNutrition();
}

/* ── Supplements ────────────────────────────────────────── */
function openAddSupplementModal() {
  openOverlay(`
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="input-group">
        <label class="input-label">${t('name')}</label>
        <input class="input" id="suppl_name" type="text" placeholder="z.B. Vitamin D3">
      </div>
      <div class="input-group">
        <label class="input-label">${t('dosage')}</label>
        <input class="input" id="suppl_dose" type="text" placeholder="z.B. 1000 IE, 2 Kapseln">
      </div>
      <button class="btn btn-primary btn-full" onclick="saveNewSupplement()">Speichern</button>
    </div>`, t('add_supplement'));
}

function saveNewSupplement() {
  const name = document.getElementById('suppl_name')?.value.trim();
  if (!name) { showToast('Name eingeben'); return; }
  const dose = document.getElementById('suppl_dose')?.value.trim() || null;
  const suppl = getSupplements();
  suppl.push({ id: uid(), name, dose });
  save(SK.SUPPLEMENTS, suppl);
  closeOverlay();
  renderNutrition();
  showToast(t('supplement_saved'));
}

function deleteSupplement(id) {
  save(SK.SUPPLEMENTS, getSupplements().filter(s => s.id !== id));
  const log = getSupplLog();
  Object.keys(log).forEach(ds => { delete log[ds][id]; });
  save(SK.SUPPL_LOG, log);
  renderNutrition();
}

function renderDaySupplements(dateStr) {
  const suppl = getSupplements();
  if (!suppl.length) return '';
  const log = getSupplLog();
  const taken = log[dateStr] || {};
  const rows = suppl.map(s => {
    const checked = !!taken[s.id];
    return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)">
      <button data-suppl="${s.id}" onclick="toggleSupplLog('${dateStr}','${s.id}')"
        style="width:24px;height:24px;border-radius:6px;border:2px solid ${checked?'var(--accent)':'var(--border)'};background:${checked?'var(--accent)':'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer">
        ${checked?'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>':''}
      </button>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:600;${checked?'text-decoration:line-through;opacity:.5':''}">${esc(s.name)}</div>
        ${s.dose?`<div style="font-size:11px;color:var(--text3)">${esc(s.dose)}</div>`:''}
      </div>
    </div>`;
  }).join('');
  return `<div class="card mt-12">
    <div class="card-title">${t('supplements')}</div>
    ${rows}
  </div>`;
}

function toggleSupplLog(dateStr, supplId) {
  const log = getSupplLog();
  if (!log[dateStr]) log[dateStr] = {};
  const nowChecked = !log[dateStr][supplId];
  log[dateStr][supplId] = nowChecked;
  save(SK.SUPPL_LOG, log);
  const btn = document.querySelector(`[data-suppl="${supplId}"]`);
  if (btn) {
    btn.style.borderColor = nowChecked ? 'var(--accent)' : 'var(--border)';
    btn.style.background  = nowChecked ? 'var(--accent)' : 'transparent';
    btn.innerHTML = nowChecked ? '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>' : '';
    const label = btn.nextElementSibling?.querySelector('div');
    if (label) label.style.cssText = nowChecked ? 'font-size:14px;font-weight:600;text-decoration:line-through;opacity:.5' : 'font-size:14px;font-weight:600;';
  }
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
  showToast(t('food_saved'));
}

function deleteFood(dateStr, foodId) {
  const data = getNutritionData();
  if (data[dateStr]) { data[dateStr].foods = (data[dateStr].foods||[]).filter(f => f.id !== foodId); save(SK.NUTRITION, data); }
  openDayView(dateStr);
}

function openEditFoodModal(dateStr, foodId) {
  const data = getNutritionData();
  const f = (data[dateStr]?.foods || []).find(x => x.id === foodId);
  if (!f) return;
  openOverlay(`
    <div style="display:flex;flex-direction:column;gap:10px">
      <div class="input-group"><label class="input-label">Name</label><input class="input" id="ef_name" type="text" value="${esc(f.name)}"></div>
      <div class="input-row">
        <div class="input-group"><label class="input-label">${t('calories')}</label><input class="input" id="ef_cal" type="number" inputmode="decimal" value="${f.calories}"></div>
        <div class="input-group"><label class="input-label">Protein (g)</label><input class="input" id="ef_pro" type="number" inputmode="decimal" value="${f.protein}"></div>
      </div>
      <div class="input-row">
        <div class="input-group"><label class="input-label">${t('carbs')} (g)</label><input class="input" id="ef_carb" type="number" inputmode="decimal" value="${f.carbs}"></div>
        <div class="input-group"><label class="input-label">${t('fat')} (g)</label><input class="input" id="ef_fat" type="number" inputmode="decimal" value="${f.fat}"></div>
      </div>
      <button class="btn btn-primary btn-full" onclick="saveEditFood('${dateStr}','${foodId}')">Speichern</button>
    </div>`, t('edit_food_title'));
}

function saveEditFood(dateStr, foodId) {
  const name = document.getElementById('ef_name')?.value.trim();
  if (!name) { showToast('Name eingeben'); return; }
  const data = getNutritionData();
  const foods = data[dateStr]?.foods || [];
  const idx = foods.findIndex(f => f.id === foodId);
  if (idx < 0) return;
  foods[idx] = {
    ...foods[idx], name,
    calories: parseFloat(document.getElementById('ef_cal')?.value) || 0,
    protein:  parseFloat(document.getElementById('ef_pro')?.value) || 0,
    carbs:    parseFloat(document.getElementById('ef_carb')?.value) || 0,
    fat:      parseFloat(document.getElementById('ef_fat')?.value) || 0,
  };
  save(SK.NUTRITION, data);
  closeOverlay();
  openDayView(dateStr);
}

function saveSteps(dateStr) {
  const val = parseInt(document.getElementById('steps_input')?.value) || 0;
  const steps = getSteps();
  steps[dateStr] = val;
  save(SK.STEPS, steps);
  showToast(t('steps_saved'));
  openDayView(dateStr);
}

function openAddRunFromDay(dateStr) {
  openOverlay(`${runFormHTML({ date: dateStr })}<button class="btn btn-primary btn-full mt-8" onclick="saveRunFromDay('${dateStr}')">Run speichern</button>`, t('run_log_title'));
}

function saveRunFromDay(dateStr) {
  const run = collectRunForm(); if (!run) return;
  run.id = uid();
  const runs = getRuns(); runs.unshift(run); save(SK.RUNS, runs);
  closeOverlay();
  showToast(t('run_saved'));
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
        <button class="btn btn-secondary btn-full" onclick="clearDayActivity('${dateStr}')">↩ ${t('reset_done')} plan</button>` : ''}
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
  showToast(t('activity_set'));
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
  showToast(t('reset_done'));
}

function openGoalsModal() {
  const g = getGoals();
  openOverlay(`
    <div class="input-row">
      <div class="input-group"><label class="input-label">${t('calories')} (kcal)</label><input class="input" id="g_cal" type="number" inputmode="decimal" value="${g.calories}"></div>
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
  closeOverlay(); renderNutrition(); showToast(t('goals_saved'));
}

/* ═══════════════════════════════════════════════════════════
   WORKOUTS
═══════════════════════════════════════════════════════════ */
const getPlans        = () => load(SK.PLANS,         []);
const getHistory      = () => load(SK.HISTORY,       []);
const getRuns         = () => load(SK.RUNS,           []);
const getSplits       = () => load(SK.SPLITS,         []);
const getActiveSplit  = () => load(SK.ACTIVE_SPLIT,   null);
const getAllExercises  = () => {
  const custom = load(SK.CUSTOM_EX, []).map(e => ({
    ...e,
    group: Array.isArray(e.groups) ? e.groups[0] : (e.group || 'Custom'),
    groups: e.groups || (e.group ? [e.group] : ['Custom']),
  }));
  return [...EXERCISE_DB, ...custom];
};
const getRepeatMeals  = () => load(SK.REPEAT_MEALS,   []);
const getSupplements  = () => load(SK.SUPPLEMENTS,    []);
const getSupplLog     = () => load(SK.SUPPL_LOG,      {});
const getSteps        = () => load(SK.STEPS,          {});
const getReminders    = () => load(SK.REMINDERS,      []);
const getSettings     = () => load(SK.SETTINGS,       {});
const exMachineLabels = ex => ({ l1: ex?.seatLabel || 'Sitz', l2: ex?.chestLabel || 'Brust' });

function getAnalyticsDays() {
  const range = state.analyticsRange || '30d';
  if (range === '7d') return getLast7Days();
  if (range === '30d') return getLast30Days();
  const allData = getNutritionData();
  const histDates = getHistory().map(w => w.date);
  const runDates = getRuns().map(r => r.date);
  const allDates = [...Object.keys(allData), ...histDates, ...runDates].filter(Boolean).sort();
  if (!allDates.length) return getLast30Days();
  const start = parseDate(allDates[0]);
  const now = new Date(); now.setHours(0,0,0,0);
  const days = [];
  for (let d = new Date(start); d <= now; d.setDate(d.getDate()+1)) {
    days.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
  }
  return days;
}

function renderWorkouts() {
  const el = document.getElementById('tab-workouts');
  const sub = state.workoutSubTab;
  const subLabels = { plans:t('plans_tab'), splits:t('splits_tab'), history:t('history_tab'), running:t('running_tab') };
  const tabs = ['plans','splits','history','running'].map(s =>
    `<button class="sub-tab${sub===s?' active':''}" onclick="switchWorkoutSub('${s}')">${subLabels[s]}</button>`
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
      <button class="btn btn-primary btn-sm" onclick="resumeWorkout()">${t('resume')}</button>
    </div>
  </div>`;

  if (!plans.length) {
    el.innerHTML = banner + `<div class="empty-state">
      <div class="empty-icon">🏋️</div>
      <div class="empty-title">${t('no_plans')}</div>
      <div class="empty-sub">Create your first workout plan — Push, Pull, Legs, or anything you like.</div>
      <button class="btn btn-primary" onclick="openNewPlan()">${t('create_plan')}</button>
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
          <button class="btn btn-primary btn-sm" style="flex:1" onclick="startWorkout('${p.id}')">${t('start')}</button>
          <button class="btn btn-secondary btn-sm" onclick="openEditPlan('${p.id}')">${t('edit')}</button>
          <button class="btn btn-danger btn-sm" onclick="deletePlan('${p.id}')">✕</button>
        </div>
      </div>
    </div>`;
  }).join('');
  el.innerHTML = banner + html + `<button class="btn btn-secondary btn-full mt-8" onclick="openNewPlan()">${t('new_plan')}</button>`;
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

function renderPlanExList() {
  if (!state.pickerSelected.length) return '';
  const allEx = getAllExercises();
  const items = state.pickerSelected.map(id => {
    const ex = allEx.find(e => e.id === id);
    if (!ex) return '';
    const ms = state.pickerMachineSettings[id] || {};
    const col = GROUP_COLORS[ex.group] || '#888';
    const isRun = ex.group === 'Runs';
    const lbl1 = ms.seatLabel ?? 'Sitz';
    const lbl2 = ms.chestLabel ?? 'Brust';
    const extraFields = isRun
      ? `<span style="font-size:10px;color:var(--text3)">Ziel km</span>
         <input type="text" inputmode="decimal" placeholder="–" id="ms_seat_${id}" value="${esc(ms.seatPos||'')}"
           style="width:52px;font-size:12px;padding:2px 5px;background:var(--card2);border:1px solid var(--border);border-radius:6px;color:var(--text1);text-align:center"
           onchange="(state.pickerMachineSettings['${id}']||(state.pickerMachineSettings['${id}']={})).seatPos=this.value.trim()||null">`
      : `<input type="text" placeholder="Sitz" id="ms_lbl1_${id}" value="${esc(lbl1)}"
           style="width:46px;font-size:11px;padding:2px 5px;background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--text3);text-align:center"
           onchange="(state.pickerMachineSettings['${id}']||(state.pickerMachineSettings['${id}']={})).seatLabel=this.value.trim()||'Sitz'">
         <input type="text" placeholder="–" id="ms_seat_${id}" value="${esc(ms.seatPos||'')}"
           style="width:42px;font-size:12px;padding:2px 5px;background:var(--card2);border:1px solid var(--border);border-radius:6px;color:var(--text1);text-align:center"
           onchange="(state.pickerMachineSettings['${id}']||(state.pickerMachineSettings['${id}']={})).seatPos=this.value.trim()||null">
         <input type="text" placeholder="Brust" id="ms_lbl2_${id}" value="${esc(lbl2)}"
           style="width:46px;font-size:11px;padding:2px 5px;background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--text3);text-align:center"
           onchange="(state.pickerMachineSettings['${id}']||(state.pickerMachineSettings['${id}']={})).chestLabel=this.value.trim()||'Brust'">
         <input type="text" placeholder="–" id="ms_chest_${id}" value="${esc(ms.chestSupport||'')}"
           style="width:42px;font-size:12px;padding:2px 5px;background:var(--card2);border:1px solid var(--border);border-radius:6px;color:var(--text1);text-align:center"
           onchange="(state.pickerMachineSettings['${id}']||(state.pickerMachineSettings['${id}']={})).chestSupport=this.value.trim()||null">`;
    return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)">
      <div style="width:26px;height:26px;border-radius:6px;background:${col};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0">${ex.group.substring(0,2).toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(ex.name)}</div>
        <div style="display:flex;gap:6px;margin-top:4px;align-items:center;flex-wrap:wrap">${extraFields}</div>
      </div>
    </div>`;
  }).join('');
  return `<div style="margin-bottom:10px">${items}</div>`;
}

function openNewPlan(preserveSelection = false) {
  if (!preserveSelection) { state.pickerSelected = []; state.pickerMachineSettings = {}; state.pickerPlanColor = PLAN_COLORS[0]; }
  openOverlay(`
    <div class="input-group"><label class="input-label">${t('plan_name')}</label><input class="input" id="pn_name" type="text" placeholder="e.g. Push Day" value="${esc(state.pickerPlanName||'')}"></div>
    <div class="input-group"><label class="input-label">${t('color')}</label><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">${colorSwatches(state.pickerPlanColor)}</div></div>
    <button class="btn btn-secondary btn-full" style="margin-bottom:10px" onclick="openExPicker(null,'new')">${t('choose_ex')} <span style="color:var(--accent)">${state.pickerSelected.length ? '('+state.pickerSelected.length+')' : ''}</span></button>
    ${renderPlanExList()}
    <button class="btn btn-primary btn-full" onclick="savePlan(null)">${t('create')}</button>`, 'Neuer Plan');
}

function openEditPlan(planId) {
  const plan = getPlans().find(p => p.id === planId);
  if (!plan) return;
  state.pickerSelected = (plan.exercises||[]).map(e => e.id);
  state.pickerPlanColor = plan.color || PLAN_COLORS[0];
  state.pickerMachineSettings = {};
  (plan.exercises||[]).forEach(e => {
    state.pickerMachineSettings[e.id] = {
      seatPos: e.seatPos || null, chestSupport: e.chestSupport || null,
      seatLabel: e.seatLabel || 'Sitz', chestLabel: e.chestLabel || 'Brust',
    };
  });
  openOverlay(`
    <div class="input-group"><label class="input-label">Plan Name</label><input class="input" id="pn_name" type="text" value="${esc(plan.name)}"></div>
    <div class="input-group"><label class="input-label">Color</label><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">${colorSwatches(state.pickerPlanColor)}</div></div>
    <button class="btn btn-secondary btn-full" style="margin-bottom:10px" onclick="openExPicker('${planId}','edit')">${t('edit_ex')} <span style="color:var(--accent)">(${state.pickerSelected.length})</span></button>
    ${renderPlanExList()}
    <button class="btn btn-primary btn-full" onclick="savePlan('${planId}')">${t('save_changes')}</button>`, 'Plan bearbeiten');
}

function savePlan(planId) {
  const name = (document.getElementById('pn_name')?.value || state.pickerPlanName || '').trim();
  if (!name) { showToast('Planname eingeben'); return; }
  const color = state.pickerPlanColor || PLAN_COLORS[0];
  const allEx = getAllExercises();
  const allPlans = getPlans();
  const existing = planId ? (allPlans.find(p=>p.id===planId)?.exercises || []) : [];
  const exercises = state.pickerSelected.map(id => {
    const ex = allEx.find(e => e.id === id);
    const prev = existing.find(e => e.id === id);
    const ms = state.pickerMachineSettings[id] || {};
    const seatPos      = document.getElementById('ms_seat_'+id)?.value.trim()  || ms.seatPos      || prev?.seatPos      || null;
    const chestSupport = document.getElementById('ms_chest_'+id)?.value.trim() || ms.chestSupport || prev?.chestSupport || null;
    const seatLabel    = document.getElementById('ms_lbl1_'+id)?.value.trim()  || ms.seatLabel    || prev?.seatLabel    || 'Sitz';
    const chestLabel   = document.getElementById('ms_lbl2_'+id)?.value.trim()  || ms.chestLabel   || prev?.chestLabel   || 'Brust';
    return ex ? { id:ex.id, name:ex.name, group:ex.group, sets:prev?.sets||3, reps:prev?.reps||'8-12', seatPos, chestSupport, seatLabel, chestLabel } : null;
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
  state.pickerSelected.forEach(id => {
    if (!state.pickerMachineSettings[id]) state.pickerMachineSettings[id] = {};
    const ms = state.pickerMachineSettings[id];
    ms.seatPos     = document.getElementById('ms_seat_'+id)?.value.trim() || null;
    ms.chestSupport= document.getElementById('ms_chest_'+id)?.value.trim() || null;
    const l1 = document.getElementById('ms_lbl1_'+id)?.value.trim();
    const l2 = document.getElementById('ms_lbl2_'+id)?.value.trim();
    if (l1) ms.seatLabel = l1;
    if (l2) ms.chestLabel = l2;
  });
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
    const isCustom = e.id?.startsWith('c_');
    const groupLabel = Array.isArray(e.groups) && e.groups.length > 1 ? e.groups.join(', ') : esc(e.group);
    const editBtn = isCustom
      ? `<button class="icon-btn" style="color:var(--text3);padding:4px;flex-shrink:0" onclick="event.stopPropagation();openCustomEx('${planId}','${mode}','${e.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>`
      : '';
    const gifThumb = e.gif
      ? `<img src="${e.gif}" style="width:44px;height:44px;object-fit:cover;border-radius:6px;flex-shrink:0;background:var(--card2)">`
      : `<div class="ex-badge" style="background:${col};flex-shrink:0">${abbr}</div>`;
    return `<div class="ex-row${sel?' selected':''}" data-exid="${e.id}" onclick="toggleEx('${e.id}','${planId}','${mode}')">
      ${gifThumb}
      <div style="flex:1;min-width:0"><div class="ex-row-name">${esc(e.name)}</div><div class="ex-row-group" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${groupLabel}</div></div>
      ${editBtn}
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
      <span class="panel-title">${state.pickerSelected.length} ${t('selected')}</span>
      <button class="panel-action" onclick="closePanel();${saveCall}">Save</button>
    </div>
    <div class="panel-body">
      <input class="input" type="search" placeholder="Search…" value="${esc(state.exPickerSearch)}"
        oninput="state.exPickerSearch=this.value;renderExPicker('${planId}','${mode}')">
      <div class="ex-picker-groups" style="margin:10px 0">${groupTabs}</div>
      <div class="ex-list">${rows || '<div style="text-align:center;padding:20px;color:var(--text2)">No exercises found</div>'}</div>
      <div class="divider" style="margin:14px 0"></div>
      <button class="btn btn-secondary btn-full" onclick="openCustomEx('${planId}','${mode}')">${t('add_custom_ex')}</button>
      <button class="btn btn-primary btn-full mt-8" onclick="closePanel();${saveCall}">${t('save_plan')}</button>
    </div>`);
}

function setExGroup(g, planId, mode) { state.exPickerGroup = g; renderExPicker(planId, mode); }
function toggleEx(id, planId, mode) {
  const i = state.pickerSelected.indexOf(id);
  if (i >= 0) state.pickerSelected.splice(i,1); else state.pickerSelected.push(id);
  const sel = state.pickerSelected.includes(id);
  const row = document.querySelector(`.ex-row[data-exid="${id}"]`);
  if (row) {
    row.classList.toggle('selected', sel);
    row.querySelector('.ex-check').innerHTML = sel
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>'
      : '';
  }
  const title = document.querySelector('.panel-title');
  if (title) title.textContent = `${state.pickerSelected.length} selected`;
}

function openCustomEx(planId, mode, editId) {
  const existing = editId ? load(SK.CUSTOM_EX,[]).find(e => e.id === editId) : null;
  const selGroups = existing?.groups || [];
  const groupChips = MUSCLE_GROUPS.map(g => {
    const col = GROUP_COLORS[g] || '#888';
    const active = selGroups.includes(g);
    return `<button type="button" data-g="${g}" data-active="${active?'1':'0'}" onclick="toggleCustomExGroup(this,'${g}')"
      style="padding:4px 10px;border-radius:8px;border:2px solid ${active?col:'var(--border)'};background:${active?col+'22':'transparent'};color:${active?col:'var(--text2)'};font-size:12px;font-weight:600;cursor:pointer">${g}</button>`;
  }).join('');
  const currentImg = existing?.imageData || null;
  const imgSection = currentImg
    ? `<img id="ce_cur_img" src="${currentImg}" style="width:100%;max-height:140px;object-fit:cover;border-radius:10px;margin-bottom:6px">
       <button type="button" class="btn btn-secondary btn-sm" style="margin-bottom:6px" onclick="document.getElementById('ce_cur_img').style.display='none';this.style.display='none';state._clearExImg=true">× Bild entfernen</button>`
    : '';
  openOverlay(`
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="input-group">
        <label class="input-label">${t('ex_name')}</label>
        <input class="input" id="ce_name" type="text" placeholder="z.B. Schrägbankdrücken" value="${esc(existing?.name||'')}">
      </div>
      <div class="input-group">
        <label class="input-label">${t('muscle_group')}</label>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px" id="ce_groups">${groupChips}</div>
      </div>
      <div class="input-group">
        <label class="input-label">Bild / GIF (optional)</label>
        ${imgSection}
        <input type="file" accept="image/*,.gif" id="ce_image" style="font-size:13px" onchange="previewCustomExImage(this)">
        <img id="ce_img_preview" style="display:none;width:100%;max-height:140px;object-fit:cover;border-radius:10px;margin-top:6px">
      </div>
      <button class="btn btn-primary btn-full" onclick="saveCustomEx('${planId}','${mode}','${editId||''}')">${existing?t('save_changes'):'Übung hinzufügen'}</button>
    </div>`, t('custom_ex_title'));
}

function previewCustomExImage(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById('ce_img_preview');
    if (img) { img.src = e.target.result; img.style.display = 'block'; }
  };
  reader.readAsDataURL(file);
}

function toggleCustomExGroup(btn, group) {
  const col = GROUP_COLORS[group] || '#888';
  const isActive = btn.getAttribute('data-active') === '1';
  if (isActive) {
    btn.setAttribute('data-active', '0');
    btn.style.borderColor = 'var(--border)';
    btn.style.background = 'transparent';
    btn.style.color = 'var(--text2)';
  } else {
    btn.setAttribute('data-active', '1');
    btn.style.borderColor = col;
    btn.style.background = col + '22';
    btn.style.color = col;
  }
}

function saveCustomEx(planId, mode, editId) {
  const name = document.getElementById('ce_name')?.value.trim();
  if (!name) { showToast(t('enter_name')); return; }
  const groups = [...document.querySelectorAll('#ce_groups button[data-active="1"]')]
    .map(b => b.dataset.g).filter(Boolean);
  if (!groups.length) { showToast('Mindestens 1 Muskelgruppe wählen'); return; }
  const previewImg = document.getElementById('ce_img_preview');
  const newImageData = (previewImg?.style.display !== 'none' && previewImg?.src?.startsWith('data:'))
    ? previewImg.src : null;
  const custom = load(SK.CUSTOM_EX, []);
  if (editId) {
    const idx = custom.findIndex(e => e.id === editId);
    if (idx >= 0) {
      const imageData = state._clearExImg ? null : (newImageData || custom[idx].imageData);
      state._clearExImg = false;
      custom[idx] = { ...custom[idx], name, groups, group: groups[0], imageData };
    }
  } else {
    const ex = { id:'c_'+uid(), name, groups, group: groups[0], imageData: newImageData };
    custom.push(ex);
    state.pickerSelected.push(ex.id);
  }
  save(SK.CUSTOM_EX, custom);
  closeOverlay();
  renderExPicker(planId, mode);
  showToast(editId ? t('save') + ' ✓' : 'Übung hinzugefügt!');
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

function promptStartWorkout(planId) {
  openOverlay(`
    <div style="display:flex;flex-direction:column;gap:14px">
      <p style="margin:0;color:var(--text2);font-size:13px">Schließfach / Spindel (optional)</p>
      <input id="lockerInput" class="form-input" type="text" inputmode="numeric" placeholder="z.B. 42"
        style="font-size:18px;text-align:center;letter-spacing:2px">
      <button class="btn btn-primary btn-full" onclick="
        const v=document.getElementById('lockerInput').value.trim();
        closeOverlay();
        startWorkout('${planId}', v||null);
      ">▶ Training starten</button>
      <button class="btn btn-secondary btn-full" onclick="closeOverlay()">Abbrechen</button>
    </div>`, t('start_workout'));
  setTimeout(() => document.getElementById('lockerInput')?.focus(), 100);
}

function startWorkout(planId, lockerNum) {
  const plan = getPlans().find(p => p.id === planId);
  if (!plan) return;
  const aw = {
    id:uid(), planId, planName:plan.name, planColor:plan.color||'#8b5cf6',
    startTime:Date.now(),
    locker: lockerNum || null,
    exercises:(plan.exercises||[]).map(ex => {
      const lastArr = getLastSetsArray(ex.id);
      const fallback = { weight:'', reps:'' };
      const dbEx = EXERCISE_DB.find(e => e.id === ex.id);
      const customEx = load('ft_custom_ex',[]).find(e => e.id === ex.id);
      return {
        exerciseId:ex.id, name:ex.name, group:ex.group||'',
        groups: ex.groups || (ex.group ? [ex.group] : []),
        plannedSets:ex.sets||3, plannedReps:ex.reps||'8-12',
        seatPos: ex.seatPos || null,
        chestSupport: ex.chestSupport || null,
        gif: dbEx?.gif || null,
        imageData: customEx?.imageData || null,
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
    const ml = exMachineLabels(ex);
    const machineInfo = (ex.seatPos != null || ex.chestSupport != null)
      ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px">
          ${ex.seatPos != null ? `<span style="font-size:11px;color:var(--text2);background:var(--card2);padding:2px 8px;border-radius:8px">${esc(ml.l1)}: <b>${esc(ex.seatPos)}</b></span>` : ''}
          ${ex.chestSupport != null ? `<span style="font-size:11px;color:var(--text2);background:var(--card2);padding:2px 8px;border-radius:8px">${esc(ml.l2)}: <b>${esc(ex.chestSupport)}</b></span>` : ''}
        </div>` : '';
    const isRunEx = ex.group === 'Runs';
    const imgSrc = ex.gif || ex.imageData || null;
    const exImage = imgSrc ? `<img src="${imgSrc}" style="width:100%;max-height:180px;object-fit:contain;border-radius:10px;margin-bottom:8px;background:var(--card2)">` : '';
    const cardBody = isRunEx
      ? `<div style="padding:8px 0">
          ${ex.seatPos ? `<div style="font-size:13px;color:var(--text2);margin-bottom:8px">Ziel: <b>${esc(ex.seatPos)} km</b></div>` : ''}
          <button class="btn btn-primary btn-sm" onclick="closePanel();switchWorkoutSub('running');openAddRun()">🏃 Run jetzt loggen</button>
        </div>`
      : `${exImage}${machineInfo}<div class="workout-sets">${setsHtml}<button class="add-set-btn" onclick="addSet(${ei})">${t('add_set')}</button></div>`;
    return `<div class="workout-ex-card">
      <div class="workout-ex-header">
        <div class="ex-badge" style="background:${col};width:32px;height:32px;border-radius:8px;font-size:10px">${abbr}</div>
        <span class="workout-ex-name">${esc(ex.name)}</span>
        <span class="workout-ex-prev">${isRunEx ? '' : prev}</span>
        ${isRunEx ? '' : `<button class="icon-btn" style="color:var(--text3);padding:4px" title="Maschineneinstellung" onclick="openMachineSettings(${ei})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
        </button>`}
      </div>
      ${cardBody}
    </div>`;
  }).join('');

  const lockerBadge = aw.locker
    ? `<div style="font-size:11px;color:var(--text2);background:var(--card2);padding:2px 10px;border-radius:8px;margin-top:3px">🔒 Spindel <b>${esc(aw.locker)}</b></div>`
    : '';

  openPanel(`
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="workout-session-header">
        <div>
          <div class="workout-session-title" style="color:${aw.planColor}">${esc(aw.planName)}</div>
          <div style="font-size:11px;color:var(--text2)">${new Date(aw.startTime).toLocaleDateString()}</div>
          ${lockerBadge}
        </div>
        <div id="wo-timer" class="workout-timer">00:00</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-danger btn-sm" onclick="cancelWorkout()">${t('cancel_workout')}</button>
          <button class="btn btn-primary btn-sm" onclick="finishWorkout()">${t('finish_workout')}</button>
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
function openMachineSettings(ei) {
  const aw = state.activeWorkout; if (!aw) return;
  const ex = aw.exercises[ei];
  const ml = exMachineLabels(ex);
  openOverlay(`
    <div style="display:flex;flex-direction:column;gap:14px">
      <p style="margin:0;color:var(--text2);font-size:13px">Einstellungen für <b>${esc(ex.name)}</b></p>
      <div style="display:flex;flex-direction:column;gap:6px">
        <label style="font-size:12px;color:var(--text3)">${esc(ml.l1)}</label>
        <input id="ms_seat" class="form-input" type="text" placeholder="z.B. 3"
          value="${esc(ex.seatPos ?? '')}">
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <label style="font-size:12px;color:var(--text3)">${esc(ml.l2)}</label>
        <input id="ms_chest" class="form-input" type="text" placeholder="z.B. 2"
          value="${esc(ex.chestSupport ?? '')}">
      </div>
      <button class="btn btn-primary btn-full" onclick="
        const s=document.getElementById('ms_seat').value.trim();
        const c=document.getElementById('ms_chest').value.trim();
        saveMachineSettings(${ei}, s||null, c||null);
      ">Speichern</button>
      <button class="btn btn-secondary btn-full" onclick="closeOverlay()">Abbrechen</button>
    </div>`, t('machine_settings'));
}
function saveMachineSettings(ei, seatPos, chestSupport) {
  const aw = state.activeWorkout; if (!aw) return;
  aw.exercises[ei].seatPos = seatPos;
  aw.exercises[ei].chestSupport = chestSupport;
  save(SK.ACTIVE_WO, aw);
  if (aw.planId) {
    const plans = getPlans();
    const plan = plans.find(p => p.id === aw.planId);
    const pEx = plan?.exercises?.find(e => e.id === aw.exercises[ei].exerciseId);
    if (pEx) { pEx.seatPos = seatPos; pEx.chestSupport = chestSupport; save(SK.PLANS, plans); }
  }
  closeOverlay();
  renderWorkoutSession();
}
function finishWorkout() {
  const aw = state.activeWorkout; if (!aw) return;
  if (!confirm('Finish and save workout?')) return;
  clearInterval(state.timerInterval);
  const dur = Math.floor((Date.now()-aw.startTime)/1000);
  const hist = getHistory();
  hist.unshift({ ...aw, endTime:Date.now(), duration:dur, date:todayStr() });
  save(SK.HISTORY, hist);
  localStorage.removeItem(SK.ACTIVE_WO);
  state.activeWorkout = null;
  closePanel();
  const durStr = dur >= 3600
    ? `${Math.floor(dur/3600)}h ${Math.floor((dur%3600)/60)}min`
    : `${Math.floor(dur/60)}min`;
  const lockerLine = aw.locker ? `\n🔒 Spindel: ${aw.locker}` : '';
  showToast(`Workout gespeichert! 💪  ${durStr}${lockerLine}`);
  if (aw.locker) {
    openOverlay(`
      <div style="text-align:center;padding:10px 0;display:flex;flex-direction:column;gap:14px">
        <div style="font-size:48px">🎉</div>
        <div style="font-size:18px;font-weight:700">${esc(aw.planName)}</div>
        <div style="font-size:14px;color:var(--text2)">${durStr}</div>
        <div style="background:var(--card2);border-radius:14px;padding:16px;margin-top:4px">
          <div style="font-size:12px;color:var(--text3);margin-bottom:4px">Schließfach / Spindel</div>
          <div style="font-size:36px;font-weight:900;letter-spacing:4px;color:var(--accent)">${esc(aw.locker)}</div>
        </div>
        <button class="btn btn-primary btn-full" onclick="closeOverlay()">Fertig</button>
      </div>`, 'Workout abgeschlossen');
  }
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
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">${t('no_workouts')}</div><div class="empty-sub">Start a workout from Plans and it'll appear here.</div></div>`;
    return;
  }
  const planNames = [...new Set(hist.map(w => w.planName).filter(Boolean))];
  const filterSel = planNames.length > 1 ? `<select class="input" style="margin-bottom:10px" onchange="state.historyFilter=this.value;renderHistory()">
    <option value="">${t('all_plans')}</option>
    ${planNames.map(n=>`<option value="${esc(n)}"${n===state.historyFilter?' selected':''}>${esc(n)}</option>`).join('')}
  </select>` : '';
  const filtered = state.historyFilter ? hist.filter(w => w.planName === state.historyFilter) : hist;
  el.innerHTML = filterSel + filtered.map(wo => {
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
      <div style="font-size:11px;color:var(--text3);margin-top:4px">${totalSets} ${t('sets_total')} · ${t('tap_edit')}</div>
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
        <div class="macro-box" style="flex:1.4">
          <input type="date" value="${wo.date||''}"
            style="font-size:13px;font-weight:700;color:var(--text1);background:transparent;border:none;text-align:center;width:100%;cursor:pointer"
            onchange="saveHistWorkoutDate('${woId}',this.value)">
          <div class="macro-lbl">${t('date')}</div>
        </div>
        <div class="macro-box" style="flex:1"><div class="macro-val">${wo.duration?Math.floor(wo.duration/60):'—'}</div><div class="macro-unit">${wo.duration?'min':''}</div><div class="macro-lbl">${t('duration')}</div></div>
        <div class="macro-box" style="flex:1"><div class="macro-val">${(wo.exercises||[]).reduce((s,e)=>s+(e.sets?.length||0),0)}</div><div class="macro-lbl">${t('sets_total')}</div></div>
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
function saveHistWorkoutDate(woId, newDate) {
  if (!newDate) return;
  const hist = getHistory();
  const wo = hist.find(w => w.id === woId); if (!wo) return;
  wo.date = newDate;
  save(SK.HISTORY, hist);
  showToast(t('save') + ' ✓');
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
  const addBtn = `<button class="btn btn-primary btn-full" style="margin-bottom:10px" onclick="openAddRun()">${t('run_loggen')}</button>`;
  if (!runs.length) {
    el.innerHTML = addBtn + `<div class="empty-state" style="padding-top:16px"><div class="empty-icon">🏃</div><div class="empty-title">${t('no_runs')}</div><div class="empty-sub">Log your first run to track your pace and distance over time.</div></div>`;
    return;
  }
  const typeFilter = state.runTypeFilter || 'all';
  const filterBar = `<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
    ${['all','normal','interval','tempo'].map(t => {
      const active = typeFilter === t;
      const labels = { all:t('all'), normal:t('normal'), interval:t('interval'), tempo:t('tempo') };
      return `<button onclick="state.runTypeFilter='${t}';renderRunningList()" style="padding:4px 12px;font-size:12px;font-weight:600;border-radius:8px;border:none;cursor:pointer;background:${active?'var(--accent)':'var(--card2)'};color:${active?'#fff':'var(--text2)'}">${labels[t]}</button>`;
    }).join('')}
  </div>`;
  const filtered = typeFilter === 'all' ? runs : runs.filter(r => (r.type||'normal') === typeFilter);
  el.innerHTML = addBtn + filterBar + (filtered.length ? filtered.map(r => {
    const rt = r.type || 'normal';
    const isInterval = rt === 'interval';
    const isTempo = rt === 'tempo';
    const pace = (isInterval) ? '--' : calcPace(r.distance, r.time);
    const icon = isInterval ? '⚡' : isTempo ? '💨' : '🏃';
    const badgeStyle = isInterval ? 'background:rgba(249,115,22,.15);color:#f97316'
      : isTempo ? 'background:rgba(239,68,68,.15);color:#ef4444' : '';
    const badge = (isInterval || isTempo)
      ? `<span style="${badgeStyle};font-size:10px;font-weight:700;padding:2px 7px;border-radius:5px;margin-left:6px">${isInterval?'INTERVALL':'TEMPO'}</span>`
      : '';
    const detail = isInterval
      ? `${r.intervals}× ${fmtDuration(r.workTime)} / ${fmtDuration(r.restTime)} rest`
      : fmtDuration(r.time);
    const sub = r.notes ? ` · ${esc(r.notes)}` : '';
    return `<div class="run-card" onclick="openEditRun('${r.id}')">
      <div class="run-icon" style="${isInterval?'background:rgba(249,115,22,.15)':isTempo?'background:rgba(239,68,68,.15)':''}">${icon}</div>
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
  }).join('') : '<div style="text-align:center;padding:20px;color:var(--text2)">Keine Einträge für diesen Filter</div>');
}

// Run form builder (shared by add and edit)
function runFormHTML(r = {}) {
  const rt = r.type || 'normal';
  state.currentRunType = rt;
  const isInt = rt === 'interval';
  const isTempo = rt === 'tempo';
  return `
    <div class="input-group"><label class="input-label">${t('date')}</label><input class="input" id="r_date" type="date" value="${r.date||todayStr()}"></div>
    <div class="input-group">
      <label class="input-label">${t('type')}</label>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button type="button" id="r_type_normal" onclick="setRunType('normal')"
          class="btn btn-sm" style="flex:1;${!isInt&&!isTempo?'background:var(--accent);color:#fff':'background:var(--card2);color:var(--text)'}">Normal</button>
        <button type="button" id="r_type_interval" onclick="setRunType('interval')"
          class="btn btn-sm" style="flex:1;${isInt?'background:#f97316;color:#fff':'background:var(--card2);color:var(--text)'}">Intervall</button>
        <button type="button" id="r_type_tempo" onclick="setRunType('tempo')"
          class="btn btn-sm" style="flex:1;${isTempo?'background:#ef4444;color:#fff':'background:var(--card2);color:var(--text)'}">Tempo</button>
      </div>
    </div>
    <div class="input-group"><label class="input-label">${t('distance_km')}</label><input class="input" id="r_dist" type="number" inputmode="decimal" step="0.01" placeholder="5.0" value="${r.distance||''}"></div>
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
  state.currentRunType = type;
  const isInt = type === 'interval';
  const isTempo = type === 'tempo';
  document.getElementById('r_normal_fields').style.display = isInt ? 'none' : 'block';
  document.getElementById('r_interval_fields').style.display = isInt ? 'block' : 'none';
  const btnN = document.getElementById('r_type_normal');
  const btnI = document.getElementById('r_type_interval');
  const btnT = document.getElementById('r_type_tempo');
  if (btnN) { btnN.style.background = (!isInt&&!isTempo)?'var(--accent)':'var(--card2)'; btnN.style.color = (!isInt&&!isTempo)?'#fff':'var(--text)'; }
  if (btnI) { btnI.style.background = isInt?'#f97316':'var(--card2)'; btnI.style.color = isInt?'#fff':'var(--text)'; }
  if (btnT) { btnT.style.background = isTempo?'#ef4444':'var(--card2)'; btnT.style.color = isTempo?'#fff':'var(--text)'; }
}

function collectRunForm() {
  const type = state.currentRunType || 'normal';
  const isInterval = type === 'interval';
  const dist = parseFloat(document.getElementById('r_dist')?.value);
  if (!dist) { showToast('Enter distance'); return null; }
  const run = {
    date: document.getElementById('r_date')?.value || todayStr(),
    type,
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
const MUSCLE_GROUPS = [
  'Chest','Upper Chest',
  'Lats','Traps','Lower Back','Back',
  'Front Delts','Side Delts','Rear Delts','Shoulders',
  'Biceps','Triceps','Forearms',
  'Abs','Obliques','Core',
  'Quads','Hamstrings','Glutes','Adductors','Abductors','Calves','Legs',
];

// Returns { counts, green, yellow } based on the selected analytics range.
// Thresholds scale linearly with days: 2 sessions/week = green, 1 = yellow, 0 = red.
function getMuscleTrainingStatus() {
  const hist = getHistory();
  const range = state.analyticsRange || '30d';
  let days, cutoffStr;
  if (range === '7d') {
    days = 7;
  } else if (range === '30d') {
    days = 30;
  } else {
    // 'all': use oldest workout date as start
    const oldest = hist.map(w => w.date).filter(Boolean).sort()[0];
    if (oldest) {
      const ms = new Date() - parseDate(oldest);
      days = Math.max(7, Math.round(ms / 86400000));
    } else {
      days = 30;
    }
  }
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
  cutoffStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth()+1).padStart(2,'0')}-${String(cutoff.getDate()).padStart(2,'0')}`;
  const sessionDates = {};
  hist.forEach(wo => {
    if (wo.date < cutoffStr) return;
    const groups = new Set((wo.exercises||[]).flatMap(e => {
      const gs = Array.isArray(e.groups) ? e.groups : (e.group ? [e.group] : []);
      return gs.filter(Boolean);
    }));
    groups.forEach(g => { if (!sessionDates[g]) sessionDates[g] = new Set(); sessionDates[g].add(wo.date); });
  });
  const counts = {};
  Object.entries(sessionDates).forEach(([g, s]) => { counts[g] = s.size; });
  const weeks = days / 7;
  counts._green  = Math.round(2 * weeks);
  counts._yellow = Math.round(1 * weeks);
  return counts;
}

function muscleFreqColor(sessions, status) {
  const green  = status?._green  ?? 8;
  const yellow = status?._yellow ?? 4;
  if (sessions >= green)  return { hex: '#22c55e', rgb: [0.09, 0.68, 0.28] };
  if (sessions >= yellow) return { hex: '#f59e0b', rgb: [0.92, 0.55, 0.03] };
  return                         { hex: '#ef4444', rgb: [0.88, 0.18, 0.18] };
}

function colorMuscleModel(mv, status) {
  if (!mv.model) return;
  mv.model.materials.forEach(mat => {
    if (!MUSCLE_GROUPS.includes(mat.name)) return;
    const { rgb } = muscleFreqColor(status[mat.name] || 0, status);
    mat.pbrMetallicRoughness.setBaseColorFactor([...rgb, 1.0]);
  });
}

function muscleStatusColor(group, status) {
  const n = status[group] || 0;
  const green  = status?._green  ?? 8;
  const yellow = status?._yellow ?? 4;
  if (n >= green)  return 'rgba(34,197,94,0.72)';
  if (n >= yellow) return 'rgba(245,158,11,0.65)';
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
  if (!mv) return;

  const status = getMuscleTrainingStatus();
  const applyColors = () => colorMuscleModel(mv, status);
  if (mv.model) applyColors();
  else mv.addEventListener('load', applyColors, { once: true });

  let glowFrame = null, glowPhase = 0;
  let inactivityTimer = null;

  const stopGlow = () => {
    if (glowFrame) { cancelAnimationFrame(glowFrame); glowFrame = null; }
    if (mv.model) colorMuscleModel(mv, status);
  };

  const startGlow = group => {
    stopGlow();
    const base = muscleFreqColor(status[group] || 0, status).rgb;
    glowPhase = 0;
    const tick = () => {
      glowPhase += 0.07;
      const t = (Math.sin(glowPhase) + 1) / 2;
      if (mv.model) mv.model.materials.forEach(mat => {
        if (mat.name === group)
          mat.pbrMetallicRoughness.setBaseColorFactor([...base.map(v => Math.min(1, v + t * 0.55)), 1.0]);
      });
      glowFrame = requestAnimationFrame(tick);
    };
    tick();
  };

  // Exposed for selectMuscleGroup
  state._muscleGlow = { start: startGlow, stop: stopGlow };

  // Auto-rotate management: stop on touch/drag, resume after 4s inactivity
  mv.addEventListener('pointerdown', () => {
    mv.removeAttribute('auto-rotate');
    if (inactivityTimer) clearTimeout(inactivityTimer);
  });
  mv.addEventListener('pointerup', () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => mv.setAttribute('auto-rotate', ''), 4000);
  });
}

function selectMuscleGroup(group) {
  const status = getMuscleTrainingStatus();
  const modelArea = document.getElementById('muscleModelArea');
  const exPanel  = document.getElementById('muscleExPanel');
  if (!modelArea || !exPanel) return;

  const already = state._activeMuscleGroup === group;

  // Deselect
  if (already) {
    state._activeMuscleGroup = null;
    if (state._muscleGlow) state._muscleGlow.stop();
    modelArea.style.flex = '1';
    exPanel.style.width = '0';
    exPanel.style.opacity = '0';
    document.querySelectorAll('.muscle-chip').forEach(b => b.style.outline = 'none');
    return;
  }

  // Select new group
  state._activeMuscleGroup = group;
  if (state._muscleGlow) state._muscleGlow.start(group);

  // Highlight chip
  document.querySelectorAll('.muscle-chip').forEach(b => {
    b.style.outline = b.dataset.group === group ? `2px solid #fff` : 'none';
  });

  // Slide model left, show panel
  modelArea.style.flex = '0 0 42%';
  exPanel.style.width = '58%';
  exPanel.style.opacity = '1';

  const n = status[group] || 0;
  const col = muscleFreqColor(n).hex;
  const lastStr = n === 0 ? 'Nicht trainiert (4 Wochen)'
                : n >= 8  ? `${n}× — super (2+/Woche)`
                : n >= 4  ? `${n}× — ok (1+/Woche)`
                :           `${n}× — mehr trainieren`;
  const exercises = getAllExercises().filter(e => e.group === group);

  exPanel.innerHTML = `
    <div style="padding:10px 8px 10px 10px;overflow-y:auto;height:100%;box-sizing:border-box">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <span style="color:${col};font-weight:700;font-size:13px">${group}</span>
        <button onclick="selectMuscleGroup('${group}')" style="background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer;padding:0 2px">×</button>
      </div>
      <div style="font-size:10px;color:var(--text3);margin-bottom:8px">${lastStr}</div>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${exercises.map(ex => `
          <div style="background:var(--card);border-radius:8px;padding:7px 8px;font-size:11px;display:flex;align-items:center;gap:6px">
            <span style="width:5px;height:5px;border-radius:50%;background:${col};flex-shrink:0"></span>
            <span style="line-height:1.3">${esc(ex.name)}</span>
          </div>`).join('')}
      </div>
    </div>`;
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
  const range = state.analyticsRange || '30d';
  const rangeBtn = (v, label) => `<button onclick="state.analyticsRange='${v}';renderAnalytics()" style="flex:1;padding:6px;font-size:12px;font-weight:600;border:none;border-radius:9px;cursor:pointer;background:${range===v?'var(--accent)':'transparent'};color:${range===v?'#fff':'var(--text2)'}">${label}</button>`;

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
      <div style="display:flex;height:380px;transition:all .3s">
        <div id="muscleModelArea" style="flex:1;min-width:0;transition:flex .3s;position:relative">
          <model-viewer
            id="analyticsMV"
            src="male_muscles_named.glb"
            camera-controls
            disable-pan
            interaction-prompt="none"
            auto-rotate
            rotation-per-second="15deg"
            auto-rotate-delay="0"
            camera-orbit="0deg 90deg auto"
            camera-target="auto"
            field-of-view="75deg"
            min-camera-orbit="auto 90deg auto"
            max-camera-orbit="auto 90deg auto"
            min-field-of-view="30deg"
            max-field-of-view="120deg"
            environment-image="neutral"
            exposure="1.6"
            tone-mapping="neutral"
            style="width:100%;height:100%;background:transparent;--progress-bar-color:var(--accent)"
            loading="eager"
          ></model-viewer>
        </div>
        <div id="muscleExPanel" style="width:0;opacity:0;overflow:hidden;transition:width .3s,opacity .3s;background:var(--bg2);border-left:1px solid var(--border)"></div>
      </div>
      <div style="padding:8px 12px 12px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid var(--border)">
        ${MUSCLE_GROUPS.map(g => {
          const col = muscleStatusColor(g, muscleStatus);
          const n = muscleStatus[g] || 0;
          const tag = n === 0 ? '' : ` · ${n}×`;
          return `<button class="muscle-chip" data-group="${g}" onclick="selectMuscleGroup('${g}')" style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;background:${col};color:#fff;border:none;cursor:pointer;letter-spacing:.03em;outline:none;transition:outline .15s">${g}${tag}</button>`;
        }).join('')}
      </div>
    </div>

    <div style="display:flex;gap:0;margin:10px 0;background:var(--card);border-radius:12px;padding:3px">
      ${rangeBtn('7d','7 Tage')}${rangeBtn('30d','30 Tage')}${rangeBtn('all','Gesamt')}
    </div>

    <div class="section-hd mt-8"><span class="section-title">Ernährung</span></div>
    <div class="chart-card">
      <div class="chart-title">Kalorien</div>
      <div class="chart-wrap"><canvas id="c_cal" height="160"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Protein</div>
      <div class="chart-wrap"><canvas id="c_pro" height="160"></canvas></div>
    </div>

    <div class="section-hd mt-8"><span class="section-title">Körpergewicht</span></div>
    <div class="chart-card">
      <div class="chart-title">Gewicht (kg)</div>
      <div class="chart-wrap"><canvas id="c_weight" height="160"></canvas></div>
    </div>

    ${getSettings().stepGoal ? `<div class="section-hd mt-8"><span class="section-title">Schritte</span></div>
    <div class="chart-card">
      <div class="chart-title">Schritte pro Tag</div>
      <div class="chart-wrap"><canvas id="c_steps" height="160"></canvas></div>
    </div>` : ''}

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

    <div class="section-hd mt-8"><span class="section-title">Laufen</span></div>
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

  const analyticsDays = getAnalyticsDays();
  requestAnimationFrame(() => { drawNutCharts(analyticsDays); drawWeightChart(analyticsDays); drawGymCharts(hist); drawRunCharts(runs); drawStepsChart(analyticsDays); initAnalyticsMuscleViewer(); });
}

function drawNutCharts(days) {
  const labels = days.map(d => { const dt=parseDate(d); return `${dt.getMonth()+1}/${dt.getDate()}`; });
  const goals = getGoals();
  const cal = document.getElementById('c_cal'); if (cal) drawBar(cal, labels, days.map(d=>getDayTotals(d).calories), { color:'#8b5cf6', goalLine:goals.calories });
  const pro = document.getElementById('c_pro'); if (pro) drawBar(pro, labels, days.map(d=>getDayTotals(d).protein),  { color:'#3b82f6', goalLine:goals.protein });
}

function drawWeightChart(days) {
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

function drawGymCharts(hist) {
  const exName = state.analyticsGymExercise || document.getElementById('gymExSel')?.value;
  if (!exName) return;
  const sessions = (hist || getHistory())
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

function drawRunCharts(runsArg) {
  const allRuns = (runsArg || getRuns()).slice().sort((a,b)=>a.date.localeCompare(b.date));
  // Pace chart: normal runs only (pace meaningless for intervals/tempo)
  const normalRuns = allRuns.filter(r => !r.type || r.type === 'normal').slice(-20);
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

function drawStepsChart(days) {
  const sc = document.getElementById('c_steps'); if (!sc) return;
  const stepsData = getSteps();
  const stepGoal = getSettings().stepGoal || 0;
  const labels = days.map(d => { const dt=parseDate(d); return `${dt.getMonth()+1}/${dt.getDate()}`; });
  const values = days.map(d => stepsData[d] || 0);
  drawBar(sc, labels, values, { color:'#14b8a6', goalLine: stepGoal || null });
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
  document.getElementById('btnSettings')?.addEventListener('click', openSettings);
  document.getElementById('btnExport')?.addEventListener('click', () =>
    openOverlay(`
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn btn-secondary btn-full" onclick="exportData();closeOverlay()">⬇ Export JSON Backup</button>
        <button class="btn btn-secondary btn-full" onclick="importData();closeOverlay()">⬆ Import JSON Backup</button>
      </div>`, 'Daten-Backup')
  );
  document.getElementById('overlay')?.addEventListener('click', e => { if(e.target.id==='overlay') closeOverlay(); });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  initReminders();
  renderNutrition();
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════════════════ */
function openSettings() {
  const s = getSettings();
  const reminders = getReminders();
  const remHtml = reminders.length
    ? reminders.map(r => `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600">${esc(r.text)}</div>
          <div style="font-size:11px;color:var(--text3)">${r.time}</div>
        </div>
        <button class="icon-btn" style="color:var(--danger)" onclick="deleteReminder('${r.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>`).join('')
    : `<div style="color:var(--text3);font-size:13px;padding:10px 0;text-align:center">Keine Erinnerungen</div>`;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  openPanel(`
    <div class="panel-header">
      <button class="panel-back" onclick="closePanel()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg> ${t('back')}
      </button>
      <span class="panel-title">${t('settings')}</span>
    </div>
    <div class="panel-body">
      <div class="card" style="margin-bottom:12px">
        <div class="card-title">${t('language')}</div>
        <div style="display:flex;gap:8px">
          <button onclick="setLang('de')" style="flex:1;padding:10px;border-radius:10px;border:2px solid ${lang()==='de'?'var(--accent)':'var(--border)'};background:${lang()==='de'?'var(--accent)18':'transparent'};cursor:pointer;font-size:13px;font-weight:600;color:var(--text1)">🇩🇪 Deutsch</button>
          <button onclick="setLang('en')" style="flex:1;padding:10px;border-radius:10px;border:2px solid ${lang()==='en'?'var(--accent)':'var(--border)'};background:${lang()==='en'?'var(--accent)18':'transparent'};cursor:pointer;font-size:13px;font-weight:600;color:var(--text1)">🇬🇧 English</button>
        </div>
      </div>
      <div class="card" style="margin-bottom:12px">
        <div class="card-title">${t('theme')}</div>
        <div style="display:flex;gap:8px">
          <button onclick="setTheme('dark')" style="flex:1;padding:10px;border-radius:10px;border:2px solid ${isDark?'var(--accent)':'var(--border)'};background:${isDark?'var(--accent)18':'transparent'};cursor:pointer;font-size:13px;font-weight:600;color:var(--text1)">${t('dark')}</button>
          <button onclick="setTheme('light')" style="flex:1;padding:10px;border-radius:10px;border:2px solid ${!isDark?'var(--accent)':'var(--border)'};background:${!isDark?'var(--accent)18':'transparent'};cursor:pointer;font-size:13px;font-weight:600;color:var(--text1)">${t('light')}</button>
        </div>
      </div>
      <div class="card" style="margin-bottom:12px">
        <div class="card-title">${t('step_goal')}</div>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="input" id="set_stepgoal" type="number" inputmode="numeric" placeholder="10000" value="${s.stepGoal||''}" style="flex:1">
          <button class="btn btn-primary btn-sm" onclick="saveSettingsField('stepGoal',parseInt(document.getElementById('set_stepgoal').value)||0);showToast(t('save'))">OK</button>
        </div>
      </div>
      <div class="card" style="margin-bottom:12px">
        <div class="card-title">${t('reminders')}</div>
        ${remHtml}
        <button class="btn btn-primary btn-sm" style="margin-top:10px;width:100%" onclick="openAddReminderModal()">${t('add_reminder')}</button>
      </div>
    </div>`);
}

function setTheme(theme) {
  const s = load(SK.SETTINGS, {}); s.theme = theme;
  save(SK.SETTINGS, s); loadTheme(); openSettings();
}
function setLang(language) {
  const s = load(SK.SETTINGS, {}); s.language = language;
  save(SK.SETTINGS, s); renderCurrentTab(); openSettings();
}

function saveSettingsField(key, value) {
  const s = load(SK.SETTINGS, {}); s[key] = value; save(SK.SETTINGS, s);
}

function openAddReminderModal() {
  openOverlay(`
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="input-group">
        <label class="input-label">${t('reminder_text')}</label>
        <input class="input" id="rem_text" type="text" placeholder="z.B. Kreatin nehmen">
      </div>
      <div class="input-group">
        <label class="input-label">${t('reminder_time')}</label>
        <input class="input" id="rem_time" type="time" value="17:00">
      </div>
      <button class="btn btn-primary btn-full" onclick="saveReminder()">Speichern</button>
    </div>`, t('reminder_title'));
}

function saveReminder() {
  const text = document.getElementById('rem_text')?.value.trim();
  const time = document.getElementById('rem_time')?.value;
  if (!text || !time) { showToast('Text und Uhrzeit eingeben'); return; }
  const rems = getReminders();
  rems.push({ id: uid(), text, time, enabled: true });
  save(SK.REMINDERS, rems);
  if (Notification.permission === 'default') {
    Notification.requestPermission().catch(()=>{});
  }
  closeOverlay();
  openSettings();
  showToast('Erinnerung gespeichert!');
}

function deleteReminder(id) {
  save(SK.REMINDERS, getReminders().filter(r => r.id !== id));
  openSettings();
}

function initReminders() {
  if (state._reminderInterval) clearInterval(state._reminderInterval);
  checkReminders();
  state._reminderInterval = setInterval(checkReminders, 60000);
}

function checkReminders() {
  const reminders = getReminders().filter(r => r.enabled !== false);
  if (!reminders.length) return;
  const now = new Date();
  const current = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  if (state._lastReminderMinute === current) return;
  state._lastReminderMinute = current;
  reminders.forEach(r => {
    if (r.time === current) {
      if (Notification?.permission === 'granted') {
        try { new Notification('FitTrack', { body: r.text, icon: './icon.svg' }); } catch {}
      } else {
        showToast('🔔 ' + r.text);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
