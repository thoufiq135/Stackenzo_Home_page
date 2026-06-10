import './Stackenzo.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaRocket,
    FaLightbulb,
    FaTools,
    FaUsers,
    FaBrain,
    FaTrophy,
    FaRobot,
    FaCogs,
    FaMicrochip,
    FaSchool,
    FaWrench,
    FaMedal,
    FaPhoneAlt,
    FaGlobe,
    FaArrowLeft,
    FaEnvelope,
} from "react-icons/fa";

import {
    MdEngineering,
    MdScience,
    MdOutlineAutoAwesome,
    MdEmail,
    MdLocationOn,
    MdSchool,
} from "react-icons/md";

import { GiRobotGolem, GiArchiveResearch } from "react-icons/gi";
import { SiFuturelearn } from "react-icons/si";
import { IoSchoolOutline } from "react-icons/io5";
import { TbBrain, TbBulb } from "react-icons/tb";
import { BiNetworkChart } from "react-icons/bi";

export default function StackenzoLanding() {
    const navigate = useNavigate();
    
    // Backend API URL
    const API_URL = "https://boot-camp-red.vercel.app/api/addData/innovationClub";
    
    // Form state with field names matching backend schema
    const [formData, setFormData] = useState({
        school_name: '',      // matches backend: school_name
        emai_id: '',          // matches backend: emai_id
        phone_number: '',     // matches backend: phone_number
        school_address: '',   // matches backend: school_address
        area: '',             // matches backend: area
        district: '',         // matches backend: district
        description: '',      // matches backend: description
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        setMessageType('');

        // Validate required fields
        if (!formData.school_name || !formData.emai_id || !formData.phone_number || 
            !formData.school_address || !formData.area || !formData.description) {
            setSubmitMessage('❌ Please fill all required fields');
            setMessageType('error');
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(''), 5000);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.emai_id)) {
            setSubmitMessage('❌ Please enter a valid email address');
            setMessageType('error');
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(''), 5000);
            return;
        }

        // Validate phone number (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            setSubmitMessage('❌ Please enter a valid 10-digit phone number');
            setMessageType('error');
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(''), 5000);
            return;
        }

        try {
            const requestBody = {
                school_name: formData.school_name,
                emai_id: formData.emai_id,
                phone_number: formData.phone_number,
                school_address: formData.school_address,
                area: formData.area,
                district: formData.district || "pending",
                description: formData.description,
            };

            // console.log("Sending data to backend:", requestBody);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            // console.log("Response from backend:", data);
            
            if (response.ok && data.message === "Form submitted successfully") {
                setSubmitMessage('✅ Registration submitted successfully! Our team will contact you shortly.');
                setMessageType('success');
                // Reset form
                setFormData({
                    school_name: '',
                    emai_id: '',
                    phone_number: '',
                    school_address: '',
                    area: '',
                    district: '',
                    description: '',
                });
                setTimeout(() => setSubmitMessage(''), 5000);
            } else {
                throw new Error(data.message || "Registration failed");
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                setSubmitMessage('❌ Unable to connect to server. Please try again later.');
            } else {
                setSubmitMessage(`❌ ${error.message || 'Something went wrong. Please try again.'}`);
            }
            setMessageType('error');
            setTimeout(() => setSubmitMessage(''), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="stackenzo-container">
            {/* ── Nav ── */}
            <nav className="nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="back-button"
                        aria-label="Go back"
                    >
                        <FaArrowLeft />
                    </button>
                </div>
                <ul className="nav-links">
                    <li><a href="#about">About</a></li>
                    <li><a href="#programs">Programs</a></li>
                    <li><a href="#register">Register</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <a href="#register" className="nav-cta">Partner With Us</a>
            </nav>

            {/* ── Hero Section ── */}
            <section className="hero">
                <div className="hero-eyebrow">Dream. Design. Deploy.</div>

                <h1>
                    Stackenzo <span className="accent">Bootcamp</span><br />
                </h1>
                <p className="hero-sub">At Stackenzo, we believe every student has the potential to become an innovator.</p>
                <p className="hero-body">
                    The challenge is not a lack of talent. The challenge is a lack of exposure, guidance, 
                    and opportunities to build real-world skills.
                </p>
                <p className="hero-body" style={{ marginTop: '1rem', fontWeight: '500' }}>
                    Our mission is to bridge the gap between classroom learning and future technologies 
                    through hands-on experiences in Robotics, Artificial Intelligence, Electronics, 
                    Innovation, and Emerging Technologies.
                </p>
                <p className="hero-body" style={{ marginTop: '1rem', color: 'var(--cyan)' }}>
                    We help students dream big, design solutions, and deploy their ideas into reality.
                </p>

                {/* Signature Pipeline */}
                <div className="ddd-pipeline">
                    <div className="ddd-node">
                        <div className="ddd-circle"><FaLightbulb className="icon" size={28} /></div>
                        <span className="ddd-label">Dream</span>
                    </div>
                    <div className="ddd-connector" />
                    <div className="ddd-node">
                        <div className="ddd-circle"><FaTools className="icon" size={28} /></div>
                        <span className="ddd-label">Design</span>
                    </div>
                    <div className="ddd-connector" />
                    <div className="ddd-node">
                        <div className="ddd-circle"><FaRocket className="icon" size={28} /></div>
                        <span className="ddd-label">Deploy</span>
                    </div>
                </div>

                <div className="hero-actions">
                    <a href="#bootcamp" className="btn-primary">Explore Future Technologies</a>
                    <a href="#programs" className="btn-ghost">Build Real Skills</a>
                    <a href="#impact" className="btn-ghost">Create Real Impact</a>
                </div>
            </section>

            {/* ── About Stackenzo Section ── */}
            <section className="section section-mid" id="about">
                <div className="about-grid">
                    <div className="about-text">
                        <p className="section-eyebrow">About Stackenzo</p>
                        <h2 className="section-title">
                            More Than Learning.<br />
                            Building Future <span className="accent">Innovators</span>
                        </h2>
                        <p className="section-body">
                            Stackenzo equips students with the knowledge, mindset, and practical skills 
                            to thrive in a world shaped by AI, Robotics, Automation, IoT, and emerging technologies.
                        </p>
                        <p className="section-body" style={{ marginTop: '1rem' }}>
                            Traditional learning focuses on theory, leaving students with limited real-world exposure. 
                            <strong style={{ color: '#fb9434c9' }}> Stackenzo bridges this gap</strong> through hands-on experiences in 
                            workshops, bootcamps, and innovation programs.
                        </p>
                        <p className="section-body" style={{ marginTop: '1rem' }}>
                            Every program cultivates curiosity, critical thinking, creativity, and problem-solving — 
                            empowering young minds to become confident innovators and future-ready leaders.
                        </p>
                        <p className="section-body" style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--cyan)' }}>
                            Technology is our medium. Innovation is our goal. Impact is our purpose.
                        </p>
                    </div>
                    <div className="about-highlights">
                        {[
                            {
                                icon: <FaRobot size={24} />,
                                title: 'Hands-On Technology',
                                body: 'Direct interaction with AI, Robotics, and Electronics — not just slides.',
                            },
                            {
                                icon: <TbBulb size={24} />,
                                title: 'Curiosity-First Learning',
                                body: 'Igniting wonder before teaching concepts for intrinsic motivation.',
                            },
                            {
                                icon: <FaUsers size={24} />,
                                title: 'Real-World Skills',
                                body: 'Building creativity, teamwork, and problem-solving abilities.',
                            },
                            {
                                icon: <IoSchoolOutline size={24} />,
                                title: 'School Partnership Model',
                                body: 'Future-tech education delivered directly to schools, accessible everywhere.',
                            },
                        ].map((h) => (
                            <div key={h.title} className="highlight-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--cyan)' }}>{h.icon}</span>
                                    <h4 style={{ marginBottom: 0 }}>{h.title}</h4>
                                </div>
                                <p>{h.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── The Problem We Are Solving ── */}
            <section className="section" id="problem">
                <div className="problem-section">
                    <p className="section-eyebrow">The Problem We Are Solving</p>
                    <h2 className="section-title">Bridging the Gap Between<br />Education and Innovation</h2>
                    <p className="section-body" style={{ margin: '1rem auto 2rem', textAlign: 'center' }}>
                        Across schools, students learn mathematics, science, and technology concepts every day.
                        However, many struggle to answer:
                    </p>

                    <div className="problem-grid">
                        <div className="questions-list">
                            {[
                                [<BiNetworkChart size={20} />, 'Where are classroom concepts actually used?'],
                                [<FaRobot size={20} />, 'How are robots designed and built?'],
                                [<FaBrain size={20} />, 'How does Artificial Intelligence really work?'],
                                [<FaGlobe size={20} />, 'How can technology solve real-world problems?'],
                                [<SiFuturelearn size={20} />, 'What careers exist beyond traditional paths?'],
                            ].map(([icon, q]) => (
                                <div key={q} className="question-item">
                                    <span className="question-icon" style={{ color: 'var(--cyan)' }}>{icon}</span>
                                    <span>{q}</span>
                                </div>
                            ))}
                        </div>

                        <div className="problem-outcome">
                            <h3>The Result: A Gap Between Learning and Application</h3>
                            <p>
                                Students understand theory but rarely get opportunities to explore innovation.
                                They complete years of STEM education without ever prototyping a solution,
                                programming a robot, or seeing AI in action.
                            </p>
                            <p>
                                This gap doesn't just limit curiosity — it limits the futures students
                                can imagine for themselves.
                            </p>
                            <span className="solution-pill">Stackenzo bridges this gap</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Our Approach: Dream. Design. Deploy. ── */}
            <section className="section section-mid" id="approach">
                <div className="ddd-section">
                    <p className="section-eyebrow">Our Approach</p>
                    <h2 className="section-title">Dream. Design. Deploy.</h2>

                    <div className="ddd-cards">
                        {[
                            {
                                num: '01',
                                title: 'Dream',
                                icon: <FaLightbulb size={40} />,
                                headline: 'Every innovation starts with an idea.',
                                body: 'We encourage students to think beyond limitations, explore possibilities, and develop curiosity about the world around them. Students learn to identify problems and imagine solutions.',
                            },
                            {
                                num: '02',
                                title: 'Design',
                                icon: <FaTools size={40} />,
                                headline: 'Ideas become meaningful when transformed into solutions.',
                                body: 'Students learn the fundamentals of design thinking, creativity, logical reasoning, and technology-driven problem solving. They begin understanding how technology can be used to create real-world impact.',
                            },
                            {
                                num: '03',
                                title: 'Deploy',
                                icon: <FaRocket size={40} />,
                                headline: 'Innovation becomes powerful when it reaches the real world.',
                                body: 'Students gain exposure to prototyping, demonstrations, presentations, and implementation. They learn how ideas move from imagination to execution.',
                            },
                        ].map((c) => (
                            <div key={c.title} className="ddd-card">
                                <div className="ddd-card-num">{c.num}</div>
                                <div style={{ color: 'var(--cyan)', marginBottom: '0.75rem' }}>{c.icon}</div>
                                <div className="ddd-card-title">{c.title}</div>
                                <div className="ddd-card-headline">{c.headline}</div>
                                <p>{c.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── AI + Robotics Bootcamp ── */}
            <section className="section" id="bootcamp">
                <div className="bootcamp-section">
                    <p className="section-eyebrow">Flagship Program</p>
                    <h2 className="section-title">AI + Robotics Bootcamp</h2>
                    <p className="section-body" style={{ margin: '0 auto 1rem', textAlign: 'center', maxWidth: '700px' }}>
                        Introducing Future Technologies to School Students
                    </p>
                    <p className="section-body" style={{ margin: '0 auto 2rem', textAlign: 'center', maxWidth: '700px' }}>
                        Our AI + Robotics Bootcamp is a 3-day immersive experience designed for students 
                        from Classes 6th to 9th.
                    </p>

                    <div className="bootcamp-header">
                        <div>
                            <p className="section-body" style={{ fontWeight: '600', marginBottom: '1rem' }}>
                                The bootcamp introduces students to:
                            </p>
                            <div className="bootcamp-tags">
                                {['Artificial Intelligence', 'Robotics', 'Electronics', 'Sensors', 'Automation', 'Coding Concepts', 'Innovation Challenges', 'Future Technologies'].map((t) => (
                                    <span key={t} className="tag">{t}</span>
                                ))}
                            </div>
                            <p className="section-body" style={{ marginTop: '1.5rem', fontStyle: 'italic' }}>
                                The objective is simple: Make technology exciting, accessible, and understandable.
                            </p>
                        </div>
                        <div className="bootcamp-badge">
                            <div className="big-num">3</div>
                            <div className="big-label">Day Immersive Experience</div>
                            <div className="grade-info">Designed for Classes 6th – 9th</div>
                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(232, 69, 10, 0.15)', paddingTop: '1.25rem' }}>
                                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Delivered directly at your school</p>
                            </div>
                        </div>
                    </div>

                    <h3 className="section-title" style={{ fontSize: '1.8rem', textAlign: 'center', marginTop: '4rem' }}>
                        The 3-Day Journey
                    </h3>

                    <div className="day-cards">
                        {[
                            {
                                day: 'Day 1',
                                title: 'Dream',
                                icon: <FaLightbulb size={32} />,
                                subtitle: 'Discover the Future',
                                topics: ['What is Artificial Intelligence?', 'What is Robotics?', 'How Robots Work', 'Real-World Applications', 'Future Technology Trends', 'Live Demonstrations'],
                                outcome: "Students develop curiosity and begin imagining what's possible.",
                            },
                            {
                                day: 'Day 2',
                                title: 'Design',
                                icon: <FaTools size={32} />,
                                subtitle: 'Learn How Technology Works',
                                topics: ['Electronics Fundamentals', 'Sensors & Smart Systems', 'Introduction to Coding', 'Automation Concepts', 'AI Applications in Action'],
                                outcome: 'Students understand the building blocks behind intelligent technologies.',
                            },
                            {
                                day: 'Day 3',
                                title: 'Deploy',
                                icon: <FaRocket size={32} />,
                                subtitle: 'Create, Collaborate & Innovate',
                                topics: ['Team Challenges', 'Problem Solving Activities', 'Innovation Exercises', 'Technology Showcases', 'Idea Presentations'],
                                outcome: 'Students gain confidence in turning ideas into solutions.',
                            },
                        ].map((d) => (
                            <div key={d.day} className="day-card">
                                <div className="day-card-header">
                                    <div className="day-num">{d.day}</div>
                                    <div style={{ marginBottom: '8px' }}>{d.icon}</div>
                                    <h3 style={{color:"#fdc33d"}}>{d.title}</h3>
                                    <div className="day-subtitle">{d.subtitle}</div>
                                </div>
                                <div className="day-card-body">
                                    <ul className="day-topics">
                                        {d.topics.map((t) => <li key={t}>{t}</li>)}
                                    </ul>
                                    <div className="day-outcome">
                                        <strong style={{ color: '#E8450A', fontSize: '0.75rem', letterSpacing: '0.05em' }}>OUTCOME — </strong>
                                        {d.outcome}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why Schools Partner with Stackenzo ── */}
            <section className="section section-light" id="why">
                <div className="why-schools-section">
                    <p className="section-eyebrow">Why Partner</p>
                    <h2 className="section-title" style={{ color: '#0A0F1E' }}>Why Schools Partner with Stackenzo</h2>

                    <div className="reasons-grid">
                        {[
                            { icon: <FaGlobe size={32} />, title: 'Industry-Relevant Learning', body: "Students gain exposure to the technologies that are actively shaping tomorrow's workforce and industries." },
                            { icon: <FaTools size={32} />, title: 'Hands-On Experiences', body: 'Learning becomes engaging, interactive, and genuinely memorable — students do, not just watch.' },
                            { icon: <MdScience size={32} />, title: 'STEM-Focused Programs', body: 'Programs are built to support and deepen practical learning in science, technology, engineering, and mathematics.' },
                            { icon: <FaLightbulb size={32} />, title: 'Innovation Culture', body: "Students are empowered to think creatively, challenge assumptions, and approach problems with a builder's mindset." },
                            { icon: <SiFuturelearn size={32} />, title: 'Future Readiness', body: "Students develop the skills, confidence, and awareness needed to thrive in tomorrow's technology-driven careers." },
                            { icon: <IoSchoolOutline size={32} />, title: 'Turnkey School Delivery', body: 'We handle everything — from setup to facilitation. Schools simply open their doors and students do the rest.' },
                        ].map((r) => (
                            <div key={r.title} className="reason-card">
                                <span className="reason-icon" style={{ color: 'var(--cyan)' }}>{r.icon}</span>
                                <h3>{r.title}</h3>
                                <p>{r.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Student Impact ── */}
            <section className="section" id="impact">
                <div className="impact-section">
                    <p className="section-eyebrow">Student Impact</p>
                    <h2 className="section-title">What Students Gain</h2>
                    <p className="section-body" style={{ margin: '0 auto 0' }}>
                        Our programs help students grow far beyond technical knowledge.
                    </p>

                    <div className="impact-grid">
                        {[
                            { icon: <FaRocket size={28} />, label: "Think Creatively" },
                            { icon: <FaLightbulb size={28} />, label: "Build Confidence" },
                            { icon: <FaTools size={28} />, label: "Improve Problem-Solving" },
                            { icon: <GiRobotGolem size={28} />, label: "Develop Teamwork" },
                            { icon: <MdScience size={28} />, label: "Explore Technology" },
                            { icon: <FaUsers size={28} />, label: "Understand Innovation" },
                            { icon: <FaBrain size={28} />, label: "Discover Career Opportunities" },
                            { icon: <MdEngineering size={28} />, label: "Critical Thinking" },
                            { icon: <GiArchiveResearch size={28} />, label: "Research Mindset" },
                            { icon: <MdOutlineAutoAwesome size={28} />, label: "Creative Expression" },
                            { icon: <FaTrophy size={28} />, label: "Future Ready Skills" },
                            { icon: <SiFuturelearn size={28} />, label: "Lifelong Learning" },
                        ].map((item) => (
                            <div key={item.label} className="impact-chip">
                                <span className="imp-icon" style={{ color: 'var(--cyan)' }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <p className="impact-cta" style={{ marginTop: "2.5rem", textAlign: "center" }}>
                        Most importantly, students begin seeing themselves as{" "}
                        <strong>creators</strong> rather than consumers of technology.
                    </p>
                </div>
            </section>

            {/* ── Our Programs ── */}
            <section className="section section-mid" id="programs">
                <div className="programs-section">
                    <p className="section-eyebrow">All Programs</p>
                    <h2 className="section-title">Our Programs</h2>

                    <div className="programs-grid">
                        {[
                            { icon: <FaRobot size={32} />, name: 'AI + Robotics Bootcamp', desc: '3-Day School Awareness Program — A fully immersive introduction to AI and Robotics for Classes 6–9.' },
                            { icon: <FaCogs size={32} />, name: 'Robotics Innovation Program', desc: 'Hands-On Robotics Learning with a focus on building, programming, and iterating on real robot systems.' },
                            { icon: <FaBrain size={32} />, name: 'AI Fundamentals', desc: 'Understanding Artificial Intelligence Through Activities, Demonstrations, and Interactive Exercises.' },
                            { icon: <MdSchool size={32} />, name: 'STEM Innovation Labs', desc: 'Technology Learning Spaces for Schools — designed to host ongoing discovery and experimentation.' },
                            { icon: <FaWrench size={32} />, name: 'Future Skills Workshops', desc: 'Industry-Oriented Skill Development Programs covering coding, design thinking, and emerging technologies.' },
                            { icon: <FaMedal size={32} />, name: 'Innovation Challenges', desc: 'Problem Solving and Team-Based Competitions that push students to apply what they have learned.' },
                        ].map((p) => (
                            <div key={p.name} className="program-card">
                                <span className="program-icon" style={{ color: 'var(--cyan)' }}>{p.icon}</span>
                                <h3>{p.name}</h3>
                                <p style={{color:"#201e1e"}}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Vision & Mission ── */}
            <section className="section">
                <div className="vm-section">
                    <p className="section-eyebrow">Our Vision & Mission</p>

                    <div className="vm-grid">
                        <div className="vm-card vision">
                            <span className="vm-label">Vision</span>
                            <h2>
                                To create a generation of innovators who can identify challenges,
                                design solutions, and deploy ideas that create meaningful impact.
                            </h2>
                        </div>
                        <div className="vm-card mission">
                            <span className="vm-label">Mission</span>
                            <h2>
                                To make future technologies accessible to every student by providing
                                practical learning experiences that inspire creativity, innovation,
                                and lifelong learning.
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Registration Form (CORRECTED - Matching Backend Field Names) ── */}
            <section className="section section-mid" id="register">
                <div className="register-section">
                    <p className="section-eyebrow">Get Started</p>
                    <h2 className="section-title">Register Your School</h2>
                    <p className="section-body" style={{ margin: '0 auto 2.5rem', maxWidth: '600px' }}>
                        Join us in bringing future technology education to your students. Fill out the form below and our team will get in touch with you shortly.
                    </p>

                    <div className="form-card">
                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="form-grid">
                                {/* School Name - matches backend: school_name */}
                                <div className="form-group">
                                    <label htmlFor="school_name">
                                        <IoSchoolOutline size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                        School Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="school_name"
                                        name="school_name"
                                        value={formData.school_name}
                                        onChange={handleChange}
                                        placeholder="Your school name"
                                        required
                                    />
                                </div>

                                {/* Email - matches backend: emai_id */}
                                <div className="form-group">
                                    <label htmlFor="emai_id">
                                        <MdEmail size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="emai_id"
                                        name="emai_id"
                                        value={formData.emai_id}
                                        onChange={handleChange}
                                        placeholder="school@example.com"
                                        required
                                    />
                                </div>

                                {/* Phone Number - matches backend: phone_number */}
                                <div className="form-group">
                                    <label htmlFor="phone_number">
                                        <FaPhoneAlt size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="10-digit phone number"
                                        required
                                    />
                                </div>

                                {/* School Address - matches backend: school_address */}
                                <div className="form-group">
                                    <label htmlFor="school_address">
                                        <MdLocationOn size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                        School Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="school_address"
                                        name="school_address"
                                        value={formData.school_address}
                                        onChange={handleChange}
                                        placeholder="Street address"
                                        required
                                    />
                                </div>

                                {/* Area - matches backend: area */}
                                <div className="form-group">
                                    <label htmlFor="area">
                                        <MdLocationOn size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                        Area / Locality *
                                    </label>
                                    <input
                                        type="text"
                                        id="area"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        placeholder="Area name"
                                        required
                                    />
                                </div>

                                {/* District - matches backend: district */}
                                <div className="form-group">
                                    <label htmlFor="district">
                                        <MdLocationOn size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                        District *
                                    </label>
                                    <input
                                        type="text"
                                        id="district"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        placeholder="District name (optional)"
                                    />
                                </div>
                            </div>

                            {/* Description - matches backend: description */}
                            <div className="form-group">
                                <label htmlFor="description">
                                    <FaEnvelope size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                    Any Queries or Additional Information *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Tell us about your school, student strength, or any specific requirements..."
                                    rows="5"
                                    required
                                    
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="form-submit" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                            </button>

                            {submitMessage && (
                                <div className={`form-message ${messageType === 'success' ? 'success' : 'error'}`}>
                                    {submitMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* ── Final CTA Section ── */}
            <section className="cta-section" id="contact">
                <h2>Ready to Bring Future Technologies to Your School?</h2>
                <p>
                    Empower your students with hands-on experiences in Artificial Intelligence,
                    Robotics, Innovation, and Emerging Technologies.
                </p>
                <p style={{ color: 'var(--cyan)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Dream. Design. Deploy.
                </p>
                <p style={{ marginBottom: '2rem' }}>Building Tomorrow's Innovators Today.</p>
                
                <div className="hero-actions" style={{ justifyContent: 'center' }}>
                    <a href="tel:9247577907" className="btn-primary">Get in Touch</a>
                    <a href="https://www.stackenzo.com" target="_blank" rel="noreferrer" className="btn-ghost">Visit stackenzo</a>
                </div>

                <div className="cta-contacts">
                    <div className="contact-item">
                        <FaPhoneAlt size={16} style={{ color: 'var(--cyan)' }} />
                        <span>9247577907</span>
                    </div>
                    <div className="contact-item">
                        <FaPhoneAlt size={16} style={{ color: 'var(--cyan)' }} />
                        <span>6300591267</span>
                    </div>
                    <div className="contact-item">
                        <FaEnvelope size={16} style={{ color: 'var(--cyan)' }} />
                        <span>edtech@stackenzo.com</span>
                    </div>
                </div>

                <div className="cta-ddd">Dream · Design · Deploy</div>
            </section>
        </div>
    );
}