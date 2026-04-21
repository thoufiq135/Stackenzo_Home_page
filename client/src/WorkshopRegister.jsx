import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, Building2, GraduationCap, MapPin, AlertCircle, ChevronLeft, Send,
  Users2, CalendarDays, QrCode, ArrowRight, TrendingUp, BarChart3, PieChart,
  Download, RefreshCw, Eye, Users, Trophy, CheckCircle
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

/* ── Constants ───────────────────────────────────────────────────────────── */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const C = { dark: "#F04A06", mid: "#C5531A", gold: "#D4AF37", light: "#FFF4ED", text: "#1A1A1A" };

const CLASSES = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "UG"];

/* ── Summer Camp Data ───────────────────────────────────────────────────── */
const summerCamp = {
  title: "Summer Camp Registration",
  subtitle: "Register for exciting summer learning programs",
  college: "Across Multiple Locations – On Campus",
  dateDisplay: "Summer 2026",
  fee: "FREE",
  totalSeats: 5000
};

/* ── Zod Schema for Summer Camp ─────────────────────────────────────────── */
const schema = z.object({
  StudentName: z.string().min(2, "Student name must be at least 2 characters").max(255, "Name too long"),
  email: z.string().email("Enter a valid email address").max(255).optional(),
  CollegeName: z.string().min(2, "College/School name is required").max(255, "College name too long"),
  Class: z.string().min(1, "Please select class").max(50, "Class too long"),
  ParentName: z.string().min(2, "Parent name is required").max(255, "Parent name too long"),
  ParentNumber: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit parent mobile required").max(30),
  StudentNumber: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit student mobile required").max(30),
  Location: z.string().min(2, "Location is required").max(255, "Location too long"),
  WhatsappNumber: z.string().regex(/^[6-9]\d{9}$/, "Valid WhatsApp number required").max(30, "Phone too long"),
});

/* ── Live Registration Counter Component ────────────────────────────────── */
function LiveRegistrationCounter() {
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [todayRegistrations, setTodayRegistrations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animatedCount, setAnimatedCount] = useState(0);

  const fetchCounts = async () => {
  setLoading(true);
  try {
    const res = await fetch("https://summercamp-zeta.vercel.app/get_registration_counts");
    const data = await res.json();
    if (data.success) {
      setTotalRegistrations(data.total);
      setTodayRegistrations(data.today);
      // Animate the counter
      animateNumber(0, data.total, 2000);
    }
  } catch (error) {
    console.error("Error fetching counts:", error);
    // Demo data for testing - store as numbers, display with + later
    const demoTotalNumber = 2000;
    const demoTodayNumber = 120;
    
    setTotalRegistrations(demoTotalNumber);
    setTodayRegistrations(demoTodayNumber);
    animateNumber(0, demoTotalNumber, 2000);
  } finally {
    setLoading(false);
  }
};

// Animate number function (stores numeric value)
const animateNumber = (start, end, duration) => {
  const step = (end - start) / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += step;
    if (current >= end) {
      setTotalRegistrations(end);
      clearInterval(timer);
    } else {
      setTotalRegistrations(Math.floor(current));
    }
  }, 16);
};

