"use client";


import {

useEffect,

useState

} from "react";


import { motion } from "framer-motion";






type Props={

complete:()=>void;

};







const bootLogs=[


"Accessing healthcare intelligence database...",

"Loading pharmaceutical knowledge archive...",

"Scanning clinical security modules...",

"Mapping healthcare threat intelligence...",

"Connecting cyber-health interface...",

"MedCore access granted."


];









export default function MedBoot({

complete

}:Props){








const [index,setIndex]=useState(0);









useEffect(()=>{






if(index < bootLogs.length){








const timer=setTimeout(()=>{


setIndex(prev=>prev+1);


},550);







return()=>clearTimeout(timer);






}








const finish=setTimeout(()=>{


complete();


},700);







return()=>clearTimeout(finish);








},[index,complete]);









const progress=Math.round(

(index / bootLogs.length)*100

);










return(

<main className="

min-h-screen

bg-black

text-emerald-300

font-mono

flex

items-center

justify-center

"

>









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

max-w-xl

"

>









<h1 className="

text-3xl

tracking-widest

mb-8

">

🧬 NEXUS MEDCORE BIOS

</h1>











<div className="

space-y-4

"

>








{bootLogs.slice(0,index).map(log=>(








<motion.p


key={log}


initial={{

opacity:0,

x:-10

}}


animate={{

opacity:1,

x:0

}}

>

<span className="text-green-400">

[ OK ]

</span>


{" "}


{log}


</motion.p>








))}








</div>









<div className="

mt-10

h-2

bg-gray-800

rounded

overflow-hidden

"

>








<div


style={{

width:`${progress}%`

}}


className="

h-full

bg-emerald-400

transition-all

"

/>








</div>










<p className="

text-right

text-xs

mt-3

">

{progress}% INITIALIZED

</p>










</motion.div>








</main>

);



}