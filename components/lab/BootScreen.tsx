"use client";

import { useEffect, useState } from "react";


type Props = {
  complete:()=>void;
};


export default function BootScreen({complete}:Props){


const lines=[

"Initializing Nexus OS...",
"Loading security modules...",
"Mounting encrypted vault...",
"Starting analyst environment...",
"System ready."

];


const [index,setIndex]=useState(0);



useEffect(()=>{


if(index < lines.length){


const timer=setTimeout(()=>{

setIndex(index+1);

},600);


return()=>clearTimeout(timer);


}


else{


setTimeout(()=>{

complete();

},700);


}



},[index]);




return(

<main className="
min-h-screen
bg-black
text-green-400
font-mono
p-10
">


<div>

NEXUS BIOS v1.0


</div>



<div className="mt-10 space-y-4">


{lines.slice(0,index).map(line=>(

<div key={line}>

[ OK ] {line}

</div>

))}


</div>



</main>

);


}