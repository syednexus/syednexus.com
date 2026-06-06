"use client";


import { useEffect,useState } from "react";





type Props={

unlocked:string[];

};








export default function StatusBar({

unlocked

}:Props){





const [time,setTime]=useState(0);








useEffect(()=>{



const timer=setInterval(()=>{



setTime(t=>t+1);



},1000);





return()=>clearInterval(timer);



},[]);










const percent = Math.round(

(unlocked.length/4)*100

);









return(

<header className="

h-16

border-b

border-cyan-400/20

bg-black/40

flex

items-center

justify-between

px-8

font-mono

text-sm

">








<div className="

text-cyan-300

tracking-widest

">

⬢ NEXUS LAB OS

</div>










<div className="

flex

gap-6

text-gray-300

">







<span>

ACCESS: GUEST

</span>








<span>

VAULT: {percent}%

</span>









<span>

SESSION: {time}s

</span>








<span className="text-green-400">

● ONLINE

</span>








</div>








</header>

);



}