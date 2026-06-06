"use client";


import { useEffect, useState } from "react";


import Terminal from "./Terminal";
import NodeMap from "./NodeMap";
import MissionPanel from "./MissionPanel";
import SystemLog from "./SystemLog";
import BootScreen from "./BootScreen";
import StatusBar from "./StatusBar";
import RootPanel from "./RootPanel";
import LabIdentity from "./LabIdentity";
import SecurityArsenal from "./SecurityArsenal";


import SystemSwitcher from "@/components/core/SystemSwitcher";


import { Mode } from "@/types/mode";
import { AccessLevel } from "@/types/access";




type Props={

setMode:(mode:Mode)=>void;

access:AccessLevel;

setAccess:(access:AccessLevel)=>void;

};






export default function NexusLab({

setMode,

access,

setAccess

}:Props){






const [booted,setBooted]=useState(

access==="root" || access==="owner"

);





const [unlocked,setUnlocked]=useState<string[]>(

access==="root" || access==="owner"

?

[
"IDENTITY",
"SKILLS",
"PROJECTS",
"CERTS"
]

:

[]

);







const [completed,setCompleted]=useState(

access==="root" || access==="owner"

);







const [logs,setLogs]=useState<string[]>([


access==="owner"

?

"[OWNER] Administrator session restored"

:

"[+] Guest session initialized"


]);









function unlock(name:string){



setUnlocked(prev=>{



if(prev.includes(name)){

return prev;

}





setLogs(old=>[

...old,

`[+] ${name} archive unlocked`

]);





return [...prev,name];



});



}










// Visitor completed all missions = ROOT read only

useEffect(()=>{



if(unlocked.length>=4 && !completed){



setCompleted(true);



setAccess("root");



setLogs(prev=>[

...prev,

"[ROOT] Vault reconstruction complete",

"[ROOT] Read-only profile access granted"

]);



}



},[unlocked,completed,setAccess]);









// Password success = OWNER admin


useEffect(()=>{



if(access==="owner"){



setUnlocked([

"IDENTITY",

"SKILLS",

"PROJECTS",

"CERTS"

]);




setCompleted(true);




setLogs(prev=>[

...prev,

"[OWNER] Administrator privileges activated"

]);



}



},[access]);









if(!booted){



return(

<BootScreen

complete={()=>setBooted(true)}

/>

);



}










return(

<main className="

min-h-screen

bg-linear-to-br

from-[#020617]

via-[#081b33]

to-[#14091f]

text-white

">







<StatusBar

unlocked={unlocked}

setMode={setMode}

/>








<section className="

p-6

space-y-6

">





<LabIdentity/>









<div className="

grid

grid-cols-12

gap-6

">







<div className="

col-span-12

xl:col-span-3

space-y-6

">






<MissionPanel

unlocked={unlocked}

/>





<SecurityArsenal/>






</div>










<div className="

col-span-12

xl:col-span-6

flex

items-center

justify-center

">





{

completed

?

<RootPanel

access={access}

/>

:

<NodeMap unlocked={unlocked}/>

}







</div>











<div className="

col-span-12

xl:col-span-3

space-y-5

">






<SystemLog logs={logs}/>







<Terminal

unlock={unlock}

setAccess={setAccess}

/>






</div>









</div>






</section>









<SystemSwitcher

current="lab"

setMode={setMode}

/>







</main>


);



}