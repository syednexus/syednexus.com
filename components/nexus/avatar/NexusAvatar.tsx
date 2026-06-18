"use client";


import { useState } from "react";

import { motion } from "framer-motion";

import { useNexus } from "@/context/NexusContext";





export default function NexusAvatar(){



const {

avatar,

visitor,

changeSystem,

completeObjective

}=useNexus();






const [open,setOpen] =
useState(false);



const [command,setCommand] =
useState("");



const [terminal,setTerminal] =
useState<string[]>([

"Nexus CLI initialized",

"type help"

]);









function executeCommand(){



const cmd =
command.toLowerCase().trim();



let response =
"Unknown command. Type help";






if(cmd==="help"){


response =

`
Available commands:

profile
projects
soc
medcore
resume
system
clear
`;

}




else if(cmd==="profile"){


changeSystem("gateway");


response =
"Loading Nexus profile interface...";


}







else if(cmd==="projects"){


changeSystem("lab");


response =
"Opening project environment...";


}







else if(cmd==="soc"){


changeSystem("defender");


response =
"Sentinel SOC simulation loading...";


}







else if(cmd==="medcore"){


changeSystem("medcore");


response =
"MedCore intelligence system online...";


}







else if(cmd==="resume"){


completeObjective("resume");


window.open(

"/resume.pdf",

"_blank"

);



response =
"Opening resume...";


}







else if(cmd==="system"){


response =

`
Visitor : ${visitor}

Mode    : ${avatar}

Status  : ONLINE
`;


}






else if(cmd==="clear"){


setTerminal([]);


setCommand("");


return;


}







setTerminal([

...terminal,

"syed@nexus:~$ "+command,

response

]);



setCommand("");



}









return(

<>


{/* TERMINAL BUTTON */}


<motion.button


initial={{

opacity:0,

scale:0.8

}}


animate={{

opacity:1,

scale:1

}}



onClick={()=>setOpen(true)}



className="

fixed
left-6
bottom-6

z-50

w-16
h-16

rounded-lg

bg-black/80
backdrop-blur

border
border-green-400

text-green-400

font-mono
font-bold
text-xl

shadow-lg
shadow-green-500/30

hover:scale-110
transition

"

>


&gt;_


</motion.button>









{open && (



<motion.div


initial={{

opacity:0,

y:30

}}



animate={{

opacity:1,

y:0

}}




className="

fixed

left-6

bottom-28

z-50



w-105

h-105



bg-black



border

border-green-500



rounded-xl



shadow-xl

shadow-green-500/20



font-mono



overflow-hidden

"

>








{/* HEADER */}



<div

className="

flex

items-center

justify-between



px-4

py-3



border-b

border-green-900



bg-green-950/20

"

>



<div>


<p

className="

text-green-400

text-sm

tracking-widest

"

>

SYED@NEXUS:~$

</p>




<p

className="

text-xs

text-gray-500

"

>

{avatar.toUpperCase()} MODE


</p>


</div>







<button


onClick={()=>setOpen(false)}


className="

text-gray-400

hover:text-white

"

>


×


</button>




</div>









{/* TERMINAL OUTPUT */}



<div


className="

h-75

p-4



overflow-auto



text-sm

text-green-400



space-y-2

"

>



{


terminal.map((line,index)=>(



<p key={index}

className="whitespace-pre-line"

>


{line}


</p>



))


}



</div>









{/* COMMAND INPUT */}




<div


className="

border-t

border-green-900



p-3



flex

items-center

gap-2

"

>



<span

className="text-green-500"

>

$

</span>






<input


value={command}



onChange={(e)=>

setCommand(

e.target.value

)

}




onKeyDown={(e)=>{


if(e.key==="Enter"){


executeCommand();


}


}}



className="

flex-1



bg-transparent



outline-none



text-green-400

"



autoFocus


/>




</div>







</motion.div>



)}



</>


);



}