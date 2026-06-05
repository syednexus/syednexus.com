"use client";

import { useState } from "react";

import NexusGateway from "@/components/core/NexusGateway";
import NexusLab from "@/components/lab/NexusLab";
import DefenderConsole from "@/components/defender/DefenderConsole";


export default function Home(){


const [mode,setMode] =
useState<"gateway"|"defender"|"lab">("gateway");



if(mode==="gateway"){

return (

<NexusGateway

setMode={setMode}

/>

);

}



if(mode==="lab"){

return (

<NexusLab

setMode={setMode}

/>

);

}



return (

<DefenderConsole

setMode={setMode}

/>

);


}