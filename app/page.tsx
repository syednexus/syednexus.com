"use client";


import {

useEffect,
useState

} from "react";


// TYPES

import { AccessLevel } from "@/types/access";


// CONTEXT

import {

NexusProvider,

useNexus

} from "@/context/NexusContext";


// SYSTEM MODULES

import NexusGateway from "@/components/nexus/gateway/NexusGateway";

import DefenderConsole from "@/components/defender/DefenderConsole";

import NexusLab from "@/components/lab/NexusLab";

import MedCore from "@/components/medcore/MedCore";

import NexusBlogs from "@/components/blogs/NexusBlogs";


// GLOBAL COMPONENTS

import NexusAvatar from "@/components/nexus/avatar/NexusAvatar";

import NexusCore from "@/components/nexus/core/NexusCore";

import SystemSwitcher from "@/components/core/SystemSwitcher";

import NexusCommand from "@/components/NexusCommand";


// ENGINES

import MissionEngine from "@/components/nexus/mission/MissionEngine";










function NexusRouter(){






const {

currentSystem,

changeSystem

}=useNexus();







const [access,setAccess] =

useState<AccessLevel>("visitor");










// RESTORE OWNER SESSION FROM COOKIE


useEffect(()=>{



async function restoreSession(){



try{



const response =

await fetch(

"/api/auth/session"

);




const data =

await response.json();





if(data.authenticated){



setAccess("owner");



}




}



catch{



setAccess("visitor");



}



}




restoreSession();



},[]);












let screen;











switch(currentSystem){









case "gateway":



screen=(

<NexusGateway

setMode={changeSystem}

/>

);



break;











case "defender":



screen=(

<DefenderConsole/>

);



break;












case "medcore":



screen=(

<MedCore

setMode={changeSystem}

/>

);



break;












case "blogs":



screen=(

<NexusBlogs/>

);



break;












case "lab":



screen=(

<NexusLab


access={access}


setAccess={setAccess}

/>

);



break;











default:



screen=(

<NexusGateway

setMode={changeSystem}

/>

);



}














return(

<>








{/* ACTIVE SYSTEM */}

<div className="relative min-h-screen">

{screen}

</div>









{/* SYSTEM SWITCHER */}


{

currentSystem !== "gateway"

&&

(

<SystemSwitcher


current={currentSystem}


setMode={changeSystem}

/>

)

}











</>

);



}















export default function Home(){







return(

<NexusProvider>










{/* MAIN NEXUS OS ROUTER */}

<NexusRouter/>










{/* GLOBAL COMMAND PALETTE CTRL + K */}

<NexusCommand/>










{/* GLOBAL AI EXPERIENCE */}

<NexusAvatar/>





<NexusCore/>










{/* BACKGROUND SERVICES */}

<MissionEngine/>










</NexusProvider>

);



}