// For today's registrations animation
const animateTodayNumber = (start, end, duration) => {
  const step = (end - start) / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += step;
    if (current >= end) {
      setTodayRegistrations(end);
      clearInterval(timer);
    } else {
      setTodayRegistrations(Math.floor(current));
    }
  }, 16);
};

  useEffect(() => {
    fetchCounts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const percentage = 90;

  return (
    <div className="mt-6 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: C.gold }} />
          <span className="text-white font-semibold">Live Registrations</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCounts}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3 h-3 text-white/70" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
  <motion.div 
    className="text-3xl sm:text-4xl font-black text-white"
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {loading ? (
      <div className="w-20 h-8 bg-white/20 rounded animate-pulse" />
    ) : (
      <span>
        {typeof totalRegistrations === 'number' 
          ? totalRegistrations.toLocaleString() + '+' 
          : totalRegistrations}
      </span>
    )}
    <span className="text-lg text-white/60"></span>
  </motion.div>
  <p className="text-xs text-white/70 mt-1">Total Registrations</p>
</div>

{/* Today's registrations display */}
<div className="text-right">
  <motion.div 
    className="text-xl font-bold text-white"
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {typeof todayRegistrations === 'number' 
      ? todayRegistrations.toLocaleString() + '+' 
      : todayRegistrations}
  </motion.div>
  <p className="text-xs text-white/70">Today</p>
</div>
        {/* <div className="text-right">
          <motion.div
            className="text-xl font-bold text-white"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            +{todayRegistrations}
          </motion.div>
          <p className="text-xs text-white/70">Today</p>
        </div> */}
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-white/70 mb-1">
          <span>Seats filled</span>
          <span>{Math.min(100, Math.floor(percentage))}%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.dark})` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, percentage)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        {summerCamp.totalSeats - totalRegistrations < 50 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-center mt-2 text-yellow-200"
          >
            ⚡ Only {summerCamp.totalSeats - totalRegistrations} seats left! Register soon.
          </motion.p>
        )}
      </div>
    </div>
  );
}

/* ── Analytics Component ─────────────────────────────────────────────────── */
function RegistrationAnalytics() {
  const [analytics, setAnalytics] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    byClass: {},
    byLocation: {},
    recentRegistrations: []
  });
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [chartType, setChartType] = useState("bar");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://summer-camp-registration-form.vercel.app/get_analytics");
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Demo data for testing
      setAnalytics({
        total: 2487,
        today: 214,
        thisWeek: 863,
        thisMonth: 2487,
        byClass: {
          "6th": 42,
          "7th": 55,
          "8th": 61,
          "9th": 74,
          "10th": 69,
          "11th": 48,
          "12th": 37
        },
        byLocation: {
          "Nellore": 96,
          "Tirupati": 74,
          "Kavali": 43,
          "Gudur": 51,
          "Other": 89
        },
        recentRegistrations: [
          { name: "John Doe", class: "10th", date: new Date().toISOString().split('T')[0], location: "Nellore" },
          { name: "Jane Smith", class: "9th", date: new Date().toISOString().split('T')[0], location: "Tirupati" },
          { name: "Mike Johnson", class: "8th", date: new Date(Date.now() - 86400000).toISOString().split('T')[0], location: "Nellore" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAnalytics) {
      fetchAnalytics();
    }
  }, [showAnalytics]);

  const downloadReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      ...analytics
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registration-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const maxValue = Math.max(...Object.values(analytics.byClass), 0);

  return (
    <div className="mt-8">
      {/* <button
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all border"
        style={{ background: C.light, color: C.dark, borderColor: `${C.dark}55` }}
      >
        <TrendingUp className="w-5 h-5" />
        {showAnalytics ? "Hide Registration Analytics" : "View Registration Analytics"}
      </button> */}

      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-3"
                style={{ background: C.light }}>
                <div>
                  <h3 className="font-black" style={{ color: C.dark }}>Registration Analytics</h3>
                  <p className="text-xs" style={{ color: "rgba(26,26,26,0.6)" }}>
                    Real-time registration statistics
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchAnalytics}
                    className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" style={{ color: C.dark }} />
                  </button>
                  <button
                    onClick={downloadReport}
                    className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                    title="Download Report"
                  >
                    <Download className="w-4 h-4" style={{ color: C.dark }} />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent"
                    style={{ borderColor: C.dark, borderTopColor: "transparent" }} />
                  <p className="mt-2 text-sm text-gray-500">Loading analytics...</p>
                </div>
              ) : (
                <div className="p-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Total Registrations", value: analytics.total, icon: Users2 },
                      { label: "Today", value: analytics.today, icon: CalendarDays },
                      { label: "This Week", value: analytics.thisWeek, icon: TrendingUp },
                      { label: "This Month", value: analytics.thisMonth, icon: BarChart3 },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-3 rounded-xl border"
                        style={{ borderColor: `${C.gold}33`, background: C.light }}>
                        <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: C.gold }} />
                        <p className="text-2xl font-black" style={{ color: C.dark }}>{stat.value}</p>
                        <p className="text-xs" style={{ color: "rgba(26,26,26,0.6)" }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart Type Selector */}
                  <div className="flex justify-end mb-4">
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setChartType("bar")}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${chartType === "bar" ? "bg-white shadow" : ""
                          }`}
                      >
                        Bar Chart
                      </button>
                      <button
                        onClick={() => setChartType("pie")}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${chartType === "pie" ? "bg-white shadow" : ""
                          }`}
                      >
                        Pie Chart
                      </button>
                    </div>
                  </div>

                  {/* Class-wise Distribution Graph */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" style={{ color: C.gold }} />
                      Registrations by Class
                    </h4>

                    {chartType === "bar" ? (
                      <div className="space-y-2">
                        {Object.entries(analytics.byClass).map(([className, count]) => (
                          <div key={className} className="flex items-center gap-3">
                            <span className="text-xs font-medium w-12">{className}</span>
                            <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / maxValue) * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full rounded-lg flex items-center justify-end px-2 text-xs text-white font-medium"
                                style={{ background: `linear-gradient(90deg, ${C.dark}, ${C.mid})` }}
                              >
                                {count > 0 && count}
                              </motion.div>
                            </div>
                            <span className="text-xs font-medium w-8 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative h-64 flex items-center justify-center">
                        <div className="relative w-48 h-48 rounded-full border-8" style={{ borderColor: C.light }}>
                          {Object.entries(analytics.byClass).map(([className, count], index, array) => {
                            const percentage = (count / analytics.total) * 100;
                            const colors = [C.dark, C.mid, C.gold, "#FF6B35", "#4CAF50", "#2196F3", "#9C27B0"];
                            const offset = array.slice(0, index).reduce((acc, [, c]) => acc + (c / analytics.total) * 100, 0);
                            return (
                              <div
                                key={className}
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: `conic-gradient(${colors[index % colors.length]} 0% ${percentage}%, transparent ${percentage}% 100%)`,
                                  transform: `rotate(${offset * 3.6}deg)`,
                                }}
                              />
                            );
                          })}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                              <span className="text-2xl font-black" style={{ color: C.dark }}>{analytics.total}</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute right-0 top-0 space-y-1">
                          {Object.entries(analytics.byClass).map(([className, count], index) => (
                            <div key={className} className="flex items-center gap-2 text-xs">
                              <div className="w-3 h-3 rounded-full" style={{ background: [C.dark, C.mid, C.gold, "#FF6B35", "#4CAF50", "#2196F3", "#9C27B0"][index % 7] }} />
                              <span>{className}: {count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location-wise Distribution */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: C.gold }} />
                      Registrations by Location
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(analytics.byLocation).map(([location, count]) => (
                        <div key={location} className="flex items-center justify-between p-2 rounded-lg border"
                          style={{ borderColor: `${C.gold}33` }}>
                          <span className="text-sm">{location}</span>
                          <span className="text-sm font-bold" style={{ color: C.dark }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Registrations */}
                  {analytics.recentRegistrations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4" style={{ color: C.gold }} />
                        Recent Registrations
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {analytics.recentRegistrations.map((reg, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg border"
                            style={{ borderColor: `${C.gold}22` }}>
                            <div>
                              <p className="text-sm font-medium">{reg.name}</p>
                              <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>
                                Class {reg.class} • {reg.location}
                              </p>
                            </div>
                            <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>
                              {new Date(reg.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Small helpers ───────────────────────────────────────────────────────── */
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="mt-1.5 text-xs flex items-center gap-1.5" style={{ color: "#ef4444" }}>
      <AlertCircle className="w-3 h-3 shrink-0" /> {msg}
    </motion.p>
  );
}

const inputBase = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-[#FFF4ED] text-[#1A1A1A] placeholder-gray-400`;
const inputStyle = (hasError) => ({
  borderColor: hasError ? "#ef4444" : "#e5e7eb",
  boxShadow: hasError ? "0 0 0 3px rgba(239,68,68,0.1)" : undefined,
});

