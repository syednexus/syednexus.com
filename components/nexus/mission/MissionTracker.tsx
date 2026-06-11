"use client";


import { motion } from "framer-motion";

import { useNexus } from "@/context/NexusContext";





export default function MissionTracker(){



const {

mission,

missionProgress,

xp,

setMissionProgress,

addXP,

unlockAchievement

}=useNexus();






function advanceMission(){



const nextProgress =

Math.min(

missionProgress + 25,

100

);




setMissionProgress(nextProgress);



addXP(100);






if(nextProgress===100){



unlockAchievement({

id:"first_mission",

title:"Nexus Explorer",

description:"Completed first Nexus exploration",

icon:"🏆"

});



}



}









return(

<motion.div


initial={{

opacity:0,

y:40

}}


animate={{

opacity:1,

y:0

}}



className="

fixed

bottom-28

right-6

z-40

w-80

border

border-yellow-400/30

rounded-2xl

bg-black/80

backdrop-blur-xl

p-5

font-mono

shadow-lg

shadow-yellow-500/20

"

>









<p className="

text-yellow-300

tracking-widest

text-sm

">

🎯 ACTIVE MISSION

</p>








<p className="

mt-4

text-white

text-sm

">

{mission}

</p>










<div className="

h-2

bg-gray-800

rounded

overflow-hidden

mt-4

">





<div


style={{

width:`${missionProgress}%`

}}



className="

h-full

bg-yellow-400

transition-all

"

/>






</div>









<div className="

flex

justify-between

mt-3

text-xs

text-gray-400

">



<span>

{missionProgress}% COMPLETE

</span>





<span>

⚡ {xp} XP

</span>






</div>











<button


onClick={advanceMission}



className="

mt-5

w-full

border

border-yellow-400/40

rounded-xl

py-2

text-yellow-300

hover:bg-yellow-400/10

transition

"

>

Complete Objective

</button>








</motion.div>

);



}