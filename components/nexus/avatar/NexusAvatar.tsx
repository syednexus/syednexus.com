"use client";


import { useState } from "react";

import { motion } from "framer-motion";

import { useNexus } from "@/context/NexusContext";

import { avatarProfiles } from "@/data/avatar";





export default function NexusAvatar(){


const {

avatar,

visitor,

changeSystem,

completeObjective

}=useNexus();





const [open,setOpen] =
useState(false);







const avatarData={


gateway:{

icon:"🌌",

title:"NEXUS GUIDE",

role:"Digital Intelligence Assistant",

outfit:"Core Interface",

message:"Welcome. Select a Nexus pathway to begin."

},



sentinel:{

icon:"🛡",

title:"SENTINEL ANALYST",

role:"Cybersecurity Intelligence Agent",

outfit:"SOC Analyst Gear",

message:"Monitoring cybersecurity intelligence."

},




lab:{

icon:"🥷",

title:"CYBER OPERATOR",

role:"Security Research Assistant",

outfit:"Operator Interface",

message:"Security lab environment active."

},




medcore:{

icon:"🥼",

title:"MEDCORE SPECIALIST",

role:"Healthcare Intelligence Agent",

outfit:"Medical Research Coat",

message:"Healthcare intelligence systems online."

},




owner:{

icon:"👑",

title:"NEXUS ARCHITECT",

role:"System Administrator",

outfit:"Command Interface",

message:"Administrator control active."

}



};







const current =
avatarData[avatar];


const actions =
avatarProfiles[avatar].actions;









function executeAction(action:string){



const command =
action.toLowerCase();




if(

command.includes("project") ||

command.includes("lab")

){


changeSystem("lab");

return;

}





if(

command.includes("cyber") ||

command.includes("sentinel") ||

command.includes("skill")

){


changeSystem("defender");

return;

}





if(

command.includes("health") ||

command.includes("medical") ||

command.includes("pharma")

){


changeSystem("medcore");

return;

}






if(command.includes("resume")){



completeObjective("resume");

window.open(

"/resume.pdf",

"_blank"

);


return;


}


}









return(

<motion.div


initial={{

opacity:0,

x:-40

}}


animate={{

opacity:1,

x:0

}}


className="

fixed

left-6

bottom-6

z-50

font-mono

max-h-[90vh]

overflow-y-auto

"

>







{

open

?

(

<div

className="

w-72

border

border-purple-400/40

rounded-2xl

bg-[#020617]

p-5

shadow-xl

shadow-purple-500/20

"

>






<div className="flex justify-between items-center">


<p className="text-purple-300 text-xs tracking-widest">

AVATAR ENGINE

</p>



<button

onClick={()=>setOpen(false)}

className="text-gray-400"

>

—

</button>



</div>







<motion.div


animate={{

y:[0,-8,0]

}}


transition={{

duration:3,

repeat:Infinity

}}


className="text-center mt-5"

>


<div className="text-6xl">

{current.icon}

</div>



<h2 className="text-purple-300 mt-3">

{current.title}

</h2>



<p className="text-xs text-gray-400">

{current.role}

</p>



</motion.div>








<div className="mt-5 text-xs space-y-3">


<p>

VISITOR:

<span className="text-purple-300">

{" "}

{visitor.toUpperCase()}

</span>

</p>





<p>

OUTFIT:

<span className="text-purple-300">

{" "}

{current.outfit}

</span>


</p>






<p

className="

border-t

border-purple-400/20

pt-3

text-gray-300

"

>

"{current.message}"

</p>



</div>








<div className="mt-5 space-y-2">


{

actions.map(action=>(


<button


key={action}


onClick={()=>executeAction(action)}


className="

w-full

border

border-purple-400/20

rounded-lg

py-2

text-xs

text-purple-200

hover:bg-purple-400/10

transition

"

>


{action}


</button>


))

}


</div>





</div>


)

:

(

<button


onClick={()=>setOpen(true)}


className="

w-16

h-16

rounded-full

border

border-purple-400

bg-[#020617]

text-3xl

shadow-lg

shadow-purple-500/30

hover:scale-110

transition

"

>


{current.icon}


</button>

)

}





</motion.div>

);


}