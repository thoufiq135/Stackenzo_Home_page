// Partners.jsx (Updated with scroll functionality)
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
    FaRobot,
    FaMicrochip,
    FaFlask,
    FaLightbulb,
    FaHandsHelping,
    FaRocket,
    FaArrowRight,
    FaQuoteLeft,
    FaSchool,
    FaUsers,
    FaChalkboardTeacher,
    FaCalendarAlt,
    FaCogs,
    FaHandshake,
} from 'react-icons/fa';
import { MdOutlineScience, MdOutlineHandshake } from 'react-icons/md';
import './Partners.css';

// Counter component for statistics
const Counter = ({ end, duration = 2, start = 0 }) => {
    const [count, setCount] = useState(start);
    const countRef = useRef(null);
    const isInView = useInView(countRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            let startTime;
            let animationFrame;

            const updateCount = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
                const currentCount = Math.floor(progress * (end - start) + start);
                setCount(currentCount);
                if (progress < 1) {
                    animationFrame = requestAnimationFrame(updateCount);
                }
            };

            animationFrame = requestAnimationFrame(updateCount);
            return () => cancelAnimationFrame(animationFrame);
        }
    }, [isInView, end, duration, start]);

    return <span ref={countRef}>{count.toLocaleString()}+</span>;
};

// Partner Logo Component
const PartnerLogo = ({ name, logo, index }) => {
    return (
        <motion.div
            className="partner-logo-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
        >
            <div className="logo-wrapper">
                <img src={logo} alt={name} className="partner-logo-img" />
            </div>
            <p className="partner-logo-name">{name}</p>
        </motion.div>
    );
};

// Impact Point Component
const ImpactPoint = ({ icon: Icon, title, delay }) => (
    <motion.div
        className="impact-chip"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05, backgroundColor: "var(--primary-light)", color: "#fff" }}
    >
        <Icon className="impact-chip-icon" />
        <span>{title}</span>
    </motion.div>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, author, role, delay }) => (
    <motion.div
        className="testimonial-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
    >
        <FaQuoteLeft className="testimonial-quote-icon" />
        <p className="testimonial-quote">"{quote}"</p>
        <p className="testimonial-author">— {author}</p>
        <p className="testimonial-role">{role}</p>
    </motion.div>
);

