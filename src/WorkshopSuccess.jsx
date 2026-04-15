import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle, Copy, Check, MessageCircle,
  CalendarPlus, ArrowLeft, Sparkles, Download, Share2,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import workshopsData from "./data/workshopsData.json";

/* ── Constants ───────────────────────────────────────────────────────────── */
const EASE_EXPO = [0.16, 1, 0.3, 1];
const C = { dark: "#F04A06", mid: "#C5531A", gold: "#D4AF37", light: "#FFF4ED", text: "#1A1A1A" };
const { featuredWorkshop } = workshopsData;

/* ── Google Calendar link generator ─────────────────────────────────────── */
function buildCalendarLink() {
  const { dateISO, calendarTitle, calendarLocation, subtitle } = featuredWorkshop;
  if (!dateISO) return null;

  const start = dateISO.replace(/-/g, "");
  const endDate = new Date(dateISO);
  endDate.setDate(endDate.getDate() + 2);
  const end = endDate.toISOString().slice(0, 10).replace(/-/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: calendarTitle || "Summer Camp – Stackenzo",
    dates: `${start}/${end}`,
    details: subtitle || "Summer Camp by Stackenzo",
    location: calendarLocation || "Online / Venue",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ── Confetti particles ─────────────────────────────────────────────────── */
function Confetti() {
  const colors = [C.dark, C.gold, C.mid, "#fff", "#22c55e", "#25D366"];
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    size: Math.random() * 6 + 4,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: -10, width: p.size, height: p.size, background: p.color }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: 720 }}
          transition={{ duration: 2.2 + Math.random(), delay: p.delay, ease: "easeIn" }} />
      ))}
    </div>
  );
}

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

