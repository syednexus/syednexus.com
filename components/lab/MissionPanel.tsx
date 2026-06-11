"use client";


import { motion } from "framer-motion";






type Props={

unlocked:string[];

};








export default function MissionPanel({

unlocked

}:Props){







const archives=[



{
id:"IDENTITY",
title:"Identity Archive",
command:"unlock identity"
},



{
id:"SKILLS",
title:"Capability Matrix",
command:"unlock skills"
},



{
id:"PROJECTS",
title:"Project Vault",
command:"unlock projects"
},



{
id:"CERTS",
title:"Credential Store",
command:"unlock certs"
}



];








const progress = Math.round(

(unlocked.length / archives.length) * 100

);









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

border-cyan-400/30

rounded-2xl

bg-black/40

p-5

font-mono

shadow-lg

shadow-cyan-500/10

nexus-hover

"

>









{/* HEADER */}



<p className="

text-cyan-300

tracking-widest

text-sm

">

🎯 MISSION CONTROL

</p>










<p className="

text-xs

text-gray-500

mt-2

">

Restore Nexus archives through terminal operations

</p>













{/* COMPLETION */}



<div className="

mt-6

"

>








<div className="

flex

justify-between

text-xs

"

>








<span>

VAULT RESTORATION

</span>








<span className="text-cyan-300">

{progress}%

</span>









</div>









<div className="

h-2

bg-gray-800

rounded

overflow-hidden

mt-3

"

>









<div


style={{

width:`${progress}%`

}}



className="

h-full

bg-cyan-400

transition-all

"

/>









</div>









</div>














{/* OBJECTIVES */}



<div className="

mt-8

space-y-3

"

>











{archives.map(item=>(







<motion.div


key={item.id}


whileHover={{

scale:1.03

}}



className="

border

border-cyan-400/20

rounded-xl

p-4

bg-cyan-400/5

"

>











<div className="

flex

justify-between

items-center

"

>








<div>








<p className="

text-sm

text-gray-300

">

{item.title}

</p>










<p className="

text-xs

text-gray-500

mt-1

">

&gt; {item.command}

</p>








</div>











<span className={

unlocked.includes(item.id)

?

"text-green-400 text-xs"

:

"text-red-400 text-xs"

}

>

{

unlocked.includes(item.id)

?

"ONLINE"

:

"LOCKED"

}

</span>









</div>










</motion.div>








))}











</div>












{/* FOOTER */}



<div className="

mt-6

border

border-cyan-400/20

rounded-xl

p-3

text-xs

text-gray-400

bg-black/30

"

>

Use the Nexus terminal to complete objectives.

</div>











</motion.div>

);



}