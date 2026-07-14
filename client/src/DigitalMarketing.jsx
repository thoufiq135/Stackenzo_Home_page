import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue, useVelocity,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp, Search, Share2, Mail, BarChart3, ChevronDown,
  Target, Users, Zap, X, CheckCircle, Rocket, Briefcase,
  Building2, GraduationCap, Sparkles, Award, Clock, HeadphonesIcon,
  PieChart, Radio, Megaphone, Globe, Smartphone, Eye, ChevronRight,
  Star, ArrowRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

/* ══════════════════════════════════════════════
   BRAND COLOR MAP
══════════════════════════════════════════════ */
const C = {
  dark:     "#F04A06",
  mid:      "#C5531A",
  gold:     "#D4AF37",
  light:    "#FFF4ED",
  text:     "#1A1A1A",
  tint:     "#FFD5B8",
  warmBg:   "#FFF0E6",
  veryDark: "#3D1A0A",
  p:  (a) => `rgba(230,107,38,${a})`,
  pd: (a) => `rgba(197,83,26,${a})`,
};

const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

const NAV_SECTIONS = ["dm-hero", "dm-stats", "dm-services", "dm-why", "dm-faq"];
const NAV_LABELS   = ["Top", "Stats", "Services", "Why Us", "FAQ"];

/* ══ SCROLL DIR ══ */
function useScrollDir() {
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const [dir, setDir] = useState("down");
  useEffect(() => vel.on("change", v => setDir(v > 0 ? "down" : "up")), [vel]);
  return dir;
}

