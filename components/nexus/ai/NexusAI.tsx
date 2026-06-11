"use client";


import {

useEffect,
useRef,
useState

} from "react";


import { useNexus } from "@/context/NexusContext";





type Message={

role:"ai"|"user";

text:string;

};










export default function NexusAI(){







const [input,setInput]=useState("");



const [thinking,setThinking]=useState(false);








const [messages,setMessages]=useState<Message[]>([

{

role:"ai",

text:
"Welcome to Nexus AI. I can guide you through Syed's cybersecurity journey, healthcare background, projects and experience."

}

]);










const {

avatar,

visitor,

aiOpen,

setAiOpen,

aiPrompt,

setAiPrompt

}=useNexus();









const bottomRef =
useRef<HTMLDivElement|null>(null);









useEffect(()=>{


bottomRef.current?.scrollIntoView({

behavior:"smooth"

});


},[messages,thinking]);









useEffect(()=>{



if(aiPrompt){



sendMessage(aiPrompt);



setAiPrompt("");



}



},[aiPrompt]);









function generateResponse(

question:string

){





const q =
question.toLowerCase();




if(

q.includes("report") ||

q.includes("analysis")

){

return (

`Nexus Intelligence Report Generated.

Visitor profile: ${visitor.toUpperCase()}
Active system: ${avatar.toUpperCase()}

Summary:
Syed has a multidisciplinary profile combining cybersecurity, healthcare knowledge, operational leadership and technical projects.

Recommended sections:
• Sentinel → Experience, certifications and cyber skills
• Nexus Lab → Hands-on projects and security learning
• MedCore → Pharmacy background and healthcare security focus`

);

}









if(

q.includes("contact") ||

q.includes("connection")

){

return (

`Contact module initialized.

You can connect with Syed regarding:
• Cybersecurity opportunities
• SOC Analyst pathways
• Healthcare cybersecurity
• Technical collaborations

Resume download is available through Nexus Core.`

);

}









if(

q.includes("career analysis")

){

return (

`Career analysis complete.

Syed's profile aligns with entry-level cybersecurity roles requiring:

• Security fundamentals
• Networking knowledge
• Vulnerability assessment exposure
• Documentation skills
• Operational experience

Recommended pathway:
SOC Analyst → Security Analyst → Security Engineer`

);

}



if(

q.includes("soc") ||

q.includes("security") ||

q.includes("cyber")

){



return (

"Security analysis complete: Syed combines cybersecurity studies, networking fundamentals, vulnerability assessment practice, security labs and operational leadership experience. Recommended areas include SOC operations, security analysis and governance."

);



}










if(

q.includes("pharmacy") ||

q.includes("health") ||

q.includes("medical")

){



return (

"MedCore analysis complete: Syed's pharmacy foundation provides healthcare domain knowledge that connects strongly with healthcare cybersecurity, privacy, compliance and risk management."

);



}











if(

q.includes("project") ||

q.includes("portfolio") ||

q.includes("lab")

){



return (

"Nexus Lab contains Syed's cybersecurity projects, technical experiments, vulnerability research, security documentation and continuous learning progression."

);



}









if(

q.includes("hire") ||

q.includes("recruit") ||

q.includes("job") ||

q.includes("career")

){



return (

"Recruiter analysis: Sentinel mode contains Syed's career timeline, certifications, projects, cybersecurity capability matrix and professional growth pathway."

);



}









return (

`Currently operating in ${avatar.toUpperCase()} mode. I can analyse Syed's skills, education, projects, experience, certifications and career transition.`

);



}












function sendMessage(

text?:string

){





const question =
text || input;





if(!question.trim()){


return;


}








setMessages(prev=>[

...prev,

{

role:"user",

text:question

}

]);








setInput("");



setThinking(true);









setTimeout(()=>{





setMessages(prev=>[

...prev,

{

role:"ai",

text:generateResponse(question)

}

]);







setThinking(false);




},700);





}












const suggestions=[


"Is Syed ready for SOC Analyst?",


"Explain healthcare background",


"Show cybersecurity projects"


];













return(

<div className="

fixed

right-6

bottom-6

z-50

font-mono

">











{aiOpen && (

<div className="

mb-4

w-96

h-130

border

border-blue-400/40

rounded-2xl

bg-[#020617]/95

backdrop-blur-xl

p-5

shadow-2xl

shadow-blue-500/30

flex

flex-col

">










<div>


<p className="

text-blue-300

tracking-widest

text-sm

">

🤖 NEXUS AI ONLINE

</p>






<p className="

text-xs

text-gray-400

mt-1

">

Visitor: {visitor.toUpperCase()} |
System: {avatar.toUpperCase()}

</p>


</div>









<div className="

flex-1

overflow-y-auto

mt-5

space-y-3

pr-2

">








{messages.map((msg,index)=>(




<div

key={index}

className={

msg.role==="ai"

?

"border border-blue-400/20 bg-blue-400/10 rounded-xl p-3 text-sm text-blue-100"

:

"border border-green-400/20 bg-green-400/10 rounded-xl p-3 text-sm text-green-100"

}

>


{msg.text}



</div>




))}








{thinking && (

<div className="

text-blue-300

animate-pulse

text-sm

">

Analyzing Nexus data...

</div>

)}







<div ref={bottomRef}/>




</div>









<div className="

flex

flex-wrap

gap-2

mt-3

">






{suggestions.map(item=>(



<button


key={item}


onClick={()=>sendMessage(item)}


className="

text-xs

border

border-blue-400/30

rounded-full

px-3

py-1

text-blue-300

"

>


{item}


</button>




))}








</div>










<div className="

flex

gap-2

mt-4

">







<input

value={input}


onChange={e=>setInput(e.target.value)}



onKeyDown={e=>{


if(e.key==="Enter"){


sendMessage();


}


}}


placeholder="Ask Nexus AI..."


className="

flex-1

bg-black

border

border-blue-400/30

rounded-xl

px-3

py-2

text-white

text-sm

"

/>







<button


onClick={()=>sendMessage()}


className="

border

border-blue-400

rounded-xl

px-4

text-blue-300

"

>

➤

</button>






</div>






</div>


)}









<button


onClick={()=>setAiOpen(!aiOpen)}


className="

border

border-blue-400

rounded-full

w-16

h-16

bg-[#020617]

shadow-lg

shadow-blue-500/30

text-2xl

hover:scale-110

transition

"

>

🤖


</button>








</div>


);



}