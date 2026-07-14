import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  motion, AnimatePresence, useInView, useScroll, useTransform,
  useSpring, useMotionValue
} from 'framer-motion';
import {
  BookOpen, Briefcase, Users, Award, TrendingUp, Target, Sparkles,
  Code, Cpu, CircuitBoard, Bot, GraduationCap,
  Zap, Globe, Clock, Star, ArrowRight,
  CheckCircle, Layers, Palette, Lightbulb,
  School, Presentation, Shield,
} from 'lucide-react';

// ============================================================
//  EASING
// ============================================================
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

// ============================================================
//  DATA
// ============================================================
const PROGRAMS = {
  college: [
    {
      id: 'workshops',
      title: 'Advanced Workshops',
      icon: Presentation,
      accent: '#F04A06',
      gradient: 'from-[#F04A06] to-[#F04A06]',
      description: 'Deep-dive technical workshops led by industry experts, covering cutting-edge technologies and real-world applications.',
      features: [
        'Hands-on coding sessions with real projects',
        'Industry-aligned curriculum updated quarterly',
        'Expert mentorship from working professionals',
        'Certificate of completion with project portfolio',
      ],
      topics: [
        { name: 'Full-Stack Development', icon: Code },
        { name: 'Artificial Intelligence', icon: Bot },
        { name: 'Cloud Architecture', icon: Globe },
        { name: 'Cybersecurity', icon: Shield },
      ],
      stats: { duration: '4-8 weeks', projects: '3+', students: '500+' },
      link: '/WorkShops',
    },
    {
      id: 'internships',
      title: 'Industry Internships',
      icon: Briefcase,
      accent: '#F04A06',
      gradient: 'from-[#F04A06] to-[#F04A06]',
      description: 'Structured internship programs with partner companies, offering real-world experience and professional mentorship.',
      features: [
        'Paid internship opportunities with top companies',
        'One-on-one mentorship from industry veterans',
        'Real project contributions to production code',
        'Potential for full-time job offers post-internship',
      ],
      topics: [
        { name: 'Software Engineering', icon: Code },
        { name: 'Product Management', icon: Target },
        { name: 'UX Design', icon: Palette },
        { name: 'Data Science', icon: TrendingUp },
      ],
      stats: { partners: '25+', placement: '85%', stipend: 'Competitive' },
      link: '/workshops',
    },
  ],
  school: {
    robotics: {
      title: 'Robotics Education',
      icon: School,
      accent: '#D4AF37',
      gradient: 'from-[#D4AF37] to-[#D4AF37]',
      description: 'Hands-on robotics programs that introduce students to programming, electronics, and engineering through fun projects.',
      features: [
        'Age-appropriate curriculum for grades 6 – 9',
        'Build and program real robots',
        'Participate in robotics competitions',
        'Develop problem-solving and teamwork skills',
      ],
      topics: [
        { name: 'Arduino Programming', icon: Cpu },
        { name: 'Circuit Design', icon: CircuitBoard },
        { name: 'Sensor Integration', icon: Zap },
        { name: 'Mechanical Design', icon: Layers },
      ],
      levels: [
        { name: 'Junior (Class 6)', emoji: '🤖' },
        { name: 'Intermediate (Class 6 – Class 8)', emoji: '⚙️' },
        { name: 'Advanced (Class 9)', emoji: '🚀' },
      ],
      stats: { students: '700+', projects: '1000+', comps: '15+' },
      link: '/Robotics',
    },
  },
};

const HERO_STATS = [
  { icon: GraduationCap, value: '1200+', label: 'Students', color: 'text-[#F04A06]' },
  { icon: BookOpen, value: '15+', label: 'Programs', color: 'text-[#F04A06]' },
  { icon: Award, value: '95%', label: 'Success Rate', color: 'text-[#F04A06]' },
  { icon: Star, value: '4.9/5', label: 'Rating', color: 'text-[#D4AF37]' },
];

