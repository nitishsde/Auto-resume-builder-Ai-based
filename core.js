const $=s=>document.querySelector(s);
const TYPES={IT:{role:"Software Developer",sk:["Programming","Frontend","Backend","Database","Tools","Cloud & DevOps"],kw:["Java","Python","React","SQL","REST APIs","Git","Docker","AWS","Spring Boot","Agile"]},
Mechanical:{role:"Mechanical Engineer",sk:["Design Software","Manufacturing","Analysis","Tools","Core Skills"],kw:["AutoCAD","SolidWorks","CATIA","ANSYS","GD&T","Thermodynamics","CNC","Lean Six Sigma"]},
Civil:{role:"Civil Engineer",sk:["Design Software","Construction","Planning","Core Skills"],kw:["AutoCAD","STAAD Pro","Revit","Primavera","Estimation","Site Supervision","IS Codes"]},
Electronics:{role:"Electronics Engineer",sk:["Hardware","Embedded","Tools","Core Skills"],kw:["Embedded C","Arduino","PCB Design","MATLAB","VLSI","IoT","Microcontrollers"]},
Other:{role:"Professional",sk:["Core Skills","Tools","Soft Skills"],kw:["Communication","MS Office","Teamwork","Problem Solving","Leadership"]}};
const VERBS=["Developed","Designed","Implemented","Optimized","Led","Built","Reduced","Improved","Managed","Automated"];
const esc=s=>(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const url=u=>u?(/^https?:/.test(u)?u:"https://"+u):"";
const DH={sum:"Professional Summary",exp:"Work Experience",skills:"Technical Skills",proj:"Projects",edu:"Education",cert:"Certifications"};
const fmt=s=>esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");const disp=u=>u.replace(/^https?:\/\/(www\.)?/,"").replace(/\/$/,"");
function html(d,ph){const H=d.h||DH,P=(v,p)=>v?fmt(v):(ph?`<span class="ph">${p}</span>`:""),A=(u,t)=>u?`<a href="${esc(url(u))}">${esc(t||disp(u))}</a>`:"",
 pd=t=>(t||"").split("\n").filter(x=>x.trim()).map(x=>`<div class="pd">${fmt(x.replace(/^[-–]\s*/,""))}</div>`).join(""),bl=t=>`<ul>${(t||"").split("\n").filter(x=>x.trim()).map(x=>`<li>${fmt(x.replace(/^[-–]\s*/,""))}</li>`).join("")}</ul>`,
 L=k=>d[k].filter(o=>ph||Object.values(o).some(Boolean)),S=(k,b)=>b?`<h2>${esc(H[k])}</h2>${b}`:"";
 const c=[d.email&&`<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`,d.phone&&`<a href="tel:${esc(d.phone.replace(/[^\d+]/g,""))}">${esc(d.phone)}</a>`,esc(d.city),A(d.li),A(d.gh)].filter(Boolean).join(' &nbsp;|&nbsp; ');
 return `<h1>${P(d.name,"YOUR NAME")}</h1><div class="ct">${c||(ph?'<span class="ph">email | phone | city | linkedin | github</span>':"")}</div>`+
 S("sum",d.sum||ph?`<p>${P(d.sum,"Write 2–3 lines about your skills, experience and goals.")}</p>`:"")+
 S("exp",L("exp").map(o=>`<div class="it"><div class="l"><span><b>${P(o.company,"Company")}</b>, <i>${P(o.role,"Role")}</i></span><span>${P(o.dates,"Dates")}${o.loc?" | "+esc(o.loc):""}</span></div>${bl(o.bul||(ph?"Achievement with measurable result":""))}</div>`).join(""))+
 S("skills",L("skills").map(o=>`<span><b>${P(o.cat,"Category")}</b> — ${P(o.items,"Skill 1, Skill 2")}</span>`).join(' <span class="sp">|</span> ')&&`<p>${L("skills").map(o=>`<span><b>${P(o.cat,"Category")}</b> — ${P(o.items,"Skill 1, Skill 2")}</span>`).join(' <span class="sp">|</span> ')}</p>`)+
 S("proj",L("proj").map(o=>`<div class="it"><b>${P(o.name,"Project name")}</b>${o.tech||ph?", <i>"+P(o.tech,"Tech stack")+"</i>":""} ${A(o.link,"[Link]")}${pd(o.bul||(ph?"What you built and the result":""))}</div>`).join(""))+
 S("edu",L("edu").map(o=>`<div class="it"><div class="l"><span><b>${P(o.deg,"Degree")}</b>, <i>${P(o.sch,"Institute")}</i></span><span>${P(o.yr,"Year")}</span></div>${o.score||ph?`<div>${P(o.score,"Score")}</div>`:""}</div>`).join(""))+
 S("cert",L("cert").map(o=>`<div><b>${P(o.name,"Certification")}</b>${o.org?" – "+esc(o.org):""}${o.date?": "+esc(o.date):""} ${A(o.link,"[Link]")}</div>`).join(""))+(d.custom||[]).filter(o=>o.title||o.text).map(o=>`<h2>${esc(o.title||"Additional")}</h2>${bl(o.text)}`).join("")}
function score(d){const f=[];let s=0;const n=(c,p,m,step)=>{if(c)s+=p;else f.push({m,step})};const w=(d.sum||"").split(/\s+/).filter(Boolean).length,bul=[...d.exp,...d.proj].map(o=>o.bul||"").join("\n").split("\n").filter(x=>x.trim());
 n(d.name,10,"Add full name (+10)",0);n(d.email,5,"Add email (+5)",0);n(d.phone,5,"Add phone (+5)",0);n(d.li,5,"Add LinkedIn link (+5)",0);n(d.gh,5,"Add GitHub/portfolio link (+5)",0);
 n(w>=30&&w<=90,10,`Summary should be 30–90 words (now ${w}) (+10)`,1);n(d.exp.some(o=>o.company&&(o.bul||"").split("\n").filter(x=>x.trim()).length>=2),15,"Add experience/internship with 2+ bullets (+15)",2);
 n(d.skills.reduce((a,o)=>a+(o.items||"").split(",").filter(x=>x.trim()).length,0)>=6,10,"List at least 6 skills/keywords (+10)",3);n(d.proj.some(o=>o.name&&o.bul),10,"Add a project with description (+10)",4);
 n(d.edu.some(o=>o.deg&&o.sch&&o.yr),10,"Complete education: degree, institute, year (+10)",5);n(d.cert.some(o=>o.name),5,"Add a certification (+5)",6);
 n(bul.filter(x=>/\d/.test(x)).length>=2&&bul.some(x=>VERBS.some(v=>x.replace(/^\W+/,"").startsWith(v))),10,"Start bullets with action verbs and add numbers (e.g. 30%) (+10)",2);return[s,f]}
