import { useState, useRef, useEffect } from "react";
import { Phone, MessageCircle, X } from "lucide-react";

function ContactPhone({ phoneNumber = "+919876543210" }) {
  const [showOptions, setShowOptions] = useState(false);
  const modalRef = useRef();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Phone Icon Button */}
      <button
        onClick={() => setShowOptions(true)}
        className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-olive green-500 to-olive green-600 text-white rounded-full shadow-lg hover:scale-105 transition"
      >
        <Phone className="w-6 h-6" />
      </button>

      {/* Modal */}
      {showOptions && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowOptions(false)}
        >
          <div
            ref={modalRef}
            className="bg-gray-900 text-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Contact Options
              </h2>
              <button
                onClick={() => setShowOptions(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Call Button */}
            <a
              href={`tel:${phoneNumber}`}
              onClick={() => setShowOptions(false)}
              className="flex items-center justify-center gap-2 w-full py-3 mb-3 bg-olive green-500 hover:bg-olive green-600 rounded-lg font-semibold transition"
            >
              <Phone className="w-5 h-5" />
              Call
            </a>

            {/* Message Button */}
            <button
              onClick={() => {
                setShowOptions(false);
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
            >
              <MessageCircle className="w-5 h-5" />
              Message
            </button>

            {/* Cancel */}
            <button
              onClick={() => setShowOptions(false)}
              className="w-full mt-4 text-sm text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ContactPhone;