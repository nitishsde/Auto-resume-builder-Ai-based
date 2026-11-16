ResumGo: open index.html. Pages: index (landing + live counters), builder (form + live resume), developer. AI Build Resume: ai-builder.html (+ ai-builder.js, ai-builder.css, ai-parse.js). Photo: assets/profile.jpg.

EMAIL — works with ZERO setup by default:
"Email me a copy" opens a plain email draft addressed to the person's own inbox, pre-filled with their resume text.
They attach the Resumemaker.pdf they already downloaded and hit send. No resume content is ever sent to you.

OPTIONAL upgrade (auto-send, still no resume content to you):
1. emailjs.com > sign up > Email Services > Add Gmail > copy Service ID.
2. Email Templates > Create, follow email-template.html > copy Template ID.
3. Account > API Keys > copy Public Key.
4. Paste the 3 values into CFG at the bottom of builder.js.
Note: free EmailJS cannot attach files, so the resume goes in the email body, sent only to the person who filled the form.

COUNTERS: the homepage shows "Resumes generated" and "Visits" — a free, anonymous counter (api.countapi.xyz), no personal data, just numbers. This is how you can see usage without any resume content reaching your inbox.

Deploy free: Vercel / Netlify / GitHub Pages.
live Link: https://autoresume.netlify.app/

Main Website
