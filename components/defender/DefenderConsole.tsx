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




<button

onClick={()=>setMode("lab")}

className="
fixed
bottom-6
right-6
border
border-green-400
text-green-300
bg-black/70
px-5
py-3
rounded-lg
hover:bg-green-500/10
"

>

⚔ Nexus Lab

</button>




</main>

)

}