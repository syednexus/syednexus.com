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

y:20

}}


animate={{

opacity:1,

y:0

}}



className="

w-full

min-h-72

border

border-blue-400/30

rounded-2xl

bg-black/50

backdrop-blur-xl

p-6

font-mono

shadow-lg

shadow-blue-500/10

overflow-hidden

"

>





{/* HEADER */}

<div className="

flex

items-center

justify-between

border-b

border-blue-400/10

pb-4

"

>



<div>


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


</div>




<button

className="

text-xs

text-gray-400

border

border-blue-400/20

rounded-lg

px-3

py-1

hover:text-blue-300

hover:bg-blue-400/10

transition

"

>

CLEAR

</button>




</div>







{/* LOG AREA */}


<div className="

mt-5

space-y-3

text-sm

max-h-56

overflow-y-auto

pr-2

"

>





{

logs.length===0

?

(

<div className="

h-32

flex

items-center

justify-center

text-gray-500

tracking-wide

"

>

No system activity recorded.

</div>

)

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

flex

gap-3

text-green-400

bg-green-400/5

border

border-green-400/10

rounded-lg

px-3

py-2

"

>



<span className="text-blue-300">

[{String(index+1).padStart(3,"0")}]

</span>




<span>

{log}

</span>





</motion.div>



))

}





</div>





</motion.div>

);



}