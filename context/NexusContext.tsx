"use client";


import {

createContext,
useContext,
useState,
ReactNode

} from "react";


import { Mode } from "@/types/mode";

import { withAchievementTier } from "@/lib/achievementTier";





export type VisitorRole =
"unknown" |
"recruiter" |
"cyber" |
"healthcare" |
"explorer";





export type AvatarMode =
"gateway" |
"sentinel" |
"lab" |
"medcore" |
"owner";





export type Objective={

id:string;

title:string;

completed:boolean;

};





export type Achievement={

id:string;

title:string;

description:string;

icon:string;

tier?:"standard" | "specialist";

};










type NexusContextType={


// visitor

visitor:VisitorRole;

setVisitor:(role:VisitorRole)=>void;


// system

currentSystem:Mode;

setCurrentSystem:(mode:Mode)=>void;

changeSystem:(mode:Mode)=>void;


// avatar

avatar:AvatarMode;

setAvatar:(mode:AvatarMode)=>void;


// AI

aiOpen:boolean;

setAiOpen:(open:boolean)=>void;


aiPrompt:string;

setAiPrompt:(prompt:string)=>void;


// missions

mission:string;

setMission:(mission:string)=>void;


missionProgress:number;

setMissionProgress:(value:number)=>void;


objectives:Objective[];

completeObjective:(id:string)=>void;


// XP

xp:number;

addXP:(amount:number)=>void;


// achievements

achievements:Achievement[];

unlockAchievement:(achievement:Achievement)=>void;

recentUnlock:Achievement | null;

celebrateAchievement:(achievement:Achievement)=>void;

clearRecentUnlock:()=>void;


};










const NexusContext =
createContext<NexusContextType|null>(null);









export function NexusProvider({

children

}:{

children:ReactNode

}){







// VISITOR


const [visitor,setVisitor]=
useState<VisitorRole>("unknown");








// SYSTEM


const [currentSystem,setCurrentSystem]=
useState<Mode>("gateway");








// AVATAR


const [avatar,setAvatar]=
useState<AvatarMode>("gateway");










function changeSystem(

mode:Mode

){



setCurrentSystem(mode);




const avatarMap:Record<Mode,AvatarMode>={


gateway:"gateway",

defender:"sentinel",

lab:"lab",

medcore:"medcore",

blogs:"gateway"


};





setAvatar(

avatarMap[mode]

);



}









// AI


const [aiOpen,setAiOpen]=
useState(false);




const [aiPrompt,setAiPrompt]=
useState("");










// MISSION


const [mission,setMission]=
useState(

"Explore Nexus Identity System"

);




const [missionProgress,setMissionProgress]=
useState(0);









const [objectives,setObjectives]=
useState<Objective[]>([


{

id:"sentinel",

title:"Explore Sentinel Profile",

completed:false

},



{

id:"projects",

title:"Review Nexus Projects",

completed:false

},



{

id:"resume",

title:"Download Resume",

completed:false

},



{

id:"ai",

title:"Use Nexus AI",

completed:false

}


]);









// XP


const [xp,setXP]=
useState(0);








// ACHIEVEMENTS


const [achievements,setAchievements]=
useState<Achievement[]>([]);


const [recentUnlock,setRecentUnlock]=
useState<Achievement | null>(null);









function addXP(

amount:number

){


setXP(prev=>prev+amount);


}











function completeObjective(

id:string

){



setObjectives(prev=>{



const target =
prev.find(

item=>item.id===id

);




if(!target || target.completed){


return prev;


}






setXP(x=>x+100);








return prev.map(item=>


item.id===id


?


{

...item,

completed:true

}


:


item


);



});



}









function celebrateAchievement(

achievement:Achievement

){


setRecentUnlock(withAchievementTier(achievement));


}




function clearRecentUnlock(){


setRecentUnlock(null);


}




function unlockAchievement(

achievement:Achievement

){



setAchievements(prev=>{





const exists =
prev.some(

item=>item.id===achievement.id

);





if(exists){

return prev;

}




queueMicrotask(()=>celebrateAchievement(achievement));




return [

...prev,

achievement

];



});



}









return(

<NexusContext.Provider


value={{


// visitor

visitor,

setVisitor,



// system

currentSystem,

setCurrentSystem,

changeSystem,



// avatar

avatar,

setAvatar,



// AI

aiOpen,

setAiOpen,


aiPrompt,

setAiPrompt,



// mission

mission,

setMission,


missionProgress,

setMissionProgress,


objectives,

completeObjective,



// XP

xp,

addXP,



// achievements

achievements,

unlockAchievement,

recentUnlock,

celebrateAchievement,

clearRecentUnlock



}}


>


{children}


</NexusContext.Provider>


);



}











export function useNexus(){



const context =
useContext(NexusContext);




if(!context){


throw new Error(

"useNexus must be used inside NexusProvider"

);


}




return context;



}