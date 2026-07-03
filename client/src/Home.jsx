import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import Toast from "./Toast";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";
import {
  Bot, Code2, Globe, Users, Briefcase, Zap, TrendingUp, MessageCircle,
  X, ArrowRight, ChevronRight, Sparkles, Target, Eye, Clock, MapPin,
  Calendar, BookOpen, Cpu as CpuIcon, Heart, Star, Package,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { name: "Arjun Kumar", role: "Engineering Student", quote: "Stackenzo completely changed how I approach real-world projects. The learning is practical and intense.", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80" },
  { name: "Sneha R", role: "Startup Founder", quote: "Their IT services helped us launch faster with a solid and scalable platform.", img: "https://images.unsplash.com/photo-1494790108777-766d5e5f4c9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80" },
  { name: "Rahul M", role: "Robotics Enthusiast", quote: "The robotics programs are hands-on and far better than typical classroom learning.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80" },
];

const STATS_DATA = [
  { label: "Students Trained", value: "1200+", icon: Users, description: "Empowering future innovators" },
  { label: "Projects Delivered", value: "150+", icon: Package, description: "Successful implementations" },
  { label: "Workshops Conducted", value: "80+", icon: Briefcase, description: "Hands-on learning experiences" },
  { label: "Community Members", value: "3000+", icon: Globe, description: "Growing tech community" },
];

const SERVICES = [
  {
    id: 1,
    title: "Research & Development",
    path: "/R_AND_D",
    shortDesc: "Cutting-edge R&D projects",
    fullDesc: "We drive innovation through cutting-edge research, combining academic rigor with real-world impact to solve complex challenges in AI, robotics, and sustainable technology.",
    icon: CpuIcon,
    accent: "#4CAF50",
    features: ["AI & Machine Learning", "Sustainable Tech", "Prototype Development", "Industry Collaboration"]
  },
  {
    id: 2,
    title: "IT Services",
    path: "/WebServices",
    shortDesc: "Custom web & mobile dev",
    fullDesc: "We empower businesses with scalable IT solutions—from custom platforms to enterprise cloud systems—tailored to drive growth and efficiency.",
    icon: Code2,
    accent: "#2196F3",
    features: ["Digital Platforms", "Cloud Solutions", "Enterprise Systems", "Scalable Architecture"]
  },
  {
    id: 3,
    title: "EdTech",
    path: "/Robotics",
    shortDesc: "Strategic EdTech initiatives",
    fullDesc: "We transform education through innovative EdTech solutions, making learning engaging, accessible, and impactful while empowering future leaders.",
    icon: BookOpen,
    accent: "#FF9800",
    features: ["Robotics education with hands-on learning", "Coding bootcamps using real tools", "Problem-solving focused training", "Guidance from experienced mentors"]
  },
  {
    id: 4,
    title: "Digital Marketing",
    path: "/DigitalMarketing",
    shortDesc: "SEO, branding & growth",
    fullDesc: "We use data-driven digital marketing to build strong online presence, connect with the right audience, and drive engagement with measurable ROI.",
    icon: TrendingUp,
    accent: "#E91E63",
    features: ["SEO Optimization", "Content Strategy", "Social Media", "Analytics & Reporting"]
  },
  {
    id: 5,
    title: "GSIN Platform",
    path: "/Community",
    shortDesc: "Gamified tech ecosystem",
    fullDesc: "Our innovative GSIN platform creates an engaging ecosystem where tech enthusiasts collaborate, compete, and grow through challenges, leaderboards, project showcases, and community events that foster innovation.",
    icon: Globe,
    accent: "#00BCD4",
    features: ["Coding challenges with rewards", "Project collaboration ecosystem", "Leaderboards for engagement", "Community events with mentorship"]
  },
];

const WHY = [
  { icon: Zap, title: "Swift Assistance", desc: "Quick turnaround without compromising quality" },
  { icon: Target, title: "Expert Team", desc: "Experienced professionals in tech and education" },
  { icon: Heart, title: "24/7 Support", desc: "Continuous support throughout your entire journey" },
  { icon: TrendingUp, title: "Proven Results", desc: "Track record of successful projects & satisfied clients" },
];

const PROGRAMS = [
  { title: "R & D Projects", desc: "Research-driven engineering projects for real-world challenges.", img: "https://eu-images.contentstack.com/v3/assets/blt7a82e963f79cc4ec/blte9ba4bb5c8fc7e51/64b54806962d8e60ca1b576d/RD.jpg", link: "/R_AND_D", icon: CpuIcon, accent: "#4CAF50" },
  { title: "IT Services", desc: "End-to-end software development and scalable digital platforms.", img: "/images/it services.jpg", link: "/WebServices", icon: Code2, accent: "#2196F3" },
  { title: "Robotics Education", desc: "Hands-on robotics programs promoting innovation.", img: "https://tse3.mm.bing.net/th/id/OIP.95DU085B5v2VMvLso-nfzAAAAA", link: "/Robotics", icon: Bot, accent: "#9C27B0" },
  { title: "Workshops & Internships", desc: "Industry-oriented programs bridging learning with practice.", img: "/images/workshop&internship.jpg", link: "/WorkShops", icon: Users, accent: "#FF9800" },
  { title: "Digital Marketing", desc: "Comprehensive SEO, branding and performance marketing.", img: "/images/digital marketing.jpg", link: "/DigitalMarketing", icon: TrendingUp, accent: "#00BCD4" },
  { title: "GSIN Platform", desc: "Gamified innovation ecosystem for collaboration and growth.", img: "/images/gsin.jpg", link: "/Community", icon: Globe, accent: "#4CAF50" },
];

/* ════════════════════════════════════════════════════════════
   ANIMATED COUNTER COMPONENT
════════════════════════════════════════════════════════════ */
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
      
      // Ease out cubic for smooth deceleration
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

/* ════════════════════════════════════════════════════════════
   PAGE LOADER
════════════════════════════════════════════════════════════ */
function PageLoader({ onDone }) {
  const [prog, setProg] = useState(0);
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 6 + 2;
      if (v >= 100) {
        v = 100; clearInterval(id);
        setPhase("done");
        setTimeout(onDone, 600);
      }
      setProg(Math.min(v, 100));
    }, 80);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #FFF4ED 30%, #FCE4D6 60%, #FFF8E7 100%)',
      }}
    >
      {/* Blur Overlay - Solid Background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/30" />

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 0% 50%, rgba(240,74,6,0.06) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(212,175,55,0.06) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 0%, rgba(240,74,6,0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.04) 0%, transparent 50%)',
            'radial-gradient(ellipse at 0% 50%, rgba(240,74,6,0.06) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(212,175,55,0.06) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, #F04A06 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Animated Gradient Orbs - Orange */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.12, 0.2, 0.12],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'radial-gradient(circle, rgba(240,74,6,0.1) 0%, rgba(212,175,55,0.04) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        {/* Animated Gradient Orbs - Gold */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.08, 0.16, 0.08],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(240,74,6,0.04) 50%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />

        {/* White Glow Center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,244,237,0.4) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Floating Particles - Orange/Gold */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              background: i % 3 === 0 ? 'rgba(240,74,6,0.2)' : i % 3 === 1 ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.3)',
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -30 - Math.random() * 40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 0.5, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Decorative Rings - Orange/Gold */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ 
            width: 380, 
            height: 380,
            borderColor: 'rgba(240,74,6,0.05)',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ 
            width: 280, 
            height: 280,
            borderColor: 'rgba(212,175,55,0.06)',
          }}
          animate={{
            rotate: [360, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ 
            width: 180, 
            height: 180,
            borderColor: 'rgba(255,255,255,0.08)',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: 4,
          }}
        />
      </div>

      {/* Logo Section - Made more visible */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 flex items-center gap-3 mb-12"
      >
        <motion.img
          src="/images/final-logo.png"
          alt="Stackenzo"
          className="w-[120px] sm:w-[200px] md:w-[300px] lg:w-[400px] h-auto object-contain"
          animate={{
            filter: [
              'drop-shadow(0 0 30px rgba(255,255,255,0.4)) drop-shadow(0 0 60px rgba(240,74,6,0.2))',
              'drop-shadow(0 0 40px rgba(255,255,255,0.5)) drop-shadow(0 0 80px rgba(212,175,55,0.25))',
              'drop-shadow(0 0 30px rgba(255,255,255,0.4)) drop-shadow(0 0 60px rgba(240,74,6,0.2))',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Logo Glow - Orange/Gold - Made more visible */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(240,74,6,0.1) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </motion.div>

      {/* Loading Indicator - Made more visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] px-4"
      >
        {/* Battery Points - Orange/Gold Theme with better visibility */}
        <div className="flex items-center justify-between gap-1 sm:gap-1.5 mb-4">
          {[...Array(10)].map((_, i) => {
            const isFilled = i < Math.ceil(prog / 10);
            const isActive = i === Math.floor(prog / 10) && prog < 100;
            const isComplete = prog >= 100;
            
            return (
              <motion.div
                key={i}
                className="relative flex-1 h-[6px] rounded-full overflow-hidden bg-gray-200/50"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: 1,
                  opacity: 1
                }}
                transition={{ 
                  duration: 0.3,
                  delay: i * 0.03,
                  ease: "easeOut"
                }}
              >
                <motion.div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFilled || isComplete
                      ? 'bg-gradient-to-r from-[#F04A06] via-[#D4AF37] to-[#F04A06]'
                      : 'bg-gray-300/30'
                  } ${isActive ? 'animate-pulse' : ''}`}
                  initial={{ width: 0 }}
                  animate={{ width: isFilled || isComplete ? '100%' : '30%' }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  style={{
                    boxShadow: isFilled || isComplete 
                      ? `0 0 ${isActive ? '20px' : '10px'} rgba(255,215,0,${isActive ? '0.6' : '0.3'})` 
                      : 'none'
                  }}
                />
                
                {/* Active Glow - Gold */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
                      filter: 'blur(6px)',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress Info - Made more visible */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: prog >= 100 ? '#22c55e' : '#D4AF37',
                boxShadow: prog >= 100 ? '0 0 12px rgba(34,197,94,0.5)' : '0 0 12px rgba(212,175,55,0.5)',
              }}
            />
            <p className="text-xs font-medium text-gray-600 tracking-[0.18em] uppercase">
              {phase === "done" ? "Ready" : "Loading"}
            </p>
          </div>
          <motion.span 
            key={prog}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-bold"
            style={{
              color: prog >= 100 ? '#22c55e' : '#F04A06',
            }}
          >
            {Math.round(prog)}%
          </motion.span>
        </div>
      </motion.div>

      {/* Footer Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-8 text-xs text-gray-400 tracking-widest uppercase font-light"
      >
        Building the Future
      </motion.p>

      {/* Loading Complete Animation */}
      {phase === "done" && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.2
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Success Flash Effect */}
          <motion.div
            className="absolute inset-0 bg-white/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 0.8 }}
          />
          
          {/* Success Particles - Orange/Gold */}
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2 + "px",
                height: Math.random() * 4 + 2 + "px",
                background: i % 2 === 0 ? '#F04A06' : '#D4AF37',
              }}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 120}%`,
                y: `${50 + (Math.random() - 0.5) * 120}%`,
                scale: Math.random() * 4 + 1,
                opacity: [1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.04,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════════════════════════════ */
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
        className="w-full origin-top transition-all duration-150"
        style={{
          height: `${progress}%`,
          background: "linear-gradient(to bottom, #0d1f0d, #1E301E, #D4AF37, #2E7D32, #D4AF37)"
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CURSOR LIGHT EFFECT
════════════════════════════════════════════════════════════ */
function CursorLight() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleMouseLeave = () => setIsVisible(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9998]"
      style={{
        left: position.x - 150,
        top: position.y - 150,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,74,6,0.12) 0%, rgba(212,175,55,0.08) 40%, transparent 70%)",
        filter: "blur(20px)",
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════════════════════════ */
function HeroSection({ apiPrograms, loading }) {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const headlines = [
    "Empowering the Future Through Research & Smart IT",
    "Transforming Ideas into Scalable Digital Solutions",
    "Building Tomorrow's Tech Leaders, Today",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
   <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F7F4EF]">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    {/* <img
      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=100"
      alt="Team collaborating on technology"
      className="w-full h-full object-cover"
    /> */}
    {/* Overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/55 via-white/40 to-[#F7F4EF]/70" />
    <div className="absolute inset-0 bg-gradient-to-tr from-[#F04A06]/10 to-[#D4AF37]/5" />
  </div>

  {/* Animated Gradient Overlay */}
  <div className="absolute inset-0 z-0">
    <motion.div
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,213,184,0.2)_0%,_transparent_70%)]"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,175,55,0.15)_0%,_transparent_60%)]"
      animate={{
        scale: [1.1, 1, 1.1],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
    />
  </div>

  {/* Floating Particles */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-[#D4AF37]/30"
        style={{
          width: Math.random() * 6 + 2 + "px",
          height: Math.random() * 6 + 2 + "px",
          left: Math.random() * 100 + "%",
          top: Math.random() * 100 + "%",
        }}
        animate={{
          y: [0, -30 - Math.random() * 40, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 3,
        }}
      />
    ))}
  </div>

  {/* Glowing Orbs */}
  <motion.div
    className="absolute top-20 left-10 w-64 h-64 rounded-full pointer-events-none z-0"
    style={{
      background: "radial-gradient(circle, rgba(240,74,6,0.08) 0%, transparent 70%)",
      filter: "blur(40px)",
    }}
    animate={{
      x: [0, 30, 0],
      y: [0, 20, 0],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  <motion.div
    className="absolute bottom-20 right-10 w-80 h-80 rounded-full pointer-events-none z-0"
    style={{
      background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
      filter: "blur(50px)",
    }}
    animate={{
      x: [0, -30, 0],
      y: [0, -20, 0],
      scale: [1, 1.3, 1],
    }}
    transition={{
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    }}
  />

  {/* Main Content */}
  <div className="relative z-10 text-center px-4 sm:px-6 max-w-7xl mx-auto mt-16 sm:mt-20 lg:mt-24 pb-16 sm:pb-20 lg:pb-24">
    {/* Tagline with Pulse Effect */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-2 border border-[#F04A06]/14 rounded-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 mb-4 sm:mb-6 md:mb-8 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-3 h-3 sm:w-3.5 md:w-4 text-[#D4AF37]" />
      </motion.div>
      <span className="text-[10px] sm:text-xs md:text-sm text-[#F04A06] font-bold tracking-wide">
        Innovation Through Technology
      </span>
    </motion.div>

    {/* Heading with Gradient Text Effect */}
    <AnimatePresence mode="wait">
      <motion.h1
        key={headlineIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-[clamp(1.5rem,5vw,4.8rem)] font-black leading-[1.08] tracking-tight mb-3 sm:mb-4 md:mb-6 min-h-[clamp(60px,15vw,240px)] px-2"
      >
        <span className="bg-gradient-to-r from-[#1A1A1A] via-[#F04A06] to-[#1A1A1A] bg-clip-text text-transparent bg-300% animate-gradient">
          {headlines[headlineIndex]}
        </span>
      </motion.h1>
    </AnimatePresence>

    {/* Description */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-xs sm:text-sm md:text-base lg:text-lg text-[#555] max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4"
    >
      A technology-driven organization specializing in IT services, pioneering R&D, and transformative EdTech solutions—shaping the future of innovation.
    </motion.p>

    {/* Buttons */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-5xl mx-auto"
    >
      {/* Get Started */}
      <motion.button
        whileHover={{ 
          scale: 1.05, 
          boxShadow: "0 20px 60px rgba(240,74,6,0.4)",
          y: -2,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" })}
        className="relative flex-shrink-0 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-[#F04A06] text-white rounded-full font-bold text-xs sm:text-sm shadow-xl shadow-[#F04A06]/30 hover:bg-[#D94A06] transition-all flex items-center justify-center gap-2 overflow-hidden group"
      >
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <span className="relative z-10">Get Started</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative z-10"
        >
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.span>
      </motion.button>

      {/* Learn More */}
      <motion.button
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 10px 40px rgba(240,74,6,0.15)",
          y: -2,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="flex-shrink-0 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 border-2 border-[#F04A06] text-[#F04A06] rounded-full font-bold text-xs sm:text-sm bg-white hover:bg-[#FFF4ED] transition-all flex items-center justify-center"
      >
        Learn More
      </motion.button>

      {/* Join Community */}
      <motion.div 
        whileHover={{ 
          scale: 1.05,
          y: -2,
        }} 
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0"
      >
        <Link to="/joinCommunity">
          <button className="relative px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-[#D4AF37] to-[#F04A06] text-white rounded-full font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 overflow-hidden group">
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5,
              }}
            />
            <span className="relative z-10">Join Community</span>
          </button>
        </Link>
      </motion.div>

      {/* Sunday AI + Robotics */}
      <motion.div 
        whileHover={{ 
          scale: 1.05,
          y: -2,
        }} 
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0"
      >
        <Link to="/sundayRobotics">
          <button className="relative px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-[#D4AF37] to-[#F04A06] text-white rounded-full font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 overflow-hidden group">
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                delay: 1,
              }}
            />
            <span className="relative z-10">Sunday AI + Robotics</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="relative z-10"
            >
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.span>
          </button>
        </Link>
      </motion.div>
    </motion.div>
  </div>

  {/* Enhanced Scroll Indicator */}
  <motion.div
    className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
    animate={{ y: [0, 8, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
    onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" })}
  >
    <div className="relative w-5 h-8 sm:w-6 sm:h-10 md:w-7 md:h-12 border-2 border-[#F04A06]/28 rounded-full flex justify-center hover:border-[#F04A06]/60 transition-colors">
      <motion.div
        className="w-1 h-2 sm:w-1.5 sm:h-3 bg-[#D4AF37] rounded-full mt-2 sm:mt-3"
        animate={{
          y: [0, 12, 0],
          opacity: [1, 0.3, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </div>
  </motion.div>
</section>
  );
}

/* ════════════════════════════════════════════════════════════
   SERVICES SECTION WITH AUTO-ROTATE
════════════════════════════════════════════════════════════ */
function ServicesSection() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Auto-rotate every 3 seconds
  useEffect(() => {
    if (hovered) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % SERVICES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hovered]);

  return (
    <section id="services-section" className="py-28 px-4 sm:px-6 overflow-hidden relative bg-gradient-to-b from-white to-[#FFF4ED]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-lg sm:text-xl font-bold tracking-wide text-[#D4AF37]"
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2.2rem,4.5vw,4rem)] font-black mt-2 text-[#F04A06]"
          >
            Transforming Ideas into Reality
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="w-full">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl p-8 border bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{
                  boxShadow: [
                    `inset 0 0 0 0 ${SERVICES[active].accent}40`,
                    `inset 0 0 50px ${SERVICES[active].accent}20`,
                    `inset 0 0 0 0 ${SERVICES[active].accent}40`,
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="p-4 rounded-2xl"
                  style={{ background: `${SERVICES[active].accent}22` }}
                >
                  {(() => {
                    const Icon = SERVICES[active].icon;
                    return <Icon className="w-8 h-8" style={{ color: SERVICES[active].accent }} />;
                  })()}
                </motion.div>
                <h3 className="text-2xl lg:text-3xl font-black text-[#1A1A1A]">
                  {SERVICES[active].title}
                </h3>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {SERVICES[active].fullDesc}
              </p>

              <div className="space-y-2.5 mb-7">
                {SERVICES[active].features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: SERVICES[active].accent }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                    <span className="text-sm text-gray-600">{f}</span>
                  </motion.div>
                ))}
              </div>

              <Link to={SERVICES[active].path}>
                <motion.button
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-2 text-sm font-bold"
                  style={{ color: SERVICES[active].accent }}
                >
                  Explore Service <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              <div className="mt-6 pt-5 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{active + 1} / {SERVICES.length}</span>
                  <div className="flex gap-2">
                    {SERVICES.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setActive(i)}
                        className="h-1.5 rounded-full transition-all"
                        animate={{
                          width: i === active ? 24 : 6,
                          background: i === active ? SERVICES[active].accent : "rgba(0,0,0,0.2)",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SERVICES.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.button
                    key={svc.id}
                    onClick={() => setActive(i)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      active === i
                        ? `bg-white shadow-lg`
                        : "bg-white/60 border-gray-200 hover:shadow-md"
                    }`}
                    style={active === i ? { borderColor: svc.accent, boxShadow: `0 8px 30px ${svc.accent}30` } : {}}
                  >
                    <motion.div
                      animate={active === i ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 rounded-lg inline-block mb-2"
                      style={{ background: `${svc.accent}1e` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: svc.accent }} />
                    </motion.div>
                    <h4 className="text-xs font-bold text-[#1A1A1A] mb-1">{svc.title}</h4>
                    <p className="text-[10px] text-gray-500">{svc.shortDesc}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   STATS SECTION WITH ANIMATED COUNTERS
════════════════════════════════════════════════════════════ */
function StatsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden bg-[#FFF4ED]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase"
          >
            Company Impact
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] mt-2"
          >
            Our Impact in Numbers
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS_DATA.map((s, i) => {
            const Icon = s.icon;
            const numericValue = parseInt(s.value.replace(/\D/g, ""));
            const suffix = s.value.replace(/[0-9]/g, "");
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-xl transition-all hover:border-[#D4AF37]"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="inline-flex justify-center mb-5"
                >
                  <div className="bg-[#F04A06] p-3 rounded-xl shadow-lg shadow-[#F04A06]/22">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                
                <h3 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-1">
                  <AnimatedCounter target={numericValue} duration={2000} suffix={suffix} />
                </h3>
                
                <p className="text-[#F04A06] uppercase tracking-widest text-[11px] font-bold mb-1">
                  {s.label}
                </p>
                <p className="text-xs text-gray-400">{s.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   PROGRAMS SECTION
════════════════════════════════════════════════════════════ */
function ProgramsSection() {
  return (
    <section id="programs" className="py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase"
          >
            Our Core Programs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] mt-2"
          >
            Programs We Deliver
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link to={p.link}>
                  <div className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/20 backdrop-blur-sm"
                      >
                        <Icon className="w-5 h-5 text-white" style={{ color: p.accent }} />
                      </motion.div>
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-1.5">{p.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-1.5 mt-3 text-sm font-bold text-[#F04A06]"
                      >
                        Explore <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   WHY US SECTION
════════════════════════════════════════════════════════════ */
function WhyUsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden bg-[#F7F4EF]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase"
          >
            Why Stackenzo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] mt-2"
          >
            Why Choose Stackenzo
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all hover:border-[#D4AF37]"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="inline-flex justify-center mb-6"
                >
                  <div className="p-4 rounded-2xl bg-[#FFF4ED]">
                    <Icon className="w-7 h-7 text-[#F04A06]" />
                  </div>
                </motion.div>
                <h3 className="text-lg font-black text-[#1A1A1A] mb-3">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   ABOUT SECTION
════════════════════════════════════════════════════════════ */
function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase"
          >
            About Stackenzo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06] mt-2"
          >
            Our Mission & Vision
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all hover:border-[#D4AF37]"
          >
            <div className="flex items-center gap-4 mb-7">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="bg-[#F04A06] p-3 rounded-xl shadow-lg shadow-[#F04A06]/18"
              >
                <Target className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-2xl font-black text-[#F04A06]">Our Mission</h3>
            </div>
            <ul className="space-y-4 text-gray-700 text-sm leading-relaxed">
              {[
                "Deliver innovative, scalable and future-ready technology solutions that address real-world business challenges.",
                "Drive digital transformation through advanced IT services, research-driven development and emerging technologies.",
                "Bridge the gap between academic learning and industry requirements through practical innovation and implementation.",
                "Empower businesses, institutions and startups with intelligent, secure and efficient digital solutions.",
                "Foster a culture of continuous innovation, research excellence and technological advancement.",
                "Promote skill development and future-focused learning to prepare individuals and organizations for a technology-driven world.",
                "Create sustainable value through quality, integrity, customer-centricity and long-term partnerships."
              ].map((text, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex gap-3"
                >
                  <span className="text-[#F04A06] font-bold">•</span>
                  <span>{text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all hover:border-[#D4AF37]"
          >
            <div className="flex items-center gap-4 mb-7">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="bg-[#F04A06] p-3 rounded-xl shadow-lg shadow-[#F04A06]/18"
              >
                <Eye className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-2xl font-black text-[#F04A06]">Our Vision</h3>
            </div>
            <p className="text-sm text-gray-600 leading-[1.5] text-justify mb-8">
              To become a leading innovation-driven technology ecosystem where IT services, R&D and EdTech converge to create meaningful impact. We aim to advance applied research, transform breakthrough ideas into scalable digital solutions and deliver intelligent systems that empower businesses and learners alike. By integrating technological excellence with innovation and education, we strive to shape a smarter, more connected future.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl p-5 bg-[#FFF4ED]"
            >
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-[#D4AF37]" />
              <p className="text-sm text-[#1A1A1A] italic leading-relaxed pl-3">
                "Through this innovation backbone, we strive to redefine education by integrating practical learning, industry exposure, and technology-enabled experiences — empowering the next generation to learn, build and inspire."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   TESTIMONIALS SECTION
════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx((prev) => (prev + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials-section" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-white via-[#fff5f0] to-white">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.5rem)] font-black mt-2 text-gray-900"
          >
            What People Say
          </motion.h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 md:p-12"
          >
            <div className="text-[#F04A06] text-7xl font-black leading-none mb-4 opacity-20">"</div>
            <p className="text-lg md:text-xl text-gray-600 italic leading-relaxed mb-8">
              {TESTIMONIALS[idx].quote}
            </p>

            <div className="flex items-center gap-5">
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                src={TESTIMONIALS[idx].img}
                alt={TESTIMONIALS[idx].name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#F04A06]"
              />
              <div>
                <h4 className="text-base font-bold text-gray-900">{TESTIMONIALS[idx].name}</h4>
                <p className="text-sm text-gray-500">{TESTIMONIALS[idx].role}</p>
              </div>
              <div className="ml-auto flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Star className="w-4 h-4 fill-[#F04A06] text-[#F04A06]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2.5 mt-7">
          {TESTIMONIALS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all"
              animate={{
                width: i === idx ? 28 : 8,
                background: i === idx ? "#F04A06" : "rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   CTA SECTION
════════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=100"
          alt="Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#E66B26]/90 to-[#C5531A]/93" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 border border-[#D4AF37]/38 rounded-full px-5 py-2 mb-8 bg-[#D4AF37]/10 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm text-[#D4AF37] font-bold">Join Thousands of Innovators</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[clamp(2rem,5vw,4rem)] font-black text-white mb-6 leading-tight"
        >
          Ready to Shape the Future with Us?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/78 mb-10 max-w-2xl mx-auto"
        >
          Start your journey with Stackenzo today
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
        >
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" })}
  className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-[#F04A06] rounded-full font-black shadow-2xl shadow-white/18 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
>
  Start Your Journey
  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
</motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/Contact">
              <button className="px-10 py-4 border-2 border-white/58 text-white rounded-full font-black hover:border-white hover:bg-white/10 transition-colors">
                Schedule a Call
              </button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/joinCommunity">
              <button className="px-9 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F04A06] text-white rounded-full font-bold text-sm shadow-xl hover:shadow-2xl transition-all">
                Join Our Community
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   HOME ROOT
════════════════════════════════════════════════════════════ */
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [apiPrograms] = useState([]);
  const [programsLoading] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showEventsModal ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showEventsModal]);

  return (
    <>
      <AnimatePresence>
        {!loaded && <PageLoader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <div className="bg-white text-[#1A1A1A] font-sans overflow-x-hidden relative">
        {/* <CursorLight /> */}
        <ScrollProgressBar />
        <Toast message={toast.message} isVisible={toast.show} onClose={() => setToast({ show: false, message: "" })} />
        <Navbar />

        <HeroSection apiPrograms={apiPrograms} loading={programsLoading} />
        <ServicesSection />
        <StatsSection />
        <ProgramsSection />
        <WhyUsSection />
        <AboutSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />

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
            href="https://wa.me/919247577907"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-[#F04A06] text-white rounded-full shadow-2xl border border-[#F04A06] hover:bg-[#D94A06] transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.a>
        </motion.div>

        <ScrollToTop />

        {/* Events Modal */}
        <AnimatePresence>
          {showEventsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 30 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-100"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#FFF4ED] to-white">
                  <div>
                    <h2 className="text-2xl font-black flex items-center gap-2 text-[#1A1A1A]">
                      <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                      <span className="bg-gradient-to-r from-[#F04A06] to-[#F04A06] bg-clip-text text-transparent">Upcoming Events</span>
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Don't miss out on these exciting opportunities!</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEventsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  <p className="text-center py-8 text-gray-400">No upcoming events at the moment.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}