"use client";


import { motion } from "framer-motion";





type Props={

unlocked:string[];

};








export default function NodeMap({

unlocked

}:Props){








const nodes=[



{
id:"IDENTITY",
icon:"👤",
name:"Identity Node",
desc:"Professional profile archive"
},



{
id:"SKILLS",
icon:"🖥",
name:"Capability Server",
desc:"Technical skill database"
},



{
id:"PROJECTS",
icon:"⚔",
name:"Project Vault",
desc:"Security case files"
},



{
id:"CERTS",
icon:"🛡",
name:"Credential Store",
desc:"Verified achievements"
}



];










const progress = Math.round(

(unlocked.length / nodes.length) * 100

);










return(

<motion.div


initial={{

opacity:0,

scale:.96

}}


animate={{

opacity:1,

scale:1

}}



className="

w-full

border

border-purple-400/30

rounded-2xl

bg-black/40

p-8

font-mono

shadow-lg

shadow-purple-500/10

"

>









{/* HEADER */}



<div className="

flex

justify-between

items-center

"

>







<div>






<p className="

text-purple-300

tracking-widest

text-sm

">

🛰 NEXUS NETWORK MAP

</p>








<p className="

text-xs

text-gray-500

mt-2

">

Decrypt all nodes to reconstruct the intelligence vault

</p>







</div>








<div className="

text-green-400

text-sm

"

>

{progress}% SYNC

</div>








</div>












{/* PROGRESS */}



<div className="

h-2

bg-gray-800

rounded

overflow-hidden

mt-6

"

>








<div


style={{

width:`${progress}%`

}}


className="

h-full

bg-purple-400

transition-all

"

/>








</div>












{/* MAP */}



<div className="

mt-10

grid

grid-cols-3

gap-6

items-center

text-center

"

>











{/* LEFT NODES */}



<div className="space-y-6">








{nodes.slice(0,2).map(node=>(









<Node


key={node.id}


node={node}


active={unlocked.includes(node.id)}


/>









))}










</div>













{/* CORE */}



<motion.div



animate={{

scale:[1,.97,1]

}}



transition={{

duration:3,

repeat:Infinity

}}



>










<div className="

border

border-purple-400

rounded-full

w-44

h-44

mx-auto

flex

items-center

justify-center

bg-purple-500/10

shadow-lg

shadow-purple-500/20

"

>










<div>







<div className="text-5xl">

🧠

</div>








<p className="

text-sm

mt-3

text-purple-300

">

NEXUS CORE

</p>









<p className="

text-xs

text-gray-500

mt-1

">

AI Vault

</p>









</div>









</div>










<p className="

mt-5

text-xs

text-gray-400

"

>

Central intelligence system

</p>









</motion.div>














{/* RIGHT NODES */}



<div className="space-y-6">








{nodes.slice(2).map(node=>(









<Node


key={node.id}


node={node}


active={unlocked.includes(node.id)}


/>









))}










</div>









</div>











{/* HELP */}



<div className="

mt-8

border

border-purple-400/20

rounded-xl

p-4

text-xs

text-gray-400

bg-black/30

"

>

Terminal commands:

<span className="text-purple-300">

{" "}unlock identity • unlock skills • unlock projects • unlock certs

</span>

</div>










</motion.div>

);



}













function Node({

node,

active

}:{

node:{

id:string;

icon:string;

name:string;

desc:string;

};

active:boolean;

}){








return(

<motion.div


whileHover={{

scale:1.05

}}



className={

`

border

rounded-xl

p-4

transition

${

active

?

"border-green-400 bg-green-400/10 text-green-300 shadow-green-500/20"

:

"border-gray-700 bg-black/40 text-gray-500"

}

`

}

>








<div className="text-3xl">

{node.icon}

</div>









<h3 className="

text-sm

mt-3

">

{node.name}

</h3>









<p className="

text-xs

mt-2

text-gray-500

">

{node.desc}

</p>









<p className={

`

text-xs

mt-3

${active ? "text-green-400":"text-red-400"}

`

}

>

{

active

?

"● ONLINE"

:

"○ LOCKED"

}

</p>









</motion.div>

);



}