import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, Lightbulb, Users, Award, ChevronDown, Target, Zap, BookOpen,
  Microscope, Atom, Beaker, FlaskConical, Cpu, Globe2, Network,
  Sparkles, CheckCircle, Rocket, TrendingUp, Clock, HeadphonesIcon,
  FileText, GraduationCap, Building2, Briefcase, Share2, BookMarked,
  Layers, Code, Database, Cloud, Shield, Bot, Brain, FolderOpen, ChevronRight, ArrowRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import rndData from "./data/rndData.json";
import RNDApplicationModal from "./RNDApplicationModal";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   NAV
══════════════════════════════════════════════ */
const NAV_SECTIONS = ["rnd-hero", "rnd-stats", "rnd-domains", "rnd-projects", "rnd-eligibility", "rnd-faq"];
const NAV_LABELS   = ["Hero", "Stats", "Domains", "Projects", "Apply", "FAQ"];

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const RESEARCH_DOMAINS = [
  { title:"AI & ML", icon:Brain,     color:"from-blue-600 to-cyan-600",    desc:"Advanced AI and intelligent systems for real-world applications",           areas:["Computer Vision","Natural Language Processing","Reinforcement Learning","Neural Networks","Generative AI","Edge AI"] },
  { title:"Internet of Things (IoT)",                   icon:Network,   color:"from-emerald-600 to-teal-600", desc:"Connected devices, smart systems, and edge computing for intelligent infrastructure",                   areas:["Smart Cities","Industrial IoT","Healthcare IoT","Agricultural IoT","Wearable Technology","Vehicle Telematics"] },
  { title:"Robotics & Automation",                      icon:Bot,       color:"from-purple-600 to-pink-600",  desc:"Autonomous systems, robotic control, and intelligent automation for industry 4.0",                     areas:["Autonomous Vehicles","Service Robots","Industrial Automation","Swarm Robotics","Human-Robot Interaction","Soft Robotics"] },
  { title:"Cybersecurity",                              icon:Shield,    color:"from-red-600 to-rose-600",     desc:"Information security, threat detection, and secure systems for digital protection",                      areas:["Blockchain Security","IoT Security","AI-based Threat Detection","Cryptography","Zero Trust Architecture","Cloud Security"] },
  { title:"Sustainable Technology",                     icon:Globe2,    color:"from-teal-600 to-cyan-600",    desc:"Green computing, renewable energy systems, and environmental solutions for sustainability",              areas:["Smart Grid","Energy Optimization","Environmental Monitoring","Waste Management","Carbon Capture Tech","Circular Economy"] },
  { title:"Healthcare Technology",                      icon:Microscope,color:"from-indigo-600 to-purple-600",desc:"Medical devices, health informatics, and telemedicine solutions for better healthcare",                 areas:["Medical Imaging","Wearable Health Devices","Telemedicine","Drug Discovery","Bioinformatics","Digital Therapeutics"] },
  { title:"Quantum Computing",                          icon:Atom,      color:"from-violet-600 to-purple-600",desc:"Quantum algorithms, quantum machine learning, and quantum simulation for breakthrough computing",        areas:["Quantum Algorithms","Quantum Machine Learning","Quantum Simulation","Quantum Cryptography","Quantum Hardware","Error Correction"] },
  { title:"Blockchain Technology",                      icon:Layers,    color:"from-orange-600 to-red-600",   desc:"Distributed ledger technology, smart contracts, and decentralized applications",                         areas:["Smart Contracts","DeFi","NFTs","Supply Chain","Digital Identity","Consensus Mechanisms"] },
];

