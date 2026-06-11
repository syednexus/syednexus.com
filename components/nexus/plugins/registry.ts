import { NexusPlugin } from "./types";




export const plugins:NexusPlugin[]=[


{


id:"cybersecurity",

name:"Cyber Operations",

icon:"🛡",

category:"Security",

description:
"Security analysis, tools, labs and operations",

commands:[

"security",

"sentinel",

"tools",

"scan"

],

enabled:true


},







{


id:"healthcare",

name:"Healthcare Intelligence",

icon:"🧬",

category:"Medical",

description:
"Pharmacy and cyber healthcare intelligence",

commands:[

"medical",

"pharmacy",

"health"

],

enabled:true


},







{


id:"learning",

name:"Learning Tracker",

icon:"🎓",

category:"Growth",

description:
"Certifications and skill progression",

commands:[

"learn",

"certs",

"progress"

],

enabled:true


},







{


id:"career",

name:"Career Engine",

icon:"💼",

category:"Professional",

description:
"Resume, experience and career intelligence",

commands:[

"career",

"resume",

"work"

],

enabled:true


}



];