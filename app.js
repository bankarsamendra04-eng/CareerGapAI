const demoAnalysis = {
  readiness_score: 72,
  skill_match: 68,
  matched_skills: ["Python", "SQL", "NumPy", "Pandas", "Scikit-learn", "Git"],
  gaps: [
    {name:"Docker", detail:"Required for production ML workflows", priority:"HIGH", tone:"red", icon:"⬡"},
    {name:"PyTorch", detail:"Build deep learning model evidence", priority:"HIGH", tone:"red", icon:"◈"},
    {name:"MLOps", detail:"Move models from notebook to product", priority:"MEDIUM", tone:"amber", icon:"⌁"},
    {name:"AWS", detail:"Common cloud environment for this role", priority:"MEDIUM", tone:"amber", icon:"☁"}
  ],
  roadmap: [
    {week:"01", title:"Strengthen your ML foundations", skills:"Python · NumPy · Pandas · Scikit-learn", status:"COMPLETE", tone:"green"},
    {week:"02", title:"Build your first deep learning model", skills:"PyTorch · Neural networks · Model evaluation", status:"IN PROGRESS", tone:"red"},
    {week:"03", title:"Ship it with Docker", skills:"Docker · FastAPI · REST APIs · Deployment", status:"NEXT UP", tone:"amber"},
    {week:"04", title:"Make it production-ready", skills:"AWS · Monitoring · MLOps · Portfolio polish", status:"UP NEXT", tone:"purple"}
  ],
  projects: [
    {title:"Deploy an ML prediction API", description:"Containerize a FastAPI model endpoint, add a /predict route, and deploy it.", label:"CLOSES A GAP"},
    {title:"Real-time model monitoring", description:"Track latency and drift with a lightweight monitoring dashboard.", label:"CLOSES A GAP"},
    {title:"Resume skill extractor", description:"Turn resume text into structured skills with explainable extraction.", label:"STRETCH PROJECT"},
    {title:"Cloud cost anomaly detector", description:"Build an AWS-ready pipeline that flags unusual spending.", label:"STRETCH PROJECT"}
  ],
  interview_questions: [
    "How would you deploy a machine learning model?",
    "What is the difference between batch and real-time inference?",
    "How do you detect model drift in production?",
    "Explain precision, recall, and when you would optimize each."
  ]
};

