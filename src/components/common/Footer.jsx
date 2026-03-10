import React from "react";
import { Link } from "react-router-dom";
import "../../styles/modern-footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <span>LegalConnect</span><span>⚖️</span>
            </Link>
            <p className="footer-description">
              Your trusted partner in legal solutions. Connect with verified attorneys, 
              manage cases efficiently, and get expert legal advice when you need it most.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="newsletter-section">
              <h4 className="newsletter-title">Stay Updated</h4>
              <p className="newsletter-description">Get legal insights and updates delivered to your inbox.</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/lawyers">Find Lawyers</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/booking-management">My Bookings</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><Link to="/messaging">Messages</Link></li>
              <li><Link to="/documents">Document Center</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Legal Avenue, Colombo, Sri Lanka</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+94 11 234 5678</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@counsellink.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} LegalConnect. All rights reserved.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="legal-footer">
          <div className="container">
            <div className="legal-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
              <a href="/accessibility">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;