"use client";

import { Mode } from "@/types/mode";
import { useNexus } from "@/context/NexusContext";
import { cn } from "@/lib/utils";

type System = {
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




const avatarMap:Record<
Mode,
"gateway" | "sentinel" | "lab" | "medcore" | "owner"
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




function switchSystem(mode:Mode){


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

"absolute",

"top-15",

"right-6",

"z-50",

"flex",

"items-center",

"justify-end",

"gap-3",

"font-mono",

"max-w-[80vw]",

"flex-wrap"

)}

>



{systems

.filter(system=>system.mode!==current)

.map(system=>(



<button

key={system.mode}

onClick={()=>switchSystem(system.mode)}

className={cn(

"group",

"border",

"border-purple-400/30",

"rounded-xl",

"bg-black/80",

"backdrop-blur-xl",

"px-4",

"py-2",

"text-sm",

"text-purple-200",


"shadow-lg",

"shadow-purple-500/20",


"transition-all",

"duration-300",

"ease-out",


"hover:bg-purple-500/20",

"hover:border-purple-300",

"hover:shadow-purple-500/50",

"hover:-translate-y-1",

"hover:scale-105",

"active:scale-95"

)}

>



<span

className="
inline-block
text-lg
transition-transform
duration-300
group-hover:rotate-12
"

>

{system.icon}

</span>


{" "}


<span className="tracking-widest whitespace-nowrap">

{system.name}

</span>




</button>


))

}



</nav>

);


}