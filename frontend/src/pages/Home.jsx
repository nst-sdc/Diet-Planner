import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
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
      <section className="hero">
        <div className="hero-left">
          <img src="./images/hero-girl.png" alt="Hero Girl" />
        </div>
        <div className="hero-right">
          <p className="subheading">Transform Your Health with</p>
          <h1>Your Personalized Diet Companion</h1>
          <p className="hero-desc">
            Dietura is a web-based diet planner designed to help users take charge of their health by tracking meals, monitoring nutrition intake, and working towards fitness goals — all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn green" style={{ textDecoration: 'none' }}>Go to Dashboard</Link>
          </div>
        </div>
      </section>
      <section className="features">
        <h2>Features</h2>
        <p className="features-subtext">Welcome to Dietura, your destination for nutrition and wellness.</p>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🍽 Personalized Meal Planner</h3>
            <p>Get a nutrition plan for your body and goals.</p>
          </div>
          <div className="feature-card">
            <h3>📊 Track Your Progress</h3>
            <p>Get guidance and support to reach your goals.</p>
          </div>
          <div className="feature-card">
            <h3>🧪 Nutrition Tracking</h3>
            <p>Track your food intake and analyze your habits.</p>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-logo">🍃 Dietura</div>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/meal-planner">Meal Planner</Link></li>
            <li><Link to="/nutrition-tracker">Nutrition Tracker</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        <div className="footer-bottom">
          <div className="contact-info">
            📧 hello@dietura.com | 📞 +91 XXXXX XXXXX | 📍 Somewhere in the World
          </div>
          <p>© 2025 Dietura. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home; 