function Label({ icon: Icon, children, required }) {
  return (
    <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: C.text }}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: C.dark }} />}
      {children}
      {required && <span style={{ color: C.gold }}>*</span>}
    </label>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function WorkshopRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitError, setSubmitError] = useState("");
  const isQR = searchParams.get("source") === "qr";
  const collegeParam = searchParams.get("college") || "";

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      StudentName: "",
      email: "",
      CollegeName: collegeParam,
      Class: "",
      ParentName: "",
      ParentNumber: "",
      StudentNumber: "",
      Location: "",
      WhatsappNumber: "",
    },
  });

  useEffect(() => {
    if (collegeParam) setValue("CollegeName", collegeParam);
  }, [collegeParam, setValue]);

  const onSubmit = async (formData) => {
    setSubmitError("");
    try {
      const payload = {
        StudentName: formData.StudentName,
        email: formData.email || "",
        CollegeName: formData.CollegeName,
        Class: formData.Class,
        ParentName: formData.ParentName,
        ParentNumber: formData.ParentNumber,
        StudentNumber: formData.StudentNumber || "",
        Location: formData.Location,
        WhatsappNumber: formData.WhatsappNumber
      };

      console.log("Sending payload:", payload);

      const res = await fetch("https://summer-camp-registration-form.vercel.app/add_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (data.message === "successfully added details") {
        navigate("/workshop/success", {
          state: {
            whatsappLink: data.whatsappLink || "https://chat.whatsapp.com/GiEogrQV5SKBh5Jjp0VeD5?mode=gi_t",
            StudentName: formData.StudentName,
            CollegeName: formData.CollegeName,
            Class: formData.Class,
          },
        });
      } else {
        setSubmitError(data.message || data.error || "Registration failed. Please check your details.");
      }
    } catch (error) {
      setSubmitError("Network error. Please try again.");
      console.error("Network error:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen" style={{ color: C.text }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)` }}>
        <div className="absolute inset-0 opacity-[.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}>

            {/* ── Two Column Row ── */}
            <div className="flex flex-col lg:flex-row items-center gap-10">

              {/* ── LEFT: Text Content ── */}
              <div className="flex-1 w-full">
                <Link to="/WorkShops"
                  className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to Workshops
                </Link>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
                    Summer Camp 2026
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(212,175,55,0.25)", color: C.gold, border: `1px solid ${C.gold}55` }}>
                    {summerCamp.fee}
                  </span>
                </div>

                {/* Poster-style big headline */}
                <div className="mb-4">
                  <h1 className="font-black text-white leading-none tracking-tight">
                    <span className="block text-5xl sm:text-6xl" style={{ letterSpacing: "-0.02em" }}>AI +</span>
                    <span className="block text-5xl sm:text-6xl" style={{ letterSpacing: "-0.02em" }}>ROBOTICS</span>
                    <span className="block text-2xl sm:text-3xl font-extrabold mt-1 tracking-wide text-white/90">
                      SUMMER CAMP
                    </span>
                  </h1>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  {[
                    { icon: Building2, label: summerCamp.college },
                    { icon: CalendarDays, label: summerCamp.dateDisplay },
                    { icon: Users2, label: "Fun Learning Activities" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                      style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <Icon className="w-4 h-4 shrink-0" style={{ color: C.gold }} />
                      {label}
                    </div>
                  ))}
                </div>

                <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md">
                  Build the future with robotics, guided by a seasoned industry professional.
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    // { icon: CalendarDays, label: "27 April, 2026" },
                    // { icon: Building2, label: "Sri Venkateswara Institutions, Mulapeta, Nellore" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                      style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <Icon className="w-4 h-4 shrink-0" style={{ color: C.gold }} />
                      {label}
                    </div>
                  ))}
                </div>

                {/* ✅ LIVE REGISTRATION COUNTER */}
                <LiveRegistrationCounter />
              </div>

              {/* ── RIGHT: Poster Image ── */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.2 }}
                className="w-full lg:w-[420px] xl:w-[480px] shrink-0">
                <div className="relative rounded-2xl overflow-hidden"
                  style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15)" }}>
                  <img
                    src="/images/AI_Robotics_Summer_camp.png"
                    alt="AI + Robotics Summer Camp 2026 Poster"
                    className="w-full h-auto object-cover rounded-2xl"
                  // style={{ display: "block" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 rounded-b-2xl pointer-events-none"
                    style={{ background: `linear-gradient(to top, rgba(240,74,6,0.25), transparent)` }} />
                </div>
              </motion.div>

            </div>
            {/* ── END Two Column Row ── */}

            {/* ── What You'll Learn — Full Width Below ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.35 }}
              className="mt-8 rounded-xl px-5 py-5"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.gold }}>
                What You'll Learn
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Fundamental Concepts in Robotics",
                  "Project Development Essentials",
                  "Exposure to Real-Time Projects",
                  "Hands-On Practical Experience",
                  "Certificate upon Successful Completion",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/85">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: C.gold }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* QR Banner */}
      <AnimatePresence>
        {isQR && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
            style={{ background: C.light, borderBottom: `1px solid ${C.gold}40` }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: C.dark }}>You scanned our QR code! 🎉</p>
                <p className="text-xs" style={{ color: "rgba(26,26,26,0.6)" }}>
                  Your college details have been pre-filled. Complete the form below to secure your spot.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.15 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>

            <div className="px-6 py-5 border-b border-gray-100" style={{ background: C.light }}>
              <h2 className="text-xl font-black" style={{ color: C.dark }}>Complete Registration</h2>
              <p className="text-sm mt-0.5" style={{ color: "rgba(26,26,26,0.6)" }}>
                All fields marked with <span style={{ color: C.gold }}>*</span> are required
              </p>
            </div>

            {submitError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-4 rounded-xl border" style={{ background: C.light, borderColor: "#ef4444", color: "#ef4444" }}>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{submitError}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
              {/* Form Fields */}
              <div>
                <Label icon={User} required>Student Name</Label>
                <input {...register("StudentName")} type="text" placeholder="Enter student full name"
                  className={inputBase} style={inputStyle(errors.StudentName)} />
                <FieldError msg={errors.StudentName?.message} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label icon={Mail}>Email Address</Label>
                  <input {...register("email")} type="email" placeholder="student@example.com"
                    className={inputBase} style={inputStyle(errors.email)} />
                  <FieldError msg={errors.email?.message} />
                </div>
                <div>
                  <Label icon={Phone} required>Parent Phone</Label>
                  <input {...register("ParentNumber")} type="tel" placeholder="9876543210" maxLength={10}
                    className={inputBase} style={inputStyle(errors.ParentNumber)} />
                  <FieldError msg={errors.ParentNumber?.message} />
                </div>
              </div>

              <div>
                <Label icon={Building2} required>College / School Name</Label>
                <input {...register("CollegeName")} type="text" placeholder="Enter college/school name"
                  className={inputBase} style={inputStyle(errors.CollegeName)} />
                <FieldError msg={errors.CollegeName?.message} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label icon={GraduationCap} required>Class</Label>
                  <select {...register("Class")} className={inputBase} style={inputStyle(errors.Class)}>
                    <option value="">Select class</option>
                    {CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <FieldError msg={errors.Class?.message} />
                </div>
                <div>
                  <Label icon={User} required>Parent Name</Label>
                  <input {...register("ParentName")} type="text" placeholder="Enter parent full name"
                    className={inputBase} style={inputStyle(errors.ParentName)} />
                  <FieldError msg={errors.ParentName?.message} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label icon={Phone}>Student Phone</Label>
                  <input {...register("StudentNumber")} type="tel" placeholder="9876543210" maxLength={10}
                    className={inputBase} style={inputStyle(errors.StudentNumber)} />
                  <FieldError msg={errors.StudentNumber?.message} />
                </div>
                <div>
                  <Label icon={MapPin} required>Location</Label>
                  <input {...register("Location")} type="text" placeholder="City/Area"
                    className={inputBase} style={inputStyle(errors.Location)} />
                  <FieldError msg={errors.Location?.message} />
                </div>
              </div>

              <div>
                <Label icon={Phone} required>WhatsApp Number</Label>
                <input {...register("WhatsappNumber")} type="tel" placeholder="9876543210" maxLength={10}
                  className={inputBase} style={inputStyle(errors.WhatsappNumber)} />
                <FieldError msg={errors.WhatsappNumber?.message} />
              </div>

              <motion.button type="submit" disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.015, boxShadow: "0 12px 32px rgba(240,74,6,0.25)" } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-xl font-black text-base text-white flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg,${C.dark},${C.mid})` }}>
                {isSubmitting ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Register Now
                    <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </>
                )}
              </motion.button>

              <p className="text-xs text-center" style={{ color: "rgba(26,26,26,0.45)" }}>
                By registering, you agree to receive updates about this workshop. Your data is safe with us.
              </p>
            </form>
          </motion.div>

          {/* Analytics Section */}
          <RegistrationAnalytics />
        </div>
      </section>

      <Footer />
    </div>
  );
}