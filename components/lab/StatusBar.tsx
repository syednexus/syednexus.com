"use client";


import { useEffect,useState } from "react";

import { AccessLevel } from "@/types/access";





type Props={

unlocked:string[];

access?:AccessLevel;

};








export default function StatusBar({

unlocked,

access="visitor"

}:Props){





const [time,setTime]=useState(0);








useEffect(()=>{



const timer=setInterval(()=>{


setTime(prev=>prev+1);


},1000);





return()=>clearInterval(timer);



},[]);









const percent=Math.round(

(unlocked.length/4)*100

);








return(

<header className="

h-16

border-b

border-cyan-400/20

bg-black/40

backdrop-blur

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

hidden

md:flex

gap-6

text-gray-300

">








<span>

ACCESS: {access.toUpperCase()}

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