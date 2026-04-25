// JoinCommunity.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, Linkedin, Instagram, ArrowRight, Sparkles, Users, Globe, Zap } from "lucide-react";

const JoinCommunity = () => {
    const socialLinks = [
        {
            name: "WhatsApp",
            icon: MessageCircle,
            url: "https://chat.whatsapp.com/CacZ54wJ4ZY5tVXkjPCGY9", // Replace with your actual WhatsApp invite link
            color: "#25D366",
            bgHover: "#1DAE5A",
            description: "Join our WhatsApp group for real-time discussions, updates, and networking with fellow developers.",
            members: "1.2k+ members"
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: "https://www.linkedin.com/company/stackenzo/posts/?feedView=all", // Replace with your actual LinkedIn URL
            color: "#0A66C2",
            bgHover: "#004182",
            description: "Connect with professionals, share insights, and grow your career network.",
            members: "3.5k+ followers"
        },
        {
            name: "Instagram",
            icon: Instagram,
            url: "https://www.instagram.com/stackenzo/?hl=en", // Replace with your actual Instagram URL
            color: "#E4405F",
            bgHover: "#C1354A",
            description: "Follow us for daily inspiration, behind-the-scenes, and community highlights.",
            members: "2.8k+ followers"
        }
    ];

    const handleJoin = (url, name) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFF4ED] via-white to-[#FFF4ED]">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-32 pb-20 px-4">
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "radial-gradient(circle, #F04A06 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-[#F04A06]/10 border border-[#F04A06]/20 rounded-full px-5 py-2 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-sm text-[#F04A06] font-bold">Join Our Thriving Community</span>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-[#1A1A1A] mb-6"
                    >
                        Join{" "}
                        <span className="bg-gradient-to-r from-[#F04A06] to-[#D4AF37] bg-clip-text text-transparent">
                            Robotics Revolution
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
                    >
                        Join our robotics community to stay updated with the latest innovations,
                        hands-on projects, and expert insights. Follow us on social media for
                        exclusive robotics content, workshop announcements, and tech tutorials.
                    </motion.p>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <button
                            onClick={() => document.getElementById("social-cards")?.scrollIntoView({ behavior: "smooth" })}
                            className="px-8 py-3 bg-[#F04A06] text-white rounded-full font-bold hover:bg-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Join Now
                        </button>
                        <Link to="/">
                            <button className="px-8 py-3 border-2 border-[#F04A06] text-[#F04A06] rounded-full font-bold hover:bg-[#F04A06]/10 transition-all duration-300">
                                Learn More
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="border-y border-gray-100 bg-white/50 backdrop-blur-sm py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-around flex-wrap gap-6">
                        {[
                            { icon: Users, value: "3,000+", label: "Community Members" },
                            { icon: Globe, value: "25+", label: "Cities" },
                            { icon: Zap, value: "50+", label: "Events Hosted" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <stat.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                                <div className="text-2xl font-black text-[#1A1A1A]">{stat.value}</div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Social Cards Grid */}
            <div id="social-cards" className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">
                        Choose Your Platform
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join us on your favorite social platform and become part of our growing community
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {socialLinks.map((social, index) => {
                        const Icon = social.icon;
                        return (
                            <motion.div
                                key={social.name}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="p-8 text-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${social.color}15` }}
                                    >
                                        <Icon className="w-10 h-10" style={{ color: social.color }} />
                                    </motion.div>

                                    <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">{social.name}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{social.members}</p>
                                    <p className="text-gray-600 text-sm mb-6">{social.description}</p>

                                    <button
                                        onClick={() => handleJoin(social.url, social.name)}
                                        className="w-full py-3 rounded-full font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 group"
                                        style={{ backgroundColor: social.color }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = social.bgHover}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = social.color}
                                    >
                                        <span>Join {social.name} Community</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-[#1A1A1A] text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-3xl font-bold mb-4"
                    >
                        Ready to be part of something amazing?
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 mb-8"
                    >
                        Join thousands of innovators who are already part of the Stackenzo community
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => window.open("https://chat.whatsapp.com/CacZ54wJ4ZY5tVXkjPCGY9", "_blank")}
                        className="px-8 py-3 bg-[#D4AF37] text-[#1A1A1A] rounded-full font-bold hover:bg-[#F04A06] hover:text-white transition-all duration-300"
                    >
                        Join Community Now
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default JoinCommunity;