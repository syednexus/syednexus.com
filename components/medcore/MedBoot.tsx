"use client";

import {useEffect,useState} from "react";


export default function MedBoot({
complete
}:{
complete:()=>void
}){


const logs=[

"Accessing healthcare intelligence database...",
"Loading pharmaceutical records...",
"Mapping clinical knowledge...",
"Connecting cyber-health interface...",
"MedCore access granted."

];


const [index,setIndex]=useState(0);



useEffect(()=>{


if(index<logs.length){

const timer=setTimeout(()=>{

setIndex(index+1);

},600);


return()=>clearTimeout(timer);

}


setTimeout(complete,700);


},[index]);




return(

<main className="
min-h-screen
bg-black
text-emerald-300
font-mono
flex
items-center
justify-center
">


<div>


<h1 className="
text-3xl
mb-8
">

🧬 NEXUS MEDCORE

</h1>



{logs.slice(0,index).map(log=>(

<p key={log}>

&gt; {log}

</p>

))}



</div>


</main>

)


}