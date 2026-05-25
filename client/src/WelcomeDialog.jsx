// // src/components/WelcomeDialog.jsx
// import { motion } from "framer-motion";
// import { X } from "lucide-react";
// import { useEffect } from "react";
// import posterImage from "./assets/poster.jpeg";

// const WelcomeDialog = ({ onClose }) => {
//   // Prevent body scroll when dialog is open
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, []);

//   // Google Form Link
//   const formLink = "https://forms.gle/Cj5sdg2KxbHyqudj6";

//   // Poster Image Link
//   // Replace this with your direct image URL if needed
// //  <img
// //   src={posterImage}
// //   alt="Stackenzo Poster"
// //   className="w-full h-[480px] md:h-[540px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
// // />
// //   const posterImage =
// //   "https://lh3.googleusercontent.com/d/1wsTBMSD8Q60ywTK3SvjhmI29v8eEwywU=w2000?authuser=0";

//   const handlePosterClick = () => {
//     window.open(formLink, "_blank");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0, y: 20 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.9, opacity: 0, y: 20 }}
//         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//       className="relative w-full max-w-[360px] md:max-w-[420px] bg-white rounded-2xl overflow-hidden shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
//         >
//           <X className="w-5 h-5 text-white" />
//         </button>

//         {/* Clickable Poster */}
//         <div
//           onClick={handlePosterClick}
//           className="cursor-pointer group relative"
//         >
//           <img
//             src={posterImage}
//             alt="Stackenzo Poster"
//             className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
//           />

//           {/* Overlay */}
//           <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center">
//             <div className="mb-6 px-5 py-3 bg-[#F04A06] text-white rounded-full font-semibold shadow-lg group-hover:scale-105 transition-transform duration-300">
//               Click Here to Register
//             </div>
//           </div>
//         </div>

//         {/* Bottom Gradient Bar */}
//         <div className="h-1 bg-gradient-to-r from-[#F04A06] to-[#D4AF37]" />
//       </motion.div>
//     </motion.div>
//   );
// };

// export default WelcomeDialog;