"use client";

import { useEffect, useState } from "react";

import Terminal from "./Terminal";
import NodeMap from "./NodeMap";
import MissionPanel from "./MissionPanel";
import SystemLog from "./SystemLog";
import BootScreen from "./BootScreen";
import StatusBar from "./StatusBar";
import RootPanel from "./RootPanel";

type Props={

setMode:(mode:"gateway"|"defender"|"lab")=>void;

};


export default function NexusLab({setMode}:Props){


const [booted,setBooted]=useState(false);

const [unlocked,setUnlocked]=useState<string[]>([]);

const [completed,setCompleted]=useState(false);


const [logs,setLogs]=useState<string[]>([

"System boot complete",
"Guest session initialized"

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




useEffect(()=>{


if(unlocked.length===4 && !completed){


setCompleted(true);


setLogs(prev=>[

...prev,

"[ROOT] Vault reconstruction complete",

"[ROOT] Full profile access granted"

]);


}


},[unlocked,completed]);





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

bg-gradient-to-br

from-[#06111f]

via-[#0b2145]

to-[#24103f]

text-white


">


<StatusBar

unlocked={unlocked}

setMode={setMode}

/>




<section className="

grid

grid-cols-12

gap-6

p-6

min-h-[calc(100vh-4rem)]

">


<div className="col-span-3">


<MissionPanel

unlocked={unlocked}

/>



{completed && (

<div className="

mt-6

border

border-green-400

rounded-xl

p-5

bg-green-500/10

font-mono

">


<h3 className="text-green-300">

ROOT ACCESS GRANTED

</h3>


<p className="text-sm mt-3">

Nexus identity reconstruction completed.

</p>


<p className="text-xs mt-4 text-gray-300">

All encrypted archives recovered.

</p>


</div>

)}



</div>





<div className="

col-span-6

flex

items-center

justify-center

">


{
completed
?
<RootPanel/>
:
<NodeMap unlocked={unlocked}/>
}


</div>





<div className="

col-span-3

space-y-5

">


<SystemLog logs={logs}/>


<Terminal unlock={unlock}/>


</div>




</section>



</main>

);


}