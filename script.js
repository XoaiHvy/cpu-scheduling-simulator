// CPU Scheduling Simulator - script.js
// Implements FCFS, SJF (non-preemptive), and Round Robin with visualization

const processes = [];
const colors = ["#60a5fa","#34d399","#f472b6","#fbbf24","#a78bfa","#fb7185","#60a5fa","#7dd3fc"]

// DOM references
const pidInput = document.getElementById('pid');
const arrivalInput = document.getElementById('arrival');
const burstInput = document.getElementById('burst');
const priorityInput = document.getElementById('priority');
const algorithmSelect = document.getElementById('algorithm');
const quantumInput = document.getElementById('quantum');
const addBtn = document.getElementById('addBtn');
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const removeLast = document.getElementById('removeLast');
const procTableBody = document.querySelector('#procTable tbody');
const gantt = document.getElementById('gantt');
const timeline = document.getElementById('timeline');
const avgWaiting = document.getElementById('avgWaiting');
const avgTurnaround = document.getElementById('avgTurnaround');
const algoLabel = document.getElementById('algoLabel');
const currentAlgo = document.getElementById('currentAlgo');
const runningCount = document.getElementById('runningCount');
const queueCount = document.getElementById('queueCount');
const cpuPercent = document.getElementById('cpuPercent');
const cpuBarInner = document.getElementById('cpuBarInner');
const langSelect = document.getElementById('langSelect');
const themeToggle = document.getElementById('themeToggle');

let waitingChart = null, turnaroundChart = null;
let modalWaitingChart = null, modalTurnChart = null;
let lastStats = null, lastSchedule = null, lastAlgorithm = null;

// i18n strings
const i18n = {
  en: {
    brand: 'CPU Scheduler', projectTitle: 'CPU Scheduling Simulator', systemMonitor: 'System Monitor', muted: 'Futuristic OS dashboard — demo for scheduling algorithms',
    CPUUsage: 'CPU Usage', Running: 'Running', Queue: 'Queue', Algorithm: 'Algorithm', Controls: 'Controls',
    pidPlaceholder: 'PID (e.g. P1)', arrival: 'Arrival Time', burst: 'Burst Time', priority: 'Priority (opt)', quantum: 'Quantum (RR)',
    addProcess: 'Add Process', runSimulation: 'Run Simulation', clearAll: 'Clear All', processList: 'Process List', ganttChart: 'Gantt Chart',
    statistics: 'Statistics', averageWaiting: 'Average Waiting', averageTurnaround: 'Average Turnaround', comparisons: 'Comparisons', footer: 'Designed for OS Midterm Demo — Animated UX',
    enterValid: 'Please enter valid process details.', addSome: 'Add some processes first.'
  },
  vi: {
    brand: 'Trình lập lịch CPU', projectTitle: 'Bộ mô phỏng Lập lịch CPU', systemMonitor: 'Giám sát hệ thống', muted: 'Bảng điều khiển tương lai — trình diễn các thuật toán lập lịch',
    CPUUsage: 'Sử dụng CPU', Running: 'Đang chạy', Queue: 'Hàng đợi', Algorithm: 'Thuật toán', Controls: 'Điều khiển',
    pidPlaceholder: 'PID (ví dụ P1)', arrival: 'Thời gian đến', burst: 'Thời gian chạy', priority: 'Độ ưu tiên (tùy chọn)', quantum: 'Quantum (RR)',
    addProcess: 'Thêm tiến trình', runSimulation: 'Chạy mô phỏng', clearAll: 'Xóa tất cả', processList: 'Danh sách tiến trình', ganttChart: 'Biểu đồ Gantt',
    statistics: 'Thống kê', averageWaiting: 'Trung bình thời gian chờ', averageTurnaround: 'Trung bình thời gian hoàn tất', comparisons: 'So sánh', footer: 'Thiết kế cho bài kiểm tra giữa kỳ — Giao diện động',
    enterValid: 'Vui lòng nhập thông tin tiến trình hợp lệ.', addSome: 'Vui lòng thêm tiến trình trước.'
  }
};

let currentLang = 'vi';

