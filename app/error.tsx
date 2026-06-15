"use client";


import { useEffect } from "react";





export default function Error({

error,

reset

}:{

error:Error;

reset:()=>void;

}){



useEffect(()=>{


console.error(

"NEXUS UI ERROR",

error

);


},[error]);





return(

<div className="

min-h-screen

flex

flex-col

items-center

justify-center

bg-black

text-green-400

font-mono

space-y-5

">


<h1 className="text-3xl">

⚠ Nexus System Interrupt

</h1>



<p className="text-gray-400">

A temporary interface error occurred.

</p>



<button

onClick={()=>reset()}

className="

border

border-green-400

rounded-xl

px-5

py-3

hover:bg-green-400/10

"

>

Restart Nexus Interface

</button>


</div>

);

}