"use client";


import { motion } from "framer-motion";






type Props={

logs:string[];

};







export default function SystemLog({

logs

}:Props){







return(

<motion.div


initial={{

opacity:0,

x:20

}}


animate={{

opacity:1,

x:0

}}



className="

border

border-blue-400/30

rounded-2xl

bg-black/50

p-5

font-mono

shadow-lg

shadow-blue-500/10

h-72

overflow-y-auto

"

>









<p className="

text-blue-300

tracking-widest

text-sm

">

📡 SYSTEM LOG

</p>









<p className="

text-xs

text-gray-500

mt-2

">

Real-time Nexus activity stream

</p>









<div className="

mt-5

space-y-3

text-sm

"

>









{

logs.length===0

?

<p className="text-gray-500">

No activity detected

</p>

:

logs.map((log,index)=>(









<motion.div


key={`${log}-${index}`}


initial={{

opacity:0,

x:10

}}


animate={{

opacity:1,

x:0

}}



className="

text-green-400

"

>








<span className="text-blue-300">

[{String(index+1).padStart(3,"0")}]

</span>



{" "}



{log}









</motion.div>








))

}










</div>









</motion.div>

);



}