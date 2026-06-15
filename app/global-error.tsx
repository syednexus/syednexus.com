"use client";





export default function GlobalError({

reset

}:{

error:Error;

reset:()=>void;

}){



return(

<html>

<body>


<div className="

min-h-screen

flex

flex-col

items-center

justify-center

bg-black

text-red-400

font-mono

space-y-5

">


<h1>

🚨 Nexus Core Failure

</h1>



<p>

Critical system error detected.

</p>



<button

onClick={()=>reset()}

>

Recover System

</button>



</div>


</body>

</html>

);

}