/* ── Helper function to extract WhatsApp link from text ─────────────────── */
function getValidWhatsAppLink(link) {
  if (!link) return null;
  
  // If it's a string containing a WhatsApp link, extract it
  if (typeof link === 'string') {
    // Look for WhatsApp URL pattern
    const whatsappRegex = /(https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9_-]+(?:\?[^\s]+)?)/i;
    const match = link.match(whatsappRegex);
    
    if (match) {
      console.log("Extracted WhatsApp URL:", match[1]);
      return match[1]; // Return just the URL
    }
    
    // Also check for invite code pattern
    const inviteCodeRegex = /([A-Za-z0-9_-]{22})/;
    const codeMatch = link.match(inviteCodeRegex);
    if (codeMatch && !link.includes('chat.whatsapp.com')) {
      return `https://chat.whatsapp.com/${codeMatch[1]}`;
    }
  }
  
  // If it's already a valid WhatsApp link
  if (link.includes('https://chat.whatsapp.com/') || link.includes('http://chat.whatsapp.com/')) {
    return link;
  }
  
  return null;
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function WorkshopSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const calendarUrl = buildCalendarLink();
  const [copiedLink, setCopiedLink] = useState(false);

  const state = location.state;

  // Redirect if accessed directly without state
  useEffect(() => {
    if (!state?.regId && !state?.StudentName) {
      navigate("/workshop/register", { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  // Handle both workshop registration and summer camp registration
  const isSummerCamp = state.StudentName !== undefined;
  
  const {
    regId,
    name,
    batch,
    college,
    workshopTitle,
    // Summer camp specific
    StudentName,
    CollegeName,
    Class,
    whatsappLink
  } = state;

  const displayName = name || StudentName;
  const displayCollege = college || CollegeName;
  const displayClass = Class;
  
  // Get valid WhatsApp link (extract URL from text)
  const rawWhatsAppLink = whatsappLink || featuredWorkshop?.whatsappGroupLink;
  const displayWhatsAppLink = getValidWhatsAppLink(rawWhatsAppLink);
  
  // Debug log to check WhatsApp link
  console.log("Raw WhatsApp Link:", rawWhatsAppLink);
  console.log("Extracted Valid WhatsApp Link:", displayWhatsAppLink);

  const handleCopyWhatsAppLink = () => {
    if (displayWhatsAppLink) {
      navigator.clipboard.writeText(displayWhatsAppLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDownloadTicket = () => {
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Registration Ticket</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .ticket { max-width: 500px; margin: 0 auto; border: 2px solid #F04A06; border-radius: 15px; padding: 20px; }
          .header { text-align: center; border-bottom: 2px dashed #F04A06; padding-bottom: 15px; }
          .content { padding: 20px 0; }
          .footer { text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
          .whatsapp { background: #25D366; color: white; padding: 10px; border-radius: 8px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1 style="color: #F04A06;">${isSummerCamp ? "☀️ Summer Camp 2026" : "🤖 Robotics Summer Camp"}</h1>
            <p>Registration Confirmation</p>
          </div>
          <div class="content">
            <p><strong>${isSummerCamp ? "Student Name:" : "Name:"}</strong> ${displayName}</p>
            <p><strong>${isSummerCamp ? "School/College:" : "College:"}</strong> ${displayCollege}</p>
            ${displayClass ? `<p><strong>Class:</strong> ${displayClass}</p>` : ""}
            ${batch ? `<p><strong>Batch:</strong> ${batch}</p>` : ""}
            ${regId ? `<p><strong>Registration ID:</strong> ${regId}</p>` : ""}
            <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
            ${displayWhatsAppLink ? `<div class="whatsapp">
              <p><strong>📱 Join WhatsApp Group:</strong></p>
              <p style="font-size: 12px; word-break: break-all;">${displayWhatsAppLink}</p>
            </div>` : ""}
          </div>
          <div class="footer">
            <p>Powered by Stackenzo | Empowering Innovation 🚀</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([ticketHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${isSummerCamp ? "SummerCamp" : "Workshop"}_Ticket_${displayName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: isSummerCamp ? "Summer Camp Registration Confirmed!" : "Workshop Registration Confirmed!",
        text: `I've successfully registered for ${isSummerCamp ? "Summer Camp" : "Robotics Workshop"}! 🎉`,
        url: displayWhatsAppLink || window.location.href,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen" style={{ color: C.text }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden text-center"
        style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 60%, #3D1A0A 100%)` }}>
        <Confetti />

        {/* bg rings */}
        {[120, 220, 320].map((s, i) => (
          <motion.div key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: s, height: s, border: "1px solid rgba(212,175,55,0.15)" }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} />
        ))}

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <CheckCircle className="w-10 h-10" style={{ color: C.gold }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-bold"
              style={{ background: "rgba(212,175,55,0.2)", color: C.gold, border: `1px solid ${C.gold}44` }}>
              <Sparkles className="w-4 h-4" /> Registration Confirmed!
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
              You're In, {displayName}! 🎉
            </h1>
            <p className="text-white/80 text-base sm:text-lg">
              Your spot for <strong>{isSummerCamp ? "Summer Camp 2026" : (workshopTitle || "Robotics Summer Camp")}</strong> has been confirmed.
              {!isSummerCamp && " We've sent a confirmation to your email."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Details ── */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto space-y-5">

          {/* Registration ID Card (only for workshop) */}
          {regId && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.1 }}
              className="rounded-2xl border p-6 text-center"
              style={{ background: C.light, borderColor: `${C.gold}55`, boxShadow: `0 0 0 1px ${C.gold}22` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(26,26,26,0.5)" }}>
                Your Registration ID
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl sm:text-4xl font-black tracking-wider" style={{ color: C.dark }}>
                  {regId}
                </span>
                <CopyButton text={regId} />
              </div>
              <p className="text-xs mt-3" style={{ color: "rgba(26,26,26,0.55)" }}>
                Save this ID — you'll need it for check-in at the venue.
              </p>
            </motion.div>
          )}

          {/* WhatsApp Group Card - Fixed with extracted URL */}
          {displayWhatsAppLink && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.15 }}
              className="rounded-2xl border-2 overflow-hidden"
              style={{ borderColor: "#25D366" }}>
              <div className="px-5 py-4" style={{ background: "#25D366", color: "white" }}>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-bold">Join WhatsApp Group</span>
                </div>
                <p className="text-xs mt-1 text-white/90">
                  Stay updated with announcements, schedules, and resources
                </p>
              </div>
              <div className="p-5 bg-gray-50">
                <div className="bg-white p-3 rounded-lg mb-4 break-all text-xs font-mono">
                  {displayWhatsAppLink}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={displayWhatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#20b859] transition-all text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Join Group
                  </a>
                  <button
                    onClick={handleCopyWhatsAppLink}
                    className="flex-1 border-2 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm"
                    style={{ borderColor: "#25D366", color: "#25D366" }}
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? "Copied!" : "Copy Link"}
                  </button>
                  {navigator.share && (
                    <button
                      onClick={handleShare}
                      className="flex-1 border-2 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm"
                      style={{ borderColor: C.gold, color: C.gold }}
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Registration Details */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
            className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2"
              style={{ background: "#f9fafb" }}>
              <span className="text-sm font-bold" style={{ color: C.dark }}>
                {isSummerCamp ? "Registration Details" : "Workshop Details"}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                isSummerCamp ? ["Program", "☀️ Summer Camp 2024"] : ["Workshop", workshopTitle || featuredWorkshop.title],
                ["Name", displayName],
                [isSummerCamp ? "School/College" : "College", displayCollege],
                displayClass ? ["Class", displayClass] : null,
                batch ? ["Batch", batch] : null,
                !isSummerCamp && featuredWorkshop.college ? ["Venue", featuredWorkshop.college] : null,
                !isSummerCamp && featuredWorkshop.dateDisplay ? ["Date", featuredWorkshop.dateDisplay] : null,
              ].filter(item => item && item[1]).map(([label, val]) => (
                <div key={label} className="flex items-start justify-between px-5 py-3">
                  <span className="text-sm font-semibold w-28 shrink-0" style={{ color: "rgba(26,26,26,0.55)" }}>{label}</span>
                  <span className="text-sm font-medium text-right" style={{ color: C.text }}>{val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Important Instructions */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.25 }}
            className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100" style={{ background: "#f9fafb" }}>
              <span className="text-sm font-bold" style={{ color: C.dark }}>Important Instructions</span>
            </div>
            <div className="px-5 py-4 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Join the WhatsApp group immediately to receive updates</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Keep your registration confirmation for future reference</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Further details about sessions will be shared in the group</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Feel free to reach out to support@stackenzo.com for queries</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.3 }}
            className="flex flex-col gap-3">

            {/* Download Ticket */}
            <motion.button
              onClick={handleDownloadTicket}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-base transition-all border"
              style={{ background: "#fff", color: C.dark, borderColor: `${C.dark}55` }}>
              <Download className="w-5 h-5" />
              Download Ticket
            </motion.button>

            {/* Calendar (only for workshop) */}
            {!isSummerCamp && calendarUrl && (
              <motion.a href={calendarUrl} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-base transition-all border"
                style={{ background: "#fff", color: C.dark, borderColor: `${C.dark}55` }}>
                <CalendarPlus className="w-5 h-5" />
                Add to Google Calendar
              </motion.a>
            )}

            {/* Back to Workshops/Home */}
            <Link to={isSummerCamp ? "/" : "/WorkShops"}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{ color: "rgba(26,26,26,0.55)", border: "1px solid #e5e7eb" }}>
              <ArrowLeft className="w-4 h-4" /> {isSummerCamp ? "Back to Home" : "Back to Workshops"}
            </Link>
          </motion.div>

          {/* Info note */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-center leading-relaxed px-2"
            style={{ color: "rgba(26,26,26,0.45)" }}>
            {isSummerCamp 
              ? "You will receive updates on the WhatsApp group. Keep this confirmation for reference."
              : "A confirmation email has been sent to your registered email address. Please carry your Registration ID to the workshop for check-in."}
          </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
}