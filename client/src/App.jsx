import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Home from "./Home";
import RND from "./RND";
import RNDProjectDetail from "./RNDProjectDetail";
import ResearchProjects from "./ResearchProjects";
import WebServices from "./webservices";
import Workshops from "./workshops";
import Robotics from "./robotics";
import DigitalMarketing from "./DigitalMarketing";
import Community from "./community";
import NewCommunity from "./NewCommunity";
import Contact from "./Contact";
import About from "./About";
import Terms from "./Terms";
import Privacy from "./Privacy";
import Career from "./Career";
import ResumeAdmin from "./ResumeAdmin";
import Programs from "./Programs";
import ProgramDetail from "./ProgramDetail";
import Services from "./Services";
import StackenzoPrograms from "./StackenzoPrograms";
import Portfolio from "./Portfolio";
import GalleryPage from "./GalleryPage";
import ScrollToTop from "./ScrollToTop";
import WorkshopRegister from "./WorkshopRegister";
import WorkshopSuccess from "./WorkshopSuccess";
import WorkshopAlreadyRegistered from "./WorkshopAlreadyRegistered";
import IntermediateResults from "./IntermediateResults";
import JoinCommunity from "./Joincommunity";
import SummerCampGallery from "./SummerCampGallery";
import WelcomeDialog from "./WelcomeDialog";

function App() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has seen the welcome dialog
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    const hasSeenWelcomeSession = sessionStorage.getItem('hasSeenWelcomeSession');
    
    // Show welcome dialog only once per session or after 30 days
    if (!hasSeenWelcomeSession) {
      // Show after a short delay to let the page load
      const timer = setTimeout(() => {
        setShowWelcome(true);
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('hasSeenWelcomeSession', 'true');
    
    // Store timestamp to show again after 30 days
    const now = Date.now();
    localStorage.setItem('lastWelcomeShown', now.toString());
  };

  const handleRegister = () => {
    // You can navigate to registration page or open modal
    window.location.href = '/joinCommunity';
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/About" element={<About />}/>
        <Route path="/Career" element={<Career />}/>
        <Route path="/Robotics" element={<Robotics />}/>
        <Route path="/WorkShops" element={<Workshops />}/>
        <Route path="/R_AND_D" element={<RND />}/>
        <Route path="/R_AND_D/:projectId" element={<RNDProjectDetail />}/>
        <Route path="/research-projects" element={<ResearchProjects />}/>
        <Route path="/WebServices" element={<WebServices />}/>
        <Route path="/DigitalMarketing" element={<DigitalMarketing />}/>
        <Route path="/Community" element={<Community />}/>
        <Route path="/NewCommunity" element={<NewCommunity />}/>
        <Route path="/Contact" element={<Contact />}/>
        <Route path="/Programs" element={<Programs />}/>
        <Route path="/Programs/:id" element={<ProgramDetail />}/>
        <Route path="/Services/" element={<Services />}/>
        <Route path="/StackenzoPrograms" element={<StackenzoPrograms />}/>
        <Route path="/Portfolio" element={<Portfolio />}/>
        <Route path="/Gallerypage" element={<GalleryPage />}/>
        <Route path="/Terms" element={<Terms />}/>
        <Route path="/Privacy" element={<Privacy />}/>
        <Route path="/admin/resumes" element={<ResumeAdmin />}/>
        <Route path="/workshop/register" element={<WorkshopRegister />}/>
        <Route path="/workshop/success" element={<WorkshopSuccess />}/>
        <Route path="/workshop/already-registered" element={<WorkshopAlreadyRegistered />}/>
        <Route path="/Bootcamp2026" element={<IntermediateResults />}/>
        <Route path="/joinCommunity" element={<JoinCommunity />} />
        <Route path="/schoolCamp" element={<SummerCampGallery />} />
      </Routes>
      
      <AnimatePresence>
        {showWelcome && (
          <WelcomeDialog 
            onClose={handleCloseWelcome} 
            onRegister={handleRegister}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;