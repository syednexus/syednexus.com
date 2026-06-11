"use client";


import {

useEffect,

useState

} from "react";


import { motion } from "framer-motion";





type Props={

complete:()=>void;

};





export default function NexusBoot({

complete

}:Props){





const [

progress,

setProgress

]=useState(0);







useEffect(()=>{



const timer=setInterval(()=>{



setProgress(prev=>{



if(prev>=100){


clearInterval(timer);


setTimeout(

complete,

600

);


return 100;


}




return prev+10;



});



},180);





return()=>clearInterval(timer);



},[]);









return(

<main className="

min-h-screen

bg-black

text-cyan-300

font-mono

flex

items-center

justify-center

">







<motion.div

initial={{

opacity:0

}}

animate={{

opacity:1

}}


className="w-96"

>






<h1 className="

tracking-[0.4em]

text-xl

">

⬢ NEXUS OS

</h1>








<div className="

mt-8

space-y-3

text-sm

text-gray-400

">



<p>

Initializing identity kernel...

</p>


<p>

Loading Sentinel protocols...

</p>


<p>

Connecting MedCore archive...

</p>


<p>

Activating AI companion...

</p>



</div>








<div className="

mt-8

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

bg-cyan-400

transition-all

"

/>



</div>








<p className="

mt-3

text-right

">

{progress}%

</p>






</motion.div>





</main>

);


}