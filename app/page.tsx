import Navigation from "@/components/Navigation";
import MainHero from "@/components/MainHero";
import AboutSection from "@/components/AboutSection";
import JourneySection from "@/components/JourneySection";
import SkillsSection from "@/components/SkillsSection";
import LabSection from "@/components/LabSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CertificationsSection from "@/components/CertificationsSection";     

export default function Home() {

  return (

    <main className="min-h-screen bg-[#050B14] text-white">


      <Navigation />

      <MainHero />

      <AboutSection />

      <JourneySection />

      <SkillsSection />

      <CertificationsSection />

      <LabSection />

      <ContactSection />

      <Footer />

      
    </main>

  );

}