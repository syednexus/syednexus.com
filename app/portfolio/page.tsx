"use client";

import {

useEffect,
useState

} from "react";

import dynamic from "next/dynamic";

import { useSession } from "next-auth/react";


// TYPES

import { AccessLevel } from "@/types/access";


// CONTEXT

import { useNexus } from "@/context/NexusContext";

// Gateway is the landing screen — load eagerly
import NexusGateway from "@/components/nexus/gateway/NexusGateway";

// Heavy system panels — load only when navigated to
const DefenderConsole = dynamic(() => import("@/components/defender/DefenderConsole"), { ssr: false });

const NexusLab = dynamic(() => import("@/components/lab/NexusLab"), { ssr: false });

const MedCore = dynamic(() => import("@/components/medcore/MedCore"), { ssr: false });

const NexusBlogs = dynamic(() => import("@/components/blogs/NexusBlogs"), { ssr: false });


// GLOBAL COMPONENTS — defer so initial paint is fast

const NexusCore = dynamic(() => import("@/components/nexus/core/NexusCore"), { ssr: false });

const SystemSwitcher = dynamic(() => import("@/components/core/SystemSwitcher"), { ssr: false });

const NexusCommand = dynamic(() => import("@/components/NexusCommand"), { ssr: false });


// ENGINES

const MissionEngine = dynamic(() => import("@/components/nexus/mission/MissionEngine"), { ssr: false });






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
