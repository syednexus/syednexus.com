"use client";


import {

createContext,
useContext,
useState,
ReactNode

} from "react";


import { Mode } from "@/types/mode";





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





export type Achievement={

id:string;

title:string;

description:string;

icon:string;

};





type NexusContextType={


// visitor

visitor:VisitorRole;

setVisitor:(role:VisitorRole)=>void;


// system

currentSystem:Mode;

setCurrentSystem:(mode:Mode)=>void;


// avatar

avatar:AvatarMode;

setAvatar:(mode:AvatarMode)=>void;


// mission

mission:string;

setMission:(mission:string)=>void;


missionProgress:number;

setMissionProgress:(value:number)=>void;


// xp

xp:number;

addXP:(amount:number)=>void;


// achievements

achievements:Achievement[];

unlockAchievement:(achievement:Achievement)=>void;


};










const NexusContext =
createContext<NexusContextType|null>(null);










export function NexusProvider({

children

}:{

children:ReactNode

}){







const [visitor,setVisitor] =
useState<VisitorRole>("unknown");




const [currentSystem,setCurrentSystem] =
useState<Mode>("gateway");




const [avatar,setAvatar] =
useState<AvatarMode>("gateway");





const [mission,setMission] =
useState(
"Explore Nexus Identity System"
);





const [missionProgress,setMissionProgress] =
useState(0);





const [xp,setXP] =
useState(0);





const [achievements,setAchievements] =
useState<Achievement[]>([]);










function addXP(amount:number){


setXP(prev=>prev+amount);


}










function unlockAchievement(

achievement:Achievement

){



setAchievements(prev=>{



const exists = prev.some(

item=>item.id===achievement.id

);



if(exists){

return prev;

}



return [

...prev,

achievement

];


});


}









return(

<NexusContext.Provider


value={{


visitor,

setVisitor,


currentSystem,

setCurrentSystem,


avatar,

setAvatar,


mission,

setMission,


missionProgress,

setMissionProgress,


xp,

addXP,


achievements,

unlockAchievement


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