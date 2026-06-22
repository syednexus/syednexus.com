"use client";


import { useEffect } from "react";

import { useNexus } from "@/context/NexusContext";







export default function MissionEngine(){






const {

currentSystem,

objectives,

completeObjective,

setMissionProgress,

unlockAchievement,

aiOpen

}=useNexus();











// SYSTEM MONITOR

useEffect(()=>{






if(currentSystem==="defender"){



completeObjective("sentinel");



unlockAchievement({


id:"sentinel_access",

title:"Sentinel Access",

description:"Entered cybersecurity intelligence system",

icon:"🛡"


});



}









if(currentSystem==="lab"){



completeObjective("projects");



unlockAchievement({


id:"lab_operator",

title:"Lab Operator",

description:"Accessed Nexus security laboratory",

icon:"⚔"


});



}










if(currentSystem==="medcore"){



unlockAchievement({


id:"medcore_access",

title:"MedCore Specialist",

description:"Explored healthcare intelligence system",

icon:"🧬"


});



}







},[currentSystem]);











// AI MONITOR

useEffect(()=>{



if(aiOpen){



completeObjective("ai");



unlockAchievement({


id:"ai_contact",

title:"AI Interaction",

description:"Activated Nexus AI assistant",

icon:"🤖"


});



}



},[aiOpen]);











// MISSION PROGRESS ENGINE

useEffect(()=>{





const completed =

objectives.filter(

item=>item.completed

).length;







const progress =

Math.round(

(completed/objectives.length)*100

);







setMissionProgress(progress);









if(progress===100){



unlockAchievement({

id:"nexus_master",

title:"Nexus Master",

description:"Completed the full Nexus exploration sequence",

icon:"◆"

});



}





},[objectives]);










return null;



}