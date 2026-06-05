"use client";

import { motion } from "framer-motion";


type Props = {

unlocked:string[];

};


export default function NodeMap({unlocked}:Props){


const nodes=[

{
name:"IDENTITY",
position:"top-0 left-1/2 -translate-x-1/2"
},

{
name:"SKILLS",
position:"top-1/2 left-0 -translate-y-1/2"
},

{
name:"PROJECTS",
position:"top-1/2 right-0 -translate-y-1/2"
},

{
name:"CERTS",
position:"bottom-0 left-1/2 -translate-x-1/2"
}

];



return(

<div className="
relative
w-[500px]
h-[500px]
">


{/* CONNECTION LINES */}


<div className="
absolute
top-1/2
left-0
w-full
border-t
border-cyan-500/20
"/>


<div className="
absolute
left-1/2
top-0
h-full
border-l
border-cyan-500/20
"/>




{/* CORE */}


<motion.div

animate={{

scale:[1,1.08,1]

}}

transition={{

repeat:Infinity,

duration:2

}}

className="
absolute
top-1/2
left-1/2
-translate-x-1/2
-translate-y-1/2
w-36
h-36
rounded-full
border
border-cyan-400
bg-cyan-500/10
flex
items-center
justify-center
shadow-lg
shadow-cyan-500/30
"

>

NEXUS
CORE

</motion.div>





{/* OUTER NODES */}


{nodes.map(node=>{


const active =
unlocked.includes(node.name);



return(

<motion.div

key={node.name}

className={`
absolute
${node.position}
w-32
h-32
rounded-full
border
flex
flex-col
items-center
justify-center
text-xs

${active

?
"border-green-400 bg-green-500/10 shadow-lg shadow-green-500/40"

:

"border-gray-600 bg-black/40"

}

`}


animate={

active?

{
scale:[1,1.1,1]
}

:

{}

}


transition={{

repeat:Infinity,

duration:2

}}


>


<div className="text-xl">

{active?"🔓":"🔒"}

</div>


{node.name}


</motion.div>


)

})}




</div>

)

}