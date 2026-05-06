import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ✅ Accepts BOTH formats:
//   - Raw ID:  "1DVKUW12QwE8CLlKbQolIsIbeO8PQxC8Q"
//   - Full URL: "https://drive.google.com/file/d/1ZiokM3bI40SY47fap_jPC4ipLfnN0hDU/view?usp=sharing"
const extractDriveId = (input) => {
  if (!input) return "";

  // Already a raw ID (no slashes or dots)
  if (!input.includes("/") && !input.includes(".")) return input;

  // Match /d/<ID>/ pattern from share URLs
  const match = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Match id= query param (uc?export links)
  const paramMatch = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (paramMatch) return paramMatch[1];

  return input; // fallback: return as-is
};

// ✅ Add images here using either raw IDs or full Drive share links
const GALLERY_DATA = [
   {
    id: "1PFEb67bTdtrDBEYt2y2oBysUBrwne5l2",
    category: "Activities",
  },
  {
    id: "1uWLnOAFgf5KlUR_1tSZEedgboLsdol3D",
    category: "Games",
  },
  {
    id: "1TxDfxKX8o5ZUJC47ooeMtymd3MCALUUM", // raw ID also works
    category: "Learning",
  },
   {
    id: "1N2ebhnTA6meYKrdC1x2N1Xpgl_BWo_N1",
    category: "Learning",
  },
   {
    id: "19iFwDE3G-f3IFSHHQEhNnWX5qdpvzAfn",
    category: "Learning",
  },
//   {
//     id: "1i-ULOBbdSylLsw__n7lz8Ld7Z90kwzUn",
//     category: "Activities"
//   }
];

const CATEGORIES = ["All", "Activities", "Games", "Learning"];

// Most reliable URL for publicly shared Drive images (no CORS issues)
const getThumbUrl = (rawId) =>
  `https://lh3.googleusercontent.com/d/${rawId}`;

// Fallbacks in order of reliability
const getFallback1 = (rawId) =>
  `https://drive.google.com/thumbnail?id=${rawId}&sz=w1000`;

const getFallback2 = (rawId) =>
  `https://drive.usercontent.google.com/download?id=${rawId}&export=view`;

const PLACEHOLDER =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23d1d5db'/><text x='50%' y='50%' fill='%236b7280' font-size='16' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>Image</text></svg>";

const WHATSAPP_NUMBER = "9247577906"; // 🔁 replace with your number

const getWhatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// ── Filter Button ──
function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
        active
          ? "bg-[#F04A06] text-white scale-105"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

// ── Gallery Card ──
function GalleryCard({ item }) {
  const rawId = extractDriveId(item.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl bg-white"
    >
      <img
        src={getThumbUrl(rawId)}
        alt={item.category}
        className="w-full h-72 object-cover"
        onError={(e) => {
          const src = e.target.src;
          if (src.includes("lh3.googleusercontent.com")) {
            // lh3 failed → try thumbnail
            e.target.src = getFallback1(rawId);
          } else if (src.includes("thumbnail")) {
            // thumbnail failed → try usercontent download
            e.target.src = getFallback2(rawId);
          } else {
            // all failed → placeholder
            e.target.onerror = null;
            e.target.src = PLACEHOLDER;
          }
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

      {/* Text */}
      <div className="absolute bottom-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition">
        <h3 className="font-bold">{item.category}</h3>
      </div>
    </motion.div>
  );
}

// ── Main Page ──
function SummerCampGallery() {
  const [activeCategory, setActiveCategory] = useState("All");

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
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-[#F04A06] pt-6">
              Summer Camp Gallery
            </h1>
            <p className="text-gray-500 mt-2">
              Memories from our fun-filled summer camp
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <a
              href={getWhatsappLink("Hi! I want to know more about the Summer Camp")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600
               text-white px-6 py-3 rounded-full shadow-lg transition"
            >
              💬 Chat with us on WhatsApp
            </a>
          </motion.div>

          {/* Filters */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {CATEGORIES.map((cat) => (
              <FilterButton
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>

          {/* Count */}
          <p className="text-center mb-6 text-sm text-gray-500">
            {filtered.length} images in {activeCategory}
          </p>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filtered.map((item, index) => (
                <GalleryCard key={index} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <h3>No images found</h3>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default SummerCampGallery;