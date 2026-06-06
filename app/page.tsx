"use client";


import { useState } from "react";


import { Mode } from "@/types/mode";
import { AccessLevel } from "@/types/access";
import NexusBlogs from "@/components/blogs/NexusBlogs";

import NexusGateway from "@/components/core/NexusGateway";

import DefenderConsole from "@/components/defender/DefenderConsole";

import NexusLab from "@/components/lab/NexusLab";

import MedCore from "@/components/medcore/MedCore";



export default function Home(){


const [mode,setMode]=useState<Mode>("gateway");


const [access,setAccess]=
useState<AccessLevel>("visitor");




if(mode==="gateway"){

return(

<NexusGateway

setMode={setMode}

/>

)

}





if(mode==="defender"){

return(

<DefenderConsole

setMode={setMode}

/>

)

}





if(mode==="medcore"){

return(

<MedCore

setMode={setMode}

/>

)

}




if(mode==="blogs"){

return(

<NexusBlogs

setMode={setMode}

/>

)

}

return(

<NexusLab

setMode={setMode}

access={access}

setAccess={setAccess}

/>

)



}