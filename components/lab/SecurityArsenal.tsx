"use client";


import { motion } from "framer-motion";







export default function SecurityArsenal(){







const tools=[



{
icon:"🛡",
name:"Nessus",
type:"Vulnerability Assessment",
status:"ACTIVE"
},



{
icon:"🌐",
name:"Burp Suite",
type:"Web Application Testing",
status:"ACTIVE"
},



{
icon:"📡",
name:"Wireshark",
type:"Packet Analysis",
status:"ACTIVE"
},



{
icon:"⚔",
name:"Nmap",
type:"Network Discovery",
status:"ACTIVE"
},



{
icon:"🐧",
name:"Linux CLI",
type:"Security Operations",
status:"ACTIVE"
},



{
icon:"🔐",
name:"Cryptography",
type:"Security Engineering",
status:"LEARNING"
}



];











return(

<motion.div


initial={{

opacity:0,

x:-20

}}


animate={{

opacity:1,

x:0

}}



className="

border

border-orange-400/30

rounded-2xl

bg-black/40

p-5

font-mono

shadow-lg

shadow-orange-500/10

nexus-hover

"

>










{/* HEADER */}



<p className="

text-orange-300

tracking-widest

text-sm

">

🛠 SECURITY ARSENAL

</p>







<p className="

text-xs

text-gray-500

mt-2

">

Cybersecurity tools and operational technologies

</p>












<div className="

grid

gap-3

mt-6

">











{tools.map((tool,index)=>(







<motion.div



key={tool.name}



initial={{

opacity:0,

y:10

}}



animate={{

opacity:1,

y:0

}}



transition={{

delay:index*0.05

}}





className="

border

border-orange-400/20

rounded-xl

p-4

bg-orange-400/5

hover:bg-orange-400/10

transition

"

>











<div className="

flex

justify-between

items-center

gap-3

">







<div className="

flex

gap-3

items-center

">








<span className="text-2xl">

{tool.icon}

</span>










<div>








<h3>

{tool.name}

</h3>









<p className="

text-xs

text-gray-400

mt-1

">

{tool.type}

</p>









</div>








</div>











<span className="

text-[10px]

border

border-orange-400/30

rounded-full

px-2

py-1

text-orange-300

"

>


{tool.status}


</span>









</div>










</motion.div>








))}











</div>









</motion.div>

);



}