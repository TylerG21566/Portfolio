import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import DotsLinesBackground from './DotsLinesBackground';
import ProjectFlipCard from './ProjectFlipCard';
import BrewQuestImg from './assets/BrewQuest.png';

function Navbar({ onNavClick }: { onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void }) {
  return (
    <nav
      className="glass-navbar navbar navbar-expand rounded-pill shadow-lg"
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 'clamp(20px, 4vw, 40px)',
        zIndex: 100,
        minWidth: '320px',
        maxWidth: '90vw',
        width: 'fit-content',
        padding: '0.3rem 1.5rem',
        background: 'rgba(255,255,255,0.25)',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: '2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      <a className="nav-link fw-semibold" href="#about" onClick={e => onNavClick && onNavClick(e, 'about')}>About Me</a>
      <a className="nav-link fw-semibold" href="#projects" onClick={e => onNavClick && onNavClick(e, 'projects')}>Projects</a>
      <a className="nav-link fw-semibold" href="#experience" onClick={e => onNavClick && onNavClick(e, 'experience')}>Experience</a>
    </nav>
  )
}

function DarkModeToggle({ dark, setDark }: { dark: boolean; setDark: (d: boolean) => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button
        className="dark-toggle-slider"
        aria-label="Toggle dark mode"
        onClick={() => setDark(!dark)}
        style={{
          width: 72,
          height: 40,
          border: 'none',
          borderRadius: 24,
          background: dark ? '#23272b' : '#f3f3f3',
          boxShadow: '0 2px 8px #0002',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: 0,
          position: 'relative',
          transition: 'background 0.3s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: dark ? 36 : 6,
            top: 6,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: dark ? '#ffd700' : '#222',
            color: dark ? '#222' : '#ffd700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 1px 4px #0002',
            transition: 'left 0.3s, background 0.3s, color 0.3s',
          }}
        >
          {dark ? '🌙' : '☀️'}
        </span>
      </button>
    </div>
  )
}

function AnimatedHeading({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleAnimate = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.remove('animated-heading-grow');
          // Force reflow to restart animation
          void el.offsetWidth;
          el.classList.add('animated-heading-grow');
        }
      });
    };
    const observer = new window.IntersectionObserver(handleAnimate, {
      threshold: 0.5,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h1 ref={ref} className="mb-4 animated-heading">{children}</h1>
  );
}

