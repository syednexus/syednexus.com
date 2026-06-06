"use client";

import {useEffect,useState} from "react";


export default function SentinelBoot({
complete
}:{
complete:()=>void
}){


const logs=[

"Connecting to Sentinel Network...",
"Loading identity database...",
"Mapping career intelligence...",
"Synchronizing capability modules...",
"Verifying credentials...",
"Access granted."

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
text-cyan-300
font-mono
flex
items-center
justify-center
">


<div className="w-150">


<h1 className="
text-3xl
mb-8
">

🛡 SYED NEXUS SENTINEL

</h1>



{logs.slice(0,index).map(log=>(

<p key={log}>

&gt; {log}

</p>

))}


</div>


</main>

);


}