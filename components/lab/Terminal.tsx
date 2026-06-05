"use client";

import { useState, useRef, useEffect } from "react";


type Props = {

unlock:(x:string)=>void;

};



export default function Terminal({unlock}:Props){


const [input,setInput]=useState("");

const [loading,setLoading]=useState(false);

const [root,setRoot]=useState(false);



const [history,setHistory]=useState<string[]>([

"Nexus Secure Shell v1.0",
"Connection established.",
"Type 'help' to begin."

]);




const bottomRef = useRef<HTMLDivElement>(null);

const inputRef = useRef<HTMLInputElement>(null);





useEffect(()=>{


bottomRef.current?.scrollIntoView({

behavior:"smooth"

});


inputRef.current?.focus();



},[history,loading]);









async function run(){



if(!input.trim() || loading){

return;

}



const cmd=input.trim();



setInput("");



setHistory(prev=>[

...prev,

`${root ? "root@nexus:~#" : "guest@nexus:~$"} ${cmd}`

]);




setLoading(true);





try{



const res = await fetch("/api/terminal",{


method:"POST",


headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

command:cmd

})


});





const data = await res.json();





setTimeout(()=>{



setHistory(prev=>[

...prev,

data.output

]);






if(data.unlock){



unlock(data.unlock);



if(data.unlock==="ROOT"){


setRoot(true);


setHistory(prev=>[

...prev,

"[+] Root shell activated"

]);


}



}




setLoading(false);




},400);





}catch(error){



setHistory(prev=>[

...prev,

"Connection error."

]);


setLoading(false);



}



}








function clearTerminal(){


setHistory([

"Nexus Secure Shell v1.0"

]);


}









return(


<div

onClick={()=>inputRef.current?.focus()}

className="

bg-black/90

border

border-green-500/40

rounded-xl

h-[420px]

overflow-y-auto

p-5

font-mono

text-sm

shadow-lg

shadow-green-500/10

"

>





{/* HEADER */}


<div className="

text-green-500

text-xs

mb-5

tracking-widest

">


● NEXUS TERMINAL


</div>








{/* HISTORY */}


<div className="

space-y-3

whitespace-pre-wrap

text-green-400

">



{history.map((item,index)=>(


<div key={index}>


{item}


</div>


))}





{loading && (


<div>

processing...

</div>


)}






{/* INPUT LINE */}


<div className="flex">


<span>


{root ? "root@nexus:~#" : "guest@nexus:~$"}


&nbsp;


</span>





<input


ref={inputRef}


value={input}


onChange={(e)=>setInput(e.target.value)}


onKeyDown={(e)=>{


if(e.key==="Enter"){


if(input.trim()==="clear"){


clearTerminal();


setInput("");


return;


}



run();



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