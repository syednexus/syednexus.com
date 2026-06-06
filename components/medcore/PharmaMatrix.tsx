"use client";

import { medcore } from "@/data/medcore";
import { motion } from "framer-motion";


export default function PharmaMatrix(){


return(

<motion.div

initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}

className="
h-full
border
border-green-400/30
rounded-2xl
bg-black/40
p-6
"

>


<p className="
text-green-300
tracking-widest
text-sm
">

PHARMACEUTICAL KNOWLEDGE MATRIX

</p>


<div className="
grid
md:grid-cols-2
gap-5
mt-6
">


{medcore.domains.map(area=>(


<div

key={area.name}

className="
border
border-green-400/20
rounded-xl
p-4
bg-green-400/5

nexus-hover
"

>


<h3 className="
text-green-200
">

{area.name}

</h3>




<div className="
mt-3
space-y-2
">


{area.concepts.map(item=>(


<p

key={item}

className="
text-sm
text-gray-300
"

>

✓ {item}

</p>


))}


</div>


</div>


))}


</div>


</motion.div>

)

}