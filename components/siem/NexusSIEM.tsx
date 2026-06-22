"use client";


import { useState } from "react";



export default function NexusSIEM(){


const [query,setQuery]=useState("");

const [results,setResults]=useState<string[]>([]);




function search(){


const q =
query.toLowerCase();



if(
q.includes("auth") ||
q.includes("ssh") ||
q.includes("failed")
){


setResults([

`
TIME:
2026-06-20 13:44

EVENT:
Failed password for root

SOURCE:
45.33.21.10

COUNT:
43 attempts

MITRE:
T1110 Brute Force

SEVERITY:
HIGH
`

]);


return;

}







if(
q.includes("powershell") ||
q.includes("process")
){


setResults([

`
HOST:
WIN-CLIENT01

PROCESS:
powershell.exe

COMMAND:
-EncodedCommand

MITRE:
T1059

SEVERITY:
CRITICAL
`

]);

return;


}





setResults([

"No matching events"

]);


}








return(

<div

className="
border
border-blue-800
rounded-xl
p-6
bg-black
font-mono
text-green-400
"

>


<h2 className="text-3xl">

NEXUS SIEM

</h2>



<p className="text-gray-500 mt-2">

Security Event Search

</p>





<div className="flex mt-8 gap-3">


<input

value={query}

onChange={e=>setQuery(e.target.value)}

placeholder="index=auth failed"

className="
flex-1
bg-black
border
border-green-700
p-3
outline-none
"

/>


<button

onClick={search}

className="
border
border-green-500
px-6
"

>

SEARCH

</button>


</div>








<div className="
mt-8
whitespace-pre-wrap
text-sm
">


{

results.map((r,i)=>(

<pre key={i}>

{r}

</pre>

))

}


</div>




</div>

);


}