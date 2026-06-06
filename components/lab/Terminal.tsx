"use client";


import { useState,useRef,useEffect } from "react";

import { admin } from "@/data/admin";

import { AccessLevel } from "@/types/access";




type Props={

unlock:(x:string)=>void;

setAccess:(x:AccessLevel)=>void;

};






export default function Terminal({

unlock,

setAccess

}:Props){



const [input,setInput]=useState("");

const [loading,setLoading]=useState(false);

const [owner,setOwner]=useState(false);

const [awaitingPassword,setAwaitingPassword]=useState(false);



const [history,setHistory]=useState<string[]>([

"Nexus Red Team Console v3.0",

"Encrypted session established.",

"Type 'help' for available commands."

]);



const bottomRef=useRef<HTMLDivElement>(null);

const inputRef=useRef<HTMLInputElement>(null);






useEffect(()=>{


bottomRef.current?.scrollIntoView({

behavior:"smooth"

});


inputRef.current?.focus();


},[history,loading]);










async function execute(){



if(!input.trim() || loading){

return;

}



const cmd=input.trim();


setInput("");




setHistory(prev=>[

...prev,

`${owner ? "owner@nexus:~#" : "guest@nexus:~$"} ${
awaitingPassword ? "********" : cmd
}`

]);










/* PASSWORD CHECK */


if(awaitingPassword){



const savedPassword=

localStorage.getItem("nexus_password")

||

admin.security.password;




if(cmd===savedPassword){



setOwner(true);


setAwaitingPassword(false);


/* IMPORTANT */
setAccess("owner");





setHistory(prev=>[

...prev,

`
[OWNER ACCESS GRANTED]

Administrator identity confirmed.

SYSTEM STATUS:
✓ Sentinel online
✓ MedCore online
✓ Nexus Lab unlocked

OWNER SESSION ACTIVE
`

]);



}


else{


setAwaitingPassword(false);


setHistory(prev=>[

...prev,

"[ACCESS DENIED] Invalid owner credential"

]);


}




return;



}









/* COMMANDS */



if(cmd==="clear"){


setHistory([

"Nexus Red Team Console v3.0"

]);


return;


}






if(

cmd==="sudo unlock" ||

cmd==="nexus --root"

){



setAwaitingPassword(true);



setHistory(prev=>[

...prev,

`
OWNER AUTHENTICATION REQUIRED

Enter administrator password:
`

]);



return;


}










/* API ENGINE */


setLoading(true);



try{


const response=await fetch(

"/api/terminal",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

command:cmd

})

}

);



const data=await response.json();





setTimeout(()=>{



setHistory(prev=>[

...prev,

data.output

]);



if(data.unlock){


unlock(data.unlock);


}



setLoading(false);



},400);




}

catch{


setHistory(prev=>[

...prev,

"Connection failure."

]);


setLoading(false);


}



}









return(

<div

onClick={()=>inputRef.current?.focus()}

className="

border
border-green-400/30

rounded-2xl

bg-black/70

p-5

h-130

overflow-y-auto

font-mono

shadow-lg

shadow-green-500/10

"

>







<div className="

border-b

border-green-500/20

pb-3

mb-4

">



<p className="text-green-300 text-xs tracking-widest">

⚔ NEXUS RED TEAM CONSOLE

</p>



<div className="text-xs text-gray-400 mt-2">

SESSION: ENCRYPTED |

USER: {owner ? "OWNER":"GUEST"}

</div>



</div>








<div className="

space-y-3

text-sm

text-green-400

whitespace-pre-wrap

">





{history.map((line,index)=>(

<div key={index}>

{line}

</div>

))}







{loading && (

<div>

executing...

</div>

)}








<div className="flex">



<span>

{owner ? "owner@nexus:~#" : "guest@nexus:~$"}

&nbsp;

</span>





<input

ref={inputRef}

value={input}

type={awaitingPassword ? "password":"text"}

onChange={e=>setInput(e.target.value)}

onKeyDown={e=>{


if(e.key==="Enter"){

execute();

}


}}

className="

bg-transparent

outline-none

flex-1

text-green-300

"

/>



</div>




<div ref={bottomRef}/>



</div>



</div>


);


}