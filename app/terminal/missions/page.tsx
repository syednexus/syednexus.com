"use client";


import Link from "next/link";

import { useMissions } from "@/hooks/useMissions";



export default function TerminalMissions(){


const missions =
useMissions();



const labs =
missions.filter(
m=>m.type==="TERMINAL"
);



return(

<main className="
min-h-screen
bg-black
text-green-400
p-10
font-mono
">


<h1 className="text-5xl">

TERMINAL LABS

</h1>



<div className="
grid
md:grid-cols-2
gap-6
mt-10
">


{


labs.map(lab=>(


<Link

href={`/mission/${lab.slug}`}

key={lab.id}

className="
border
border-green-800
rounded-xl
p-6
hover:bg-green-950/20
"

>


<h2 className="text-2xl">

{lab.title}

</h2>


<p className="text-gray-400 mt-4">

{lab.description}

</p>


<p className="mt-5">

{lab.xp} XP

</p>


</Link>


))


}


</div>


</main>

);


}