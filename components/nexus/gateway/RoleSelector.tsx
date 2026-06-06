"use client";


import { motion } from "framer-motion";


import {

useNexus,
VisitorRole

} from "@/context/NexusContext";


import { Mode } from "@/types/mode";






type Props={

setMode:(mode:Mode)=>void;

};







const roles:{

id:VisitorRole;

icon:string;

title:string;

desc:string;

system:Mode;

}[]=[


{

id:"recruiter",

icon:"👔",

title:"Recruiter",

desc:"Evaluate experience, skills and professional journey",

system:"defender"

},



{

id:"cyber",

icon:"🛡",

title:"Cyber Professional",

desc:"Explore labs, security projects and research",

system:"lab"

},




{

id:"healthcare",

icon:"🧬",

title:"Healthcare Professional",

desc:"Explore pharmacy and healthcare security background",

system:"medcore"

},




{

id:"explorer",

icon:"🚀",

title:"Explorer",

desc:"Experience complete Nexus environment",

system:"defender"

}



];









export default function RoleSelector({

setMode

}:Props){






const {

setVisitor,

setAvatar,

setMission,

setMissionProgress,

addXP,

unlockAchievement

}=useNexus();









function selectRole(role:typeof roles[number]){



setVisitor(role.id);



setMissionProgress(10);



addXP(50);




unlockAchievement({

id:"first_access",

title:"First Access",

description:"Entered Nexus ecosystem",

icon:"🌌"

});









if(role.id==="recruiter"){


setAvatar("sentinel");


setMission(

"Evaluate professional profile"

);


}




if(role.id==="cyber"){


setAvatar("lab");


setMission(

"Investigate cybersecurity capability"

);


}




if(role.id==="healthcare"){


setAvatar("medcore");


setMission(

"Explore healthcare intelligence"

);


}






if(role.id==="explorer"){


setAvatar("gateway");


setMission(

"Explore Nexus universe"

);


}








setMode(role.system);



}









return(

<div className="

grid

grid-cols-1

md:grid-cols-4

gap-5

mt-10

">








{roles.map(role=>(



<motion.button


key={role.id}


whileHover={{

scale:1.05

}}


whileTap={{

scale:.95

}}



onClick={()=>selectRole(role)}



className="

border

border-cyan-400/30

rounded-2xl

bg-cyan-400/5

p-6

text-left

font-mono

hover:bg-cyan-400/10

transition

"

>






<div className="text-4xl">

{role.icon}

</div>






<h3 className="

text-cyan-300

mt-5

">

{role.title}

</h3>






<p className="

text-gray-400

text-sm

mt-3

">

{role.desc}

</p>






</motion.button>




))}







</div>


);


}