const METHODOLOGY = [
  { step:"01", title:"Problem Identification",   desc:"Identify real-world problems and research gaps through systematic literature review and industry analysis", icon:Search,   color:"from-blue-600 to-cyan-600",     deliverables:["Literature Review","Gap Analysis","Problem Statement","Research Questions"] },
  { step:"02", title:"Research Planning",        desc:"Develop comprehensive research methodology, timeline, and resource allocation for systematic investigation",   icon:FileText, color:"from-emerald-600 to-teal-600", deliverables:["Methodology Design","Timeline Planning","Resource Allocation","Ethics Approval"] },
  { step:"03", title:"Prototype Development",    desc:"Build proof-of-concept solutions using cutting-edge technologies and frameworks for rapid validation",               icon:Code,     color:"from-purple-600 to-pink-600",   deliverables:["Proof of Concept","Minimum Viable Product","Technical Documentation","Architecture Design"] },
  { step:"04", title:"Testing & Validation",     desc:"Rigorous testing, performance evaluation, and industry-standard validation",           icon:Beaker,   color:"from-orange-600 to-red-600",    deliverables:["Test Reports","Performance Metrics","Benchmark Results","Validation Studies"] },
  { step:"05", title:"Publication & Patent",     desc:"Document findings in research papers, conferences, and patent applications for IP protection",                 icon:FileText, color:"from-indigo-600 to-purple-600",deliverables:["Research Papers","Conference Presentations","Patent Filings","Technical Reports"] },
  { step:"06", title:"Commercialization",        desc:"Transform research outcomes into market-ready products and solutions for real-world impact",                   icon:Rocket,   color:"from-red-600 to-rose-600",      deliverables:["Market Analysis","Business Model","Product Launch","Industry Partnerships"] },
];

const OUTCOMES = [
  { icon:FileText, title:"Research Papers",  count:"50+", desc:"Published in top-tier conferences and journals",       color:"from-blue-600 to-cyan-600"    },
  { icon:Award,    title:"Patents Filed",    count:"25+", desc:"Intellectual property protection for innovations",      color:"from-purple-600 to-pink-600"  },
  { icon:Rocket,   title:"Products Launched",count:"15+", desc:"Commercial products derived from research",             color:"from-orange-600 to-red-600"   },
  { icon:Users,    title:"Industry Partners",count:"30+", desc:"Collaborations with leading companies",                 color:"from-emerald-600 to-teal-600" },
];

const ELIGIBILITY = [
  { category:"Students",     icon:GraduationCap, color:"from-blue-600 to-cyan-600",    requirements:["Passion for learning and growth","Passion for research and innovation","Basic programming knowledge","Research proposal submission"] },
  { category:"Professionals",icon:Briefcase,     color:"from-emerald-600 to-teal-600", requirements:["Relevant technical background","Commitment to research goals","Available for part-time engagement","Industry problem proposal"] },
];

const FAQS = [
  { q:"What is the selection process for R&D programs?",    a:"Selection involves application review, technical interview, and project proposal presentation. We evaluate technical skills, research aptitude, and commitment to the research area." },
  { q:"Do I get paid during the R&D program?",              a:"Yes, we provide competitive stipends for all researchers based on their qualifications and experience. Performance-based incentives are also available for exceptional contributions." },
  { q:"Can I publish research papers from the work?",       a:"Absolutely! We strongly encourage publication and provide full support for conference submissions, journal publications, and presentation opportunities." },
  { q:"What happens to intellectual property rights?",      a:"IP rights are shared between Stackenzo and researchers based on contribution levels, with clear agreements signed upfront. We follow industry-standard IP policies." },
  { q:"Is remote participation possible?",                  a:"Yes, many projects support remote work with virtual collaboration tools. However, some hardware-intensive projects may require occasional on-site presence." },
  { q:"What kind of mentorship will I receive?",            a:"Each researcher is assigned a dedicated mentor (PhD holder or industry expert) who provides weekly one-on-one guidance, technical reviews, and career advice." },
];

const MENTORSHIP_ITEMS = [
  "Daily & weekly one-on-one mentoring sessions","Access to research publications and resources",
  "Networking with industry professionals","Conference presentation opportunities",
  "Co-authorship on research papers","Career guidance",
];

