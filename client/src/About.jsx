import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Target, Users, Award, Zap, Heart, Globe, BookOpen,
  Briefcase, Code, TrendingUp, Rocket, Star, ArrowRight, UserPlus,
  Sparkles as SparklesIcon, Eye, MessageCircle, ChevronRight,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["about-hero", "about-story", "about-mission", "about-values", "about-stats"];
const NAV_LABELS   = ["Hero", "Story", "Mission", "Values", "Stats"];

const PILLARS = [
  { icon: <Code className="w-6 h-6" />,       title: "IT Services",         desc: "Scalable, secure digital solutions and enterprise systems engineered to power modern businesses and accelerate sustainable growth.",                         color: "from-blue-500 to-cyan-500"     },
  { icon: <Rocket className="w-6 h-6" />,    title: "R&D Innovation",      desc: "Advancing cutting-edge research in AI/ML, IoT, robotics, and emerging technologies to drive real-world innovation.",                           color: "from-purple-500 to-pink-500"   },
  { icon: <BookOpen className="w-6 h-6" />,   title: "EdTech Excellence",   desc: "Immersive learning platforms and industry-aligned programs designed to empower the next generation of learners.",     color: "from-green-500 to-yellow-500" },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Marketing Solutions", desc: "Data-driven strategies and creative solutions designed to build strong digital presence and drive measurable growth.",                     color: "from-blue-500 to-red-500"    },
];

const VALUES = [
  { icon: <Heart className="w-10 h-10" />,  title: "Integrity",      desc: "We maintain the highest standards of integrity and transparency in all our operations at Stackenzo.",                         color: "from-red-400 to-pink-400"       },
  { icon: <Award className="w-10 h-10" />,  title: "Excellence",     desc: "We strive for excellence in everything we do, from curriculum design to learner success and support.",            color: "from-yellow-400 to-orange-400"  },
  { icon: <Zap className="w-10 h-10" />,    title: "Innovation",     desc: "We continuously innovate our teaching methods and programs to stay ahead of industry trends.",                   color: "from-[#F04A06] to-[#F04A06]"   },
  { icon: <Users className="w-10 h-10" />,  title: "Collaboration",  desc: "We believe strong collab between students, educators, and industry to drive innovation.",                color: "from-blue-400 to-purple-400"    },
  { icon: <Globe className="w-10 h-10" />,  title: "Accessibility",  desc: "We make quality education accessible to students from all backgrounds and locations.",                            color: "from-orange-400 to-red-400"     },
  { icon: <Target className="w-10 h-10" />, title: "Impact",         desc: "We focus on creating meaningful impact in the lives of our students and the community.",                          color: "from-purple-400 to-indigo-400"  },
];

const STATS = [
  { number: "1200+", label: "Students Empowered", icon: Users    },
  { number: "150+",  label: "Projects Delivered", icon: Briefcase },
  { number: "25+",   label: "Expert Mentors",     icon: Award    },
  { number: "20+",   label: "Satisfied Clients",  icon: Users    },
];

