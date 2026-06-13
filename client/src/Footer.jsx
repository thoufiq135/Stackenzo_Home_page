import { Link, useLocation } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const services = [
    { name: "R&D", path: "/R_AND_D" },
    { name: "IT Services", path: "/WebServices" },
    { name: "Marketing", path: "/DigitalMarketing" },
    { name: "GSIN", path: "/Community" },
  ];

  const programs = [
    { name: "All Programs", path: "/Programs" },
    { name: "School Programs", path: "/Robotics" },
    { name: "College Programs", path: "/WorkShops" },
  ];

  const company = [
    { name: "About Us", path: "/About" },
    { name: "Career", path: "/Career" },
    { name: "Contact", path: "/Contact" },
  ];

  const legal = [
    { name: "Terms & Conditions", path: "/Terms" },
    { name: "Privacy Policy", path: "/Privacy" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/stackenzo" },
    { icon: Twitter, href: "https://twitter.com/stackenzo" },
    { icon: Linkedin, href: "https://linkedin.com/company/stackenzo" },
    { icon: Instagram, href: "https://instagram.com/stackenzo" },
  ];

  return (
    <footer className="bg-[#FFF4ED] border-t border-gray-200">

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* ================= MOBILE ================= */}
        <div className="md:hidden">

          {/* Logo + Contact */}
          <div className="text-center mb-10">
            <img src="/images/final-logo.png" className="h-10 mx-auto mb-2" />
            <p className="font-semibold mb-4">Learn Build Inspire</p>

            <div className="flex flex-col gap-2 text-sm items-center mb-4">
              <a href="mailto:hello@stackenzo.com" className="flex gap-2 items-center">
                <Mail size={16}/> hello@stackenzo.com
              </a>
              <a href="tel:+919247577907" className="flex gap-2 items-center">
                <Phone size={16}/> +91 9247577907
              </a>
              <div className="flex gap-2 items-center">
                <MapPin size={16}/> Nellore, Andhra Pradesh
              </div>
            </div>

            {/* Follow */}
            <div className="mb-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">
                Follow Us
              </h3>

              <div className="flex justify-center gap-4">
                {socialLinks.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer">
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div> {/* ✅ FIX: CLOSED HERE */}

          {/* 2 Column Grid */}
          <div className="grid grid-cols-2 gap-8 text-left">

            <div>
              <h3 className="font-semibold mb-3">Services</h3>
              {services.map(i => (
                <Link key={i.path} to={i.path} className="block text-sm mb-1">{i.name}</Link>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Programs</h3>
              {programs.map(i => (
                <Link key={i.path} to={i.path} className="block text-sm mb-1">{i.name}</Link>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              {company.map(i => (
                <Link key={i.path} to={i.path} className="block text-sm mb-1">{i.name}</Link>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              {legal.map(i => (
                <Link key={i.path} to={i.path} className="block text-sm mb-1">{i.name}</Link>
              ))}
            </div>

          </div>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:grid md:grid-cols-5 gap-10 mb-12">

          <div>
            <img src="/images/final-logo.png" className="h-10 mb-3" />
            {/* <p className="font-semibold mb-4">Learn Build Inspire</p> */}

            <div className="space-y-3 text-sm">
              <div className="flex gap-2"><Mail size={16}/> hello@stackenzo.com</div>
              <div className="flex gap-2"><Phone size={16}/> +91 9247577907</div>
              <div className="flex gap-2"><MapPin size={16}/> Nellore, AP</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            {services.map(i => <Link key={i.path} to={i.path} className="block text-sm mb-2">{i.name}</Link>)}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Programs</h3>
            {programs.map(i => <Link key={i.path} to={i.path} className="block text-sm mb-2">{i.name}</Link>)}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            {company.map(i => <Link key={i.path} to={i.path} className="block text-sm mb-2">{i.name}</Link>)}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            {legal.map(i => <Link key={i.path} to={i.path} className="block text-sm mb-2">{i.name}</Link>)}

            <h3 className="font-semibold mt-6 mb-3">Follow Us</h3>

            <div className="flex gap-3">
              {socialLinks.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer">
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* MAP */}
        {isHomePage && (
          <div className="mb-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d509.89248860616243!2d79.94935334632429!3d14.407470899203648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1776082020199!5m2!1sen!2sin"
              className="w-full h-[300px] rounded-xl border"
              loading="lazy"
            />
          </div>
        )}

        {/* Bottom */}
        <div className="border-t pt-6 flex justify-between text-sm">
          <p>© {new Date().getFullYear()} Stackenzo</p>
          <div className="flex gap-4">
            <Link to="/Terms">Terms</Link>
            <Link to="/Privacy">Privacy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;