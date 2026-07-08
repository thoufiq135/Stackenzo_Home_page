// Internships.jsx
import { useState, useEffect, useRef } from "react";
import {
  motion, AnimatePresence, useScroll, useTransform,
  useSpring, useMotionValue,
} from "framer-motion";
import {
  BookOpen, Clock, Users, Target, X, CheckCircle, Briefcase,
  Code, Zap, Award, Calendar, MapPin, ChevronRight, Star,
  Sparkles, GraduationCap, Brain, Rocket, TrendingUp, Heart,
  Shield, Coffee, Globe, MessageSquare, Share2, Bookmark, BadgeCheck,
  HelpCircle, Mail, Phone, Send, MessageCircle, FileText, User,
  School, CalendarDays, ListChecks, ArrowRight,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import InternshipRegistrationModal from "./InternshipRegistrationModal";
import internshipsData from "./data/internshipsData.json";
import {
  C, EASE_EXPO, EASE_BACK, useScrollDir, Reveal, StaggerContainer,
  Float, GlowCard, TiltCard, MagBtn, ScrollProgressBar,
  NoiseCanvas, ParticleCanvas, Spotlight, WaveDivider,
  SLabel, AHeading, Counter
} from "./WorkshopComponents";

function Internships() {
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [showInternshipRegModal, setShowInternshipRegModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [queryForm, setQueryForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "general",
    message: "",
    preferredContact: "email",
    preferredTime: "anytime"
  });

  const internshipDepartments = ["All", "Engineering", "Degree"];

  let filteredInternships;
  if (selectedDepartment === "All") {
    filteredInternships = internshipsData.internships;
  } else if (selectedDepartment === "Engineering") {
    filteredInternships = internshipsData.internships.filter(i =>
      i.suitedFor.some(b => ["CSE", "IT", "ECE", "EEE", "Mechanical"].includes(b))
    );
  } else if (selectedDepartment === "Degree") {
    filteredInternships = internshipsData.internships.filter(i =>
      i.suitedFor.includes("MCA")
    );
  } else {
    filteredInternships = internshipsData.internships;
  }

  const searchFilteredInternships = filteredInternships.filter(i =>
    searchQuery === "" ||
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: queryForm.name,
          email: queryForm.email,
          phone: queryForm.phone,
          subject: queryForm.subject,
          category: queryForm.category,
          message: queryForm.message
        })
      });
      if (response.ok) {
        toast.success("Query submitted! We'll get back to you within 24 hours.", {
          duration: 3000,
          icon: "✅"
        });
        setQueryForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          category: "general",
          message: "",
          preferredContact: "email",
          preferredTime: "anytime"
        });
        setShowQueryForm(false);
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to submit. Please try again.", {
          duration: 3000,
          icon: "❌"
        });
      }
    } catch {
      toast.error("Network error. Please check your connection.", {
        duration: 3000,
        icon: "❌"
      });
    }
  };

  const handleQueryChange = e =>
    setQueryForm({ ...queryForm, [e.target.name]: e.target.value });

  /* hero parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const heroY = useTransform(heroScroll, [0, 1], [0, -100]);
  const heroO = useTransform(heroScroll, [0, .6], [1, 0.9]);
  const heroS = useTransform(heroScroll, [0, 1], [1, .85]);
  const bigY = useTransform(heroScroll, [0, 1], [0, 160]);

  /* mouse parallax */
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 35, damping: 18 });
  const smy = useSpring(my, { stiffness: 35, damping: 18 });
  const b1x = useTransform(smx, [-1, 1], [-22, 22]);
  const b1y = useTransform(smy, [-1, 1], [-14, 14]);
  const b2x = useTransform(smx, [-1, 1], [16, -16]);
  const b2y = useTransform(smy, [-1, 1], [12, -12]);

  useEffect(() => {
    const fn = e => {
      mx.set((e.clientX / window.innerWidth - .5) * 2);
      my.set((e.clientY / window.innerHeight - .5) * 2);
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const heroStats = [
    { icon: Briefcase, value: "3-6 Months", label: "Duration" },
    { icon: Users, value: "50+", label: "Interns" },
    { icon: TrendingUp, value: "20+", label: "Internships" },
    { icon: Award, value: "100%", label: "Hands-on" }
  ];

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <Toaster position="top-center" />
      <ScrollProgressBar />
      <Navbar />

      {/* ══ HERO ══ */}
      <section
        id="ws-hero"
        ref={heroRef}
        className="relative pt-28 sm:pt-36 pb-20 px-4 sm:px-6 overflow-hidden min-h-screen flex items-center"
      >
        <NoiseCanvas color1="#FFD5B8" color2="#FFF0E6" opacity={0.25} />
        <div className="absolute inset-0 z-[1]"><ParticleCanvas count={20} /></div>

        <motion.div
          className="absolute inset-0 z-[2] opacity-80"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%,rgba(230,107,38,0.18) 0%,transparent 40%)",
              "radial-gradient(circle at 80% 70%,rgba(230,107,38,0.18) 0%,transparent 40%)",
              "radial-gradient(circle at 20% 30%,rgba(230,107,38,0.18) 0%,transparent 40%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* blobs */}
        <motion.div
          style={{ x: b1x, y: b1y }}
          className="absolute top-12 left-[4%] w-[340px] h-[340px] pointer-events-none z-[2]"
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              filter: "blur(100px)",
              opacity: .32,
              background: "radial-gradient(circle,#FFD5B8,transparent)"
            }}
          />
        </motion.div>
        <motion.div
          style={{ x: b2x, y: b2y }}
          className="absolute bottom-12 right-[4%] w-[400px] h-[400px] pointer-events-none z-[2]"
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              filter: "blur(110px)",
              opacity: .2,
              background: `radial-gradient(circle,${C.gold},transparent)`
            }}
          />
        </motion.div>

        {/* floating orbs */}
        {[
          { t: "22%", l: "7%", d: 12, c: `${C.gold}44` },
          { t: "35%", r: "9%", d: 8, c: `${C.dark}33` },
          { b: "25%", l: "13%", d: 14, c: `${C.mid}2a` },
          { b: "35%", r: "16%", d: 10, c: `${C.gold}33` }
        ].map((o, i) => (
          <Float
            key={i}
            duration={4 + i * .6}
            delay={i * .4}
            className="absolute z-[2] rounded-full pointer-events-none"
            style={{
              top: o.t,
              bottom: o.b,
              left: o.l,
              right: o.r,
              width: o.d,
              height: o.d,
              background: o.c
            }}
          />
        ))}

        {/* kinetic bg text */}
        <motion.div
          style={{ y: bigY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[2]"
        >
          <span
            className="font-black leading-none tracking-tighter uppercase whitespace-nowrap"
            style={{ fontSize: "20vw", color: "rgba(230,107,38,0.018)" }}
          >
            INTERN
          </span>
        </motion.div>

        {/* dot grid */}
        <div
          className="absolute inset-0 z-[2] opacity-[.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle,#F04A06 1px,transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        {/* content */}
        <motion.div
          style={{ y: heroY, opacity: heroO, scale: heroS }}
          className="max-w-6xl mx-auto text-center relative z-10 w-full"
        >
          {/* badge */}
          <motion.div
            initial={{ scale: .7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: .65, ease: EASE_BACK }}
            className="inline-block mb-8"
          >
            <span
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
              style={{
                background: "rgba(230,107,38,0.12)",
                border: "1px solid rgba(230,107,38,0.28)",
                color: C.dark
              }}
            >
              <motion.span
                animate={{ opacity: [.7, 1, .7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[#D4AF37]"
              >
                ✦
              </motion.span>
              Professional Internship Program
              <motion.span
                animate={{ opacity: [.7, 1, .7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[#D4AF37]"
              >
                ✦
              </motion.span>
            </span>
          </motion.div>

          {/* heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .3, duration: .75, ease: EASE_EXPO }}
            className="font-bold mb-6 leading-tight"
            style={{ fontSize: "clamp(2.2rem,7vw,4.5rem)" }}
          >
            <span style={{ color: C.text }}>Launch Your Career</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]">
              with Professional Internships
            </span>
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .5, ease: EASE_EXPO }}
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4 mb-8 rounded-2xl border backdrop-blur-sm p-6"
            style={{
              color: C.text,
              borderColor: "rgba(229,231,235,0.8)",
              background: "rgba(255,255,255,0.35)"
            }}
          >
            Engage in structured learning, hands-on project development, and
            guided mentorship designed to prepare you for professional
            excellence.
          </motion.p>

          {/* buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .65, ease: EASE_EXPO }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <MagBtn
              onClick={() => setShowQueryForm(!showQueryForm)}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold border bg-white transition-all duration-300 shadow-sm hover:bg-[#FFF4ED]"
              style={{ borderColor: "#e5e7eb", color: C.text }}
            >
              <HelpCircle className="w-4 h-4" style={{ color: C.gold }} />
              Have a Query?
            </MagBtn>
          </motion.div>

          {/* stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .8, ease: EASE_EXPO }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-2"
          >
            {heroStats.map((s, i) => (
              <motion.div key={i} duration={4 + i * .5} delay={i * .3}>
                <GlowCard accent={C.gold}>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 14px 32px rgba(0,0,0,0.08)" }}
                    className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 text-center cursor-default transition-all"
                  >
                    <s.icon
                      className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2"
                      style={{ color: C.dark }}
                    />
                    <div className="text-lg sm:text-2xl font-black" style={{ color: C.text }}>
                      {s.value}
                    </div>
                    <div
                      className="text-xs sm:text-sm"
                      style={{ color: "rgba(26,26,26,0.6)" }}
                    >
                      {s.label}
                    </div>
                  </motion.div>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>

          {/* scroll cue */}
          <motion.div
            style={{ opacity: scrollOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="flex justify-center mt-12 cursor-pointer"
            onClick={() =>
              document.getElementById("ws-intro")?.scrollIntoView({
                behavior: "smooth"
              })
            }
          >
            <Float duration={2} yRange={10}>
              <div className="w-7 h-12 border-2 border-[#F04A06]/28 rounded-full flex justify-center">
                <motion.div
                  className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-3"
                  animate={{ y: [0, 14, 0], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </div>
            </Float>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ QUERY FORM DROPDOWN ══ */}
      <AnimatePresence>
        {showQueryForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-y border-gray-200"
            style={{ background: C.light }}
          >
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
              <GlowCard accent={C.gold}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold" style={{ color: C.dark }}>
                      Quick Query
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: .9 }}
                      onClick={() => setShowQueryForm(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5" style={{ color: C.text }} />
                    </motion.button>
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
                      <MagBtn
                        type="submit"
                        className="px-6 py-2.5 text-black rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                        style={{
                          background: `linear-gradient(135deg,${C.dark},${C.mid})`
                        }}
                      >
                        Submit Query
                      </MagBtn>
                      <motion.button
                        type="button"
                        onClick={() => setShowQueryForm(false)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: .97 }}
                        className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: C.text }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </div>
              </GlowCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ INTERNSHIPS VIEW ══ */}
      <motion.div
        key="internships"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: .4 }}
      >
        <section
          id="ws-intro"
          className="py-20 px-4 sm:px-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg,${C.light},#fff)` }}
        >
          <NoiseCanvas opacity={0.18} />
          <Spotlight color="rgba(230,107,38,0.04)" />
          <div
            className="absolute inset-0 opacity-[.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle,#F04A06 1px,transparent 1px)",
              backgroundSize: "28px 28px"
            }}
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Reveal from="scale">
              <Float duration={4} yRange={10}>
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg,${C.dark},${C.mid})`
                  }}
                >
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
              </Float>
            </Reveal>
            <SLabel text="Internship Program" />
            <AHeading
              className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]"
              delay={.05}
            >
              Internship Program at Stackenzo
            </AHeading>
            <Reveal from="bottom" delay={.1}>
              <p
                className="text-xl sm:text-2xl font-semibold mb-4"
                style={{ color: C.dark }}
              >
                Learn From the Ground. Grow With Confidence. Enjoy the Work
                Culture.
              </p>
            </Reveal>
            <Reveal from="bottom" delay={.2}>
              <p
                className="text-lg sm:text-xl leading-relaxed mb-8"
                style={{ color: C.text }}
              >
                At Stackenzo, our internship program is not just about
                certificates or short-term training. It is about real exposure,
                real learning, and real motivation.
              </p>
            </Reveal>
            <Reveal from="bottom" delay={.3}>
              <MagBtn
                onClick={() => {
                  setQueryForm({ ...queryForm, category: "internship" });
                  setShowQueryForm(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-all shadow-sm hover:shadow-md"
                style={{
                  background: "#fff",
                  color: C.dark,
                  borderColor: C.gold
                }}
              >
                <HelpCircle className="w-5 h-5" style={{ color: C.gold }} />
                Have Internship Questions? Ask Us
              </MagBtn>
            </Reveal>
          </div>
        </section>

        {/* Internship dept filter */}
        <section className="py-10 px-4 sm:px-6 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto">
            <Reveal from="top" className="text-center mb-6">
              <h3
                className="text-lg sm:text-xl font-semibold"
                style={{ color: C.dark }}
              >
                Filter Internships by Department
              </h3>
            </Reveal>
            <StaggerContainer
              className="flex flex-wrap gap-2 sm:gap-3 justify-center"
              stagger={0.05}
              from="bottom"
            >
              {internshipDepartments.map(dept => (
                <motion.button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: .96 }}
                  className="px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all shadow-sm"
                  style={
                    selectedDepartment === dept
                      ? {
                          background: `linear-gradient(135deg,${C.dark},${C.mid})`,
                          color: "#fff",
                          boxShadow: "0 6px 18px rgba(230,107,38,0.25)"
                        }
                      : {
                          background: "#fff",
                          color: C.text,
                          border: "1px solid #e5e7eb"
                        }
                  }
                >
                  {dept}
                </motion.button>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Internship grid */}
        <section
          id="ws-grid"
          className="py-20 px-4 sm:px-6 relative overflow-hidden"
          style={{ background: C.light }}
        >
          <NoiseCanvas opacity={0.18} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <motion.span
              className="font-black leading-none tracking-tighter uppercase text-[#F04A06]/[0.02]"
              style={{ fontSize: "14vw" }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            >
              INTERN
            </motion.span>
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <SLabel text="Available Roles" />
              <AHeading
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]"
                delay={.05}
              >
                Available Internships
              </AHeading>
            </div>
            {searchFilteredInternships.length === 0 ? (
              <Reveal from="scale" className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-xl" style={{ color: C.text }}>
                  No internships found
                </p>
              </Reveal>
            ) : (
              <StaggerContainer
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                stagger={0.08}
                from="bottom"
              >
                {searchFilteredInternships.map(internship => (
                  <GlowCard key={internship.id} accent={C.gold}>
                    <TiltCard intensity={7}>
                      <motion.div
                        whileHover={{
                          y: -8,
                          boxShadow: "0 24px 55px rgba(0,0,0,0.10)"
                        }}
                        className="group bg-white rounded-xl sm:rounded-2xl border border-gray-200 hover:border-[#F04A06] transition-all overflow-hidden shadow-sm h-full"
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Float duration={4} yRange={6}>
                              <div
                                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
                                style={{
                                  background: C.light,
                                  borderColor: `${C.gold}55`
                                }}
                              >
                                <Briefcase
                                  className="w-5 h-5 sm:w-6 sm:h-6"
                                  style={{ color: C.gold }}
                                />
                              </div>
                            </Float>
                            <div>
                              <h3
                                className="text-base sm:text-lg font-bold group-hover:text-[#F04A06] transition-colors"
                                style={{ color: C.text }}
                              >
                                {internship.title}
                              </h3>
                              <p
                                className="text-xs sm:text-sm"
                                style={{ color: "rgba(26,26,26,0.55)" }}
                              >
                                {internship.duration} • {internship.type}
                              </p>
                            </div>
                          </div>
                          <p
                            className="text-xs sm:text-sm mb-4 line-clamp-2"
                            style={{ color: "rgba(26,26,26,0.65)" }}
                          >
                            {internship.description}
                          </p>
                          <div className="mb-3">
                            <p
                              className="text-xs mb-2"
                              style={{ color: "rgba(26,26,26,0.5)" }}
                            >
                              Technologies:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {internship.technologies.slice(0, 3).map(
                                (tech, j) => (
                                  <span
                                    key={j}
                                    className="px-2 py-0.5 text-xs rounded-full"
                                    style={{
                                      background: C.light,
                                      color: C.dark,
                                      border: `1px solid ${C.gold}55`
                                    }}
                                  >
                                    {tech}
                                  </span>
                                )
                              )}
                              {internship.technologies.length > 3 && (
                                <span
                                  className="px-2 py-0.5 bg-gray-100 text-xs rounded-full border border-gray-200"
                                  style={{ color: C.text }}
                                >
                                  +{internship.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mb-5">
                            <p
                              className="text-xs mb-2"
                              style={{ color: "rgba(26,26,26,0.5)" }}
                            >
                              Suited for:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {internship.suitedFor.slice(0, 3).map(
                                (branch, j) => (
                                  <span
                                    key={j}
                                    className="px-2 py-0.5 text-xs rounded-full"
                                    style={{
                                      background: C.light,
                                      color: C.dark,
                                      border: `1px solid ${C.gold}55`
                                    }}
                                  >
                                    {branch}
                                  </span>
                                )
                              )}
                              {internship.suitedFor.length > 3 && (
                                <span
                                  className="px-2 py-0.5 bg-gray-100 text-xs rounded-full border border-gray-200"
                                  style={{ color: C.text }}
                                >
                                  +{internship.suitedFor.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <motion.button
                              onClick={() => {
                                setSelectedInternship(internship);
                                setShowInternshipRegModal(true);
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: .98 }}
                              className="w-full px-4 py-2.5 sm:py-3 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                              style={{
                                background: `linear-gradient(135deg,${C.dark},${C.mid})`
                              }}
                            >
                              <span>Apply Now</span>
                              <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity
                                }}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setQueryForm({
                                  ...queryForm,
                                  category: "internship",
                                  subject: internship.title,
                                  message: `I'm interested in the ${internship.title} internship.`
                                });
                                setShowQueryForm(true);
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: .98 }}
                              className="w-full px-4 py-2 bg-white text-sm rounded-lg flex items-center justify-center gap-2 transition-all"
                              style={{
                                border: `1px solid ${C.gold}`,
                                color: C.text
                              }}
                            >
                              <HelpCircle
                                className="w-3 h-3"
                                style={{ color: C.gold }}
                              />
                              Quick Query
                            </motion.button>
                          </div>
                        </div>
                        <motion.div
                          className="h-1 bg-gradient-to-r from-[#D4AF37] to-[#C5531A]"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          style={{ transformOrigin: "left" }}
                          transition={{ duration: .3 }}
                        />
                      </motion.div>
                    </TiltCard>
                  </GlowCard>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        {/* What Interns Gain */}
        <WaveDivider color={C.gold} toBg="#fff" />
        <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
          <Spotlight color="rgba(230,107,38,0.04)" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <SLabel text="Intern Benefits" />
              <AHeading
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]"
                delay={.05}
              >
                What Interns Gain at Stackenzo
              </AHeading>
            </div>
            <StaggerContainer
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              stagger={0.09}
              from="bottom"
            >
              {[
                "Professional Experience",
                "Industry-Ready Skills",
                "Portfolio Development",
                "Industry Connections",
                "Stipend and Benefits",
                "Experience Letter"
              ].map((gain, i) => (
                <GlowCard key={i} accent={C.gold}>
                  <TiltCard>
                    <motion.div
                      whileHover={{
                        y: -8,
                        boxShadow: "0 20px 50px rgba(0,0,0,0.08)"
                      }}
                      className="p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all flex flex-col items-center text-center shadow-sm h-full"
                      style={{ background: C.light }}
                    >
                      <Float duration={4 + i * .4} delay={i * .25}>
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: .5 }}
                        >
                          <BadgeCheck
                            className="w-8 h-8 mb-3"
                            style={{ color: C.gold }}
                          />
                        </motion.div>
                      </Float>
                      <p
                        className="text-sm sm:text-base font-semibold"
                        style={{ color: C.text }}
                      >
                        {gain}
                      </p>
                    </motion.div>
                  </TiltCard>
                </GlowCard>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Why Choose Stackenzo Internships */}
        <WaveDivider color={C.gold} toBg={C.light} />
        <section
          className="py-20 px-4 sm:px-6 relative overflow-hidden"
          style={{ background: C.light }}
        >
          <NoiseCanvas opacity={0.18} />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <SLabel text="Why Stackenzo" />
              <AHeading
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]"
                delay={.05}
              >
                Why Choose Stackenzo Internships
              </AHeading>
            </div>
            <StaggerContainer
              className="grid sm:grid-cols-2 gap-4"
              stagger={0.09}
              from="bottom"
            >
              {[
                "Real-world project experience with live deployments",
                "Guidance from industry experts and mentors",
                "Flexible working hours and remote options",
                "Certificate and letter of recommendation",
                "Opportunity to work on cutting-edge technologies",
                "Career guidance and placement assistance"
              ].map((reason, i) => (
                <GlowCard key={i} accent={C.dark}>
                  <TiltCard intensity={7}>
                    <motion.div
                      whileHover={{
                        y: -5,
                        boxShadow: "0 18px 40px rgba(0,0,0,0.08)"
                      }}
                      className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm h-full"
                    >
                      <Float duration={3.5 + i * .3} delay={i * .2}>
                        <CheckCircle
                          className="w-6 h-6 flex-shrink-0"
                          style={{ color: C.gold }}
                        />
                      </Float>
                      <span
                        className="text-sm sm:text-base"
                        style={{ color: C.text }}
                      >
                        {reason}
                      </span>
                    </motion.div>
                  </TiltCard>
                </GlowCard>
              ))}
            </StaggerContainer>
          </div>
        </section>
        <WaveDivider color={C.gold} flip toBg="#3D1A0A" />

        {/* Internship Philosophy Banner */}
        <section
          className="py-20 px-4 sm:px-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#F04A06,#C5531A)" }}
        >
          <Spotlight color="rgba(212,175,55,0.06)" />
          <div className="absolute inset-0">
            <ParticleCanvas count={14} color="rgba(212,175,55,0.07)" />
          </div>
          {[100, 180, 260].map((s, i) => (
            <Float
              key={i}
              duration={6 + i * 2}
              yRange={12}
              delay={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
              style={{
                width: s,
                height: s,
                border: "1px solid rgba(212,175,55,0.1)"
              }}
            />
          ))}
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Reveal from="top">
              <div
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
                style={{
                  border: "1px solid rgba(212,175,55,0.35)",
                  background: "rgba(212,175,55,0.1)"
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                >
                  <Star className="w-4 h-4" style={{ color: C.gold }} />
                </motion.div>
                <span className="text-sm font-bold" style={{ color: C.gold }}>
                  Our Philosophy
                </span>
              </div>
            </Reveal>
            <Reveal from="bottom" delay={.1}>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Our Internship Philosophy
              </h2>
            </Reveal>
            <Reveal from="bottom" delay={.2}>
              <p
                className="text-xl sm:text-2xl font-semibold mb-8"
                style={{ color: "rgba(255,255,255,0.88)" }}
              >
                Internships should not just train — they should transform
                careers.
              </p>
            </Reveal>
            <StaggerContainer
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
              stagger={0.09}
              from="scale"
            >
              {[
                "Build expertise",
                "Create opportunities",
                "Boost employability",
                "Prepare for success"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    scale: 1.06,
                    boxShadow: "0 8px 24px rgba(212,175,55,0.18)"
                  }}
                  className="p-3 sm:p-4 rounded-lg backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.18)"
                  }}
                >
                  <p className="text-sm sm:text-base text-white font-semibold">
                    {item}
                  </p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </motion.div>

      {showInternshipRegModal && selectedInternship && (
        <InternshipRegistrationModal
          internship={selectedInternship}
          onClose={() => {
            setShowInternshipRegModal(false);
            setSelectedInternship(null);
          }}
        />
      )}

      {/* ══ QUERY FORM SECTION ══ */}
      <WaveDivider color={C.gold} toBg="#fff" />
      <section
        id="ws-query"
        className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden"
      >
        <Spotlight color="rgba(230,107,38,0.04)" />
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full"
          style={{ filter: "blur(80px)", opacity: .06, background: C.dark }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full"
          style={{ filter: "blur(80px)", opacity: .06, background: C.mid }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Reveal from="scale">
              <Float duration={4} yRange={8}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg,${C.dark},${C.mid})`
                  }}
                >
                  <HelpCircle
                    className="w-8 h-8"
                    style={{ color: C.gold }}
                  />
                </div>
              </Float>
            </Reveal>
            <SLabel text="Contact Us" />
            <AHeading
              className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#C5531A]"
              delay={.05}
            >
              Have A Question?
            </AHeading>
            <Reveal from="bottom" delay={.15}>
              <p className="text-lg sm:text-xl" style={{ color: C.text }}>
                We're here to help! Send us your queries and we'll get back to
                you within 24 hours.
              </p>
            </Reveal>
          </div>

          <Reveal from="bottom" delay={.2}>
            <GlowCard accent={C.gold}>
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl">
                <form onSubmit={handleQuerySubmit} className="space-y-6">
                  <div
                    className="p-4 rounded-xl border border-gray-200"
                    style={{ background: C.light }}
                  >
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: C.text }}
                    >
                      Category *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        {
                          id: "internship",
                          label: "Internships",
                          Icon: Briefcase
                        },
                        {
                          id: "general",
                          label: "General Inquiry",
                          Icon: MessageCircle
                        }
                      ].map(type => (
                        <motion.button
                          key={type.id}
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: .96 }}
                          onClick={() =>
                            setQueryForm({ ...queryForm, category: type.id })
                          }
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-medium text-sm"
                          style={
                            queryForm.category === type.id
                              ? {
                                  background: `linear-gradient(135deg,${C.dark},${C.mid})`,
                                  color: "#fff",
                                  borderColor: C.dark
                                }
                              : {
                                  background: "#fff",
                                  color: C.text,
                                  borderColor: "#e5e7eb"
                                }
                          }
                        >
                          <type.Icon
                            className="w-4 h-4"
                            style={{
                              color:
                                queryForm.category === type.id
                                  ? C.gold
                                  : C.gold
                            }}
                          />
                          {type.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2 flex items-center gap-2"
                        style={{ color: C.text }}
                      >
                        <User className="w-4 h-4" style={{ color: C.gold }} />{" "}
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={queryForm.name}
                        onChange={handleQueryChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#F04A06] focus:outline-none transition-colors"
                        style={{ color: C.text }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-2 flex items-center gap-2"
                        style={{ color: C.text }}
                      >
                        <Mail className="w-4 h-4" style={{ color: C.gold }} />{" "}
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={queryForm.email}
                        onChange={handleQueryChange}
                        required
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#F04A06] focus:outline-none transition-colors"
                        style={{ color: C.text }}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2 flex items-center gap-2"
                        style={{ color: C.text }}
                      >
                        <Phone className="w-4 h-4" style={{ color: C.gold }} />{" "}
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={queryForm.phone}
                        onChange={handleQueryChange}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#F04A06] focus:outline-none transition-colors"
                        style={{ color: C.text }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-2 flex items-center gap-2"
                        style={{ color: C.text }}
                      >
                        <FileText
                          className="w-4 h-4"
                          style={{ color: C.gold }}
                        />{" "}
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={queryForm.subject}
                        onChange={handleQueryChange}
                        required
                        placeholder="Enter subject"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#F04A06] focus:outline-none transition-colors"
                        style={{ color: C.text }}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2 flex items-center gap-2"
                      style={{ color: C.text }}
                    >
                      <MessageCircle
                        className="w-4 h-4"
                        style={{ color: C.gold }}
                      />{" "}
                      Your Question / Message *
                    </label>
                    <textarea
                      name="message"
                      value={queryForm.message}
                      onChange={handleQueryChange}
                      required
                      rows="4"
                      placeholder="Type your question here…"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:border-[#F04A06] focus:outline-none resize-none transition-colors"
                      style={{ color: C.text }}
                    />
                  </div>
                  <MagBtn
                    type="submit"
                    className="w-full px-6 py-3.5 text-black rounded-xl font-semibold shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg,${C.dark},${C.mid})`
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Submit Query
                  </MagBtn>
                  <p
                    className="text-xs text-center"
                    style={{ color: "rgba(26,26,26,0.45)" }}
                  >
                    We'll get back to you within 24 hours. Your information is
                    safe with us.
                  </p>
                </form>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Internships;