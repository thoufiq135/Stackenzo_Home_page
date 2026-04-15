import "./App.css";
import {
  motion, AnimatePresence, useInView
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import {
  Users, CheckCircle, Clock, Award, BarChart3, FileText,
  ArrowLeft, ArrowRight, Sparkles, TrendingUp, Calendar, Rocket, Star,
  Download, Eye, Trophy, Zap, GraduationCap, PartyPopper, Gift,
  Code2, Cpu, Brain, Wifi, Shield, BookOpen, Target,
  Coffee, Smile, Heart, ThumbsUp
} from "lucide-react";

/* Constants */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const MARQUEE_ITEMS = [
  "Research & Development", "IT Solutions", "EdTech Innovation", "Robotics",
  "Digital Marketing", "GSIN Platform", "AI & Machine Learning", "Cloud Solutions"
];

/* Results Data */
const RESULTS_DATA = [
  { 
    id: 1, 
    title: "AI & Robotics Boot camp 2026", 
    status: "Processing", 
    progress: 50, 
    students: 120, 
    date: "2026-04", 
    isSummerCamp: true,
    details: "6-day intensive robotics program",
    instructor: "",
    achievements: ["Best Project Award", "100% Completion Rate"]
  },
];

const STATS = [
  { label: "Total Enrollments", value: "224", icon: Users, accent: "#F04A06", change: "+15%" },
  { label: "Success Rate", value: "98%", icon: CheckCircle, accent: "#D4AF37", change: "+5%" },
  { label: "Active Sessions", value: "13", icon: Clock, accent: "#4CAF50", change: "+3" },
  { label: "Certificates Issued", value: "100", icon: Award, accent: "#F04A06", change: "+12%" }
];

/* Reveal Component */
function Reveal({ children, className = "", from = "bottom", delay = 0 }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-60px" });
  const offsets = {
    bottom: { hidden: { y: 70, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    top: { hidden: { y: -70, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left: { hidden: { x: -70, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 70, opacity: 0 }, visible: { x: 0, opacity: 1 } }
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

/* GlowCard Component */
function GlowCard({ children, className = "", accent = "#D4AF37", isSummerCamp = false }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${className} ${isSummerCamp ? 'ring-2 ring-[#F04A06] ring-offset-4 shadow-2xl transform hover:scale-105' : 'hover:shadow-xl'}`}>
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

/* Results Card Component */
function ResultsCard({ data, onViewDetails }) {
  const navigate = useNavigate();

  const handleRegister = () => {
    if (data.isSummerCamp) {
      navigate("/workshop/register?workshop=robotics");
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
        <div className="flex-1">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 flex-wrap">
            {data.title}
            {data.isSummerCamp && (
              <span className="bg-gradient-to-r from-[#F04A06] to-[#D4AF37] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                Trending
              </span>
            )}
          </h3>
          {data.details && (
            <p className="text-xs text-gray-500 mt-1">{data.details}</p>
          )}
          {data.isSummerCamp && (
            <p className="text-sm text-[#F04A06] font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              120+ students enrolled!
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ml-2 ${
          data.status === "Completed" ? "bg-green-100 text-green-800" :
          data.status === "Processing" ? "bg-orange-100 text-orange-800" :
          "bg-blue-100 text-blue-800"
        }`}>
          {data.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" size={16} />
            <span>{data.students} students</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-[#F04A06] to-[#D4AF37] h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${data.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>{data.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{data.progress}% Complete</span>
          </div>
        </div>
      </div>

      {data.achievements && (
        <div className="mb-4 flex flex-wrap gap-1">
          {data.achievements.map((achievement, idx) => (
            <span key={idx} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {achievement}
            </span>
          ))}
        </div>
      )}

      {data.isSummerCamp && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRegister}
          className="w-full mt-4 bg-gradient-to-r from-[#F04A06] to-[#D4AF37] text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <Zap className="w-4 h-4" />
          Enroll Now - Limited Seats!
        </motion.button>
      )}
    </GlowCard>
  );
}

/* Boot campExclusive Details Section */
function SummerCampDetailsSection() {
  const navigate = useNavigate();

  const benefits = [
    { icon: Code2, title: "Hands-on Coding", desc: "Learn Python, Arduino C++ & Robotics programming" },
    { icon: Cpu, title: "Hardware Experience", desc: "Work with actual robots, sensors & microcontrollers" },
    { icon: Brain, title: "AI Fundamentals", desc: "Introduction to Artificial Intelligence & ML" },
    { icon: Wifi, title: "IoT Integration", desc: "Connect robots to internet & control remotely" },
    { icon: Shield, title: "Industry Certifications", desc: "Get certified by StackEnzo & partners" },
    { icon: Users, title: "Team Projects", desc: "Collaborate on real-world robotics challenges" },
  ];

  // Updated schedule for 6 days with progressive difficulty
  const schedules = [
    { 
      day: "Day 1", 
      title: "Foundation & Basics", 
      level: "Beginner",
      topics: [
        "Introduction to Robotics & Electronics",
        "Basic Circuit Design & Components",
        "Arduino IDE & Programming Basics",
        "LED Blinking & Digital Outputs"
      ] 
    },
    { 
      day: "Day 2", 
      title: "Sensors & Input Devices", 
      level: "Beginner+",
      topics: [
        "Working with Ultrasonic Sensors",
        "IR Sensors & Object Detection",
        "Analog Sensors (Temperature, Light)",
        "Reading Sensor Data & Display"
      ] 
    },
    { 
      day: "Day 3", 
      title: "Motor Control & Movement", 
      level: "Intermediate",
      topics: [
        "DC Motor & Servo Motor Control",
        "Motor Drivers (L298N, L293D)",
        "Building a Basic Wheeled Robot",
        "Obstacle Avoidance Robot"
      ] 
    },
    { 
      day: "Day 4", 
      title: "Advanced Programming", 
      level: "Intermediate+",
      topics: [
        "Line Following Robot (PID Control)",
        "Bluetooth Module Integration",
        "Mobile App Control via Bluetooth",
        "Wireless Robot Navigation"
      ] 
    },
    { 
      day: "Day 5", 
      title: "AI & IoT Integration", 
      level: "Advanced",
      topics: [
        "Introduction to Machine Learning",
        "Voice Control using AI",
        "IoT Cloud Platforms (Blynk/Thingspeak)",
        "Real-time Data Monitoring"
      ] 
    },
    { 
      day: "Day 6", 
      title: "Final Project & Competition", 
      level: "Expert",
      topics: [
        "Autonomous Robot Challenge",
        "Team Project Presentations",
        "Judging & Evaluation",
        "Certificate Distribution Ceremony"
      ] 
    },
  ];

  // Updated eligibility with increased difficulty levels for higher classes
  const eligibility = [
    { 
      level: "School childrens", 
      color: "#4CAF50", 
      desc: "Perfect start for young innovators",
      difficulty: "Foundation Level",
      projects: "Basic Robotics Projects"
    },
    { 
      level: "Intermediate (11th & 12th)", 
      color: "#2196F3", 
      desc: "Build strong foundation for engineering",
      difficulty: "Intermediate to Advanced",
      projects: "Real-world Applications & AI Basics"
    },
    { 
      level: "UG Students", 
      color: "#9C27B0", 
      desc: "Advanced projects & career preparation",
      difficulty: "Expert Level",
      projects: "Industry-grade Projects & Research"
    },
  ];

  // Difficulty level descriptions
  const difficultyLevels = [
    { level: "Beginner", color: "#4CAF50", desc: "No prior coding experience needed" },
    { level: "Intermediate", color: "#FF9800", desc: "Basic programming knowledge recommended" },
    { level: "Advanced", color: "#F04A06", desc: "Prior robotics experience helpful" },
    { level: "Expert", color: "#9C27B0", desc: "Advanced concepts & real-world applications" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-[#FFF4ED]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <Reveal from="top">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F04A06]/10 to-[#D4AF37]/10 px-4 py-2 rounded-full mb-4">
              <Rocket className="w-4 h-4 text-[#F04A06]" />
              <span className="text-sm font-semibold text-[#F04A06]">Boot camp 2026</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#F04A06] to-[#D4AF37] bg-clip-text text-transparent mb-4">
              AI + Robotics Boot Camp
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              An exclusive 6-day transformative program designed for students who want to build the future
            </p>
          </div>
        </Reveal>

        {/* Difficulty Level Legend */}
        <Reveal from="bottom" delay={0.05}>
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-center mb-4 text-gray-700 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
              Progressive Difficulty Levels
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {difficultyLevels.map((diff, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-100">
                  <div className="w-2 h-2 rounded-full" style={{ background: diff.color }} />
                  <span className="text-xs font-semibold" style={{ color: diff.color }}>{diff.level}</span>
                  <span className="text-xs text-gray-500">- {diff.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Eligibility Cards - For Different Student Levels */}
        <Reveal from="bottom" delay={0.1}>
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-[#1A1A1A] flex items-center justify-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
              Who Can Join?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {eligibility.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100"
                >
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: item.color }} />
                  <div className="p-6 text-center">
                    <div className="inline-flex p-3 rounded-xl mb-4" style={{ background: `${item.color}15` }}>
                      <Users className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <h4 className="text-xl font-bold mb-2" style={{ color: item.color }}>{item.level}</h4>
                    <p className="text-gray-600 text-sm mb-2">{item.desc}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold" style={{ color: item.color }}>{item.difficulty}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.projects}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Benefits Grid */}
        <Reveal from="bottom" delay={0.2}>
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-[#1A1A1A] flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-[#D4AF37]" />
              What Makes This Camp Special?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="inline-flex p-3 rounded-xl mb-4 bg-gradient-to-r from-[#F04A06]/10 to-[#D4AF37]/10">
                      <Icon className="w-6 h-6 text-[#F04A06]" />
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-gray-900">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Schedule Timeline - 6 Days */}
        <Reveal from="bottom" delay={0.3}>
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-[#1A1A1A] flex items-center justify-center gap-2">
              <Calendar className="w-6 h-6 text-[#D4AF37]" />
              6-Day Learning Journey (Progressing Difficulty)
            </h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4CAF50] via-[#FF9800] via-[#F04A06] to-[#9C27B0]" />
              
              {schedules.map((day, idx) => {
                const levelColors = {
                  "Beginner": "#4CAF50",
                  "Beginner+": "#8BC34A",
                  "Intermediate": "#FF9800",
                  "Intermediate+": "#FFC107",
                  "Advanced": "#F04A06",
                  "Expert": "#9C27B0"
                };
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`relative flex flex-col md:flex-row gap-6 mb-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="flex-1 md:w-1/2">
                      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md ml-8 md:ml-0 hover:shadow-lg transition-all">
                        <div className="inline-flex items-center gap-2 mb-3 flex-wrap">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F04A06] to-[#D4AF37] flex items-center justify-center text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">{day.title}</h4>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: `${levelColors[day.level]}20`, color: levelColors[day.level] }}
                          >
                            {day.level} Level
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {day.topics.map((topic, tIdx) => (
                            <li key={tIdx} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="hidden md:block w-1/2">
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: levelColors[day.level] }}>{day.day}</div>
                          <div className="text-xs text-gray-400 mt-1">{day.level}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Key Highlights Banner */}
        <Reveal from="bottom" delay={0.4}>
          <div className="bg-gradient-to-r from-[#F04A06] to-[#D4AF37] rounded-2xl p-8 mb-16 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-3xl font-black">100+</div>
                <div className="text-sm opacity-90">Students Trained</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-3xl font-black">6</div>
                <div className="text-sm opacity-90">Intensive Days</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-3xl font-black">10+</div>
                <div className="text-sm opacity-90">Industry Experts</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="text-3xl font-black">5+</div>
                <div className="text-sm opacity-90">Live Projects</div>
              </motion.div>
            </div>
          </div>
        </Reveal>

        {/* What You'll Get Section */}
        <Reveal from="bottom" delay={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md">
              <div className="inline-flex p-3 rounded-xl mb-4 bg-green-50">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">What You'll Get</h3>
              <ul className="space-y-3">
                {[
                  "Certificate of Completion from StackEnzo",
                  // "Project Portfolio to showcase your work",
                  "Access to recorded sessions & materials",
                  "Direct mentorship from industry experts",
                  // "Competition participation certificate",
                  "Letter of Recommendation for top performers",
                  // "Free Robotics Kit (for top performers)"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#FFF4ED] to-white rounded-2xl p-8 border border-[#F04A06]/20 shadow-md">
              <div className="inline-flex p-3 rounded-xl mb-4 bg-[#F04A06]/10">
                <Target className="w-6 h-6 text-[#F04A06]" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Why Choose StackEnzo?</h3>
              <ul className="space-y-3">
                {[
                  // "4+ years of excellence in tech education",
                  // "Trained over 5000+ students across India",
                  "Partnerships with leading tech companies",
                  "Project-based learning approach",
                  "Career guidance & placement assistance",
                  // "Affordable fees with scholarship options",
                  "Progressive difficulty from Beginner to Expert"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <ThumbsUp className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* CTA Button */}
        <Reveal from="bottom" delay={0.6}>
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/workshop/register?workshop=robotics")}
              className="bg-gradient-to-r from-[#F04A06] to-[#D4AF37] text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-3"
            >
              <Rocket className="w-5 h-5" />
              Register for Boot camp 2026
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <p className="text-sm text-gray-500 mt-4">
              ⚡ Limited seats available! Early bird registrations closing soon.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Main Component */
export default function IntermediateResults() {
  const [filter, setFilter] = useState("all");

  const filteredResults = RESULTS_DATA.filter(data => {
    if (filter === "all") return true;
    if (filter === "summer") return data.isSummerCamp;
    if (filter === "completed") return data.status === "Completed";
    if (filter === "processing") return data.status === "Processing";
    return true;
  });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Scrolling Marquee */}
      <ScrollingMarquee />

      {/* Boot campDetails Section */}
      <SummerCampDetailsSection />

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <GlowCard accent={stat.accent} className="p-6 text-center hover:scale-105 transition-transform">
                  <Icon className="w-10 h-10 mx-auto mb-3" style={{ color: stat.accent }} />
                  <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                  <p className="text-xs text-green-600 mt-2">↑ {stat.change}</p>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <Reveal delay={0.1}>
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {[
              { id: "all", label: "All Programs" },
              // { id: "summer", label: "Boot camp2026" },
              { id: "completed", label: "Completed" },
              { id: "processing", label: "Active Programs" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === tab.id
                    ? "bg-gradient-to-r from-[#F04A06] to-[#D4AF37] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Results Grid */}
        <Reveal delay={0.1}>
          <h2 className="text-3xl font-black text-center mb-16 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Recent Results
          </h2>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResults.map((data) => (
            <Reveal key={data.id} delay={0.1}>
              <ResultsCard data={data} onViewDetails={() => {}} />
            </Reveal>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found for this filter.</p>
          </div>
        )}
      </section>

      <Footer />
      <ScrollToTop />

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}