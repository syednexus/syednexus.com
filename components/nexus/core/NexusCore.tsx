"use client";


import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import { useNexusAI } from "@/hooks/useNexusAI";

import { useNexusVoice } from "@/hooks/useNexusVoice";







export default function NexusCore(){



const [open,setOpen]=useState(false);

const [input,setInput]=useState("");



const bottomRef =
useRef<HTMLDivElement|null>(null);




const {

messages,

ask

}=useNexusAI();




const {

start,

stop,

listening

}=useNexusVoice();







useEffect(()=>{


bottomRef.current?.scrollIntoView({

behavior:"smooth"

});


},[messages]);








function send(){



const text=input.trim();



if(!text){

return;

}



ask(text);


setInput("");



}








function voiceCommand(){



if(!listening){


start();


}


else{


stop((text)=>{


setInput(text);


ask(text);


});


}


}











return(

<>







{/* FLOATING AI BUTTON */}


<motion.button


whileHover={{

scale:1.1

}}


whileTap={{

scale:.9

}}


onClick={()=>setOpen(prev=>!prev)}



className="

fixed

bottom-8

right-8

z-9999


w-20

h-20


rounded-full


border

border-cyan-400


bg-black


shadow-xl

shadow-cyan-500/40


text-4xl


"

>


🧠


</motion.button>












{/* AI WINDOW */}


{


open && (





<motion.div


initial={{

opacity:0,

y:50

}}



animate={{

opacity:1,

y:0

}}



className="

fixed

right-8

bottom-32


z-9999


w-96

max-w-[90vw]


h-162.5

max-h-[75vh]


border

border-cyan-400/40


rounded-2xl


bg-black/90

backdrop-blur-xl


font-mono


flex

flex-col


overflow-hidden


shadow-xl

shadow-cyan-500/20


"

>









{/* HEADER */}


<div

className="

shrink-0


p-4


border-b

border-cyan-400/20


flex

justify-between

items-center


"

>



<p className="text-cyan-300 tracking-widest">


🧠 NEXUS AI CORE


</p>






<button


onClick={()=>setOpen(false)}


className="text-gray-400 hover:text-white"


>


✕


</button>




</div>









{/* STATUS */}



<div

className="

shrink-0

px-4

py-2


text-xs


border-b

border-cyan-400/10


"

>


{


listening


?


<span className="text-purple-300">


🎧 Listening...


</span>


:


<span className="text-green-400">


● ONLINE


</span>


}


</div>









{/* CHAT AREA */}



<div

className="


flex-1


overflow-y-auto


p-4


space-y-4


"

>





{


messages.map((msg,index)=>(



<div


key={index}



className={`

p-3


rounded-xl


text-sm


leading-relaxed


whitespace-pre-line


${

msg.role==="ai"

?

"bg-cyan-400/10 text-cyan-200"

:

"bg-purple-400/10 text-purple-200"

}


`}


>


{msg.text}



</div>


))

}





<div ref={bottomRef}/>



</div>









{/* INPUT */}



<div

className="

shrink-0


p-4


border-t

border-cyan-400/20


flex

gap-2


"

>




<input


value={input}


onChange={e=>setInput(e.target.value)}



onKeyDown={e=>{


if(e.key==="Enter"){

send();

}


}}



placeholder="Ask Nexus..."



className="


flex-1


bg-black


border

border-cyan-400/20


rounded


px-3


text-white


outline-none


"




/>








<button


onClick={send}



className="

core-btn


"

>


➤


</button>








<button


onClick={voiceCommand}


className="core-btn"


>



{


listening

?

"⏹"

:

"🎙"


}



</button>





</div>





</motion.div>



)


}








</>

);



}