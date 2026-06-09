import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const submenuTimeoutRef = useRef(null);

  const isActivePage = (path) => location.pathname === path;
  const isActiveDropdown = (items) => items.some(item => {
    if (item.children && item.children.length > 0) {
      return item.children.some(child => location.pathname === child.path);
    }
    return location.pathname === item.path;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setActiveSubmenu(null);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (dropdown, submenuId = null) => {
    if (window.innerWidth >= 1024) {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
      setActiveDropdown(dropdown);
      if (submenuId !== null) {
        setActiveSubmenu(submenuId);
      }
    }
  };

  const handleMouseLeave = (dropdownType = 'dropdown') => {
    if (window.innerWidth >= 1024) {
      const timeout = setTimeout(() => {
        if (dropdownType === 'submenu') {
          setActiveSubmenu(null);
        } else {
          setActiveDropdown(null);
          setActiveSubmenu(null);
        }
      }, 200);
      
      if (dropdownType === 'submenu') {
        submenuTimeoutRef.current = timeout;
      } else {
        dropdownTimeoutRef.current = timeout;
      }
    }
  };

  const toggleDropdown = (dropdown) => {
    if (window.innerWidth < 1024) {
      setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
      setActiveSubmenu(null);
    }
  };

  const toggleSubmenu = (submenuId, e) => {
    e.stopPropagation();
    setActiveSubmenu(activeSubmenu === submenuId ? null : submenuId);
  };

  const closeAll = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    setActiveSubmenu(null);
  };

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
    closeAll();
  };

  // Programs dropdown items with nested children
  const programItems = [
    { name: "All Programs", path: "/StackenzoPrograms" },
    { name: "Events", path: "/Programs" },
    { name: "College Programs", path: "/WorkShops" },
    {
      name: "School Programs",
      path: "/Robotics",
      children: [
        // { name: "Robotics Program", path: "/Robotics" },
        // { name: "AI & Coding Program", path: "/AICoding" },
        // { name: "STEM Innovation Program", path: "/StemProgram" },
        { name: "Bootcamp", path: "/StackenzoBootcamp" }
      ]
    }
  ];

  // Services dropdown items
  const serviceItems = [
    { name: "All Services", path: "/Services" },
    { name: "IT Services", path: "/WebServices" },
    { name: "Digital Marketing", path: "/DigitalMarketing" },
    { name: "R&D Projects", path: "/R_AND_D" },
    { name: "GSIN", path: "/Community" }
  ];

  const dropdowns = [
    {
      id: "programs",
      label: "Programs",
      items: programItems,
    },
    {
      id: "services",
      label: "Services",
      items: serviceItems,
    }
  ];

  // Helper function to render menu items with optional submenu
  const renderMenuItem = (item, isMobile = false, parentId = null) => {
    const hasChildren = item.children && item.children.length > 0;
    const itemId = `${parentId}-${item.name.replace(/\s+/g, '-')}`;
    
    if (hasChildren) {
      return (
        <div key={item.name} className="relative">
          <div
            className={`flex items-center justify-between w-full ${
              isMobile ? 'py-2.5 px-4' : 'px-4 py-2.5'
            } text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition-all duration-200 rounded cursor-pointer ${
              activeSubmenu === itemId ? 'bg-[#FFF4ED]' : ''
            }`}
            onMouseEnter={!isMobile ? () => setActiveSubmenu(itemId) : undefined}
            onClick={(e) => {
              e.stopPropagation();
              setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
            }}
          >
            <span>{item.name}</span>
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${
              activeSubmenu === itemId ? 'rotate-180' : ''
            }`} />
          </div>
          
          {/* Inline Submenu */}
          {activeSubmenu === itemId && (
            <div className={`${isMobile ? 'pl-6' : 'pl-4'} mt-1 mb-2 space-y-1 ml-4 border-l-2 border-[#F04A06]/20 animate-in slide-in-from-top-1 duration-200`}>
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  to={child.path}
                  className={`flex items-center py-2 px-3 text-[#F04A06] hover:text-white 
                    hover:bg-[#F04A06] transition-all duration-200 rounded text-sm group/child ${
                    isActivePage(child.path) ? 'bg-[#F04A06] text-white font-medium shadow-sm' : ''
                  }`}
                  onClick={closeAll}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
                    isActivePage(child.path) ? 'bg-white' : 'bg-[#F04A06]/30 group-hover/child:bg-white'
                  }`} />
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Regular menu item (no children)
    return (
      <Link
        key={item.name}
        to={item.path}
        className={`block ${
          isMobile ? 'py-2.5 px-4' : 'px-4 py-2.5'
        } text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition-all duration-200 rounded ${
          isMobile ? 'border-l-2 border-transparent' : ''
        } ${isActivePage(item.path) ? 'bg-[#F04A06] text-white' : ''}`}
        onClick={closeAll}
        onMouseEnter={!isMobile ? () => setActiveSubmenu(null) : undefined}
      >
        {item.name}
      </Link>
    );
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 w-full flex justify-between items-center 
      px-4 sm:px-6 md:px-10 py-3 sm:py-4 
      bg-[#FFF4ED] border-b border-gray-200 z-50">
      
      {/* Logo */}
      <Link to="/" onClick={handleLogoClick}>
        <img 
          src="/images/logo for footer.png" 
          alt="Stackenzo" 
          className="h-8 sm:h-10 md:h-12 w-auto hover:opacity-100 transition-opacity"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-2">
        {/* Home Link */}
        <Link
          to="/"
          onClick={closeAll}
          className={`px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
            isActivePage('/') ? 'bg-[#F04A06] text-white' : ''
          }`}
        >
          Home
        </Link>

        {/* About Link */}
        <Link
          to="/About"
          onClick={closeAll}
          className={`px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
            isActivePage('/About') ? 'bg-[#F04A06] text-white' : ''
          }`}
        >
          About
        </Link>

        {/* Careers Link */}
        <Link
          to="/Career"
          onClick={closeAll}
          className={`px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
            isActivePage('/Career') ? 'bg-[#F04A06] text-white' : ''
          }`}
        >
          Careers
        </Link>

        {/* Gallery Link */}
        <Link
          to="/Gallerypage"
          onClick={closeAll}
          className={`px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
            isActivePage('/Gallerypage') ? 'bg-[#F04A06] text-white' : ''
          }`}
        >
          Gallery
        </Link>

        {/* Dynamic Dropdowns - Hover based for desktop */}
        {dropdowns.map((dropdown) => (
          <div 
            key={dropdown.id} 
            className="relative"
            onMouseEnter={() => handleMouseEnter(dropdown.id)}
            onMouseLeave={() => handleMouseLeave('dropdown')}
          >
            <button
              className={`flex items-center space-x-1 px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
                activeDropdown === dropdown.id ? 'text-white bg-[#F04A06]' : ''
              } ${
                isActiveDropdown(dropdown.items) ? 'bg-[#F04A06] text-white' : ''
              }`}
            >
              <span>{dropdown.label}</span>
              {activeDropdown === dropdown.id ? 
                <ChevronUp className="w-4 h-4 ml-1" /> : 
                <ChevronDown className="w-4 h-4 ml-1" />
              }
            </button>
            
            {activeDropdown === dropdown.id && (
              <div 
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-[60]
                  animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F04A06] to-[#2E7D32]" />
                
                {dropdown.items.map((item) => renderMenuItem(item, false, dropdown.id))}
              </div>
            )}
          </div>
        ))}

        {/* Contact Link */}
        <Link
          to="/Contact"
          onClick={closeAll}
          className={`px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
            isActivePage('/Contact') ? 'bg-[#F04A06] text-white' : ''
          }`}
        >
          Contact
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-[#F04A06] hover:text-white transition p-2 rounded-md hover:bg-[#F04A06] z-50 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {isOpen ? 
          <X className="w-6 h-6" strokeWidth={2.5} /> : 
          <Menu className="w-6 h-6" strokeWidth={2.5} />
        }
      </button>

      {/* Mobile Navigation - Click based for mobile */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white 
          backdrop-blur-xl border-b border-gray-200 lg:hidden shadow-2xl max-h-[80vh] overflow-y-auto z-[55]">
          <div className="flex flex-col space-y-0 px-4 py-3">
            {/* Home Link */}
            <Link
              to="/"
              onClick={closeAll}
              className={`py-3 px-4 text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium
                border-b border-gray-100 text-base flex items-center ${
                isActivePage('/') ? 'bg-[#F04A06] text-white' : ''
              }`}
            >
              Home
            </Link>

            {/* About Link */}
            <Link
              to="/About"
              onClick={closeAll}
              className={`py-3 px-4 text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium
                border-b border-gray-100 text-base flex items-center ${
                isActivePage('/About') ? 'bg-[#F04A06] text-white' : ''
              }`}
            >
              About
            </Link>

            {/* Careers Link */}
            <Link
              to="/Career"
              onClick={closeAll}
              className={`py-3 px-4 text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium
                border-b border-gray-100 text-base flex items-center ${
                isActivePage('/Career') ? 'bg-[#F04A06] text-white' : ''
              }`}
            >
              Careers
            </Link>

            {/* Gallery Link */}
            <Link
              to="/Gallerypage"
              onClick={closeAll}
              className={`py-3 px-4 text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium
                border-b border-gray-100 text-base flex items-center ${
                isActivePage('/Gallerypage') ? 'bg-[#F04A06] text-white' : ''
              }`}
            >
              Gallery
            </Link>

            {/* Mobile Dropdowns - Click based for mobile */}
            {dropdowns.map((dropdown) => (
              <div key={dropdown.id} className="border-b border-gray-100">
                <button
                  onClick={() => toggleDropdown(dropdown.id)}
                  className={`flex justify-between items-center w-full py-3 px-4 
                    text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium text-base ${
                    activeDropdown === dropdown.id ? 'text-white bg-[#F04A06]' : ''
                  } ${
                    isActiveDropdown(dropdown.items) ? 'bg-[#F04A06] text-white' : ''
                  }`}
                >
                  <span className="flex items-center">
                    {dropdown.label}
                  </span>
                  {activeDropdown === dropdown.id ? 
                    <ChevronUp className="w-5 h-5" /> : 
                    <ChevronDown className="w-5 h-5" />
                  }
                </button>
                
                {activeDropdown === dropdown.id && (
                  <div className="pl-4 pb-2 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {dropdown.items.map((item) => renderMenuItem(item, true, dropdown.id))}
                  </div>
                )}
              </div>
            ))}

            {/* Contact Link */}
            <Link
              to="/Contact"
              onClick={closeAll}
              className={`py-3 px-4 text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium
                border-b border-gray-100 text-base flex items-center ${
                isActivePage('/Contact') ? 'bg-[#F04A06] text-white' : ''
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: forwards;
          animation-timing-function: ease-out;
        }
        
        .fade-in {
          animation-name: fadeIn;
        }
        
        .slide-in-from-top-2 {
          animation-name: slideInFromTop;
        }
        
        .slide-in-from-left-2 {
          animation-name: slideInFromLeft;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;