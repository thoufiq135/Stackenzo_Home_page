import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FolderOpen, Image as ImageIcon, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

// ── Google Drive Configuration ──────────────────────────────────────────────
// NOTE: this key is visible to anyone who opens devtools, since it ships in
// the client bundle. That's fine ONLY if it's restricted (in Google Cloud
// Console -> Credentials) to the Drive API + your site's HTTP referrers.
// Prefer an env var so the key isn't hardcoded in source control:
//   Vite:  import.meta.env.VITE_GOOGLE_DRIVE_API_KEY
const DRIVE_FOLDER_ID = "100HCmH18rPqrHZZeeHNP4mzMrmuhePOZ";
const API_KEY = import.meta.env?.VITE_GOOGLE_DRIVE_API_KEY || "AIzaSyCGJhHiEGNzbLbLtPRdUgL2YX0T7oEcqmM";

// ── Helper Functions ──────────────────────────────────────────────────────────
function extractCategory(fileName) {
  const categories = ["Education", "Events", "Digital Marketing", "Robotics", "Workshop", "Summer", "Camp", "Brezza"];
  for (const cat of categories) {
    if (fileName.toLowerCase().includes(cat.toLowerCase())) {
      return cat;
    }
  }
  return "Gallery";
}

function getFileExtension(filename) {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function isImageFile(filename) {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic', 'heif'].includes(ext);
}

function titleFromPath(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

function placeholderSvg(name) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='288' height='224'%3E%3Crect width='288' height='224' fill='%23FFF4ED'/%3E%3Ctext x='144' y='112' font-family='Arial' font-size='14' fill='%23F04A06' text-anchor='middle'%3E${encodeURIComponent(titleFromPath(name))}%3C/text%3E%3C/svg%3E`;
}

function weservFallbackUrl(fileId) {
  return `https://images.weserv.nl/?url=${encodeURIComponent(
    `https://drive.google.com/uc?export=view&id=${fileId}`
  )}`;
}

// ── Fetch images using Google Drive API (paginated, server-side filtered) ───
async function fetchDriveImages(folderId, apiKey, signal) {
  const baseUrl = "https://www.googleapis.com/drive/v3/files";
  const fields = "nextPageToken,files(id,name,mimeType,thumbnailLink)";
  // Filtering by mimeType + excluding trashed files server-side means we
  // only ever download metadata for files we're actually going to show.
  const query = `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`;

  let allFiles = [];
  let pageToken = "";

  do {
    const params = new URLSearchParams({
      q: query,
      key: apiKey,
      fields,
      orderBy: "name",
      pageSize: "1000", // Drive API max per page
    });
    if (pageToken) params.set("pageToken", pageToken);

    const response = await fetch(`${baseUrl}?${params.toString()}`, { signal });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const reason = body?.error?.message || `Request failed (${response.status})`;
      throw new Error(reason);
    }

    const data = await response.json();
    allFiles = allFiles.concat(data.files || []);
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return allFiles;
}

// ── Scrolling Row Component ──────────────────────────────────────────────────
// The horizontal scroll is driven by a plain CSS @keyframes animation (see
// the <style> block in GalleryPage) rather than Framer Motion's `animate`
// prop. That matters: `animate={{ x: [...] }}` takes a new array literal on
// every render, and Framer Motion restarts the tween whenever it sees a new
// array reference — so any unrelated re-render elsewhere in the page (filter
// clicks, state updates, etc.) would visibly jump/restart the scroll mid-loop.
// A CSS animation runs on its own compositor-driven timeline and can't be
// interrupted by React re-renders, so the loop stays perfectly continuous.
function ScrollingRow({ images, direction = "left", speed = 30 }) {
  const duplicatedImages = useMemo(
    // Quadrupled so a 25%-width translation loops seamlessly with no visible seam.
    () => [...images, ...images, ...images, ...images],
    [images]
  );

  if (images.length === 0) return null;

  const animationName = direction === "left" ? "gallery-scroll-left" : "gallery-scroll-right";

  return (
    <div className="relative overflow-hidden py-4">
      {/* Gradient fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FFF4ED] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FFF4ED] to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-5"
        style={{
          width: "max-content",
          animation: `${animationName} ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {duplicatedImages.map((item, index) => {
          // Prefer the Drive API's own thumbnailLink (stable, first-party,
          // no third-party proxy) at a larger size than its default ~220px.
          // Fall back to the weserv-proxied direct link, then to an inline
          // SVG placeholder if both fail.
          const primarySrc = item.thumbnailLink
            ? item.thumbnailLink.replace(/=s\d+$/, "=s800")
            : weservFallbackUrl(item.id);

          return (
            <motion.div
              key={`${item.id}-${index}`}
              whileHover={{
                scale: 1.08,
                zIndex: 50,
                boxShadow: "0 20px 60px rgba(240,74,6,0.3)",
              }}
              className="relative flex-shrink-0 w-72 h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <img
                src={primarySrc}
                alt={titleFromPath(item.name)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  const img = e.target;
                  const fallbackUrl = weservFallbackUrl(item.id);
                  if (img.src !== fallbackUrl) {
                    // First fallback: try the weserv-proxied direct link
                    img.src = fallbackUrl;
                    img.onerror = () => {
                      img.onerror = null;
                      img.src = placeholderSvg(item.name);
                    };
                  } else {
                    img.onerror = null;
                    img.src = placeholderSvg(item.name);
                  }
                }}
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#F04A06]/80 via-transparent to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white 
                            translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-bold truncate">{titleFromPath(item.name)}</h3>
                <span className="text-xs text-orange-200">{item.category || "Gallery"}</span>
              </div>
              
              {/* Category badge */}
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm
                             text-[#F04A06] text-[10px] font-semibold px-3 py-1 rounded-full
                             shadow-sm border border-orange-100
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.category || "Gallery"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Filter Button ────────────────────────────────────────────────────────────
function FilterButton({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-5 py-2 rounded-full text-sm font-semibold
        transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F04A06] focus-visible:ring-offset-2
        ${
          active
            ? "bg-[#F04A06] text-white shadow-lg shadow-[#F04A06]/30 scale-105"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
        }
      `}
    >
      {active && (
        <motion.span
          layoutId="activeFilterPill"
          className="absolute inset-0 rounded-full bg-[#F04A06] -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {label}
      {count !== undefined && (
        <span className={`ml-1.5 text-xs ${active ? 'text-white/80' : 'text-gray-400'}`}>
          ({count})
        </span>
      )}
    </button>
  );
}

// ── Main Gallery Component ──────────────────────────────────────────────────
function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const files = await fetchDriveImages(DRIVE_FOLDER_ID, API_KEY, controller.signal);

        if (files.length === 0) {
          setError("No images found in this Google Drive folder yet.");
          setImages([]);
          return;
        }

        const imageFiles = files
          // Belt-and-suspenders: query already filters by mimeType, this
          // catches the rare file with a missing/incorrect mimeType.
          .filter((file) => isImageFile(file.name) || file.mimeType?.startsWith("image/"))
          .map((file) => ({
            id: file.id,
            name: file.name,
            category: extractCategory(file.name),
            mimeType: file.mimeType || "image/jpeg",
            thumbnailLink: file.thumbnailLink,
          }));

        setImages(imageFiles);

        if (imageFiles.length === 0) {
          setError("No image files found in the folder.");
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error loading images:", err);

        const msg = (err.message || "").toLowerCase();
        if (msg.includes("api key") || msg.includes("permission") || msg.includes("forbidden")) {
          setError("Couldn't access Google Drive — check that the API key is valid and the folder is shared publicly (\"Anyone with the link\").");
        } else {
          setError("Failed to load images from Google Drive. Please try again in a moment.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadImages();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(images.map((img) => img.category).filter(Boolean))],
    [images]
  );

  const filteredImages = useMemo(
    () =>
      activeCategory === "All"
        ? images
        : images.filter((item) => item.category === activeCategory),
    [images, activeCategory]
  );

  const getCategoryCount = (category) => {
    if (category === "All") return images.length;
    return images.filter((img) => img.category === category).length;
  };

  // Split images into two rows
  const { row1Images, row2Images } = useMemo(() => {
    const midPoint = Math.ceil(filteredImages.length / 2);
    return {
      row1Images: filteredImages.slice(0, midPoint),
      row2Images: filteredImages.slice(midPoint),
    };
  }, [filteredImages]);

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen">
      <style>{`
        @keyframes gallery-scroll-left {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-25%, 0, 0); }
        }
        @keyframes gallery-scroll-right {
          from { transform: translate3d(-25%, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
      `}</style>
      <Navbar />

      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#FFF4ED] to-white relative overflow-hidden min-h-screen">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #F04A06 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#F04A06]/10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* ── Heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center pt-10 pb-8 px-4 sm:px-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3
                           bg-gradient-to-r from-[#F04A06] to-[#F04A06]
                           text-transparent bg-clip-text">
              Our Gallery
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
              Explore our world of innovation, collaboration, and technological excellence
            </p>
            
            {!loading && !error && images.length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                <FolderOpen className="w-4 h-4" />
                <span>{images.length} images from Google Drive</span>
              </div>
            )}
          </motion.div>

          {/* ── Loading State ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#F04A06] animate-spin mb-4" />
              <p className="text-gray-500">Loading images from Google Drive...</p>
            </div>
          )}

          {/* ── Error State ── */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertTriangle className="w-14 h-14 text-[#F04A06] mb-4" />
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Unable to Load Images</h3>
              <p className="text-gray-500 max-w-md text-center">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 flex items-center gap-2 px-6 py-2 bg-[#F04A06] text-white rounded-full font-semibold hover:bg-[#d95d1a] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {/* ── Content ── */}
          {!loading && !error && images.length > 0 && (
            <>
              {/* ── Filter Buttons ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                {categories.map((cat) => (
                  <FilterButton
                    key={cat}
                    label={cat}
                    active={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                    count={getCategoryCount(cat)}
                  />
                ))}
              </motion.div>

              {/* ── Result count ── */}
              <motion.p
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-[#D4AF37] mb-6"
              >
                {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"} in&nbsp;
                <span className="font-semibold">{activeCategory}</span>
              </motion.p>

              {/* ── Scrolling Rows ── */}
              {filteredImages.length > 0 && (
                <div className="relative">
                  {/* Row 1: Left to Right */}
                  <div className="relative mb-4">
                    <ScrollingRow 
                      images={row1Images} 
                      direction="left" 
                      speed={35}
                    />
                  </div>

                  {/* Row 2: Right to Left */}
                  <div className="relative">
                    <ScrollingRow 
                      images={row2Images} 
                      direction="right" 
                      speed={40}
                    />
                  </div>

                  {/* Decorative hint */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1 }}
                    className="text-center text-xs text-gray-400 mt-4"
                  >
                    <span className="inline-flex items-center gap-2">
                      ✦ Infinite scrolling gallery ✦
                    </span>
                  </motion.div>
                </div>
              )}

              {/* ── Empty state ── */}
              {filteredImages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-24"
                >
                  <ImageIcon className="w-14 h-14 text-[#F04A06]/60 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No Images Found</h3>
                  <p className="text-gray-500">
                    No images available for&nbsp;
                    <span className="text-[#F04A06] font-semibold">{activeCategory}</span>.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default GalleryPage;