// SundayRobotics.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SundayRobotics.css';
import robotGif from "./assets/robot.gif";

const SundayRobotics = () => {
  const navigate = useNavigate();
  
  // State Management
  const [showModal, setShowModal] = useState(true);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [formData, setFormData] = useState({
    Name: '',        // Changed from studentName to match backend
    ParentName: '',  // Changed from parentName to match backend
    mobile_no: '',   // Changed from phone to match backend
    email: '',
    School: '',      // Changed from school to match backend
    Class: '',       // Changed from grade to match backend
    des: '',         // Changed from message to match backend
    q_A: ''          // Added missing field that backend requires
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countersStarted, setCountersStarted] = useState(false);

  // Refs for scroll reveal
  const revealRefs = useRef([]);
  
  // Stats data
  const stats = [
    { target: 1580, label: 'Student Projects' },
    { target: 320, label: 'Robotics Kits' },
    { target: 42, label: 'Innovation Awards' },
    { target: 12, label: 'Expert Mentors' }
  ];

  // Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollWidth(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto close modal after 5 seconds
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setShowModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Counter Animation
  useEffect(() => {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            setCountersStarted(true);
            const counters = document.querySelectorAll('.sr-stat-num');
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute('data-target'), 10);
              const duration = 2000;
              const step = target / (duration / 16);
              let current = 0;
              const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                  counter.textContent = target + '+';
                  clearInterval(timer);
                } else {
                  counter.textContent = Math.floor(current) + '+';
                }
              }, 16);
            });
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsRow = document.querySelector('.sr-stats-row');
    if (statsRow) counterObserver.observe(statsRow);

    return () => counterObserver.disconnect();
  }, [countersStarted]);

  // Form Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showErrorMsg = (msg) => {
    setErrorMessage(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  const showSuccessMsg = (msg) => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // Submit Registration
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.Name || !formData.ParentName || !formData.mobile_no) {
      showErrorMsg("Please fill all required fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile_no)) {
      showErrorMsg("Enter a valid 10 digit mobile number");
      return;
    }

    // Add a default value for q_A if not provided
    const submissionData = {
      ...formData,
      q_A: formData.q_A || "No specific query"
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://innovation-club-delta.vercel.app/api/addData/innovationClub",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData)
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.message === "Form submitted successfully") {
        setFormData({
          Name: '',
          ParentName: '',
          mobile_no: '',
          email: '',
          School: '',
          Class: '',
          des: '',
          q_A: ''
        });
        
        showSuccessMsg("✅ Registration submitted successfully! Our team will contact you shortly.");
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      showErrorMsg(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate back to home
  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="sr-container">
      {/* Scroll Progress Bar */}
      <div className="sr-scroll-bar" style={{ width: `${scrollWidth}%` }}></div>

      {/* Background Elements */}
      <div className="sr-grid-bg"></div>
      <div className="sr-orb sr-orb-1"></div>
      <div className="sr-orb sr-orb-2"></div>
      <div className="sr-orb sr-orb-3"></div>

      {/* Walking Robot */}
      <div className="sr-robot-walker">
        <div className="sr-robot-speech">
          🤖 Welcome to Stackenzo Innovation & AI Academy!<br />
          🚀 Let's Learn, Build, Inspire Together!
        </div>
        <img
          className="sr-robot-img"
          src={robotGif}
          alt="Robot"
          style={{
            width: "200px",
            height: "200px",
            display: "block",
            zIndex: 9999
          }}
        />
      </div>

      {/* Ad Modal */}
      {showModal && (
        <div className="sr-modal-overlay">
          <div className="sr-modal-box">
            <button className="sr-modal-close" onClick={() => setShowModal(false)}>✕</button>
            <i className="fas fa-microchip sr-modal-icon"></i>
            <h2 className="sr-modal-title">BUILD THE <span className="sr-grad">FUTURE</span></h2>
            <p className="sr-modal-sub">Admissions Open — Stackenzo Innovation & AI Academy</p>
            <div className="sr-modal-badge sr-animate-pulse">⚠ Limited Seats Available</div>
            <div className="sr-modal-actions">
              <a href="#sr-register" className="sr-btn-primary" onClick={() => setShowModal(false)}>Register Now →</a>
              <button className="sr-btn-ghost" onClick={() => setShowModal(false)}>Explore Program</button>
            </div>
            <p className="sr-modal-note">⚡ Early bird discount closing soon</p>
          </div>
        </div>
      )}

      {/* Navbar with Back Button */}
      <nav className="sr-navbar">
        <div className="sr-nav-left">
          <button onClick={goToHome} className="sr-back-btn" aria-label="Back to Home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
        <ul className="sr-nav-links">
          <li><a href="#sr-why">Why Us</a></li>
          <li><a href="#sr-roadmap">Curriculum</a></li>
          <li><a href="#sr-testimonials">Reviews</a></li>
          <li><a href="#sr-register">Register</a></li>
        </ul>
        <a href="#sr-register" className="sr-nav-cta">Register Now</a>
      </nav>

      {/* Sticky CTA */}
      <a href="#sr-register" className="sr-sticky-cta">
        <i className="fas fa-microchip"></i> Register Now
      </a>

      {/* Hero Section */}
      <section id="sr-hero" className="sr-hero">
        <div className="sr-hero-content">
          <div className="sr-hero-eyebrow"> Robotics · AI · Innovation · 2026</div>
          <h1 className="sr-hero-title">
            STACKENZO<br />
            <span className="sr-grad">INNOVATION</span><br />
            &amp; AI ACADEMY
          </h1>
          <p className="sr-hero-sub">
            Helping students become future innovators, creators &amp; technology leaders — through hands-on building.
          </p>
          <div className="sr-hero-actions">
            <a href="#sr-register" className="sr-btn-primary">Reserve Your Seat →</a>
            <a href="#sr-why" className="sr-btn-ghost">Explore Program</a>
          </div>

          <div className="sr-stats-row">
            {stats.map((stat, idx) => (
              <div className="sr-stat-item" key={idx}>
                <div className="sr-stat-num" data-target={stat.target}>0</div>
                <div className="sr-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Club Section */}
      <section className="innovation-section">
        <div className="sr-container">
          <span className="sr-section-tag">Stackenzo Programs</span>
          <h2 className="sr-section-title">
            STACKENZO
            <span className="sr-grad"> INNOVATION CLUB</span>
          </h2>
          <p className="innovation-description">
            Stackenzo Innovation Club is a flagship learning initiative under Stackenzo.
            Students gain practical exposure in:
          </p>
          <ul className="innovation-list">
            <li><i className="fas fa-robot"></i> Robotics</li>
            <li><i className="fas fa-brain"></i> Artificial Intelligence</li>
            <li><i className="fas fa-wifi"></i> IoT</li>
            <li><i className="fas fa-microchip"></i> Arduino Programming</li>
            <li><i className="fas fa-microchip"></i> ESP32 Development</li>
            <li><i className="fas fa-lightbulb"></i> Innovation Projects</li>
          </ul>
        </div>
      </section>

      {/* Why Section */}
      <section id="sr-why" className="sr-why">
        <div className="sr-why-grid sr-reveal" ref={(el) => revealRefs.current[0] = el}>
          <div className="sr-why-text">
            <span className="sr-section-tag"> Why Choose Us</span>
            <h2 className="sr-section-title">WHERE STUDENTS <span className="sr-grad">BUILD,</span> NOT JUST LEARN</h2>
            <p>
              Technology is shaping every industry. Robotics, AI, IoT and Automation are becoming essential skills. 
              STACKENZO Robotics helps students move beyond screens — they build real electronics, write real code, 
              and create real solutions.
            </p>
          </div>
          <div className="sr-features-grid">
            <div className="sr-feat-card">
              <span className="sr-feat-icon">⚙️</span>
              <h3>Hands-on Learning</h3>
              <p>Build robots from scratch, wire sensors, program logic — every session is practical.</p>
            </div>
            <div className="sr-feat-card">
              <span className="sr-feat-icon">🧠</span>
              <h3>AI &amp; Automation</h3>
              <p>Computer vision, smart assistants &amp; real AI projects using Python and OpenCV.</p>
            </div>
            <div className="sr-feat-card">
              <span className="sr-feat-icon">📡</span>
              <h3>IoT &amp; Wireless</h3>
              <p>ESP32, cloud monitoring, Blynk dashboards &amp; smart home systems.</p>
            </div>
            <div className="sr-feat-card">
              <span className="sr-feat-icon">🚀</span>
              <h3>Innovation Mindset</h3>
              <p>From idea to prototype — students invent, test, and present like engineers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="sr-compare" className="sr-compare">
        <div className="sr-compare-inner">
          <div className="sr-reveal" ref={(el) => revealRefs.current[1] = el}>
            <span className="sr-section-tag"> The Difference</span>
            <h3 className="sr-section-title">SCHOOL <span className="sr-grad">VS</span> STACKENZO INNOVATION ACADEMY</h3>
          </div>
          <div className="sr-compare-grid sr-reveal" ref={(el) => revealRefs.current[2] = el}>
            <div className="sr-comp-card sr-comp-plain">
              <h3>🏫 School Robotics Programs</h3>
              <ul>
                <li>Technology awareness &amp; STEM basics</li>
                <li>Classroom-only activities</li>
                <li>Introduction to coding concepts</li>
                <li>Limited hands-on building</li>
              </ul>
            </div>
            <div className="sr-comp-card sr-comp-featured">
              <h3>🚀 Sunday Robotics &amp; AI Academy</h3>
              <ul>
                <li>Advanced practical robot building</li>
                <li>Real innovation project from day one</li>
                <li>Multi-sensor integration &amp; IoT</li>
                <li>AI, Computer Vision &amp; automation</li>
                <li>Competitions, challenges &amp; showcases</li>
              </ul>
            </div>
          </div>
          <p className="sr-comp-footer sr-reveal" ref={(el) => revealRefs.current[3] = el}>
            School programs help students understand technology. <strong>Sunday Academy helps students build and innovate with technology.</strong>
          </p>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="sr-roadmap" className="sr-roadmap">
        <div className="sr-reveal" ref={(el) => revealRefs.current[4] = el}>
          <span className="sr-section-tag"> Curriculum Roadmap</span>
          <h2 className="sr-section-title">WHAT STUDENTS <span className="sr-grad">MASTER</span></h2>
        </div>
        <div className="sr-roadmap-list sr-reveal" ref={(el) => revealRefs.current[5] = el}>
          <div className="sr-road-item">
            <div className="sr-road-dot">L01</div>
            <div className="sr-road-content">
              <h4>Electronics, Arduino &amp; Sensors</h4>
              <p>Foundations — LEDs, motors, ultrasonic, IR sensors, servo control &amp; basics of robotics engineering.</p>
            </div>
          </div>
          <div className="sr-road-item">
            <div className="sr-road-dot">L02</div>
            <div className="sr-road-content">
              <h4>Smart Systems &amp; Automation</h4>
              <p>Advanced Arduino, Bluetooth control, line followers, automated systems &amp; full smart projects.</p>
            </div>
          </div>
          <div className="sr-road-item">
            <div className="sr-road-dot">L03</div>
            <div className="sr-road-content">
              <h4>ESP32, Wireless &amp; IoT</h4>
              <p>Wi-Fi controlled robotics, real-time monitoring dashboards, cloud integration &amp; Blynk.</p>
            </div>
          </div>
          <div className="sr-road-item">
            <div className="sr-road-dot">L04</div>
            <div className="sr-road-content">
              <h4>Artificial Intelligence &amp; Computer Vision</h4>
              <p>AI models, object detection, smart robots, Python &amp; full innovation project showcase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="sr-skills" className="sr-skills">
        <div className="sr-reveal" ref={(el) => revealRefs.current[6] = el}>
          <span className="sr-section-tag"> Skills You Gain</span>
          <h2 className="sr-section-title">WHY ROBOTICS <span className="sr-grad">MATTERS</span></h2>
        </div>
        <div className="sr-skills-grid sr-reveal" ref={(el) => revealRefs.current[7] = el}>
          <div className="sr-skill-tile"><i className="fas fa-code"></i><span>Logical Thinking</span></div>
          <div className="sr-skill-tile"><i className="fas fa-paintbrush"></i><span>Creativity</span></div>
          <div className="sr-skill-tile"><i className="fas fa-puzzle-piece"></i><span>Problem Solving</span></div>
          <div className="sr-skill-tile"><i className="fas fa-smile"></i><span>Confidence</span></div>
          <div className="sr-skill-tile"><i className="fas fa-lightbulb"></i><span>Innovation Mindset</span></div>
        </div>
      </section>

      {/* Promise Section */}
      <section id="sr-promise" className="sr-promise">
        <div className="sr-reveal" ref={(el) => revealRefs.current[8] = el}>
          <span className="sr-section-tag">Our Commitment</span>
          <h2 className="sr-section-title">OUR <span className="sr-grad">PROMISE</span></h2>
        </div>
        <div className="sr-promise-card sr-reveal" ref={(el) => revealRefs.current[9] = el}>
          <p>
            We don't just teach how to build robots. We help students learn how to think, create, solve problems 
            and turn ideas into real-world solutions. Every student leaves with the ability to think logically, 
            build confidently and master future technologies.
          </p>
          <blockquote>
            "Because the future will belong not only to those who use technology — but to those who can build it."
          </blockquote>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="sr-gallery" className="sr-gallery">
        <div className="sr-reveal" ref={(el) => (revealRefs.current[10] = el)}>
          <span className="sr-section-tag">Student Projects</span>
          <h2 className="sr-section-title">
            INNOVATION <span className="sr-grad">GALLERY</span>
          </h2>
        </div>

        <div className="sr-gallery-grid sr-reveal" ref={(el) => (revealRefs.current[11] = el)}>
          <div className="sr-gallery-tile">
            <img
              src="/images/ai-1.jpg"
              alt="AI Rover"
              className="sr-gallery-img"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                objectPosition: "center"
              }}
            />
            <div className="sr-gallery-content">
              <h3>AI Rover</h3>
              <p>Autonomous navigation using ultrasonic & IR sensors</p>
            </div>
          </div>

          <div className="sr-gallery-tile">
            <img
              src="https://iotdesignpro.com/sites/default/files/2019-06/IoT-Wireless-Weather-Station-using-Arduino-ESP8266-and-ThingSpeak.jpg"
              alt="IoT Weather Station"
              className="sr-gallery-img"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                objectPosition: "center"
              }}
            />
            <div className="sr-gallery-content">
              <h3>IoT Weather Station</h3>
              <p>Real-time cloud monitoring with ESP32 & Blynk</p>
            </div>
          </div>

          <div className="sr-gallery-tile">
            <img
              src="https://rpi-magazines.s3-eu-west-1.amazonaws.com/magpi/legacy-assets/2016/01/step3.jpg"
              alt="Smart Mirror"
              className="sr-gallery-img"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                objectPosition: "center"
              }}
            />
            <div className="sr-gallery-content">
              <h3>Smart Mirror</h3>
              <p>Face recognition & display dashboard with Raspberry Pi</p>
            </div>
          </div>

          <div className="sr-gallery-tile">
            <img
              src="https://m.media-amazon.com/images/I/71XlrnunuyL.jpg"
              alt="Robotic Arm"
              className="sr-gallery-img"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                objectPosition: "center"
              }}
            />
            <div className="sr-gallery-content">
              <h3>Robotic Arm</h3>
              <p>Servo-controlled arm with Bluetooth remote operation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="sr-testimonials" className="sr-testimonials">
        <div className="sr-reveal" ref={(el) => revealRefs.current[12] = el}>
          <span className="sr-section-tag"> Reviews</span>
          <h2 className="sr-section-title">WHAT THEY <span className="sr-grad">SAY</span></h2>
        </div>
        <div className="sr-testi-grid sr-reveal" ref={(el) => revealRefs.current[13] = el}>
          <div className="sr-testi-card">
            <div className="sr-stars">★★★★★</div>
            <p>"My son built a smart irrigation system in just 8 weeks. Sunday Robotics completely changed his perspective on technology."</p>
            <div className="sr-testi-name">Aditya Sharma</div>
            <div className="sr-testi-role">Parent</div>
          </div>
          <div className="sr-testi-card">
            <div className="sr-stars">★★★★★</div>
            <p>"Best decision ever. The teachers are genuinely passionate and every single project is real-world and meaningful."</p>
            <div className="sr-testi-name">Mrs. Priya</div>
            <div className="sr-testi-role">Mother of Grade 7 student</div>
          </div>
          <div className="sr-testi-card">
            <div className="sr-stars">★★★★★</div>
            <p>"I learnt Arduino &amp; AI here. Now I want to become a robotics engineer. This academy is the best thing that happened to me."</p>
            <div className="sr-testi-name">Rohan M.</div>
            <div className="sr-testi-role">Student, Age 14</div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="sr-register" className="sr-register">
        <div className="sr-form-card sr-reveal" ref={(el) => revealRefs.current[14] = el}>
          <div className="sr-form-header">
            <span className="sr-section-tag"> Admissions Open</span>
            <h2 className="sr-section-title">RESERVE YOUR <span className="sr-grad">SEAT</span></h2>
            <div className="sr-form-badge sr-animate-pulse">⚠ Limited Seats — Register Now</div>
          </div>

          {showSuccess && (
            <div className="sr-flash sr-flash-success">✅ Registration submitted successfully! Our team will contact you shortly.</div>
          )}
          {showError && (
            <div className="sr-flash sr-flash-error">❌ {errorMessage}</div>
          )}

          <form onSubmit={handleRegistrationSubmit}>
            <div className="sr-form-grid">
              <input
                className="sr-input"
                name="Name"
                placeholder="Student Name *"
                type="text"
                required
                value={formData.Name}
                onChange={handleChange}
              />
              <input
                className="sr-input"
                name="ParentName"
                placeholder="Parent Name *"
                type="text"
                required
                value={formData.ParentName}
                onChange={handleChange}
              />
              <input
                className="sr-input"
                name="mobile_no"
                placeholder="Phone Number *"
                type="tel"
                required
                value={formData.mobile_no}
                onChange={handleChange}
              />
              <input
                className="sr-input"
                name="email"
                placeholder="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                className="sr-input"
                name="School"
                placeholder="School Name"
                type="text"
                value={formData.School}
                onChange={handleChange}
              />
              <input
                className="sr-input"
                name="Class"
                placeholder="Grade / Class"
                type="text"
                value={formData.Class}
                onChange={handleChange}
              />
              <textarea
                className="sr-input"
                name="des"
                placeholder="Message / Query (optional)"
                rows="3"
                value={formData.des}
                onChange={handleChange}
              ></textarea>
              <input
                className="sr-input"
                name="q_A"
                placeholder="Any specific question? (optional)"
                type="text"
                value={formData.q_A}
                onChange={handleChange}
              />
              <button type="submit" className="sr-form-submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Register Now →"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <style>{`
        @keyframes srSpin {
          to { transform: rotate(360deg); }
        }
        .sr-form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SundayRobotics;