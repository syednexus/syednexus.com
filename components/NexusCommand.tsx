"use client";


import { useEffect,useState } from "react";

import { motion } from "framer-motion";

import { useNexus } from "@/context/NexusContext";

import { useNexusSearch } from "@/hooks/useNexusSearch";






export default function NexusCommand(){






const {

changeSystem

}=useNexus();






const [open,setOpen]=useState(false);

const [command,setCommand]=useState("");






const {

setQuery,

results

}=useNexusSearch();









useEffect(()=>{






function shortcut(e:KeyboardEvent){






if(

e.ctrlKey &&

e.key.toLowerCase()==="k"

){

e.preventDefault();

setOpen(x=>!x);

}







if(

e.key==="Escape"

){

setOpen(false);

}







}








window.addEventListener(

"keydown",

shortcut

);







return()=>{

window.removeEventListener(

"keydown",

shortcut

);

};







},[]);










useEffect(()=>{


setQuery(command);


},[command,setQuery]);











function execute(value:string){






const cmd =

value.toLowerCase().trim();









if(

cmd==="gateway"

||

cmd==="home"

){

changeSystem("gateway");

}







else if(

cmd==="sentinel"

||

cmd==="defender"

){

changeSystem("defender");

}








else if(

cmd==="lab"

||

cmd==="nexus lab"

){

changeSystem("lab");

}








else if(

cmd==="medcore"

||

cmd==="medical"

){

changeSystem("medcore");

}








else if(

cmd==="blogs"

||

cmd==="blog"

){

changeSystem("blogs");

}








else{

return;

}










setCommand("");

setOpen(false);







}









if(!open){

return null;

}










return(

<motion.div


initial={{opacity:0}}

animate={{opacity:1}}


className="

fixed

inset-0

z-999

bg-black/80

backdrop-blur

flex

justify-center

pt-32

font-mono

"

>







<div className="

w-full

max-w-2xl

h-fit

border

border-cyan-400/40

rounded-2xl

bg-black

p-6

shadow-xl

shadow-cyan-500/20

"

>








<p className="

text-cyan-300

tracking-widest

text-sm

">

⌘ NEXUS COMMAND CENTER

</p>









<input


autoFocus

value={command}

onChange={e=>

setCommand(e.target.value)

}


onKeyDown={e=>{


if(e.key==="Enter"){

execute(command);

}


}}


placeholder="Type: lab, defender, medcore, blogs..."


className="

w-full

mt-5

bg-transparent

outline-none

text-2xl

text-white

border-b

border-cyan-400/20

pb-3

"

/>










<div className="

mt-6

grid

gap-3

"

>








<button

onClick={()=>execute("gateway")}

className="text-left nexus-hover"

>

🌌 Gateway

</button>








<button

onClick={()=>execute("defender")}

className="text-left nexus-hover"

>

🛡 Sentinel

</button>








<button

onClick={()=>execute("lab")}

className="text-left nexus-hover"

>

⚔ Nexus Lab

</button>








<button

onClick={()=>execute("medcore")}

className="text-left nexus-hover"

>

🧬 MedCore

</button>








<button

onClick={()=>execute("blogs")}

className="text-left nexus-hover"

>

📚 Blogs

</button>

{results.map((item,index)=>(



<button


key={index}


onClick={()=>{


const type = item.type.toLowerCase();





if(

type.includes("blog")

){

changeSystem("blogs");

}





else if(

type.includes("education")

||

type.includes("health")

||

type.includes("pharmacy")

){

changeSystem("medcore");

}





else{

changeSystem("defender");

}






setCommand("");

setOpen(false);





}}


className="

w-full

text-left

border

border-cyan-400/20

rounded-xl

p-3

bg-cyan-400/5

hover:bg-cyan-400/10

transition

"

>






<div>

{item.icon} {item.title}

</div>








<p className="

text-xs

text-gray-500

mt-1

"

>

{item.type}

</p>







</button>



))}












</div>








</div>







</motion.div>

);



}