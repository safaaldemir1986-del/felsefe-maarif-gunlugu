const profileForm = document.getElementById('profileForm');
const setup = document.getElementById('setup');
const dashboard = document.getElementById('dashboard');
const teacherInput = document.getElementById('teacherInput');
const schoolInput = document.getElementById('schoolInput');

const quotes = [
  ["Bilgelik, neyi bilmediğini bilmektir.", "Sokrates"],
  ["İnsan her şeyin ölçüsüdür.", "Protagoras"],
  ["Düşünüyorum, öyleyse varım.", "Descartes"],
  ["Umut uyanık insanın rüyasıdır.", "Aristoteles"],
  ["İnsan özgürlüğe mahkûmdur.", "Sartre"],
  ["Hayat geriye doğru anlaşılır, ileriye doğru yaşanır.", "Kierkegaard"]
];

function getProfile(){
  try { return JSON.parse(localStorage.getItem('fmg-profile')); }
  catch(e){ return null; }
}
function initials(name){
  return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
}
function applyProfile(p){
  document.getElementById('welcomeName').textContent = p.teacher + '.';
  document.getElementById('welcomeSchool').textContent = p.school;
  document.getElementById('sideTeacher').textContent = p.teacher;
  document.getElementById('sideSchool').textContent = p.school;
  document.getElementById('teacherInitials').textContent = initials(p.teacher);
}
function showDashboard(p){
  applyProfile(p);
  setup.classList.remove('active');
  dashboard.classList.add('active');
}
function showSetup(p){
  if(p){
    teacherInput.value=p.teacher||'';
    schoolInput.value=p.school||'';
  }
  dashboard.classList.remove('active');
  setup.classList.add('active');
}
profileForm.addEventListener('submit',e=>{
  e.preventDefault();
  const p={teacher:teacherInput.value.trim(),school:schoolInput.value.trim()};
  localStorage.setItem('fmg-profile',JSON.stringify(p));
  showDashboard(p);
});
document.getElementById('editProfile').addEventListener('click',()=>showSetup(getProfile()));

function activate(id){
  document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const nav=document.querySelector(`.nav-item[data-section="${id}"]`);
  if(nav) nav.classList.add('active');
}
document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>activate(btn.dataset.section)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>activate(btn.dataset.go)));

function refreshClock(){
  const now=new Date();
  document.getElementById('today').textContent=now.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  document.getElementById('clock').textContent=now.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
}
refreshClock(); setInterval(refreshClock,1000);

const qi = new Date().getDate() % quotes.length;
document.getElementById('quoteText').textContent=quotes[qi][0];
document.getElementById('quoteAuthor').textContent='— '+quotes[qi][1];

const journalText=document.getElementById('journalText');
journalText.value=localStorage.getItem('fmg-journal')||'';
document.getElementById('saveJournal').addEventListener('click',()=>{
  localStorage.setItem('fmg-journal',journalText.value);
  const st=document.getElementById('saveState');
  st.textContent='Kaydedildi • '+new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
});

const saved=getProfile();
if(saved?.teacher && saved?.school) showDashboard(saved);
else showSetup();
