import { useState, useEffect, useRef } from "react";
import {
  BookOpen, Clock, Users, Target, X, CheckCircle, Briefcase,
  Code, Zap, Award, Calendar, MapPin, ChevronRight, Star,
  Sparkles, GraduationCap, Brain, Rocket, TrendingUp, Heart,
  Shield, Coffee, Globe, MessageSquare, Share2, Bookmark, BadgeCheck,
  HelpCircle, Mail, Phone, Send, MessageCircle, FileText, User,
  School, CalendarDays, ListChecks, ArrowRight, Monitor, Server,
  Cpu, Wifi, Bot, Palette, Video, Cloud, Layers, Image,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WorkshopRegistrationModal from "./WorkshopRegistrationModal";
import workshopsData from "./data/workshopsData.json";
import {
  C, ScrollProgressBar, NoiseCanvas, ParticleCanvas,
} from "./WorkshopComponents";

// Counter Component
function Counter({ value, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const endValue = parseInt(value.replace(/\D/g, ""));
          
          if (isNaN(endValue)) {
            setCount(value);
            return;
          }

          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const currentCount = Math.floor(progress * endValue);
            
            setCount(currentCount);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(endValue);
            }
          };
          
          animate();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {typeof count === 'number' ? count + suffix : value}
    </span>
  );
}

