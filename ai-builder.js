(()=>{
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
/* OPTIONAL real LLM: point this to your own server/function that returns {reply, data}. A static site cannot hold an API key safely. */
const AI_ENDPOINT="";
const TPL=["Classic","Executive","Compact","Modern Line","Technical","Minimal"],COL=["#000000","#1f3a5f","#1a47b8","#0f766e","#15803d","#7f1d1d","#5b21b6","#c2410c","#374151"];
const P={mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',clip:'<path d="M21 12l-8.5 8.5a5 5 0 0 1-7-7L14 5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 8"/>',send:'<path d="M12 19V5M5 12l7-7 7 7"/>',tpl:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',dl:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>'};
const ic=k=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[k]}</svg>`;
const LOGO='<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0b0b0c"/><text x="16" y="21.5" text-anchor="middle" font-family="Inter,Arial" font-weight="800" font-size="14" fill="#00c76a">AI</text></svg>';
qa("[data-i]").forEach(e=>e.innerHTML=ic(e.dataset.i));q("#lg").innerHTML=LOGO;
const fresh=()=>({type:"IT",name:"",email:"",phone:"",city:"",li:"",gh:"",sum:"",exp:[{}],skills:[{}],proj:[{}],edu:[{}],cert:[{}],custom:[{}]});
let D,S;try{D=JSON.parse(localStorage.getItem("rf"))}catch(e){}D=Object.assign(fresh(),D||{});D.h=Object.assign({},DH,D.h);
try{S=JSON.parse(localStorage.getItem("rf_ai_s"))}catch(e){}S=Object.assign({tpl:0,ac:"#000000",font:"Montserrat",fs:"12",ver:"2.5",lang:"en-IN"},S||{});
const full=o=>Object.values(o).some(Boolean),has=()=>["exp","skills","proj","edu","cert"].some(k=>D[k].some(full));
const toast=(m,r)=>{const t=q("#toast");t.textContent=m;t.className=r?"red":"";t.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display="none",3500)};
const load=src=>load.c[src]||(load.c[src]=new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>no(new Error("load"));document.head.append(s)}));load.c={};
const CDN="https://cdnjs.cloudflare.com/ajax/libs/";

/* ---------- settings UI ---------- */
Object.keys(TYPES).forEach(t=>q("#type").add(new Option(t==="IT"?"IT (MNC / Startup)":t==="Other"?"Other":t,t)));
q("#type").value=D.type;q("#ver").value=S.ver;q("#font").value=S.font;q("#fs").value=S.fs;q("#lang").value=S.lang;
const sw=q("#sw");COL.forEach(c=>{const b=document.createElement("button");b.style.background=c;b.title=c;b.onclick=()=>{S.ac=c;live()};sw.append(b)});
const cc=document.createElement("input");cc.type="color";cc.title="Custom colour";cc.oninput=()=>{S.ac=cc.value;live()};sw.append(cc);
q("#type").onchange=e=>{D.type=e.target.value;live()};q("#ver").onchange=e=>{S.ver=e.target.value;if(D.sumAuto)D.sum="";regen();live()};
q("#font").onchange=e=>{S.font=e.target.value;live()};q("#fs").onchange=e=>{S.fs=e.target.value;live()};q("#lang").onchange=e=>{S.lang=e.target.value;save()};
q("#rst").onclick=()=>{if(confirm("Clear the resume and start over?")){D=Object.assign(fresh(),{type:D.type});D.h=Object.assign({},DH);live();msg("ai","Cleared. Tell me your details or pick a prompt below.")}};
qa("#tabs button").forEach(b=>b.onclick=()=>{qa("#tabs button").forEach(x=>x.classList.toggle("on",x===b));["tools","chat","view"].forEach(p=>q("#p-"+p).classList.toggle("on",p===b.dataset.p));fit()});
q("#p-chat").classList.add("on");

/* ---------- live resume ---------- */
function kwBold(t){if(!t||S.ver!=="pro")return t;TYPES[D.type].kw.forEach(k=>{t=t.replace(new RegExp("(^|[^\\w*])("+k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")(?![\\w*])","gi"),"$1**$2**")});return t}
function prep(){if(S.ver!=="pro")return D;const c=JSON.parse(JSON.stringify(D));c.sum=kwBold(c.sum);c.exp.forEach(o=>o.bul=kwBold(o.bul));c.proj.forEach(o=>o.bul=kwBold(o.bul));return c}
function render(){const r=q("#resume");r.className="sheet t"+(S.tpl+1);r.innerHTML=html(prep());r.style.setProperty("--ac",S.ac);r.style.setProperty("--fs",S.fs+"px");r.style.fontFamily=S.font+",Verdana,sans-serif";fit()}
function fit(){const w=q("#pw").clientWidth;if(!w)return;const s=Math.min(1,w/794),p=q("#paper");p.style.transform=`scale(${s})`;q("#pw").style.height=q("#resume").offsetHeight*s+"px"}
addEventListener("resize",fit);if(window.ResizeObserver)new ResizeObserver(fit).observe(q("#pw"));
function save(){try{localStorage.setItem("rf",JSON.stringify(D));localStorage.setItem("rf_ai_s",JSON.stringify(S))}catch(e){}}
function need(){const[,f]=score(D),b=q("#need");b.innerHTML="";const s=score(D)[0];b.insertAdjacentHTML("beforeend",`<div class="ok"><b>ATS score: ${s}%</b></div>`);
 f.forEach(x=>{const d=document.createElement("div");d.textContent=x.m.replace(/ \(\+\d+\)/,"");d.onclick=()=>{q("#ip").value=["Name: ","Summary: ","Experience: ","Skills: ","Projects: ","Education: ","Certifications: "][x.step]||"";q("#ip").focus();ghost()};b.append(d)});
 if(!f.length)b.insertAdjacentHTML("beforeend",'<div class="ok">Everything the ATS checks is filled in.</div>')}
function live(){save();q("#tbtn").textContent=TPL[S.tpl]+" – change";qa("#sw button").forEach(b=>b.classList.toggle("on",b.title===S.ac));render();need()}

/* ---------- chat ---------- */
const sleep=t=>new Promise(r=>setTimeout(r,t));
const CHAT_KEY="rf_ai_chats",WELCOME="Hi, I build ATS-friendly A4 resumes from what you tell me. Type or speak your details (English or Hinglish), upload an old resume, or tap a prompt below. Pick a template, colour and version on the left, and download in PDF, DOC, PNG or XLS when ready.";
function newThread(){return{id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),title:"New chat",updated:Date.now(),messages:[]}}
let chatState;try{chatState=JSON.parse(localStorage.getItem(CHAT_KEY))}catch(e){}
if(!chatState||!Array.isArray(chatState.threads))chatState={activeId:"",threads:[]};
if(!chatState.threads.length)chatState.threads.push(newThread());
chatState.threads.forEach(c=>{if(!Array.isArray(c.messages))c.messages=[];if(typeof c.title!=="string")c.title="New chat"});
if(!chatState.threads.some(c=>c.id===chatState.activeId))chatState.activeId=chatState.threads[0].id;
function currentThread(){return chatState.threads.find(c=>c.id===chatState.activeId)}
function saveChats(){try{localStorage.setItem(CHAT_KEY,JSON.stringify(chatState))}catch(e){toast("Could not save chat history. Browser storage may be full.",1)}}
function makeMessage(w,t,index,id){const m=document.createElement("div");m.className="m2"+(w==="u"?" u":"");m.dataset.chatId=id;m.dataset.messageIndex=index;m.innerHTML=(w==="u"?"":`<span class="av2">${LOGO}</span>`)+'<div class="bb"></div>';m.querySelector(".bb").textContent=t;q("#msgs").append(m);return m.querySelector(".bb")}
function renderMessages(){const c=currentThread();q("#msgs").replaceChildren();c.messages.forEach((m,i)=>makeMessage(m.role,m.text,i,c.id));q("#msgs").scrollTop=1e9}
function renderHistory(){const el=q("#chatHistory");el.replaceChildren();chatState.threads.forEach(c=>{const b=document.createElement("button");b.className=c.id===chatState.activeId?"on":"";b.dataset.chatId=c.id;b.textContent=c.title;const d=document.createElement("small");d.textContent=new Date(c.updated||Date.now()).toLocaleString();b.append(d);el.append(b)})}
function msg(w,t){const c=currentThread();c.messages.push({role:w,text:t==null?"":t});c.updated=Date.now();const b=makeMessage(w,t==null?"":t,c.messages.length-1,c.id);saveChats();renderHistory();return b}
async function type(b,t){const m=b.closest(".m2"),c=chatState.threads.find(x=>x.id===m.dataset.chatId),i=+m.dataset.messageIndex;if(c&&c.messages[i]){c.messages[i].text=t;c.updated=Date.now();saveChats();renderHistory()}for(let i=0;i<t.length;i+=3){b.textContent=t.slice(0,i+3);q("#msgs").scrollTop=1e9;await sleep(8)}b.textContent=t}
function startNewChat(){const c=newThread();chatState.threads.unshift(c);chatState.activeId=c.id;c.messages.push({role:"ai",text:WELCOME});saveChats();renderMessages();renderHistory();q("#chatHistory").hidden=true;q("#historyToggle").setAttribute("aria-expanded","false");q("#ip").value="";grow();ghost()}
q("#newChat").onclick=startNewChat;
q("#historyToggle").onclick=()=>{const el=q("#chatHistory");el.hidden=!el.hidden;q("#historyToggle").setAttribute("aria-expanded",String(!el.hidden))};
q("#chatHistory").onclick=e=>{const b=e.target.closest("button[data-chat-id]");if(!b)return;chatState.activeId=b.dataset.chatId;saveChats();renderMessages();renderHistory();q("#chatHistory").hidden=true;q("#historyToggle").setAttribute("aria-expanded","false")};
q("#resetChat").onclick=()=>{if(!confirm("Clear messages in this chat? Your resume will stay unchanged."))return;const c=currentThread();c.messages=[];c.title="New chat";c.updated=Date.now();c.messages.push({role:"ai",text:WELCOME});saveChats();renderMessages();renderHistory()};
if(currentThread().messages.length)renderMessages();else msg("ai",WELCOME);
renderHistory();
const ovr=o=>o.filter(full);
function regen(){if(S.ver!=="1.0"&&(!D.sum||D.sumAuto)&&has()){D.sum=gen();D.sumAuto=1}}
function gen(){const T=TYPES[D.type],sk=D.skills.flatMap(o=>(o.items||"").split(",").map(x=>x.trim()).filter(Boolean)).slice(0,6),e=D.edu.find(o=>o.deg),pj=D.proj.filter(o=>o.name),ex=D.exp.filter(o=>o.company);
 return T.role+(e?" with a "+e.deg+" background":"")+(sk.length?", skilled in "+sk.join(", "):"")+"."+(pj.length?" Built "+pj.slice(0,2).map(o=>o.name).join(" and ")+".":"")+(ex.length?" Experience at "+ex.map(o=>o.company).join(", ")+".":"")}
function merge(p){["name","email","phone","city","li","gh","type"].forEach(k=>{if(p[k])D[k]=p[k]});if(p.sum){D.sum=p.sum;D.sumAuto=0;D.sumPrompt=!!p.sumPrompt}
 ["exp","proj","edu","cert","custom"].forEach(k=>{if(p[k]){D[k]=ovr(D[k]).concat(p[k])}});
 if(p.skills){D.skills=ovr(D.skills);p.skills.forEach(n=>{const o=D.skills.find(x=>(x.cat||"").toLowerCase()===n.cat.toLowerCase());if(!o)return D.skills.push(n);const have=o.items.toLowerCase().split(/\s*,\s*/);n.items.split(", ").forEach(i=>{if(!have.includes(i.toLowerCase()))o.items+=", "+i})})}
 ["exp","proj","edu","cert","skills","custom"].forEach(k=>{if(!D[k].length)D[k]=[{}]});q("#type").value=D.type}
function apply(text,up){
 if(/^\s*(reset|clear|new resume|naya resume)\s*$/i.test(text)){D=Object.assign(fresh(),{type:D.type});D.h=Object.assign({},DH);return"Cleared. Send your details to start again."}
 const p=AIP.parse(text,{upload:up,group:S.ver==="5"||S.ver==="pro",deriveSummary:!D.sum||!!D.sumAuto||!!D.sumPrompt,kw:[...new Set(Object.values(TYPES).flatMap(t=>t.kw).concat(["JavaScript","Node.js","MongoDB","MySQL","HTML","CSS","Tailwind","Spring Boot","Hibernate","C++","Postman","GitHub","Figma","Excel"]))],fallback:"Core Skills"});
 merge(p);regen();const keys=Object.keys(p).filter(k=>k!=="type"&&k!=="sumPrompt"),[s,f]=score(D);
 const lab={name:"name",email:"email",phone:"phone",city:"city",li:"LinkedIn",gh:"GitHub",sum:"summary",exp:"experience",proj:"projects",edu:"education",cert:"certificates",skills:"skills",custom:"extra section"};
 let r=keys.length?`Updated (${{"1.0":"Build 1.0","2.5":"Build 2.5","5":"Build 5",pro:"Build Pro 0.5"}[S.ver]}, ${D.type}, ${TPL[S.tpl]} template). Added: ${keys.map(k=>lab[k]).join(", ")}.\nATS score: ${s}%.`:
 "I could not find resume details in that message. Send them like this:\nName: …; Email: …; Phone: …\nSkills: Java, React, MySQL\nEducation: B.Tech CSE, College, 2026, 75%\nProjects: Name | Tech | What you built\nExperience: Company, Role, 2024, what you did";
 if(keys.length&&f.length)r+="\n\nStill needed:\n"+f.map(x=>"• "+x.m.replace(/ \(\+\d+\)/,"")).join("\n");
 if(keys.length&&(S.ver==="pro"||S.ver==="5")){const t=JSON.stringify(D).toLowerCase(),miss=TYPES[D.type].kw.filter(k=>!t.includes(k.toLowerCase())).slice(0,6);if(miss.length&&keys.length)r+="\n\nKeywords recruiters in "+D.type+" look for. Add only the ones you really know: "+miss.join(", ")}
 if(keys.length)r+="\n\nSections you have not given me stay empty. Nothing is made up."+(D.sumAuto?" The summary was composed only from your own details; send “Summary: …” to replace it.":"");return r}
async function run(text,up){
 const b=msg("ai","…");let reply;
 if(AI_ENDPOINT){try{const r=await fetch(AI_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:text,current:D,version:S.ver,sector:D.type})}),j=await r.json();if(j.data)D=Object.assign(D,j.data);reply=j.reply}catch(e){}}
 if(!reply)reply=apply(text,up);live();await type(b,reply);if(innerWidth<=1000&&reply.startsWith("Updated"))toast("Resume updated – open the Resume tab")}
function send(){const t=q("#ip").value.trim();if(!t)return;const c=currentThread();if(c.title==="New chat")c.title=t.length>38?t.slice(0,35)+"…":t;c.updated=Date.now();msg("u",t);renderHistory();q("#ip").value="";grow();ghost();run(t)}
q("#snd").onclick=send;

/* ---------- input: autosuggest, voice, upload ---------- */
const ip=q("#ip");
const PH=["Name: ","Email: ","Phone: ","City: ","Summary: ","Skills: Java, Spring Boot, React, MySQL, Git","Education: B.Tech CSE, College name, 2026, 75%","Projects: Project name | Tech stack | What you built","Experience: Company, Role, 2024, what you did","Certifications: Name – Issuer, 2024","Add skills Docker, AWS, Postman","IT company ke liye ATS friendly resume banao","Mechanical engineer resume with AutoCAD and SolidWorks","Civil site engineer resume with STAAD Pro and Revit","Electronics engineer resume with Embedded C and PCB design","mera naam "];
function sugg(v){if(!v||/\s$/.test(v)||ip.selectionStart!==v.length)return"";const w=v.split(/\s+/);for(let n=Math.min(3,w.length);n>=1;n--){const t=w.slice(-n).join(" ").toLowerCase();if(t.length<2)continue;for(const p of PH){const i=p.toLowerCase().indexOf(t);if(i>=0&&(i===0||p[i-1]===" ")&&i+t.length<p.length)return p.slice(i+t.length)}}return""}
let cur="";
function ghost(){cur=sugg(ip.value);q("#gh").innerHTML=esc(ip.value)+(cur?"<i>"+esc(cur)+"</i>":"");q("#gh").scrollTop=ip.scrollTop;const a=q("#acc");a.hidden=!cur;a.textContent="Tab ⇥  "+cur.trim().slice(0,45)}
function grow(){ip.style.height="auto";ip.style.height=Math.min(ip.scrollHeight,200)+"px"}
const take=()=>{if(!cur)return;ip.value+=cur;grow();ghost();ip.focus()};
ip.oninput=()=>{grow();ghost()};ip.onscroll=()=>q("#gh").scrollTop=ip.scrollTop;ip.onclick=ip.onkeyup=e=>{if(e.key&&e.key.length===1)return;ghost()};
ip.onkeydown=e=>{if((e.key==="Tab"||e.key==="ArrowRight")&&cur){e.preventDefault();take()}else if(e.key==="Enter"&&!e.shiftKey&&innerWidth>1000){e.preventDefault();send()}};
q("#acc").onmousedown=e=>{e.preventDefault();take()};
let rec=null;const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
q("#mic").onclick=()=>{if(!SR)return toast("Voice input needs Chrome or Edge.",1);if(rec){rec.stop();return}
 rec=new SR();rec.lang=S.lang;rec.interimResults=true;rec.continuous=true;const base=ip.value;
 rec.onresult=e=>{let s="";for(let i=0;i<e.results.length;i++)s+=e.results[i][0].transcript;ip.value=(base?base+" ":"")+s;grow();ghost()};
 rec.onerror=e=>toast("Mic error: "+e.error,1);rec.onend=()=>{rec=null;q("#mic").classList.remove("on")};rec.start();q("#mic").classList.add("on")};
q("#att").onclick=()=>q("#fi").click();
q("#fi").onchange=async e=>{const f=e.target.files[0];e.target.value="";if(!f)return;msg("u","Uploaded: "+f.name);let t="";
 try{const x=f.name.toLowerCase();
  if(x.endsWith(".pdf")){await load(CDN+"pdf.js/3.11.174/pdf.min.js");pdfjsLib.GlobalWorkerOptions.workerSrc=CDN+"pdf.js/3.11.174/pdf.worker.min.js";const d=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;for(let i=1;i<=d.numPages;i++){const c=await(await d.getPage(i)).getTextContent();t+=c.items.map(z=>z.str+(z.hasEOL?"\n":" ")).join("")+"\n"}}
  else if(x.endsWith(".docx")){await load(CDN+"mammoth/1.6.0/mammoth.browser.min.js");t=(await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()})).value}
  else t=await f.text()}catch(err){return msg("ai","I could not read that file here. Paste the text into the box instead, or upload a .txt file.")}
 if(!t.trim())return msg("ai","No text found in that file (a scanned image?). Paste the text instead.");
 const b=msg("ai","Reading your resume…");const r=apply(t,true);live();await type(b,r+"\n\nUploaded resumes are read on a best-effort basis. Check the preview and send corrections.")};

/* ---------- prompt marquee + companies ---------- */
const PR=[["IT fresher resume with Java, React and MySQL","Mechanical engineer resume with AutoCAD and SolidWorks","Civil site engineer resume with STAAD Pro and Revit","Electronics engineer resume with Embedded C and PCB design","Skills: Java, Spring Boot, React, MySQL, Git","Summary: "],["Education: B.Tech CSE, College name, 2026, 75%","Projects: Project name | Tech stack | What you built","Experience: Company, Role, 2024, what you did","Certifications: Name – Issuer, 2024","Add skills Docker, AWS, Postman","Name: , Email: , Phone: "]];
q("#pm").innerHTML=PR.map((r,i)=>{const h=r.map(x=>`<button class="pc">${esc(x)}</button>`).join("");return`<div class="mq${i?" rv":""}"><div class="tr">${h+h}</div></div>`}).join("");
q("#pm").onclick=e=>{const b=e.target.closest(".pc");if(!b)return;ip.value=b.textContent;grow();ghost();ip.focus();ip.setSelectionRange(ip.value.length,ip.value.length)};
const CO=[["Google:google.com","Accenture:accenture.com","Infosys:infosys.com","TCS:tcs.com","Capgemini:capgemini.com","Deloitte:deloitte.com","Wipro:wipro.com","Cognizant:cognizant.com","IBM:ibm.com","Microsoft:microsoft.com"],["Tata Motors:tatamotors.com","L&T:larsentoubro.com","Siemens:siemens.com","Bosch:bosch.com","Mahindra:mahindra.com","ABB:abb.com","Maruti Suzuki:marutisuzuki.com","BHEL:bhel.com","Schneider:se.com","Hitachi:hitachi.com"]];
q("#mq2").innerHTML=CO.map((r,i)=>{const h=r.map(x=>{const[n,d]=x.split(":");return`<span class="lg"><img src="https://www.google.com/s2/favicons?domain=${d}&sz=64" alt="" onerror="this.remove()">${n}</span>`}).join("");return`<div class="mq${i?" rv":""}"><div class="tr">${h+h}</div></div>`}).join("");

/* ---------- templates modal ---------- */
function thumbs(){const e=has()||D.name;q("#tg").innerHTML=TPL.map((n,i)=>`<button class="th${i===S.tpl?" on":""}" data-i="${i}"><div class="thw"><div class="sheet t${i+1}" style="--ac:${S.ac};--fs:12px;font-family:${S.font},Verdana,sans-serif">${html(e?D:fresh(),!e)}</div></div>${n}</button>`).join("")}
const openT=()=>{thumbs();q("#md").classList.add("on")};q("#tbtn").onclick=q("#tp").onclick=openT;q("#mc").onclick=()=>q("#md").classList.remove("on");
q("#md").onclick=e=>{if(e.target.id==="md")e.target.classList.remove("on");const t=e.target.closest(".th");if(t){S.tpl=+t.dataset.i;q("#md").classList.remove("on");live();msg("ai",TPL[S.tpl]+" template applied. Now describe your resume, or pick a colour on the left.")}};

/* ---------- downloads ---------- */
q("#dbtn").onclick=e=>{e.stopPropagation();q("#dm").classList.toggle("on")};document.addEventListener("click",()=>q("#dm").classList.remove("on"));
q("#dm").onclick=e=>{const b=e.target.closest("button");if(b)dl(b.dataset.f)};
const save2=(blob,n)=>{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4e3)};
async function dl(f){if(!D.name&&!has())return toast("Build your resume first, then download.",1);
 try{if(f==="pdf"){const o=document.title;document.title="Resumemaker";print();document.title=o}
 else if(f==="doc"){const h=html(prep()).replace(/<div class="l"><span>(.*?)<\/span><span>(.*?)<\/span><\/div>/g,'<table width="100%" cellspacing="0" cellpadding="0"><tr><td>$1</td><td align="right">$2</td></tr></table>').replace(/<ul>|<\/ul>/g,"").replace(/<li>/g,'<p style="margin:0 0 0 12pt;text-indent:-12pt">– ').replace(/<\/li>/g,"</p>"),
  css=`body{font-family:${S.font},Verdana;font-size:${S.fs*.75}pt;text-align:justify}h1{font-size:20pt;text-transform:uppercase;margin:0}h2{font-size:12pt;border-bottom:1.5pt solid ${S.ac};color:${S.ac};text-transform:uppercase;margin:12pt 0 4pt}a{color:#1a47b8;text-decoration:none}p{margin:0}`;
  save2(new Blob([`<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>${css}</style></head><body>${h}</body></html>`],{type:"application/msword"}),"Resumemaker.doc")}
 else if(f==="png"){await load(CDN+"html2canvas/1.4.1/html2canvas.min.js");const c=await html2canvas(q("#resume"),{scale:2,backgroundColor:"#fff",onclone:d=>{d.querySelector("#paper").style.transform="none"}});c.toBlob(b=>save2(b,"Resumemaker.png"))}
 else{await load(CDN+"xlsx/0.18.5/xlsx.full.min.js");const r=[["Name",D.name],["Email",D.email],["Phone",D.phone],["City",D.city],["LinkedIn",D.li],["GitHub",D.gh],[],[D.h.sum],[D.sum],[],[D.h.exp]];
  ovr(D.exp).forEach(o=>r.push([o.company,o.role,o.dates],...(o.bul||"").split("\n").map(x=>["","",x])));r.push([],[D.h.skills]);ovr(D.skills).forEach(o=>r.push([o.cat,o.items]));r.push([],[D.h.proj]);ovr(D.proj).forEach(o=>r.push([o.name,o.tech,o.link,o.bul]));
  r.push([],[D.h.edu]);ovr(D.edu).forEach(o=>r.push([o.deg,o.sch,o.yr,o.score]));r.push([],[D.h.cert]);ovr(D.cert).forEach(o=>r.push([o.name,o.org,o.date]));
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),"Resume");XLSX.writeFile(wb,"Resumemaker.xls",{bookType:"biff8"})}
 if(typeof bump==="function")bump("resumes")}catch(e){toast("Download failed. Check your internet and try again.",1)}}

live();ghost();
})();
