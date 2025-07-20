import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import DotsLinesBackground from './DotsLinesBackground';
import ProjectFlipCard from './ProjectFlipCard';
import BrewQuestImg from './assets/BrewQuest.png';
import YourImage from './assets/Image.png';


// Add global styles to prevent horizontal scroll
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      overflow-x: hidden;
    }
    #root {
      width: 100%;
      overflow-x: hidden;
    }
  `;
  document.head.appendChild(style);
}

function Navbar({ onNavClick }: { onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void }) {
  return (
    <nav
      className="glass-navbar navbar navbar-expand rounded-pill shadow-lg"
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '20px',
        zIndex: 100,
        width: '90%',
        maxWidth: '400px',
        padding: '0.5rem 1rem',
        background: 'rgba(255,255,255,0.25)',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: '2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '0.9rem',
      }}
    >
      <a className="nav-link fw-semibold" href="#about" onClick={e => onNavClick && onNavClick(e, 'about')}>About</a>
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
        top: 20,
        right: 20,
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
          width: 60,
          height: 32,
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
            left: dark ? '32px' : '4px',
            top: '4px',
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: dark ? '#ffd700' : '#222',
            color: dark ? '#222' : '#ffd700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
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
    <h1 ref={ref} className="mb-4 animated-heading" style={{ fontSize: '2rem', textAlign: 'center' }}>{children}</h1>
  );
}

function App() {
  const [dark, setDark] = useState(() => true);
  const [cursorEmoji, setCursorEmoji] = useState('🐒')
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to About section on mount
  React.useEffect(() => {
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
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cursor emoji effect (desktop only)
  React.useEffect(() => {
    if (isMobile) return;
    
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
  }, [isMobile]);

  React.useEffect(() => {
    if (isMobile) return;
    
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
    cursor.textContent = cursorEmoji;
    return () => {
      window.removeEventListener('mousemove', move);
    };
  }, [cursorEmoji, isMobile]);

  React.useEffect(() => {
    if (isMobile) return;
    
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
  }, [isMobile]);

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        <DotsLinesBackground />
      </div>
      <DarkModeToggle dark={dark} setDark={setDark} />
      <main style={{ 
        position: 'relative',
        zIndex: 1,
        padding: '20px', 
        paddingBottom: '100px',
        width: '100%',
        maxWidth: '100vw',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
      
        <section id="about" style={{ minHeight: '100vh', paddingTop: 40, paddingBottom: 40, width: '100%' }}>
          <AnimatedHeading>About Me</AnimatedHeading>
          <div className="about-content" style={{
        maxWidth: '1200px',
        paddingLeft: '20px',
        paddingRight: '20px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth > 768 ? 'row' : 'column',
          alignItems: 'center',
          gap: window.innerWidth > 768 ? '40px' : '20px'
        }}>
          {/* Image on the left */}
          <div style={{
            flex: window.innerWidth > 768 ? '0 0 auto' : '1',
            textAlign: 'center',
            width: window.innerWidth > 768 ? 'auto' : '100%'
          }}>
            <img
              src={YourImage}
              alt="Description"
              style={{
                width: '60%', // 40% reduction from original
                maxWidth: '300px',
                height: 'auto',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>
          
          {/* Text content on the right */}
          <div style={{
            flex: '1',
            fontSize: '1rem',
            lineHeight: 1.7,
            textAlign: window.innerWidth > 768 ? 'left' : 'center'
          }}>
            <p>
              <span role="img" aria-label="waving hand">👋</span> Hi, I'm Tyler Goyea, a BSc Computer Science student at the University of Manchester <span role="img" aria-label="graduation cap">🎓</span>.<br/>
              I achieved 5A* at A-Level (Mathematics <span role="img" aria-label="abacus">🧮</span>, Further Mathematics <span role="img" aria-label="chart">📈</span>, Physics <span role="img" aria-label="atom">⚛️</span>, Computer Science <span role="img" aria-label="laptop">💻</span>, and EPQ <span role="img" aria-label="books">📚</span>).
              <br/>I am passionate about software engineering <span role="img" aria-label="rocket">🚀</span>, currently on placement at IBM Hursley, and always eager to learn new technologies <span role="img" aria-label="light bulb">💡</span> and tackle challenging problems.
            </p>
            <p>
              <a
                href="/src/assets/TylerGoyeaCV_Intern_Ult-1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary mt-2"
              >
                <span role="img" aria-label="page">📄</span> View My CV
              </a>
            </p>
          </div>
        </div>
      </div>
        </section>
        
        <section id="projects" style={{ minHeight: '100vh', paddingTop: 40, paddingBottom: 40 }}>
          <AnimatedHeading>Projects</AnimatedHeading>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            maxWidth: 900,
            margin: '0 auto',
          }}>
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
        
        <section id="experience" style={{ minHeight: '100vh', paddingTop: 40, paddingBottom: 40 }}>
          <AnimatedHeading>Experience</AnimatedHeading>
          <div className="experience-widgets" style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {/* IBM Hursley Widget */}
            <div className="widget" style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.1)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: '1.8rem' }} role="img" aria-label="office">💼</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Software Engineer Industrial Placement</div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>IBM Hursley · Winchester, UK</div>
                  <div style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>July 2025 - May 2026</div>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.95rem', lineHeight: 1.6 }}>
                <li>Industrial placement at IBM's Hursley Park campus</li>
                <li>Contributing to enterprise software solutions</li>
                <li>Working with modern technologies and agile methodologies</li>
              </ul>
            </div>

            {/* Software Engineer Intern Widget */}
            <div className="widget" style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.1)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: '1.8rem' }} role="img" aria-label="office">🏢</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Software Engineer Intern</div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>Al Jaber Group · Abu Dhabi, UAE</div>
                  <div style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>Aug. 2024 - Sept. 2024</div>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.95rem', lineHeight: 1.6 }}>
                <li>Enhanced legacy code base using <b>C#</b>, <b>.NET</b>, and <b>SQL Server</b></li>
                <li>Built prototype with <b>MongoDB</b>, <b>Node.js</b>, <b>Express.js</b>, and <b>React.js</b></li>
                <li>Developed Account Reconciliation Program for Finance Department</li>
              </ul>
            </div>

            {/* EV Software Team Widget */}
            <div className="widget" style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.1)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: '1.8rem' }} role="img" aria-label="racecar">🏎️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Electric Vehicle Software Team</div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>UoM Formula Student · Manchester, UK</div>
                  <div style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>Oct. 2024 - Mar. 2025</div>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.95rem', lineHeight: 1.6 }}>
                <li>Developing formula-style racecars with 80+ students</li>
                <li>Integrating software for data logging and telemetry</li>
                <li>Programming in <b>C</b> for STM32 microcontrollers</li>
              </ul>
            </div>

            {/* Operational Finance Intern Widget */}
            <div className="widget" style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.1)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: '1.8rem' }} role="img" aria-label="money">💸</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Operational Finance Intern</div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>Al Jaber Group · Abu Dhabi, UAE</div>
                  <div style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>June. 2024 - July. 2024</div>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.95rem', lineHeight: 1.6 }}>
                <li>Generated payment vouchers for material purchases</li>
                <li>Processed invoices using Oracle JD Edwards EnterpriseOne</li>
                <li>Reconciled A/P and A/R accounts</li>
              </ul>
            </div>

            {/* Blockchain Research Widget */}
            <div className="widget" style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.1)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: '1.8rem' }} role="img" aria-label="blockchain">⛓️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Blockchain Student Research Assistant</div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>NYU (Intl. Site) · Abu Dhabi, UAE</div>
                  <div style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>June. 2022 - July. 2022</div>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.95rem', lineHeight: 1.6 }}>
                <li>Developed React-based web application with 3 Student Assistants</li>
                <li>Simulated Ethereum NFTs for energy allowance trading</li>
                <li>Implemented Solidity smart contracts and Node.js backend</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Navbar onNavClick={handleNavClick} />
    </div>
  )
}

export default App