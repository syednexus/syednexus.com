import { AvatarMode } from "@/context/NexusContext";



export const avatarProfiles:Record<
AvatarMode,
{
icon:string;

title:string;

role:string;

outfit:string;

message:string;

actions:string[];

}

>={



gateway:{

icon:"🌌",

title:"NEXUS GUIDE",

role:"Digital Intelligence Assistant",

outfit:"Core Interface",

message:"Welcome. Select a Nexus pathway to begin.",

actions:[

"Show Cyber Profile",

"View Projects",

"Download Resume"

]

},





sentinel:{

icon:"🛡",

title:"SENTINEL ANALYST",

role:"Cybersecurity Intelligence Agent",

outfit:"SOC Analyst Gear",

message:"Monitoring cybersecurity intelligence.",

actions:[

"Open Security Skills",

"View Cyber Projects",

"Analyze Career Profile"

]

},





lab:{

icon:"🥷",

title:"CYBER OPERATOR",

role:"Security Research Assistant",

outfit:"Operator Interface",

message:"Security lab environment active.",

actions:[

"Show Projects",

"Explain Labs",

"Open Cyber Profile"

]

},





medcore:{

icon:"🥼",

title:"MEDCORE SPECIALIST",

role:"Healthcare Intelligence Agent",

outfit:"Medical Research Coat",

message:"Healthcare intelligence systems online.",

actions:[

"Show Healthcare Background",

"Healthcare Cybersecurity",

"Download Resume"

]

},






owner:{

icon:"👑",

title:"NEXUS ARCHITECT",

role:"System Administrator",

outfit:"Command Interface",

message:"Administrator control active.",

actions:[

"System Report",

"View Everything",

"Download Resume"

]

}


};