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

  // About dropdown items
  const aboutItems = [
    { name: "About Us", path: "/About" },
    { name: "Partners", path: "/Partners" }
  ];

  // Programs dropdown items with nested children
  const programItems = [
    { name: "All Programs", path: "/StackenzoPrograms" },
    { name: "Events", path: "/Programs" },
    { name: "College Programs", path: "#" ,
      children: [{ name: "Workshops", path: "/WorkShops" },{ name: "Internships", path: "/internships" }]
    },
    {
      name: "School Programs",
      path: "/Robotics",
      children: [
        { name: "Bootcamp", path: "/StackenzoBootcamp" },
        { name: "LabSetup", path: "/roboticlab"}
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
      id: "about",
      label: "About",
      items: aboutItems,
    },
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
          
          {/* Inline Submenu with bullet points */}
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
    
    // Regular menu item (no children) - WITH SELECTION STYLING
    return (
      <Link
        key={item.name}
        to={item.path}
        className={`group/item flex items-center ${
          isMobile ? 'py-2.5 px-4' : 'px-4 py-2.5'
        } text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition-all duration-200 rounded ${
          isMobile ? 'border-l-2 border-transparent' : ''
        } ${isActivePage(item.path) ? 'bg-[#F04A06] text-white font-medium shadow-sm' : ''}`}
        onClick={closeAll}
        onMouseEnter={!isMobile ? () => setActiveSubmenu(null) : undefined}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
          isActivePage(item.path) ? 'bg-white' : 'bg-[#F04A06]/30 group-hover/item:bg-white'
        }`} />
        {item.name}
      </Link>
    );
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 w-full flex justify-between items-center 
      px-4 sm:px-6 md:px-10 py-3 sm:py-4 
      bg-[#FFF4ED] border-b border-gray-200 z-50">
      
      {/* Logo */}
     <Link to="/" onClick={handleLogoClick} className="flex-shrink-0">
        <img 
          src="/images/final-logo.png" 
          alt="Stackenzo" 
          className="logo-image"
          style={{ 
            height: '57px', 
            width: '200px',
            maxWidth: '2000px'
          }}
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-2">
        {/* Home Link */}
        <Link
          to="/"
          onClick={closeAll}
          className={`group flex items-center px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
            isActivePage('/') ? 'bg-[#F04A06] text-white shadow-sm' : ''
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
            isActivePage('/') ? 'bg-white' : 'bg-[#F04A06]/30 group-hover:bg-white'
          }`} />
          Home
        </Link>

        {/* About Dropdown - Placed after Home */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('about')}
          onMouseLeave={() => handleMouseLeave('dropdown')}
        >
          <button
            className={`flex items-center space-x-1 px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
              activeDropdown === 'about' ? 'text-white bg-[#F04A06]' : ''
            } ${
              isActiveDropdown(aboutItems) ? 'bg-[#F04A06] text-white shadow-sm' : ''
            }`}
          >
            <span>About</span>
            {activeDropdown === 'about' ? 
              <ChevronUp className="w-4 h-4 ml-1" /> : 
              <ChevronDown className="w-4 h-4 ml-1" />
            }
          </button>
          
          {activeDropdown === 'about' && (
            <div 
              className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-[60]
                animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F04A06] to-[#2E7D32]" />
              
              {aboutItems.map((item) => renderMenuItem(item, false, 'about'))}
            </div>
          )}
        </div>

        {/* Careers Link */}
        <Link
          to="/Career"
          onClick={closeAll}
          className={`group flex items-center px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
            isActivePage('/Career') ? 'bg-[#F04A06] text-white shadow-sm' : ''
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
            isActivePage('/Career') ? 'bg-white' : 'bg-[#F04A06]/30 group-hover:bg-white'
          }`} />
          Careers
        </Link>

        {/* Gallery Link */}
        <Link
          to="/Gallerypage"
          onClick={closeAll}
          className={`group flex items-center px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
            isActivePage('/Gallerypage') ? 'bg-[#F04A06] text-white shadow-sm' : ''
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
            isActivePage('/Gallerypage') ? 'bg-white' : 'bg-[#F04A06]/30 group-hover:bg-white'
          }`} />
          Gallery
        </Link>

        {/* Programs Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('programs')}
          onMouseLeave={() => handleMouseLeave('dropdown')}
        >
          <button
            className={`flex items-center space-x-1 px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
              activeDropdown === 'programs' ? 'text-white bg-[#F04A06]' : ''
            } ${
              isActiveDropdown(programItems) ? 'bg-[#F04A06] text-white shadow-sm' : ''
            }`}
          >
            <span>Programs</span>
            {activeDropdown === 'programs' ? 
              <ChevronUp className="w-4 h-4 ml-1" /> : 
              <ChevronDown className="w-4 h-4 ml-1" />
            }
          </button>
          
          {activeDropdown === 'programs' && (
            <div 
              className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-[60]
                animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F04A06] to-[#2E7D32]" />
              
              {programItems.map((item) => renderMenuItem(item, false, 'programs'))}
            </div>
          )}
        </div>

        {/* Services Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('services')}
          onMouseLeave={() => handleMouseLeave('dropdown')}
        >
          <button
            className={`flex items-center space-x-1 px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
              activeDropdown === 'services' ? 'text-white bg-[#F04A06]' : ''
            } ${
              isActiveDropdown(serviceItems) ? 'bg-[#F04A06] text-white shadow-sm' : ''
            }`}
          >
            <span>Services</span>
            {activeDropdown === 'services' ? 
              <ChevronUp className="w-4 h-4 ml-1" /> : 
              <ChevronDown className="w-4 h-4 ml-1" />
            }
          </button>
          
          {activeDropdown === 'services' && (
            <div 
              className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-[60]
                animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F04A06] to-[#2E7D32]" />
              
              {serviceItems.map((item) => renderMenuItem(item, false, 'services'))}
            </div>
          )}
        </div>

        {/* Contact Link */}
        <Link
          to="/Contact"
          onClick={closeAll}
          className={`group flex items-center px-3 py-2 text-[#F04A06] hover:text-white transition font-medium rounded-lg hover:bg-[#F04A06] ${
            isActivePage('/Contact') ? 'bg-[#F04A06] text-white shadow-sm' : ''
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
            isActivePage('/Contact') ? 'bg-white' : 'bg-[#F04A06]/30 group-hover:bg-white'
          }`} />
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
                isActivePage('/') ? 'bg-[#F04A06] text-white shadow-sm' : ''
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
                isActivePage('/') ? 'bg-white' : 'bg-[#F04A06]/30'
              }`} />
              Home
            </Link>

            {/* About Dropdown for Mobile */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleDropdown('about')}
                className={`flex justify-between items-center w-full py-3 px-4 
                  text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium text-base ${
                  activeDropdown === 'about' ? 'text-white bg-[#F04A06]' : ''
                } ${
                  isActiveDropdown(aboutItems) ? 'bg-[#F04A06] text-white shadow-sm' : ''
                }`}
              >
                <span className="flex items-center">
                  About
                </span>
                {activeDropdown === 'about' ? 
                  <ChevronUp className="w-5 h-5" /> : 
                  <ChevronDown className="w-5 h-5" />
                }
              </button>
              
              {activeDropdown === 'about' && (
                <div className="pl-4 pb-2 space-y-1 animate-in slide-in-from-top-1 duration-200">
                  {aboutItems.map((item) => renderMenuItem(item, true, 'about'))}
                </div>
              )}
            </div>

            {/* Careers Link */}
            <Link
              to="/Career"
              onClick={closeAll}
              className={`py-3 px-4 text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium
                border-b border-gray-100 text-base flex items-center ${
                isActivePage('/Career') ? 'bg-[#F04A06] text-white shadow-sm' : ''
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
                isActivePage('/Career') ? 'bg-white' : 'bg-[#F04A06]/30'
              }`} />
              Careers
            </Link>

            {/* Gallery Link */}
            <Link
              to="/Gallerypage"
              onClick={closeAll}
              className={`py-3 px-4 text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium
                border-b border-gray-100 text-base flex items-center ${
                isActivePage('/Gallerypage') ? 'bg-[#F04A06] text-white shadow-sm' : ''
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
                isActivePage('/Gallerypage') ? 'bg-white' : 'bg-[#F04A06]/30'
              }`} />
              Gallery
            </Link>

            {/* Programs Dropdown for Mobile */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleDropdown('programs')}
                className={`flex justify-between items-center w-full py-3 px-4 
                  text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium text-base ${
                  activeDropdown === 'programs' ? 'text-white bg-[#F04A06]' : ''
                } ${
                  isActiveDropdown(programItems) ? 'bg-[#F04A06] text-white shadow-sm' : ''
                }`}
              >
                <span className="flex items-center">
                  Programs
                </span>
                {activeDropdown === 'programs' ? 
                  <ChevronUp className="w-5 h-5" /> : 
                  <ChevronDown className="w-5 h-5" />
                }
              </button>
              
              {activeDropdown === 'programs' && (
                <div className="pl-4 pb-2 space-y-1 animate-in slide-in-from-top-1 duration-200">
                  {programItems.map((item) => renderMenuItem(item, true, 'programs'))}
                </div>
              )}
            </div>

            {/* Services Dropdown for Mobile */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleDropdown('services')}
                className={`flex justify-between items-center w-full py-3 px-4 
                  text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium text-base ${
                  activeDropdown === 'services' ? 'text-white bg-[#F04A06]' : ''
                } ${
                  isActiveDropdown(serviceItems) ? 'bg-[#F04A06] text-white shadow-sm' : ''
                }`}
              >
                <span className="flex items-center">
                  Services
                </span>
                {activeDropdown === 'services' ? 
                  <ChevronUp className="w-5 h-5" /> : 
                  <ChevronDown className="w-5 h-5" />
                }
              </button>
              
              {activeDropdown === 'services' && (
                <div className="pl-4 pb-2 space-y-1 animate-in slide-in-from-top-1 duration-200">
                  {serviceItems.map((item) => renderMenuItem(item, true, 'services'))}
                </div>
              )}
            </div>

            {/* Contact Link */}
            <Link
              to="/Contact"
              onClick={closeAll}
              className={`py-3 px-4 text-[#F04A06] hover:text-white hover:bg-[#F04A06] transition font-medium
                border-b border-gray-100 text-base flex items-center ${
                isActivePage('/Contact') ? 'bg-[#F04A06] text-white shadow-sm' : ''
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-colors ${
                isActivePage('/Contact') ? 'bg-white' : 'bg-[#F04A06]/30'
              }`} />
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