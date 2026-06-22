"use client";


import MedCore from "@/components/medcore/MedCore";

import { useNexus } from "@/context/NexusContext";



export default function MedCorePage(){


const { changeSystem } =
useNexus();


return (

<MedCore

setMode={changeSystem}

/>

);


}
