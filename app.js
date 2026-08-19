const gapData = [
  {name:"Docker", detail:"Required for production ML workflows", priority:"HIGH", tone:"red", icon:"⬡", action:"Containerize an ML API"},
  {name:"PyTorch", detail:"Build deep learning model evidence", priority:"HIGH", tone:"red", icon:"◈", action:"Train a neural network"},
  {name:"MLOps", detail:"Move models from notebook to product", priority:"MEDIUM", tone:"amber", icon:"⌁", action:"Add a model pipeline"},
  {name:"AWS", detail:"Common cloud environment for this role", priority:"MEDIUM", tone:"amber", icon:"☁", action:"Deploy to the cloud"},
];
const views = {
  skills: {eyebrow:"SKILL GAP ANALYSIS", title:"Your skills, with the gaps made clear.", copy:"We compare your demonstrated evidence against what AI / ML Engineer roles ask for.", html:`<div class="detail-grid"><div class="detail-block"><h2>Matched skills <span class="tag green">11 SKILLS</span></h2>${["Python","SQL","NumPy","Pandas","Scikit-learn","Git"].map(skill=>`<div class="detail-skill"><span class="skill-token green">✓</span><div><h3>${skill}</h3><p>Demonstrated in your resume and project evidence.</p></div><span class="tag green">MATCHED</span></div>`).join("")}</div><div class="detail-block"><h2>Priority gaps <span class="tag red">5 TO CLOSE</span></h2>${gapData.map(g=>`<div class="detail-skill"><span class="skill-token ${g.tone}">${g.icon}</span><div><h3>${g.name}</h3><p>${g.detail}. Build evidence, not just a course certificate.</p></div><span class="tag ${g.tone}">${g.priority}</span></div>`).join("")}</div></div>`},
  roadmap: {eyebrow:"PERSONALIZED ROADMAP", title:"A practical path to job-ready.", copy:"Four focused weeks. Every learning milestone ends with something you can show.", html:`<div class="roadmap-big">${[["01","Strengthen your ML foundations","Python · NumPy · Pandas · Scikit-learn","COMPLETE","green"],["02","Build your first deep learning model","PyTorch · Neural networks · Model evaluation","IN PROGRESS","red"],["03","Ship it with Docker","Docker · FastAPI · REST APIs · Deployment","NEXT UP","amber"],["04","Make it production-ready","AWS · Monitoring · MLOps · Portfolio polish","UP NEXT","purple"]].map(w=>`<div class="week-card"><span class="week-number">${w[0]}</span><div><h3>${w[1]}</h3><p>${w[2]}</p></div><span class="tag ${w[4]}">${w[3]}</span></div>`).join("")}</div>`},
  projects: {eyebrow:"PORTFOLIO PROJECTS", title:"Build proof, not just knowledge.", copy:"Projects are selected to close your highest-priority gaps and create evidence recruiters can inspect.", html:`<div class="project-grid">${["Deploy an ML prediction API","Real-time model monitoring","Resume skill extractor","Cloud cost anomaly detector"].map((p,i)=>`<article class="project-tile"><div class="project-art"><div class="terminal"><span>● ● ●</span><code>$ ${i%2?"python monitor.py":"docker compose up"}<br /><b>✔ service running</b></code></div><div class="art-glow"></div></div><span class="tag ${i<2?"red":"green"}">${i<2?"CLOSES A GAP":"STRETCH PROJECT"}</span><h3>${p}</h3><p>${["Containerize a FastAPI model endpoint, add a /predict route, and deploy it.","Track latency and drift with a lightweight monitoring dashboard.","Turn resume text into structured skills with explainable extraction.","Build an AWS-ready pipeline that flags unusual spending."][i]}</p><button class="primary-button small-button" data-toast="Project brief saved to your roadmap">Add to roadmap <span>→</span></button></article>`).join("")}</div>`},
  interview: {eyebrow:"INTERVIEW PREPARATION", title:"Walk into interviews with a plan.", copy:"Practice the topics behind your gaps, plus the stories that show how you learn.", html:`<div class="detail-grid"><div class="detail-block"><h2>Technical topics</h2><div class="interview-list">${["How would you deploy a machine learning model?","What is the difference between batch and real-time inference?","How do you detect model drift in production?","Explain precision, recall, and when you would optimize each."].map((q,i)=>`<div class="question-card"><span class="tag ${i<2?"red":"green"}">${i<2?"HIGH PRIORITY":"CORE TOPIC"}</span><h3>${q}</h3><p>Prepare a concise answer with one example from a project you can demo.</p></div>`).join("")}</div></div><div class="detail-block"><h2>Behavioral stories to prepare</h2><div class="interview-list">${["A time you learned a difficult technology quickly","A project where your first approach failed","How you communicate tradeoffs to a non-technical teammate","What makes you excited about applied AI"].map(q=>`<div class="question-card"><h3>${q}</h3><p>Use the STAR format: situation, task, action, and measurable result.</p></div>`).join("")}</div></div></div>`}
};

