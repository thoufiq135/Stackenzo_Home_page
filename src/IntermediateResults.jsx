import "./App.css";
import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring,
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import {
  Users, CheckCircle, Clock, Award, BarChart3, FileText,
  ArrowLeft, Sparkles, TrendingUp, Calendar, Rocket, Target, Star,
} from "lucide-react";

/* Reuse Home.jsx patterns */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const MARQUEE_ITEMS = [
  "Research & Development", "IT Solutions", "EdTech Innovation", "Robotics",
  "Digital Marketing", "GSIN Platform", "AI & Machine Learning", "Cloud Solutions"
];

/* Mock results data for portal */
const RESULTS_DATA = [
  // { id: 1, title: "Workshop Enrollment Batch #23", status: "Processing", progress: 75, students: 45, date: "2026-01-15" },
  { id: 2, title: "Robotics Summer Camp 2026", status: "On going", progress: 100, students: 120, date: "2026-04-24", isSummerCamp: true },
  // { id: 3, title: "R&D Project Review", status: "Pending Review", progress: 40, students: 28, date: "2026-01-20" },
];

const STATS = [
  { label: "Total Enrollments", value: "1,247", icon: Users, accent: "#F04A06" },
  { label: "Success Rate", value: "98%", icon: CheckCircle, accent: "#D4AF37" },
  { label: "Active Sessions", value: "23", icon: Clock, accent: "#4CAF50" },
];