function applyLanguage(lang){
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const txt = i18n[lang][key] || i18n['en'][key] || el.textContent;
    if(el.tagName === 'INPUT'){
      el.placeholder = txt;
    } else if(el.tagName === 'SELECT'){
      // leave select options
    } else {
      el.textContent = txt;
    }
  });
  // inputs placeholders that used data-i18n as attribute
  const pidEl = document.getElementById('pid');
  if(pidEl && (!pidEl.placeholder || pidEl.placeholder.trim()==='')) pidEl.placeholder = i18n[lang].pidPlaceholder || i18n['en'].pidPlaceholder || '';

  const arrivalEl = document.getElementById('arrival');
  if(arrivalEl && (!arrivalEl.placeholder || arrivalEl.placeholder.trim()==='')) arrivalEl.placeholder = i18n[lang].arrivalPlaceholder || i18n[lang].arrival || '';

  const burstEl = document.getElementById('burst');
  if(burstEl && (!burstEl.placeholder || burstEl.placeholder.trim()==='')) burstEl.placeholder = i18n[lang].burstPlaceholder || i18n[lang].burst || '';

  const priorityEl = document.getElementById('priority');
  if(priorityEl && (!priorityEl.placeholder || priorityEl.placeholder.trim()==='')) priorityEl.placeholder = i18n[lang].priorityPlaceholder || i18n[lang].priority || '';

  const quantumEl = document.getElementById('quantum');
  if(quantumEl && (!quantumEl.placeholder || quantumEl.placeholder.trim()==='')) quantumEl.placeholder = i18n[lang].quantumPlaceholder || i18n[lang].quantum || '';

}

