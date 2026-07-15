import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

// ── Google Drive Configuration ──────────────────────────────────────────────
const DRIVE_FOLDER_ID = "100HCmH18rPqrHZZeeHNP4mzMrmuhePOZ";
const API_KEY = import.meta.env?.VITE_GOOGLE_DRIVE_API_KEY || "AIzaSyCGJhHiEGNzbLbLtPRdUgL2YX0T7oEcqmM";

// ── Helper Functions ──────────────────────────────────────────────────────────
function getFileExtension(filename) {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function isImageFile(filename) {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic', 'heif'].includes(ext);
}

// ── Fetch images using Google Drive API ─────────────────────────────────────
async function fetchDriveImages(folderId, apiKey, signal) {
  const baseUrl = "https://www.googleapis.com/drive/v3/files";
  const fields = "nextPageToken,files(id,name,mimeType,thumbnailLink,webContentLink)";
  const query = `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`;

  let allFiles = [];
  let pageToken = "";

  do {
    const params = new URLSearchParams({
      q: query,
      key: apiKey,
      fields,
      orderBy: "name",
      pageSize: "1000",
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

// ── Image Component ──────────────────────────────────────────────────────────
function GalleryImage({ item, index }) {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const getImageUrl = () => {
    if (item.thumbnailLink && !imgError) {
      return item.thumbnailLink.replace(/=s\d+$/, "=s800");
    }
    return `https://images.weserv.nl/?url=${encodeURIComponent(
      `https://drive.google.com/uc?export=view&id=${item.id}`
    )}&w=800&h=560&fit=cover`;
  };

  const handleImageError = (e) => {
    const img = e.target;
    if (!imgError) {
      setImgError(true);
      img.src = `https://drive.google.com/uc?export=view&id=${item.id}`;
      img.onerror = () => {
        img.onerror = null;
        img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='288' height='224'%3E%3Crect width='288' height='224' fill='%23f0f0f0'/%3E%3Ctext x='144' y='112' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle'%3E📷%3C/text%3E%3C/svg%3E`;
        setIsLoading(false);
      };
    } else {
      img.onerror = null;
      img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='288' height='224'%3E%3Crect width='288' height='224' fill='%23f0f0f0'/%3E%3Ctext x='144' y='112' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle'%3E📷%3C/text%3E%3C/svg%3E`;
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <motion.div
      key={`${item.id}-${index}`}
      whileHover={{
        scale: 1.08,
        zIndex: 50,
        boxShadow: "0 20px 60px rgba(240,74,6,0.3)",
      }}
      className="relative flex-shrink-0 w-72 h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-gray-100"
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="w-10 h-10 border-4 border-[#F04A06]/30 border-t-[#F04A06] rounded-full animate-spin" />
        </div>
      )}
      
      {/* Image */}
      <img
        src={getImageUrl()}
        alt=""
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } group-hover:scale-110 transition-transform duration-500`}
        loading="lazy"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F04A06]/40 via-transparent to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

// ── Scrolling Row Component ──────────────────────────────────────────────────
function ScrollingRow({ images, direction = "left", speed = 30 }) {
  const duplicatedImages = useMemo(
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
        {duplicatedImages.map((item, index) => (
          <GalleryImage key={`${item.id}-${index}`} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

// ── Main Gallery Component ──────────────────────────────────────────────────
function GalleryPage() {
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
          .filter((file) => isImageFile(file.name) || file.mimeType?.startsWith("image/"))
          .map((file) => ({
            id: file.id,
            name: file.name,
            mimeType: file.mimeType || "image/jpeg",
            thumbnailLink: file.thumbnailLink,
            webContentLink: file.webContentLink,
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
          setError("Couldn't access Google Drive — check that the API key is valid and the folder is shared publicly.");
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

  // Split images into two rows
  const { row1Images, row2Images } = useMemo(() => {
    const midPoint = Math.ceil(images.length / 2);
    return {
      row1Images: images.slice(0, midPoint),
      row2Images: images.slice(midPoint),
    };
  }, [images]);

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
          </motion.div>

          {/* ── Loading State ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#F04A06] animate-spin mb-4" />
              <p className="text-gray-500">Loading images...</p>
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
              {/* ── Scrolling Rows ── */}
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
            </>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && images.length === 0 && (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No Images Found</h3>
              <p className="text-gray-500">No images available in the gallery yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default GalleryPage;