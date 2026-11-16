const SEC = {
  exp: {
    t: "Work Experience",
    f: [
      ["company", "Company"],
      ["role", "Role"],
      ["dates", "Dates (e.g. 2024 – Present)"],
      ["loc", "Location"],
      ["bul", "Bullet points (one per line, **bold** allowed)", "ta"],
    ],
  },
  skills: {
    t: "Technical Skills",
    f: [
      ["cat", "Category"],
      ["items", "Skills (comma separated)"],
    ],
  },
  proj: {
    t: "Projects",
    f: [
      ["name", "Project name"],
      ["tech", "Tech stack"],
      ["link", "Project link"],
      ["bul", "Description (write sentences, no hyphens needed)", "ta"],
    ],
  },
  edu: {
    t: "Education",
    f: [
      ["deg", "Degree"],
      ["sch", "Institute"],
      ["yr", "Year"],
      ["score", "Score / CGPA"],
    ],
  },
  cert: {
    t: "Certifications",
    f: [
      ["name", "Certification"],
      ["org", "Issuer"],
      ["date", "Date"],
      ["link", "Link (optional)"],
    ],
  },
  custom: {
    t: "Extra Section",
    f: [
      ["title", "Section heading (e.g. Achievements)"],
      ["text", "Content (one per line)", "ta"],
    ],
  },
};
const STEPS = [
    "contact",
    "sum",
    "exp",
    "skills",
    "proj",
    "edu",
    "cert",
    "custom",
    "done",
  ],
  NM = [
    "Details",
    "Summary",
    "Experience",
    "Skills",
    "Projects",
    "Education",
    "Certificates",
    "Extra",
    "Download",
  ];
let D;
try {
  D = JSON.parse(localStorage.getItem("rf"));
} catch (e) {}
D = Object.assign(
  {
    type: "IT",
    name: "",
    email: "",
    phone: "",
    city: "",
    li: "",
    gh: "",
    sum: "",
    exp: [{}],
    skills: [{}],
    proj: [{}],
    edu: [{}],
    cert: [{}],
    custom: [{}],
  },
  D || {},
);
D.h = Object.assign({}, DH, D.h);
let st = 0;
const V = {
  name: [
    /^[A-Za-z][A-Za-z .'-]{2,}$/,
    "Enter a valid full name (letters only)",
  ],
  email: [
    /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
    "Enter a valid email like name@gmail.com",
  ],
  phone: [
    /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/,
    "Enter a valid 10-digit mobile number",
  ],
  li: [
    /linkedin\.com\/(in|pub)\/[\w-]+/i,
    "LinkedIn must look like linkedin.com/in/your-id",
  ],
  gh: [/github\.com\/[\w-]+/i, "GitHub must look like github.com/your-id"],
};
const bad = (k, v) =>
  !!(v && V[k] && !V[k][0].test(v.trim())) ||
  (k === "link" &&
    !!v &&
    !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v.trim()));