function Workshops() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [workshopForModal, setWorkshopForModal] = useState(null);
  const [showWorkshopRegModal, setShowWorkshopRegModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [queryForm, setQueryForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "workshop",
    message: ""
  });

  // Workshop Categories Data
  const workshopCategories = [
    {
      id: "web-development",
      title: "Web Development",
      icon: Monitor,
      color: "from-blue-500 to-cyan-500",
      description: "Build responsive and interactive websites using modern web technologies.",
      programs: ["HTML, CSS & JavaScript", "React JS", "AngularJS"],
      focus: ["Responsive Web Design", "Front-End Development", "Single Page Applications", "API Integration", "UI Development"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "programming",
      title: "Programming & Software Development",
      icon: Code,
      color: "from-purple-500 to-violet-500",
      description: "Develop strong programming foundations and build scalable software applications.",
      programs: ["Python Programming", "Python Full Stack Development"],
      focus: ["Programming Fundamentals", "Object-Oriented Programming", "Database Integration", "Backend Development", "Web Application Development"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "ai",
      title: "Artificial Intelligence",
      icon: Brain,
      color: "from-rose-500 to-pink-500",
      description: "Explore modern AI technologies through practical implementation and real-world applications.",
      programs: ["AI using Python", "Prompt Engineering"],
      focus: ["Machine Learning", "Computer Vision", "Data Analysis", "Generative AI", "AI Workflow Development"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "cloud",
      title: "Cloud Computing & DevOps",
      icon: Cloud,
      color: "from-sky-500 to-blue-500",
      description: "Learn cloud platforms and modern software deployment practices.",
      programs: ["AWS Cloud Computing", "DevOps"],
      focus: ["Cloud Infrastructure", "Continuous Integration", "Continuous Deployment", "Containerization", "Infrastructure Automation"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "digital-media",
      title: "Digital Media & Creative Design",
      icon: Palette,
      color: "from-amber-500 to-orange-500",
      description: "Develop creative skills using professional digital design tools.",
      programs: ["Video Editing", "Graphic Designing"],
      focus: ["Branding", "Motion Graphics", "Video Production", "Creative Design", "Digital Marketing Content"],
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "professional-dev",
      title: "Professional Development",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
      description: "Build workplace readiness and professional confidence.",
      programs: ["HIRS", "SMP"],
      focus: ["Communication Skills", "Resume Building", "Interview Preparation", "Corporate Etiquette", "Leadership Development"],
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "embedded",
      title: "Embedded Systems & Electronics",
      icon: Cpu,
      color: "from-indigo-500 to-purple-500",
      description: "Gain practical experience in embedded hardware and electronic product development.",
      programs: ["Embedded Systems", "Embedded Systems using ESP32", "Raspberry Pi Pico", "PCB Design"],
      focus: ["Embedded C Programming", "Microcontrollers", "Hardware Interfacing", "Communication Protocols", "Electronic Product Development"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc2k79nfVjp73qPVDbWcwe_7ronLSUXoBhJ4eOJuVWRA&s=10"
    },
    {
      id: "iot",
      title: "Internet of Things & Industrial Automation",
      icon: Wifi,
      color: "from-cyan-500 to-teal-500",
      description: "Design and develop connected systems for automation and smart environments.",
      programs: ["Internet of Things (IoT)", "Embedded Systems & IoT", "Industrial IoT (IIoT)", "Automation using ESP32"],
      focus: ["Smart Automation", "Wireless Communication", "Cloud Connectivity", "Industrial Monitoring", "Remote Device Management"],
      image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "robotics",
      title: "Robotics",
      icon: Bot,
      color: "from-orange-500 to-red-500",
      description: "Build intelligent robotic systems through hands-on experimentation and project development.",
      programs: [
        "Robotics using Arduino UNO (2-Wheel Kit)",
        "Robotics using Arduino UNO (4-Wheel Kit)",
        "Robotics using ESP32 (2-Wheel Kit)",
        "Robotics using ESP32 (4-Wheel Kit)",
        "Robotics using IoT",
        "Robotics using Bluetooth"
      ],
      focus: ["Mobile Robotics", "Autonomous Navigation", "Sensor Integration", "Wireless Robot Control", "Smart Robotic Systems"],
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const allCategories = ["All", ...workshopCategories.map(c => c.title)];

  // Filter workshops
  const filteredWorkshops = selectedCategory === "All" 
    ? workshopCategories 
    : workshopCategories.filter(c => c.title === selectedCategory);

  const workshopFormats = [
    "One-Day Technology Workshops",
    "Two-Day Hands-on Workshops",
    "Three-Day Skill Development Programs",
    "Five-Day Technical Bootcamps",
    "Faculty Development Programs (FDP)",
    "College Technical Events",
    "School Technology Programs",
    "Industrial Training Workshops",
    "Customized Institutional Workshops"
  ];

  const whyChoose = [
    "Hands-on Practical Learning",
    "Real-Time Project Development",
    "Industry-Oriented Curriculum",
    "Expert Technical Mentors",
    "Modern Technology Stack",
    "Interactive Learning Environment",
    "Project-Based Approach",
    "Innovation-Driven Sessions",
    "Customized Workshops for Institutions",
    "Participation Certificate",
    "Technical Support & Guidance"
  ];

  const participants = [
    "School Students",
    "Diploma Students",
    "Engineering Students",
    "Degree Students",
    "Postgraduate Students",
    "Faculty Members",
    "Educational Institutions",
    "Working Professionals",
    "Corporate Teams",
    "Technology Enthusiasts"
  ];

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
        setQueryForm({ name: "", email: "", phone: "", subject: "", category: "workshop", message: "" });
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

        {/* Hero Image Background */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80"
            alt="Workshop background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* content */}
        <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
          {/* badge */}
          <div className="inline-block mb-8">
            <span
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
              style={{
                background: "rgba(230,107,38,0.12)",
                border: "1px solid rgba(230,107,38,0.28)",
                color: C.dark
              }}
            >
              <span className="text-[#D4AF37]">✦</span>
              Hands-on Technical Workshops
              <span className="text-[#D4AF37]">✦</span>
            </span>
          </div>

          {/* heading */}
          <h2 className="font-bold mb-13 leading-tight" style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)" }}>
            <span style={{ color: C.text }}>Transform Your Future</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              with Technology-Driven Workshops
            </span>
          </h2>

          {/* sub */}
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4 mb-8 rounded-2xl border backdrop-blur-sm p-6"
            style={{
              color: C.text,
              borderColor: "rgba(229,231,235,0.8)",
              background: "rgba(255,255,255,0.35)"
            }}
          >
            Technology is best understood through practice. Our workshops transform
            theoretical knowledge into practical skills through immersive hands-on
            learning experiences.
          </p>

          {/* buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={() => setShowQueryForm(!showQueryForm)}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold border bg-white transition-all duration-300 shadow-sm hover:bg-[#FFF4ED]"
              style={{ borderColor: "#e5e7eb", color: C.text }}
            >
              <HelpCircle className="w-4 h-4" style={{ color: C.gold }} />
              Have a Query?
            </button>
            
            {/* Navigate to Internships Button */}
            <button
              onClick={() => navigate("/internships")}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md text-white"
              style={{
                background: `linear-gradient(135deg,${C.dark},${C.mid})`
              }}
            >
              <Briefcase className="w-4 h-4" />
              Explore Internships
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* stat pills with counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-2">
            {[
              { icon: Clock, value: "1-5", suffix: " Days", label: "Duration" },
              { icon: Users, value: "500+", suffix: "", label: "Students Trained" },
              { icon: Code, value: "9+", suffix: "", label: "Categories" },
              { icon: Award, value: "100", suffix: "%", label: "Hands-on" }
            ].map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
                <s.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" style={{ color: C.dark }} />
                <div className="text-2xl sm:text-3xl font-black" style={{ color: C.dark }}>
                  <Counter value={s.value} suffix={s.suffix} />
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

      {/* ══ ABOUT SECTION WITH IMAGE ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 justify-start mb-3">
                <div className="h-px w-8 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">About Our Workshops</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
                Learning Through Practice
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: C.text }}>
                Technology is best understood through practice. At Stackenzo EdTech,
                our workshops are designed to transform theoretical knowledge into
                practical skills through immersive hands-on learning experiences.
              </p>
              <p className="text-base leading-relaxed mt-4" style={{ color: "rgba(26,26,26,0.65)" }}>
                Our workshops are conducted for schools, colleges, universities,
                training institutions and organizations with a focus on developing
                technical skills that align with current industry trends.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Students in workshop"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-2 border border-gray-200">
                <span className="text-sm font-bold text-[#F04A06]">500+ Students Trained</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WORKSHOP CATEGORIES WITH IMAGES ══ */}
      <div className="relative overflow-hidden" style={{ background: C.light }}>
        <div className="py-16 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Our Categories</span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Workshop Categories
            </h2>
            <p className="text-base mt-4" style={{ color: "rgba(26,26,26,0.65)" }}>
              Explore our diverse range of technology workshops across multiple domains
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-[#F04A06] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((category, i) => {
              const Icon = category.icon;
              return (
                <div
                  key={i}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-[#F04A06] transition-all overflow-hidden shadow-sm hover:shadow-lg"
                >
                  {/* Category Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold mb-2 group-hover:text-[#F04A06] transition-colors"
                      style={{ color: C.text }}
                    >
                      {category.title}
                    </h3>
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: "rgba(26,26,26,0.65)" }}
                    >
                      {category.description}
                    </p>
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-2" style={{ color: C.dark }}>
                        Programs:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {category.programs.slice(0, 3).map((program, j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{
                              background: C.light,
                              color: C.dark,
                              border: `1px solid ${C.gold}55`
                            }}
                          >
                            {program}
                          </span>
                        ))}
                        {category.programs.length > 3 && (
                          <span
                            className="px-2 py-0.5 bg-gray-100 text-xs rounded-full border border-gray-200"
                            style={{ color: C.text }}
                          >
                            +{category.programs.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ WORKSHOP FORMATS ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Workshop Formats</span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Workshop Formats
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshopFormats.map((format, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm hover:shadow-md"
              >
                <CalendarDays className="w-6 h-6 flex-shrink-0" style={{ color: C.gold }} />
                <span className="text-sm font-medium" style={{ color: C.text }}>
                  {format}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHO CAN PARTICIPATE WITH IMAGE ══ */}
      <div className="relative overflow-hidden" style={{ background: C.light }}>
        <div className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-center lg:text-left mb-8 lg:mb-0">
                <div className="flex items-center gap-3 justify-center lg:justify-start mb-3">
                  <div className="h-px w-8 bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Who Can Participate</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
                  Who Can Participate?
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {participants.map((participant, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm hover:shadow-md"
                  >
                    <Users className="w-5 h-5 flex-shrink-0" style={{ color: C.gold }} />
                    <span className="text-sm font-medium" style={{ color: C.text }}>
                      {participant}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
                  alt="Diverse participants"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-2 border border-gray-200">
                <span className="text-sm font-bold text-[#D4AF37]">10+ Categories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ WHY CHOOSE ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-bold tracking-[.2em] text-[11px] uppercase">Why Choose Us</span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              Why Choose Stackenzo Workshops?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChoose.map((reason, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm hover:shadow-md"
              >
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: C.gold }} />
                <span className="text-sm font-medium" style={{ color: C.text }}>
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LEARNING BEYOND WITH IMAGE ══ */}
      <section
        className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80"
            alt="Learning background"
            className="w-full h-full object-cover"
          />
        </div>
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
              Learning Beyond the Classroom
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Learn Beyond the Classroom
          </h2>
          <p
            className="text-lg sm:text-xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            At Stackenzo EdTech, every workshop is designed to create meaningful
            learning experiences through practical implementation, innovation
            and real-world applications. Our growing portfolio includes numerous
            technology programs across multiple domains, ensuring learners
            always have access to the latest industry-relevant skills and
            emerging technologies.
          </p>
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
            
            <Link to="/LabContact">
              <button
                className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg,${C.dark},${C.mid})`
                }}
              >
                <MessageCircle className="w-5 h-5" />
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {showWorkshopRegModal && workshopForModal && (
        <WorkshopRegistrationModal
          workshop={workshopForModal}
          onClose={() => {
            setShowWorkshopRegModal(false);
            setWorkshopForModal(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default Workshops;