const $ = selector => document.querySelector(selector);
const toast = message => { const el = $("#toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2800); };
let analysisReady = false;
const maxResumeSize = 10 * 1024 * 1024;
const supportedResumeExtensions = [".pdf", ".doc", ".docx", ".txt"];
function renderGaps() {
  $("#gap-list").innerHTML = gapData.slice(0,3).map(g => `<div class="gap-item"><span class="skill-token ${g.tone}">${g.icon}</span><div><strong>${g.name}</strong><small>${g.detail}</small></div><span class="priority ${g.priority === "HIGH" ? "high" : "medium"}">${g.priority}</span><span class="gap-action">→</span></div>`).join("");
}
function showDashboard() {
  analysisReady = true;
  $("#setup-view").classList.add("hidden"); $("#dashboard-view").classList.remove("hidden"); $("#detail-view").classList.add("hidden");
  $("#target-role-display").textContent = $("#role-select").value;
  renderGaps(); window.scrollTo({top:0,behavior:"smooth"}); toast("Analysis ready — your roadmap is waiting.");
}
function showView(view) {
  if (!analysisReady) return;
  $("#setup-view").classList.add("hidden");
  if (view === "overview") { $("#detail-view").classList.add("hidden"); $("#dashboard-view").classList.remove("hidden"); renderGaps(); }
  else { const content = views[view]; $("#dashboard-view").classList.add("hidden"); $("#detail-view").classList.remove("hidden"); $("#detail-view").innerHTML = `<div class="detail-header"><div class="eyebrow">${content.eyebrow}</div><h1>${content.title}</h1><p>${content.copy}</p></div>${content.html}`; }
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === view)); $(".breadcrumb strong").textContent = view === "overview" ? "Overview" : contentName(view); window.scrollTo({top:0,behavior:"smooth"});
}
const contentName = view => ({skills:"Skill gaps",roadmap:"Roadmap",projects:"Projects",interview:"Interview prep"})[view];
document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) { event.preventDefault(); showView(viewButton.dataset.view); }
  const toastButton = event.target.closest("[data-toast]"); if (toastButton) toast(toastButton.dataset.toast);
});
$("#analyze-button").addEventListener("click", showDashboard);
$("#new-analysis").addEventListener("click", () => { analysisReady = false; $("#dashboard-view").classList.add("hidden"); $("#detail-view").classList.add("hidden"); $("#setup-view").classList.remove("hidden"); window.scrollTo({top:0,behavior:"smooth"}); });
$("#sample-button").addEventListener("click", () => { $("#file-label").textContent = "Sample profile loaded"; $("#dropzone").classList.add("dragover"); setTimeout(() => $("#dropzone").classList.remove("dragover"), 700); toast("Sample profile loaded — ready to analyze."); });
function isSupportedResume(file) {
  if (!file) return false;
  const extension = `.${file.name.split(".").pop().toLowerCase()}`;
  if (!supportedResumeExtensions.includes(extension)) { toast("Use a PDF, DOC, DOCX, or TXT resume."); return false; }
  if (file.size > maxResumeSize) { toast("That file is larger than 10MB."); return false; }
  return true;
}
function confirmResume(file) { $("#file-label").textContent = file.name; toast("Resume added to your profile."); }
$("#resume-file").addEventListener("change", event => { const file = event.target.files[0]; if (!file) return; if (isSupportedResume(file)) confirmResume(file); else event.target.value = ""; });
const dropzone = $("#dropzone"); ["dragenter","dragover"].forEach(type => dropzone.addEventListener(type, e => { e.preventDefault(); dropzone.classList.add("dragover"); })); ["dragleave","drop"].forEach(type => dropzone.addEventListener(type, e => { e.preventDefault(); dropzone.classList.remove("dragover"); })); dropzone.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (!isSupportedResume(file)) return;
  try {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    $("#resume-file").files = transfer.files;
  } catch {
    toast("Could not attach that file — use Browse files instead.");
    return;
  }
  confirmResume(file);
});