const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[character]));
const safeTone = tone => ["green", "red", "amber", "purple"].includes(tone) ? tone : "purple";
const toast = message => { const el = $("#toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2800); };
let analysisReady = false;
let currentAnalysis = null;
const maxResumeSize = 10 * 1024 * 1024;
const supportedResumeExtensions = [".pdf", ".docx", ".txt"];
const analysisData = () => currentAnalysis || demoAnalysis;

const views = {
  skills: {eyebrow:"SKILL GAP ANALYSIS", title:"Your skills, with the gaps made clear.", copy:"We compare your demonstrated evidence against what your target role asks for.", render: () => {
    const data = analysisData();
    return `<div class="detail-grid"><div class="detail-block"><h2>Matched skills <span class="tag green">${data.matched_skills.length} SKILLS</span></h2>${data.matched_skills.map(skill => `<div class="detail-skill"><span class="skill-token green">✓</span><div><h3>${escapeHtml(skill)}</h3><p>Demonstrated in your resume and project evidence.</p></div><span class="tag green">MATCHED</span></div>`).join("")}</div><div class="detail-block"><h2>Priority gaps <span class="tag red">${data.gaps.length} TO CLOSE</span></h2>${data.gaps.map(gap => `<div class="detail-skill"><span class="skill-token ${safeTone(gap.tone)}">${escapeHtml(gap.icon || "◆")}</span><div><h3>${escapeHtml(gap.name)}</h3><p>${escapeHtml(gap.detail)}. Build evidence, not just a course certificate.</p></div><span class="tag ${safeTone(gap.tone)}">${escapeHtml(gap.priority)}</span></div>`).join("")}</div></div>`;
  }},
  roadmap: {eyebrow:"PERSONALIZED ROADMAP", title:"A practical path to job-ready.", copy:"Every learning milestone ends with something you can show.", render: () => `<div class="roadmap-big">${analysisData().roadmap.map(week => `<div class="week-card"><span class="week-number">${escapeHtml(week.week)}</span><div><h3>${escapeHtml(week.title)}</h3><p>${escapeHtml(week.skills)}</p></div><span class="tag ${safeTone(week.tone)}">${escapeHtml(week.status)}</span></div>`).join("")}</div>`},
  projects: {eyebrow:"PORTFOLIO PROJECTS", title:"Build proof, not just knowledge.", copy:"Projects close your highest-priority gaps and create evidence recruiters can inspect.", render: () => `<div class="project-grid">${analysisData().projects.map((project, index) => `<article class="project-tile"><div class="project-art"><div class="terminal"><span>● ● ●</span><code>$ ${index % 2 ? "python monitor.py" : "docker compose up"}<br /><b>✔ service running</b></code></div><div class="art-glow"></div></div><span class="tag ${index < 2 ? "red" : "green"}">${escapeHtml(project.label)}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p><button class="primary-button small-button" data-toast="Project brief saved to your roadmap">Add to roadmap <span>→</span></button></article>`).join("")}</div>`},
  interview: {eyebrow:"INTERVIEW PREPARATION", title:"Walk into interviews with a plan.", copy:"Practice the topics behind your gaps, plus the stories that show how you learn.", render: () => `<div class="detail-grid"><div class="detail-block"><h2>Technical topics</h2><div class="interview-list">${analysisData().interview_questions.map((question, index) => `<div class="question-card"><span class="tag ${index < 2 ? "red" : "green"}">${index < 2 ? "HIGH PRIORITY" : "CORE TOPIC"}</span><h3>${escapeHtml(question)}</h3><p>Prepare a concise answer with one example from a project you can demo.</p></div>`).join("")}</div></div><div class="detail-block"><h2>Behavioral stories to prepare</h2><div class="interview-list">${["A time you learned a difficult technology quickly","A project where your first approach failed","How you communicate tradeoffs to a non-technical teammate","What makes you excited about applied AI"].map(question => `<div class="question-card"><h3>${question}</h3><p>Use the STAR format: situation, task, action, and measurable result.</p></div>`).join("")}</div></div></div>`}
};

function renderGaps() {
  $("#gap-list").innerHTML = analysisData().gaps.slice(0, 3).map(gap => `<div class="gap-item"><span class="skill-token ${safeTone(gap.tone)}">${escapeHtml(gap.icon || "◆")}</span><div><strong>${escapeHtml(gap.name)}</strong><small>${escapeHtml(gap.detail)}</small></div><span class="priority ${gap.priority === "HIGH" ? "high" : "medium"}">${escapeHtml(gap.priority)}</span><span class="gap-action">→</span></div>`).join("");
}

function applyAnalysis(analysis) {
  currentAnalysis = analysis;
  const score = $(".score-row>strong");
  const scorePercent = $(".score-ring b");
  const skillMatch = $(".metric-card>strong");
  if (score) score.textContent = analysis.readiness_score;
  if (scorePercent) scorePercent.textContent = `${analysis.readiness_score}%`;
  if (skillMatch) skillMatch.innerHTML = `${analysis.skill_match}<span>%</span>`;
  $(".score-bar span").style.width = `${analysis.readiness_score}%`;
  $(".mini-bar span").style.width = `${analysis.skill_match}%`;
  const evidence = $(".evidence-list");
  const github = analysis.github_evidence || {};
  if (evidence && github.username) {
    evidence.innerHTML = `<span><i class="dot green-dot"></i>Projects <b>${analysis.projects.length} mapped</b></span><span><i class="dot blue-dot"></i>GitHub <b>${github.status === "unavailable" ? "Unavailable" : `${github.public_repos} repos`}</b></span>`;
  }
}

function showDashboard(analysis) {
  applyAnalysis(analysis);
  analysisReady = true;
  $("#setup-view").classList.add("hidden");
  $("#dashboard-view").classList.remove("hidden");
  $("#detail-view").classList.add("hidden");
  $("#target-role-display").textContent = $("#role-select").value;
  renderGaps();
  window.scrollTo({top:0, behavior:"smooth"});
  toast("Analysis ready — your roadmap is waiting.");
}

function showView(view) {
  if (!analysisReady) return;
  $("#setup-view").classList.add("hidden");
  if (view === "overview") {
    $("#detail-view").classList.add("hidden");
    $("#dashboard-view").classList.remove("hidden");
    renderGaps();
  } else {
    const content = views[view];
    $("#dashboard-view").classList.add("hidden");
    $("#detail-view").classList.remove("hidden");
    $("#detail-view").innerHTML = `<div class="detail-header"><div class="eyebrow">${content.eyebrow}</div><h1>${content.title}</h1><p>${content.copy}</p></div>${content.render()}`;
  }
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === view));
  $(".breadcrumb strong").textContent = view === "overview" ? "Overview" : contentName(view);
  window.scrollTo({top:0, behavior:"smooth"});
}

