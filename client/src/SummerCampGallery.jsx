import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./SummerCampGallery.css";

const extractDriveId = (input) => {
  if (!input) return "";
  if (!input.includes("/") && !input.includes(".")) return input;
  const match = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const paramMatch = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (paramMatch) return paramMatch[1];
  return input;
};

// ✅ Summer Camp Images
const GALLERY_DATA = [
  {
    id: "https://drive.google.com/file/d/1uWLnOAFgf5KlUR_1tSZEedgboLsdol3D/view?usp=sharing",
    category: "Activities",
    title: "Exciting Group Games",
  },
  {
    id: "https://drive.google.com/file/d/1TxDfxKX8o5ZUJC47ooeMtymd3MCALUUM/view?usp=sharing",
    category: "Learning",
    title: "Interactive Learning",
  },
  {
    id: "https://drive.google.com/file/d/1N2ebhnTA6meYKrdC1x2N1Xpgl_BWo_N1/view?usp=sharing",
    category: "Learning",
    title: "Creative Workshops",
  },
  {
    id: "https://drive.google.com/file/d/19iFwDE3G-f3IFSHHQEhNnWX5qdpvzAfn/view?usp=sharing",
    category: "Learning",
    title: "Skill Development",
  },
  {
    id: "https://drive.google.com/file/d/1i-ULOBbdSylLsw__n7lz8Ld7Z90kwzUn/view?usp=sharing",
    category: "Activities",
    title: "Team Building",
  },
  {
    id: "https://drive.google.com/file/d/1aDzpVzaVecGh7eups_ICuXD9Wq_IXvzH/view?usp=sharing",
    category: "Activities",
    title: "Camp Highlights",
  },
  {
    id: "https://drive.google.com/file/d/1oT4dZkn6gDHDCzu9a-uMqDt5HHU5JzDR/view?usp=sharing",
    category: "Learning",
    title: "Outdoor Adventures",
  },
  {
    id: "https://drive.google.com/file/d/10rmgcqHRQlcWIqWOzASHcubVA3Xx9hPF/view?usp=sharing",
    category: "Activities",
    title: "Summer Fun",
  },
];

// ✅ School Workshop Images with School Names
const SCHOOL_WORKSHOPS = [
  {
    id: "https://drive.google.com/file/d/1XSjwTZWwTlHjDgLe1KbNtFs-wMyiGst2/view?usp=sharing",
    schoolName: "Podar International School",
    location: "Nellore",
    date: "May 2026",
  },
  {
    id: "https://drive.google.com/file/d/1FBi-A1wmxNyKENLfflEqQTQds5fNZBGp/view?usp=sharing",
    schoolName: "Sangamithra Narayana School",
    location: "Nellore",
    date: "May 2026",
  },
  {
    id: "https://drive.google.com/file/d/1w305sjxllD_MhpB4cU2GujuWPZoAt1ZW/view?usp=sharing",
    schoolName: "ST.Joseph's E.M High School",
    location: "Nellore",
    date: "April 2026",
  },
  {
    id: "https://drive.google.com/file/d/1Jmhyzcp-7ardo-5KZ2IEcWJE8qgQxT1D/view?usp=sharing",
    schoolName: "Sri Venkateswara Institutions",
    location: "Nellore",
    date: "April 2026",
  },
  {
    id: "https://drive.google.com/file/d/1Z14HRTgC_0gI38UfqGdbJQ0SwmVTJqzS/view?usp=sharing",
    schoolName: "Sri Siva Sivani E.M High School",
    location: "Maipadu",
    date: "May 2026",
  },
];

const CATEGORIES = ["All", "Activities", "Learning"];

const getThumbUrl = (id) => `https://lh3.googleusercontent.com/d/${id}`;
const getFallback1 = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
const getFallback2 = (id) => `https://drive.usercontent.google.com/download?id=${id}&export=view`;

const PLACEHOLDER =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23d1d5db'/><text x='50%' y='50%' fill='%236b7280' font-size='16' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>Image</text></svg>";

const WHATSAPP_NUMBER = "9247577906";
const getWhatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// ── Filter Button ──
function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
        active
          ? "bg-[#F04A06] text-white scale-105 shadow-lg"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

