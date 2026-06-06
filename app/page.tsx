"use client";


import { useState } from "react";


// TYPES

import { Mode } from "@/types/mode";

import { AccessLevel } from "@/types/access";




// CONTEXT

import { NexusProvider } from "@/context/NexusContext";




// SYSTEMS

import NexusGateway from "@/components/nexus/gateway/NexusGateway";

import DefenderConsole from "@/components/defender/DefenderConsole";

import NexusLab from "@/components/lab/NexusLab";

import MedCore from "@/components/medcore/MedCore";

import NexusBlogs from "@/components/blogs/NexusBlogs";




// GLOBAL NEXUS COMPONENTS

import NexusAI from "@/components/nexus/ai/NexusAI";

import NexusAvatar from "@/components/nexus/avatar/NexusAvatar";

import NexusCore from "@/components/nexus/core/NexusCore";

import SystemSwitcher from "@/components/core/SystemSwitcher";









function NexusRouter(){





const [mode,setMode]=

useState<Mode>("gateway");





const [access,setAccess]=

useState<AccessLevel>("visitor");








let screen;








if(mode==="gateway"){



screen =

<NexusGateway

setMode={setMode}

/>;



}









else if(mode==="defender"){



screen =

<DefenderConsole

setMode={setMode}

/>;



}









else if(mode==="medcore"){



screen =

<MedCore

setMode={setMode}

/>;



}










else if(mode==="blogs"){



screen =

<NexusBlogs

setMode={setMode}

/>;



}










else{



screen =

<NexusLab


setMode={setMode}


access={access}


setAccess={setAccess}


/>;



}









return(

<>



{screen}






{/* GLOBAL NAVIGATION */}

{

mode!=="gateway" && (


<SystemSwitcher


current={mode}


setMode={setMode}


/>


)

}




</>

);



}












export default function Home(){






return(

<NexusProvider>





<NexusRouter/>





{/* GLOBAL EXPERIENCE LAYER */}



<NexusAI/>





<NexusAvatar/>





<NexusCore/>





</NexusProvider>

);



}