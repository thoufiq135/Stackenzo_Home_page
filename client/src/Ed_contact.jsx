import React, { useState, useRef, useEffect } from 'react';
import {
  motion, useInView, useScroll, useTransform,
  useSpring, useMotionValue
} from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, Clock, Send, MessageSquare,
  User, Building, Briefcase, ArrowRight, Sparkles,
  CheckCircle, Facebook, Twitter, Linkedin, Instagram,
  Youtube, Globe, Navigation, Compass, Share2,
  Calendar, Users, Award, Star, Zap, Rocket, Headphones
} from 'lucide-react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";

/* ══════════════════════════════════════════════
   EASING
══════════════════════════════════════════════ */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* ══════════════════════════════════════════════
   REVEAL COMPONENT
══════════════════════════════════════════════ */
function Reveal({ children, className = "", from = "bottom", once = true }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once, margin: "-55px" });
  
  const variants = {
    hidden: { opacity: 0, y: from === 'bottom' ? 40 : -40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inV ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   STAGGER CONTAINER
══════════════════════════════════════════════ */
function StaggerContainer({ children, className = "", stagger = 0.08 }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-55px" });

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inV ? "visible" : "hidden"}
      variants={variants}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants} transition={{ duration: 0.4, ease: EASE_EXPO }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   FLOAT ANIMATION
══════════════════════════════════════════════ */
function Float({ children, className = "", duration = 4, yRange = 10, delay = 0 }) {
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

/* ══════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════ */
function MagBtn({ children, className = "", onClick, type = "button" }) {
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
      type={type}
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

/* ══════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════ */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 right-0 w-[4px] h-full origin-top z-[9997]"
      style={{
        scaleY,
        background: "linear-gradient(to bottom,#F04A06,#D4AF37,#C5531A,#F04A06)"
      }}
    />
  );
}

// ============================================================
//  CONTACT PAGE
// ============================================================
export default function ContactPage() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], [0, -80]);
  const heroO = useTransform(heroP, [0, .6], [1, 0.9]);

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 92475 77907", "+91 92475 77906"],
      action: "tel:+919247577907",
      color: "#F04A06"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["edtech@stackenzo.com", "hello@stackenzo.com"],
      action: "mailto:edtech@stackenzo.com",
      color: "#C5531A"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["16-13-228, 5th Line, Harinathpuram", "Nellore - 524003, Andhra Pradesh"],
      action: "https://www.google.com/maps/place/16-13-228,+Muthukur+Rd,+Lic+Colony,+Harinathpuram,+Nellore,+Andhra+Pradesh+524003",
      color: "#D4AF37"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 2:00 PM"],
      color: "#F04A06"
    }
  ];

  const socialLinks = [
    { icon: Linkedin, link: "https://www.linkedin.com/company/stackenzo/", label: "LinkedIn", color: "#0A66C2" },
    { icon: Twitter, link: "https://x.com/Stackenzo", label: "Twitter", color: "#1DA1F2" },
    { icon: Youtube, link: "https://www.youtube.com/results?search_query=stackenzo", label: "YouTube", color: "#FF0000" },
    { icon: Instagram, link: "https://www.instagram.com/stackenzo", label: "Instagram", color: "#E4405F" },
    { icon: Facebook, link: "https://www.facebook.com/stackenzo", label: "Facebook", color: "#1877F2" }
  ];

  return (
    <div className="bg-white text-gray-800 min-h-screen overflow-x-hidden">
      <ScrollProgressBar />
      <Navbar />

      {/* ═══ HERO SECTION ═══ */}
      <section ref={heroRef} className="relative pt-32 pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-[#FFF4ED] via-white to-[#FFF0E6]/30">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(240,74,6,0.04),transparent_70%)]" />
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#F04A06]/5 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-3xl" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroO }} className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#F04A06]/20 rounded-full px-4 py-2 mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-semibold text-[#F04A06]">Get In Touch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4"
          >
            <span className="text-gray-800">Let's Connect &</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F04A06] to-[#D4AF37]">Build Together</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Have a question, idea, or ready to start your robotics journey? We'd love to hear from you!
          </motion.p>
        </motion.div>
      </section>

      {/* ═══ CONTACT INFO CARDS ═══ */}
      <section className="py-10 px-4 sm:px-6 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              const isClickable = info.action;
              const Wrapper = isClickable ? 'a' : 'div';
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(240,74,6,0.08)" }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all"
                >
                  <Wrapper
                    href={isClickable ? info.action : undefined}
                    target={isClickable ? "_blank" : undefined}
                    rel={isClickable ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FFF4ED] flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6" style={{ color: info.color }} />
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{info.title}</h4>
                    {info.details.map((detail, j) => (
                      <p key={j} className="text-sm text-gray-500">{detail}</p>
                    ))}
                  </Wrapper>
                </motion.div>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ CONTACT FORM & MAP ═══ */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Contact Info & Quick Actions */}
            <div>
              <div className="mb-8">
                <span className="text-[#F04A06] font-bold tracking-widest text-sm uppercase">Reach Out</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-gray-800">We're Here to Help</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#F04A06] to-[#D4AF37] mt-4 rounded" />
                <p className="text-gray-500 mt-4">
                  Whether you have questions about our robotics programs, want to schedule a demo, 
                  or need support, our team is ready to assist you.
                </p>
              </div>

              {/* Quick Action Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#FFF4ED] rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#F04A06]/10 flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-[#F04A06]" />
                  </div>
                  <h4 className="font-bold text-gray-800">Call Us Directly</h4>
                  <p className="text-sm text-gray-500 mt-1">Available 9AM - 6PM</p>
                  <a href="tel:+919876543210" className="text-[#F04A06] font-bold text-lg hover:underline block mt-2">
                    +91 9247577907
                  </a>
                </div>

                <div className="bg-[#FFF4ED] rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h4 className="font-bold text-gray-800">Email Us</h4>
                  <p className="text-sm text-gray-500 mt-1">We respond within 24hrs</p>
                  <a href="mailto:edtech@stackenzo.com" className="text-[#D4AF37] font-bold text-sm hover:underline block mt-2">
                    edtech@stackenzo.com
                  </a>
                </div>

                <div className="bg-[#FFF4ED] rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow sm:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F04A06]/10 flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-6 h-6 text-[#F04A06]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">24/7 Support</h4>
                      <p className="text-sm text-gray-500">
                        Our support team is always available to help you with any technical issues or questions.
                      </p>
                      <a href="mailto:support@stackenzo.com" className="text-[#F04A06] font-semibold text-sm hover:underline inline-block mt-1">
                        hello@stackenzo.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4">Connect With Us</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={i}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-[#FFF4ED] flex items-center justify-center hover:bg-[#F04A06] hover:text-white transition-all duration-300 group"
                      >
                        <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Map & Location */}
            <div>
              <div className="bg-[#FFF4ED] rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Navigation className="w-5 h-5 text-[#F04A06]" />
                  <span className="font-bold text-gray-800">Find Us Here</span>
                </div>
                <div className="rounded-xl overflow-hidden aspect-[4/3] w-full bg-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15455.394021869784!2d79.99096211694324!3d14.43589273584212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4cf348db124e65%3A0xd5cf8f1dc2dc4153!2s16-13-228%2C%20Muthukur%20Rd%2C%20Lic%20Colony%2C%20Harinathpuram%2C%20Nellore%2C%20Andhra%20Pradesh%20524003!5e0!3m2!1sen!2sin!4v1782968544826!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location Map"
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-[#F04A06]" />
                    <span>16-13-228, 5th Line, Harinathpuram, Nellore - 524003</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-[#F04A06]" />
                    <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://www.google.com/maps/place/16-13-228,+Muthukur+Rd,+Lic+Colony,+Harinathpuram,+Nellore,+Andhra+Pradesh+524003"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#F04A06] text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#C5531A] transition-colors shadow-md shadow-[#F04A06]/20"
                  >
                    <Compass className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-black text-[#F04A06]">500+</div>
                  <div className="text-xs text-gray-500">Happy Clients</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-black text-[#D4AF37]">98%</div>
                  <div className="text-xs text-gray-500">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#FFF4ED]/50 via-white to-[#FFF0E6]/50">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#FFF4ED] flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-[#F04A06]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Ready to Start Your Robotics Journey?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Schedule a free consultation with our experts and discover how Stackenzo can transform your school's STEM education.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="tel:+919247577907" className="px-8 py-3.5 bg-[#F04A06] text-white rounded-full font-bold hover:bg-[#C5531A] transition-all shadow-lg shadow-[#F04A06]/30 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <a href="mailto:edtech@stackenzo.com" className="px-8 py-3.5 border-2 border-[#F04A06] text-[#F04A06] rounded-full font-bold hover:bg-[#FFF4ED] transition-all flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}