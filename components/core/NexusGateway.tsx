"use client";


type Props={

setMode:(
mode:
"gateway" |
"defender" |
"medcore" |
"lab" |
"blogs"
)=>void;

};




export default function NexusGateway({
setMode
}:Props){


const systems=[


{
icon:"🛡",
name:"SENTINEL",
desc:"Cybersecurity Intelligence Profile",
mode:"defender" as const,
color:"cyan"
},


{
icon:"🧬",
name:"MEDCORE",
desc:"Healthcare & Pharmaceutical Intelligence",
mode:"medcore" as const,
color:"emerald"
},



{
icon:"⚔",
name:"NEXUS LAB",
desc:"Interactive Security Environment",
mode:"lab" as const,
color:"green"
}


];





return(

<main className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
font-mono
overflow-hidden
">


<div className="
max-w-6xl
w-full
px-6
">



<div className="
text-center
mb-16
">


<h1 className="
text-5xl
tracking-widest
">

SYED NEXUS

</h1>



<p className="
text-gray-400
mt-5
">

Digital Identity Operating System

</p>



</div>





<div className="
grid
grid-cols-1
md:grid-cols-3
gap-8
">


{systems.map(system=>(


<button

key={system.name}

onClick={()=>setMode(system.mode)}

className="
group
border
border-white/20
rounded-2xl
p-8
bg-white/5
hover:bg-white/10
transition
text-left
"

>



<div className="
text-5xl
">

{system.icon}

</div>



<h2 className="
text-2xl
mt-6
">

{system.name}

</h2>




<p className="
text-gray-400
mt-4
">

{system.desc}

</p>




<div className="
mt-8
text-sm
text-green-300
">

INITIALIZE →

</div>



</button>


))}


</div>


</div>


</main>

)

}