import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle, Copy, Check, MessageCircle, ArrowLeft,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import workshopsData from "./data/workshopsData.json";

/* ── Constants ───────────────────────────────────────────────────────────── */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const C = { dark: "#F04A06", mid: "#C5531A", gold: "#D4AF37", light: "#FFF4ED", text: "#1A1A1A" };
const { featuredWorkshop } = workshopsData;

/* ── Copy button ─────────────────────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <motion.button onClick={copy} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
      className="p-2 rounded-lg transition-colors"
      style={{ background: copied ? "rgba(34,197,94,0.15)" : "rgba(212,175,55,0.15)", color: copied ? "#22c55e" : C.gold }}
      title="Copy registration ID">
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </motion.button>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function WorkshopAlreadyRegistered() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  // Redirect if accessed directly without state
  useEffect(() => {
    if (!state?.regId) {
      navigate("/workshop/register", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.regId) return null;

  const { regId, name } = state;

  return (
    <div className="bg-white min-h-screen" style={{ color: C.text }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden text-center"
        style={{ background: `linear-gradient(135deg, #F59E0B 0%, #D97706 60%, #92400E 100%)` }}>
        {/* bg dots */}
        <div className="absolute inset-0 opacity-[.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "22px 22px" }} />

        <div className="relative z-10 max-w-xl mx-auto">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <AlertCircle className="w-10 h-10 text-white" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
              Already Registered
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
              You&apos;re Already Registered{name ? `, ${name.split(" ")[0]}` : ""}! 👋
            </h1>
            <p className="text-white/80 text-base sm:text-lg">
              We found your existing registration for the{" "}
              <strong>{featuredWorkshop.title}</strong>.
              No need to register again — your spot is secured!
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Details ── */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-md mx-auto space-y-5">

          {/* Reg ID card */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.1 }}
            className="rounded-2xl border p-6 text-center"
            style={{ background: "#FFFBEB", borderColor: "#FCD34D88", boxShadow: "0 0 0 1px #FCD34D33" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#92400E" }}>
              Your Existing Registration ID
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl font-black tracking-wider" style={{ color: "#D97706" }}>
                {regId}
              </span>
              <CopyButton text={regId} />
            </div>
            <p className="text-xs mt-3" style={{ color: "#92400E99" }}>
              Bring this ID to the workshop for check-in.
            </p>
          </motion.div>

          {/* Info note */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.2 }}
            className="rounded-xl border p-4 text-sm"
            style={{ background: "#FFF4ED", borderColor: `${C.gold}44`, color: C.text }}>
            <p className="font-semibold mb-1" style={{ color: C.dark }}>📬 Check your email</p>
            <p style={{ color: "rgba(26,26,26,0.65)" }}>
              Your original confirmation was sent to your registered email address.
              If you don&apos;t see it, please check your spam folder.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.3 }}
            className="flex flex-col gap-3">

            {/* WhatsApp */}
            <motion.a href={featuredWorkshop.whatsappGroupLink} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 28px rgba(37,211,102,0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-base text-white transition-all"
              style={{ background: "linear-gradient(135deg,#25D366,#1DA851)" }}>
              <MessageCircle className="w-5 h-5" />
              Join WhatsApp Group
            </motion.a>

            {/* Back to workshops */}
            <Link to="/WorkShops"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{ color: "rgba(26,26,26,0.55)", border: "1px solid #e5e7eb" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Workshops
            </Link>
          </motion.div>

          {/* Contact note */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-xs text-center leading-relaxed"
            style={{ color: "rgba(26,26,26,0.4)" }}>
            Questions? Contact us at{" "}
            <a href="mailto:support@stackenzo.com" className="underline" style={{ color: C.dark }}>
              support@stackenzo.com
            </a>
          </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
