import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5fff1' }}>
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
          <div className="hero-img-bg">
            <img src="/images/hero-girl.png" alt="Hero Girl" />
          </div>
        </div>
        <div className="hero-right">
          <p className="subheading">Transform Your <span role="img" aria-label="heart">❤️</span> Health with</p>
          <h1>Your Personalized Diet Companion</h1>
          <p className="hero-desc">
            Dietura is a web-based diet planner designed to help users take charge of their health by tracking meals, monitoring nutrition intake, and working towards fitness goals — all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn green" style={{ textDecoration: 'none' }}>Go to Dashboard</Link>
            <button className="btn outline">Check interesting recipes</button>
          </div>
          <div className="hero-social-proof">
            <img src="/images/hero-girl.png" alt="User group" className="avatar-group" />
            <span>500+ lives changed. Start yours today.</span>
          </div>
        </div>
      </section>
      <section className="features">
        <h2>Features</h2>
        <p className="features-subtext">Welcome to Dietura, your destination for nutrition and wellness.</p>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🍽 Personalized Meal Planner</h3>
            <p>Receive a tailored nutrition plan designed specifically for your body and goals. Our certified nutritionists will consider your unique needs, dietary preferences, and health conditions to create a plan that suits you best.</p>
          </div>
          <div className="feature-card">
            <h3>📊 Track Your Progress</h3>
            <p>Our team of experienced and certified nutritionists will provide professional guidance and support throughout your journey. They will answer your questions, address your concerns, and keep you motivated as you work towards your goals.</p>
          </div>
          <div className="feature-card">
            <h3>🧪 Nutrition Tracking and Analysis</h3>
            <p>Effortlessly track your food intake using our user-friendly app. Our nutritionists will analyze your data to provide insights into your eating habits, help you identify areas for improvement, and make personalized recommendations.</p>
          </div>
          <div className="feature-card">
            <h3>📚 Recipe Library</h3>
            <p>Access a vast collection of delicious and healthy recipes tailored to your dietary needs. Our nutritionists will also create personalized meal plans, making it easier for you to stay on track and enjoy nutritious meals.</p>
          </div>
        </div>
      </section>
      <section className="testimonials">
        <h2>Our Testimonials</h2>
        <p className="testimonials-subtext">Our satisfied clients share their success stories and experiences on their journey to better health and well-being.</p>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-quote">“I can't thank Nutritionist enough for their personalized nutrition coaching. It has completely transformed my approach to food and helped me shed those extra pounds. Highly recommended!”</p>
            <div className="testimonial-user">
              <img src="/images/hero-girl.png" alt="Jennifer Anderson" className="testimonial-avatar" />
              <span className="testimonial-name">Jennifer Anderson</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">“Nutritionist has been a game-changer for me. The expert guidance and support I received from their team made my weight loss journey so much easier. Thank you!”</p>
            <div className="testimonial-user">
              <img src="/images/hero-girl.png" alt="Robert Johnson" className="testimonial-avatar" />
              <span className="testimonial-name">Robert Johnson</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">“I had struggled with my weight for years until I found Nutritionist. Their personalized approach and tailored nutrition plan made all the difference. I've never felt better!”</p>
            <div className="testimonial-user">
              <img src="/images/hero-girl.png" alt="Emily Davis" className="testimonial-avatar" />
              <span className="testimonial-name">Emily Davis</span>
            </div>
          </div>
        </div>
        <div className="testimonial-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
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