function App() {
  // Set dark mode to true by default
  const [dark, setDark] = useState(() => true);
  const [cursorEmoji, setCursorEmoji] = useState('🐒')

  // Scroll to About section on mount (only if not already at about)
  React.useEffect(() => {
    // Find the about section and scroll to it only if at the very top
    const el = document.getElementById('about');
    if (el && window.scrollY < 10 && window.location.hash === '') {
      window.scrollTo({ top: el.offsetTop - 24, behavior: 'auto' });
    }
  }, []);

  // Toggle dark class on body
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('dark-mode', dark)
  }

  // Animated smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const startY = window.scrollY;
      const endY = el.getBoundingClientRect().top + window.scrollY - 24;
      const duration = 700;
      let start: number | null = null;
      function step(timestamp: number) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
        window.scrollTo(0, startY + (endY - startY) * ease);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      }
      window.requestAnimationFrame(step);
    }
  };

  // Cursor emoji effect
  React.useEffect(() => {
    const handleScroll = () => {
      const projects = document.getElementById('projects');
      const experience = document.getElementById('experience');
      const scrollY = window.scrollY + window.innerHeight / 2;
      let emoji = '🐒';
      if (experience && scrollY >= experience.offsetTop) {
        emoji = '🥸';
      } else if (projects && scrollY >= projects.offsetTop) {
        emoji = '🪐';
      }
      setCursorEmoji(emoji);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    let cursor = document.getElementById('emoji-cursor') as HTMLDivElement | null;
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'emoji-cursor';
      cursor.style.position = 'fixed';
      cursor.style.pointerEvents = 'none';
      cursor.style.zIndex = '9999';
      cursor.style.fontSize = '2rem';
      cursor.style.transition = 'transform 0.08s';
      cursor.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(cursor);
    }
    const move = (e: MouseEvent) => {
      cursor!.style.left = e.clientX + 'px';
      cursor!.style.top = e.clientY + 'px';
      cursor!.textContent = cursorEmoji;
    };
    window.addEventListener('mousemove', move);
    // Always update emoji on prop change
    cursor.textContent = cursorEmoji;
    return () => {
      window.removeEventListener('mousemove', move);
      // Do not remove the cursor div here, just let it persist
    };
  }, [cursorEmoji]);

  React.useEffect(() => {
    // Hide the default cursor and pointer
    document.body.style.cursor = 'none';
    const style = document.createElement('style');
    style.id = 'hide-pointer-cursor';
    style.innerHTML = '*:hover, *:active, *:focus { cursor: none !important; }';
    document.head.appendChild(style);
    return () => {
      document.body.style.cursor = '';
      const s = document.getElementById('hide-pointer-cursor');
      if (s) s.remove();
    };
  }, []);

  return (
    <>
      <DotsLinesBackground />
      <DarkModeToggle dark={dark} setDark={setDark} />
      <main>
        <section id="about" style={{ minHeight: '100vh', paddingTop: 60, paddingBottom: 60 }}>
          <AnimatedHeading>About Me</AnimatedHeading>
          <div className="about-content" style={{ maxWidth: 700, margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.7 }}>
            <p>
              <span role="img" aria-label="waving hand">👋</span> Hi, I'm Tyler Goyea, a BSc Computer Science student at the University of Manchester <span role="img" aria-label="graduation cap">🎓</span>.<br/>
              I achieved 5A* at A-Level (Mathematics <span role="img" aria-label="abacus">🧮</span>, Further Mathematics <span role="img" aria-label="chart">📈</span>, Physics <span role="img" aria-label="atom">⚛️</span>, Computer Science <span role="img" aria-label="laptop">💻</span>, and EPQ <span role="img" aria-label="books">📚</span>).
              <br/>I am passionate about software engineering <span role="img" aria-label="rocket">🚀</span>, currently on placement at IBM Hursley, and always eager to learn new technologies <span role="img" aria-label="light bulb">💡</span> and tackle challenging problems.
            </p>
            <p>
              <a href="/src/assets/TylerGoyeaCV_Intern_Ult-1.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary mt-2">
                <span role="img" aria-label="page">📄</span> View My CV
              </a>
            </p>
          </div>
        </section>
        <section id="projects" style={{ minHeight: '100vh', paddingTop: 60, paddingBottom: 60 }}>
          <AnimatedHeading>Projects</AnimatedHeading>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2.2rem',
            maxWidth: 900,
            margin: '0 auto',
            padding: '1.5rem 0',
          }}>
            {/* Example projects, replace with your real data */}
            <ProjectFlipCard
              title="BrewQuest"
              description="A gamified coffee discovery app for enthusiasts."
              image={BrewQuestImg}
            />
            <ProjectFlipCard
              title="Portfolio Website"
              description="My personal site built with React, TypeScript, and Vite."
              image={BrewQuestImg}
            />
            <ProjectFlipCard
              title="TaskFlow"
              description="A productivity tool for managing daily tasks and goals."
              image={BrewQuestImg}
            />
          </div>
        </section>
        <section id="experience" style={{ minHeight: '100vh', paddingTop: 60, paddingBottom: 60 }}>
          <AnimatedHeading>Experience</AnimatedHeading>
          <div className="experience-widgets" style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(320px, 1fr))',
            gap: '2.2rem',
            alignItems: 'stretch',
            padding: '1.5rem 0',
          }}>
            {/* IBM Hursley Widget */}
            <div className="widget widget-lg" style={{
              background: 'rgba(255,255,255,0.012)', // nearly invisible
              borderRadius: '2.2rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.012)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.018)',
              padding: '2.2rem 2rem 1.5rem 2rem',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              justifyContent: 'flex-start',
              gridRow: '1 / span 1',
              gridColumn: '1 / span 2',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 2 }}>
                <span style={{ fontSize: '2.1rem', flexShrink: 0 }} role="img" aria-label="office">💼</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2 }}>Software Engineer Industrial Placement</div>
                  <div style={{ color: '#888', fontWeight: 500, fontSize: '1rem', lineHeight: 1.2 }}>IBM Hursley · Winchester, UK</div>
                </div>
              </div>
              <div style={{ color: '#888', fontWeight: 400, fontSize: '0.98rem', marginBottom: 6, marginTop: 2 }}>July 2025 - May 2026</div>
              <ul style={{ margin: 0, paddingLeft: 0, fontSize: '1.05rem', lineHeight: 1.7, listStyle: 'none' }}>
                {[
                  'Industrial placement as a Software Engineer at IBM\'s Hursley Park campus, contributing to enterprise software solutions and collaborating with global teams.',
                  'Worked on real-world projects using modern technologies and agile methodologies.',
                  'Gained experience in large-scale software development, code reviews, and continuous integration.'
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: '1.1em', marginTop: 2, color: '#3b82f6' }}>🧑‍🔬</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Software Engineer Intern Widget */}
            <div className="widget widget-sm" style={{
              background: 'rgba(255,255,255,0.012)',
              borderRadius: '2.2rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.012)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.018)',
              padding: '2.2rem 2rem 1.5rem 2rem',
              minHeight: 320,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              justifyContent: 'flex-start',
              gridRow: '2 / span 2',
              gridColumn: '1 / span 1',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 2 }}>
                <span style={{ fontSize: '2.1rem', flexShrink: 0 }} role="img" aria-label="office">🏢</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2 }}>Software Engineer Intern</div>
                  <div style={{ color: '#888', fontWeight: 500, fontSize: '1rem', lineHeight: 1.2 }}>Al Jaber Group · Abu Dhabi, UAE</div>
                </div>
              </div>
              <div style={{ color: '#888', fontWeight: 400, fontSize: '0.98rem', marginBottom: 6, marginTop: 2 }}>Aug. 2024 - Sept. 2024</div>
              <ul style={{ margin: 0, paddingLeft: 0, fontSize: '1.05rem', lineHeight: 1.7, listStyle: 'none' }}>
                {[
                  'Enhanced legacy code base at a $9B Construction & Energy Group and developed a feature for an existing web app used by 300 employees, primarily using ',
                  <span key="b1"><b>C#</b>, <b>.NET</b>, and <b>SQL Server</b></span>,
                  'Built prototype leave request generation site with ',
                  <span key="b2"><b>MongoDB</b>, <b>Node.js</b>, <b>Express.js</b>, and <b>React.js</b></span>,
                  'Developed Account Reconciliation Program for Finance Department staff that auto-generated summaries in Excel'
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: '1.1em', marginTop: 2, color: '#3b82f6' }}>🛠️</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* EV Software Team Widget */}
            <div className="widget widget-md" style={{
              background: 'rgba(255,255,255,0.012)',
              borderRadius: '2.2rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.012)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.018)',
              padding: '1.7rem 1.5rem 1.2rem 1.5rem',
              minHeight: 260,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              justifyContent: 'flex-start',
              gridRow: '2 / span 1',
              gridColumn: '2 / span 1',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 2 }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }} role="img" aria-label="racecar">🏎️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.2 }}>Electric Vehicle Software Team</div>
                  <div style={{ color: '#888', fontWeight: 500, fontSize: '0.98rem', lineHeight: 1.2 }}>UoM Formula Student · Manchester, UK</div>
                </div>
              </div>
              <div style={{ color: '#888', fontWeight: 400, fontSize: '0.95rem', marginBottom: 6, marginTop: 2 }}>Oct. 2024 - Mar. 2025</div>
              <ul style={{ margin: 0, paddingLeft: 0, fontSize: '1.01rem', lineHeight: 1.7, listStyle: 'none' }}>
                {[
                  'Developing formula-style racecars with 80+ students to race other universities in engineering competition',
                  'Collaborate with hardware teams to integrate software solutions for data logging, telemetry, and data visualization',
                  'Gain proficiency in ',
                  <span key="b3"><b>C programming</b> for STM32 microcontrollers to develop firmware for inverter commands</span>
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: '1.1em', marginTop: 2, color: '#10b981' }}>🏁</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Operational Finance Intern Widget */}
            <div className="widget widget-sm" style={{
              background: 'rgba(255,255,255,0.012)',
              borderRadius: '2.2rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.012)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.018)',
              padding: '1.2rem 1.2rem 1rem 1.2rem',
              minHeight: 180,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              justifyContent: 'flex-start',
              gridRow: '3 / span 1',
              gridColumn: '2 / span 1',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
                <span style={{ fontSize: '1.7rem', flexShrink: 0 }} role="img" aria-label="money">💸</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>Operational Finance Intern</div>
                  <div style={{ color: '#888', fontWeight: 500, fontSize: '0.93rem', lineHeight: 1.2 }}>Al Jaber Group · Abu Dhabi, UAE</div>
                </div>
              </div>
              <div style={{ color: '#888', fontWeight: 400, fontSize: '0.92rem', marginBottom: 6, marginTop: 2 }}>June. 2024 - July. 2024</div>
              <ul style={{ margin: 0, paddingLeft: 0, fontSize: '0.98rem', lineHeight: 1.7, listStyle: 'none' }}>
                {[
                  'Generated payment vouchers for material purchases',
                  'Processed invoices and LPOs to generate payment vouchers using Oracle JD Edwards EnterpriseOne',
                  'Reconciliation of A/P and A/R accounts in company database'
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: '1.1em', marginTop: 2, color: '#f59e42' }}>💸</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Blockchain Research Widget */}
            <div className="widget widget-lg" style={{
              background: 'rgba(255,255,255,0.012)',
              borderRadius: '2.2rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.012)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.018)',
              padding: '1.7rem 1.5rem 1.2rem 1.5rem',
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              justifyContent: 'flex-start',
              gridRow: '4 / span 1',
              gridColumn: '1 / span 2',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 2 }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }} role="img" aria-label="blockchain">⛓️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.2 }}>Blockchain Student Research Assistant</div>
                  <div style={{ color: '#888', fontWeight: 500, fontSize: '0.98rem', lineHeight: 1.2 }}>NYU (Intl. Site) · Abu Dhabi, UAE</div>
                </div>
              </div>
              <div style={{ color: '#888', fontWeight: 400, fontSize: '0.95rem', marginBottom: 6, marginTop: 2 }}>June. 2022 - July. 2022</div>
              <ul style={{ margin: 0, paddingLeft: 0, fontSize: '1.01rem', lineHeight: 1.7, listStyle: 'none' }}>
                {[
                  'Trialed ideas conceived by supervising professor, developed React-based web application with 3 Student Assistants',
                  'The application simulated the use of Ethereum NFTs to trade energy allowance tokens by government agencies and firms',
                  'Met 3 Sustainable Development Goals, implemented Solidity Ethereum smart contracts, and built a Node.js back-end'
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: '1.1em', marginTop: 2, color: '#a855f7' }}>⛓️</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Navbar onNavClick={handleNavClick} />
    </>
  )
}

export default App
