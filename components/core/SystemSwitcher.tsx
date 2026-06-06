"use client";


import { Mode } from "@/types/mode";

import { useNexus } from "@/context/NexusContext";

import { cn } from "@/lib/utils";





type System={

name:string;

mode:Mode;

icon:string;

};







const systems:System[]=[



{

name:"GATEWAY",

mode:"gateway",

icon:"🌌"

},





{

name:"SENTINEL",

mode:"defender",

icon:"🛡"

},





{

name:"LAB",

mode:"lab",

icon:"⚔"

},





{

name:"MEDCORE",

mode:"medcore",

icon:"🧬"

},





{

name:"BLOGS",

mode:"blogs",

icon:"📝"

}



];










const avatarMap:Record<Mode,

"gateway" |

"sentinel" |

"lab" |

"medcore" |

"owner"

>={



gateway:"gateway",



defender:"sentinel",



lab:"lab",



medcore:"medcore",



blogs:"gateway"



};









type Props={

current:Mode;

setMode:(mode:Mode)=>void;

};










export default function SystemSwitcher({

current,

setMode

}:Props){







const {

setAvatar,

setCurrentSystem

}=useNexus();









function switchSystem(

mode:Mode

){



setMode(mode);



setCurrentSystem(mode);



setAvatar(

avatarMap[mode]

);



}










return(

<nav

aria-label="Nexus system navigation"


className={cn(

"fixed",

"top-20",

"right-5",

"z-50",

"flex",

"gap-3",

"font-mono"

)}

>









{systems

.filter(system=>system.mode!==current)

.map(system=>(






<button


key={system.mode}



aria-label={`Switch to ${system.name}`}



onClick={()=>switchSystem(system.mode)}



className={cn(

"border",

"border-white/20",

"rounded-xl",

"bg-black/70",

"backdrop-blur-xl",

"px-4",

"py-2",

"text-sm",

"hover:bg-white/10",

"hover:scale-105",

"transition"

)}

>







<span

aria-hidden="true"

>

{system.icon}

</span>

{" "}

{system.name}







</button>







))}









</nav>


);



}