// ============================================================
//  REVEAL COMPONENT
// ============================================================
function Reveal({ children, className = '', delay = 0, from = 'bottom', once = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-55px' });

  const variants = {
    hidden: { opacity: 0, y: from === 'bottom' ? 30 : -30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
//  STAGGER CONTAINER
// ============================================================
function StaggerContainer({ children, className = '', stagger = 0.08, from = 'bottom' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-55px' });

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
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants} transition={{ duration: 0.5, ease: EASE_EXPO }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================================
//  FLOAT ANIMATION
// ============================================================
function Float({ children, className = '', duration = 4, yRange = 10, delay = 0 }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [-yRange / 2, yRange / 2, -yRange / 2] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
//  GLOW CARD
// ============================================================
function GlowCard({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: EASE_EXPO }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ============================================================
//  TILT CARD
// ============================================================
function TiltCard({ children, className = '', intensity = 6 }) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * intensity);
    rotateY.set(x * intensity);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
//  MAGNETIC BUTTON
// ============================================================
function MagBtn({ children, className = '', onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 16 });
  const springY = useSpring(y, { stiffness: 250, damping: 16 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// ============================================================
//  COUNTER
// ============================================================
// ============================================================
//  COUNTER (fixed for decimal values)
// ============================================================
function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  
  // Parse the numeric value, preserving decimals
  const numericMatch = String(value).match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const original = String(value);
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { 
    stiffness: 55, 
    damping: 14,
    precision: 0.01 // Allow decimal precision
  });
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    motionValue.set(inView ? numericValue : 0);
  }, [inView, numericValue]);

  useEffect(() => {
    return springValue.on('change', (v) => {
      // Handle both integer and decimal values
      let formatted;
      if (Number.isInteger(numericValue)) {
        // For integers, round normally
        formatted = Math.round(v);
      } else {
        // For decimals, keep one decimal place
        formatted = v.toFixed(1);
      }
      
      // Replace the first number in the original string with the formatted value
      const updated = original.replace(/[\d.]+/, formatted);
      setDisplay(updated);
    });
  }, [springValue, original, numericValue]);

  return <span ref={ref}>{display}</span>;
}

// ============================================================
//  SCROLL PROGRESS BAR
// ============================================================
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 right-0 w-[3px] h-full origin-top z-[9997]"
      style={{
        scaleY,
        background: 'linear-gradient(to bottom, #F04A06, #D4AF37, #F04A06)',
      }}
    />
  );
}

// ============================================================
//  SECTION LABEL
// ============================================================
function SectionLabel({ text }) {
  return (
    <div className="flex items-center gap-3 justify-center mb-3">
      <div className="h-px w-8 bg-[#D4AF37]" />
      <span className="text-[#D4AF37] font-bold tracking-[0.2em] text-[11px] uppercase">{text}</span>
      <div className="h-px w-8 bg-[#D4AF37]" />
    </div>
  );
}

// ============================================================
//  WORD-BY-WORD HEADING
// ============================================================
function AnimatedHeading({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-50px' });
  const words = typeof children === 'string' ? children.split(' ') : [children];

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.2em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{ duration: 0.6, delay: delay + i * 0.06, ease: EASE_EXPO }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

// ============================================================
//  HERO SECTION
// ============================================================
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);

  return (
    <section id="hero" ref={ref} className="relative pt-32 pb-16 px-4 sm:px-6 min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.04]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #F04A06 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div style={{ y, opacity }} className="max-w-5xl mx-auto text-center relative z-10 w-full">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE_BACK }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-2.5 mb-6 shadow-sm"
        >
          <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </motion.div>
          <span className="text-sm font-semibold text-[#F04A06]">Future-Ready Learning</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: EASE_EXPO }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
        >
          <span className="text-gray-800">Stackenzo</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] via-[#C5531A] to-[#F04A06]">Programs</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE_EXPO }}
          className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Where young minds transform into innovators through hands-on learning and real-world experience
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: EASE_EXPO }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {HERO_STATS.map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -4 }}>
              <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm hover:border-[#D4AF37] transition-all text-center cursor-default">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl font-black text-gray-800">
                  <Counter value={stat.value} />
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex justify-center mt-12"
        >
          <div className="w-6 h-10 border-2 border-[#F04A06]/30 rounded-full flex justify-center cursor-pointer"
            onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <motion.div
              className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-2"
              animate={{ y: [0, 14, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================================
//  PROGRAMS SECTION
// ============================================================
function ProgramsSection() {
  const [activeTab, setActiveTab] = useState('college');

  return (
    <section id="programs" className="py-16 px-4 sm:px-6 bg-white relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <SectionLabel text="Explore Programs" />
          <AnimatedHeading className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#F04A06]">
            Choose Your Path
          </AnimatedHeading>
        </div>

        {/* Tabs */}
        <Reveal from="top" delay={0.1} className="mb-12">
          <div className="flex justify-center">
            <div className="flex gap-2 p-1.5 bg-gray-100/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
              {[
                { id: 'college', label: 'College Programs', icon: GraduationCap },
                { id: 'school', label: 'School Programs', icon: School },
              ].map((tab) => (
                <MagBtn
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-[#F04A06] text-white shadow-md'
                      : 'text-gray-700 hover:text-[#F04A06] hover:bg-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </MagBtn>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'college' && (
            <motion.div
              key="college"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE_EXPO }}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {PROGRAMS.college.map((program, idx) => {
                  const Icon = program.icon;
                  return (
                    <Reveal key={program.id} from={idx === 0 ? 'left' : 'right'} delay={idx * 0.1}>
                      <GlowCard accent={program.accent} className="h-full">
                        <TiltCard intensity={5} className="h-full">
                          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden h-full hover:border-[#D4AF37] transition-colors shadow-sm hover:shadow-md">
                            <div className="p-8 h-full flex flex-col">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-6">
                                <Float duration={4 + idx} delay={idx * 0.3}>
                                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${program.gradient} flex items-center justify-center shadow-md`}>
                                    <Icon className="w-7 h-7 text-white" />
                                  </div>
                                </Float>
                                <div className="flex gap-2 flex-wrap justify-end">
                                  {program.topics.slice(0, 2).map((topic, i) => {
                                    const TIcon = topic.icon;
                                    return (
                                      <span key={i} className="px-2 py-1 bg-amber-50 rounded-lg text-xs flex items-center gap-1 text-gray-700 border border-gray-200">
                                        <TIcon className="w-3 h-3" />
                                        {topic.name}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Title */}
                              <h3 className="text-2xl font-bold mb-3 text-[#F04A06]">{program.title}</h3>
                              <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>

                              {/* Features */}
                              <StaggerContainer className="space-y-2 mb-6" stagger={0.06}>
                                {program.features.map((feature, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{feature}</span>
                                  </div>
                                ))}
                              </StaggerContainer>

                              {/* Topics */}
                              <div className="grid grid-cols-2 gap-2 mb-6">
                                {program.topics.map((topic, i) => {
                                  const TIcon = topic.icon;
                                  return (
                                    <div key={i} className="flex items-center gap-2 bg-amber-50/60 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
                                      <TIcon className="w-3.5 h-3.5 text-[#F04A06] shrink-0" />
                                      {topic.name}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Stats */}
                              <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-amber-50/40 rounded-xl border border-gray-200">
                                {Object.entries(program.stats).map(([key, value]) => (
                                  <div key={key} className="text-center">
                                    <div className="text-base font-black text-[#F04A06]">{value}</div>
                                    <div className="text-xs text-gray-500 capitalize">{key}</div>
                                  </div>
                                ))}
                              </div>

                              {/* CTA */}
                              <div className="mt-auto">
                                <a href={program.link}>
                                  <MagBtn className="group w-full py-3.5 bg-[#F04A06] text-white rounded-xl font-semibold hover:bg-[#C5531A] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-xl">
                                    <span>Explore Program</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </MagBtn>
                                </a>
                              </div>
                            </div>
                          </div>
                        </TiltCard>
                      </GlowCard>
                    </Reveal>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'school' && (
            <motion.div
              key="school"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE_EXPO }}
            >
              <div className="max-w-4xl mx-auto">
                <Reveal from="bottom">
                  <GlowCard accent="#D4AF37">
                    <TiltCard intensity={4}>
                      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#D4AF37] transition-colors shadow-sm">
                        <div className="p-8">
                          {/* Header */}
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                            <Float duration={4.5}>
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] flex items-center justify-center shadow-md">
                                <School className="w-8 h-8 text-white" />
                              </div>
                            </Float>
                            <div>
                              <h3 className="text-3xl font-bold mb-2 text-[#F04A06]">{PROGRAMS.school.robotics.title}</h3>
                              <p className="text-gray-600 leading-relaxed">{PROGRAMS.school.robotics.description}</p>
                            </div>
                          </div>

                          {/* Features & Topics */}
                          <div className="grid lg:grid-cols-2 gap-8 mb-8">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                                Program Features
                              </h4>
                              <StaggerContainer className="space-y-4" stagger={0.06}>
                                {PROGRAMS.school.robotics.features.map((feature, i) => (
                                  <div key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                                    <span className="text-gray-700">{feature}</span>
                                  </div>
                                ))}
                              </StaggerContainer>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
                                What You'll Learn
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {PROGRAMS.school.robotics.topics.map((topic, i) => {
                                  const TIcon = topic.icon;
                                  return (
                                    <div key={i} className="bg-amber-50/60 p-3 rounded-lg border border-gray-200 hover:border-[#D4AF37] transition-all">
                                      <TIcon className="w-5 h-5 text-[#F04A06] mb-1" />
                                      <div className="text-xs text-gray-700 font-medium">{topic.name}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Levels */}
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Age Groups</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {PROGRAMS.school.robotics.levels.map((level, i) => (
                              <div key={i} className="bg-amber-50/60 p-4 rounded-lg border border-gray-200 text-center hover:border-[#D4AF37] transition-all cursor-default">
                                <div className="text-3xl mb-2">{level.emoji}</div>
                                <div className="text-sm font-semibold text-gray-800">{level.name}</div>
                              </div>
                            ))}
                          </div>

                          {/* Stats + CTA */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-amber-50/40 rounded-xl border border-gray-200">
                            <div className="flex gap-6">
                              {Object.entries(PROGRAMS.school.robotics.stats).map(([key, value]) => (
                                <div key={key} className="text-center">
                                  <div className="text-xl font-black text-[#D4AF37]">{value}</div>
                                  <div className="text-xs text-gray-600 capitalize">{key}</div>
                                </div>
                              ))}
                            </div>
                            <a href={PROGRAMS.school.robotics.link}>
                              <MagBtn className="px-7 py-3.5 bg-gradient-to-r from-[#F04A06] to-[#F04A06] text-white rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg">
                                Explore Robotics
                                <ArrowRight className="w-4 h-4" />
                              </MagBtn>
                            </a>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </GlowCard>
                </Reveal>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================================
//  CTA SECTION
// ============================================================
function CTASection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <Reveal from="bottom">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F04A06] to-[#F04A06]" />
            <motion.div className="absolute inset-0 opacity-20" style={{ y }} />

            <div className="relative z-10 px-8 py-16 text-center">
              <Float duration={4}>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </Float>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Begin Your Journey?</h2>
              <p className="text-lg text-white/85 mb-10 max-w-2xl mx-auto">
                Join hundreds of students who have transformed their careers through our programs
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="/Contact">
                  <MagBtn className="px-8 py-3.5 bg-white text-[#F04A06] rounded-xl font-black hover:bg-gray-50 transition-colors shadow-xl flex items-center gap-2">
                    Get Started Today
                    <ArrowRight className="w-4 h-4" />
                  </MagBtn>
                </a>
                <a href="/Contact">
                  <button className="px-8 py-3.5 border-2 border-white text-white rounded-xl font-black hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Schedule a Call
                  </button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {[
                  { icon: Award, text: 'Certified Programs' },
                  { icon: Users, text: 'Expert Mentors' },
                  { icon: Star, text: '4.9/5 Rating' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <badge.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
//  MAIN COMPONENT
// ============================================================
export default function StackenzoPrograms() {
  return (
    <div className="bg-white text-gray-800 min-h-screen overflow-x-hidden">
      <ScrollProgressBar />
      <Navbar />

      <HeroSection />
      <ProgramsSection />
      <CTASection />

      <Footer />
    </div>
  );
}