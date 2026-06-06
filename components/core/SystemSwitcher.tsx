"use client";


import { Mode } from "@/types/mode";




type Props={

current:Mode;

setMode:(mode:Mode)=>void;

};







export default function SystemSwitcher({

current,

setMode

}:Props){






const systems:{


name:string;

mode:Mode;

icon:string;


}[]=[



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










return(

<div className="

fixed

top-5

right-5

z-50

flex

gap-3

font-mono

">








{systems

.filter(system=>system.mode!==current)

.map(system=>(



<button


key={system.mode}


onClick={()=>setMode(system.mode)}


className="

border

border-white/20

rounded-xl

bg-black/60

backdrop-blur

px-4

py-2

text-sm

hover:bg-white/10

transition

"

>



{system.icon} {system.name}




</button>



))}







</div>


);


}