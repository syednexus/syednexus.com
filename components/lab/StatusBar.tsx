"use client";

import { useEffect, useState } from "react";


type Props={

unlocked:string[];

setMode:(mode:"gateway"|"defender"|"lab")=>void;

};


export default function StatusBar({
unlocked,
setMode
}:Props){


const [time,setTime]=useState(0);


useEffect(()=>{

const timer=setInterval(()=>{

setTime(t=>t+1);

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
flex
items-center
justify-between
px-8
font-mono
text-sm
">


<div className="text-cyan-300">

⬢ NEXUS OS

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

</div>




<div className="flex gap-3">


<button

onClick={()=>setMode("defender")}

className="
border
border-blue-400/50
text-blue-300
px-4
py-2
rounded
hover:bg-blue-500/10
"

>

🛡 Defender

</button>




<button

onClick={()=>setMode("gateway")}

className="
border
border-gray-400/50
text-gray-300
px-4
py-2
rounded
hover:bg-white/10
"

>

Gateway

</button>


</div>


</header>

);

}