const INNOVATION_ITEMS = [
  "Problem-focused research addressing industry challenges",
  "Rapid prototyping and iterative development",
  "Publication in top-tier conferences and journals",
  "Technology transfer and commercialization",
];

/* ══ STATIC VERSIONS OF COMPONENTS ══ */
function Reveal({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function StaggerContainer({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Float({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function GlowCard({ children, className = "" }) {
  return <div className={`relative rounded-2xl overflow-hidden ${className}`}>{children}</div>;
}

function TiltCard({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function MagBtn({ children, className = "", onClick }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

/* ══ COUNTER ══ */
function Counter({ value }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false });
  const raw = String(value).replace(/[^0-9.]/g,"");
  const num = parseFloat(raw)||0;
  const sfx = String(value).replace(/[0-9.]/g,"");
  const mv  = useMotionValue(0);
  const sp  = useSpring(mv,{stiffness:55,damping:14});
  const [d,setD] = useState(0);
  useEffect(()=>{ mv.set(inV?num:0); },[inV]);
  useEffect(()=> sp.on("change",v=>setD(Math.round(v))),[sp]);
  return <span ref={ref}>{d}{sfx}</span>;
}

/* ══ SCROLL PROGRESS BAR ══ */
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

/* ══ SECTION NAV DOTS ══ */
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
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          className="relative flex items-center justify-center"
          title={NAV_LABELS[i]}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              active === i ? "bg-[#D4AF37] scale-125" : "bg-[#F04A06]/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ══ NOISE CANVAS ══ */
function NoiseCanvas({ color1="#FFD5B8", color2="#FFF4ED", opacity=0.32 }) {
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d"); let t=0,id;
    const draw=()=>{
      const w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
      const g=ctx.createRadialGradient(w*(.3+.22*Math.sin(t*.38)),h*(.3+.16*Math.cos(t*.28)),0,w*.5,h*.5,Math.max(w,h)*.88);
      g.addColorStop(0,color1+"cc"); g.addColorStop(.5,color2+"88"); g.addColorStop(1,"transparent");
      ctx.clearRect(0,0,w,h); ctx.fillStyle=g; ctx.fillRect(0,0,w,h); t+=.007; id=requestAnimationFrame(draw);
    };
    draw(); return()=>cancelAnimationFrame(id);
  },[color1,color2]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{opacity}}/>;
}

/* ══ PARTICLE CANVAS ══ */
function ParticleCanvas({ count=20, color="rgba(230,107,38,0.08)" }) {
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
    const pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.36,vy:(Math.random()-.5)*.36,r:Math.random()*1.7+.7}));
    let id;
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=color; ctx.fill(); });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<88){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=color.replace(/[\d.]+\)$/,`${(1-d/88)*.055})`); ctx.stroke(); }
      }
      id=requestAnimationFrame(draw);
    };
    draw();
    const rz=()=>{w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;};
    window.addEventListener("resize",rz);
    return()=>{ cancelAnimationFrame(id); window.removeEventListener("resize",rz); };
  },[count,color]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none"/>;
}

