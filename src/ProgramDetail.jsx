import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { 
  Calendar, MapPin, Clock, Tag, ArrowLeft, Users, 
  CheckCircle, ExternalLink, Share2, Bookmark
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProgramRegistrationModal from "./ProgramRegistrationModal";

function ProgramDetail() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/programs/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProgram(data.program);
      }
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white text-[#1A1A1A] min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#1A1A1A]">Loading program details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="bg-white text-[#1A1A1A] min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Program Not Found</h2>
            <Link to="/Programs" className="text-[#1E301E] hover:text-[#2E7D32]">
              ← Back to Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "upcoming": return "bg-blue-500";
      case "ongoing": return "bg-[#1E301E]";
      case "registration-open": return "bg-[#2E7D32]";
      default: return "bg-gray-500";
    }
  };

  const getStatusTextColor = (status) => {
    switch(status) {
      case "upcoming": return "text-white";
      case "ongoing": return "text-white";
      case "registration-open": return "text-white";
      default: return "text-white";
    }
  };

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen">
      <Toaster position="top-right" />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 bg-gradient-to-br from-[#1E301E] via-[#2E7D32] to-[#D4AF37]">
        <div className="max-w-6xl mx-auto">
          <Link to="/Programs" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Programs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-2 ${getStatusColor(program.status)} ${getStatusTextColor(program.status)} rounded-full text-sm font-semibold`}>
                {program.status.replace("-", " ").toUpperCase()}
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30">
                {program.type.replace("-", " ").toUpperCase()}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {program.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <span>{new Date(program.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <span>{program.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span>{program.duration}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">About This Program</h2>
                <p className="text-[#1A1A1A] leading-relaxed text-lg">
                  {program.description}
                </p>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Topics Covered</h2>
                <div className="flex flex-wrap gap-3">
                  {program.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 bg-[#E8F5E9] text-[#1E301E] rounded-lg border border-[#D4AF37]/30 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">What You'll Get</h2>
                <div className="space-y-4">
                  {[
                    "Hands-on practical experience",
                    "Industry expert mentorship",
                    "Certificate of completion",
                    "Networking opportunities",
                    "Learning resources and materials"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span className="text-[#1A1A1A]">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-[#1E301E] to-[#2E7D32] rounded-2xl p-8 sticky top-24 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Ready to Join?</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-white/90">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    <span>Limited seats available</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    <span>Registration closing soon</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="w-full px-6 py-4 bg-[#D4AF37] text-[#1E301E] rounded-xl font-bold hover:bg-[#D4AF37]/90 transition-all mb-4 shadow-md"
                >
                  Register Now
                </button>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20">
                    <Share2 className="w-4 h-4 text-[#D4AF37]" />
                    Share
                  </button>
                  <button className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20">
                    <Bookmark className="w-4 h-4 text-[#D4AF37]" />
                    Save
                  </button>
                </div>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[#1A1A1A]">Program Type</span>
                    <span className="text-[#1E301E] font-medium">{program.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[#1A1A1A]">Duration</span>
                    <span className="text-[#1E301E] font-medium">{program.duration}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[#1A1A1A]">Location</span>
                    <span className="text-[#1E301E] font-medium">{program.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]">Status</span>
                    <span className="text-[#1E301E] font-medium">{program.status}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Registration Modal */}
      <ProgramRegistrationModal 
        program={program}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default ProgramDetail;