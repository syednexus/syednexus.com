"use client";


import { motion } from "framer-motion";

import { medcore } from "@/data/medcore";






export default function PharmaMatrix(){







const domains = medcore.domains || [];









return(

<motion.div


initial={{

opacity:0,

y:30

}}


animate={{

opacity:1,

y:0

}}


className="

h-full

border

border-green-400/30

rounded-2xl

bg-black/40

p-6

font-mono

shadow-lg

shadow-green-500/10

nexus-hover

"

>










{/* HEADER */}



<p className="

text-green-300

tracking-widest

text-sm

">

💊 PHARMA INTELLIGENCE MATRIX

</p>









<p className="

text-xs

text-gray-400

mt-3

">

Clinical knowledge archive and healthcare domain mapping

</p>











<div className="

grid

md:grid-cols-2

gap-5

mt-8

"

>










{domains.map((area,index)=>(









<motion.div


key={`${area.name}-${index}`}


whileHover={{

scale:1.03

}}



className="

border

border-green-400/20

rounded-xl

p-4

bg-green-400/5

"

>









<h3 className="

text-green-200

"

>

🧬 {area.name}

</h3>









<div className="

mt-4

space-y-2

"

>










{area.concepts.map((item,i)=>(









<p


key={`${item}-${i}`}


className="

text-sm

text-gray-300

"

>

✓ {item}

</p>









))}










</div>










</motion.div>









))}










</div>











</motion.div>

);



}