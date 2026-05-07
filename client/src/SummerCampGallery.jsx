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

// ✅ All images with full Drive share URLs
const GALLERY_DATA = [
  // {
  //   id: "https://drive.google.com/file/d/1ZiokM3bI40SY47fap_jPC4ipLfnN0hDU/view?usp=sharing",
  //   category: "Activities",
  //   title: "Camp Opening Day",
  // },
  // {
  //   id: "https://drive.google.com/file/d/1gLEAfwXPG9LwExywIVVFjGVOMP_BN2vn/view?usp=sharing",
  //   category: "Activities",
  //   title: "Fun Outdoor Activities",
  // },
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
  // {
  //   id: "https://drive.google.com/file/d/1qzuyaXA7csUEqdpqe7PS9AxkyrNBmer3/view?usp=sharing",
  //   category: "Activities",
  //   title: "Outdoor Exploration",
  // },
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

// ── Infinite Auto-Scrolling RTL Carousel ──
function AutoScrollCarousel({ items, onCardClick, speed = 0.5 }) {
  const trackRef = useRef(null);
  const animFrameRef = useRef(null);
  const isPausedRef = useRef(false);
  const scrollPositionRef = useRef(0);
  
  // Calculate card width including margin
  const CARD_WIDTH = 320 + 24; // width + margin-right
  const totalWidth = items.length * CARD_WIDTH;
  
  // Create 3 copies for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  const animate = useCallback(() => {
    if (!isPausedRef.current && trackRef.current) {
      // Move from right to left (negative direction)
      scrollPositionRef.current -= speed;
      
      // Reset position when we've scrolled past one set
      if (Math.abs(scrollPositionRef.current) >= totalWidth) {
        scrollPositionRef.current = 0;
      }
      
      trackRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
    }
    animFrameRef.current = requestAnimationFrame(animate);
  }, [speed, totalWidth]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animate]);

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
      
      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
        <span className="inline-flex items-center gap-1">
          <span>◀</span> Scrolls Automatically <span>▶</span>
        </span>
      </div> */}
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
          alt={item.title}
          className="w-full max-h-[80vh] object-contain bg-gray-100"
          onError={handleError}
        />
        <div className="px-6 py-4">
          <span className="text-xs font-bold text-[#F04A06] uppercase tracking-wider">
            {item.category}
          </span>
          <h3 className="text-xl font-bold text-gray-800 mt-1">{item.title}</h3>
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
              Memories from our fun-filled summer camp
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

          {/* Filters */}
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

          {/* Speed Control */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center items-center gap-4 mb-6"
          >
            <span className="text-xs text-gray-500">Scroll Speed:</span>
            <input
              type="range"
              min="0.3"
              max="1.5"
              step="0.1"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
              className="w-32 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#F04A06]"
            />
            <span className="text-xs font-semibold text-[#F04A06]">{scrollSpeed.toFixed(1)}x</span>
          </motion.div>

          {/* Count hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-8"
          >
            {/* <p className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
              Showing{" "}
              <span className="font-bold text-[#F04A06]">{filtered.length}</span>{" "}
              images in <span className="font-semibold">{activeCategory}</span>
              {" "} <i class="fa-solid fa-arrow-pointer"></i>Click to enlarge
            </p> */}
          </motion.div>

          {/* Auto-Scrolling RTL Carousel */}
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