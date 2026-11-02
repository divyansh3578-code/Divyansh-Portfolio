import { useEffect, useRef, useState } from "react";
import { ME, ROLES, STATS, ABOUT, EXP, PROJECTS, SKILLS, CERTS, LINKS } from "./data.js";
import Sky from "./components/Sky.jsx";
import Intro, { introMs } from "./components/Intro.jsx";
import Education from "./components/Education.jsx";
import Music from "./components/Music.jsx";
import Games from "./components/Games.jsx";
import Rv from "./components/Rv.jsx";
import emailjs from "@emailjs/browser";
const RM = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function Chips({ items, value, onChange, label }) {
  return <div className="chips" role="group" aria-label={label}>{items.map((x) => <button key={x} className="chip" aria-pressed={x === value} onClick={() => onChange(x)}>{x}</button>)}</div>;
}
function Count({ to, suffix, delay }) {
  const [v, setV] = useState(RM ? to : 0);
  useEffect(() => {
    if (RM) return;
    let raf, t0; const go = (t) => { t0 ??= t; const k = Math.min((t - t0) / 1400, 1); setV(Math.round(to * (1 - (1 - k) ** 2))); if (k < 1) raf = requestAnimationFrame(go); };
    const w = setTimeout(() => (raf = requestAnimationFrame(go)), delay * 1000);
    return () => { clearTimeout(w); cancelAnimationFrame(raf); };
  }, [to, delay]);
  return <strong>{v}{suffix}</strong>;
}

