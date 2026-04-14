import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, Building2, GraduationCap, MapPin, CheckCircle, AlertCircle, ChevronLeft, Send,
  Users2, CalendarDays, Award, QrCode, Layers, Zap, MessageSquare, ArrowRight
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

/* ── Constants ───────────────────────────────────────────────────────────── */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const C = { dark: "#F04A06", mid: "#C5531A", gold: "#D4AF37", light: "#FFF4ED", text: "#1A1A1A" };

const CLASSES = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];

/* ── Summer Camp Data ───────────────────────────────────────────────────── */
const summerCamp = {
  title: "Summer Camp Registration",
  subtitle: "Register for exciting summer learning programs",
  college: "sri Venkateswara institution,Mulapeta,Nellore", 
  dateDisplay: "Summer 2026",
  fee: "FREE",
  whatsappGroupLink: "", // Will be dynamic from API
};

/* ── Zod Schema for Summer Camp (Matching Backend Field Names) ──────────── */
const schema = z.object({
  StudentName:    z.string().min(2, "Student name must be at least 2 characters").max(255, "Name too long"),
  email:          z.string().email("Enter a valid email address").max(255).optional(),
  CollegeName:    z.string().min(2, "College/School name is required").max(255, "College name too long"),
  Class:          z.string().min(1, "Please select class").max(50, "Class too long"),
  ParentName:     z.string().min(2, "Parent name is required").max(255, "Parent name too long"),
  ParentNumber:   z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit parent mobile required").max(30),
  StudentNumber:  z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit student mobile required").max(30),
  Location:       z.string().min(2, "Location is required").max(255, "Location too long"),
  WhatsappNumber: z.string().regex(/^[6-9]\d{9}$/, "Valid WhatsApp number required").max(30, "Phone too long"),
});

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
const inputFocus = { borderColor: C.dark, boxShadow: `0 0 0 3px rgba(240,74,6,0.12)` };

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

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
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

  /* Pre-fill CollegeName from QR param */
  useEffect(() => {
    if (collegeParam) setValue("CollegeName", collegeParam);
  }, [collegeParam, setValue]);

  const onSubmit = async (formData) => {
  setSubmitError("");
  try {
    // Convert class from "12th" to 12 (number)
    const classNumber = parseInt(formData.Class);
    
    const payload = {
      StudentName: formData.StudentName,
      email: formData.email || "",
      CollegeName: formData.CollegeName,
      Class: classNumber,  // ✅ Send as number instead of string
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

          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md">
            Build the future with robotics, guided by a seasoned industry professional.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              { icon: CalendarDays, label: "16 April, 2026" },
              { icon: Building2, label: "Sri Venkateswara Institutions, Mulapeta, Nellore" },
              
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
                <Icon className="w-4 h-4 shrink-0" style={{ color: C.gold }} />
                {label}
              </div>
            ))}
          </div>
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
              src="/images/AI + ROBOTICS SUMMER CAMP.png"
              alt="AI + Robotics Summer Camp 2026 Poster"
              className="w-full h-auto object-cover rounded-2xl"
              style={{ display: "block" }}
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

      {/* ── QR Banner ── */}
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

      {/* ── Form ── */}
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

              {/* ── Student Name ── */}
              <div>
                <Label icon={User} required>Student Name</Label>
                <input {...register("StudentName")} type="text" placeholder="Enter student full name"
                  className={inputBase} style={inputStyle(errors.StudentName)} />
                <FieldError msg={errors.StudentName?.message} />
              </div>

              {/* ── Email + Parent Phone ── */}
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

              {/* ── College/School Name ── */}
              <div>
                <Label icon={Building2} required>College / School Name</Label>
                <input {...register("CollegeName")} type="text" placeholder="Enter college/school name"
                  className={inputBase} style={inputStyle(errors.CollegeName)} />
                <FieldError msg={errors.CollegeName?.message} />
              </div>

              {/* ── Class + Parent Name ── */}
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

              {/* ── Student Phone + Location ── */}
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

              {/* ── WhatsApp Number ── */}
              <div>
                <Label icon={Phone} required>WhatsApp Number</Label>
                <input {...register("WhatsappNumber")} type="tel" placeholder="9876543210" maxLength={10}
                  className={inputBase} style={inputStyle(errors.WhatsappNumber)} />
                <FieldError msg={errors.WhatsappNumber?.message} />
              </div>

              {/* ── Submit ── */}
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
        </div>
      </section>

      <Footer />
    </div>
  );
}