// Utility: refresh table
function renderTable(){
  procTableBody.innerHTML = '';
  processes.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.pid}</td><td>${p.arrival}</td><td>${p.burst}</td><td>${p.priority}</td>`;
    procTableBody.appendChild(tr);
  });
  queueCount.textContent = Math.max(0, processes.length - (gantt.childElementCount>0?1:0));
}

// Add process
addBtn.addEventListener('click', ()=>{
  const pid = pidInput.value.trim() || `P${processes.length+1}`;
  const arrival = parseInt(arrivalInput.value,10);
  const burst = parseInt(burstInput.value,10);
  const priority = parseInt(priorityInput.value,10)||0;
  if(!pid || isNaN(arrival) || isNaN(burst)) return alert(i18n[currentLang].enterValid);
  processes.push({pid,arrival,burst,priority,originalBurst:burst});
  pidInput.value=''; arrivalInput.value='0'; burstInput.value='5'; priorityInput.value='1';
  renderTable();
});

removeLast.addEventListener('click', ()=>{ processes.pop(); renderTable(); });

clearBtn.addEventListener('click', ()=>{ processes.length=0; renderTable(); clearVisuals(); });

algorithmSelect.addEventListener('change', ()=>{ currentAlgo.textContent = algorithmSelect.value; });

// Run simulation
runBtn.addEventListener('click', ()=>{
  if(processes.length===0) return alert(i18n[currentLang].addSome);
  const algo = algorithmSelect.value;
  const quantum = parseInt(quantumInput.value,10)||2;
  algoLabel.textContent = algo;
  currentAlgo.textContent = algo;
  // clone processes to avoid mutating original order for table
  const procs = processes.map(p=>({...p})).sort((a,b)=>a.arrival - b.arrival || a.pid.localeCompare(b.pid));

  let schedule = [];// {pid, start, end}

  if(algo==='FCFS') schedule = fcfs(procs);
  else if(algo==='SJF') schedule = sjf(procs);
  else schedule = roundRobin(procs, quantum);

  // compute stats
  const stats = computeStats(schedule, processes);
  // cache for Reports modal
  lastStats = stats; lastSchedule = schedule; lastAlgorithm = algo;
  displayStats(stats);
  renderGantt(schedule);
  renderCharts(stats);
});

function clearVisuals(){
  gantt.innerHTML=''; timeline.innerHTML=''; avgWaiting.textContent='-'; avgTurnaround.textContent='-'; algoLabel.textContent='-';
  if(waitingChart) waitingChart.destroy(); if(turnaroundChart) turnaroundChart.destroy();
}

// FCFS implementation
function fcfs(procs){
  // First-Come First-Served: execute in arrival order (stable)
  const list = procs.slice().sort((a,b)=>a.arrival - b.arrival || a.pid.localeCompare(b.pid));
  const schedule = [];
  let time = 0;
  for(const p of list){
    if(time < p.arrival) time = p.arrival;
    schedule.push({pid: p.pid, start: time, end: time + p.burst});
    time += p.burst;
  }
  return schedule;
}

// Non-preemptive SJF
function sjf(procs){
  // Non-preemptive Shortest Job First
  const list = procs.slice().sort((a,b)=>a.arrival - b.arrival || a.pid.localeCompare(b.pid));
  const ready = [];
  const schedule = [];
  let time = 0;
  while(list.length > 0 || ready.length > 0){
    while(list.length > 0 && list[0].arrival <= time) ready.push(list.shift());
    if(ready.length === 0){
      // jump to next arrival
      time = list[0].arrival;
      continue;
    }
    // pick shortest burst among ready
    ready.sort((a,b)=>a.burst - b.burst || a.arrival - b.arrival);
    const p = ready.shift();
    schedule.push({pid: p.pid, start: time, end: time + p.burst});
    time += p.burst;
  }
  return schedule;
}

// Round Robin
function roundRobin(procs, quantum){
  // Round Robin with time quantum (quantum assumed in same time units as burst)
  const list = procs.slice().sort((a,b)=>a.arrival - b.arrival || a.pid.localeCompare(b.pid));
  const queue = [];
  const schedule = [];
  let time = 0;

  while(list.length > 0 || queue.length > 0){
    // enqueue arrivals at current time
    while(list.length > 0 && list[0].arrival <= time){
      const np = list.shift();
      queue.push({pid: np.pid, arrival: np.arrival, rem: np.burst});
    }

    if(queue.length === 0){
      // advance time to next arrival
      if(list.length > 0) { time = list[0].arrival; continue; }
      else break;
    }

    const cur = queue.shift();
    const exec = Math.min(quantum, cur.rem);
    const start = time;
    const end = time + exec;
    schedule.push({pid: cur.pid, start, end});
    time = end;
    cur.rem -= exec;

    // enqueue arrivals that occurred during this time slice
    while(list.length > 0 && list[0].arrival <= time){
      const np = list.shift();
      queue.push({pid: np.pid, arrival: np.arrival, rem: np.burst});
    }

    if(cur.rem > 0){
      queue.push(cur); // requeue remaining portion
    }
  }
  return schedule;
}

// Compute Completion, Turnaround, Waiting times per PID
function computeStats(schedule, original){
  // Compute completion and first-start (for response) from schedule entries
  const completion = {};
  const firstStart = {};
  schedule.forEach(s => {
    if(firstStart[s.pid] === undefined) firstStart[s.pid] = s.start;
    completion[s.pid] = Math.max(completion[s.pid] || 0, s.end);
  });

  const res = original.map(p => {
    const completionTime = completion[p.pid] !== undefined ? completion[p.pid] : p.arrival;
    const turnaround = completionTime - p.arrival;
    const waiting = turnaround - p.originalBurst;
    const response = (firstStart[p.pid] !== undefined) ? (firstStart[p.pid] - p.arrival) : 0;
    return { pid: p.pid, arrival: p.arrival, burst: p.originalBurst, completion: completionTime, turnaround, waiting, response };
  });

  const avgWaiting = (res.reduce((a,b)=>a+b.waiting,0)/res.length)||0;
  const avgTurnaround = (res.reduce((a,b)=>a+b.turnaround,0)/res.length)||0;
  const avgResponse = (res.reduce((a,b)=>a+b.response,0)/res.length)||0;
  return { perProcess: res, avgWaiting, avgTurnaround, avgResponse, schedule };
}

function displayStats(stats){
  avgWaiting.textContent = stats.avgWaiting.toFixed(2);
  avgTurnaround.textContent = stats.avgTurnaround.toFixed(2);
  algoLabel.textContent = algorithmSelect.value;
}

// Render Gantt chart with animated blocks
function renderGantt(schedule){
  gantt.innerHTML=''; timeline.innerHTML='';
  if(schedule.length===0) return;
  // determine total time span
  const startTime = schedule[0].start;
  const endTime = schedule[schedule.length-1].end;
  const total = endTime - startTime || 1;

  schedule.forEach((s,idx)=>{
    const w = ((s.end - s.start) / total) * 100;
    const div = document.createElement('div');
    div.className='proc';
    div.style.width = `${w}%`;
    div.style.background = colors[idx % colors.length];
    div.textContent = s.pid;
    div.style.opacity = '0';
    gantt.appendChild(div);
  });

  // Animate sequentially by revealing blocks with delay
  const procs = Array.from(gantt.children);
  let offset = 0;
  procs.forEach((el,i)=>{
    const dur = 600; // ms per block
    setTimeout(()=>{ el.style.opacity='1'; el.style.transform='scaleX(1)'; }, offset);
    offset += dur;
  });

  // timeline labels
  schedule.forEach(s=>{
    const span = document.createElement('div');
    span.textContent = s.start;
    timeline.appendChild(span);
  });
  // add final end time
  const last = document.createElement('div'); last.textContent = schedule[schedule.length-1].end; timeline.appendChild(last);

  // update running/queue counts
  runningCount.textContent = 1;
  queueCount.textContent = Math.max(0, processes.length-1);

  // Simulate CPU usage animation during gantt playback
  simulateCpuDuringPlayback(offset);
}

function simulateCpuDuringPlayback(totalMs){
  let elapsed=0; const step=200; const max=totalMs||1000;
  const t = setInterval(()=>{
    elapsed += step;
    const pct = 20 + Math.round(70 * (Math.abs(Math.sin((elapsed/500))) ));
    cpuPercent.textContent = pct;
    cpuBarInner.style.width = `${pct}%`;
    if(elapsed>=max){ clearInterval(t); cpuPercent.textContent = 6; cpuBarInner.style.width='6%'; runningCount.textContent=0; queueCount.textContent=processes.length; }
  }, step);
}

// Charts using Chart.js
function renderCharts(stats){
  const labels = stats.perProcess.map(p=>p.pid);
  const waiting = stats.perProcess.map(p=>p.waiting);
  const turnaround = stats.perProcess.map(p=>p.turnaround);

  if(waitingChart) waitingChart.destroy();
  if(turnaroundChart) turnaroundChart.destroy();

  const wctx = document.getElementById('waitingChart').getContext('2d');
  waitingChart = new Chart(wctx, {type:'bar',data:{labels, datasets:[{label:'Waiting Time',data:waiting, backgroundColor:labels.map((_,i)=>colors[i%colors.length])}]}, options:{plugins:{legend:{display:false}}}});

  const tctx = document.getElementById('turnaroundChart').getContext('2d');
  turnaroundChart = new Chart(tctx, {type:'bar',data:{labels, datasets:[{label:'Turnaround Time',data:turnaround, backgroundColor:labels.map((_,i)=>colors[i%colors.length])}]}, options:{plugins:{legend:{display:false}}}});
}

// Initial CPU idle animation
function idleCpuLoop(){
  let pct = 6; let dir=1;
  setInterval(()=>{
    pct += dir * (1 + Math.round(Math.random()*6));
    if(pct>28) dir=-1; if(pct<4) dir=1;
    cpuPercent.textContent = pct; cpuBarInner.style.width = pct + '%';
  }, 1200);
}

// Theme toggle
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
});

// Language selector
langSelect.addEventListener('change', (e)=> applyLanguage(e.target.value));

// Init
renderTable(); applyLanguage(currentLang); idleCpuLoop();

// Modal and sidebar navigation handlers
const modalOverlay = document.getElementById('modalOverlay');
function openModal(id){
  const modal = document.getElementById(id); if(!modal || !modalOverlay) return;
  // hide all modals
  modalOverlay.querySelectorAll('.modal').forEach(m=>{ m.style.display='none'; m.setAttribute('aria-hidden','true'); });
  modal.style.display = 'block'; modal.setAttribute('aria-hidden','false'); modalOverlay.style.display = 'flex';
  // prevent background scrolling
  document.body.style.overflow = 'hidden';
  // if opening reports, populate with latest data
  if(id === 'reportsModal') populateReports();
}
function closeModals(){ if(!modalOverlay) return; // destroy modal charts to free resources
  try{ if(modalWaitingChart){ modalWaitingChart.destroy(); modalWaitingChart = null; } }catch(e){}
  try{ if(modalTurnChart){ modalTurnChart.destroy(); modalTurnChart = null; } }catch(e){}
  modalOverlay.style.display='none'; modalOverlay.querySelectorAll('.modal').forEach(m=>{ m.style.display='none'; m.setAttribute('aria-hidden','true'); }); document.body.style.overflow = ''; }

function populateReports(){
  const avgWaitEl = document.getElementById('avgWaitReport');
  const avgTurnEl = document.getElementById('avgTurnReport');
  const algoEl = document.getElementById('reportAlgo');
  const tbody = document.getElementById('reportProcTableBody');
  if(!lastStats){
    if(avgWaitEl) avgWaitEl.textContent = '-';
    if(avgTurnEl) avgTurnEl.textContent = '-';
    if(algoEl) algoEl.textContent = lastAlgorithm || algorithmSelect.value || '-';
    if(tbody) tbody.innerHTML = `<tr><td colspan="6" style="padding:8px">No simulation data. Run a simulation first.</td></tr>`;
    // clear any existing charts
    if(modalWaitingChart){ modalWaitingChart.destroy(); modalWaitingChart = null; }
    if(modalTurnChart){ modalTurnChart.destroy(); modalTurnChart = null; }
    return;
  }
  // populate summary
  if(avgWaitEl) avgWaitEl.textContent = lastStats.avgWaiting.toFixed(2);
  if(avgTurnEl) avgTurnEl.textContent = lastStats.avgTurnaround.toFixed(2);
  if(algoEl) algoEl.textContent = lastAlgorithm || algorithmSelect.value || '-';
  // populate table
  if(tbody){
    tbody.innerHTML = '';
    lastStats.perProcess.forEach(p=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${p.pid}</td><td>${p.arrival}</td><td>${p.burst}</td><td>${p.completion}</td><td>${p.turnaround}</td><td>${p.waiting}</td>`;
      tbody.appendChild(tr);
    });
  }
  // charts
  const labels = lastStats.perProcess.map(p=>p.pid);
  const waiting = lastStats.perProcess.map(p=>p.waiting);
  const turnaround = lastStats.perProcess.map(p=>p.turnaround);
  try{ if(modalWaitingChart) modalWaitingChart.destroy(); }catch(e){}
  try{ if(modalTurnChart) modalTurnChart.destroy(); }catch(e){}
  const wcan = document.getElementById('modalWaitingChart');
  const tcan = document.getElementById('modalTurnChart');
  if(wcan && wcan.getContext){
    const ctx = wcan.getContext('2d');
    modalWaitingChart = new Chart(ctx, {type:'bar', data:{labels, datasets:[{label:'Waiting', data:waiting, backgroundColor: labels.map((_,i)=>colors[i%colors.length])}]}, options:{plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}});
  }
  if(tcan && tcan.getContext){
    const ctx2 = tcan.getContext('2d');
    modalTurnChart = new Chart(ctx2, {type:'bar', data:{labels, datasets:[{label:'Turnaround', data:turnaround, backgroundColor: labels.map((_,i)=>colors[i%colors.length])}]}, options:{plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}});
  }
}
if(modalOverlay){
  modalOverlay.addEventListener('click', (e)=>{ if(e.target === modalOverlay) closeModals(); });
}
document.addEventListener('click', (e)=>{ const btn = e.target.closest && e.target.closest('.modal-close'); if(btn) closeModals(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModals(); });

// small helper: apply a transient highlight class to an element
function highlightElementOnce(el, duration=1800){ if(!el) return; el.classList.remove('highlight-glow'); void el.offsetWidth; el.classList.add('highlight-glow'); setTimeout(()=>{ el.classList.remove('highlight-glow'); }, duration); }

// Sidebar nav behaviour: Dashboard/Simulator are in-page; Reports/About open modals
const navLinks = document.querySelectorAll('.sidebar nav a');
if(navLinks && navLinks.length>0){
  navLinks.forEach(a=>{
    a.addEventListener('click', (ev)=>{
      ev.preventDefault(); navLinks.forEach(x=>x.classList.remove('active')); a.classList.add('active');
      const txt = a.textContent.trim().toLowerCase();
      if(txt.includes('report')) openModal('reportsModal');
      else if(txt.includes('about')) openModal('aboutModal');
      else if(txt.includes('simulator')){
        const sim = document.getElementById('simArea');
        if(sim){ sim.scrollIntoView({behavior:'smooth', block:'start'}); highlightElementOnce(sim, 1800); }
        else { const f = document.getElementById('processForm'); if(f) f.scrollIntoView({behavior:'smooth', block:'center'}); }
      }
      else { window.scrollTo({top:0, behavior:'smooth'}); }
    });
  });
}

// Settings button opens settings modal
const settingsBtnEl = document.getElementById('settingsBtn');
if(settingsBtnEl) settingsBtnEl.addEventListener('click', ()=> openModal('settingsModal'));
const darkModeSwitchModal = document.getElementById('darkModeSwitchModal');
if(darkModeSwitchModal){ darkModeSwitchModal.checked = document.body.classList.contains('dark'); darkModeSwitchModal.addEventListener('change', (e)=>{ document.body.classList.toggle('dark', e.target.checked); localStorage.setItem('darkMode', e.target.checked?'1':'0'); }); }

// Expose some helpers for debugging
window.__sim = {processes, renderGantt, fcfs, sjf, roundRobin};

// Comments: core scheduling implementations are above. computeStats determines completion times