function toast(m, r) {
  const t = $("#toast");
  t.textContent = m;
  t.className = r ? "red" : "";
  t.style.display = "block";
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (t.style.display = "none"), 3500);
}
const btn = (t, c, f) => {
  const b = document.createElement("button");
  b.className = "btn sm " + c;
  b.textContent = t;
  b.onclick = f;
  return b;
};
function inp(o, k, lb, ta, type) {
  const l = document.createElement("label");
  l.textContent = lb;
  const e = document.createElement(ta ? "textarea" : "input");
  if (ta) e.rows = 4;
  if (type) e.type = type;
  e.value = o[k] || "";
  e.oninput = () => {
    o[k] = e.value;
    const b = bad(k, e.value);
    e.classList.toggle("bad", b);
    if (b)
      toast(
        V[k]
          ? V[k][1]
          : "Enter a valid link, e.g. https://github.com/you/project",
        1,
      );
    live();
  };
  l.append(e);
  return l;
}
function listUI(key) {
  const w = document.createElement("div"),
    d2 = () => {
      w.innerHTML = "";
      D[key].forEach((o, i) => {
        const b = document.createElement("div");
        b.className = "item";
        SEC[key].f.forEach(([k, lb, ta]) => b.append(inp(o, k, lb, ta)));
        if (key === "skills")
          TYPES[D.type].kw.forEach((x) => {
            const c = document.createElement("span");
            c.className = "chip";
            c.textContent = "+ " + x;
            c.onclick = () => {
              o.items = (o.items ? o.items + ", " : "") + x;
              d2();
              live();
            };
            b.append(c);
          });
        if (key === "exp" || key === "proj")
          b.append(
            btn(
              "AI suggest " + (key === "exp" ? "bullets" : "description"),
              "ghost",
              () => {
                const r = o.role || o.name || TYPES[D.type].role,
                  t = o.tech || TYPES[D.type].kw.slice(0, 3).join(", ");
                o.bul =
                  key === "exp"
                    ? [
                        `Developed ${r.toLowerCase()} deliverables using ${t}, improving efficiency by 20%`,
                        `Optimized workflows and reduced turnaround time by 30%`,
                        `Implemented quality checks, achieving 100% on-time delivery`,
                      ].join("\n")
                    : `Built ${r} using ${t} with a focus on performance and clean design. Implemented core features, testing and deployment, and improved user task completion time by 25%.`;
                d2();
                live();
              },
            ),
          );
        if (D[key].length > 1)
          b.append(
            " ",
            btn("Remove", "ghost", () => {
              D[key].splice(i, 1);
              d2();
              live();
            }),
          );
        w.append(b);
      });
      w.append(
        btn("+ Add " + SEC[key].t, "green", () => {
          D[key].push({});
          d2();
        }),
      );
    };
  d2();
  return w;
}
function okContact() {
  let ok = true;
  ["name", "email", "phone", "li", "gh"].forEach((k) => {
    const v = (D[k] || "").trim(),
      b = (["name", "email", "phone"].includes(k) && !v) || bad(k, v);
    if (b && ok) {
      toast(v ? V[k][1] : "Please fill " + k, 1);
      ok = false;
    }
  });
  return ok;
}
function go(i) {
  if (i > 0 && st === 0 && !okContact()) return;
  st = i;
  draw();
}
function draw() {
  const s = STEPS[st],
    el = $("#step");
  el.innerHTML = "";
  $("#stepper").innerHTML = NM.map(
    (n, i) =>
      `<button class="dot ${i === st ? "on" : i < st ? "ok" : ""}" data-i="${i}"><b>${i < st ? "✓" : i + 1}</b><span>${n}</span></button>`,
  ).join("");
  document
    .querySelectorAll(".dot")
    .forEach((b) => (b.onclick = () => go(+b.dataset.i)));
  $("#stitle").textContent = `Step ${st + 1}: ${NM[st]}`;
  if (s === "contact") {
    const l = document.createElement("label");
    l.textContent = "Resume type";
    const sel = document.createElement("select");
    Object.keys(TYPES).forEach((t) =>
      sel.add(
        new Option(
          t === "IT"
            ? "IT Company (MNC / Startup)"
            : t === "Other"
              ? "Other"
              : t + " Company",
          t,
        ),
      ),
    );
    sel.value = D.type;
    sel.onchange = () => {
      D.type = sel.value;
      live();
    };
    l.append(sel);
    el.append(l);
    [
      ["name", "Full name"],
      ["email", "Email", "", "email"],
      ["phone", "Mobile number", "", "tel"],
      ["city", "City, State"],
      ["li", "LinkedIn link"],
      ["gh", "GitHub link"],
    ].forEach(([k, lb, , t]) => el.append(inp(D, k, lb, 0, t)));
    el.append(
      Object.assign(document.createElement("h4"), {
        textContent: "Edit section headings",
      }),
    );
    Object.keys(D.h).forEach((k) =>
      el.append(inp(D.h, k, "Heading: " + DH[k])),
    );
  } else if (s === "sum") {
    el.append(
      inp(
        D,
        "sum",
        "Professional summary (30–90 words). Use **text** for bold",
        1,
      ),
    );
    el.append(
      btn("AI suggest summary", "ghost", () => {
        const T = TYPES[D.type];
        D.sum = `${T.role} with hands-on experience in ${T.kw.slice(0, 4).join(", ")}. Proven ability to deliver quality work within deadlines, collaborate with teams and learn new tools quickly. Seeking to contribute technical skills and a problem-solving mindset to a growing organization.`;
        draw();
        live();
      }),
    );
  } else if (s === "done") {
    el.innerHTML =
      '<p>Your resume is ready. Check the ATS score below, then download. PDF and DOC match the preview. Download the PDF first, then use "Email me a copy" — it opens a draft to your own Gmail with the resume text; attach the downloaded PDF before sending (browsers can\'t attach files automatically).</p>';
    const r = document.createElement("div");
    r.className = "row2";
    r.append(
      btn("Download PDF", "", () => dl("pdf")),
      btn("Download .DOC", "", () => dl("doc")),
      btn("Email me a copy", "green", mailCopy),
    );
    el.append(r);
  } else el.append(listUI(s));
  $("#prev").style.visibility = st ? "visible" : "hidden";
  $("#next").style.display = st === STEPS.length - 1 ? "none" : "";
}
$("#prev").onclick = () => go(st - 1);
$("#next").onclick = () => go(st + 1);
function live() {
  localStorage.setItem("rf", JSON.stringify(D));
  render();
  panel();
}
function panel() {
  const [s, f] = score(D);
  $("#score").innerHTML =
    `<b style="color:${s >= 90 ? "#059669" : s >= 60 ? "#d97706" : "#dc2626"}">${s}%</b><div style="font-size:12px">ATS score</div>`;
  $("#tips").innerHTML = f.length
    ? "<small>Click an item to fix it:</small>"
    : "<p>100% ATS-ready format.</p>";
  f.forEach((x) => {
    const e = document.createElement("div");
    e.className = "tip";
    e.textContent = "• " + x.m;
    e.onclick = () => {
      st = x.step;
      draw();
      scrollTo({ top: 0, behavior: "smooth" });
    };
    $("#tips").append(e);
  });
  const t = JSON.stringify(D).toLowerCase(),
    miss = TYPES[D.type].kw
      .filter((k) => !t.includes(k.toLowerCase()))
      .slice(0, 6);
  $("#ai").innerHTML = miss.length
    ? `<h4>AI suggestions: keywords for ${D.type} resumes</h4>`
    : "";
  miss.forEach((k) => {
    const c = document.createElement("span");
    c.className = "chip";
    c.textContent = "+ " + k;
    c.onclick = () => {
      D.skills[0].items =
        (D.skills[0].items ? D.skills[0].items + ", " : "") + k;
      if (!D.skills[0].cat) D.skills[0].cat = "Skills";
      live();
      if (STEPS[st] === "skills") draw();
    };
    $("#ai").append(c);
  });
}
function render() {
  const r = $("#resume");
  r.innerHTML = html(D);
  r.style.setProperty("--ac", $("#accent").value);
  r.style.setProperty("--fs", $("#fsize").value + "px");
  r.style.fontFamily = $("#font").value + ",Verdana,sans-serif";
  r.style.color = $("#tcolor").value;
}
["accent", "font", "fsize", "tcolor"].forEach(
  (i) => ($("#" + i).oninput = render),
);
function dl(t) {
  if (t === "pdf") {
    const o = document.title;
    document.title = "Resumemaker";
    window.print();
    document.title = o;
  } else {
    const ac = $("#accent").value,
      h = html(D)
        .replace(
          /<div class="l"><span>(.*?)<\/span><span>(.*?)<\/span><\/div>/g,
          '<table width="100%" cellspacing="0" cellpadding="0"><tr><td>$1</td><td align="right">$2</td></tr></table>',
        )
        .replace(/<ul>|<\/ul>/g, "")
        .replace(/<li>/g, '<p style="margin:0 0 0 12pt;text-indent:-12pt">– ')
        .replace(/<\/li>/g, "</p>");
    const css = `body{font-family:${$("#font").value},Verdana;font-size:${$("#fsize").value * 0.75}pt;color:${$("#tcolor").value};text-align:justify}h1{font-size:20pt;text-transform:uppercase;margin:0}h2{font-size:12pt;border-bottom:1.5pt solid ${ac};color:${ac};text-transform:uppercase;margin:12pt 0 4pt}a{color:#1a47b8;text-decoration:none}p{margin:0}.pd{margin:0}`;
    const b = new Blob(
      [
        `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>${css}</style></head><body>${h}</body></html>`,
      ],
      { type: "application/msword" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = "Resumemaker.doc";
    a.click();
  }
  bump("resumes");
}
/* OPTIONAL — only if you set this up: EmailJS (free, no backend) can auto-send the resume to the
   person's own inbox. Create a service + one template at emailjs.com (template body must include the
   raw variable {{{message_html}}} plus {{to_email}}, {{to_name}}, {{score}}), then paste the 3 IDs below.
   Until you do, "Email me a copy" below uses a plain mailto draft instead — this always works with zero
   setup, the person just has to attach the PDF they already downloaded, because browsers are not allowed
   to attach a file to an email for you. Either way, no resume content is ever sent to you (the developer) —
   see the visitor/resume counters on the homepage for that instead. */
const CFG = { service: "", template: "", key: "" };
const ready = () => CFG.key && CFG.service && CFG.template;
function mailBody() {
  const s = score(D)[0],
    ac = $("#accent").value,
    h = html(D)
      .replace(
        /<div class="l"><span>(.*?)<\/span><span>(.*?)<\/span><\/div>/g,
        '<table width="100%" cellspacing="0" cellpadding="0"><tr><td>$1</td><td align="right">$2</td></tr></table>',
      )
      .replace(/<ul>|<\/ul>/g, "")
      .replace(/<li>/g, '<p style="margin:0 0 0 12px">– ')
      .replace(/<\/li>/g, "</p>");
  return `<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto"><style>h1{font-size:22px;text-transform:uppercase;margin:0}h2{font-size:14px;text-transform:uppercase;border-bottom:1.5px solid ${ac};color:${ac};margin:14px 0 6px}a{color:#1a47b8;text-decoration:none}p{margin:0;text-align:justify}</style><h3>Your resume from ResumGo</h3><p>Hello ${esc(D.name)}, here is your resume. ATS score: <b>${s}%</b>. You can also download PDF and DOC from the site.</p><hr style="margin:14px 0">${h}<hr style="margin:14px 0"><p style="font-size:12px;color:#666">ResumGo is a free ATS-friendly resume builder by Nitish Singh. <a href="https://www.linkedin.com/in/nitishsde/">LinkedIn</a> | <a href="https://github.com/nitishsde">GitHub</a></p></div>`;
}
function textOf(h) {
  const d = document.createElement("div");
  d.innerHTML = h;
  return d.textContent.replace(/\n{3,}/g, "\n\n").trim();
}
async function mailCopy() {
  if (!okContact()) return;
  if (ready()) {
    try {
      const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: CFG.service,
          template_id: CFG.template,
          user_id: CFG.key,
          template_params: {
            to_email: D.email,
            to_name: D.name,
            score: score(D)[0],
            message_html: mailBody(),
          },
        }),
      });
      toast(
        r.ok
          ? "Resume sent to " + D.email
          : "Email failed, check keys and try again",
        !r.ok,
      );
    } catch (e) {
      toast("Email failed: check internet", 1);
    }
    return;
  }
  const body = `Hi ${D.name || ""},\n\nHere is your resume text from ResumGo (ATS score ${score(D)[0]}%).\nAttach the Resumemaker.pdf you just downloaded, then hit send.\n\n${textOf(html(D))}`;
  location.href = `mailto:${encodeURIComponent(D.email)}?subject=${encodeURIComponent("My Resume - " + (D.name || "") + " (ResumGo)")}&body=${encodeURIComponent(body)}`;
  toast("Opening your email app — attach the downloaded PDF and hit send.");
}
draw();
live();