const contentName = view => ({skills:"Skill gaps", roadmap:"Roadmap", projects:"Projects", interview:"Interview prep"})[view];

document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) { event.preventDefault(); showView(viewButton.dataset.view); }
  const toastButton = event.target.closest("[data-toast]");
  if (toastButton) toast(toastButton.dataset.toast);
});

$("#analyze-button").addEventListener("click", async () => {
  const button = $("#analyze-button");
  const formData = new FormData();
  const file = $("#resume-file").files[0];
  if (file) formData.append("resume", file);
  formData.append("sample", String($("#file-label").textContent === "Sample profile loaded"));
  formData.append("role", $("#role-select").value);
  formData.append("github_username", $("#github-input").value);
  button.disabled = true;
  button.querySelector("span").textContent = "…";
  try {
    const response = await fetch("/api/analyze", {method:"POST", body:formData});
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.detail || "Analysis failed.");
    showDashboard(payload);
  } catch (error) {
    toast(error.message);
  } finally {
    button.disabled = false;
    button.querySelector("span").textContent = "→";
  }
});

$("#new-analysis").addEventListener("click", () => {
  analysisReady = false;
  currentAnalysis = null;
  $("#dashboard-view").classList.add("hidden");
  $("#detail-view").classList.add("hidden");
  $("#setup-view").classList.remove("hidden");
  window.scrollTo({top:0, behavior:"smooth"});
});

$("#sample-button").addEventListener("click", () => {
  $("#file-label").textContent = "Sample profile loaded";
  $("#dropzone").classList.add("dragover");
  setTimeout(() => $("#dropzone").classList.remove("dragover"), 700);
  toast("Sample profile loaded — ready to analyze.");
});

function isSupportedResume(file) {
  if (!file) return false;
  const extension = `.${file.name.split(".").pop().toLowerCase()}`;
  if (!supportedResumeExtensions.includes(extension)) { toast("Use a PDF, DOCX, or TXT resume."); return false; }
  if (file.size > maxResumeSize) { toast("That file is larger than 10MB."); return false; }
  return true;
}

function confirmResume(file) { $("#file-label").textContent = file.name; toast("Resume added to your profile."); }

$("#resume-file").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  if (isSupportedResume(file)) confirmResume(file);
  else event.target.value = "";
});

const dropzone = $("#dropzone");
["dragenter", "dragover"].forEach(type => dropzone.addEventListener(type, event => { event.preventDefault(); dropzone.classList.add("dragover"); }));
["dragleave", "drop"].forEach(type => dropzone.addEventListener(type, event => { event.preventDefault(); dropzone.classList.remove("dragover"); }));
dropzone.addEventListener("drop", event => {
  const file = event.dataTransfer.files[0];
  if (!file) { toast("Drop a resume file — PDF, DOCX, or TXT."); return; }
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