/* ══════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════ */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 right-0 w-[4px] h-full z-[9997]">
      <div 
        className="w-full origin-top transition-all duration-200"
        style={{ 
          height: `${progress}%`,
          background: "linear-gradient(to bottom,#0d1f0d,#1E301E,#D4AF37,#2E7D32,#D4AF37)"
        }}
      />
    </div>
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
        <button
          key={i}
          onClick={() =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
          }
          className="relative flex items-center justify-center group"
          title={NAV_LABELS[i]}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              active === i ? "bg-[#D4AF37] scale-150 shadow-lg shadow-[#D4AF37]/50" : "bg-[#F04A06]/40 group-hover:bg-[#F04A06]/70"
            }`}
          />
          {active === i && (
            <div className="absolute inset-0 rounded-full animate-ping bg-[#D4AF37]/40" style={{ animationDuration: '2s' }} />
          )}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   FLOAT ANIMATION
══════════════════════════════════════════════ */
function Float({ children, className = "", duration = 4, yRange = 14, delay = 0 }) {
  return (
    <div 
      className={className}
      style={{
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(-${yRange/2}px); }
          50% { transform: translateY(${yRange/2}px); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LIGHT BEAM - Subtle light overlay
══════════════════════════════════════════════ */
function LightBeam({ className = "" }) {
  return (
    <div className={`absolute pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[-15deg] animate-light-sweep" />
      <style>{`
        @keyframes light-sweep {
          0% { transform: translateX(-100%) rotate(-15deg); }
          100% { transform: translateX(100%) rotate(-15deg); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GLOW OVERLAY - Subtle glowing background
══════════════════════════════════════════════ */
function GlowOverlay({ color = "rgba(212,175,55,0.03)", className = "" }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute inset-0 animate-glow-pulse" style={{ background: color }} />
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SPARKLE - Floating sparkle particles (FIXED)
══════════════════════════════════════════════ */
function Sparkles({ count = 20, className = "" }) {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: count }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }));
    setSparkles(newSparkles);
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full bg-[#D4AF37]/20 animate-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   WAVE DIVIDER
══════════════════════════════════════════════ */
function WaveDivider({ color="#D4AF37", flip=false, toBg="#fff" }) {
  return (
    <div className={`relative w-full overflow-hidden ${flip?"rotate-180":""}`} style={{ height: 56 }}>
      <svg viewBox="0 0 1440 56" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,56 L0,56 Z" fill={toBg} />
        <path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28" stroke={color} strokeWidth="1.5" fill="none" opacity="1" />
        <path d="M0,36 C240,8 480,64 720,36 C960,8 1200,64 1440,36" stroke={color} strokeWidth=".6" fill="none" opacity=".4" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NOISE CANVAS
══════════════════════════════════════════════ */
function NoiseCanvas({ color1="#FFD5B8", color2="#FFF4ED", opacity=0.4 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let t=0, animationId;
    const draw = () => {
      const w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
      const g = ctx.createRadialGradient(w*(.3+.22*Math.sin(t*.38)),h*(.3+.16*Math.cos(t*.28)),0,w*.5,h*.5,Math.max(w,h)*.88);
      g.addColorStop(0, color1+"cc"); g.addColorStop(.5, color2+"88"); g.addColorStop(1,"transparent");
      ctx.clearRect(0,0,w,h); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      t+=.007; animationId=requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(animationId);
  }, [color1, color2]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />;
}

/* ══════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════ */
function ParticleCanvas({ count=28, color="rgba(230,107,38,0.10)" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
    const pts = Array.from({length:count}, ()=>({ x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-.5)*.38, vy:(Math.random()-.5)*.38, r:Math.random()*1.8+.8 }));
    let animationId;
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<90){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=color.replace(/[\d.]+\)$/,`${(1-d/90)*.065})`); ctx.stroke(); }
      }
      animationId=requestAnimationFrame(draw);
    };
    draw();
    const rz=()=>{w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;};
    window.addEventListener("resize",rz);
    return ()=>{ cancelAnimationFrame(animationId); window.removeEventListener("resize",rz); };
  }, [count, color]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ══════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════ */
function AnimatedCounter({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const endValue = typeof target === 'number' ? target : parseInt(target);
    if (isNaN(endValue) || endValue === 0) {
      setCount(0);
      return;
    }

    let startTime = null;
    const startValue = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * endValue);
      
      setCount(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };
    
    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ══════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════ */
function HeroSection() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 100);
      setScrollOpacity(opacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="about-hero" className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden min-h-screen flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Team" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F04A06]/40 via-transparent to-[#F04A06]/40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.7)_100%)]" />
      </div>

      {/* ✨ Light overlays */}
      <LightBeam className="w-full h-full top-0 left-0 z-[2]" />
      <GlowOverlay color="rgba(212,175,55,0.03)" className="z-[2]" />
      <Sparkles count={15} className="z-[2]" />

      {/* Particle layer */}
      <div className="absolute inset-0 z-[1]"><ParticleCanvas count={22} color="rgba(230,107,38,0.08)" /></div>
      <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28} />

      {/* Main content */}
      <div className="max-w-6xl mx-auto pb-24 text-center relative z-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-8 relative"
        >
          <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl rounded-full animate-pulse" />
          <span className="relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F04A06]/20 to-[#F04A06]/20 text-[#F04A06] rounded-full text-sm font-semibold border border-[#F04A06]/30 backdrop-blur-sm shadow-lg shadow-[#F04A06]/10">
            <span className="text-[#D4AF37] animate-pulse">✦</span>
            Empowering the Next Generation of Innovators
            <span className="text-[#D4AF37] animate-pulse" style={{ animationDelay: '1s' }}>✦</span>
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.75 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
        >
          <span className="text-[#1A1A1A]">About</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] via-[#F04A06] to-[#F04A06] relative">
            Stackenzo
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl sm:text-2xl text-[#1A1A1A] max-w-4xl mx-auto leading-relaxed backdrop-blur-sm bg-white/20 p-6 rounded-2xl border border-gray-200 mb-10 relative"
        >
          Where IT services, R&D and EdTech unite to transform ideas into scalable, real-world digital solutions.
          <span className="absolute -inset-1 bg-gradient-to-r from-[#F04A06]/5 to-[#D4AF37]/5 blur-xl animate-pulse" />
        </motion.p>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 mt-4"
        >
          {[{label:"Students Empowered",value:"1200+",icon:"🎓"},{label:"Projects Delivered",value:"150+",icon:"🚀"},{label:"Expert Mentors",value:"25+",icon:"👨‍🏫"},{label:"Satisfied Clients",value:"20+",icon:"👥"}].map((s,i)=>(
            <motion.div
              key={i}
              whileHover={{ scale: 1.07, y: -5, boxShadow: "0 14px 32px rgba(0,0,0,0.08)" }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#F04A06]/10 rounded-xl blur-md group-hover:blur-xl transition-all duration-500" />
              <div className="relative bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl px-6 py-4 min-w-[160px] text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                <div className="text-2xl font-black text-[#F04A06]">{s.value}</div>
                <div className="text-sm text-[#1A1A1A] font-medium">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: scrollOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
          onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior:"smooth" })}
        >
          <Float duration={2} yRange={10}>
            <div className="relative w-7 h-12 border-2 border-[#F04A06]/28 rounded-full flex justify-center">
              <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-full animate-pulse" />
              <div className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-3 animate-bounce" />
            </div>
          </Float>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   OUR STORY SECTION
══════════════════════════════════════════════ */
function StorySection() {
  return (
    <>
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section id="about-story" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.25} />
        <GlowOverlay color="rgba(212,175,55,0.02)" />
        <Sparkles count={12} />
        
        {/* Floating bg circles */}
        {[{l:"5%",t:"10%",s:120},{l:"85%",t:"60%",s:90},{l:"50%",t:"80%",s:70}].map((o,i)=>(
          <Float key={i} duration={6+i} yRange={18} delay={i} className="absolute pointer-events-none"
            style={{left:o.l,top:o.t}}>
            <div className="rounded-full bg-[#F04A06]/[0.04] animate-pulse" style={{width:o.s,height:o.s}} />
          </Float>
        ))}

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 justify-center mb-3"
            >
              <div className="h-px w-8 bg-[#D4AF37] relative">
                <div className="absolute inset-0 bg-[#D4AF37]/50 animate-pulse" />
              </div>
              <span className="font-bold tracking-[.2em] text-[11px] uppercase text-[#D4AF37] relative">
                Our Story
              </span>
              <div className="h-px w-8 bg-[#D4AF37] relative">
                <div className="absolute inset-0 bg-[#D4AF37]/50 animate-pulse" />
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] relative inline-block"
            >
              How We Started
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left */}
            <div className="space-y-8">
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-lg text-[#1A1A1A] leading-relaxed relative"
              >
                <span className="absolute -left-4 top-0 w-1 h-12 bg-gradient-to-b from-[#D4AF37] to-transparent rounded-full animate-pulse" />
                Founded with a vision to bridge the gap between academic learning and industry excellence
                <span className="text-[#F04A06] font-semibold mx-1">Stackenzo</span>
                is a technology-driven organization focused on three core pillars: advanced IT services, innovative R&D and transformative EdTech solutions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#D4AF37] rounded-full animate-pulse" />
                  Our Comprehensive Offerings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PILLARS.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                      className="group relative bg-white p-6 rounded-xl border border-orange-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 group-hover:animate-light-sweep" />
                      <div className="relative z-10">
                        <div className="text-[#F04A06] mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#F04A06] transition-colors">{item.title}</h3>
                        <p className="text-sm text-[#1A1A1A]">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative lg:sticky lg:top-24"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-[#F04A06]/20 via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent z-10 animate-pulse" />
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                  alt="Team collaboration" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F04A06] via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
          
          {/* FULL WIDTH PARAGRAPH */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 max-w-5xl mx-auto border-l-4 border-[#D4AF37] pl-6 relative"
          >
            <div className="absolute -left-2 top-0 w-4 h-4 bg-[#D4AF37]/20 rounded-full animate-pulse" />
            <p className="text-[#1A1A1A] leading-relaxed italic text-center relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl text-[#D4AF37]/20">"</span>
              Today, Stackenzo stands as a unified technology powerhouse where research drives IT solutions, those solutions power EdTech experiences, and strategic marketing amplifies their impact—creating a continuous cycle of innovation and growth.
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-4xl text-[#D4AF37]/20">"</span>
            </p>
          </motion.div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff" />
    </>
  );
}

/* ══════════════════════════════════════════════
   MISSION & VISION
══════════════════════════════════════════════ */
function MissionSection() {
  return (
    <section id="about-mission" className="py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[.03]" style={{backgroundImage:"radial-gradient(circle,#F04A06 1px,transparent 1px)",backgroundSize:"28px 28px"}} />
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-[#F04A06] rounded-full filter blur-3xl opacity-[.06]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.1, 0.06] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 bg-[#F04A06] rounded-full filter blur-3xl opacity-[.06]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.1, 0.06] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <GlowOverlay color="rgba(212,175,55,0.02)" />
      <Sparkles count={10} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 justify-center mb-3"
          >
            <div className="h-px w-8 bg-[#D4AF37] relative">
              <div className="absolute inset-0 bg-[#D4AF37]/50 animate-pulse" />
            </div>
            <span className="font-bold tracking-[.2em] text-[11px] uppercase text-[#D4AF37] relative">
              Mission & Vision
            </span>
            <div className="h-px w-8 bg-[#D4AF37] relative">
              <div className="absolute inset-0 bg-[#D4AF37]/50 animate-pulse" />
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] relative inline-block"
          >
            Our Mission & Vision
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5, boxShadow: "0 20px 60px rgba(212,175,55,0.15)" }}
            className="group relative bg-gradient-to-br from-[#FFF4ED] to-white p-8 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F04A06]/5 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 group-hover:animate-light-sweep" />
            <div className="relative z-10">
              <Float duration={4} yRange={8}>
                <div className="relative inline-block">
                  <Target className="w-14 h-14 text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
                  <div className="absolute -inset-2 bg-[#D4AF37]/10 rounded-full blur-xl animate-pulse" />
                </div>
              </Float>
              <h3 className="text-3xl font-bold mb-5 text-[#1A1A1A]">Our Mission</h3>
              <p className="text-[#1A1A1A] leading-relaxed text-lg mb-6">
                Our mission is to design, develop and deliver intelligent technology solutions that solve real-world challenges with precision, scalability and long-term impact—across IT services, R&D and EdTech. We build scalable, secure and future-ready digital solutions while bridging academic knowledge with real-world implementation, empowering startups, institutions and enterprises through innovation, automating complex processes to enhance productivity, strengthening a research-driven engineering culture and promoting continuous learning and technological excellence.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5, boxShadow: "0 20px 60px rgba(212,175,55,0.15)" }}
            className="group relative bg-gradient-to-br from-[#FFF4ED] to-white p-8 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-[#F04A06]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 group-hover:animate-light-sweep" style={{ animationDelay: '0.5s' }} />
            <div className="relative z-10">
              <Float duration={4.5} yRange={8}>
                <div className="relative inline-block">
                  <Globe className="w-14 h-14 text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform" />
                  <div className="absolute -inset-2 bg-[#D4AF37]/10 rounded-full blur-xl animate-pulse" />
                </div>
              </Float>
              <h3 className="text-3xl font-bold mb-6 text-[#1A1A1A]">Our Vision</h3>
              <p className="text-[#1A1A1A] leading-relaxed text-lg mb-3">
                To become a leading innovation-driven technology ecosystem where IT services, R&D and EdTech converge to create meaningful impact. We aim to advance applied research, transform breakthrough ideas into scalable digital solutions and deliver intelligent systems that empower businesses and learners alike. By integrating technological excellence with innovation and education, we strive to shape a smarter, more connected future.
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl p-5" style={{ background:"linear-gradient(135deg,#FFF4ED,#FFF4ED)" }}
              >
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-[#D4AF37] animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent animate-pulse" />
                <p className="text-sm text-[#1A1A1A] italic leading-relaxed pl-3">"Through this innovation backbone, we strive to redefine education by integrating practical learning, industry exposure and technology-enabled experiences — empowering the next generation to learn, build and inspire."</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CORE VALUES
══════════════════════════════════════════════ */
function ValuesSection() {
  return (
    <>
      <WaveDivider color="#D4AF37" toBg="#FFF4ED" />
      <section id="about-values" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.22} />
        <GlowOverlay color="rgba(212,175,55,0.02)" />
        <Sparkles count={15} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 justify-center mb-3"
            >
              <div className="h-px w-8 bg-[#D4AF37] relative">
                <div className="absolute inset-0 bg-[#D4AF37]/50 animate-pulse" />
              </div>
              <span className="font-bold tracking-[.2em] text-[11px] uppercase text-[#D4AF37] relative">
                Core Values
              </span>
              <div className="h-px w-8 bg-[#D4AF37] relative">
                <div className="absolute inset-0 bg-[#D4AF37]/50 animate-pulse" />
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] relative inline-block"
            >
              Our Core Values
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#1A1A1A] max-w-3xl mx-auto mt-4"
            >
              The principles that guide everything we do at Stackenzo
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 60px rgba(212,175,55,0.12)" }}
                className="group relative bg-white p-8 rounded-2xl border border-gray-200 text-center overflow-hidden transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 group-hover:animate-light-sweep" />
                <Float duration={4+i*.4} delay={i*.3}>
                  <div className="relative inline-block">
                    <div className="text-[#D4AF37] mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                      {v.icon}
                    </div>
                    <div className="absolute -inset-2 bg-[#D4AF37]/5 rounded-full blur-xl animate-pulse" />
                  </div>
                </Float>
                <h3 className="text-2xl font-bold mb-3 text-[#1A1A1A] group-hover:text-[#F04A06] transition-colors">{v.title}</h3>
                <p className="text-[#1A1A1A]">{v.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-50 animate-pulse" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#fff" />
    </>
  );
}

/* ══════════════════════════════════════════════
   STATS SECTION
══════════════════════════════════════════════ */
function StatsSection() {
  return (
    <section id="about-stats" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[.07]" style={{ background: "radial-gradient(circle at 50% 50%, rgba(197,83,26,0.1) 0%, transparent 50%)" }} />
      <GlowOverlay color="rgba(212,175,55,0.02)" />
      <Sparkles count={12} />
      
      {/* Floating orbs */}
      {[{x:"8%",y:"20%",s:70},{x:"88%",y:"70%",s:50},{x:"50%",y:"85%",s:60}].map((o,i)=>(
        <Float key={i} duration={5+i} yRange={18} delay={i} className="absolute pointer-events-none" style={{left:o.x,top:o.y}}>
          <div className="rounded-full bg-[#D4AF37]/[0.05] animate-pulse" style={{width:o.s,height:o.s}} />
        </Float>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 justify-center mb-3"
          >
            <div className="h-px w-8 bg-[#D4AF37] relative">
              <div className="absolute inset-0 bg-[#D4AF37]/50 animate-pulse" />
            </div>
            <span className="font-bold tracking-[.2em] text-[11px] uppercase text-[#D4AF37] relative">
              Our Impact
            </span>
            <div className="h-px w-8 bg-[#D4AF37] relative">
              <div className="absolute inset-0 bg-[#D4AF37]/50 animate-pulse" />
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] relative inline-block"
          >
            Our Impact in Numbers
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            const numericValue = parseInt(s.number.replace(/\D/g, ""));
            const suffix = s.number.replace(/[0-9]/g, "");
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#F04A06]/10 rounded-xl blur-md group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                <motion.div
                  whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(212,175,55,0.15)" }}
                  className="relative bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-[#D4AF37] transition-all duration-300 text-center"
                >
                  <Float duration={4+i*.5} delay={i*.3}>
                    <div className="relative inline-flex justify-center mb-3">
                      <div className="absolute inset-0 bg-[#F04A06]/20 rounded-xl blur-lg animate-pulse" />
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="relative bg-[#F04A06] p-3 rounded-xl shadow-lg shadow-[#F04A06]/20"
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </motion.div>
                    </div>
                  </Float>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F04A06] mb-1 group-hover:scale-105 transition-transform duration-300">
                    <AnimatedCounter target={numericValue} duration={2000} suffix={suffix} />
                  </div>
                  <div className="text-xs sm:text-sm text-[#1A1A1A] font-medium">{s.label}</div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CTA SECTION
══════════════════════════════════════════════ */
function CTASection() {
  return (
    <>
      <WaveDivider color="#F04A06" toBg="#3D1A0A" />
      <section className="py-28 px-4 sm:px-6 relative overflow-hidden" style={{ background: "linear-gradient(to right, #F04A06, #F04A06)" }}>
        <div className="absolute inset-0"><ParticleCanvas count={18} color="rgba(212,175,55,0.05)" /></div>
        <GlowOverlay color="rgba(212,175,55,0.03)" />
        <Sparkles count={15} className="opacity-50" />
        
        {/* Floating rings */}
        {[100, 180, 270].map((s, i) => (
          <Float key={i} duration={6 + i * 2} yRange={12} delay={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border border-[#D4AF37]/20"
            style={{ width: s, height: s }} />
        ))}

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-flex items-center gap-2 border border-[#D4AF37]/38 rounded-full px-5 py-2 mb-8 bg-[#D4AF37]/10 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-xl animate-pulse" />
            <Star className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-sm text-[#D4AF37] font-bold">Build Your Future with Stackenzo</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Where Your Growth Begins
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            Be part of a growing network of learners and innovators. Let's shape the future of technology together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3"
          >
            {[
              { to: "/Contact", label: "Get in Touch", Icon: Rocket },
              { to: "/StackenzoPrograms", label: "Explore Programs", Icon: BookOpen },
              { to: "/Services", label: "Explore Services", Icon: Target },
              { to: "/Community", label: "Explore Community", Icon: UserPlus },
            ].map(({ to, label, Icon }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link to={to}>
                  <button className="relative group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden">
                    <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <span className="relative z-10">{label}</span>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
function About() {
  // Inject CSS animations
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes light-sweep {
      0% { transform: translateX(-100%) rotate(-15deg); }
      100% { transform: translateX(100%) rotate(-15deg); }
    }
    .animate-light-sweep {
      animation: light-sweep 4s ease-in-out infinite;
    }
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.8; }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
      50% { opacity: 1; transform: scale(1) rotate(180deg); }
    }
    .animate-sparkle {
      animation: sparkle 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(-7px); }
      50% { transform: translateY(7px); }
    }
  `;
  document.head.appendChild(styleElement);

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      <HeroSection />
      <StorySection />
      <MissionSection />
      <ValuesSection />
      <StatsSection />
      <CTASection />

      <Footer />
      <ScrollToTop />

      {/* WhatsApp FAB */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.a
          whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(240,74,6,0.3)" }}
          whileTap={{ scale: 0.9 }}
          href="https://wa.me/919247577906"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#F04A06] text-white rounded-full shadow-2xl border border-[#F04A06] hover:bg-[#D94A06] transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.a>
      </motion.div>
    </div>
  );
}

export default About;