"use client";


import {

useState,
useRef,
useEffect

} from "react";


import { AccessLevel } from "@/types/access";




type Props={

unlock:(x:string)=>void;

setAccess:(x:AccessLevel)=>void;

access:AccessLevel;

};










export default function Terminal({

unlock,

setAccess,

access

}:Props){









const [input,setInput]=useState("");

const [loading,setLoading]=useState(false);









const [history,setHistory]=useState<string[]>([

"Nexus Security Console v4.0",

"Encrypted operator session established.",

"Type 'help' to list commands."

]);










const bottomRef =
useRef<HTMLDivElement>(null);



const inputRef =
useRef<HTMLInputElement>(null);









useEffect(()=>{


bottomRef.current?.scrollIntoView({

behavior:"smooth"

});



inputRef.current?.focus();


},[history,loading]);









function addHistory(text:string){


setHistory(prev=>[

...prev,

text

]);


}









async function execute(){



if(!input.trim() || loading){

return;

}




const cmd =
input.trim().toLowerCase();



const rawInput =
input.trim();




setInput("");







addHistory(

`${

access==="owner"

?

"owner@nexus:~#"

:

"guest@nexus:~$"

} ${rawInput}`

);











// CLEAR


if(cmd==="clear"){


setHistory([

"Nexus Security Console v4.0"

]);


return;


}










// HELP


if(cmd==="help"){



addHistory(`

AVAILABLE COMMANDS


help
clear
whoami
status
tools

unlock identity
unlock skills
unlock projects
unlock certs

sudo unlock

`);



return;


}










// WHOAMI


if(cmd==="whoami"){



addHistory(

access==="owner"

?

"OWNER // Nexus Administrator"

:

"GUEST // Security Explorer"

);



return;


}










// STATUS


if(cmd==="status"){



addHistory(`

SYSTEM STATUS

Sentinel : ONLINE
MedCore  : ONLINE
Lab Core : ACTIVE

`);



return;


}










// TOOLS


if(cmd==="tools"){



addHistory(`

SECURITY TOOLKIT

> Nessus
> Burp Suite
> Wireshark
> Nmap
> Linux CLI

`);



return;


}









// UNLOCK COMMANDS


if(cmd==="unlock identity"){


unlock("IDENTITY");

addHistory("[+] Identity archive opened");

return;


}





if(cmd==="unlock skills"){


unlock("SKILLS");

addHistory("[+] Capability archive opened");

return;


}





if(cmd==="unlock projects"){


unlock("PROJECTS");

addHistory("[+] Case files opened");

return;


}






if(cmd==="unlock certs"){


unlock("CERTS");

addHistory("[+] Verification vault opened");

return;


}










// OWNER AUTH REQUEST


if(

cmd==="sudo unlock"

||

cmd==="nexus --root"

){



if(access==="owner"){



addHistory(

"[OWNER] Root privileges already active"

);



return;


}







addHistory(`

[PRIVILEGE ESCALATION REQUESTED]

Opening secure authentication gateway...

`);




setAccess("auth");



return;


}











// API COMMAND FALLBACK


setLoading(true);





try{



const response =

await fetch(

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







const data =

await response.json();







setTimeout(()=>{



addHistory(

data.output ||

"Command executed."

);




if(data.unlock){


unlock(data.unlock);


}





setLoading(false);



},400);





}



catch{



addHistory(

"Unknown command. Type 'help'."

);



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


<p className="

text-green-300
text-xs
tracking-widest

">

⚔ NEXUS TERMINAL

</p>





<p className="

text-xs
text-gray-400
mt-2

">

SESSION: ENCRYPTED |

USER: {

access==="owner"

?

" OWNER"

:

" GUEST"

}

</p>


</div>










<div className="

space-y-3
text-sm
text-green-400
whitespace-pre-wrap

">








{

history.map((line,index)=>(


<div key={index}>

{line}

</div>


))

}








{

loading &&

<div>

executing...

</div>

}









<div className="flex">



<span>


{

access==="owner"

?

"owner@nexus:~#"

:

"guest@nexus:~$"

}


&nbsp;


</span>








<input

ref={inputRef}

value={input}

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