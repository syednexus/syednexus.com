"use client";


import { useEffect, useState } from "react";
import { motion } from "framer-motion";



type Props = {

complete:()=>void;

};



const bootLines = [

"Initializing Nexus OS...",

"Loading security modules...",

"Mounting encrypted vault...",

"Starting analyst environment...",

"System ready."

];






export default function BootScreen({

complete

}:Props){





const [index,setIndex] =
useState(0);






useEffect(()=>{



if(index < bootLines.length){



const timer =
setTimeout(()=>{


setIndex(prev=>prev+1);


},600);




return()=>clearTimeout(timer);



}





const finish =
setTimeout(()=>{


complete();


},700);




return()=>clearTimeout(finish);





},[index,complete]);









const progress = Math.round(

(index / bootLines.length) * 100

);









return(

<main className="

min-h-screen

bg-black

text-green-400

font-mono

flex

items-center

justify-center

p-10

">








<motion.div

initial={{

opacity:0,

y:20

}}

animate={{

opacity:1,

y:0

}}

className="w-full max-w-xl"

>








<p className="

tracking-widest

text-green-300

">

⬢ NEXUS BIOS v2.0

</p>









<div className="

mt-10

space-y-4

">








{bootLines.slice(0,index).map(line=>(




<motion.div

key={line}

initial={{

opacity:0,

x:-10

}}

animate={{

opacity:1,

x:0

}}

>

[ OK ] {line}

</motion.div>





))}









</div>









<div className="

mt-10

h-2

bg-gray-800

rounded

overflow-hidden

">







<div

style={{

width:`${progress}%`

}}

className="

h-full

bg-green-400

transition-all

"

/>








</div>









<p className="

text-right

text-xs

mt-3

">

{progress}% COMPLETE

</p>









</motion.div>







</main>

);



}