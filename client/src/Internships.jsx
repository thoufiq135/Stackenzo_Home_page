import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen, Clock, Users, Target, X, CheckCircle, Briefcase,
  Code, Zap, Award, Calendar, MapPin, ChevronRight, Star,
  Sparkles, GraduationCap, Brain, Rocket, TrendingUp, Heart,
  Shield, Coffee, Globe, MessageSquare, Share2, Bookmark, BadgeCheck,
  HelpCircle, Mail, Phone, Send, MessageCircle, FileText, User,
  School, CalendarDays, ListChecks, ArrowRight, Monitor, Server,
  Cpu, Wifi, Bot, Palette, Video, Cloud, Layers, Building2,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import InternshipRegistrationModal from "./InternshipRegistrationModal";
import {
  C, ScrollProgressBar, NoiseCanvas, ParticleCanvas,
} from "./WorkshopComponents";

// ── CountUp Hook ──────────────────────────────────────────────────────────────
const useCountUp = (target, { durationMs = 900 } = {}) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const hasAnimated = useRef(false);

  const targetNumber = useMemo(() => {
    const cleaned = String(target).replace(/[^0-9.]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }, [target]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          startRef.current = start;

          const tick = (now) => {
            const elapsed = now - start;
            const t = Math.min(1, elapsed / durationMs);
            const eased = 1 - Math.pow(1 - t, 3);
            const next = Math.round(targetNumber * eased);
            setValue(next);

            if (t < 1) {
              rafRef.current = requestAnimationFrame(tick);
            }
          };

          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('hero-stats');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [targetNumber, durationMs]);

  return value;
};

// ── StatValue Component ──────────────────────────────────────────────────────
function StatValue({ rawTarget }) {
  const count = useCountUp(rawTarget, { durationMs: 950 });
  const suffix = String(rawTarget).replace(/[0-9]/g, "");
  return <>{count}{suffix}</>;
}