/* Reveal component from Home.jsx */
function Reveal({ children, className = "", from = "bottom", delay = 0 }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-60px" });
  const offsets = {
    bottom: { hidden: { y: 70, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    top: { hidden: { y: -70, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  };
  const { hidden, visible } = offsets[from] || offsets.bottom;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inV ? "visible" : "hidden"}
      variants={{ hidden, visible }}
      transition={{ duration: 0.75, delay, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}

/* GlowCard from Home.jsx */
function GlowCard({ children, className = "", accent = "#D4AF37", isSummerCamp = false }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden ${className} ${isSummerCamp ? 'ring-2 ring-[#F04A06] ring-offset-4 shadow-2xl' : ''}`}>
      {isSummerCamp && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-gradient-to-r from-[#F04A06] to-[#D4AF37] text-white px-6 py-2 rounded-bl-2xl font-bold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Featured Program
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50" />
      <div className="relative z-10 p-6 md:p-8">{children}</div>
    </div>
  );
}

/* Scrolling Marquee */
function ScrollingMarquee() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#F04A06] to-[#D4AF37] py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="mx-8 text-lg font-bold text-white uppercase tracking-wider">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* Summer Camp Details Modal */
function SummerCampModal({ isOpen, onClose, onRegister }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-[#F04A06] to-[#D4AF37] p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Robotics Summer Camp 2026</h2>
          <button onClick={onClose} className="text-white hover:opacity-80">✕</button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-[#F04A06]">
            <p className="text-gray-700 leading-relaxed">
              An intensive 4-week hands-on robotics program where students learn to build, code, and 
              program autonomous robots using Arduino and sensors. Perfect for beginners and intermediate 
              level students aged 10-16.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[#F04A06]" />
              What Students Learn
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Robot assembly and mechanics",
                "Arduino programming (C++)",
                "Sensor integration (Ultrasonic, IR, etc.)",
                "Line following and obstacle avoidance",
                "Wireless control via Bluetooth",
                "Team project: Autonomous Robot Challenge"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-[#F04A06]" />
              <p className="font-bold">4 Weeks</p>
              <p className="text-sm text-gray-600">July 1-26, 2026</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-[#F04A06]" />
              <p className="font-bold">Limited Seats</p>
              <p className="text-sm text-gray-600">Only 30 per batch</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              Camp Highlights
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>🏆 Certificate of Completion from GSIN</li>
              <li>🤖 Take-home robotics kit included</li>
              <li>👥 Mentorship from IIT/NIT graduates</li>
              <li>🎯 Final competition with prizes</li>
            </ul>
          </div>

          <button
            onClick={onRegister}
            className="w-full bg-gradient-to-r from-[#F04A06] to-[#D4AF37] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Register for Summer Camp →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Results Portal Cards */
function ResultsCard({ data, onViewDetails }) {
  const navigate = useNavigate();

  const handleRegister = () => {
    if (data.isSummerCamp) {
      navigate("/workshop/register");
    } else {
      onViewDetails?.(data);
    }
  };

  return (
    <GlowCard 
      className="group cursor-pointer hover:shadow-2xl transition-all border border-gray-100 hover:border-[#D4AF37]/50" 
      isSummerCamp={data.isSummerCamp}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            {data.title}
            {data.isSummerCamp && (
              <span className="bg-gradient-to-r from-[#F04A06] to-[#D4AF37] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                HOT
              </span>
            )}
          </h3>
          {data.isSummerCamp && (
            <p className="text-sm text-[#F04A06] font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              120+ students enrolled!
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          data.status === "Completed" ? "bg-green-100 text-green-800" :
          data.status === "Processing" ? "bg-orange-100 text-orange-800" :
          "bg-blue-100 text-blue-800"
        }`}>
          {data.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" size={16} />
          <span>{data.students} students</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-[#F04A06] to-[#D4AF37] h-2 rounded-full" style={{ width: `${data.progress}%` }} />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{data.date}</span>
        </div>
      </div>

      {data.isSummerCamp && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRegister}
          className="w-full mt-4 bg-gradient-to-r from-[#F04A06] to-[#D4AF37] text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <Rocket className="w-4 h-4" />
          Register Now - Limited Seats!
        </motion.button>
      )}
    </GlowCard>
  );
}

export default function IntermediateResults() {
  const [selectedCamp, setSelectedCamp] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (data) => {
    if (data.isSummerCamp) {
      setSelectedCamp(true);
    } else {
      // Handle other result details
      console.log("View details for:", data);
    }
  };

  const handleRegister = () => {
    setSelectedCamp(false);
    navigate("/summer-camp-registration");
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Company Advertised Scrolling on Top */}
      <ScrollingMarquee />

      {/* Hero with Summer Camp Highlight */}
      <section className="py-24 px-4 sm:px-6 text-center bg-gradient-to-b from-white to-[#FFF4ED] relative overflow-hidden">
        {/* Animated background effect for summer camp */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(240,74,6,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(240,74,6,0.03) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <Reveal from="top">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F04A06]/10 to-[#D4AF37]/10 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#F04A06]" />
            <span className="text-sm font-semibold text-[#F04A06]">Summer Camp 2026 Now Open!</span>
          </motion.div>
        </Reveal>
        
        <Reveal from="top" delay={0.1}>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-[#F04A06] to-[#D4AF37] bg-clip-text text-transparent mb-6">
            Intermediate Results Portal
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Track your enrollment progress, view session analytics, and celebrate achievements in real-time.
          </p>
        </Reveal>
        
        {/* Summer Camp CTA Banner */}
        <Reveal delay={0.3}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="max-w-3xl mx-auto bg-gradient-to-r from-[#F04A06] to-[#D4AF37] rounded-2xl p-6 text-white cursor-pointer shadow-xl"
            onClick={() => setSelectedCamp(true)}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Rocket className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-xl">🔥 Robotics Summer Camp 2026</h3>
                  <p className="text-white/90 text-sm">Limited seats available! Learn robotics & AI this summer</p>
                </div>
              </div>
              <button className="bg-white text-[#F04A06] px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all">
                Learn More →
              </button>
            </div>
          </motion.div>
        </Reveal>
      </section>

      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <GlowCard accent={stat.accent} className="p-8 text-center hover:scale-105 transition-transform">
                  <Icon className="w-12 h-12 mx-auto mb-4" style={{ color: stat.accent }} />
                  <h3 className="text-3xl font-black text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>

        {/* Results Grid */}
        <Reveal delay={0.1}>
          <h2 className="text-3xl font-black text-center mb-16 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            Recent Results
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESULTS_DATA.map((data) => (
            <Reveal key={data.id} delay={0.1}>
              <ResultsCard data={data} onViewDetails={handleViewDetails} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Summer Camp Modal */}
      <AnimatePresence>
        {selectedCamp && (
          <SummerCampModal 
            isOpen={selectedCamp} 
            onClose={() => setSelectedCamp(false)} 
            onRegister={handleRegister}
          />
        )}
      </AnimatePresence>

      <Footer />
      <ScrollToTop />
    </div>
  );
}