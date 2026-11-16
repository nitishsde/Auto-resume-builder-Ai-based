/* Turns what the user types/says (English or Hinglish) into resume fields. Only uses what the user wrote; nothing is invented. */
const AIP=(()=>{
const LB="professional summary|summary|objective|profile|about me|technical skills|skills?|technologies|education|qualification|projects?|work experience|experience|internship|certifications?|certificates?|achievements?";
const G=[["Programming",/^(c|c\+\+|c#)$|java|python|typescript|kotlin|php|dsa|matlab/i],["Frontend",/html|css|react|angular|vue|bootstrap|tailwind/i],["Backend",/spring|node|express|django|flask|hibernate|rest|maven|jdbc|api/i],["Database",/sql|mongo|oracle|postgres|redis|firebase/i],["Tools",/git|docker|postman|vs ?code|jira|linux|jenkins|aws|azure|figma/i],["Design Software",/autocad|solidworks|catia|ansys|revit|staad|creo|etabs|primavera|sketchup/i]];
const STOP=/\b(email|e-mail|phone|mobile|mob|contact|city|from|and|aur|me|hai|hu|hoon|ka|ki|ke|my|linkedin|github|skills?|education)\b/i;
const lines=s=>s.split(/\n|;/).map(x=>x.replace(/^\s*(?:\d+[.)]|[-•*–])\s*/,"").trim()).filter(Boolean);
const cap=s=>s.replace(/\b\w/g,c=>c.toUpperCase());
function eduP(s){const yr=(s.match(/\b(?:19|20)\d\d(?:\s*[-–]\s*(?:(?:19|20)\d\d|present))?\b|\bpresent\b/i)||[""])[0],sc=(s.match(/\d+(?:\.\d+)?\s*(?:%|cgpa|gpa)|(?:cgpa|gpa)\s*[:\-]?\s*\d+(?:\.\d+)?/i)||[""])[0];
 const p=s.replace(yr,"").replace(sc,"").replace(/[,\s]+$/,"").split(/\s*,\s*|\s+(?:from|at)\s+/).filter(Boolean);return{deg:p[0]||"",sch:p.slice(1).join(", "),yr,score:sc}}
function projP(s){const lk=(s.match(/(?:https?:\/\/|github\.com\/)\S+/i)||[""])[0];s=s.replace(lk,"").replace(/[\s,]+$/,"");let name,tech="",bul="";
 if(s.includes("|")){const p=s.split("|").map(x=>x.trim());name=p[0];if(p.length>2){tech=p[1];bul=p.slice(2).join(". ")}else bul=p[1]||""}
 else{const m=s.match(/^(.+?)\s+[-–:]\s+(.+)$/);name=m?m[1]:s;bul=m?m[2]:""}
 if(!tech){const t=bul.match(/(?:using|with|tech(?:\s*stack)?\s*[:\-]|built in)\s+([A-Za-z0-9.+#, \/-]+?)(?:\.|\s+(?:to|for|that|which)\b|$)/i);if(t)tech=t[1].trim()}
 return{name,tech,link:lk,bul}}
function expP(s){const p=s.split(/\s*[|,]\s*/),rest=p.slice(2),di=rest.findIndex(x=>x.length<30&&/(19|20)\d\d|present/i.test(x));
 const dates=di>=0?rest.splice(di,1)[0]:"";return{company:p[0],role:p[1]||"",dates,loc:"",bul:rest.join(", ").split(/\.\s+|\n/).map(x=>x.trim()).filter(Boolean).join("\n")}}
function certP(s){const p=s.split(/\s+[-–]\s+|\s+by\s+|\s*,\s*/);return{name:p[0],org:p[1]||"",date:p[2]||"",link:""}}
function skillsP(list,group,fallback){const out=[];list.forEach(x=>{const g=group?(G.find(([,r])=>r.test(x))||[fallback])[0]:"Skills",o=out.find(o=>o.cat===g);o?o.items+=", "+x:out.push({cat:g,items:x})});return out}
const rx=k=>new RegExp("(^|[^\\w])"+k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![\\w+])","i");
function parse(t,o){o=o||{};const r={};t=t.replace(/\r/g,"");const m=x=>{const a=t.match(x);return a&&a[1].trim()};
 r.email=m(/([\w.+-]+@[\w-]+\.[\w.]+)/);const ph=t.match(/(?:\+?91[\s-]?)?([6-9]\d{4}[\s-]?\d{5})\b/);if(ph)r.phone="+91 "+ph[1].replace(/\D/g,"");
 r.li=m(/((?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+)/i);r.gh=m(/((?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+)/i);
 r.city=m(/(?:city|location|based in|address)\s*[:\-]?\s*([A-Z][A-Za-z]+(?:,?\s[A-Z(][A-Za-z.()]+){0,2})/);
 let n=m(/(?:my name is|mera naam|naam|name)\s*(?:is|hai|:|-)?\s*([A-Za-z]+(?: [A-Za-z]+){0,3})/i);
 if(!n)n=m(/\b(?:i am|i'm|main)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})(?=\s*(?:[,.;\n]|$))/);
 if(n){n=n.split(STOP)[0].trim();if(n.length>2)r.name=cap(n)}
 if(!r.name&&o.upload){const f=t.split("\n").map(x=>x.trim()).find(Boolean);if(f&&/^[A-Za-z .'-]{3,40}$/.test(f))r.name=cap(f.toLowerCase())}
 const T=[["Mechanical",/mechanical/i],["Civil",/civil|site engineer/i],["Electronics",/electronic|embedded|\bece\b/i],["IT",/\b(it|software|developer|full ?stack|web)\b/i]].find(([,x])=>x.test(t));if(T)r.type=T[0];
 t=t.replace(new RegExp("^[ \\t]*("+LB+")[ \\t]*:?[ \\t]*$","gim"),"$1: ");
 const ms=[...t.matchAll(new RegExp("(?:^|\\n|[.;]\\s+)(?:add\\s+|update\\s+|set\\s+|my\\s+)?("+LB+")\\s*[:\\-]\\s*","gi"))];let sk=null;
 ms.forEach((a,i)=>{const lab=a[1].toLowerCase(),c=t.slice(a.index+a[0].length,i+1<ms.length?ms[i+1].index:undefined).trim();if(!c)return;
  if(/summ|object|profile|about/.test(lab))r.sum=c.replace(/\s*\n\s*/g," ");
  else if(/skill|technolog/.test(lab))sk=c.split(/[,;\n|]/).map(x=>x.trim()).filter(Boolean);
  else if(/educ|qualif/.test(lab))r.edu=(r.edu||[]).concat(lines(c).map(eduP));
  else if(/project/.test(lab))r.proj=(r.proj||[]).concat(lines(c).map(projP));
  else if(/cert/.test(lab))r.cert=(r.cert||[]).concat(lines(c).map(certP));
  else if(/exper|intern|work/.test(lab))r.exp=(r.exp||[]).concat(lines(c).map(expP));
  else r.custom=(r.custom||[]).concat({title:cap(lab),text:lines(c).join("\n")})});
 if(!sk&&o.kw){sk=o.kw.filter(k=>rx(k).test(t))}
 if(sk&&sk.length)r.skills=skillsP(sk,o.group,o.fallback||"Core Skills");
 if(!r.sum&&o.deriveSummary!==false){
  const target=m(/\b(?:seeking|looking for|targeting|applying for)\s+(?:an?\s+)?([^.\n,;]+?)(?=\s+(?:with|highlighting|focused on|tailored to|using|that|job|position|role)\b|[.\n,;]|$)/i)
   ||m(/\b(?:resume|cv)\s+(?:for|as)\s+(?:an?\s+)?([^.\n,;]+?)(?=\s+(?:with|highlighting|focused on|tailored to|using|that|looking for|seeking|job|position|role)\b|[.\n,;]|$)/i);
  const stage=(/\b(fresher|entry[- ]level|recent graduate|graduate|student|experienced professional)\b/i.exec(t)||[])[1];
  if(target||stage){
   const role=target?target.replace(/^(?:an?\s+)/i,"").trim():({IT:"Software Developer",Mechanical:"Mechanical Engineer",Civil:"Civil Engineer",Electronics:"Electronics Engineer",Other:"Professional"}[r.type||"IT"]);
   const level=stage?stage.replace(/[- ]/g," ").replace(/\b\w/g,c=>c.toUpperCase())+" candidate":"Candidate";
   const known=(sk||[]).slice(0,6);
   r.sum=`${level} seeking a ${role} role${known.length?", with skills in "+known.join(", "):""}.`;
   r.sumPrompt=true;
  }
 }
 Object.keys(r).forEach(k=>{if(!r[k]||(Array.isArray(r[k])&&!r[k].length))delete r[k]});return r}
if(typeof module!=="undefined")module.exports={parse};
return{parse}})();
