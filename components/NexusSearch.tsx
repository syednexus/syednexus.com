"use client";


import { motion } from "framer-motion";

import { useNexusSearch } from "@/hooks/useNexusSearch";







export default function NexusSearch(){








const {

query,

setQuery,

results

}=useNexusSearch();











return(

<motion.div


initial={{

opacity:0,

y:-10

}}


animate={{

opacity:1,

y:0

}}



className="

border

border-cyan-400/30

rounded-2xl

bg-black/50

p-5

font-mono

shadow-lg

shadow-cyan-500/10

"

>









{/* SEARCH INPUT */}



<div className="

flex

items-center

gap-3

"

>








<span className="text-cyan-300">

⌕ 

</span>









<input


value={query}


onChange={e=>

setQuery(e.target.value)

}


placeholder="Search Nexus intelligence..."



className="

bg-transparent

outline-none

flex-1

text-cyan-300

placeholder:text-gray-600

"

/>








</div>












{/* RESULTS */}



{

query && (

<div className="

mt-5

space-y-3

max-h-96

overflow-y-auto

"

>









{

results.length===0 && (



<p className="

text-gray-500

text-sm

"

>

No intelligence records found.

</p>



)

}










{

results.map((item,index)=>(









<motion.div


key={index}


initial={{

opacity:0,

x:-10

}}


animate={{

opacity:1,

x:0

}}


className="

border

border-cyan-400/20

rounded-xl

p-4

bg-cyan-400/5

nexus-hover

"

>










<div className="

flex

justify-between

"

>








<p>

{item.icon} {item.title}

</p>









<span className="

text-xs

text-cyan-300

"

>

{item.type}

</span>








</div>










<p className="

text-sm

text-gray-400

mt-2

"

>

{item.description}

</p>










</motion.div>









))

}









</div>

)

}











</motion.div>

);



}