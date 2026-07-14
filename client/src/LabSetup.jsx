import React, { useState, useRef, useEffect } from 'react';
import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity
} from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import {
  Bot, Cpu as CpuIcon, CircuitBoard, Microscope, Wifi, Battery,
  Monitor, Printer, Wrench, Book, Users as UsersIcon,
  Trophy, Gift, PenTool, MessageCircle, Headphones,
  Settings, BarChart3, Calendar, Download, PhoneCall,
  Video, FileText, Building, School, Home, ChevronLeft,
  Package, Camera, Rocket, Sparkles, ArrowRight,
  Star, Award, Zap, Target, Lightbulb, GraduationCap,
  CheckCircle, Clock, Globe, Shield, TrendingUp, Briefcase,
  Code, Database, Server, Cloud, Smartphone, Palette,
  Gauge, Layers, Phone, Mail, MapPin, Linkedin,
  Twitter, Youtube, Instagram, Facebook, Menu, X,
  ChevronDown, ChevronRight, ExternalLink
} from 'lucide-react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   NAV
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["rl-hero", "rl-why", "rl-philosophy", "rl-services", "rl-plans", "rl-testimonials", "rl-faq"];
const NAV_LABELS = ["Hero", "Why Robotics", "Philosophy", "Services", "Plans", "Testimonials", "FAQ"];

