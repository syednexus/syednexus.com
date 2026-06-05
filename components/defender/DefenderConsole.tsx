"use client";


import Navigation from "../Navigation";
import MainHero from "../MainHero";
import AboutSection from "../AboutSection";
import JourneySection from "../JourneySection";
import SkillsSection from "../SkillsSection";
import CertificationsSection from "../CertificationsSection";
import ProjectsSection from "../ProjectsSection";
import LabSection from "../LabSection";
import LanguagesSection from "../LanguagesSection";
import ContactSection from "../ContactSection";
import Footer from "../Footer";

import ModeSwitcher from "../core/ModeSwitcher";



type Props={

setMode:(mode:"gateway"|"defender"|"lab")=>void;

};



export default function DefenderConsole({setMode}:Props){


return(

<main className="
min-h-screen
bg-[#08111f]
text-white
relative
">


<Navigation/>

<MainHero/>

<AboutSection/>

<JourneySection/>

<SkillsSection/>

<CertificationsSection/>

<ProjectsSection/>

<LabSection/>

<LanguagesSection/>

<ContactSection/>

<Footer/>


<ModeSwitcher

current="defender"

setMode={setMode}

/>


</main>

)

}