const Partners = () => {
    // Create a ref for the logos section
    const logosSectionRef = useRef(null);

    // Smooth scroll function
    const scrollToLogos = () => {
        logosSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const partners = [
        {
            name: "Simhapuri International School",
            logo: "/images/Partners/simhapuri logo.jpg"
        },
        {
            name: "Vidhyardhi School",
            logo: "/images/Partners/vidhyardhi logo.png"
        }
    ];

    const testimonials = [
        {
            quote: "Stackenzo has transformed the way our students engage with technology and innovation. The Robotics Lab has become the heartbeat of our school.",
            author: "Dr. Anjali Verma",
            // role: "Principal, Delhi Public School",
        },
        {
            quote: "The Robotic programs by Stackenzo are world-class. Our students are now thinking like creators, not just consumers. Highly recommended!",
            author: "Mr. Rajiv ",
            // role: "Director, Ryan International Group",
        },
        {
            quote: "Thanks to Stackenzo, we've established a future-ready STEM ecosystem that inspires young minds every day. A true game-changer.",
            author: "Ms. Priya ",
            // role: "Head of Innovation, Amity Schools",
        },
    ];

   const stats = [
    { icon: FaSchool, label: "Partner Institutions", value: 2 },
    { icon: FaHandshake, label: "Strategic Collaborations", value: 18},
    { icon: FaUsers, label: "Students Reached", value: 1000 },
    { icon: FaLightbulb, label: "Innovation Programs", value: 20 },
];

    const impactPoints = [
        { icon: FaRobot, title: "Robotics Labs" },
        { icon: MdOutlineScience, title: "STEM Education" },
        { icon: FaHandsHelping, title: "Hands-On Learning" },
    ];

    return (
        <div className="partners-page">
            <Navbar />
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg-gradient"></div>

                <div className="floating-elements">
                    <div className="floating-circle circle-1"></div>
                    <div className="floating-circle circle-2"></div>
                    <div className="floating-circle circle-3"></div>
                    <div className="floating-dots"></div>
                </div>

                <div className="container hero-container" style={{ minHeight: "100vh" }}>
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="partner-hero-label mt-5">
                            Our School Partnerships
                        </span>

                        <h1 className="hero-title">
                            Building Innovation Ecosystems Across Schools
                        </h1>

                        <p className="hero-subtitle">
                            Together with our partner institutions, we are creating hands-on
                            learning environments where students explore Robotics, Artificial
                            Intelligence, Coding, Design Thinking and Future Technologies
                            through practical experiences that inspire creativity, innovation
                            and problem-solving.
                        </p>

                        <motion.button
                            className="btn-primary hero-cta"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={scrollToLogos} // Add click handler
                        >
                            Explore Our Partners
                            <FaArrowRight className="btn-icon" />
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* Trust Section with Stats */}
            <section className="trust-section">
                <div className="container">
                    <motion.div
                        className="trust-statement"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <p className="trust-text">
                            "We proudly partner with educational institutions that believe in hands-on learning,
                            innovation, creativity and future-ready education."
                        </p>
                    </motion.div>

                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="stat-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <stat.icon className="stat-icon" />
                                <div className="stat-number">
                                    <Counter end={stat.value} duration={2} />
                                    {stat.suffix}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Logos Section - Added ref here */}
            <section ref={logosSectionRef} className="logos-section">
                <div className="container">
                    <motion.h2
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Schools We Collaborate With
                    </motion.h2>
                    <motion.p
                        className="section-subtitle"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Trusted by leading educational institutions across the country
                    </motion.p>
                    <div className="logos-grid">
                        {partners.map((partner, idx) => (
                            <PartnerLogo key={idx} {...partner} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Partnership Impact Section */}
            <section className="impact-section">
                <div className="container impact-container">
                    <div className="impact-left">
                        <motion.div
                            className="impact-illustration"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <img
                                src="https://i0.wp.com/briotouch.com/wp-content/uploads/2026/02/students-experimenting-with-technology-in-robotics-lab-for-schools.webp?fit=1024%2C1024&ssl=1"
                                alt="Students working on robotics"
                                className="impact-img"
                            />
                            <div className="illustration-overlay"></div>
                        </motion.div>
                    </div>
                    <div className="impact-right">
                        <motion.h2
                            className="impact-title"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Building Innovation Ecosystems in Schools
                        </motion.h2>
                        <motion.p
                            className="impact-description"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Through strategic collaborations, Stackenzo helps schools establish Robotics Labs,
                            AI Learning Programs, STEM Ecosystems and Project-Based Learning
                            environments that inspire students to become creators rather than consumers of
                            technology.
                        </motion.p>
                        <div className="impact-chips-grid">
                            {impactPoints.map((point, idx) => (
                                <ImpactPoint key={idx} {...point} delay={idx * 0.05} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <motion.h2
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        What Our Partners Say
                    </motion.h2>
                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, idx) => (
                            <TestimonialCard key={idx} {...testimonial} delay={idx * 0.1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Become a Partner CTA Section */}
            <section className="cta-section">
                <div className="cta-gradient-bg"></div>
                <div className="container cta-container">
                    <motion.div
                        className="cta-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="cta-title">Let's Build the Future Together</h2>
                        <p className="cta-description">
                            Partner with Stackenzo to bring Robotics, AI, Innovation and Future Skills programs
                            to your institution.
                        </p>
                        <div className="cta-buttons">
                            <motion.button
                                className="btn-primary cta-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Become a Partner <FaArrowRight className="btn-icon" />
                            </motion.button>
                            <motion.button
                                className="btn-secondary cta-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Contact Us
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Partners;