/* ══ REVEAL - STATIC ══ */
function Reveal({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

/* ══ STAGGER - STATIC ══ */
function StaggerContainer({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

/* ══ FLOAT - STATIC ══ */
function Float({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

/* ══ GLOW CARD - STATIC ══ */
function GlowCard({ children, className = "" }) {
  return <div className={`relative rounded-2xl overflow-hidden ${className}`}>{children}</div>;
}

/* ══ TILT CARD - STATIC ══ */
function TiltCard({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

/* ══ MAG BTN - STATIC ══ */
function MagBtn({ children, className = "", onClick, type = "button", disabled = false }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
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
function NoiseCanvas({ color1 = C.tint, color2 = C.warmBg, opacity = 0.24 }) {
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
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} />;
}

/* ══ PARTICLE CANVAS ══ */
function ParticleCanvas({ count = 22, color = C.p(.08) }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth, h = c.height = c.offsetHeight;
    const pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38, r: Math.random() * 1.8 + .8 }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); if (d < 90) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${(1 - d / 90) * .065})`); ctx.stroke(); } }
      id = requestAnimationFrame(draw);
    };
    draw();
    const rz = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
    window.addEventListener("resize", rz);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", rz); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ══ SPOTLIGHT ══ */
function Spotlight({ color = C.p(.07), size = 600 }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = e => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); ref.current.style.background = `radial-gradient(${size}px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px,${color},transparent 70%)`; };
    window.addEventListener("mousemove", fn); return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]" />;
}

/* ══ WAVE DIVIDER ══ */
function WaveDivider({ color = C.gold, flip = false, toBg = "#fff" }) {
  return (
    <div className={`relative w-full overflow-hidden ${flip ? "rotate-180" : ""}`} style={{ height: 56 }}>
      <svg viewBox="0 0 1440 56" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,56 L0,56 Z" fill={toBg} />
        <path d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M0,36 C240,8 480,64 720,36 C960,8 1200,64 1440,36" stroke={color} strokeWidth=".6" fill="none" opacity=".4" />
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

/* ══ STRATEGY BUTTON ══ */
function StrategyButton() {
  return (
    <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-full font-semibold text-sm sm:text-base border-2 border-white hover:bg-white/10 transition-all">
      <Sparkles className="w-4 h-4" />
      View Our Strategy
    </button>
  );
}

/* ══ COUNTER ══ */
function Counter({ value }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: false });

  const match = String(value).match(/\d+/);
  const num = match ? parseInt(match[0]) : 0;
  const original = String(value);

  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 55, damping: 14 });
  const [display, setDisplay] = useState(num);

  useEffect(() => {
    mv.set(inV ? num : 0);
  }, [inV]);

  useEffect(() => {
    sp.on("change", v => {
      const rounded = Math.round(v);
      const updated = original.replace(/\d+/, rounded);
      setDisplay(updated);
    });
  }, [sp, original]);

  return <span ref={ref}>{display}</span>;
}

/* ══════════════════════════════════════════════
   DATA - FIXED: icons as component types, not JSX
══════════════════════════════════════════════ */
const services = [
  { icon: Search, title: "Search Engine Optimization", desc: "Improve your website's visibility and ranking on search engines for increased organic traffic", features: ["Keyword Research", "On-Page SEO", "Technical SEO", "Link Building", "Local SEO", "SEO Audits"] },
  { icon: Share2, title: "Social Media Marketing", desc: "Build brand awareness and engage with your audience across all major social platforms", features: ["Content Creation", "Community Management", "Social Advertising", "Influencer Marketing", "Analytics", "Strategy Planning"] },
  { icon: Target, title: "Paid Advertising", desc: "Drive targeted traffic and conversions through strategic paid advertising campaigns", features: ["Google Ads", "Facebook Ads", "LinkedIn Ads", "Display Advertising", "Retargeting", "Campaign Optimization"] },
  { icon: TrendingUp, title: "Content Marketing", desc: "Create valuable content that attracts, engages, and converts your target audience", features: ["Content Strategy", "Blog Writing", "Video Content", "Infographics", "E-books", "Content Distribution"] },
  { icon: Mail, title: "Email & WhatsApp Marketing", desc: "Nurture leads and maintain customer relationships through personalized messaging", features: ["Email Campaigns", "WhatsApp Business", "Automation", "Segmentation", "A/B Testing", "Performance Tracking"] },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Track, measure, and optimize your marketing performance with detailed insights", features: ["Google Analytics", "Conversion Tracking", "ROI Analysis", "Custom Dashboards", "Monthly Reports", "Data Visualization"] },
];

const targetAudience = [
  { title: "Startups & Scale-ups", desc: "Accelerate growth and establish market presence in competitive landscapes", icon: Rocket, segment: "Company Size: 1-50 employees", solutions: ["Growth hacking strategies", "Viral marketing campaigns", "Influencer partnerships", "Data-driven optimization"] },
  { title: "Small & Medium Businesses", desc: "Scale operations and dominate markets with digital presence", icon: Briefcase, segment: "Company Size: 50-500 employees", solutions: ["Local SEO dominance", "Omnichannel marketing", "Customer experience optimization", "Automation implementation"] },
  { title: "Enterprise Corporations", desc: "Drive enterprise-wide digital transformation and maintain market leadership", icon: Building2, segment: "Company Size: 500+ employees", solutions: ["Enterprise marketing automation", "Global campaign orchestration", "Advanced analytics platforms", "Cross-channel attribution"] },
  { title: "E-commerce & DTC Brands", desc: "Maximize online revenue and optimize customer lifetime value", icon: Globe, segment: "Business Model: Direct-to-consumer", solutions: ["Performance marketing mastery", "Conversion rate optimization", "Customer data platforms", "Personalized shopping experiences"] },
];

const achievements = [
  { icon: TrendingUp, value: "150%", label: "Average Revenue Growth", desc: "Within 12 months of partnership" },
  { icon: Users,      value: "300%", label: "Lead Generation",        desc: "Improvement in qualified leads" },
  { icon: Eye,        value: "200%", label: "Brand Visibility",       desc: "Increase in online presence" },
  { icon: Award,      value: "4:1",  label: "ROI",                    desc: "Average return on investment" },
];

const whyChooseUs = [
  { icon: "📊", title: "Data-Driven Approach",  desc: "Every decision backed by comprehensive analytics and insights" },
  { icon: "🎯", title: "Targeted Strategies",   desc: "Customized campaigns designed for your specific audience and goals" },
  { icon: "💰", title: "ROI Focused",           desc: "Maximize your marketing budget with proven strategies that deliver results" },
  { icon: "🚀", title: "Rapid Growth",          desc: "Accelerate your business growth with scalable marketing solutions" },
  { icon: "🤝", title: "Dedicated Support",     desc: "Personal account manager and 24/7 support for all your needs" },
  { icon: "📈", title: "Proven Results",        desc: "Track record of success across various industries and business sizes" },
];

const faqs = [
  { q: "How long does it take to see results from digital marketing?", a: "Results vary by channel. SEO typically takes 3-6 months, while paid advertising can show results within days. Social media and content marketing usually show significant results within 2-3 months." },
  { q: "What's the minimum budget required for digital marketing?", a: "We work with budgets starting from $1,000/month. The budget depends on your goals, industry competition, and chosen channels. We'll recommend the optimal allocation for maximum ROI." },
  { q: "Do you work with businesses in all industries?", a: "Yes, we have experience across various industries including healthcare, education, e-commerce, technology, real estate, and more. We adapt our strategies to each industry's unique requirements." },
  { q: "How do you measure and report on campaign performance?", a: "We provide detailed monthly reports with key metrics, insights, and recommendations. You'll have access to real-time dashboards and regular strategy calls to discuss performance." },
  { q: "Can you help with both B2B and B2C marketing?", a: "Absolutely! We have specialized teams for both B2B and B2C marketing, each with expertise in the unique strategies and channels that work best for each audience type." },
];

const useCases = [
  { industry: "Healthcare",   icon: "🏥", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop", challenge: "Build trust and attract patients in a competitive market", solution: "Content marketing, local SEO, and reputation management", results: ["40% increase in appointments","60% improvement in online reviews","200% growth in website traffic"] },
  { industry: "Education",    icon: "🎓", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop", challenge: "Increase student enrollment and brand awareness", solution: "Social media campaigns, targeted advertising, and content marketing", results: ["50% increase in inquiries","30% higher enrollment rate","150% social media growth"] },
  { industry: "Real Estate",  icon: "🏠", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop", challenge: "Generate quality leads and showcase properties effectively", solution: "Facebook advertising, SEO, and virtual tour marketing", results: ["300% increase in leads","25% faster property sales","80% improvement in lead quality"] },
  { industry: "E-commerce",   icon: "🛒", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop", challenge: "Reduce customer acquisition cost and increase sales", solution: "Google Shopping ads, email automation, and retargeting", results: ["45% reduction in CAC","120% increase in revenue","35% improvement in conversion rate"] },
  { industry: "Technology",   icon: "💻", image: "https://t4.ftcdn.net/jpg/02/82/75/31/360_F_282753146_V6ZHcruFiIauT4ecZyf9a2J066LD2K9N.jpg&fit=crop", challenge: "Establish thought leadership and generate B2B leads", solution: "LinkedIn marketing, content marketing, and webinar campaigns", results: ["200% increase in qualified leads","150% growth in brand mentions","60% improvement in sales cycle"] },
  { industry: "Hospitality",  icon: "🏨", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop", challenge: "Increase bookings and improve online reputation", solution: "Social media marketing, review management, and local SEO", results: ["70% increase in direct bookings","4.8/5 average rating","90% improvement in local visibility"] },
];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
function DigitalMarketing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showExpertPopup, setShowExpertPopup] = useState(false);
  const [auditForm, setAuditForm] = useState({ name: "", email: "", phone: "", company: "", website: "", industry: "", currentMarketing: "", goals: "", budget: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuditSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const res = await fetch("https://stackenzo-backend.onrender.com/api/marketing-audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(auditForm) });
      const data = await res.json();
      if (data.success) { alert("Thank you! We'll contact you within 24 hours with your free marketing audit."); setAuditForm({ name: "", email: "", phone: "", company: "", website: "", industry: "", currentMarketing: "", goals: "", budget: "" }); setShowAuditModal(false); }
      else { const msg = data.errors ? data.errors.map(e => e.msg || e.message).join(", ") : data.message; alert("Error: " + msg); }
    } catch { alert("Error submitting form. Please check if the server is running."); }
    finally { setIsSubmitting(false); }
  };

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 1], [0, -100]);
  const heroO = useTransform(heroScroll, [0, .6], [1, 0.9]);
  const heroS = useTransform(heroScroll, [0, 1], [1, .85]);
  const bigY = useTransform(heroScroll, [0, 1], [0, 160]);

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <ScrollProgressBar />
      <SectionNavDots />
      <Navbar />

      {/* ══ HERO ══ */}
      <section id="dm-hero" ref={heroRef} className="relative min-h-screen flex items-center px-4 sm:px-6 overflow-hidden">
        <NoiseCanvas color1={C.tint} color2={C.warmBg} opacity={0.24} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20} /></div>
        <div className="absolute inset-0 z-[2] opacity-[.03] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle,${C.veryDark} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />

        <motion.div style={{ y: heroY, opacity: heroO, scale: heroS }} className="max-w-6xl mx-auto text-center relative z-10 w-full pt-20">
          <div className="inline-block mb-1">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
              style={{ background: C.p(.12), border: `1px solid ${C.p(.28)}`, color: C.mid }}>
              <span className="text-[#D4AF37]">✦</span>
              Results-Driven Digital Marketing
              <span className="text-[#D4AF37]">✦</span>
            </span>
          </div>

          <h1 className="font-bold mb-6 leading-tight" style={{ fontSize: "clamp(2.4rem,7vw,4.6rem)" }}>
            <span style={{ color: C.text }}>Marketing Strategies </span><br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
              That Drives Scalable Growth
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 px-4 rounded-2xl border backdrop-blur-sm p-6"
            style={{ color: C.text, borderColor: "rgba(229,231,235,0.8)", background: "rgba(255,255,255,0.35)" }}>
            We help brands boost visibility, generate quality leads, and grow revenue through strategic, data-driven marketing solutions tailored to their business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button onClick={() => setShowAuditModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-shadow"
              style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})`, boxShadow: `0 8px 28px ${C.p(.3)}` }}>
              Get Free Marketing Audit
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => setShowExpertPopup(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all border-2"
              style={{ borderColor: C.dark, color: C.dark, background: "transparent" }}>
              Talk to a Marketing Expert
            </button>
          </div>

          <div style={{ opacity: scrollOpacity }} className="flex justify-center cursor-pointer"
            onClick={() => document.getElementById("dm-stats")?.scrollIntoView({ behavior: "smooth" })}>
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <span className="text-xs font-medium">Scroll to explore</span>
              <div className="w-7 h-12 rounded-full flex justify-center" style={{ border: `2px solid ${C.p(.28)}` }}>
                <div className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-3" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ STATS ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section id="dm-stats" className="py-16 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SLabel text="Our Impact" />
            <Heading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Proven Results That Speak
            </Heading>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {achievements.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-lg transition-shadow">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-3 text-[#D4AF37]" />
                  <div className="text-2xl sm:text-3xl font-black mb-1" style={{ color: C.dark }}>
                    <Counter value={s.value} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold mb-1" style={{ color: C.dark }}>{s.label}</div>
                  <p className="text-[10px] sm:text-xs" style={{ color: "rgba(26,26,26,0.55)" }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* ══ WHO WE HELP ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Who We Help" />
            <Heading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Tailored for Every Business
            </Heading>
            <p className="text-sm sm:text-base mt-4 max-w-2xl mx-auto" style={{ color: "rgba(26,26,26,0.62)" }}>
              Tailored marketing solutions for businesses at every stage
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {targetAudience.map((audience, i) => {
              const Icon = audience.icon;
              return (
                <div key={i} className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md"
                    style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: C.text }}>{audience.title}</h3>
                  <p className="text-[10px] sm:text-xs font-medium mb-2" style={{ color: `${C.dark}99` }}>{audience.segment}</p>
                  <p className="text-xs sm:text-sm mb-4" style={{ color: "rgba(26,26,26,0.65)" }}>{audience.desc}</p>
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold mb-2" style={{ color: C.dark }}>Strategic Solutions:</p>
                    <ul className="space-y-1.5">
                      {audience.solutions.map((sol, j) => (
                        <li key={j} className="flex items-center gap-2 text-[10px] sm:text-xs" style={{ color: C.text }}>
                          <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: C.gold }} />
                          {sol}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 h-1 w-0 bg-gradient-to-r from-[#D4AF37] to-[#C5531A] group-hover:w-full transition-all duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section id="dm-services" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="What We Do" />
            <Heading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Services We Offer
            </Heading>
            <p className="text-sm sm:text-base mt-4 max-w-2xl mx-auto" style={{ color: "rgba(26,26,26,0.62)" }}>
              Comprehensive marketing solutions to drive your business growth
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div key={i} className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow hover:-translate-y-1">
                  <Icon className="w-8 h-8 text-[#D4AF37] mb-4" />
                  <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: C.text }}>{service.title}</h3>
                  <p className="text-xs sm:text-sm mb-4" style={{ color: "rgba(26,26,26,0.65)" }}>{service.desc}</p>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {service.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-[10px] sm:text-xs" style={{ color: "rgba(26,26,26,0.7)" }}>
                        <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: C.gold }} />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 h-1 w-0 bg-gradient-to-r from-[#D4AF37] to-[#C5531A] group-hover:w-full transition-all duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* ══ INDUSTRY USE CASES ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Case Studies" />
            <Heading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Industry Success Stories
            </Heading>
            <p className="text-sm sm:text-base mt-4 max-w-2xl mx-auto" style={{ color: "rgba(26,26,26,0.62)" }}>Real results across diverse industries</p>
          </div>
          <Swiper modules={[Autoplay, Pagination]} spaceBetween={16} slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } }}
            className="pb-10">
            {useCases.map((uc, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-shadow h-full overflow-hidden">
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img src={uc.image} alt={uc.industry} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top,${C.pd(.55)},transparent 60%)` }} />
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs backdrop-blur-sm"
                      style={{ background: "rgba(255,255,255,0.9)", border: "1px solid #e5e7eb", color: C.text }}>
                      {uc.icon} {uc.industry}
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-xs sm:text-sm mb-2" style={{ color: "rgba(26,26,26,0.8)" }}>
                      <span className="font-semibold" style={{ color: C.text }}>Challenge:</span> {uc.challenge}
                    </p>
                    <p className="text-xs sm:text-sm mb-3" style={{ color: "rgba(26,26,26,0.8)" }}>
                      <span className="font-semibold" style={{ color: C.text }}>Solution:</span> {uc.solution}
                    </p>
                    <div className="space-y-1.5">
                      {uc.results.map((r, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-[10px] sm:text-xs" style={{ color: C.dark }}>
                          <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: C.gold }} />
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ══ */}
      <WaveDivider color={C.gold} toBg={C.light} />
      <section id="dm-why" className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: C.light }}>
        <NoiseCanvas opacity={0.18} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Why Choose Us" />
            <Heading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              What Makes Us Different
            </Heading>
            <p className="text-sm sm:text-base mt-4 max-w-2xl mx-auto" style={{ color: "rgba(26,26,26,0.62)" }}>What sets us apart from other marketing agencies</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {whyChooseUs.map((reason, i) => (
              <div key={i} className="group bg-white p-5 sm:p-6 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-xl transition-shadow hover:-translate-y-1">
                <div className="text-3xl sm:text-4xl mb-3">{reason.icon}</div>
                <h3 className="text-sm sm:text-base font-bold mb-2" style={{ color: C.text }}>{reason.title}</h3>
                <p className="text-xs sm:text-sm" style={{ color: "rgba(26,26,26,0.65)" }}>{reason.desc}</p>
                <div className="mt-3 h-1 w-0 bg-gradient-to-r from-[#D4AF37] to-[#C5531A] group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider color={C.gold} flip toBg="#fff" />

      {/* ══ FAQ ══ */}
      <section id="dm-faq" className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <Spotlight color={C.p(.04)} />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <SLabel text="Common Questions" />
            <Heading className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Frequently Asked Questions
            </Heading>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden transition-all"
                style={{ border: `1px solid ${openFaq === i ? C.gold : "#e5e7eb"}`, boxShadow: openFaq === i ? `0 6px 24px ${C.gold}28` : undefined }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-2 transition-all"
                  style={{ background: openFaq === i ? C.light : "#fff" }}>
                  <h3 className="text-xs sm:text-sm font-semibold pr-2" style={{ color: C.text }}>{faq.q}</h3>
                  <div className={`transform transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: C.gold }} />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100">
                    <p className="text-xs sm:text-sm leading-relaxed pt-3" style={{ color: "rgba(26,26,26,0.72)" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <WaveDivider color={C.gold} toBg={C.veryDark} />
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
        <Spotlight color={`${C.gold}09`} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
            style={{ border: `1px solid ${C.gold}38`, background: `${C.gold}14` }}>
            <Star className="w-4 h-4" style={{ color: C.gold }} />
            <span className="text-sm font-bold" style={{ color: C.gold }}>Ready to Grow?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Accelerate Your Growth?</h2>
          <p className="text-sm sm:text-base text-white/80 mb-8 max-w-2xl mx-auto">
            Let's create a data-driven marketing strategy that delivers measurable results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => setShowAuditModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-full font-semibold text-sm sm:text-base border-2 border-white hover:bg-white/10 transition-all">
              Get Free Marketing Audit
              <ChevronRight className="w-4 h-4" />
            </button>
            <StrategyButton />
          </div>
        </div>
      </section>

      {/* ══ EXPERT POPUP ══ */}
      <AnimatePresence>
        {showExpertPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowExpertPopup(false)}>
            <div onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl overflow-hidden">
              <div className="p-4" style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                <h2 className="text-base sm:text-lg font-bold text-white">Contact Our Marketing Expert</h2>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-sm sm:text-base mb-4" style={{ color: "rgba(26,26,26,0.75)" }}>
                  Please contact us. We will guide you with the best marketing strategy and required information.
                </p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm" style={{ color: C.text }}>
                    <HeadphonesIcon className="w-4 h-4" style={{ color: C.gold }} />
                    +91 98765 43210
                  </div>
                  <div className="flex items-center gap-3 text-sm" style={{ color: C.text }}>
                    <Mail className="w-4 h-4" style={{ color: C.gold }} />
                    marketing@stackenzo.com
                  </div>
                </div>
                <button onClick={() => setShowExpertPopup(false)}
                  className="w-full px-4 py-2.5 text-white rounded-xl text-sm font-bold transition-all"
                  style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ AUDIT MODAL ══ */}
      <AnimatePresence>
        {showAuditModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowAuditModal(false)}>
            <div onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
              <div className="sticky top-0 p-4 flex justify-between items-center z-10 rounded-t-2xl"
                style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                <h2 className="text-base sm:text-lg font-bold text-white">Free Marketing Audit</h2>
                <button onClick={() => setShowAuditModal(false)} className="text-white p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <form onSubmit={handleAuditSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                {[
                  [{ type: "text", ph: "Full Name *", field: "name", req: true }, { type: "email", ph: "Email Address *", field: "email", req: true }],
                  [{ type: "tel", ph: "Phone Number *", field: "phone", req: true }, { type: "text", ph: "Company Name *", field: "company", req: true }],
                ].map((row, ri) => (
                  <div key={ri} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {row.map(f => (
                      <input key={f.field} type={f.type} placeholder={f.ph} value={auditForm[f.field]} required={f.req}
                        onChange={e => setAuditForm({ ...auditForm, [f.field]: e.target.value })}
                        className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none transition-colors"
                        style={{ color: C.text }}
                        onFocus={e => e.target.style.borderColor = C.dark}
                        onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                    ))}
                  </div>
                ))}
                <input type="url" placeholder="Website URL" value={auditForm.website}
                  onChange={e => setAuditForm({ ...auditForm, website: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                <select value={auditForm.industry} required
                  onChange={e => setAuditForm({ ...auditForm, industry: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}>
                  <option value="">Select Industry *</option>
                  {["Healthcare","Education","Real Estate","E-commerce","Technology","Hospitality","Other"].map(o => <option key={o}>{o}</option>)}
                </select>
                <textarea placeholder="Current Marketing Efforts" value={auditForm.currentMarketing} rows="2"
                  onChange={e => setAuditForm({ ...auditForm, currentMarketing: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none resize-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                <textarea placeholder="Marketing Goals *" value={auditForm.goals} rows="2" required
                  onChange={e => setAuditForm({ ...auditForm, goals: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none resize-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                <select value={auditForm.budget} required
                  onChange={e => setAuditForm({ ...auditForm, budget: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none transition-colors"
                  style={{ color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.dark}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}>
                  <option value="">Monthly Marketing Budget *</option>
                  {["Under $1,000","$1,000 - $5,000","$5,000 - $10,000","$10,000 - $25,000","$25,000+"].map(o => <option key={o}>{o}</option>)}
                </select>
                <button type="submit" disabled={isSubmitting}
                  className="w-full px-4 py-3 text-white rounded-xl text-sm sm:text-base font-semibold disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                  style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                  {isSubmitting ? "Submitting…" : "Get My Free Audit"}
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default DigitalMarketing;