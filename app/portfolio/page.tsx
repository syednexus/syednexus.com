"use client";


import {

useEffect,
useState

} from "react";

import { useSession } from "next-auth/react";


// TYPES

import { AccessLevel } from "@/types/access";


// CONTEXT

import { useNexus } from "@/context/NexusContext";

import NexusGateway from "@/components/nexus/gateway/NexusGateway";

import DefenderConsole from "@/components/defender/DefenderConsole";

import NexusLab from "@/components/lab/NexusLab";

import MedCore from "@/components/medcore/MedCore";

import NexusBlogs from "@/components/blogs/NexusBlogs";


// GLOBAL COMPONENTS

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


const { data:session, status } =
useSession();




// RESTORE OWNER SESSION (NextAuth or lab cookie)


useEffect(()=>{


if(status === "loading"){

return;

}


async function restoreSession(){


if(session?.user?.role === "OWNER"){

setAccess("owner");

return;

}


try{


const response =

await fetch("/api/auth/lab-session");


const data =

await response.json();


if(data.authenticated){

setAccess("owner");

return;

}


}catch{


// fall through to visitor

}


setAccess("visitor");


}


restoreSession();


},[session,status]);




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

<>

{/* MAIN NEXUS OS ROUTER */}

<NexusRouter/>


{/* GLOBAL COMMAND PALETTE CTRL + K */}

<NexusCommand/>


<NexusCore/>


{/* BACKGROUND SERVICES */}

<MissionEngine/>

</>

);


}