/* ══ SPOTLIGHT ══ */
function Spotlight({ color="rgba(212,175,55,0.06)", size=580 }) {
  const ref=useRef(null);
  useEffect(()=>{
    const fn=e=>{ if(!ref.current) return; const r=ref.current.getBoundingClientRect(); ref.current.style.background=`radial-gradient(${size}px circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn);
  },[color,size]);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]"/>;
}

/* ══ WAVE DIVIDER ══ */
function WaveDivider({ color="#D4AF37", flip=false, toBg="#fff" }) {
  return (
    <div className={`relative w-full overflow-hidden ${flip?"rotate-180":""}`} style={{height:52}}>
      <svg viewBox="0 0 1440 52" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26 L1440,52 L0,52 Z" fill={toBg}/>
        <path d="M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26" stroke={color} strokeWidth="1.5" fill="none"/>
      </svg>
    </div>
  );
}

/* ══ SECTION LABEL ══ */
function SLabel({ text }) {
  return (
    <div className="flex items-center gap-3 justify-center mb-3">
      <div className="h-px w-8 bg-[#D4AF37]" />
      <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">{text}</span>
      <div className="h-px w-8 bg-[#D4AF37]" />
    </div>
  );
}

/* ══ STATIC HEADING ══ */
function Heading({ children, className = "" }) {
  return <h2 className={className}>{children}</h2>;
}

/* ══════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════ */
function RND() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  const projects = rndData.projects;
  const projectGroups = {
    "GSIN": { title:"GSIN - Global Student Industry Network", desc:"Large-scale virtual learning ecosystem connecting students with industry", projects:projects.filter(p=>p.id==="gsin-global-student-industry-network") },
    "Virtual Projects": { title:"Virtual Projects", desc:"2D digital twins and virtual collaboration platforms", projects:projects.filter(p=>["virtual-office","virtual-industry","virtual-campus"].includes(p.id)) },
    "Stackenzo Eye Vision": { title:"Stackenzo Eye Vision", desc:"AI-powered surveillance and computer vision solutions", projects:projects.filter(p=>["ai-attendance-monitoring","ai-class-lab-assistance","stackenzo-retro-tracking","stackenzo-person-tracking-alert"].includes(p.id)) },
  };

  /* Hero parallax */
  const heroRef=useRef(null);
  const {scrollYProgress:heroP}=useScroll({target:heroRef,offset:["start start","end start"]});
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const heroY=useTransform(heroP,[0,1],[0,-110]);
  const heroO=useTransform(heroP,[0,.6],[1,0.9]);
  const heroS=useTransform(heroP,[0,1],[1,.84]);
  const bigY =useTransform(heroP,[0,1],[0,180]);

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <ScrollProgressBar/>
      <SectionNavDots/>
      <Navbar/>

      {/* ═══ HERO ═══ */}
      <section id="rnd-hero" ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-[#FFF4ED] via-white to-[#FFF0E6]/30">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.28}/>
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={18} color="rgba(230,107,38,0.07)"/></div>

        <div className="absolute inset-0 z-[2] opacity-[.03]"
          style={{backgroundImage:"radial-gradient(circle,#F04A06 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>

        {/* Blobs */}
        <div className="absolute top-16 left-[5%] w-80 h-80 pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[100px] opacity-[.3]" style={{background:"radial-gradient(circle,#FFD5B8,transparent)"}}/>
        </div>
        <div className="absolute bottom-16 right-[5%] w-[420px] h-[420px] pointer-events-none z-[2]">
          <div className="w-full h-full rounded-full blur-[110px] opacity-[.16]" style={{background:"radial-gradient(circle,#D4AF37,transparent)"}}/>
        </div>

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }} className="max-w-6xl mx-auto text-center relative z-10 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/88 backdrop-blur-sm border border-gray-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-7 shadow-sm">
            <Microscope className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]"/>
            <span className="text-sm sm:text-base text-[#F04A06] font-semibold">Research & Development Division</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/70"/>
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-5 leading-[1.06]">
            <span className="text-gray-900">Engineering Innovation</span>
            <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] via-[#C5531A] to-[#F04A06]">Through Applied Research</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-3xl mx-auto mb-9 px-4 leading-relaxed">
            We Explore, Experiment and Engineer cutting-edge solutions that transform real-world challenges into scalable technological breakthroughs.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2 mb-12">
            <button onClick={()=>window.location.href="/Career"}
              className="group relative w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 bg-[#F04A06] text-white rounded-full text-xs sm:text-sm font-black overflow-hidden shadow-xl shadow-[#F04A06]/22">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Apply for R&amp;D Program
                <ArrowRight className="w-4 h-4"/>
              </span>
            </button>
            <button onClick={()=>document.getElementById("rnd-projects")?.scrollIntoView({behavior:"smooth"})}
              className="w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 border-2 border-[#F04A06] text-[#F04A06] rounded-full text-xs sm:text-sm font-black hover:bg-[#F04A06] hover:text-white transition-all">
              Explore Research Projects
            </button>
          </div>

          {/* Scroll cue */}
          <div style={{ opacity: scrollOpacity }} className="flex justify-center cursor-pointer"
            onClick={()=>document.getElementById("rnd-stats")?.scrollIntoView({behavior:"smooth"})}>
            <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#F04A06] transition-colors">
              <span className="text-[10px] sm:text-xs font-medium">Explore Research</span>
              <div className="w-7 h-12 border-2 border-[#F04A06]/22 rounded-full flex justify-center">
                <div className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-3" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ STATS ═══ */}
      <WaveDivider color="#D4AF37" toBg="#f9fafb"/>
      <section id="rnd-stats" className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF4ED" opacity={0.2}/>
        <Spotlight color="rgba(230,107,38,0.04)" size={480}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Research Impact"/>
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Our Research Achievements
            </Heading>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {OUTCOMES.map((stat,i)=>{const Icon=stat.icon; return (
              <div key={i} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-lg transition-shadow hover:-translate-y-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-lg bg-emerald-50 flex items-center justify-center border border-[#D4AF37]/28">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]"/>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1"><Counter value={stat.count}/></div>
                <div className="text-xs sm:text-sm font-black text-[#F04A06] mb-1">{stat.title}</div>
                <p className="text-[10px] sm:text-xs text-gray-500">{stat.desc}</p>
              </div>
            );})}
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#FFF4ED"/>

      {/* ═══ RESEARCH DOMAINS ═══ */}
      <section id="rnd-domains" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.2}/>
        <Spotlight color="rgba(230,107,38,0.04)" size={500}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Research Domains"/>
            <Heading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Research Domains
            </Heading>
            <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">Exploring cutting-edge technologies across multiple disciplines</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {RESEARCH_DOMAINS.map((d,i)=>{const Icon=d.icon; return (
              <div key={i} className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow hover:-translate-y-1">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${d.color} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                </div>
                <h3 className="text-sm sm:text-base font-black text-gray-900 mb-2">{d.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-2">{d.desc}</p>
                <div className="space-y-1">
                  {d.areas.slice(0,4).map((area,j)=>(
                    <div key={j} className="flex items-center gap-1 sm:gap-2">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0"/>
                      <span className="text-[10px] sm:text-xs text-gray-500">{area}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1 w-0 bg-gradient-to-r from-[#D4AF37] to-[#F04A06] group-hover:w-full transition-all duration-300" />
              </div>
            );})}
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#f9fafb"/>

      {/* ═══ INNOVATION SECTION ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" size={480}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            <div className="lg:w-1/2">
              <Heading className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A] mb-4">
                Innovation Through Research
              </Heading>
              <div className="w-16 h-[3px] bg-[#D4AF37] mb-5 rounded"/>
              <p className="text-sm sm:text-base text-gray-500 mb-6 leading-relaxed">
                Our Research & Development division focuses on cutting-edge technology solutions that address real-world challenges. We combine academic rigor with industry relevance to create impactful innovations that shape the future.
              </p>
              <div className="space-y-3">
                {INNOVATION_ITEMS.map((item,i)=>(
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0 mt-0.5"/>
                    <span className="text-xs sm:text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all"/>
                <div className="relative bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-lg">
                  <img src="https://i.pinimg.com/originals/2a/53/65/2a53651a35816f499270d8275fd5318f.gif" alt="Research" className="w-full h-auto rounded-xl"/>
                  <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-lg">
                    <p className="text-[#D4AF37] font-black text-sm sm:text-base">Research &amp; Innovation Lab</p>
                    <p className="text-gray-300 text-xs">Pushing the boundaries of technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ METHODOLOGY ═══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.18}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="How We Research"/>
            <Heading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Research Methodology
            </Heading>
            <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">A systematic approach to research and innovation</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {METHODOLOGY.map((s,i)=>{const Icon=s.icon; return (
              <div key={i} className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md`}>
                    {s.step}
                  </div>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]"/>
                </div>
                <h3 className="text-sm sm:text-base font-black text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3">{s.desc}</p>
                <div className="space-y-1">
                  {s.deliverables.map((d,j)=>(
                    <div key={j} className="flex items-center gap-1.5">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0"/>
                      <span className="text-[10px] sm:text-xs text-gray-500">{d}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1 w-0 bg-gradient-to-r from-[#D4AF37] to-[#F04A06] group-hover:w-full transition-all duration-300" />
              </div>
            );})}
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#f9fafb"/>

      {/* ═══ PROJECTS ACCORDION ═══ */}
      <section id="rnd-projects" className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" size={500}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Our Research"/>
            <Heading className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Research Projects
            </Heading>
            <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mt-4">Transforming real-world challenges through innovative research</p>
          </div>

          <div className="space-y-4">
            {Object.entries(projectGroups).map(([groupKey,group],gIdx)=>{
              const isExpanded=expandedGroups[groupKey];
              return (
                <div key={groupKey} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="p-5 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={()=>setExpandedGroups(p=>({...p,[groupKey]:!p[groupKey]}))}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#F04A06] rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">
                          {gIdx+1}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-0.5">{group.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{group.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="hidden sm:inline text-sm text-gray-400 font-medium">
                          {group.projects.length} {group.projects.length===1?"project":"projects"}
                        </span>
                        <div className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#F04A06]"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      <div className="p-5 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {group.projects.map((project,pi)=>(
                            <Link key={project.id} to={`/R_AND_D/${project.id}`}>
                              <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-[#F04A06]/40 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-black text-[#F04A06] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">{project.domain}</span>
                                  <span className="text-xs text-gray-400">{project.timeline}</span>
                                </div>
                                <h4 className="text-base font-black text-gray-900 mb-2">{project.title}</h4>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{project.desc}</p>
                                <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
                                  <p className="text-xs text-gray-600 line-clamp-1">
                                    <span className="text-[#F04A06] font-black">Impact: </span>{project.impact}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <Users className="w-3.5 h-3.5"/><span>{project.teamSize}</span>
                                  </div>
                                  <span className="text-xs text-[#F04A06] font-bold flex items-center gap-1">
                                    View Details <ChevronRight className="w-3 h-3"/>
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ ELIGIBILITY ═══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="rnd-eligibility" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.18}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Who Can Apply"/>
            <Heading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Who Can Apply
            </Heading>
            <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">Opportunities for students & professionals.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {ELIGIBILITY.map((item,i)=>{const Icon=item.icon; return (
              <div key={i} className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow hover:-translate-y-1">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#F04A06] flex items-center justify-center mb-4 shadow-md`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                </div>
                <h3 className="text-sm sm:text-base font-black text-gray-900 mb-2">{item.category}</h3>
                <div className="space-y-1.5">
                  {item.requirements.map((req,j)=>(
                    <div key={j} className="flex items-start gap-1.5">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0 mt-0.5"/>
                      <span className="text-[10px] sm:text-xs text-gray-500">{req}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1 w-0 bg-gradient-to-r from-[#D4AF37] to-[#F04A06] group-hover:w-full transition-all duration-300" />
              </div>
            );})}
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#f9fafb"/>

      {/* ═══ MENTORSHIP ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.04)" size={480}/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Mentorship"/>
            <Heading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Mentorship & Collaboration
            </Heading>
            <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4">Guided by experts, powered by collaboration</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-5">
              {[
                {icon:Users,    color:"bg-blue-50 border-blue-200",   iconCls:"text-blue-600",   title:"Industry Experts",    desc:"Guidance from seasoned professionals with decades of experience"},
                {icon:Lightbulb,color:"bg-emerald-50 border-emerald-200",iconCls:"text-emerald-600",title:"Academic Advisors",  desc:"PhD holders and research scientists providing academic rigor"},
                {icon:Award,    color:"bg-purple-50 border-purple-200",iconCls:"text-purple-600",  title:"Peer Learning",       desc:"Collaborative research environment with cross-domain exposure"},
              ].map((m,i)=>{const Icon=m.icon; return (
                <div key={i} className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 ${m.color} rounded-lg flex items-center justify-center border shrink-0 shadow-sm`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${m.iconCls}`}/>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-gray-900 mb-1">{m.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{m.desc}</p>
                  </div>
                </div>
              );})}
            </div>
            <div className="bg-emerald-50 p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm sm:text-base font-black text-[#F04A06] mb-4">Collaboration Benefits</h3>
              <div className="space-y-2.5">
                {MENTORSHIP_ITEMS.map((item,i)=>(
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] shrink-0"/>
                    <span className="text-xs sm:text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <WaveDivider color="#D4AF37" toBg="#FFF4ED"/>
      <section id="rnd-faq" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{background:"#FFF4ED"}}>
        <NoiseCanvas color1="#FFD5B8" color2="#FFCBA4" opacity={0.16}/>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="FAQ"/>
            <Heading className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Frequently Asked Questions
            </Heading>
            <div className="w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 rounded"/>
            <p className="text-sm sm:text-base text-gray-500 mt-3">Got questions about our R&amp;D program?</p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {FAQS.map((faq,i)=>(
              <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-[#D4AF37] transition-all shadow-sm">
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center transition-all gap-2 hover:bg-gray-50">
                  <h3 className="text-xs sm:text-sm font-black text-gray-900 pr-2">{faq.q}</h3>
                  <div className={`transform transition-transform duration-300 ${openFaq===i ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0"/>
                  </div>
                </button>
                {openFaq===i && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider color="#D4AF37" flip toBg="#f9fafb"/>

      {/* ═══ CTA ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <Spotlight color="rgba(230,107,38,0.03)" size={460}/>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[#F04A06]/85"/>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072')] bg-cover bg-center mix-blend-overlay opacity-70"/>
            <div className="absolute inset-0"><ParticleCanvas count={12} color="rgba(212,175,55,0.09)"/></div>
            <Spotlight color="rgba(212,175,55,0.07)" size={360}/>
            <div className="relative z-10 p-6 sm:p-8 md:p-10 text-center">
              <div className="inline-flex items-center gap-2 border border-[#D4AF37]/38 rounded-full px-4 py-2 mb-6 bg-[#D4AF37]/10 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-[#D4AF37]"/>
                <span className="text-sm text-[#D4AF37] font-bold">Collaborate on the Future</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-3">Collaborate on the Future of Innovation</h2>
              <p className="text-xs sm:text-sm md:text-base text-white/85 mb-7 max-w-2xl mx-auto">
                Join our research initiatives and turn visionary ideas into impactful solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <button onClick={()=>window.location.href="/Career"}
                  className="group relative w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 bg-[#F04A06] text-white rounded-full text-xs sm:text-sm font-black overflow-hidden shadow-xl">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Apply for R&amp;D Program
                    <ArrowRight className="w-4 h-4"/>
                  </span>
                </button>
                <button onClick={()=>window.open("/research-projects","_blank")}
                  className="group w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 bg-transparent border-2 border-[#D4AF37] text-white rounded-full text-sm sm:text-base font-black hover:bg-white hover:text-[#F04A06] transition-all flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5"/>
                  Explore Research Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RNDApplicationModal isOpen={showApplicationModal} onClose={()=>setShowApplicationModal(false)}/>
      <Footer/>
    </div>
  );
}

export default RND;