export default function App() {
  const T = RM ? 0 : introMs(ME.name.length) / 1000;
  const [ri, setRi] = useState(0), [pf, setPf] = useState("All"), [sf, setSf] = useState("All"), [msg, setMsg] = useState("");
  const dlg = useRef(null), bar = useRef(null);
  useEffect(() => { if (RM) return; const id = setInterval(() => setRi((i) => (i + 1) % ROLES.length), 2200); return () => clearInterval(id); }, []);
  useEffect(() => {
    const f = () => { const h = document.documentElement.scrollHeight - innerHeight; if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
    addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f);
  }, []);
 
const send = async (e) => {
  e.preventDefault();

  const formElement = e.currentTarget;
  const d = new FormData(formElement);

  setMsg("Sending message...");

  const templateParams = {
    name: d.get("n"),
    email: d.get("e"),
    subject: d.get("s"),
    message: d.get("m"),
  };

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    setMsg("✓ Message sent successfully! I'll get back to you soon.");
    formElement.reset();

  }  catch (error) {
  console.error("EmailJS error:", error);
  console.log("Error status:", error.status);
  console.log("Error text:", error.text);

  setMsg(`✗ ${error.text || "Message could not be sent. Please try again."}`);
}
};

  const projs = PROJECTS.filter((p) => pf === "All" || p.c === pf);
  const skills = sf === "All" ? Object.values(SKILLS).flat() : SKILLS[sf];
  return (
    <>
      {!RM && <Intro name={ME.name} />}
      <Sky /><div id="bar" ref={bar} />
      <header className="nav">
  <div className="wrap">
    <a className="logo" href="#top">{ME.name}</a>

    {[
      { label: "Lore", id: "about" },
      { label: "Academics", id: "education" },
      { label: "Journey", id: "experience" },
      { label: "Builds", id: "projects" },
      { label: "Vibes", id: "music" },
      { label: "Chill", id: "games" },
      { label: "Connect", id: "contact" }
    ].map((item) => (
      <a className="l" key={item.id} href={`#${item.id}`}>
        {item.label}
      </a>
    ))}

    <a
      className="l resume-link"
      href="/Divyansh_Gupta_Resume.pdf"
      download="Divyansh_Gupta_Resume.pdf"
    >
      ↓ Resume
    </a>
  </div>
</header>
      <main id="top">
        <div className="hero"><div className="wrap" style={{ "--t": T + "s" }}>
          <span className="status hero-in" style={{ "--i": 0 }}><i />Open to internships and full-time roles</span>
          <h1 aria-label={ME.name}>{[...ME.name].map((c, i) => <span className="ch" aria-hidden="true" key={i} style={{ animationDelay: `${T + .1 + i * .04}s` }}>{c === " " ? "\u00a0" : c}</span>)}</h1>
          <div className="role hero-in" style={{ "--i": 4 }} aria-live="polite">I build <b>{ROLES[ri]}</b></div>
          <p className="lead hero-in" style={{ "--i": 5 }}>{ME.lead}</p>
          <div className="btns hero-in" style={{ "--i": 6 }}><a className="btn p" href="#projects">See my projects</a><a className="btn" href="#contact">Get in touch</a></div>
          <div className="stats hero-in" style={{ "--i": 7 }}>{STATS.map((s) => <div key={s.l}><Count to={s.n} suffix={s.s} delay={T + .9} /><span>{s.l}</span></div>)}</div>
        </div></div>

        <section id="about"><div className="wrap"><Rv as="h2">About me</Rv><div className="about">{ABOUT.map((t) => <Rv as="p" key={t}>{t}</Rv>)}</div></div></section>
        <Education />
        <section id="experience"><div className="wrap"><Rv as="h2">Experience</Rv>
          <ol className="tl">{EXP.map((e) => <Rv as="li" key={e.t}><h3>{e.t}, {e.o}</h3><div className="when">{e.d}</div><p>{e.p}</p></Rv>)}</ol></div></section>
        <section id="projects"><div className="wrap"><Rv as="h2">Projects</Rv>
          <Chips label="Filter projects" items={["All", ...new Set(PROJECTS.map((p) => p.c))]} value={pf} onChange={setPf} />
          <ul className="proj">{projs.map((p) => <Rv as="li" key={p.n}><span className="yr">{p.y}</span><div><h3>{p.n}</h3><p>{p.p}</p><div className="tags">{p.tags}</div></div>
            <span className="lnk">{p.live && <a href={p.live}>Live site</a>}<a href={p.gh}>GitHub</a></span></Rv>)}</ul></div></section>
        <section id="skills"><div className="wrap"><Rv as="h2">Skills</Rv>
          <Chips label="Filter skills" items={["All", ...Object.keys(SKILLS)]} value={sf} onChange={setSf} />
          <div className="skills">{skills.map((s) => <span className="skill" key={s}>{s}</span>)}</div></div></section>
        <Music />
        <Games />
        <section id="certs"><div className="wrap"><Rv as="h2">Certifications and wins</Rv>
          <div className="certs">{CERTS.map((c) => <Rv className="cert" key={c.t}><h3>{c.t}</h3><p>{c.p}</p><a href={c.l}>View credential</a></Rv>)}</div></div></section>
        <section id="contact"><div className="wrap"><Rv as="h2">Let's work together</Rv>
          <div className="contact"><div><p>Have a role, project or question? Send a message and I'll reply within two days.</p>
            <ul className="links">{LINKS.map(([n, u]) => <li key={n}><a href={u}>{n}</a></li>)}<li><a href={"mailto:" + ME.email}>{ME.email}</a></li></ul></div>
            
<form onSubmit={send}>
  <label>
    Name
    <input name="n" required autoComplete="name" />
  </label>

  <label>
    Email
    <input
      name="e"
      type="email"
      required
      autoComplete="email"
    />
  </label>

  <label>
    Subject
    <input
      name="s"
      placeholder="What's this about?"
      required
    />
  </label>

  <label>
    Message
    <textarea
      name="m"
      required
      rows="5"
      placeholder="Write your message..."
    />
  </label>

  <button className="btn p" type="submit">
    Send message →
  </button>

  <p id="msg" role="status">{msg}</p>
</form>
</div></div></section>
      </main>
      <footer><div className="wrap">© 2026 {ME.name}. Built with React and Vite.</div></footer>
      <dialog ref={dlg} style={{ border: "1px solid var(--line)", borderRadius: 12, background: "var(--panel)", color: "var(--ink)", maxWidth: 420 }}>
        <h3 style={{ font: "700 1.3rem var(--d)", marginTop: 0 }}>Resume</h3>
        <p>Put your resume in the <code>public/</code> folder and link it here, for example <code>/resume.pdf</code>.</p>
        <form method="dialog"><button className="btn p">Close</button></form>
      </dialog>
    </>
  );
}
