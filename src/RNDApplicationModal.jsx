import { useState } from "react";
import { X } from "lucide-react";
import Toast from "./Toast";

function RNDApplicationModal({ isOpen, onClose, projectId = null, projectTitle = "General Application" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    institution: "",
    cgpa: "",
    experience: "",
    researchInterests: "",
    whyJoin: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/rnd-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectId,
          projectTitle
        })
      });

      const data = await response.json();

      if (data.success) {
        setToast({ show: true, message: "Application submitted successfully! We'll contact you soon.", type: "success" });
        setTimeout(() => {
          onClose();
          setFormData({
            name: "",
            email: "",
            phone: "",
            qualification: "",
            institution: "",
            cgpa: "",
            experience: "",
            researchInterests: "",
            whyJoin: ""
          });
        }, 2000);
      } else {
        setToast({ show: true, message: data.message || "Failed to submit application", type: "error" });
      }
    } catch (error) {
      setToast({ show: true, message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700">
          <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 sm:p-6 flex justify-between items-center z-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-olive green-400">Apply for R&D Program</h2>
              <p className="text-sm text-gray-400 mt-1">{projectTitle}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Qualification *</label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
                >
                  <option value="">Select Qualification</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="PhD">PhD</option>
                  <option value="MCA">MCA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Institution/University *</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CGPA/Percentage</label>
                <input
                  type="text"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g., 8.5 or 85%"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prior Experience (if any)</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="3"
                placeholder="Mention any relevant projects, internships, or research experience"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Research Interests *</label>
              <textarea
                name="researchInterests"
                value={formData.researchInterests}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe your research interests and areas of expertise"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join this R&D program? *</label>
              <textarea
                name="whyJoin"
                value={formData.whyJoin}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Explain your motivation and what you hope to achieve"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-olive green-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-olive green-400 text-black rounded-full font-semibold hover:bg-olive green-300 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-full font-semibold hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RNDApplicationModal;
