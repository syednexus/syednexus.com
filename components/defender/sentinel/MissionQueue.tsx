import { sentinel } from "@/data/sentinel";


export default function MissionQueue(){


return(

<div className="
border
border-red-400/30
bg-black/30
rounded-xl
p-6
font-mono
">


<h2 className="text-red-300">

MISSION QUEUE

</h2>


{sentinel.missions.map(mission=>(

<p 
key={mission}
className="mt-3"
>

&gt; {mission}

</p>

))}


</div>

)

}