function Internships() {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showInternshipRegModal, setShowInternshipRegModal] = useState(false);
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [queryForm, setQueryForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "internship",
    message: ""
  });

  // Duration Options
  const durationOptions = ["All", "3-Month", "6-Month", "1-Year"];

  // Internship Domains
  const internshipDomains = [
    {
      id: "web-development",
      title: "Web Development",
      icon: Monitor,
      color: "from-blue-500 to-cyan-500",
      technologies: ["HTML, CSS & JavaScript", "React JS", "AngularJS"]
    },
    {
      id: "programming",
      title: "Programming & Software Development",
      icon: Code,
      color: "from-purple-500 to-violet-500",
      technologies: ["Python Programming", "Python Full Stack Development"]
    },
    {
      id: "ai",
      title: "Artificial Intelligence",
      icon: Brain,
      color: "from-rose-500 to-pink-500",
      technologies: ["AI using Python", "Prompt Engineering"]
    },
    {
      id: "cloud",
      title: "Cloud Computing & DevOps",
      icon: Cloud,
      color: "from-sky-500 to-blue-500",
      technologies: ["AWS Cloud Computing", "DevOps"]
    },
    {
      id: "digital-media",
      title: "Digital Media & Creative Design",
      icon: Palette,
      color: "from-amber-500 to-orange-500",
      technologies: ["Video Editing", "Graphic Designing"]
    },
    {
      id: "professional-dev",
      title: "Professional Development",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
      technologies: ["HIRS", "SMP"]
    },
    {
      id: "embedded",
      title: "Embedded Systems & Electronics",
      icon: Cpu,
      color: "from-indigo-500 to-purple-500",
      technologies: ["Embedded Systems", "Embedded Systems using ESP32", "Raspberry Pi Pico", "PCB Design"]
    },
    {
      id: "iot",
      title: "Internet of Things & Industrial Automation",
      icon: Wifi,
      color: "from-cyan-500 to-teal-500",
      technologies: ["Internet of Things (IoT)", "Embedded Systems & IoT", "Industrial IoT (IIoT)", "Automation using ESP32"]
    },
    {
      id: "robotics",
      title: "Robotics",
      icon: Bot,
      color: "from-orange-500 to-red-500",
      technologies: ["Arduino Robotics", "ESP32 Robotics", "IoT Robotics", "Bluetooth Robotics", "Mobile Robotics", "Smart Robotic Systems"]
    }
  ];

  // Career Opportunities
  const careerRoles = [
    "Web Developer", "Front-End Developer", "Python Developer", "Full Stack Developer",
    "Software Engineer", "AI Engineer", "Machine Learning Engineer", "Prompt Engineer",
    "Cloud Engineer", "AWS Engineer", "DevOps Engineer", "Embedded Engineer",
    "Firmware Developer", "PCB Design Engineer", "IoT Engineer", "Automation Engineer",
    "Robotics Engineer", "Robotics Developer", "Graphic Designer", "Video Editor",
    "Motion Graphics Designer", "Digital Content Creator"
  ];

  const whyChoose = [
    "100% Hands-on Learning",
    "Industry-Oriented Projects",
    "Mentor-Led Technical Guidance",
    "Real-World Experience",
    "Modern Technology Stack",
    "Professional Development",
    "Career-Oriented Learning",
    "Innovation-Driven Environment",
    "Flexible Internship Durations",
    "Continuous Technical Support",
    "Internship Certification",
    "Portfolio & Career Readiness"
  ];

  // Filter internships
  const filteredInternships = selectedDuration === "All"
    ? internshipDomains
    : internshipDomains.filter(d => d.id.includes(selectedDuration));

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryForm)
      });
      if (response.ok) {
        toast.success("Query submitted! We'll get back to you within 24 hours.");
        setQueryForm({ name: "", email: "", phone: "", subject: "", category: "internship", message: "" });
        setShowQueryForm(false);
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    }
  };

  const handleQueryChange = e =>
    setQueryForm({ ...queryForm, [e.target.name]: e.target.value });

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      <ScrollProgressBar />
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative pt-28 sm:pt-36 pb-20 px-4 sm:px-6 overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-[#FFF4ED] via-white to-[#FFF0E6]/30">
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.25} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20} /></div>

        {/* content */}
        <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
          {/* badge */}
          <div className="inline-block mb-8">
            <span
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
              style={{
                background: "rgba(230,107,38,0.12)",
                border: "1px solid rgba(230,107,38,0.28)",
                color: C.dark
              }}
            >
              <span className="text-[#D4AF37]">✦</span>
              Professional Internship Program
              <span className="text-[#D4AF37]">✦</span>
            </span>
          </div>

          {/* heading */}
          <h1 className="font-bold mb-12 leading-tight" style={{ fontSize: "clamp(2.2rem,7vw,4.5rem)" }}>
            <span style={{ color: C.text }}>Launch Your Career</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              with Professional Internships
            </span>
          </h1>

          {/* sub */}
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4 mb-12 rounded-2xl border backdrop-blur-sm p-6"
            style={{
              color: C.text,
              borderColor: "rgba(229,231,235,0.8)",
              background: "rgba(255,255,255,0.35)"
            }}
          >
            Gain industry experience through real projects. Our internships bridge
            the gap between academic learning and professional practice.
          </p>

          {/* buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setShowQueryForm(!showQueryForm)}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold border bg-white transition-all duration-300 shadow-sm hover:bg-[#FFF4ED]"
              style={{ borderColor: "#e5e7eb", color: C.text }}
            >
              <HelpCircle className="w-4 h-4" style={{ color: C.gold }} />
              Have a Query?
            </button>

            {/* Navigate to Workshops Button */}
            <button
              onClick={() => navigate("/workshops")}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md text-white"
              style={{
                background: `linear-gradient(135deg,${C.dark},${C.mid})`
              }}
            >
              <BookOpen className="w-4 h-4" />
              Explore Workshops
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* stat pills with count effect */}
          <div id="hero-stats" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-2">
            {[
              { icon: Briefcase, value: "3-12 Months", label: "Duration", animate: false },
              { icon: Users, value: "50+", label: "Interns", animate: true },
              { icon: TrendingUp, value: "9+", label: "Domains", animate: true },
              { icon: Award, value: "100%", label: "Hands-on", animate: true }
            ].map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
                <s.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" style={{ color: C.dark }} />
                <div className="text-lg sm:text-2xl font-black" style={{ color: C.dark }}>
                  {s.animate ? <StatValue rawTarget={s.value} /> : s.value}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUERY FORM DROPDOWN ══ */}
      {showQueryForm && (
        <div className="overflow-hidden border-y border-gray-200" style={{ background: C.light }}>
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold" style={{ color: C.dark }}>
                  Quick Query
                </h3>
                <button
                  onClick={() => setShowQueryForm(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: C.text }} />
                </button>
              </div>
              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={queryForm.name}
                    onChange={handleQueryChange}
                    placeholder="Your Name *"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#F04A06] focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    value={queryForm.email}
                    onChange={handleQueryChange}
                    placeholder="Your Email *"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#F04A06] focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={queryForm.phone}
                  onChange={handleQueryChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#F04A06] focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  name="subject"
                  value={queryForm.subject}
                  onChange={handleQueryChange}
                  placeholder="Subject"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#F04A06] focus:outline-none transition-colors"
                />
                <textarea
                  name="message"
                  value={queryForm.message}
                  onChange={handleQueryChange}
                  placeholder="Your Question *"
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#F04A06] focus:outline-none resize-none transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-black rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                    style={{
                      background: `linear-gradient(135deg,${C.dark},${C.mid})`
                    }}
                  >
                    Submit Query
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQueryForm(false)}
                    className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    style={{ color: C.text }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══ ABOUT SECTION ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="h-px w-8 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Internship Program</span>
            <div className="h-px w-8 bg-[#D4AF37]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
            Internship Program at Stackenzo
          </h2>
          <p className="text-xl sm:text-2xl font-semibold mb-4" style={{ color: C.dark}}>
            Learn From the Ground. Grow With Confidence. Enjoy the Work Culture.
          </p>
          <p className="text-lg sm:text-xl leading-relaxed" style={{ color: C.text }}>
            At Stackenzo, our internship program is not just about certificates or
            short-term training. It is about real exposure, real learning, and real
            motivation. Our internships provide participants with the opportunity
            to work on real-world projects, industry-relevant technologies and
            practical problem-solving activities under the guidance of experienced
            mentors.
          </p>
        </div>
      </section>

      {/* ══ DURATION FILTER ══ */}
      <div className="relative overflow-hidden" style={{ background: C.light }}>
        <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {durationOptions.map(duration => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDuration === duration
                    ? "bg-[#F04A06] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ INTERNSHIP DOMAINS ══ */}
      <div className="relative overflow-hidden" style={{ background: C.light }}>
        <div className="py-16 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Internship Domains</span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Internship Domains
            </h2>
            <p className="text-base mt-4" style={{ color: "rgba(26,26,26,0.65)" }}>
              Explore our diverse range of internship domains across multiple technologies
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((domain, i) => {
              const Icon = domain.icon;
              return (
                <div
                  key={i}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-[#F04A06] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl flex flex-col h-full relative"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F04A06]/5 to-[#C5531A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  {/* Top gradient bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${domain.color}`} />

                  <div className="relative p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${domain.color} flex items-center justify-center shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold group-hover:text-[#F04A06] transition-colors" style={{ color: C.text }}>
                          {domain.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Available
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">3-6 Months</span>
                        </div>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: C.dark }}>
                        <Code className="w-3.5 h-3.5" style={{ color: C.gold }} />
                        Technologies:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {domain.technologies.map((tech, j) => (
                          <span
                            key={j}
                            className="px-3 py-1 text-xs rounded-full transition-all hover:scale-105 hover:shadow-md"
                            style={{
                              background: C.light,
                              color: C.dark,
                              border: `1px solid ${C.gold}55`
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate("/LabContact")}
                        className="w-full px-4 py-3 text-white rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg,${C.dark},${C.mid})`
                        }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Apply Now
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[#C5531A] to-[#F04A06] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ LEARNING MODEL ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Learning Model</span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Internship Learning Model
            </h2>
            <p className="text-base mt-4" style={{ color: "rgba(26,26,26,0.65)" }}>
              Throughout the internship, participants will gain hands-on experience
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Work on Real-Time Projects",
              "Build Industry-Oriented Applications",
              "Learn Through Practical Implementation",
              "Follow Structured Learning Roadmaps",
              "Collaborate with Technical Mentors",
              "Improve Problem-Solving Skills",
              "Gain Project Documentation Experience",
              "Develop Technical Portfolios",
              "Strengthen Communication & Teamwork",
              "Understand Professional Development Practices"
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm hover:shadow-md"
              >
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: C.gold }} />
                <span className="text-sm font-medium" style={{ color: C.text }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHAT YOU GAIN ══ */}
      <div className="relative overflow-hidden" style={{ background: C.light }}>
        <div className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">What You'll Gain</span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              What You'll Gain
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Hands-on Industry Experience",
              "Project Portfolio",
              "Technical Mentorship",
              "Industry Best Practices",
              "Source Code & Project Documentation",
              "Performance Evaluation",
              "Internship Completion Certificate",
              "Career Guidance",
              "Resume Development Support",
              "Interview Preparation Assistance"
            ].map((gain, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm hover:shadow-md"
              >
                <Award className="w-6 h-6 flex-shrink-0" style={{ color: C.gold }} />
                <span className="text-sm font-medium" style={{ color: C.text }}>
                  {gain}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CAREER OPPORTUNITIES ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Career Opportunities</span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Career Opportunities
            </h2>
            <p className="text-base mt-4" style={{ color: "rgba(26,26,26,0.65)" }}>
              Our internship programs prepare learners for these roles
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerRoles.map((role, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm hover:shadow-md"
              >
                <Rocket className="w-6 h-6 flex-shrink-0" style={{ color: C.gold }} />
                <span className="text-sm font-medium" style={{ color: C.text }}>
                  {role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE ══ */}
      <div className="relative overflow-hidden" style={{ background: C.light }}>
        <div className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Why Choose Us</span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Why Choose Stackenzo Internships?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChoose.map((reason, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm hover:shadow-md"
              >
                <BadgeCheck className="w-6 h-6 flex-shrink-0" style={{ color: C.gold }} />
                <span className="text-sm font-medium" style={{ color: C.text }}>
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ PHILOSOPHY BANNER ══ */}
      <section
        className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
            style={{
              border: "1px solid rgba(212,175,55,0.35)",
              background: "rgba(212,175,55,0.1)"
            }}
          >
            <Star className="w-4 h-4" style={{ color: C.gold }} />
            <span className="text-sm font-bold" style={{ color: C.gold }}>
              Our Philosophy
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Our Internship Philosophy
          </h2>
          <p className="text-xl sm:text-2xl font-semibold mb-8" style={{ color: "rgba(255,255,255,0.88)" }}>
            Internships should not just train — they should transform careers.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              "Build expertise",
              "Create opportunities",
              "Boost employability",
              "Prepare for success"
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)"
                }}
              >
                <p className="text-sm sm:text-base text-white font-semibold">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT SECTION ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Contact Us</span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Have A Question?
            </h2>
            <p className="text-lg sm:text-xl mb-8" style={{ color: C.text }}>
              We're here to help! Reach out to us and we'll get back to you within 24 hours.
            </p>
            
            <button
              onClick={() => navigate("/LabContact")}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: `linear-gradient(135deg,${C.dark},${C.mid})`
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {showInternshipRegModal && selectedInternship && (
        <InternshipRegistrationModal
          internship={selectedInternship}
          onClose={() => {
            setShowInternshipRegModal(false);
            setSelectedInternship(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default Internships;