// ── Gallery Card ──
function GalleryCard({ item, onClick }) {
  const rawId = extractDriveId(item.id);
  const [imageSrc, setImageSrc] = useState(getThumbUrl(rawId));
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const handleError = () => {
    if (errorCount === 0) {
      setImageSrc(getFallback1(rawId));
      setErrorCount(1);
    } else if (errorCount === 1) {
      setImageSrc(getFallback2(rawId));
      setErrorCount(2);
    } else {
      setImageSrc(PLACEHOLDER);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    setImageSrc(getThumbUrl(rawId));
    setIsLoaded(false);
    setErrorCount(0);
  }, [rawId]);

  return (
    <div
      className="group relative flex-shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2"
      style={{ width: "320px", height: "260px", marginRight: "24px" }}
      onClick={() => onClick(item)}
    >
      <img
        src={imageSrc}
        alt={item.title || item.category}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onError={handleError}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-3 right-3 bg-[#F04A06]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
        {item.category}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-bold text-sm leading-tight">{item.title}</h3>
      </div>
    </div>
  );
}

// ── School Workshop Card with Logo and Name ──
function SchoolWorkshopCard({ workshop, onClick }) {
  const rawId = extractDriveId(workshop.id);
  const [imageSrc, setImageSrc] = useState(getThumbUrl(rawId));
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const handleError = () => {
    if (errorCount === 0) {
      setImageSrc(getFallback1(rawId));
      setErrorCount(1);
    } else if (errorCount === 1) {
      setImageSrc(getFallback2(rawId));
      setErrorCount(2);
    } else {
      setImageSrc(PLACEHOLDER);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    setImageSrc(getThumbUrl(rawId));
    setIsLoaded(false);
    setErrorCount(0);
  }, [rawId]);

  const getSchoolLogo = (schoolName) => {
    const initials = schoolName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    return initials;
  };

  return (
    <div
      className="group relative flex-shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2"
      style={{ width: "320px", marginRight: "24px" }}
      onClick={() => onClick(workshop)}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageSrc}
          alt={workshop.schoolName}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onError={handleError}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <span className="text-[#F04A06] font-bold text-lg">
                {getSchoolLogo(workshop.schoolName)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-base leading-tight">
                {workshop.schoolName}
              </h3>
              <p className="text-white/70 text-xs">
                {workshop.location} • {workshop.date}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🏆</span>
          </div>
          <p className="text-sm font-semibold">Workshop Completed</p>
          <p className="text-xs text-white/80">{workshop.date}</p>
        </div>
      </div>
    </div>
  );
}

// ── Continuous Auto-Scrolling School Workshops Section ──
function SchoolWorkshopsSection({ workshops, onCardClick, speed = 0.8 }) {
  const trackRef = useRef(null);
  const animFrameRef = useRef(null);
  const isPausedRef = useRef(false);
  const scrollPositionRef = useRef(0);

  const CARD_WIDTH = 320 + 24;
  const totalWidth = workshops.length * CARD_WIDTH;
  const duplicatedWorkshops = [...workshops, ...workshops, ...workshops];

  const animate = useCallback(() => {
    if (!isPausedRef.current && trackRef.current && workshops.length > 0) {
      scrollPositionRef.current -= speed;
      if (Math.abs(scrollPositionRef.current) >= totalWidth) {
        scrollPositionRef.current = 0;
      }
      trackRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
    }
    animFrameRef.current = requestAnimationFrame(animate);
  }, [speed, totalWidth, workshops.length]);

  useEffect(() => {
    scrollPositionRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(0px)`;
    }
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animate, workshops]);

  if (workshops.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          willChange: "transform",
          width: `${duplicatedWorkshops.length * CARD_WIDTH}px`
        }}
      >
        {duplicatedWorkshops.map((workshop, idx) => (
          <SchoolWorkshopCard
            key={`${workshop.id}-${idx}`}
            workshop={workshop}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}

// ── 3-Day Workshop Info Component ──
function WorkshopInfo() {
  const workshopDays = [
    {
      day: "Day 1",
      title: "Basics & Concepts",
      description: "Introduction to fundamentals, core concepts, and theoretical knowledge.",
      icon: "📖",
      color: "from-blue-500 to-cyan-500",
      topics: [
        "Introduction to core concepts",
        "Understanding fundamentals",
        "Basic principles and theory",
        "Interactive Q&A session"
      ]
    },
    {
      day: "Day 2",
      title: "Connections & Implementation",
      description: "Hands-on sessions connecting concepts with real-world applications.",
      icon: "🔧",
      color: "from-purple-500 to-pink-500",
      topics: [
        "Connecting concepts to practice",
        "Real-world applications",
        "Collaborative exercises",
        "Hands-on experience"
      ]
    },
    {
      day: "Day 3",
      title: "Demo Verification & Certification",
      description: "Project demonstrations, verification of skills learned, and certification distribution.",
      icon: "🎯",
      color: "from-orange-500 to-red-500",
      topics: [
        "Project presentations",
        "Skills verification",
        "Feedback & assessment",
        "Certificate distribution ceremony"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="mb-16"
    >
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 bg-[#F04A06]/10 text-[#F04A06] rounded-full text-sm font-semibold mb-3">
          🎯 Workshop Schedule
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          3-Day Immersive Workshop
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join our comprehensive 3-day workshop designed to take you from beginner to certified student.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workshopDays.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -8 }}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${day.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <div className={`bg-gradient-to-r ${day.color} p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{day.icon}</span>
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                    {day.day}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{day.title}</h3>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {day.description}
                </p>
                <div className="space-y-2">
                  {day.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-[#F04A06] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${day.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mt-10"
      >
        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#F04A06]/10 to-[#F04A06]/5 rounded-full px-6 py-3 flex-wrap justify-center">
          <span className="text-2xl">🎉</span>
          <p className="text-gray-700">
            <span className="font-bold text-[#F04A06]">Limited Seats Available!</span> Register now to secure your spot
          </p>
          <a
            href={getWhatsappLink("Hi! I want to register for the 3-day workshop")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F04A06] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#C5531A] transition-all duration-300 transform hover:scale-105"
          >
            Register Now →
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Infinite Auto-Scrolling RTL Carousel ──
function AutoScrollCarousel({ items, onCardClick, speed = 0.5 }) {
  const trackRef = useRef(null);
  const animFrameRef = useRef(null);
  const isPausedRef = useRef(false);
  const scrollPositionRef = useRef(0);

  const CARD_WIDTH = 320 + 24;
  const totalWidth = items.length * CARD_WIDTH;
  const duplicatedItems = [...items, ...items, ...items];

  const animate = useCallback(() => {
    if (!isPausedRef.current && trackRef.current && items.length > 0) {
      scrollPositionRef.current -= speed;
      if (Math.abs(scrollPositionRef.current) >= totalWidth) {
        scrollPositionRef.current = 0;
      }
      trackRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
    }
    animFrameRef.current = requestAnimationFrame(animate);
  }, [speed, totalWidth, items.length]);

  useEffect(() => {
    scrollPositionRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(0px)`;
    }
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animate, items]);

  if (items.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          willChange: "transform",
          width: `${duplicatedItems.length * CARD_WIDTH}px`
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <GalleryCard
            key={`${item.id}-${idx}`}
            item={item}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}

// ── Lightbox ──
function Lightbox({ item, onClose }) {
  const rawId = extractDriveId(item.id);
  const [imageSrc, setImageSrc] = useState(getThumbUrl(rawId));
  const [errorCount, setErrorCount] = useState(0);

  const handleError = () => {
    if (errorCount === 0) {
      setImageSrc(getFallback1(rawId));
      setErrorCount(1);
    } else if (errorCount === 1) {
      setImageSrc(getFallback2(rawId));
      setErrorCount(2);
    } else {
      setImageSrc(PLACEHOLDER);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
        >
          ×
        </button>
        <img
          src={imageSrc}
          alt={item.title || item.schoolName}
          className="w-full max-h-[80vh] object-contain bg-gray-100"
          onError={handleError}
        />
        <div className="px-6 py-4">
          <span className="text-xs font-bold text-[#F04A06] uppercase tracking-wider">
            {item.category || "School Workshop"}
          </span>
          <h3 className="text-xl font-bold text-gray-800 mt-1">{item.title || item.schoolName}</h3>
          {item.location && <p className="text-gray-500 text-sm mt-1">{item.location} • {item.date}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──
function SummerCampGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState(null);
  const [scrollSpeed, setScrollSpeed] = useState(0.8);

  const filtered =
    activeCategory === "All"
      ? GALLERY_DATA
      : GALLERY_DATA.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <section className="py-16 px-4 bg-[#FFF4ED] min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#F04A06] pt-6">
              Summer Camp Gallery
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Memories from our fun-filled summer camp & school workshops
            </p>
          </motion.div>

          {/* WhatsApp Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-10"
          >
            <a
              href={getWhatsappLink("Hi! I want to know more about the Summer Camp")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-xl">💬</span>
              Chat with us on WhatsApp
            </a>
          </motion.div>

          {/* SECTION 1: 3-Day Workshop Schedule */}
          <WorkshopInfo />

          {/* SECTION 2: Summer Camp Moments Gallery */}
          <div className="mb-16">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 bg-[#F04A06]/10 text-[#F04A06] rounded-full text-sm font-semibold">
                📸 Summer Camp Moments
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3">
                Summer Camp Gallery
              </h2>
              <p className="text-gray-600 mt-2">
                Cherishing the beautiful moments from our summer camp
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center gap-3 mb-6 flex-wrap"
            >
              {CATEGORIES.map((cat) => (
                <FilterButton
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </motion.div>

            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filtered.length > 0 ? (
                <AutoScrollCarousel
                  items={filtered}
                  onCardClick={setLightboxItem}
                  speed={scrollSpeed}
                />
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">No images found</h3>
                  <p className="text-gray-500">Try selecting a different category</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* SECTION 3: School Workshops */}
          <div>
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-semibold">
                🏫 Academic partner schools
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3">
                Schools We've Conducted Workshops In
              </h2>
              <p className="text-gray-600 mt-2">
                We're proud to have partnered with these prestigious institutions
              </p>
            </div>

            <SchoolWorkshopsSection 
              workshops={SCHOOL_WORKSHOPS} 
              onCardClick={setLightboxItem}
            />
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default SummerCampGallery;