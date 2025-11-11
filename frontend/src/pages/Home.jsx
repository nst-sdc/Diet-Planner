import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

function Home() {
  // Subtle parallax based on mouse for hero image
  const containerRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-50, 50], [6, -6]), { stiffness: 120, damping: 12 });
  const rotateY = useSpring(useTransform(mx, [-50, 50], [-6, 6]), { stiffness: 120, damping: 12 });

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    mx.set(Math.max(-50, Math.min(50, dx / 8)));
    my.set(Math.max(-50, Math.min(50, dy / 8)));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5fff1', width: '100%', margin: 0, padding: 0 }}>
      <nav className="navbar">
        <div className="logo">🍃 Dietura</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/meal-planner">Meal Planner</Link></li>
          <li><Link to="/nutrition-tracker">Nutrition Tracker</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>
        <div className="auth-buttons">
          <Link to="/signin" className="btn btn-secondary">Sign In</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </nav>
      <section ref={containerRef} onMouseMove={handleMouseMove} className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Soft background accents */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, rgba(16,185,129,0.25), rgba(16,185,129,0))',
            filter: 'blur(30px)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.25, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '-10%',
            width: '35vw',
            height: '35vw',
            background: 'radial-gradient(circle, rgba(5,150,105,0.25), rgba(5,150,105,0))',
            filter: 'blur(22px)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />

        <div className="hero-left">
          <motion.img
            src="/images/hero-girl.png"
            alt="Hero Girl"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            whileHover={{ scale: 1.02 }}
            style={{ position: 'relative', zIndex: 1, transformPerspective: 900, rotateX, rotateY }}
          />
        </div>

        <div className="hero-right">
          <motion.p
            className="subheading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Transform Your Health with
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: 'linear-gradient(90deg,#064e3b,#10b981,#34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 8px 30px rgba(16,185,129,0.25)'
            }}
          >
            Your Personalized Diet Companion
          </motion.h1>
          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Dietura is a web-based diet planner designed to help users take charge of their health by tracking meals, monitoring nutrition intake, and working towards fitness goals — all in one place.
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link to="/dashboard" className="btn green" style={{ textDecoration: 'none' }}>
                Go to Dashboard
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section aria-label="stats" style={{ marginTop: '1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {[{ label: 'Meals Planned', value: '12k+' }, { label: 'Calories Tracked', value: '8M+' }, { label: 'Active Users', value: '25k+' }, { label: 'Avg. Goal Met', value: '72%' }]
            .map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>{s.value}</div>
                <div style={{ color: '#6b7280' }}>{s.label}</div>
              </motion.div>
            ))}
        </div>

      </section>

      {/* CTA banner */}
      <section aria-label="cta" style={{ margin: '3rem 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, #065f46, #059669)',
            color: 'white',
            borderRadius: '16px',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>Start your journey today</h3>
            <p style={{ marginTop: '0.25rem', opacity: 0.9 }}>Plan smarter meals and reach your goals faster with Dietura.</p>
          </div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link to="/signup" className="btn btn-primary" style={{ background: 'white', color: '#065f46', border: 'none' }}>
              Create your free account
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section aria-label="how-it-works" style={{ margin: '3rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>How it works</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>Three simple steps to better nutrition</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {[{
            title: 'Plan', desc: 'Create your meal plan for the day or week', img: '/images/hero-girl.png'
          }, {
            title: 'Track', desc: 'Log meals and monitor macro intake', img: '/images/logo.jpg'
          }, {
            title: 'Improve', desc: 'Adjust based on insights to hit your goals', img: '/images/hero-girl.png'
          }].map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: 'white',
                borderRadius: '14px',
                padding: '1rem',
                boxShadow: '0 10px 28px rgba(0,0,0,0.06)'
              }}
            >
              <img src={s.img} alt={s.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '10px', marginBottom: '0.75rem' }} />
              <h3 style={{ margin: 0 }}>{s.title}</h3>
              <p style={{ marginTop: '0.25rem', color: '#6b7280' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials / Gallery strip */}
      <section aria-label="testimonials" style={{ margin: '3rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Loved by our community</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem' }}>Real results from real users</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {[{
            quote: 'Dietura helped me stay consistent and finally hit my calorie goals!', name: 'Riya', img: '/images/hero-girl.png'
          }, {
            quote: 'Planning ahead made tracking effortless. Highly recommend!', name: 'Arjun', img: '/images/logo.jpg'
          }, {
            quote: 'The insights are great — I actually understand my intake now.', name: 'Neha', img: '/images/hero-girl.png'
          }].map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: 'white',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                boxShadow: '0 10px 28px rgba(0,0,0,0.06)'
              }}
            >
              <img src={t.img} alt={t.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: '50%' }} />
              <div>
                <p style={{ margin: 0 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>— {t.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="footer" style={{ background: '#052e26', color: 'white', marginTop: '3rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
        <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', paddingTop: '2rem', paddingBottom: '1.25rem' }}>
          <div>
            <motion.div className="footer-logo" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontWeight: 800, fontSize: '1.25rem' }}>🍃 Dietura</motion.div>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '0.5rem' }}>Plan smarter, track better, and reach your nutrition goals with confidence.</p>
          </div>
          <div>
            <h4 style={{ marginTop: 0 }}>Product</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
              <li><a href="#features" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Features</a></li>
              <li><a href="#pricing" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Pricing</a></li>
              <li><a href="#roadmap" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginTop: 0 }}>Company</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
              <li><Link to="/about" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>About</Link></li>
              <li><a href="#careers" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Careers</a></li>
              <li><a href="mailto:hello@dietura.com" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginTop: 0 }}>Follow</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.a aria-label="Twitter/X" href="#" whileHover={{ y: -2 }} style={{ background: 'rgba(255,255,255,0.12)', padding: '0.5rem 0.75rem', borderRadius: 8, color: 'white', textDecoration: 'none' }}>X</motion.a>
              <motion.a aria-label="Instagram" href="#" whileHover={{ y: -2 }} style={{ background: 'rgba(255,255,255,0.12)', padding: '0.5rem 0.75rem', borderRadius: 8, color: 'white', textDecoration: 'none' }}>IG</motion.a>
              <motion.a aria-label="YouTube" href="#" whileHover={{ y: -2 }} style={{ background: 'rgba(255,255,255,0.12)', padding: '0.5rem 0.75rem', borderRadius: 8, color: 'white', textDecoration: 'none' }}>YT</motion.a>
            </div>
          </div>
        </div>
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '1.5rem', padding: '1rem 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div className="contact-info" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <a href="mailto:hello@dietura.com" style={{ color: 'inherit', textDecoration: 'none' }}>📧 hello@dietura.com</a>
              <span style={{ margin: '0 0.5rem' }}>|</span>
              <a href="tel:+910000000000" style={{ color: 'inherit', textDecoration: 'none' }}>📞 +91 XXXXX XXXXX</a>
              <span style={{ margin: '0 0.5rem' }}>|</span>
              <span>📍 Somewhere in the World</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0 }}>© 2025 Dietura. All rights reserved.</p>
          </div>
        </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 