/* ══════════════════════════════════════════════
   REVEAL - ONCE ONLY
══════════════════════════════════════════════ */
function Reveal({ children, className = "", from = "bottom", once = true }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once, margin: "-55px" });
  
  const variants = {
    hidden: { opacity: 0, y: from === 'bottom' ? 40 : -40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inV ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   STAGGER CONTAINER - ONCE ONLY
══════════════════════════════════════════════ */
function StaggerContainer({ children, className = "", stagger = 0.05, from = "bottom" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-55px" });

  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: from === 'bottom' ? 20 : -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inV ? "visible" : "hidden"}
      variants={variants}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants} transition={{ duration: 0.4, ease: EASE_EXPO }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FLOAT
══════════════════════════════════════════════ */
function Float({ children, className = "", duration = 4, yRange = 14, delay = 0 }) {
  return (
    <motion.div className={className}
      animate={{ y: [-yRange / 2, yRange / 2, -yRange / 2] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   GLOW CARD
══════════════════════════════════════════════ */
function GlowCard({ children, className = "", accent = "#F04A06" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-40px" });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const mv = e => { const r = ref.current?.getBoundingClientRect(); if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); };
  return (
    <motion.div ref={ref} className={`relative rounded-2xl overflow-hidden ${className}`} onMouseMove={mv}
      initial={{ opacity: 0, y: 30 }}
      animate={inV ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: EASE_EXPO }}>
      <div className="absolute pointer-events-none rounded-2xl z-0"
        style={{ inset: -1, background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px,${accent}28,transparent 60%)`, opacity: inV ? 1 : 0, transition: "opacity .3s" }} />
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={inV ? { opacity: [.22, .5, .22] } : { opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: `inset 0 0 0 1px ${accent}32` }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   TILT CARD
══════════════════════════════════════════════ */
function TiltCard({ children, className = "", intensity = 9 }) {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22 }), sry = useSpring(ry, { stiffness: 200, damping: 22 });
  const mm = e => { const r = ref.current.getBoundingClientRect(); rx.set(-((e.clientY - r.top) / r.height - .5) * intensity); ry.set(((e.clientX - r.left) / r.width - .5) * intensity); };
  const ml = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={mm} onMouseLeave={ml}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} className={className}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════ */
function MagBtn({ children, className = "", onClick, type = "button" }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 16 }), sy = useSpring(y, { stiffness: 250, damping: 16 });
  const mm = e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .35); y.set((e.clientY - r.top - r.height / 2) * .35); };
  const ml = () => { x.set(0); y.set(0); };
  return (
    <motion.button ref={ref} type={type} style={{ x: sx, y: sy }} onMouseMove={mm} onMouseLeave={ml}
      whileTap={{ scale: .94 }} onClick={onClick} className={className}>
      {children}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════
   COUNTER - FIXED FOR DECIMALS
══════════════════════════════════════════════ */
function Counter({ value }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true });

  const numericMatch = String(value).match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const original = String(value);

  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 55, damping: 14, precision: 0.01 });
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    mv.set(inV ? numericValue : 0);
  }, [inV, numericValue]);

  useEffect(() => {
    return sp.on("change", v => {
      let formatted;
      if (Number.isInteger(numericValue)) {
        formatted = Math.round(v);
      } else {
        formatted = v.toFixed(1);
      }
      const updated = original.replace(/[\d.]+/, formatted);
      setDisplay(updated);
    });
  }, [sp, original, numericValue]);

  return <span ref={ref}>{display}</span>;
}

/* ══════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════ */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 right-0 w-[4px] h-full origin-top z-[9997]"
      style={{
        scaleY,
        background: "linear-gradient(to bottom,#0d1f0d,#1E301E,#D4AF37,#2E7D32,#D4AF37)"
      }}
    />
  );
}

/* ══════════════════════════════════════════════
   SECTION NAV DOTS
══════════════════════════════════════════════ */
function SectionNavDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            const i = NAV_SECTIONS.indexOf(e.target.id);
            if (i !== -1) setActive(i);
          }
        }),
      { threshold: 0.3 }
    );

    NAV_SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-[900] flex-col gap-4 hidden md:flex">
      {NAV_SECTIONS.map((id, i) => (
        <motion.button
          key={i}
          onClick={() =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
          }
          className="relative flex items-center justify-center"
          title={NAV_LABELS[i]}
        >
          <motion.div
            animate={{
              scale: active === i ? 1.4 : 1,
              background: active === i ? "#D4AF37" : "rgba(230,107,38,0.4)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="w-2.5 h-2.5 rounded-full"
          />
        </motion.button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   NOISE CANVAS
══════════════════════════════════════════════ */
function NoiseCanvas({ color1="#FFD5B8", color2="#FFF4ED", opacity=0.35 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let t = 0, id;
    const draw = () => {
      const w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
      const g = ctx.createRadialGradient(w * (.3 + .22 * Math.sin(t * .38)), h * (.3 + .16 * Math.cos(t * .28)), 0, w * .5, h * .5, Math.max(w, h) * .88);
      g.addColorStop(0, color1 + "cc"); g.addColorStop(.5, color2 + "88"); g.addColorStop(1, "transparent");
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); t += .007; id = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(id);
  }, [color1, color2]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />;
}

/* ══════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════ */
function ParticleCanvas({ count = 20, color = "rgba(230,107,38,0.08)" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
    const pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .7 }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 88) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${(1 - d / 88) * .055})`); ctx.stroke(); }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    const rz = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
    window.addEventListener("resize", rz);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", rz); };
  }, [count, color]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ══════════════════════════════════════════════
   SPOTLIGHT
══════════════════════════════════════════════ */
function Spotlight({ color = "rgba(230,107,38,0.06)", size = 580 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, [color, size]);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ══════════════════════════════════════════════
   WAVE DIVIDER
══════════════════════════════════════════════ */
function WaveDivider({ color = "#D4AF37", flip = false, toBg = "#fff" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-10px" });
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${flip ? "rotate-180" : ""}`} style={{ height: 52 }}>
      <svg viewBox="0 0 1440 52" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26 L1440,52 L0,52 Z"
          fill={toBg} initial={{ pathLength: 0 }} animate={inV ? { pathLength: 1 } : {}} transition={{ duration: 0.8, ease: EASE_EXPO }} />
        <motion.path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26"
          stroke={color} strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={inV ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.05 }} />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SECTION LABEL - NO ANIMATION
══════════════════════════════════════════════ */
function SLabel({ text }) {
  return (
    <div className="flex items-center gap-3 justify-center mb-3">
      <div className="h-px w-8 bg-[#D4AF37]" />
      <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">{text}</span>
      <div className="h-px w-8 bg-[#D4AF37]" />
    </div>
  );
}

/* ══════════════════════════════════════════════
   STATIC HEADING - NO ANIMATION
══════════════════════════════════════════════ */
function Heading({ children, className = "" }) {
  return <h2 className={className}>{children}</h2>;
}

// ============================================================
//  DATA
// ============================================================
const WHY_ROBOTICS = [
  { icon: Bot, title: "Activity-Based Learning", desc: "Students learn by doing instead of memorizing." },
  { icon: Globe, title: "Real World Applications", desc: "Bridge classroom theory with practical implementation." },
  { icon: Lightbulb, title: "Innovation & Creativity", desc: "Encourage curiosity, experimentation, and design thinking." },
  { icon: TrendingUp, title: "Future Ready Skills", desc: "Develop logical thinking, teamwork, communication, and problem-solving." },
];

const PHILOSOPHY_STEPS = [
  { step: "Curiosity", icon: Lightbulb },
  { step: "Explore", icon: Globe },
  { step: "Experiment", icon: Microscope },
  { step: "Build", icon: Wrench },
  { step: "Test", icon: Gauge },
  { step: "Improve", icon: TrendingUp },
  { step: "Create", icon: Sparkles },
];

const WHY_CLASS6 = [
  { icon: Star, text: "High curiosity" },
  { icon: CpuIcon, text: "Logical thinking development" },
  { icon: Bot, text: "Hands-on learning" },
  { icon: Wifi, text: "Technology exposure" },
  { icon: Lightbulb, text: "Creativity" },
  { icon: UsersIcon, text: "Independent thinking" },
];

const LAB_SETUP_ITEMS = [
  { icon: Bot, title: "Robotics Kits" },
  { icon: CircuitBoard, title: "Sensors & Electronics" },
  { icon: CpuIcon, title: "Arduino & Controllers" },
  { icon: Printer, title: "3D Printer Setup" },
  { icon: Wrench, title: "Assembly Tools" },
  { icon: Monitor, title: "Demo Robots" },
  { icon: UsersIcon, title: "Trainer Support" },
  { icon: Book, title: "Curriculum" },
  { icon: Package, title: "Project Materials" },
  { icon: Settings, title: "Implementation Support" },
  { icon: Shield, title: "Maintenance" },
  { icon: GraduationCap, title: "Faculty Guidance" },
];

const SERVICES = [
  { icon: Bot, title: "AI & Robotics Lab Setup" },
  { icon: Bot, title: "Hands-on Robotics Programs" },
  { icon: UsersIcon, title: "Teacher Training" },
  { icon: TrendingUp, title: "Student Skill Development" },
  { icon: School, title: "School Workshops" },
  { icon: Briefcase, title: "Career Awareness Sessions" },
  { icon: Lightbulb, title: "Innovation Programs" },
  { icon: Trophy, title: "Robotics Competitions" },
  { icon: Award, title: "Science Exhibitions" },
  { icon: Target, title: "Project Guidance" },
];

const LEARNING_OUTCOMES = [
  "Critical Thinking", "Problem Solving", "Logical Reasoning",
  "Creativity", "Communication", "Leadership",
  "Confidence", "Teamwork", "Technology Skills", "Innovation Mindset"
];

const SCHOOL_BENEFITS = [
  { icon: Award, title: "Modern School Branding" },
  { icon: TrendingUp, title: "Improved Admissions" },
  { icon: Book, title: "Future Ready Curriculum" },
  { icon: Globe, title: "Technology Integration" },
  { icon: UsersIcon, title: "Student Engagement" },
  { icon: Target, title: "Practical Learning" },
  { icon: Shield, title: "Competitive Advantage" },
  { icon: Briefcase, title: "Industry Exposure" },
];

const IMPLEMENTATION_STEPS = [
  "Consultation", "Requirement Analysis", "Lab Design",
  "Equipment Installation", "Trainer Deployment", "Student Training",
  "Projects", "Support & Maintenance"
];

const PLANS = [
  {
    name: "Silver",
    price: "Starter",
    features: ["Starter Robotics Kits", "Basic Projects", "Trainer Support"],
    tag: "Suitable for beginners",
    color: "from-gray-400 to-gray-500",
    popular: false,
  },
  {
    name: "Gold",
    price: "Advanced",
    features: ["Advanced Robotics Kits", "Structured Learning", "Regular Sessions", "Curriculum Integration"],
    tag: "Best for most schools",
    color: "from-[#D4AF37] to-[#F04A06]",
    popular: true,
  },
  {
    name: "Platinum",
    price: "Complete",
    features: [
      "Complete Robotics Laboratory",
      "Advanced Innovation Projects",
      "Competition Preparation",
      "Dedicated Trainers",
      "Complete School Support"
    ],
    tag: "Premium solution",
    color: "from-[#F04A06] to-[#C5531A]",
    popular: false,
  },
];

const EXTRA_PROGRAMS = [
  "Career Awareness", "Creative Thinking", "Innovation Challenges",
  "Tech Quizzes", "Robotics Games", "School Competitions",
  "Science Exhibitions", "Project Presentations"
];

const WHY_CHOOSE = [
  { icon: UsersIcon, title: "Dedicated Trainers", desc: "Expert trainers with years of robotics experience" },
  { icon: Settings, title: "Complete Lab Setup", desc: "End-to-end setup from planning to execution" },
  { icon: Bot, title: "Hands-on Learning", desc: "Practical, project-based learning approach" },
  { icon: Award, title: "Industry Expertise", desc: "Trusted by leading educational institutions" },
  { icon: Book, title: "Research Driven", desc: "Curriculum backed by educational research" },
  { icon: Shield, title: "End-to-End Support", desc: "Continuous support throughout the journey" },
  { icon: TrendingUp, title: "Future Ready Curriculum", desc: "Preparing students for tomorrow's challenges" },
  { icon: CpuIcon, title: "Technology Driven Education", desc: "Leveraging cutting-edge technology" },
];

// Gallery images with Unsplash URLs
const GALLERY_IMAGES = [
  { 
    id: 1,
    title: "Robotics Lab", 
    image: "images/robotic_lab.webp",
    icon: Bot
  },
  { 
    id: 2,
    title: "Students Building Robots", 
    image: "images/student_building_robots.jpg",
    icon: UsersIcon
  },
  { 
    id: 3,
    title: "Coding Sessions", 
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    icon: Code
  },
  { 
    id: 4,
    title: "AI Workshop", 
    image: "images/ai_workshop.jpg",
    icon: CpuIcon
  },
  { 
    id: 5,
    title: "3D Printing", 
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800&q=80",
    icon: Printer
  },
  { 
    id: 6,
    title: "Arduino Projects", 
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
    icon: CircuitBoard
  },
  { 
    id: 7,
    title: "Competitions", 
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    icon: Trophy
  },
  { 
    id: 8,
    title: "Science Fair", 
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    icon: Award
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Priya Sharma",
    role: "School Principal",
    text: "Stackenzo's robotics lab transformed our school. Students are more engaged and excited about learning.",
    rating: 5,
    initials: "PS"
  },
  {
    name: "Rajesh Kumar",
    role: "Teacher",
    text: "The hands-on approach has made a significant difference in how students understand technology concepts.",
    rating: 5,
    initials: "RK"
  },
  {
    name: "Ananya Reddy",
    role: "Student",
    text: "I never thought robotics could be so fun! I'm building robots and learning so much every day.",
    rating: 5,
    initials: "AR"
  },
];

const FAQS = [
  { q: "How long does setup take?", a: "Typically 2-4 weeks depending on the scope and customization required." },
  { q: "Which classes can participate?", a: "Students from Class 6 to Class 12 can participate in our programs." },
  { q: "Are trainers provided?", a: "Yes, we provide dedicated trainers for hands-on guidance and support." },
  { q: "Do schools need prior robotics experience?", a: "No, our programs are designed for beginners and advanced learners alike." },
  { q: "Are robotics kits included?", a: "Yes, complete robotics kits and materials are included in the package." },
  { q: "How are competitions conducted?", a: "We organize inter-school competitions and showcase events regularly." },
];

const CLIENTS = [
  {
    id: 1,
    name: "Simhapuri International School",
    location: "India",
    description: "AI & Robotics lab setup with hands-on learning",
    students: "200+",
    since: "2026",
    image: "images/Partners/simhapuri logo.jpg",
    icon: School
  },
  {
    id: 2,
    name: "Vidhyardhi school",
    location: "India",
    description: "Robotics curriculum integration for students",
    students: "100+",
    since: "2026",
    image: "images/Partners/vidhyardhi logo.png",
    icon: School
  }
];
/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function RoboticsLabPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const heroY = useTransform(heroP, [0, 1], [0, -110]);
  const heroO = useTransform(heroP, [0, .6], [1, 0.9]);
  const heroS = useTransform(heroP, [0, 1], [1, .84]);
  const bigY = useTransform(heroP, [0, 1], [0, 180]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 35, damping: 18 }), smy = useSpring(my, { stiffness: 35, damping: 18 });
  const b1x = useTransform(smx, [-1, 1], [-26, 26]), b1y = useTransform(smy, [-1, 1], [-14, 14]);
  const b2x = useTransform(smx, [-1, 1], [20, -20]), b2y = useTransform(smy, [-1, 1], [12, -12]);
  useEffect(() => {
    const fn = e => { mx.set((e.clientX / window.innerWidth - .5) * 2); my.set((e.clientY / window.innerHeight - .5) * 2); };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);

  const HERO_STATS = [
    { icon: Rocket, value: "100+", label: "Students", color: "#F04A06" },
    { icon: UsersIcon, value: "2+", label: "Schools", color: "#C5531A" },
    { icon: Bot, value: "20+", label: "Robotics Kits", color: "#F04A06" },
    { icon: Award, value: "98%", label: "Satisfaction", color: "#D4AF37" },
  ];

  return (
    <div className="bg-white text-gray-800 min-h-screen overflow-x-hidden">
      <Toast message={toast.message} isVisible={toast.show} onClose={() => setToast({ show: false, message: "" })} />
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section id="rl-hero" ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 sm:pt-24 lg:pt-32 pb-16 overflow-hidden bg-gradient-to-br from-[#FFF4ED] via-white to-[#FFF0E6]/30">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={18} color="rgba(230,107,38,0.08)" /></div>

        {/* Enhanced Kinetic BG Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]">
          <motion.div style={{ y: bigY }} className="relative w-full h-full flex items-center justify-center">
            <motion.span
              className="text-[22vw] sm:text-[20vw] md:text-[18vw] font-black leading-none tracking-[-0.05em] uppercase whitespace-nowrap"
              style={{ color: "rgba(230,107,38,0.018)" }}
              animate={{ scale: [1, 1.02, 1], x: [0, -10, 10, -10, 0] }}
              transition={{ scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }, x: { duration: 12, repeat: Infinity, ease: "easeInOut" } }}
            >
              AI & ROBOTICS
            </motion.span>
            <motion.span
              className="absolute text-[22vw] sm:text-[20vw] md:text-[18vw] font-black leading-none tracking-[-0.05em] uppercase whitespace-nowrap blur-[2px]"
              style={{ color: "rgba(230,107,38,0.006)" }}
              animate={{ x: [20, -20, 30, -30, 20], y: [10, -10, 15, -15, 10] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            >
              AI & ROBOTICS
            </motion.span>
            <motion.span
              className="absolute text-[24vw] sm:text-[22vw] md:text-[20vw] font-black leading-none tracking-[-0.05em] uppercase whitespace-nowrap blur-[4px]"
              style={{ color: "rgba(230,107,38,0.004)" }}
              animate={{ scale: [1, 1.05, 0.95, 1.05, 1], rotate: [0, 1, -1, 0.5, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            >
              AI & ROBOTICS
            </motion.span>
            <motion.div className="absolute top-[15%] left-[8%] text-4xl sm:text-5xl md:text-6xl opacity-[0.04]"
              animate={{ y: [-10, 15, -10], rotate: [0, 10, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>🤖</motion.div>
            <motion.div className="absolute bottom-[20%] right-[6%] text-4xl sm:text-5xl md:text-6xl opacity-[0.04]"
              animate={{ y: [10, -15, 10], rotate: [0, -10, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>🚀</motion.div>
            <motion.div className="absolute top-[30%] right-[12%] text-3xl sm:text-4xl md:text-5xl opacity-[0.03]"
              animate={{ y: [-8, 12, -8], rotate: [0, 15, -8, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}>💻</motion.div>
            <motion.div className="absolute bottom-[30%] left-[10%] text-3xl sm:text-4xl md:text-5xl opacity-[0.03]"
              animate={{ y: [12, -12, 12], rotate: [0, -12, 8, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}>⚡</motion.div>
          </motion.div>
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 z-[2] opacity-[.03]"
          style={{ backgroundImage: "radial-gradient(circle,#F04A06 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Blobs */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute top-16 left-[5%] w-80 h-80 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[100px] opacity-[.28]" style={{ background: "radial-gradient(circle,#FFD5B8,transparent)" }} />
        </motion.div>
        <motion.div style={{ x: b2x, y: b2y }} className="absolute bottom-16 right-[5%] w-[420px] h-[420px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[110px] opacity-[.16]" style={{ background: "radial-gradient(circle,#D4AF37,transparent)" }} />
        </motion.div>

        {/* Floating orbs */}
        <Float className="absolute top-1/4 left-[7%] w-3 h-3 rounded-full bg-[#D4AF37]/25 z-[2]" duration={5} delay={0} />
        <Float className="absolute top-1/3 right-[9%] w-2 h-2 rounded-full bg-[#F04A06]/20 z-[2]" duration={4} delay={0} />
        <Float className="absolute bottom-1/3 left-[12%] w-3.5 h-3.5 rounded-full bg-[#C5531A]/18 z-[2]" duration={6} delay={0} />
        <Float className="absolute bottom-1/4 right-[14%] w-2 h-2 rounded-full bg-[#D4AF37]/18 z-[2]" duration={5.5} delay={0} />

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }} className="max-w-6xl mx-auto text-center relative z-10 px-4 sm:px-6 w-full">
          {/* Badge */}
          <motion.div initial={{ scale: .7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE_BACK }}
            className="inline-flex items-center gap-2 bg-white/88 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2.5 mb-7 shadow-sm">
            <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </motion.div>
            <span className="text-sm font-semibold text-[#F04A06]">AI & Robotics Education</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-[1.06]">
            <span className="text-gray-800">Transforming Education</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] via-[#C5531A] to-[#D4AF37]">Through Hands-on Learning</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mb-2">From Curiosity to Creation</p>

          <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-9">
            Stackenzo helps schools establish AI & Robotics laboratories where students learn through building, experimenting, and solving real-world problems.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-8 px-2">
            {HERO_STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i}>
                  <TiltCard>
                    <motion.div whileHover={{ y: -6, boxShadow: `0 16px 40px ${s.color}18` }}
                      className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-[#D4AF37] transition-all shadow-sm text-center cursor-default">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5" style={{ color: s.color }} />
                      <div className="text-sm sm:text-lg font-black text-gray-800"><Counter value={s.value} /></div>
                      <div className="text-[10px] sm:text-xs text-gray-400">{s.label}</div>
                    </motion.div>
                  </TiltCard>
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-2">
            <MagBtn onClick={() => navigate("/Contact")}
              className="group relative w-full sm:w-auto px-6 py-3 bg-[#F04A06] text-white rounded-full text-sm font-bold overflow-hidden shadow-xl shadow-[#F04A06]/22">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Schedule Demo
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowRight className="w-4 h-4" /></motion.span>
              </span>
              <motion.div className="absolute inset-0 bg-[#C5531A] origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: .4 }} />
            </MagBtn>
            {/* <MagBtn className="w-full sm:w-auto px-6 py-3 border-2 border-[#F04A06]/20 text-gray-700 rounded-full text-sm font-bold hover:border-[#F04A06] hover:text-[#F04A06] transition-all bg-white">
              Download Brochure
            </MagBtn> */}
            <MagBtn className="w-full sm:w-auto px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-50 transition-all">
              Contact Us
            </MagBtn>
          </div>

          {/* Scroll cue */}
          <motion.div
            style={{ opacity: scrollOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mt-10 cursor-pointer"
            onClick={() => document.getElementById("rl-why")?.scrollIntoView({ behavior: "smooth" })}>
            <Float duration={2} yRange={10}>
              <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#F04A06] transition-colors">
                <span className="text-xs font-medium">Scroll to explore</span>
                <div className="w-7 h-12 border-2 border-[#F04A06]/22 rounded-full flex justify-center">
                  <motion.div
                    className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-3"
                    animate={{ y: [0, 14, 0], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                </div>
              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SECTION 2: WHY ROBOTICS ═══ */}
      <section id="rl-why" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Why Schools Need" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Robotics Labs
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ROBOTICS.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i}>
                  <motion.div
                    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(230,107,38,0.1)" }}
                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#FFF4ED] flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-[#F04A06]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: PHILOSOPHY ═══ */}
      <section id="rl-philosophy" className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#FFF4ED]/50 via-white to-[#FFF0E6]/50 relative overflow-hidden">
  {/* Background decorative elements */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-20 left-10 w-64 h-64 bg-[#F04A06]/5 rounded-full blur-3xl" />
    <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#F04A06]/[0.02] to-[#D4AF37]/[0.02] rounded-full blur-3xl" />
  </div>

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-14">
      <SLabel text="Program Philosophy" />
      <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#D4AF37]">
        From Curiosity to Creation
      </Heading>
      <div className="w-24 h-1 bg-gradient-to-r from-[#F04A06] to-[#D4AF37] mx-auto mt-4 rounded-full" />
      <p className="text-gray-500 max-w-2xl mx-auto mt-4 text-sm">
        A structured journey that transforms young minds into innovators
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-stretch relative">
      {/* Connector line with gradient */}
      <div className="hidden lg:block absolute top-[3.75rem] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#F04A06]/20 via-[#D4AF37]/40 to-[#F04A06]/20" />
      
      {PHILOSOPHY_STEPS.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === PHILOSOPHY_STEPS.length - 1;
        return (
          <Reveal key={i} className="relative flex" delay={i * 0.08}>
            {!isLast && (
              <div className="hidden lg:flex absolute top-8 -right-4 z-10 items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border border-[#D4AF37]/20">
                <ChevronRight className="w-4 h-4 text-[#F04A06]" />
              </div>
            )}
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col group relative overflow-hidden">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F04A06]/5 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Step number badge - highlighted */}
              <div className="flex items-center justify-between mb-4 relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFF4ED] to-[#FFF0E6] border-2 border-[#D4AF37] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-[#F04A06] transition-all duration-300 relative">
                  <Icon className="w-6 h-6 text-[#F04A06] group-hover:scale-110 transition-transform duration-300" />
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20 animate-ping opacity-0 group-hover:opacity-100" />
                </div>
                <span className="text-xs font-bold bg-gradient-to-r from-[#F04A06] to-[#D4AF37] bg-clip-text text-transparent tracking-wider">
                  STEP {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-1.5 group-hover:text-[#F04A06] transition-colors duration-300">
                {step.step}
              </h3>
              
              {/* Decorative bottom bar */}
              <div className="mt-auto pt-3 border-t border-gray-100/50">
                <div className="w-0 h-0.5 bg-gradient-to-r from-[#F04A06] to-[#D4AF37] group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>

    {/* Bottom decorative element */}
    <div className="mt-12 text-center">
      <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-2 shadow-sm">
        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        <span className="text-xs font-medium text-gray-600">7-step innovation framework</span>
        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
      </div>
    </div>
  </div>
</section>

      {/* ═══ SECTION 4: WHY CLASS 6 ═══ */}
      <section className="py-20 px-4 sm:px-6 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="text-[#F04A06] font-bold tracking-widest text-sm uppercase">Why Start From Class 6?</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-6 text-gray-800">Building Future Innovators Early</h2>
        <p className="text-gray-600 mb-8">
          Starting robotics education from Class 6 helps develop critical thinking, creativity, and problem-solving skills at the right age.
        </p>
        <StaggerContainer className="grid grid-cols-2 gap-4">
          {WHY_CLASS6.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 bg-[#FFF4ED]/50 rounded-xl p-3 hover:bg-[#FFF4ED] transition-colors duration-300">
                <div className="w-8 h-8 rounded-lg bg-[#FFF4ED] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#F04A06]" />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </div>
            );
          })}
        </StaggerContainer>
      </div>
      <Reveal>
        <div className="relative">
          <div className="grid grid-cols-2 gap-3">
            {/* Image 1 */}
            <div className="relative rounded-xl overflow-hidden aspect-square col-span-2">
              <img 
                src="images/class_img.jpg" 
                alt="Students learning"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            
            {/* Image 2 */}
            <div className="relative rounded-xl overflow-hidden aspect-square">
              <img 
                src="images/chasismodel.jpeg" 
                alt="Robotics"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Image 3 */}
            <div className="relative rounded-xl overflow-hidden aspect-square">
              <img 
                src="images/arduino.jpg" 
                alt="Arduino"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#F04A06] to-[#D4AF37] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              🚀 500+ Students
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </div>
</section>

      {/* ═══ SECTION 5: LAB SETUP ═══ */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#FFF4ED]/50 via-white to-[#FFF0E6]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Complete Lab Setup" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              What We Provide
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {LAB_SETUP_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04, boxShadow: "0 12px 30px rgba(230,107,38,0.08)" }}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FFF4ED] flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-[#F04A06]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.title}</span>
                </motion.div>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ SECTION 6: SERVICES ═══ */}
      <section id="rl-services" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Our Services" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Comprehensive Solutions
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, boxShadow: "0 16px 35px rgba(230,107,38,0.08)" }}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF4ED] to-[#FFF0E6] flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-[#F04A06]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{service.title}</span>
                </motion.div>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ SECTION 7: LEARNING OUTCOMES ═══ */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#FFF4ED]/50 via-white to-[#FFF0E6]/50">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <Reveal>
        <div className="relative">
          <div className="bg-gradient-to-br from-[#FFF4ED] to-[#FFF0E6] rounded-2xl p-8 aspect-[4/3] flex items-center justify-center overflow-hidden">
            <img 
              src="images/ROBOTICS_LEARN.jpg" 
              alt="Student learning journey"
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm font-medium">Student Learning Journey</p>
            </div>
          </div>
        </div>
      </Reveal>

      <div>
        <span className="text-[#F04A06] font-bold tracking-widest text-sm uppercase">Learning Outcomes</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-6 text-gray-800">What Students Will Gain</h2>
        <StaggerContainer className="grid grid-cols-2 gap-3">
          {LEARNING_OUTCOMES.map((outcome, i) => (
            <div key={i} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <CheckCircle className="w-4 h-4 text-[#F04A06] flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">{outcome}</span>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </div>
  </div>
</section>

      {/* ═══ SECTION 8: BENEFITS ═══ */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Benefits" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              For Schools
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SCHOOL_BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(230,107,38,0.08)" }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#FFF4ED] flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[#F04A06]" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">{benefit.title}</h3>
                </motion.div>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <SLabel text="Our Clients" />
      <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
        Schools That Trust Us
      </Heading>
      <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
      <p className="text-gray-500 max-w-2xl mx-auto mt-4 text-sm">
        Join 500+ schools that have transformed their STEM education with Stackenzo
      </p>
    </div>

    {/* Client Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {CLIENTS.map((client, i) => {
        const Icon = client.icon;
        return (
          <Reveal key={client.id} delay={i * 0.05}>
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(240,74,6,0.08)" }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* School Icon or Logo */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFF4ED] to-[#FFF0E6] flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/20 group-hover:border-[#F04A06] transition-colors overflow-hidden">
                  {client.image ? (
                    <img
                      src={client.image}
                      alt={`${client.name} logo`}
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                    />
                  ) : (
                    <Icon className="w-7 h-7 text-[#F04A06]" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#F04A06] transition-colors">
                    {client.name}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {client.location}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {client.description}
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-500">
                    <span className="font-bold text-[#F04A06]">{client.students}</span> Students
                  </span>
                  <span className="text-gray-500">
                    Since <span className="font-semibold text-gray-700">{client.since}</span>
                  </span>
                </div>
                {/* <motion.div
                  whileHover={{ x: 3 }}
                  className="text-[#F04A06] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  View Story
                  <ArrowRight className="w-3 h-3" />
                </motion.div> */}
              </div>
            </motion.div>
          </Reveal>
        );
      })}
    </div>

    {/* Stats Bar */}
    <div className="mt-12 bg-gradient-to-br from-[#FFF4ED] to-[#FFF0E6] rounded-2xl p-8 border border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-black text-[#F04A06]">20+</div>
          <div className="text-sm text-gray-500">Schools</div>
        </div>
        <div>
          <div className="text-3xl font-black text-[#C5531A]">10K+</div>
          <div className="text-sm text-gray-500">Students Trained</div>
        </div>
        <div>
          <div className="text-3xl font-black text-[#D4AF37]">98%</div>
          <div className="text-sm text-gray-500">Satisfaction Rate</div>
        </div>
        <div>
          <div className="text-3xl font-black text-[#F04A06]">2+</div>
          <div className="text-sm text-gray-500">States Covered</div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ═══ SECTION 9: IMPLEMENTATION ═══ */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#FFF4ED]/50 via-white to-[#FFF0E6]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Implementation" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#D4AF37]">
              Process
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#D4AF37] mx-auto mt-4 rounded" />
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#F04A06] via-[#C5531A] to-[#D4AF37] hidden sm:block" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {IMPLEMENTATION_STEPS.map((step, i) => (
                <Reveal key={i}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(230,107,38,0.08)" }}
                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all relative"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F04A06] text-white flex items-center justify-center text-sm font-bold mb-3">
                      {i + 1}
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">{step}</h3>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 10: PLANS ═══ */}
      <section id="rl-plans" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Plans & Packages" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Choose Your Plan
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => {
              const isPopular = plan.popular;
              return (
                <Reveal key={i}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className={`relative bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all ${isPopular ? 'border-[#D4AF37] shadow-lg' : 'border-gray-100'}`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#F04A06] text-white text-xs font-bold px-4 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                      <span className="text-white font-bold text-sm">{plan.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{plan.tag}</p>
                    <div className="h-px bg-gray-100 my-4" />
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-[#F04A06] flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <MagBtn className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${isPopular ? 'bg-[#F04A06] text-white hover:bg-[#C5531A] shadow-md shadow-[#F04A06]/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => navigate("/LabContact")}>
                      Know More
                    </MagBtn>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 11: EXTRA PROGRAMS ═══ */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#FFF4ED]/50 via-white to-[#FFF0E6]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Extra Programs" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#D4AF37]">
              Beyond the Classroom
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#D4AF37] mx-auto mt-4 rounded" />
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXTRA_PROGRAMS.map((program, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04, boxShadow: "0 12px 30px rgba(230,107,38,0.08)" }}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <span className="text-sm font-semibold text-gray-700">{program}</span>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ SECTION 12: WHY CHOOSE ═══ */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Why Choose" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Stackenzo
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {WHY_CHOOSE.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(230,107,38,0.06)" }}
                    className="flex gap-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FFF4ED] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#F04A06]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 13: GALLERY ═══ */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#FFF4ED]/50 via-white to-[#FFF0E6]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Gallery" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Our Work in Action
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05, boxShadow: "0 16px 40px rgba(230,107,38,0.1)" }}
                  className="relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-square group"
                >
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-semibold">{item.title}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ SECTION 14: TESTIMONIALS ═══ */}
      <section id="rl-testimonials" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="Testimonials" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              What Our Clients Say
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <Reveal key={i}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(230,107,38,0.06)" }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F04A06] to-[#C5531A] flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{testimonial.name}</div>
                      <div className="text-xs text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 15: FAQ ═══ */}
      <section id="rl-faq" className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#FFF4ED]/50 via-white to-[#FFF0E6]/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SLabel text="FAQ" />
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Frequently Asked Questions
            </Heading>
            <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#C5531A] mx-auto mt-4 rounded" />
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-[#F04A06]" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600 text-sm">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F04A06] to-[#C5531A] opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,107,38,0.05),transparent_70%)]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-[#FFF4ED] flex items-center justify-center mx-auto mb-6">
                <Bot className="w-10 h-10 text-[#F04A06]" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Let's Build the Future Together
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Bring AI & Robotics education to your school with Stackenzo's complete lab setup solution.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <MagBtn className="px-8 py-3.5 bg-[#F04A06] text-white rounded-full font-bold hover:bg-[#C5531A] transition-all shadow-lg shadow-[#F04A06]/30">
                  Book Free Demo
                </MagBtn>
                <MagBtn className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all">
                  Talk to Expert
                </MagBtn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default RoboticsLabPage;